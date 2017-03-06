var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//添加的
var config = require('config-lite');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var winston = require('winston');
var expressWinston = require('express-winston');
var pkg = require('./package');

//引入路由文件
//var index = require('./routes/index');
//var users = require('./routes/users');
//多个路由
var routes = require('./routes');

var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
//session
app.use(session({
	name : config.session.key,//设置cookie中保存session id字段名
	secret : config.session.secret, //通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	resave: true,// 强制更新 session
	saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
	cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}));
//falsh中间件,用来显示通知
app.use(flash());
//处理表单及文件上传的中间件
app.use(require('express-formidable')({
	uploadDir : path.join(__dirname,'public/imgages'),//上传文件目录
	keepExtensions : true //是否保留后缀
}));
//设置模板的全局常量从package读取
app.locals.blog = {
	title : pkg.name,
	description : pkg.descript
};
//添加模板必须的三个变量
app.use(function(req,res,next){
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});
routes(app);
//正常请求的的日志
app.use(expressWinston.logger({
	transports:[
		new (winston.transports.Console)({
			json:true,
			colorize:true
		}),
		new winston.transports.File({
			filename : './logs/success.log'
		})
	]
}));
//错误日志
app.use(expressWinston.errorLogger({
	transports:[
		new winston.transports.Console({
			json:true,
			colorize:true 
		}),
		new winston.transports.File({
			filename:'./logs/error.log'
		})
	]
}));
//路由
//app.use('/', index);
//app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
