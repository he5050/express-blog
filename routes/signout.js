var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

console.log('加载了登出');
// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
  //清空session中的用户信息
  req.session.user = null;
  //弹出消息
  req.flash('success','成功登出');
  //跳转到到主页
  res.redirect('/posts');
});

module.exports = router;