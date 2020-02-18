var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', success: req.session.success, errors: req.session.errors });
  if(req.session.success !== true){
    req.session.errors = null;
    req.session.success = null;
  }
});

router.get('/logout', function(req, res, next){
	req.session.success = false;
	res.redirect('/');
});

router.get('/test/:param1/:param2', function(req, res, next){
	res.render('test', {output1: req.params.param1, output2: req.params.param2});
});

router.post('/submit', function(req, res, next){
	//validation
	req.check('id', 'No ID entered').isLength({min: 1}); //this checks the 'id' named parameter
	req.check('password', 'No password entered').isLength({min: 1});
	var errors = req.validationErrors();
	if (errors){
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/');
	}
	else{
		//verification
		var id = req.body.id;
		var password = req.body.password;
		var sql = "SELECT * from admin_login where `id`='"+id+"' and `password`='"+password+"'";
		db.query(sql, function(err, results){
			if(results.length){
				req.session.id = results[0].id;
				req.session.success = true;
				res.redirect('/');
			}
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
