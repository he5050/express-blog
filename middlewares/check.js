/*用于权限控制*/
module.exports = {
	checkLogin : function chekLogin(req,res,next){
		if(!req.session.user){//检查session是否存在
			console.log('我才不到这里了不?');
			req.flash('error','未登录');//输出提示以为信息
			return res.redirect('/signin');//跳转到登录页面
		}
		next();
	},
	checkNotLogin : function checkNotLogin(req,res,next){
		console.log('检查用户是否已经登录!');
		if(req.session.user){
			console.log('到这里了不?');
			req.flash('error','已登录');
			return res.redirect('back');//返回之前的页面
		}
		next();
	}
}
