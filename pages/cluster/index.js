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
	  dom:[],
	  payType:0,
    ctid: 0,
    vipbecome: false,
    vipbtn: false,
    paythis: null,
    zid: null
	},
	
	//监听页面加载
	onLoad: function (e) {
	  console.log('onLoad');
	  var _this=this;
	  _this.setData({
	      ctid:e.ctid
	  });
    common.authIf(_this);
    common.clusterPage.dom(_this);
    common.vipJudge(_this)
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
		var memberUser=wx.getStorageSync('memberUser');
		var _this=this;	
		var shareUrl='/pages/cluster/index?zid='+memberUser.id+'&ctid='+_this.data.ctid;
		console.log(shareUrl);
		return {
			title: memberUser.title,
			desc: memberUser.desc,
			path: shareUrl
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
	
	
	//我要开团
	creationTap:function(){
		var _this=this;	
		if(_this.data.dom.state==4) return false;
	    common.clusterPage.creation(_this);
	},

	//回到首页
	backHomeTap:function(){
		wx.reLaunch({
		  url: '/pages/schoolQuery/index'
		})
	},

	//协议
	protocolChange:function(){
		var _this=this;
		_this.data.protocolChecked ? _this.setData({protocolChecked:false}):_this.setData({protocolChecked:true});
		console.log(_this.data.protocolChecked);
  },
  mychild: function (e) {
    this.setData({ status: false })
  },
  // 体验成功后关闭体验组件
  vipclose: function () {
    this.setData({ vipbtn: false })
  }
	
})