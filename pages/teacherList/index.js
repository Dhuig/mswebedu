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

	  cid:0,            //院校id
	  schoolList:[],    //院校列表
	  dataArr:[],    //教师列表
	  page:1,             //分页
	  selectState:'all',   //字母锚点
	  page:1,
	  initials:"A",
	  pageState:"",
	  anchor:[
         {name:"A","current":true},
         {name:"B","current":false},
         {name:"C","current":false},
         {name:"D","current":false},
         {name:"E","current":false},
         {name:"F","current":false},
         {name:"G","current":false},

         {name:"H","current":false},
         {name:"I","current":false},
         {name:"J","current":false},
         {name:"K","current":false},
         {name:"L","current":false},
         {name:"M","current":false},
         {name:"N","current":false},

         {name:"O","current":false},
         {name:"P","current":false},
         {name:"Q","current":false},

         {name:"R","current":false},
         {name:"S","current":false},
         {name:"T","current":false},

         {name:"U","current":false},
         {name:"V","current":false},
         {name:"W","current":false},
         {name:"X","current":false},
         {name:"Y","current":false},
         {name:"Z","current":false}
    ],
    vipbecome: false,
    vipbtn: false,
    paythis: null
	},
	
	//监听页面加载
	onLoad: function (e) {
	  console.log('onLoad');
	  var _this=this;
	  common.schoolPage.userInfo(_this);
    common.teacherPage.schoolList(_this);
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
		var _this=this;
		console.log("上拉加载");
		if(_this.data.pageState=="end") return false;
		common.teacherPage.schoolList(_this);
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

	
	//院校切换
	schoolTap:function(e){
		var _this=this;	
		var id=e.currentTarget.dataset.id;
		_this.setData({ cid:id,page:1,dataArr:[],pageState:"" });
	    common.teacherPage.teacherList(_this);

	   //当前菜单高亮
	   var pidx=e.currentTarget.dataset.pidx; 
	   var index=e.currentTarget.dataset.index;
	   var arr= _this.data.schoolList;
	   for(var i=0;i<arr.length;i++){
	   	  (function(i){
	   	  	 for(var x=0;x<arr[i].college.length;x++){
	   	  	 	(function(x){
	   	  	 		arr[i].college[x].state=0;
	   	  	 	})(x)
	   	  	 }
	   	  })(i)
	   }
	   arr[pidx].college[index].state=1
	   _this.setData({ schoolList:arr});
	},

	//锚点
	anchor:function(e){
		var _this=this;	
		var anchor=e.currentTarget.dataset.anchor;
		var index=e.currentTarget.dataset.index;
		_this.setData({initials:anchor,page:1,dataArr:[],pageState:''});
    	common.teacherPage.schoolList(_this);

    	var arr=_this.data.anchor;
    	for(var x=0;x<arr.length;x++){
   	  	 	(function(x){
   	  	 		arr[x].current=false;
   	  	 	})(x)
   	  	 }
   	  	 console.log(arr);
   	  	 console.log(index);
   	  	 arr[index].current=true;
   	  	 _this.setData({anchor:arr});
	},

	//教师详情
	teacherTap:function(e){
		var id=e.currentTarget.dataset.id;
		wx.navigateTo({
		  url: '/pages/teacherDetail/index?tid='+id
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
  },

	//点击收藏
	collectTap:function(e){
		console.log(e);
		var _this=this;
		var id=e.currentTarget.dataset.id;
		var pidx=e.currentTarget.dataset.pidx;
		var index=e.currentTarget.dataset.index;
		common.teacherPage.collect(_this,id,pidx,index);
	},

	//折叠
	foldTap:function(e){
		var _this=this;
		var pidx=e.currentTarget.dataset.pidx;
		var index=e.currentTarget.dataset.index;
		var arr=_this.data.dataArr;

		/*
		for(var i=0;i<arr.length;i++){
			(function(i){
				for(var x=0;x<arr[i].college.length;x++){
					arr[i].college[x].state=0;
				}
			})(i)
		}*/

		arr[pidx].college[index].state==0 ? arr[pidx].college[index].state=1 : arr[pidx].college[index].state=0;
		_this.setData({
			dataArr:arr
  		});
  },
  vipclose: function () {
    this.setData({ vipbtn: false })
  }
	
})
