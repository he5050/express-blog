//引拉markdown解析,所有文章就可以使有markdwon语法
var marked = require('marked');

var Post = require('../lib/mongo').Post;
var CommentModel = require('./comments');

// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
        post.commentsCount = commentsCount;
        return post;
      });
    }));
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(function (count) {
        post.commentsCount = count;
        return post;
      });
    }
    return post;
  }
});

//定义插件与前面 登录验证的模式一下,用于把markdown转换成html
Post.plugin('contentToHtml',{
	afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content);
      return post;
    });
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  }
});
module.exports = {
	//发表一篇文章
	create : function create(post){
		return Post.create(post).exec();
	},
	//通过文章的id号获取文章的详情
	getPostById : function getPostById(postId){
		return Post
			.findOne({_id:postId})
			.populate({path:'author',model:'User'})
			.addCreatedAt()
			.addCommentsCount()
		    .contentToHtml()
			.exec();
	},
	//按创建时间降序获取所有用户文章或者某个特定用户的所有文章
	getPosts: function getPosts(author){
		console.log('正在查询当前作者的文章');
		var query = {};
		if(author){
			query.author = author;
		}
		return Post
			.find(query)
	      	.populate({ path: 'author', model: 'User' })
	    	.sort({ _id: -1 })
		    .addCreatedAt()
		    .addCommentsCount()
		    .contentToHtml()
		    .exec();
	},
	//每被浏览一次增加一次pv
	incPv : function incPv(postId){
		return Post
			.update({ _id : postId},{$inc : {pv:1}})
			.exec();
	},
	//获取要更新 的文章 特别注意,我们获取是原生的哦,不是markdown转之后的文章
	getRawPostById : function getRawPostById(postId){
		return Post
			.findOne({_id :postId})
			.populate({path: 'author',model:'User'})
			.exec();
	},
	//更新文章
	updatePostById : function updatePostById(postId,author,data){
		return Post
			.update({author:author,_id:postId},{$set:data})
			.exec();
	},
	//删除文章
	delPostById: function delPostById(postId,author){
		return Post
			.remove({author:author,_id:postId})
			.exec();
	}
};
