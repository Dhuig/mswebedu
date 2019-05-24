//app.js
//注册小程序App()
App({
  
	//全局变量
	globalData:{  
		appid:'wx58d5fd858edd0a19',//appid需自己提供，此处的appid我随机编写  
		secret:'0398d8013cb80dca64c57ec8baee7a6d',//secret需自己提供，此处的secret我随机编写
		url:'https://gk2.mingshiedu.com',
		//url:"http://my.gkzy.com"
	},
	
	//后台进入前台
	onShow: function(msg) {
		var ddd=JSON.stringify(msg);
		console.log("分享信息："+ddd);
		//if(msg.scene) wx.setStorageSync('scene',decodeURIComponent(msg.scene));
		if(msg.query.zid) wx.setStorageSync('zid',msg.query.zid);
		if(msg.query.ctid){
			console.log("存在tid");
			wx.reLaunch({
			  url: '/pages/cluster/index?ctid='+msg.query.ctid
		    })
		}else if(msg.query.news){
			wx.reLaunch({
			  url: '/pages/newsDetail/index?id='+msg.query.news
		    })
		}else if(msg.query.video){
			wx.reLaunch({
			  url: '/pages/videoDetail/index?id='+msg.query.video
		    })
		}else{
			console.log("不存在tid");
		}
		
	},
	
	//前台进入后台
	onHide: function() {
		// Do something when hide.
	},
	
	//错误
	onError: function(msg) {
	  //console.log(msg)
	},
	
	//当小程序初始化完成时  
	onLaunch: function (msg) { 
		var ddd=JSON.stringify(msg);
		console.log("分享信息："+ddd);
		if(msg.query.zid) wx.setStorageSync('zid',msg.query.zid);
		if(msg.query.ctid){
			console.log("存在tid");
			wx.reLaunch({
			  url: '/pages/cluster/index?ctid='+msg.query.ctid
		    })
		}else if(msg.query.news){
			wx.reLaunch({
			  url: '/pages/newsDetail/index?id='+msg.query.news
		    })
		}else if(msg.query.video){
			wx.reLaunch({
			  url: '/pages/videoDetail/index?id='+msg.query.video
		    })
		}else{
			console.log("不存在tid");
		}
    },


    //富文本
    convertHtmlToText: function convertHtmlToText(inputText) {
	  var returnText = "" + inputText;
	  returnText = returnText.replace(/<\/div>/ig, '\r\n');
	  returnText = returnText.replace(/<\/li>/ig, '\r\n');
	  returnText = returnText.replace(/<li>/ig, ' * ');
	  returnText = returnText.replace(/<\/ul>/ig, '\r\n');
	  //-- remove BR tags and replace them with line break
	  returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");
	 
	  //-- remove P and A tags but preserve what's inside of them
	  returnText=returnText.replace(/<p.*?>/gi, "\r\n");
	  returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");
	 
	  //-- remove all inside SCRIPT and STYLE tags
	  returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
	  returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
	  //-- remove all else
	  returnText=returnText.replace(/<(?:.|\s)*?>/g, "");
	 
	  //-- get rid of more than 2 multiple line breaks:
	  returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");
	 
	  //-- get rid of more than 2 spaces:
	  returnText = returnText.replace(/ +(?= )/g,'');
	 
	  //-- get rid of html-encoded characters:
	  returnText=returnText.replace(/ /gi," ");
	  returnText=returnText.replace(/&/gi,"&");
	  returnText=returnText.replace(/"/gi,'"');
	  returnText=returnText.replace(/</gi,'<');
	  returnText=returnText.replace(/>/gi,'>');
	 
	  return returnText;
	}
})


