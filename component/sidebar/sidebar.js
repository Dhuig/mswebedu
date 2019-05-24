//获取应用实例
var app = getApp();
var common = require('../../package/common.js'); //调用模块
Component({
  lifetimes: {
    show() {
      // 页面被展示
      console.log(123)
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    // 在组件实例进入页面节点树时执行
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  observers:{
    "paythis":function(e){
      this.setData(e)
      // console.log(e)
    }
  },
  properties: {
    paythis: {
      type: Object
    }
  },
  data: {
    // 这里是一些组件内部数据
    avatarUrl: '',     //用户头像
    avatarName: "",    //用户名称 
  },

  methods: {
    //侧栏弹出
    sideTap: function () {
      var _this = this;
      this.triggerEvent('display', {}, { bubbles: true }) // 会依次触发
      // _this.data.sideShow ? _this.setData({ sideShow: false }) : _this.setData({ sideShow: true });
    },
    withdrawLink1Tap: function () {
      wx.reLaunch({
        url: '/pages/withdraw/index'
      })
    },
    recommendLinkTap: function () {
      wx.reLaunch({
        url: '/pages/recommend/index'
      })
    },
    expenditureLinkTap: function () {
      wx.reLaunch({
        url: '/pages/expenditure/index'
      })
    },
    withdrawLink2Tap: function () {
      wx.reLaunch({
        url: '/pages/withdrawRecord/index'
      })
    },
    aboutLinkTap: function () {
      wx.reLaunch({
        url: '/pages/about/index'
      })
    },
    posterLinkTap: function () {
      wx.reLaunch({
        url: '/pages/poster/index'
      })
    },
    volunteerLink2Tap: function () {
      wx.reLaunch({
        url: '/pages/volunteer/index'
      })
    },
    versionUp2Tap: function () {
      wx.reLaunch({
        url: '/pages/version/index'
      })
    },
    tipPopTap: function () {
      var _this = this;
      if (_this.data.groups_status == 1) {
        wx.reLaunch({
          url: '/pages/cluster/index'
        })
        return false;
      }
      console.log(this.data)
      this.triggerEvent('tipPopTap', {}, { bubbles: true }) // 会依次触发 
      // _this.data.tipPop ? _this.setData({ tipPop: false, sideShow: false }) : _this.setData({ tipPop: true, sideShow: false });
    }
  }
})