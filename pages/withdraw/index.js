//index.js
//获取应用实例
var app = getApp();
var common = require('../../package/common.js'); //调用模块
//注册页面Page();
Page({
	
	//wxml页面数据  //http://my.xcx.com/index.php
	data: {
	  ajaxStops:false,	
	  avatarUrl:'',     //用户头像
	  avatarName:"",    //用户名称  

	  money2:'',
	  name:'',
    mobile: '',
    vipbecome: false,
    vipbtn: false,
    paythis: null


	},
	
	//监听页面加载
	onLoad: function (e) {
	  console.log('onLoad');
	  var _this=this;
	  common.schoolPage.userInfo(_this);
    //common.login(_this);
    common.vipJudge(_this);
    common.shareApp(e)
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
		var memberUser=wx.getStorageSync('memberUser');
		return {
			title: memberUser.share_title,
			desc: memberUser.share_desc,
			imageUrl: memberUser.share_img,
			path: '/pages/schoolQuery/index?zid='+memberUser.id
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


	//侧栏弹出
	sideTap:function(){
		var _this=this;
    _this.data.sideShow ? _this.setData({ sideShow: false }) : _this.setData({ sideShow: true });
    common.sidebarData(_this)
  },
  sideShowfunction: function () {
    var _this = this
    _this.data.sideShow ? _this.setData({ sideShow: false }) : _this.setData({ sideShow: true });
  },
	tipPopTap:function(){
		var _this=this;
		if(_this.data.groups_status==1){
			wx.reLaunch({
			  url: '/pages/cluster/index'
			})
			return false;
		}
		_this.data.tipPop ? _this.setData({tipPop:false,sideShow:false}):_this.setData({tipPop:true,sideShow:false});
	},
	//2人团
	vipPay1Tap:function(){
		wx.reLaunch({
		  url: '/pages/cluster/index'
		})
  },

  //成为VIP弹框
  vipPay2Tap: function () {
    this.setData({ vipbecome: true })
    // _this.data.tipPop ? _this.setData({ tipPop: false, sideShow: false }) : _this.setData({ tipPop: true, sideShow: false });
  },
  // 关闭成为VIP
  close: function () {
    this.setData({ vipbecome: false })
  },
	
	//金额输入
	moneyInput:function(e){
		var _this=this;
		_this.setData({
			money2:e.detail.value
		});
	},

	//姓名输入
	nameInput:function(e){
		var _this=this;
		_this.setData({
			name:e.detail.value
		});
	},

	//姓名输入
	mobileInput:function(e){
		var _this=this;
		_this.setData({
			mobile:e.detail.value
		});
	},
	
	//我要提现
	withdrawTap:function(){
		var _this=this;	
	    common.payPage.withdrawSubmit(_this);
	},

	//回到首页
	backHomeTap:function(){
		wx.reLaunch({
		  url: '/pages/schoolQuery/index'
		})
  },
  mychild: function (e) {
    this.setData({ status: false })
  },
  vipclose: function () {
    this.setData({ vipbtn: false })
  }
	
})
