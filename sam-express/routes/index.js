var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', success: req.session.success, errors: req.session.errors });
  //if session is success means already logged in
  //else reset errors and success
  if(req.session.success !== true){
    req.session.errors = null;
    req.session.success = null;
  }
});

router.get('/logout', function(req, res, next){
	//to logout reset success value and redirect to home page
	req.session.success = false;
	res.redirect('/');
});


router.post('/submit', function(req, res, next){
	//validation
	req.check('id', 'No ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('password', 'No password entered').isLength({min: 1});
	var errors = req.validationErrors();
	//if errors exist then not validated. hence, sent back to login page
	if (errors){
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/');
	}
	else{
		//verification after validation
		var id = req.body.id;
		var password = req.body.password;
		var sql = "SELECT * from admin_login where `id`='"+id+"' and `password`='"+password+"'";
		db.query(sql, function(err, results){
			//correct userid and password
			if(results.length){
				req.session.id = results[0].id;
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
				res.redirect('/');
			}
		})
	}
});

module.exports = router;
