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
	  score:'',
	  course:'',
    quantity: [0, 0, 0],
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    vipbecome: false,
    paythis: null,
    invited_id:null,
    zid:null
	},
	
	//监听页面加载
	onLoad: function (e) {
	  console.log('onLoad');
	  var _this=this;
	  if(e.scene) wx.setStorageSync('scene',decodeURIComponent(e.scene));
    common.authIf(_this);
    common.msgkindex.swiperData(_this); 
    if (e.scene) {
      // if (e.scene && wx.getStorageSync('memberUser').id) {
      //   var data = {
      //     invited_id: e.scene,
      //     member_id: wx.getStorageSync('memberUser').id
      //   }
      //   common.invite(_this, data)
      // }
      this.setData({ invited_id: decodeURIComponent(e.scene)})
    }
    if (e.zid) {
      this.setData({ zid: e.zid })
    }
  },

	//获取授权信息
  authorization: function (e) {
    var _this=this;
    common.login(_this, e.detail.e);
  },
  sideShowfunction: function () {
    var _this=this
    _this.data.sideShow ? _this.setData({ sideShow: false }) : _this.setData({ sideShow: true });
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
    this.setData({ paythis: this })
  },
  // 关闭成为VIP
  close: function () {
    this.setData({ vipbecome: false })
    wx.scanCode({
      scanType: ['qrCode'],
      success(res) {
        wx.showToast({
          title: '成功',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

	//分数输入
	scoreInput:function(e){
		var _this=this;
		_this.setData({
			score:e.detail.value
		});
		
	},
	//科目选择
	radioChange:function(e){
		var _this=this;
		console.log(e.detail.value);
		_this.setData({
			course:e.detail.value
		});
	},
	//成绩查询
	queryTap:function(){
		 var _this=this;
         common.schoolPage.checkPhone(_this,0);
	},

    getPhoneNumber:function(e){
        var _this=this;
        common.memberBindPhone(_this,e);
    },

    pncancel:function(){
        var _this=this;
        _this.data.getphone ? _this.setData({getphone:false}):_this.setData({getphone:true});
    },

	//协议
	protocolChange:function(){
		var _this=this;
		_this.data.protocolChecked ? _this.setData({protocolChecked:false}):_this.setData({protocolChecked:true});
		console.log(_this.data.protocolChecked);
	},
  tapJump: function (e) {
    if (e.currentTarget.dataset.link.jump_college_information_id !== "0" && e.currentTarget.dataset.link.jump_college_information_id !== "") {
      wx.navigateTo({
        url: '/pages/newsDetail/index?id=' + e.currentTarget.dataset.link.jump_college_information_id
      })
    }
  }

})
