//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//	res.render('index', { title: 'Express' });
//});
//
////router.get('/', function(req, res) {
////res.send('hello, express');
////});
////
////router.get('/users/:name', function(req, res) {
////res.send('hello, ' + req.params.name);
////});
//
//module.exports = router;

//自己重写
module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts');
  });
  app.use('/signup', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/posts', require('./posts'));

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404');
    }
  });
};