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
