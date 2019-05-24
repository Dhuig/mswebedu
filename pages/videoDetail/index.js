//index.js
//获取应用实例
var app = getApp();
var common = require('../../package/common.js'); //调用模块
//注册页面Page();
Page({
	
	//wxml页面数据  //http://my.xcx.com/index.php
	data: {
	  avatarUrl:'',     //用户头像
	  avatarName:"",    //用户名称  

	  id:'',          //文章id
    detail: '',      //详情
    vipbtn: false,
    zid: null
	},
	
	//监听页面加载
	onLoad: function (e) {
	  console.log('onLoad');
	  var _this=this;
	   _this.setData({ id:e.id });
	   common.authIf(_this);
    common.newsPage.videoDetail(_this);
    common.vipJudge(_this);
    if (e.zid) {
      this.setData({ zid: e.zid })
    } 
  },

  //获取授权信息
  authorization: function (e) {
    var _this = this;
    common.login(_this, e.detail.e);
  },
	
	//监听页面初次渲染完成
	onReady:function(){
		
	},
	
	//监听页面显示
	onShow:function(){

	},
	
	//监听页面隐藏
	onHide:function(){
		
	},
	
	//页面卸载：当redirectTo或navigateBack的时候调用。
	onUnload:function(){
		
	},
	
	//监听用户下拉动作
	onPullDownRefresh:function(){
		//当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
	},
	
	//页面上拉触底事件的处理函数
	onReachBottom:function(){
		
	},
	
	//用户点击右上角分享
	onShareAppMessage:function(){
		var _this=this;	
		var memberUser=wx.getStorageSync('memberUser');
		var url='/pages/schoolQuery/index?zid='+memberUser.id+'&video='+_this.data.id;
		console.log(url);
		return {
			title: memberUser.share_title,
			desc: memberUser.share_desc,
			imageUrl: memberUser.share_img,
			path: url
		}
	},
	
	//导航链接
	newsLinkTap:function(){
		var _this=this;	
	    wx.reLaunch({
		  url: '/pages/newsList/index'
		})
	},
	volunteerLinkTap:function(){
		var _this=this;	
		var memberUser=wx.getStorageSync('memberUser');
		if(memberUser.before_score.length<3){
			 wx.showModal({
				  title: '提示',
				  content:'需要先提交分数',
				  showCancel:false,
				  success: function(res) {
				  	wx.reLaunch({
					  url: '/pages/schoolQuery/index'
					})
				  }
			 });
		}else{
			wx.reLaunch({
			  url: '/pages/order/index'
			})
		}
	},
	teacherLinkTap:function(){
		var _this=this;	
	    wx.reLaunch({
		  url: '/pages/teacherList/index'
		})
	},
	collectLinkTap:function(){
		var _this=this;	
	    wx.reLaunch({
		  url: '/pages/collect/index'
		})
	},
	
	//返回上一页
	backLinkTap:function(){
		wx.navigateBack({
		  delta: 1
		})
	},

	//回到首页
	backHomeTap:function(){
		wx.reLaunch({
		  url: '/pages/schoolQuery/index'
		})
  },
  mychild: function (e) {
    this.setData({ status: false })
    console.log(this.data.status)
  },

	//协议
	protocolChange:function(){
		var _this=this;
		_this.data.protocolChecked ? _this.setData({protocolChecked:false}):_this.setData({protocolChecked:true});
		console.log(_this.data.protocolChecked);
  },
  vipclose: function () {
    this.setData({ vipbtn: false })
  }
})
