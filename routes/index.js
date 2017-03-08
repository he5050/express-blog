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

module.exports = function (app) {
  app.get('/', function (req, res) {
  	//res.render('signup');
    res.redirect('/posts');
    //res.send('这是主页');
  });
  //加载中间件
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