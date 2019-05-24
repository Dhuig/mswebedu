Component({
  lifetimes: {
    // attached() {
    //   // 在组件实例进入页面节点树时执行
    //   for (var i = 0; i < this.data.list.length; i++) {
    //     var up = "list[" + i + "].status"
    //     this.setData({ [up]: false })
    //     if (this.data.list[i].content === this.data.stylestatus) {
    //       this.setData({ [up]: true })
    //     }
    //   }
    // },
    // detached() {
    //   // 在组件实例被从页面节点树移除时执行
    // },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    for (var i = 0; i < this.data.list.length; i++) {
      var up = "list[" + i + "].status"
      this.setData({ [up]: false })
      if (this.data.list[i].content === this.data.stylestatus) {
        this.setData({ [up]: true })
      }
    }
    // 在组件实例进入页面节点树时执行
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
  properties: {
    inputPlaceHalder: {
      type: String,
      value: ' ',
    },
    stylestatus: {
      type: String,
      value: ''
    }

  },
  data: {
    // 这里是一些组件内部数据
    inputValue: "",
    onCancleClick: false,
    list:[
      { content: "高考资讯", status: false},
      { content: "志愿顺序", status: false},
      { content: "院校列表", status: false},
      { content: "收藏夹", status: false}
    ]
  },

  methods: {
    //导航链接跳转
    newsLinkTap: function (e) {
      for (var i = 0; i<this.data.list.length;i++){
        var up = "list[" + i + "].status"
        this.setData({ [up]: false })
        if (this.data.list[i].content === e.currentTarget.dataset.content.content) {
          if (this.data.list[i].content === "高考资讯") {
            wx.reLaunch({
              url: '/pages/newsList/index'
            })
          } else if (this.data.list[i].content === "志愿顺序") {
            var memberUser = wx.getStorageSync('memberUser');
            if (memberUser.before_score.length < 3) {
              wx.showModal({
                title: '提示',
                content: '需要先提交分数',
                showCancel: false,
                success: function (res) {
                  wx.reLaunch({
                    url: '/pages/schoolQuery/index'
                  })
                }
              });
            } else {
              wx.reLaunch({
                url: '/pages/order/index'
              })
            }

          } else if (this.data.list[i].content === "院校列表") {
            wx.reLaunch({
              url: '/pages/teacherList/index'
            })
          } else if (this.data.list[i].content === "收藏夹") {
            wx.reLaunch({
              url: '/pages/collect/index'
            })
          }
        }
      }
    }
  }
})