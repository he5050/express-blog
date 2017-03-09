var fs = require('fs');
var path1 = require('path');
var sha1 = require('sha1');

var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

console.log('加载了 注册模块');
console.log('signup get');
// GET /signup 注册页
router.get('/',checkNotLogin ,function(req, res, next) {
	console.log('进入注册页面');
	//res.send('进入注册页面')
  res.render('signup');
});
// POST /signup 用户注册
console.log('signup post');
router.post('/', checkNotLogin, function(req, res, next) {
	console.log('正在进行注册');
	console.log('提取字段');
	var name = req.fields.name;
	var gender = req.fields.gender;
	var bio = req.fields.bio;
	//console.log(path1.sep);
	var avatar = req.files.avatar.path.split(path1.sep).pop();
	//var avatar = req.files.avatar.path;
	//console.log(avatar);
	//return false;
	//'foo\\bar\\baz'.split(path.sep) 得到 ['foo', 'bar', 'baz'] 在使用pop方法得到最后一个
	var password = req.fields.password;
	var repassword = req.fields.repassword;
	console.log('校验字段');
	//验证
	try{
		if(!(name.length >= 1 && name.length <=10)){
			throw new Error('用户名必须限制在1-10个字符');
		}
		if(['m','f','x'].indexOf(gender) === -1){
			throw new Error('性别只能是 男、女、保密');
		}
		if(!(bio.length >=1 && bio.length <= 30)){
			throw new Error('个人简介只能限制在1-30个字符')
		}
		if(!req.files.avatar.name){
			throw new Error('请上头像');
		}
		if(password.length <=6){
			throw new Error('密码至少6个字符');
		}
		if(password !== repassword){
			throw new Error('两次输入密码不一致');
		}
	}catch(e){
		console.log('校验字段失败');
		//注册失败
		fs.unlink(req.files.avatar.path);//删除已上传的头像
		req.flash('error',e.message);//显示错误信息
		return res.redirect('./signup');//跳转到注册页面
	}
	
	//验证通过
	//对密码进行加密操作
	password = sha1(password);
	
	//组建用户信息
	var user = {
		name : name,
		password : password,
		gender : gender,
		bio : bio,
		avatar : avatar
	};
	//把用户信息写入数据库
	UserModel.create(user)
		.then(function(result){
			console.log('成功写入数据库');
			//返回user 写入mongodb后的值,包含 _id
			user = result.ops[0];
			//把用户信息写入到seesion当中,不过要先删除密码才行
			delete user.password;
			req.session.user = user;
			//写入到flash 通知信息
			req.flash('success','恭喜您注册成功');
			res.redirect('/posts');//进入主页
		})
		.catch(function(e){
			//写入数据库失败
			fs.unlink(req.files.avatar.path);
			//判断是否是应为用户名重复
			if(e.message.match('E11000 duplicate key')){
				req.flash('error','用户名不可用');
				return res.redirect('./signup');
			}
			next(e);
		});
  //res.send(req.flash());
});
console.log('signup 结束');
module.exports = router;