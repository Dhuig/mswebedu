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

	  dataArr:[],     //学校列表
	  userScore:[],      //用户分数
    collect: false,
    vipbecome: false,
    vipbtn: false,
    paythis: null
	},
	
	//监听页面加载
	onLoad: function (e) {
	  console.log('onLoad');
	  var _this=this;
	  //common.login(_this);
	  common.memberInfo(_this);
    common.schoolPage.schoolList(_this);
    common.vipJudge(_this)
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
	withdrawLink1Tap:function(){
		wx.reLaunch({
		  url: '/pages/withdraw/index'
		})
	},
	recommendLinkTap:function(){
		wx.reLaunch({
		  url: '/pages/recommend/index'
		})
	},
	expenditureLinkTap:function(){
		wx.reLaunch({
		  url: '/pages/expenditure/index'
		})
	},
	withdrawLink2Tap:function(){
		wx.reLaunch({
		  url: '/pages/withdrawRecord/index'
		})
	},
	aboutLinkTap:function(){
		wx.reLaunch({
		  url: '/pages/about/index'
		})
	},
	posterLinkTap:function(){
		wx.reLaunch({
		  url: '/pages/poster/index'
		})
	},
	volunteerLink2Tap:function(){ 		
    wx.reLaunch({ 		  
      url: '/pages/volunteer/index' 		
      }) 	
    },     
  versionUp2Tap:function(){ 		
    wx.reLaunch({ 		  
    url: '/pages/version/index' 		
    }) 	
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
	
	//查看详情
	detailTap:function(e){
		var _this=this;	
		var code=e.currentTarget.dataset.code;
	    wx.navigateTo({
		  url: '/pages/schoolDetail/index?code='+code
		});
	},

	//点击收藏
	collectTap:function(e){
		console.log(e);
		var _this=this;
		var id=e.currentTarget.dataset.id;
		var index=e.currentTarget.dataset.index;
		var type=e.currentTarget.dataset.type;	
		var collect=e.currentTarget.dataset.current;
		common.schoolPage.collect(_this,id,index,type,collect);
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

	//学校排名页
	rankingLinkTap:function(){
		wx.reLaunch({
		  url: '/pages/ranking/index'
		})
  },
  vipclose: function () {
    this.setData({ vipbtn: false })
  }
	
})
