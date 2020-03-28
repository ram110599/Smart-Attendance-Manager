var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: 'we.at.fsociety@gmail.com',
		pass: 'wearefsociety'
	}
});


/* GET home page. */
//isAuthenticated is a function created to check whether logged in or not
router.get('/', isAuthenticated, function(req, res, next) {
	//render the page if logged in
	res.render('index', {title: 'Express', id: req.session.userid})
});


router.get('/logout', isAuthenticated, function(req, res, next){
	//to logout reset success value and redirect to home page
	req.session.success = false;
	req.session.destroy();
	res.redirect('signin');
});


router.get('/signin', function(req, res, next){
	if (req.session.success){
		res.redirect('/');
	}
	else{
		res.render('signin', {errors: req.session.errors});
		req.session.errors = null;
	}
});


//when signin request is submitted
router.post('/submit', async function(req, res, next){
	if(req.session.success){
		res.redirect('/');
	}
	else{
		//validation
		req.check('id', 'No ID entered').isLength({min: 1}); //this checks the 'id' named parameter
		req.check('password', 'No password entered').isLength({min: 1});
		var errors = req.validationErrors();
		//if errors exist then not validated. hence, sent back to login page
		if (errors){
			req.session.errors = errors;
			req.session.success = false;
			res.redirect('signin');
		}
		else{
			//verification after validation
			var id = req.body.id;
			var password = req.body.password;
			var sql = "SELECT * from admin_login where `id`='"+id+"' and `password`='"+password+"'";
			await db.query(sql, function(err, results){
				//correct userid and password
				if(results.length){
					req.session.userid = results[0].id;
					req.session.success = true;
					res.redirect('/');
				}
				//incorrect userid or password
				else{
					req.session.success = false;
					var error = {param: "id", msg: "Invalid user id or password", value: req.body.id};
					if(!errors){
						errors = [];
					}
					errors.push(error);
					req.session.errors = errors
					res.redirect('signin');
				}
			});
		}
	}
});


router.get('/forgot-password', function(req, res, next) {
	res.render('forgot-password', {errors: req.session.errors });
	req.session.errors = null;
});


router.post('/forgot-password-submit', async function(req, res, next) {
	req.check('email_id', 'No email entered').isLength({min: 1}); //this checks the 'email_id' named parameter
	var errors = req.validationErrors();
	if(errors){
		req.session.errors = errors;
		res.redirect('forgot-password');
	}
	else{
		//ensure that you have a user with this email
		var email = req.body.email_id;
		var sql = "SELECT * from `admin_login` where `email`='"+email+"'";
		var resLen = 0;
		await db.query(sql, async function(err, results){
			resLen = results.length;
			if(results.length==0){
					/**
			   * we don't want to tell attackers that an
			   * email doesn't exist, because that will let
			   * them use this form to find ones that do
			   * exist.
			   **/
			   console.log(email);
			   res.redirect('signin');
			}
			else{
				console.log(email);
				//if email exists:
				/**
				* Expire any tokens that were previously
				* set for this user. That prevents old tokens
				* from being used.
				**/
				sql = "UPDATE `reset_password_tokens` SET used=1 where email='"+email+"'";
				await db.query(sql, async function (err, result, fields) {
				   	if (err){
				   		throw err;
				   		res.redirect('signin');
				   	}
				   	else{
				   		console.log(result);
				   		//Create a random reset token
					    var token = crypto.randomBytes(64).toString('base64');

					    //token expires after one hour
					    var expireDate = new Date();
					    expireDate.setTime(expireDate.getTime() + (1*60*60*1000));
					    expiry = String(expireDate.getFullYear())+"-"+String(expireDate.getMonth()+1)+"-"+String(expireDate.getDate())+" "+String(expireDate.getHours()) + ":" + String(expireDate.getMinutes()) + ":" + String(expireDate.getSeconds())
					    //insert token data into DB
					    sql = "INSERT INTO `reset_password_tokens` VALUES ('"+email+"', '"+token+"', '"+expiry+"', 0);";
					    await db.query(sql, function (err, result, fields) {
					    	if (err){
					    		throw err;
					    		res.redirect('signin');
					    	}
					    	console.log(result);
					    });

						//create email
						const message = {
							from: process.env.SENDER_ADDRESS,
							to: email,
							replyTo: process.env.REPLYTO_ADDRESS,
							subject: process.env.FORGOT_PASS_SUBJECT_LINE,
							text: 'To reset your password, please click the link below.\n\nhttp://localhost:8000/reset-password?token='+encodeURIComponent(token)+'&email='+email
						};

						//send email
						transport.sendMail(message, function (err, info) {
							if(err) { console.log(err); console.log("hhhhh");}
							else { console.log(info); console.log("ttttt");}
						});

						//return res.json({status: 'ok'});
						res.redirect('/signin');
					}
				});

			}
		})  
	}
});


router.get('/reset-password', async function(req, res, next) {
	//delete expired tokens for all email ids: this should be done elsewhere
	var sql = "DELETE FROM `reset_password_tokens` WHERE expiration<=NOW()";
	await db.query(sql, function (err, result, fields) {
		if (err){
			throw err;
		}
		console.log(result);
	});

	//verify the token with the token in database and see if it is within expiration period and used=0 for it i.e. this token has not been used before
	sql = "SELECT * from `reset_password_tokens` WHERE email='"+req.query.email+"' and token='"+req.query.token+"' and used=0 and expiration>=NOW();";
	await db.query(sql, function (err, result, fields) {
		if (err){
			throw err;
			res.redirect('signin');
		}
		else{
			console.log(result);
			errors = [];
			//Token missing or expired or used already
			if(result.length==0){
				errors.push({msg: "Token missing or expired or used already, request to reset password again."});
				req.session.errors = errors;
				res.redirect('forgot-password');
			}
			//correct token
			else{
				//renders a page where new password can be given, passes token as argument bcz token needs to be verified
				//again at the time of resetting the password otherwise someone may meddle in between and make system insecure.
				res.render('reset-password-enter', {token: req.query.token, email: req.query.email});
			}
		}

	});

});


//new password has been entered
router.post('/reset-password', async function(req, res, next) {
	//check whether the email and token match to the ones in database
	var sql =  "SELECT * from `reset_password_tokens` WHERE email='"+req.body.email_id+"' and token='"+req.body.token+"' and used=0 and expiration>=NOW();";
	await db.query(sql, async function (err, result, fields) {
		if (err){
			throw err;
			res.redirect('signin');
		}
		else{
			if(result.length==0){
				errors = [];
				errors.push("Token missing or expired or used already, request to reset password again.");
				req.session.errors = errors;
				res.redirect('forgot-password');
			}
			else{
				//update token as used in database, can also delete this token
				//and then update the password
				sql = "UPDATE `reset_password_tokens` SET used=1 WHERE email='"+req.body.email_id+"' and token='"+req.body.token+"'";
				await db.query(sql, async function (err, result, fields) {
					if (err){
						throw err;
						res.redirect('signin');
					}
					else{
						sql = "UPDATE `admin_login` SET password='"+req.body.pass+"' WHERE email='"+req.body.email_id+"'";
						await db.query(sql, function (err, result, fields) {
							if (err){
								throw err;
								res.redirect('signin');
							}
							else{
								res.redirect('/signin');
							}
						});
					}
				});
			}
		}
	});

});


function isAuthenticated(req, res, next) {
	if (req.session.success)
		return next();

	// IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SIGNIN PAGE
	req.session.errors = null;
	req.session.success = null;
	res.redirect('/signin');
}


module.exports = router;
