var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

//router.get('/', function(req, res) {
//res.send('hello, express');
//});
//
//router.get('/users/:name', function(req, res) {
//res.send('hello, ' + req.params.name);
//});

module.exports = router;
