//获取应用实例
var app = getApp();
var common = require('../../package/common.js'); //调用模块
Component({
  lifetimes: {
    // attached() {
    //   // 在组件实例进入页面节点树时执行
    // },
    // detached() {
    //   // 在组件实例被从页面节点树移除时执行
    // },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    // 在组件实例进入页面节点树时执行
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  properties: {
    paythis: {
      type: Object
    }
  },
  data: {
    // 这里是一些组件内部数据
  },

  methods: {
  }
})