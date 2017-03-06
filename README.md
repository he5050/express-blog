# Express入门 
使用node  expres mongoDB搭建多人搏客(新手联系之作)
## 开发环境
- Node  `v6.10.0`
- Express `v4.14.1`
- MongoDB 
## 1. 安装Express并进行初始化
express 是 Node.js 上最流行的 Web 开发框架，正如他的名字一样，使用它我们可以快速的开发一个 Web 应用。我们用 express 来搭建我们的博客，打开命令行，输入：

`npm install express -g`

安装express-generator工具

`npm install -g express-generator`
1. 进入您要创建的的目录
> 我自己用的系统是 win7


  - 1.1 进入指定目录: `cd x:\demo`
  - 1.2 使用命令进行初始化项目 `express -e blog`
  - 1.3 进入我们创建的blog目录然后安装 `cd blog && npm install`
  
  初始化结果如下图:
  
  ![](http://i1.piimg.com/567571/564b1d4f7bf7d04b.png)
  - 1.4 然后启动服务 `SET DEBUG=blog:* &npm start`
  
  ![](http://p1.bqimg.com/567571/7ba53ae57d11863f.png)
  
  ![](http://p1.bqimg.com/567571/5144c0b5feb0264c.png)
  
  至此，我们用 express 初始化了一个工程项目完成。
  
***

## 2. 项目工程目录结构
- 打开blog文件夹，我们发现其结构如下:
   
  ![](http://i1.piimg.com/567571/b9b73cfc6c6ab2ed.png)
  
1. `app.js` 整个项目的启动文件，也就是入口文件
2. `package.json`  存储着工程的信息及模块依赖，当在 dependencies 中添加依赖的模块时，运行 npm install ，npm 会检查当前目录下的 package.json，并自动安装所有指定的模块
3. `node_modules`  存放 package.json 中安装的模块，当你在 package.json 添加依赖的模块并安装后，存放在这个文件夹下
4. `public` 存放整个项目的image、css 、js等文件
5. `routes` 存放路由的文件
6. `views`  存放视图文件或是模板文件
7. `bin`  存放可执行文件
- 我看一下app.js里面的东西

```
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

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
```

***

###### 我艹这是什么鬼我可不知道这些是啥意思，在看这段代码的时候我也同懵逼的状态，那我们来恶补一点node.js的知识
### 1. require 用来加载一个文件的代码，关于 require 的机制我也说不清，请您请仔细阅读[官方文档](http://nodejs.cn/api/)。
+ 1.1. require 是用于加载js,json,node等文件的
+ 1.2. require 在加载的过程是同步的
+ 1.3. require 目录的机制是:
   + 1.3.1 如果目录中存在package.json并指定了main字段,则使用
   + 1.3.2 如果不存package.json,则依次尝试加载目录下面的index.js 或是index.node
+ 1.4. require过的文件会加载到缓存中,所以多次require同一个文件(模块)是不会出重复加载的
+ 1.5. 判断是否是程序的入口文件有两种方式:
  + 1.5.1 require.main === module (推荐)
  + 1.5.2 require.parent === null
###### 关于多文件循环引用
循环引用（或循环依赖）简单点来说就是 a 文件 require 了 b 文件，然后 b 文件又反过来 require 了 a 文件。我们用 a->b 代表 b require 了 a。
如下所示:
```
a require(b)
b require(a)
```
这样的循环引用并不会报错，但导致的结果是 require 的结果是空对象 {}，原因是 a require 了 b，b 又去 require 了 a，此时 a 还没初始化好，所以只能拿到初始值 {}。当产生循环引用时一般有两种方法解决：
1. 通过分离共用的代码到另一个文件解决，如上面简单的情况，可拆出共用的代码到 c 中，如下:
```
c require(a)
c require(b)
```
2.不在最外面require,而是使用的地方require,一般常用在函数体里面
总的来说，循环依赖的并不大容易出现，但如果出现了，对于我这样的辣鸡来说还真不容易解决问题。它的存在给我们提了个醒，要时刻注意你项目的依赖关系不要过于复杂，哪天你发现一个你明明已经 exports 了的方法报 undefined is not a function，我们就该提醒一下自己：哦，也许是它来了。
[官方modules](http://nodejs.cn/api/modules.html)

***
### 2. require 用来加载代码，而 exports 和 module.exports 则用来导出代码(提供接口的功能)。
看到这我就迷糊了 exports 和 module.exports 都是提供接口这两个又有啥区别呢，为了更好的理解 exports 和 module.exports 的关系，我们先来巩固下 js 的基础。示例：
```
// test.js
var a = {name : 1};
var b = a;

console.log(a);
console.log(b);

b.name = 2;
console.log(a);
console.log(b);

var b = {name : 3};
console.log(a);
console.log(b);
```
运行test.js结果如下:
```
Object {name: 1}
Object {name: 1}
Object {name: 2}
Object {name: 2}
Object {name: 2}
Object {name: 3}
```

**解释**：a 是一个对象，b 是对 a 的引用，即 a 和 b 指向同一块内存，所以前两个输出一样。当对 b 作修改时，即 a 和 b 指向同一块内存地址的内容发生了改变，所以 a 也会体现出来，所以第三四个输出一样。当 b 被覆盖时，b 指向了一块新的内存，a 还是指向原来的内存，所以最后两个输出不一样。
弄明白以上所说的，那么我们只需要知道这几点内容就可以了解exprots与module.exprots的区别了
1. module.exports 默认的值是为一个空对象{}
2. exports 是指向的 module.exports 的引用
3. require() 返回的是 module.exports 而不是 exports
4. 多的我也解释不清除请查看官方文档[moduel](http://nodejs.cn/api/modules.html#modules_module_exports)
*所以我们可以这样理解*
```
exprots = module.exprots = {...}
module.exports = {...}
exprots = moduel.exports
```
原理很简单：module.exports 指向新的对象时，exports 断开了与 module.exports 的引用，那么通过 exports = module.exports 让 exports 重新指向 module.exports。
> 推荐有兴趣的同学可以看一下阮一峰老的 [ECMAScript6 入门](http://es6.ruanyifeng.com/)


***
### 3. Promise 用于异步流程控制，生成器与 yield 也能实现流程控制（基于 co）
###### 关于这一点本人也是一个新手，就不用多写了但是很重要，可以有效的解决回调问题
下面我自己写关于Promise的使用demo
不使用promise的代码
```
	<head>
		<meta charset="UTF-8">
		<title>Promise animation</title>
		<style type="text/css">
			.ball{
				width: 40px;
				height: 40px;
				border-radius: 20px;
			}
			.ball1{
				background-color: red;
			}
			.ball2{
				background-color: yellow;
			}
			.ball3{
				background-color: green;
			}
		</style>
	</head>
	<body>
		<div class="ball ball1" style="margin-left: 0;"></div>
		<div class="ball ball2" style="margin-left: 0;"></div>
		<div class="ball ball3" style="margin-left: 0;"></div>
		<script type="text/javascript">
			var ball1 = document.querySelector(".ball1");
			var ball2 = document.querySelector(".ball2");
			var ball3 = document.querySelector(".ball3");
			//动画函数
			/**
			 * 
			 * @param {球} ball
			 * @param {位置} distance
			 * @param {回调函数} cb
			 */
			function animate(ball,distance,cb){
				setTimeout(function(){
					var marginLeft = parseInt(ball.style.marginLeft,10)
					//说明球到指定的位置
					if(marginLeft === distance){
						cb && cb();
					}else{
						//在左侧
						if(marginLeft < distance){
							marginLeft++;
						}else{
							marginLeft--;
						}
						ball.style.marginLeft = marginLeft+"px";
						animate(ball,distance,cb);
					}
				},13);
			}
			animate(ball1,100,function(){
				animate(ball2,200,function(){
					animate(ball3,300,function(){
						animate(ball3,150,function(){
							animate(ball2,150,function(){
								animate(ball1,150,function(){
									
								});
							});
						});
					});
				});
			});
		</script>
```
使用promise
```
		<script type="text/javascript">
			var ball1 = document.querySelector(".ball1");
			var ball2 = document.querySelector(".ball2");
			var ball3 = document.querySelector(".ball3");
			var Promise = window.Promise;
			//动画函数
			/**
			 * 
			 * @param {球} ball
			 * @param {位置} distance
			 * @param {回调函数} cb
			 */
			function promiseAnimate(ball,distance){
				return new Promise(function(resolve,reject){
					function _animate(){
						setTimeout(function(){
							var marginLeft = parseInt(ball.style.marginLeft,10)
							//说明球到指定的位置
							if(marginLeft === distance){
								resolve();
							}else{
								//在左侧
								if(marginLeft < distance){
									marginLeft++;
								}else{
									marginLeft--;
								}
								ball.style.marginLeft = marginLeft+"px";
								//console.log(ball.style.marginLeft);
								_animate();
							}
						},13);
					}
					_animate();
				});
			}
			promiseAnimate(ball1,100).then(function(){
						return promiseAnimate(ball2,200)
				}).then(function(){
						return promiseAnimate(ball3,300)
				}).then(function(){
						return promiseAnimate(ball3,150)
				}).then(function(){
						return promiseAnimate(ball2,150)
				}).then(function(){
						return promiseAnimate(ball1,150)
				});
		</script>
```
> 今天2017-03-06,我们接着上面的来

这到这我们先来看看 上面写的两种方式用于实现如图所示的效果:

![](http://p1.bpimg.com/567571/dab602abd6819468.gif)

关于promise主要是用于解决回调的问题，本人能力有限也写不出个所以来所以请自行百度,或是可以查看这篇文章[Javascript 中的神器——Promise](http://www.jianshu.com/p/063f7e490e9a)

### 4. 主要一些内容都补充了，然后下面说一点比较不重要的
+ 4.1 关于package.json

`package.json` **对于 Node.js 应用来说是一个不可或缺的文件**，它存储了该 Node.js 应用的名字、版本、描述、作者、入口文件、脚本、版权等等信息

+ 4.2 npm init 与npm install/ npm i

使用 `npm init` 初始化一个空项目是一个好的习惯，即使你对 `package.json` 及其他属性非常熟悉，`npm init `也是你开始写新的 Node.js 应用或模块的一个快捷的办法。
`npm install` 可以安装 npm 上发布的某个版本、某个tag、某个版本区间的模块，甚至可以安装本地目录、压缩包和 git/github 的库作为依赖。

>  npm i 是 `npm install 的简写，建议使用 npm i。


直接使用 `npm i` 安装的模块是不会写入` package.json` 的 `dependencies` (或 `devDependencies`)，需要额外加个参数:

-  1.1 `npm i express --save/npm i express -S (安装 express，同时将 "express": "^4.14.0" 写入 dependencies )`
-  1.2 `npm i express --save-dev/npm i express -D (安装 express，同时将 "express": "^4.14.0" 写入 devDependencies )`
-  1.3 `npm i express --save --save-exact (安装 express，同时将 "express": "4.14.0" 写入 dependencies )`

+ 4.3 supervisor的使用

在开发过程中，每次修改代码保存后，我们都需要手动重启程序，才能查看改动的效果。使用 supervisor 可以解决这个繁琐的问题，全局安装 supervisor：

`npm install -g supervisor`

运行` supervisor --harmony index `启动程序,supervisor 会监听当前目录下 node 和 js 后缀的文件，当这些文件发生改动时，supervisor 会自动重启程序

***

## 5. 下面要开始进入正题了

我们要来分析一下app.js里面的内容,最少我们目录知道是能过require来引入相应的文件或是模块下面，我一行一行的分析是在干嘛的

> 前面这些行使用require就是引入js文件 加载了express、path 等模块,以及 routes 文件夹下的index. js和 users.js 路由文件


- 1.1 `var app = express() ` 用于生成一个express实例的app。
- 1.2 `app.set('views',path.join(_dirname,'views'))` 设置views文件夹为存放视图文件的目录，也就是我们mvc当中的v视图模板文件的存存位置,_dirname为全局变量，存放着当正在执行的脚本所在目录
- 1.3 `app.set('view engine','ejs')` 这里设置 视图模板引擎为 ejs。
- 1.4 `app.use('favicon(_dirname+'/public/favicon.ico')')` 使用/public/favicon.ico为favicon图标
- 1.5 `app.use(loger('dev'))` 加载日志中间组件
- 1.6 `app.use(bodyParser.json())` 加载解析json的中间组件
- 1.7 `app.use(bodyParser.urlencodeed({extended:false}))` 加载解析urlencodeed请求的中间件
- 1.8 `app.use(cookieParser())` 加载解析cookie的中间件
- 1.9 `app.use(experss.static(path.join(_dirname,'public')))` 设置public文件为存放静态文件的目录也就是js,css images的文件目录
- 1.10 `app.use('/'.,routes)`与 `app.use('/users',users)` 路由的控制器
- 1.11  捕获404错误，并转发到错误处理器。

```
app.use(function(req,res,next){
	var err = new Error('Not Found');
	err.stauts = 404;
	next(err);
})
```

- 1.12 开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。

```
if(app.get('env') === 'development'){
	app.use(function(err,req,res,next){
		res.status(err.status || 500);
		res.render('error',{
			message:err.message,
			error:err
		})
	});
}
```

- 1.13 生产环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。

```
app.use(function(err,req,res,next){
	res.status(err.status || 500);
	res.render('error',{
		message:err.message,
		error:{}
	});
})
```
- 1.14  `1.14 module.exprots = app` 用于导出app实例，供其他模块调用,

> 关于app.js里面文件的内容

我们接下来分析一下bin/www这个文件


```
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('blog:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
```

*** 

- 2.1 `#!/usr/bin/env node` 表明是node可执行文件
- 2.2 引入相应的模块与文件

```
var app = require('../app');
var debug = require('debug')('blog:server');
var http = require('http');
```

- 2.3  获取端口号如果没有设置 端口号则使用3000做为端口

```
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

```

- 2.4 `var server = http.createServer(app);`创建http服务
- 2.5 监听http服务 关打印相应的错误信息

```
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

```
> 成功启动服务后会打印出来


![](http://i1.piimg.com/567571/adb05ec2e62c570d.png)


> 关于bin/www里面文件的内容分析就到这了(能力有限,所以....)


接下我们在来看下routes/index.js文件:

```
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

```
生成一个路由实例用来捕获访问主页的GET请求，导出这个路由并在app.js中通过app.use('/', routes); 加载。这样，当访问主页时，就会调用res.render('index', { title: 'Express' });渲染views/index.ejs模版并显示到浏览器中。
我们来看下views/index.ejs文件是:

```
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
  </body>


```

在渲染模板时我们传入了一个变量 title 值为 express 字符串，模板引擎会将所有 <%= title %> 替换为 express ，然后将渲染后生成的html显示到浏览器中

***

## 6.路由控制
- 1.普及一下路由知识

> 这里又到了补充一点关于路由的知识了,各位小伙伴，我们接下来一起看看关于路由的一些知识，我们还是通过routes/index.js中的代码来做分析
> ps: 关于前面的引入这一点，我就不做多的描述了，通过上面的学习估计也成为了新手上路了吧，来老老司机带路，直接进入高潮


```
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

```

我先说一下这段代码是什么意思:当我们访问根目录时候也就是home页/主页,调用ejs模板引擎,来渲染index.ejs的模板文件(即半title变量全部替换为这符串Express),
然后生成 静态页面并显示在浏览器中。(先不论明白还是不懂,我还是要接下来说的)
我们对上面的代码进行一下修改

```
router.get('/', function(req, res) {
  res.send('hello, express');
});

router.get('/users/:name', function(req, res) {
  res.send('hello, ' + req.params.name);
});
```

我们运行后的结果如下:

![](http://p1.bqimg.com/567571/b89432910b61b61b.png)

![](http://i1.piimg.com/567571/d57591d7b5411a44.png)

上面的代码意思是：当我访问根目录的时候，就直接返回你信息不在调用模板了直接返回`hello,express`,
当访问如:`127.0.0.1:3000/users/my`路径的时,返回是hello,my。
路径中:name就相当于一个传过来的值或是叫占位符,我们通过`req.params,name`取到了传进来的值/占位符的具体内容。

> express使用[path-toregexp](https://www.npmjs.com/package/path-to-regexp)模块实现的路由的匹配。


通过上面的例子，我们不难看出req包含了请求来的相关信息,res则返回该请求的的响应信息,
更多请查询[express官方文档](http://www.expressjs.com.cn/4x/api.html#req)下面介绍几处常用的req属性

> 1 req.query:解析后的url中的querystring,如?name=heihei,req.query的值就为{name:'heihei'}
2 req.params:解析url中的占位符,如/:name,访问的/heihei,req,params的值为{name:'heihei'}
3 req.body 解析讨请求体(需要相应的模块),如[body-parser](https://www.npmjs.com/package/body-parser),
请求体为{'name':'heihei'},则req.body为{name:'heihei'}


> 上面只是很简单的路由使用的例子（将所有路由控制函数都放到了 index.js），但在实际开发中通常有几十甚至上百的路由,
都写在 index.js 既臃肿又不好维护。
所以通常会在项目目录里面会有一个routes文件夹,里面会存放index.js与users.js
我们将 / 和 /users/:name 的路由分别放到了 routes/index.js 和 routes/users.js 中，
每个路由文件通过生成一个 express.Router 实例 router 并导出，通过 app.use 挂载到不同的路径。
这两种代码实现了相同的功能，但在实际开发中推荐使用 express.Router 将不同的路由分离到不同的路由文件中。
更多 express.Router 的用法见[express官方文档](http://www.expressjs.com.cn/4x/api.html#router)


- 2. 普及一下模板引擎

> 上面我们介绍一下关于路由的问题,下面来们来普及一下什么是模板引擎


模板引擎（Template Engine）是一个将页面模板和数据结合起来生成 html 的工具。上例中，
我们只是返回纯文本给浏览器，现在我们修改代码返回一个 html 页面给浏览器。
而模板引擎是有很多路,这里我们使用是ejs只是其中的一种,因为它使用起来十分简单,而且与的express集成良好,
所我们这里使用是ejs。
当然 我们在初始化的时候也安装好了,当然也可以独立安装

`npm i ejs --save-dev`
