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
			var sql = "SELECT * from admin_login where `admin_id`='"+id+"' and `password`='"+password+"'";
			await db.query(sql, function(err, results){
				//correct userid and password
				if(results.length){
					req.session.userid = results[0].admin_id;
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
		var sql = "SELECT * from `admin` where `email`='"+email+"'";
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
				   		console.log(err);
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
					    		console.log(err);
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
			console.log(err);
		}
		console.log(result);
	});

	//verify the token with the token in database and see if it is within expiration period and used=0 for it i.e. this token has not been used before
	sql = "SELECT * from `reset_password_tokens` WHERE email='"+req.query.email+"' and token='"+req.query.token+"' and used=0 and expiration>=NOW();";
	await db.query(sql, function (err, result, fields) {
		if (err){
			console.log(err);
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
			console.log(err);
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
						console.log(err);
						res.redirect('signin');
					}
					else{
						sql = "update admin_login inner join admin on admin.admin_id = admin_login.admin_id set admin_login.password = '"+req.body.pass+"' where admin.email = '"+req.body.email_id+"';"
						//sql = "UPDATE `admin_login` SET password='"+req.body.pass+"' WHERE email='"+req.body.email_id+"'";
						await db.query(sql, function (err, result, fields) {
							if (err){
								console.log(err);
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

//admin wants to add new student
router.get('/add_student_redirect', isAuthenticated, async function(req, res, next) {
	res.render('add_student', {errors: req.session.errors});
	req.session.errors = null;
});

router.post('/add_student_submit', isAuthenticated, async function(req, res, next) {
	req.check('student_id', 'No ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('student_name', 'No name entered').isLength({min: 1});
	req.check('student_email', 'No email entered').isLength({min: 1});
	var errors = req.validationErrors();     //catches all the validation errors
	//if errors exist then not validated. hence, sent back to add student page
	if (errors){
		req.session.errors = errors;
		res.redirect('add_student_redirect');
	}
	else{
		//add the student in the database
		sql = "INSERT INTO `student`(`student_id`, `name`, `email`) VALUES ('"+req.body.student_id+"','"+req.body.student_name+"','"+req.body.student_email+"')";
		await db.query(sql, async function (err, result, fields) {
			if (err){
				//writes error to the consle
				console.log(err);
				errors = [];
				//the errors are from database side like repeat of primary or unique key/error in connection, etc
				errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
				req.session.errors = errors;
				res.redirect('add_student_redirect');
			}
			else{
				errors = [];
				//not error, rather its a message to be displayed
				errors.push({msg: "Successfully entered"});
				req.session.errors = errors;
				res.redirect("add_student_redirect");
			}
		});
	}
});


//admin wants to add new instructor
router.get('/add_instructor_redirect', isAuthenticated, async function(req, res, next) {
	res.render('add_instructor', {errors: req.session.errors});
	req.session.errors = null;
});

router.post('/add_instructor_submit', isAuthenticated, async function(req, res, next) {
	req.check('instructor_id', 'No ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('instructor_name', 'No name entered').isLength({min: 1});
	req.check('instructor_email', 'No email entered').isLength({min: 1});
	var errors = req.validationErrors();     //catches all the validation errors
	//if errors exist then not validated. hence, sent back to add instructor page
	if (errors){
		req.session.errors = errors;
		res.redirect('add_instructor_redirect');
	}
	else{
		//add the instructor in the database
		sql = "INSERT INTO `instructor`(`instructor_id`, `name`, `email`) VALUES ('"+req.body.instructor_id+"','"+req.body.instructor_name+"','"+req.body.instructor_email+"')";
		await db.query(sql, async function (err, result, fields) {
			if (err){
				//writes error to the consle
				console.log(err);
				errors = [];
				//the errors are from database side like repeat of primary or unique key/error in connection, etc
				errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
				req.session.errors = errors;
				res.redirect('add_instructor_redirect');
			}
			else{
				errors = [];
				//not error, rather its a message to be displayed
				errors.push({msg: "Successfully entered"});
				req.session.errors = errors;
				res.redirect("add_instructor_redirect");
			}
		});
	}
});


//admin wants to add new ta
router.get('/add_ta_redirect', isAuthenticated, async function(req, res, next) {
	res.render('add_ta', {errors: req.session.errors});
	req.session.errors = null;
});

router.post('/add_ta_submit', isAuthenticated, async function(req, res, next) {
	req.check('ta_id', 'No ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('ta_email', 'No email entered').isLength({min: 1});
	var errors = req.validationErrors();     //catches all the validation errors
	//if errors exist then not validated. hence, sent back to add ta page
	if (errors){
		req.session.errors = errors;
		res.redirect('add_ta_redirect');
	}
	else{
		//if student id has been entered
		if(req.body.student_id){
			//check whether student exists
			sql = "SELECT * from student where student_id='"+req.body.student_id+"';";
			await db.query(sql, async function (err, result, fields) {
				if (err){
					//writes error to the consle
					console.log(err);
					errors = [];
					//the errors are from database side like repeat of primary or unique key/error in connection, etc
					errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
					req.session.errors = errors;
					res.redirect('add_ta_redirect');
				}
				else{
					errors = [];
					//student exists or not
					if(result.length==0){
						errors.push({msg: "No such student_id exist"});	
						req.session.errors = errors;
						res.redirect("add_ta_redirect");
					}
					else{
						//check if email id of student and given email id of ta match
						if(result[0].email==req.body.ta_email){
							//add the ta in the database
							sql = "INSERT INTO `ta_record`(`ta_id`, `student_id`, `email`) VALUES ('"+req.body.ta_id+"','"+req.body.student_id+"','"+req.body.ta_email+"')";
							await db.query(sql, async function (err, result, fields) {
								if (err){
									//writes error to the consle
									console.log(err);
									errors = [];
									//the errors are from database side like repeat of primary or unique key/error in connection, etc
									errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
									req.session.errors = errors;
									res.redirect('add_ta_redirect');
								}
								else{
									errors = [];
									//not error, rather its a message to be displayed
									errors.push({msg: "Successfully entered"});
									req.session.errors = errors;
									res.redirect("add_ta_redirect");
								}
							});
						}
						else{
							errors.push({msg: "The email from student record of this student_id doesn't match with given email"})							
							req.session.errors = errors;
							res.redirect("add_ta_redirect");
						}
					}
				}
			});
		}
		else{
			//add the ta in the database
			sql = "INSERT INTO `ta_record`(`ta_id`, `email`) VALUES ('"+req.body.ta_id+"','"+req.body.ta_email+"')";
			await db.query(sql, async function (err, result, fields) {
				if (err){
					//writes error to the consle
					console.log(err);
					errors = [];
					//the errors are from database side like repeat of primary or unique key/error in connection, etc
					errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
					req.session.errors = errors;
					res.redirect('add_ta_redirect');
				}
				else{
					errors = [];
					//not error, rather its a message to be displayed
					errors.push({msg: "Successfully entered"});
					req.session.errors = errors;
					res.redirect("add_ta_redirect");
				}
			});
		}
	}
});


//admin wants to add new course
router.get('/add_course_redirect', isAuthenticated, async function(req, res, next) {
	res.render('add_course', {errors: req.session.errors});
	req.session.errors = null;
});

router.post('/add_course_submit', isAuthenticated, async function(req, res, next) {
	req.check('course_id', 'No ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('course_name', 'No name entered').isLength({min: 1});
	var errors = req.validationErrors();     //catches all the validation errors
	//if errors exist then not validated. hence, sent back to add course page
	if (errors){
		req.session.errors = errors;
		res.redirect('add_course_redirect');
	}
	else{
		//add the course in the database
		sql = "INSERT INTO `course`(`course_id`, `course_name`) VALUES ('"+req.body.course_id+"','"+req.body.course_name+"')";
		await db.query(sql, async function (err, result, fields) {
			if (err){
				//writes error to the consle
				console.log(err);
				errors = [];
				//the errors are from database side like repeat of primary or unique key/error in connection, etc
				errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
				req.session.errors = errors;
				res.redirect('add_course_redirect');
			}
			else{
				errors = [];
				//not error, rather its a message to be displayed
				errors.push({msg: "Successfully entered"});
				req.session.errors = errors;
				res.redirect("add_course_redirect");
			}
		});
	}
});


//admin wants to add new class
router.get('/add_class_redirect', isAuthenticated, async function(req, res, next) {
	res.render('add_class', {errors: req.session.errors});
	req.session.errors = null;
});

router.post('/add_class_submit', isAuthenticated, async function(req, res, next) {
	req.check('class_id', 'No class ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('course_id', 'No course ID entered').isLength({min: 1});
	req.check('semester', 'No semester entered').isLength({min: 1});
	req.check('year', 'No year entered').isLength({min: 1});
	var errors = req.validationErrors();     //catches all the validation errors
	//if errors exist then not validated. hence, sent back to add class page
	if (errors){
		req.session.errors = errors;
		res.redirect('add_class_redirect');
	}
	else if (req.body.semester!='1' && req.body.semester!='2'){
		errors = [];
		errors.push({msg: "semester can be only 1 or 2"});
		req.session.errors = errors;
		res.redirect('add_class_redirect');
	}
	else{
		//add the class in the database
		sql = "INSERT INTO `class_info`(`class_info_id`, `course_id`, `semester`,`year`) VALUES ('"+req.body.class_id+"','"+req.body.course_id+"','"+req.body.semester+"','"+req.body.year+"')";
		await db.query(sql, async function (err, result, fields) {
			if (err){
				//writes error to the consle
				console.log(err);
				errors = [];
				//the errors are from database side like repeat of primary or unique key/error in connection, etc
				errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
				req.session.errors = errors;
				res.redirect('add_class_redirect');
			}
			else{
				errors = [];
				//not error, rather its a message to be displayed
				errors.push({msg: "Successfully entered"});
				req.session.errors = errors;
				res.redirect("add_class_redirect");
			}
		});
	}
});


//admin wants to add student to class
router.get('/add_class_student_redirect', isAuthenticated, async function(req, res, next) {
	res.render('add_class_student', {errors: req.session.errors});
	req.session.errors = null;
});

router.post('/add_class_student_submit', isAuthenticated, async function(req, res, next) {
	req.check('class_id', 'No class ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('student_id', 'No student ID entered').isLength({min: 1});
	var errors = req.validationErrors();     //catches all the validation errors
	//if errors exist then not validated. hence, sent back to add class page
	if (errors){
		req.session.errors = errors;
		res.redirect('add_class_student_redirect');
	}
	else{
		//add the student to class in the database
		sql = "INSERT INTO `enrollment_record`(`class_info_id`, `student_id`) VALUES ('"+req.body.class_id+"','"+req.body.student_id+"')";
		await db.query(sql, async function (err, result, fields) {
			if (err){
				//writes error to the consle
				console.log(err);
				errors = [];
				//the errors are from database side like repeat of primary or unique key/error in connection, etc
				errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
				req.session.errors = errors;
				res.redirect('add_class_student_redirect');
			}
			else{
				errors = [];
				//not error, rather its a message to be displayed
				errors.push({msg: "Successfully entered"});
				req.session.errors = errors;
				res.redirect("add_class_student_redirect");
			}
		});
	}
});


//admin wants to add ta to class
router.get('/add_class_ta_redirect', isAuthenticated, async function(req, res, next) {
	res.render('add_class_ta', {errors: req.session.errors});
	req.session.errors = null;
});

router.post('/add_class_ta_submit', isAuthenticated, async function(req, res, next) {
	req.check('class_id', 'No class ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('ta_id', 'No ta ID entered').isLength({min: 1});
	var errors = req.validationErrors();     //catches all the validation errors
	//if errors exist then not validated. hence, sent back to add class page
	if (errors){
		req.session.errors = errors;
		res.redirect('add_class_ta_redirect');
	}
	else{
		//add the ta to class in the database
		sql = "INSERT INTO `class_ta`(`class_info_id`, `ta_id`) VALUES ('"+req.body.class_id+"','"+req.body.ta_id+"')";
		await db.query(sql, async function (err, result, fields) {
			if (err){
				//writes error to the consle
				console.log(err);
				errors = [];
				//the errors are from database side like repeat of primary or unique key/error in connection, etc
				errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
				req.session.errors = errors;
				res.redirect('add_class_ta_redirect');
			}
			else{
				errors = [];
				//not error, rather its a message to be displayed
				errors.push({msg: "Successfully entered"});
				req.session.errors = errors;
				res.redirect("add_class_ta_redirect");
			}
		});
	}
});


//admin wants to add instructor to class
router.get('/add_class_instructor_redirect', isAuthenticated, async function(req, res, next) {
	res.render('add_class_instructor', {errors: req.session.errors});
	req.session.errors = null;
});

router.post('/add_class_instructor_submit', isAuthenticated, async function(req, res, next) {
	req.check('class_id', 'No class ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('instructor_id', 'No instructor ID entered').isLength({min: 1});
	var errors = req.validationErrors();     //catches all the validation errors
	//if errors exist then not validated. hence, sent back to add class page
	if (errors){
		req.session.errors = errors;
		res.redirect('add_class_instructor_redirect');
	}
	else{
		//add the instructor to class in the database
		sql = "INSERT INTO `class_instructor`(`class_info_id`, `instructor_id`) VALUES ('"+req.body.class_id+"','"+req.body.instructor_id+"')";
		await db.query(sql, async function (err, result, fields) {
			if (err){
				//writes error to the consle
				console.log(err);
				errors = [];
				//the errors are from database side like repeat of primary or unique key/error in connection, etc
				errors.push({msg: "Could not enter in database, error occured: "+err.sqlMessage});
				req.session.errors = errors;
				res.redirect('add_class_instructor_redirect');
			}
			else{
				errors = [];
				//not error, rather its a message to be displayed
				errors.push({msg: "Successfully entered"});
				req.session.errors = errors;
				res.redirect("add_class_instructor_redirect");
			}
		});
	}
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
