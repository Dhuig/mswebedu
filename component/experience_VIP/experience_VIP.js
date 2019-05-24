//获取应用实例
var app = getApp();
var common = require('../../package/common.js'); //调用模块
Component({
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    // 在组件实例进入页面节点树时执行  
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  properties: {
    status:{
      type: Boolean,
      value:false
    }
  },
  data: {
    // 这里是一些组件内部数据
    onCancleClick: false,
    temp_vip_name: "", //姓名
    temp_vip_phone: "" //手机号
  },
  methods: {
    // 输入值
    bindInputphone: function (e) {
      this.setData({ temp_vip_phone: e.detail.value})
    },
    // 输入值
    bindInputname: function (e) {
      this.setData({ temp_vip_name: e.detail.value })
    },

    // 这里是一个自定义方法,取消
    cancleBtn: function () {
      this.triggerEvent('customevent', {}, { bubbles: true }) // 会依次触发 
      this.setData({ status: false })
      this.setData({
        temp_vip_phone: "",
        temp_vip_name:""
      })

    },
    regular: function (phone) {
      let phoneCodeVerification = /^[1][3,4,5,7,8][0-9]{9}$/;
      return phoneCodeVerification.test(phone);
    },
    formSubmit: function (e) {
      var _this=this
      common.schoolPage.userInfo(_this)//获取member数据
      for (var i in e.detail.value) {
        if (_this.data[i].trim() === "") {
          var stringes = i === "temp_vip_name" ? "姓名不能为空" :"手机号码不能为空！"
          wx.showToast({
            title: stringes,
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }
      if (!_this.regular(e.detail.value.temp_vip_phone)) {
        wx.showToast({
          title: '请输入正确的手机号码！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      e.detail.value.member_id = _this.data.id
      common.msgkindex.vipbecom(_this, e.detail.value, function (res) {
        _this.setData({ status: false })
        if (res.code === 201) {
          _this.triggerEvent('close', {}, { bubbles: true }) // 会依次触发 
        }
      })
    },
    experienceTab: function () {
      this.setData({ status: true })
    }
  }
})