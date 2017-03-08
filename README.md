# Express入门 

使用node  expres mongoDB搭建多人搏客(新手练习之作)

## 开发环境
- Node  `v6.10.0`
- Express `v4.14.1`
- MongoDB `v3.4.2`

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

### 6.1.普及一下路由知识

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

> 
- 1 req.query:解析后的url中的querystring,如?name=heihei,req.query的值就为{name:'heihei'}
- 2 req.params:解析url中的占位符,如/:name,访问的/heihei,req,params的值为{name:'heihei'}
- 3 req.body 解析讨请求体(需要相应的模块),如[body-parser](https://www.npmjs.com/package/body-parser),请求体为{'name':'heihei'},则req.body为{name:'heihei'}


上面只是很简单的路由使用的例子（将所有路由控制函数都放到了 `index.js`），但在实际开发中通常有几十甚至上百的路由,
都写在` index.js` 既臃肿又不好维护。
所以通常会在项目目录里面会有一个`routes`文件夹,里面会存放`index.js`与`users.js`
我们将 `/ `和 `/users/:name `的路由分别放到了` routes/index.js` 和` routes/users.js` 中，
每个路由文件通过生成一个 `express.Router` 实例` router` 并导出，通过 `app.use `挂载到不同的路径。
这两种代码实现了相同的功能，但在实际开发中推荐使用 `express.Router` 将不同的路由分离到不同的路由文件中。
更多 `express.Router` 的用法见[express官方文档](http://www.expressjs.com.cn/4x/api.html#router)

***

### 6.2. 普及一下模板引擎

> 上面我们介绍一下关于路由的问题,下面来们来普及一下什么是模板引擎


模板引擎（Template Engine）是一个将页面模板和数据结合起来生成 html 的工具。上例中，
我们只是返回纯文本给浏览器，现在我们修改代码返回一个 html 页面给浏览器。
而模板引擎是有很多路,这里我们使用是ejs只是其中的一种,因为它使用起来十分简单,而且与的express集成良好,
所我们这里使用是ejs。
当然 我们在初始化的时候也安装好了,当然也可以独立安装

`npm i ejs --save-dev`

安装我们ejs模板引擎的之后,我们继续回到上面的代码

```
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
```

我们对上面的这个代码片段进行进一步的分析,能过`res.render`函数渲染ejs模板,`res.render`第一个参数是模板的名字,
这里会匹配到`views/index.ejs`(为啥会匹配到`views`下面呢?
我们在分析`app.js`的时候已经定义了视图的路径了
`app.set('views',path.join(_dirname,'views'))`没错就是在这里定义了模板路径
`app.set('view engine','ejs')`在这里定义了我们的模板引擎是ejs
不懂没关系接着看)
`res.render`的第二参数是传组模板的数据,这里我们传入`title`,则在ejs模板中可以直接使用title。
`res.render`的作用就是将模板各数据结合生成的html,同时设置了响应头`Content-type:text/html`告诉浏览器返回的是html,
不是文本信息,而是按html展示出来。

下面我们上面说了模板的调用,那么我在看一下模板中是怎么使用我们传入进来的值呢?

```
<h1><%= title %></h1>
<p>Welcome to <%= title %></p>

```
上面的代码可以看到,我们在模板使用<%= xxx%>这是什么鬼?,那在这里不得不科普一下ejs常用的标签:
1. `<% code%>`  运行javascript代码,不输出。如  我传一下`str = 'abc'`  `<% str.toUpperCase()%>` 在模板中把str转成大写
2. `<%= code%>`  显示转义后的html内容
3. `<%- code%>` 显示原始HTML内容

>注意：<%= code %> 和 <%- code %> 都可以是 JavaScript 表达式生成的字符串，当变量 code 为普通字符串时，两者没有区别。
当 code 比如为 <h1>hello</h1> 这种字符串时，<%= code %> 会原样输出 <h1>hello</h1>，
而 <%- code %> 则会显示 H1 大的 hello 字符串。

别的都不用多解释,关于第一种的用户我在这要多说一下,请看下一个例子:

Data:

```
names:['小王','小李','小钱']
```
Template:
```
<ul>
<% for(var i=0; i<names.length;i++) {%>
	<li><%= names[i]%></li>
<%{%>
</ul>
```
Resutl:

```
<ul>
<li>小王</li>
<li>小李</li>
<li>小钱</li>
</ul>
```
> 看到这里 有学个jsp或是php的同学是不是发现好熟悉啊！
还是老样子更多内容请查询[官方文档](https://www.npmjs.com/package/ejs#tags)


在这里我又得要说一下了,我在实现开发当中,不可能说一种应用就对应一个模板页面,这样我们就是失去了模板的优势了,
比喻我们导航条与底部信息栏目,通常是在后面的每个页面都有使用到的,那么我们把这些常复用的模板片段组合起使用。
如我们在`views`下创建`header.ejs`和`footer.ejs`,并修改我们的index.ejs(只是一个demo)

使用include包含复用模板
`views/header.ejs`代码如下:

```

<html>
  <head>
    <title>XXXXX</title>
    css ...
    js ....
  </head>
  <body>
```

`views/footer.ejs`代码如下:

```
js....
</body>
</html>
```
`views/index.ejs`代码如下:

```
<%- include('header') %>
<h1><%= title %></h1>
<p>Welcome to <%= title %></p>
<%- include('footer') %>
```
我们将原来的 index.ejs 拆成出了 header.ejs 和 footer.ejs,并在 users.ejs 通过 ejs 内置的 include 方法引入,
从而实现了跟以前一个模板文件相同的功能。
>拆分模板组件通常有两个好处：
>> 1. 模板可复用，减少重复代码
>> 2. 主模板结构清晰
> 要用 <%- include('header') %> 而不是 <%= include('header') %>


***


### 6.3. 关于中间件与next

> 我们对 `express` 中路由和模板引擎 ejs 的用法进行了简单了解，但 `express` 的精髓并不在此，在于`中间件`的设计理念。


那么问题来了,什么是中间件,我们来回顾一下我在分析`app.js`当中关于404


```
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
```
`express` 中的中间件（`middleware`）就是用来处理请求的，当一个中间件处理完，可以通过调用 `next()` 传递给下一个中间件，
如果没有调用 `next()`,则请求不会往下传递。
这个例子可能看得不是很明白,下面我们重新写一个:

`app.js`

```
var express = require('express');
var app = express();

app.use(function(req,res,next){
	console.log('我是第一个');
	next();
);
app.use(function(req,res,next){
	console.log('我是第二个');
	res.status(200).end();
});
app.listen(3000);
```

在访问`127.0.0.1:3000`,在`chrome`中的控制台里可以看到输出了以下结果

> 我是第一个
> 我是第二个


通过app.use加载中间件，在中间件中通赤next将请求传递到下一个中间件,next可接受一个参数接收错误信息,
如果使用了next(error),则会近观回错误信息而不会继续传到下一个中间件里,我们在对`app.js`进行修改:

```
var express = require('express');
var app = express();

app.use(function(req,res,next){
	console.log('我是第一个');
	next(new Error('我在第一处发生了错误了!'));
);
app.use(function(req,res,next){
	console.log('我是第二个');
	res.status(200).end();
});
app.listen(3000);
```
我们在次访问`127.0.0.1:3000`就会得错误结果了,后台与页面都能看到错误信息

> Error: 我在第一处发生了错误了!
app.use 有非常灵活的使用方式,还是老样子请查看[官方文档](http://www.expressjs.com.cn/4x/api.html#app.use)
关于中间件的内容请查看[官方文档](http://www.expressjs.com.cn/guide/using-middleware.html)

上面的例子中,`express`内置了一个默认的错误处理器,假如我们想要手动控制返回错误的内容,则需要加载一个自定义错误处理的中间件,
我在上面的例子中 手动添加一个错误处理
```
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500).send('这里发生了错误了！')；
);
```
在一次一访问`127.0.0.1:3000`,这个时候浏览器中会显示这里发生了错误了!
> 更多内容请查阅[官方文档](http://www.expressjs.com.cn/guide/error-handling.html)


***
### 说了这么多,我们终于要开始进入正题了
***

## 7.1功能分析以及依赖的安装

搭建一个简单的可以多人注册、登录、发表文章、登出功能的博客。

好我们要正式开始了哦!
上面对于整个目录结构与主要代码的分析,以及相关的小知识点,我都做了一下简单的介绍了,

下面我们来安装一下我们所需要一些功能模块
`npm i config-lite connect-flash connect-mongo ejs express express-formidable express-session marked moment mongolass objectid-to-timestamp sha1 winston express-winston --save-dev`
对应模块的功能:
1. `express` : web框架
2. `express-session` : `sesison`中间件
3. `connect-mongo` : 把`session`存放到`mogogDB`当中
4. `connect-flash` : 页面通知提示的中间件，基于 `session` 实现
5. `ejs` : 模板
6. `express-formidable` : 接收表单及文件的上传中间件
7. `config-lite` : 读取配置文件
8. `marked` :  markdown 解析
9. `moment` : 时间格式化
10. `mongolass` : mongodb 驱动
11. `objectid-to-timestamp` : 根据 `ObjectId` 生成时间戳
12. `sha1` : `sha1` 加密，用于密码加密
13. `winston` : 日志
14. `express-winston` : 基于 `winston` 的用于 `express` 的日志中间件

> 不管是小项目还是大项目，将配置与代码分离是一个非常好的做法。我们通常将配置写到一个配置文件里，
如 `config.js` 或 `config.json` ，并放到项目的根目录下。`config-lite` 模块正是你需要的。


#### 7.1.1 `config-lite`的介绍与使用
 
 `config-lite` 是一个轻量的读取配置文件的模块。`config-lite` 会根据环境变量（`NODE_ENV`）的不同从当前执行进程
 目录下的` config` 目录加载不同的配置文件。如果不设置` NODE_ENV`，则读取默认的 `default` 配置文件，如果设置了 `NODE_ENV`，
 则会合并指定的配置文件和 `default` 配置文件作为配置，`config-lite` 支持` .js、.json、.node、.yml、.yaml` 后缀的文件。
 
 > 如果程序以 NODE_ENV=test node app 启动，则通过 require('config-lite') 会依次降级查找
  config/test.js、config/test.json、config/test.node、config/test.yml、config/test.yaml 
 并合并 default 配置; 
 如果程序以 NODE_ENV=production node app 启动，则通过 require('config-lite') 会依次降级查找 config/production.js、
 config/production.json、config/production.node、config/production.yml、config/production.yaml 
 并合并 default 配置。
 
关于这个环境变量的设置我在这里简单的提一下:
- 环境变量（environment variables）一般是指在操作系统中用来指定操作系统运行环境的一些参数。
- 在 Mac 和 Linux 的终端直接输入 env，会列出当前的环境变量，如：USER=xxx。简单来讲，环境变量就是传递参数给运行程序的。
>通过以下命令启动程序，指定当前环境变量 NODE_ENV 的值为 test。
  >> `NODE_ENV = test node app`
>那么在 app.js 中可通过 process.env
>> `console.log(process.env.NODE_ENV) //test`


- 另一个常见的例子是使用debug模块: `DEBUG = * node app`
- Window用户的设置是
```
set DEBUG = *
set NODE_ENV = test
node app
//可以使用 cross-evn
npm i cross-evn -g 
//使用方式:
cross-env NODE_ENV = test node app
``` 

只是点到为止,不要在意这些。我们要开始开工了
#### 7.1.1 在我们的项目中创建`default.js`
**config/default.js**
```
module.exprots = {
	port : 3000,
	session : {
		secret : 'blog',
		key : 'blog',
		magAge : 2592000000
	},
	mongodb : 'mongodb://localhost:27017/blog'
}
```
配置的注释如下
1. `port` : 程序启动要监听的端口号
2. `session` : `express-session` 的配置信息，后面介绍
3. `mongodb` : `mongodb` 的地址，`blog` 为 `db` 名

*关于mongodb的使用我这里不用多的介绍了*

#### 7.1.2 先看我们主要功能与路由
> 是一个入门之作 没有使用ajax
1. 注册
 - 1.1 注册页面: `GET /singup`
 - 1.2 注册(操作): `POST /singup`
2. 登录
 - 2.1 登录页面: `GET /singin`
 - 2.2 登录检查: `POST /singin`
3. 登出
 - 3.1 用户登出:  `GET /singout`
4. 查看文章
 - 4.1 主页:  `GET /posts`
 - 4.2 个人主页: `GET /posts?author=xxxx`
 - 4.3 查看一篇文章(包含留言): `GET /posts/:postId`
5. 发表文章
 - 5.1 发表文章页面: `GET /posts/create`
 - 5.2 发表文章(操作): `POST /posts`
6. 编辑文章
 - 6.1 编辑文章页面: `GET /posts/:postId/edit`
 - 6.2 修改文章(操作): `POSt /posts/:postId/edit`
7. 删除文章
 - 7.1 删除具体的文章: `GET /posts/:postId/remove`
8.留言
 - 8.1 创建留言: `POST /posts/:postId/comment`
 - 8.2 删除留言: `GET /posts/:postId/comment/:commentId/remove`
 
 > 在设计API的时候最好是遵循restful风格
 
 `GET /posts/:postId/remove` 
 
 >修改成restful
 
 `DELETE /post/:postId`

>更多内容请自行查询相关文档


#### 7.1.2 session与cookie

>由于 HTTP 协议是无状态的协议，所以服务端需要记录用户的状态时，
就需要用某种机制来识别具体的用户，这个机制就是会话（Session）。


**cookie 与 session 的区别**
- cookie 存储在浏览器（有大小限制），session 存储在服务端（没有大小限制
- 通常 session 的实现是基于 cookie 的，即 session id 存储于 cookie 中
- 我们通过引入 `express-session `中间件实现对会话的支持`app.use(session(options))`

`session` 中间件会在 `req` 上添加 `session` 对象，即 `req.session` 初始值为 `{}`，当我们登录后设置 `req.session.user = 用户信息`，
返回浏览器的头信息中会带上 `set-cookie` 将 `session id `写到浏览器 `cookie` 中，那么该用户下次请求时，
通过带上来的 `cookie` 中的 `session id `我们就可以查找到该用户，并将用户信息保存到 `req.session.user`。

#### 7.1.3 页面通知 flash组件

当我们操作`成功`时需要显示一个成功的通知，如`登录成功`跳转到主页时，需要显示一个 `登陆成功 `的通知；
当我们操作`失败`时需要显示一个失败的通知，如`注册`时用户名被占用了，需要显示一个 `用户名已占用` 的通知。
通知只显示`一次`，刷新后消失，我们可以通过 `connect-flash `中间件实现这个功能。

`connect-flash` 是基于` session` 实现的，它的原理很简单：设置初始值 `req.session.flash={}`，
通过 `req.flash(name, value)` 设置这个对象下的字段和值，通过 `req.flash(name) `获取这个对象下的值，同时删除这个字段。

`express-session`、`connect-mongo` 和` connect-flash` 的区别与联系

- `express-session`: 会话（`session`）支持中间件
- `connect-mongo`: 将 `session` 存储于 `mongodb`，需结合 `express-session` 使用，我们也可以将 `session` 存储于 `redis`，如` connect-redis`
- `connect-flash`: 基于 `session` 实现的用于通知功能的中间件，需结合 `express-session `使用

#### 7.1.3 权限控制
基本现在每一个网站都会这个权限控制,我们没有登录的话只能浏览,登陆后才能发帖或写文章,即使登录了你也不能修改或删除其他人的文章，这就是权限控制。
我们也要给我们的项目添加权限控制，如何实现页面的权限控制呢？我们可以把用户状态的检查封装成一个中间件,在每个需要权限控制的路由加载该中间件,即可实现页面的权限控制。
在 根目录下新建 middlewares 文件夹，在该目录下新建 check.js

```
/*用于权限控制*/
module.exports = {
	checkLogin : function chekLogin(req,res,next){
	console.log('检查登录!')
		if(!req.session.user){//检查session是否存在
			req.flash('error','未登录');//输出提示以为信息
			return res.redirect('/signin');//跳转到登录页面
		}
		next();
	},
	checkNotLogin : function checkNotLogin(req,res,next){
	 console.log('检查是否登录!');
		if(req.session.user){
			req.flash('error','已登录');
			return res.redirect('back');//返回之前的页面
		}
		next();
	},
}

```

1. `checkLogin`: 当用户信息（`req.session.user`）不存在，即认为用户没有登录，则跳转到登录页，同时显示` 未登录 `的通知，用于需要用户登录才能操作的页面及接口
2. `checkNotLogin`: 当用户信息（`req.session.user`）存在，即认为用户已经登录，则跳转到之前的页面，同时显示` 已登录 `的通知，如登录、注册页面及登录、注册的接口

上面的准备工作弄完了,我们可以更具我们上面的需求来确定，我们所需要的路由

**routes/index.js**

```
module.exports = function (app) {
  app.get('/', function (req, res) {
  //进行重定项
    res.redirect('/posts');
  });
  //使用中间件
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
```
**routes/posts.js**

```
var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;//权限控制
//GET/ posts 所有用户或是特定用户的文章页
//如: GET /posts ? author = xxx
router.get('/',function(req,res,next){
	
});
// POST /posts 发表文章
router.post('/',checkLogin,function(req,res,next){
	
});
// GET /posts/create 发表文章页
router.get('/"postId',function(req,res,next){
	
});
//GET /posts/:postId 单独一篇的文章页
router.get('/:postId',checkLogin,function(req,res,next){
	
});
//GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit',checkLogin,function(req,res,next){
	
});
//GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove',checkLogin,function(req,res,next){
	
});
//POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment',checkLogin,function(req,res,next){
	
});
//GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove',checkLogin,function(req,res,next){
	
});
module.exports = router;
```
**routes/signin.js**

```
var express = require('express');
var router = express.Router();

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function(req, res, next) {
  
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
  
});

module.exports = router;
```

**routes/signup.js**

```
var express = require('express');
var router = express.Router();

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
  
});

module.exports = router;
```

**routes/signout.js**

```
var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
  
});

module.exports = router;
```


---

今天就写到这了2017-03-06

***

#### 7.1.4 注册页面与注册功能

> `ps:` 昨天我们完成了路由功能


今天主要完成了基本页面的布局

1. 注册页面

![](http://p1.bpimg.com/567571/9446924da0b53601.png)


2. 注册功能
 - 2.1 我们要使用`mongoDB`,在这里请自行查阅`mongoDB`相关]使用手册](http://www.runoob.com/mongodb/mongodb-tutorial.html)
 - 2.2 假设我们的`mongoDB`都安装好,并成功运行了。我们现在需要创建一个表(其实是没有表,我们假装按mysql的方式)
   在根目录下面新一个`lib`文件夹,用于存放我们要使用相关模型`mongo.js`,具体如下,用于创建用户
 ```
 
var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

//用户模型
exports.User = mongolass.model('User',{
	name : {type : 'string'},
	password : {type : 'string'},
	avatar : {type : 'string'},
	gender : {type : 'string',enum : ['m','f','x']},
	bio : {type : 'string'}
});
//根据用户名找到用户，用户名全局唯一
exports.User.index({name : 1},{unique : true}).exec();

//根据用户名找到用户，用户名全局唯一
exports.User.index({name : 1},{unique : true}).exec();

 ```
 
 > 解释一下上我们这段代码的意思,我们定义了用户表的 `schema`,生成并导出了 `User` 这个 `model`,
 同时设置了 `name` 的唯一索引，保证用户名是不重复的。
 Mongolass 相当于我们用的mysql的连接
 
- 2.3 用户注册页面我们有了,数据表也有了,剩下的工作就是写入到数据库当中了
 - 在根目录下,我们创建一个`models`文件夹,在里创建一个`usrs.js`,用于执行创建用户

```

var User = require('../lib/mongo').User;

module.exports = {
	//注册用户
	create : function create(user){
		return User.create(user).exec();
	} 
};

```

 - 在完成了以上操作之后,我们在注册的时候一般都会用户输入的信息进行验证。我们打开`routers/signup.js`,完成注册验证功能 。
 
 ***

	var fs = require('fs');
	var path1 = require('path');
	var sha1 = require('sha1');

	var express = require('express');
	var router = express.Router();

	var UserModel = require('../models/users');
	var checkNotLogin = require('../middlewares/check').checkNotLogin;
	
	// GET /signup 注册页
	router.get('/',checkNotLogin ,function(req, res, next) {
		console.log('进入注册页面');
		//res.send('进入注册页面')
	  res.render('signup');
	});
	// POST /signup 用户注册
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
	module.exports = router;
	
	
	
	
 
 ***
 我们就注册成功了
 ***
 ![](http://i1.piimg.com/567571/25287a288c8461ba.png)
 
***
2017-03-08,今天有别的事忙,没有继续更新