var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');
var checkLogin = require('../middlewares/check').checkLogin;//权限控制
//GET/ posts 所有用户或是特定用户的文章页
//如: GET /posts ? author = xxx

console.log('加载了文章操作与主页模块');
router.get('/',function(req,res,next){
  var author = req.query.author;
  console.log('成功进入主页');
  PostModel.getPosts(author)
    .then(function (posts) {
      res.render('posts', {
        posts: posts
      });
    })
    .catch(next);
});
// GET 显示发表文章页
router.get('/create', checkLogin, function(req, res, next) {
	console.log('成功进入文章发表页面');
  res.render('create');
});

// POST /posts 发表文章
router.post('/',checkLogin,function(req,res,next){
	console.log('正在发表文章');
	//接收参数
	var author = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;
	
	//验证参数
	try{
		if(!title.length){
			throw new Error('请填写标题!');
		}
		if(!content.length){
			throw new Error('请填写内容');
		}
	}catch(e){
		req.flash('error',e.message);
		return res.redirect('back');
	}
	
	//组装数据
	var post = {
		author : author,
		title : title,
		content : content,
		pv : 0
	};
	PostModel.create(post)
	 .then(function(result){
	 	//返回 _id值
	 	post = result.ops[0];
	 	console.log(post);
	 	req.flash('success','文章发表成功!');
	 	console.log('文章发表成功,即将跳转到主页!');
	 	res.redirect('/posts/'+post._id);
	 })
	 .catch(next);
});
// GET /posts/:postId 文章详情页
router.get('/:postId', function(req, res, next) {
	console.log('正在获取文章详情');
  var postId = req.params.postId;
  
  Promise.all([
    PostModel.getPostById(postId),// 获取文章信息
    CommentModel.getComments(postId),// 获取该文章所有留言
    PostModel.incPv(postId)// pv 加 1
  ])
  .then(function (result) {
    var post = result[0];
    var comments = result[1];
    if (!post) {
      throw new Error('该文章不存在');
    }

    res.render('post', {
      post: post,
      comments: comments
    });
  })
  .catch(next);
});
// GET /posts/:postId/edit 获取原始文章
router.get('/:postId/edit', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('该文章不存在');
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足');
      }
      res.render('edit', {
        post: post
      });
    })
    .catch(next);
});

// POST /posts/:postId/edit 更新文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;

  PostModel.updatePostById(postId, author, { title: title, content: content })
    .then(function () {
      req.flash('success', '编辑文章成功');
      // 编辑成功后跳转到上一页
      res.redirect(`/posts/`+postId);
    })
    .catch(next);
});
// GET /posts/:postId/remove 删除文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostModel.delPostById(postId, author)
    .then(function () {
      req.flash('success', '删除文章成功');
      // 删除成功后跳转到主页
      res.redirect('/posts');
    })
    .catch(next);
});
// POST /posts/:postId/comment 发表留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
	 console.log('正在发表留言!');
  var author = req.session.user._id;
  var postId = req.params.postId;
  var content = req.fields.content;
  var comment = {
    author: author,
    postId: postId,
    content: content
  };

  CommentModel.create(comment)
    .then(function () {
      req.flash('success', '留言成功');
      // 留言成功后跳转到上一页
      res.redirect('back');
    })
    .catch(next);
});

// GET /posts/:postId/comment/:commentId/remove 删除留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
  console.log('正在删除留言!');
  var commentId = req.params.commentId;
  var author = req.session.user._id;

  CommentModel.delCommentById(commentId, author)
    .then(function () {
      req.flash('success', '删除留言成功');
      // 删除成功后跳转到上一页
      res.redirect('back');
    })
    .catch(next);
});
module.exports = router;