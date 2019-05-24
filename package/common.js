


var app = getApp();

var Common={
	
	//公共ajax
	ajaxCommon:function(url,data,callback,_this){
		var memberUser=wx.getStorageSync('member');
		data.token_session_id=memberUser.token_session_id || 0;
		data.member_id=memberUser.member_id || 0;
		wx.request({
			  url: app.globalData.url+url, //仅为示例，并非真实的接口地址
			  data:data,
			  method:"POST",
			  success: function(msg) {
				    if(msg.data.code==200){
				  		if(typeof callback=="function") callback(msg.data);
					}else if(msg.data.code==203){
						wx.showModal({
							  title: '提示',
							  content:msg.data.msg,
							  showCancel:false,
							  success: function(res) {}
						 });
					}else if(msg.data.code==210){
						wx.showModal({
							  title: '提示',
							  content:msg.data.msg,
							  showCancel:false,
							  success: function(res) {
							  	_this.setData({tipPop:true,sideShow:false});	
							  }
						 });
					}else if(msg.data.code==909){
						_this.setData({"authPop":"true"});
					}else{
						wx.showToast({
						  title: msg.data.msg,
						  icon: 'success',
						  duration: 1500
						})
					}
			  },
			  fail:function(){
			  	 wx.showModal({
					  title: '提示',
					  content:'请求失败',
					  showCancel:false,
					  success: function(res) {}
				 });
			  }
		});	
  },
  // 请求
  axioscommon: function (url, type, data, callback) {
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: data,
      method: type,
      success: function (msg) {
        if (typeof callback == "function") callback(msg.data);
        if (msg.data.code == 200) {
        } else if (msg.data.code == 203) {
          wx.showModal({
            title: '提示',
            content: msg.data.msg,
            showCancel: false,
            success: function (res) { }
          });
        } else if (msg.data.code == 210) {
          wx.showModal({
            title: '提示',
            content: msg.data.msg,
            showCancel: false,
            success: function (res) {

            }
          });
        } else if (msg.data.code == 909) {

        } else {
          wx.showToast({
            title: msg.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '请求失败',
          showCancel: false,
          success: function (res) { }
        });
      }
    });
  },

	//是否授权
	authIf:function(_this){
		Common.ajaxCommon('/index.php?s=/Home/index/getAuth',{},function(data){
			_this.setData({"authPop":"false"});
	        Common.memberInfo(_this,1);
		},_this);
	},

	//授权登陆
	login:function(_this,res){
			wx.showToast({
			  title:"授权中...",
			  icon: 'success',
			  duration: 15000
			});
			wx.login({    
			  success: function(config){   	
				  if(config.code) {

					  //获取 会员信息		
					  Common.userUpload(_this,config.code,res.detail);  
							  

				  }else {  
					  //console.log('获取用户登录态失败！' + res.errMsg)  

				  }  
				  wx.hideToast()          
			  },
			  fail:function(){
				  //console.log("login失败");	
				  wx.hideToast()
			  }
				  
		   }); 
	},
	
	//获取 微信unionid 和 会员member_id
	userUpload:function(_this,code,info){
	    var zid=wx.getStorageSync('zid');
	    var scene=wx.getStorageSync('scene');
		Common.ajaxCommon('/index.php?s=/Home/index/login',{code:code,userInfo:info,invited_member:scene || zid || 0},function(data){
				
			//存储会员ID
			wx.setStorageSync('member', data.info);
			Common.memberInfo(_this,1);
			
		},_this);
	},

	//会员信息
	memberInfo:function(_this,type){
		Common.ajaxCommon('/index.php?s=/Home/index/getMemberInfo',{ type:type || 0  },function(data){
			wx.setStorageSync('memberUser', data.info);
			Common.schoolPage.userInfo(_this);
      Common.schoolPage.address(_this);
      if (_this.data.invited_id !== null && _this.data.invited_id !== undefined) {
        var data = {
          invited_id: _this.data.invited_id,
          member_id: wx.getStorageSync('memberUser').id
        }
        Common.invite(_this, data)
      }
      if (_this.data.zid !== null && _this.data.zid !== undefined) {
        var data = {
          invited_id: _this.data.zid,
          member_id: wx.getStorageSync('memberUser').id
        }
        Common.invite(_this, data)
      }
		},_this);
	},

    //检测会员手机号绑定
    memberBindPhone:function(_this,res){
        wx.login({
            success: function(config) {
                var zid=wx.getStorageSync('zid');
                var scene=wx.getStorageSync('scene');
                //获取 用户手机号绑定信息
                var info =res.detail;
                var code = config.code;
                Common.ajaxCommon('/index.php?s=/Home/index/getBindPhone',{code:code,getphonenumber:info,invited_member:scene || zid || 0},function(data){

                    //console.log(data);
                    //存储会员ID
                    // wx.setStorageSync('phonebindnumber', data.info);
                    if(data.code==200){
                        _this.setData({getphone:false});
                        Common.schoolPage.querySubmit(_this,0);
                    }

                },_this);
            }
        });

    },

	//学校页
	schoolPage:{

		//用户信息
		userInfo:function(_this,boole){
			var memberUser=wx.getStorageSync('memberUser');
			_this.setData({
				id:memberUser.id,
				avatarUrl:memberUser.avatar,
				avatarName:memberUser.nickname,
				vipState:memberUser.group,
				groups_status:memberUser.groups_status,
				money:memberUser.buy_vip,
				full_money:memberUser.buy_full_vip,
				bill_image:memberUser.bill_image,
				bill_qrcode:memberUser.bill_qrcode,
				member:memberUser,
				authPop:"false"
			});
			//if(_this.data.payType!=0) Common.clusterPage.getId(_this);
		},

		//地理位置
		address:function(_this){
			var member=wx.getStorageSync('member');
			if(member.member_info.is_pos==1) return false;
			wx.getLocation({
			  type: 'wgs84',
			  success: function(res) {
			  	//console.log(res);
			    var latitude = res.latitude;
			    var longitude = res.longitude;
			    var xy=latitude+","+longitude;
			    Common.ajaxCommon('/index.php?s=/Home/index/save_address',{ latlng:xy },function(data){});
			  }
			})
		},

        //点击判断是否已绑定手机
        checkPhone:function(_this,boole){
            Common.ajaxCommon('/index.php?s=/Home/index/checkBindPhone',{},function(data){
                //console.log(data);
                if(data.info.hasphone==1){
                    _this.setData({getphone:false});
                    Common.schoolPage.querySubmit(_this,0);
                }else{
                    _this.setData({getphone:true});
                }
            },_this);
        },

		//点击判断
		querySubmit:function(_this,boole){
			var memberUser=wx.getStorageSync('memberUser');
			if(boole==0){
				if(_this.data.score.length<3 || _this.data.score>1000){
					wx.showModal({
						  title: '提示',
						  content: '请输入考试成绩',
						  showCancel:false,
						  success: function(res) {

						  }
					 });	
					return false;
				}else if(_this.data.course.length==0){
					wx.showModal({
						  title: '提示',
						  content: '请勾选“文科生”或“理科生”',
						  showCancel:false,
						  success: function(res) {

						  }
					 });
					return false;
				}
				Common.schoolPage.queryAjax(_this);
			}else{
				if(memberUser.have_queries!=0 && memberUser.group==1){
					//console.log(memberUser.have_queries);
					if(_this.data.quantity[0]!=6 || _this.data.quantity[1]!=5 || _this.data.quantity[2]!=4){
						wx.showModal({
							  title: '提示',
							  content: "您还有"+memberUser.have_queries+"次VIP查询机会，点击确认将显示当前考试成绩的志愿推荐结果",
							  showCancel:true,
							  confirmText:"推荐志愿",
							  cancelText:"关闭弹窗",
							  success: function(res) {
							  	  if (res.confirm){
							  	  	Common.schoolPage.queryAjax(_this);
							  	  }else{
							  	  	_this.setData({quantity:[6,5,4], checked:0})
							  	  } 
							  }
						 });	
					}else{
						Common.schoolPage.queryAjax(_this);
					}
				}else{
					Common.schoolPage.queryAjax(_this);
				}
				
			}

			
		},

		//查询
		queryAjax:function(_this){
			var member=wx.getStorageSync('member');
			wx.request({
				  url: app.globalData.url+'/index.php?s=/Home/index/pssScore', //仅为示例，并非真实的接口地址
				  data:{
				  	token_session_id:member.token_session_id || 0,
				  	score:_this.data.score,
				  	course:_this.data.course,

				  	is_local:_this.data.checked,
					spurt:_this.data.quantity[0],
				  	steady:_this.data.quantity[1],
				  	keep:_this.data.quantity[2]
				  },
				  method:"POST",
				  success: function(msg) {
					  if(msg.data.code==200){

					  		//存储学校列表
							wx.setStorageSync('school', msg.data.info);

							wx.reLaunch({
							  url: '/pages/schoolResult/index'
							})
						}else if(msg.data.code==500){
							wx.showModal({
								  title: '提示',
								  content: msg.data.msg,
								  showCancel:true,
								  success: function(res) {
								  	  if (res.confirm){ 
								  	  	Common.schoolPage.queryPay(_this)
								  	  }else{
								  	  	_this.setData({quantity:[6,5,4], checked:0})
								  	  }
								  	  
								  }
							 });
						}else if(msg.data.code==400){
							wx.showModal({
								  title: '提示',
								  content: msg.data.msg,
								  showCancel:true,
								  success: function(res) {
								  	  if (res.confirm){ 
								  	  	_this.setData({tipPop:true});
								  	  }else{
								  	  	_this.setData({quantity:[6,5,4], checked:0})
								  	  }
								  }
							 });
						}else{
							wx.showToast({
							  title: msg.data.msg,
							  icon: 'success',
							  duration: 1500
							})
						}
				  },
				  fail:function(){
				  	 wx.showModal({
						  title: '提示',
						  content: "请求失败",
						  showCancel:false,
						  success: function(res) {}
					 });
				  }
			});	
		},

		//购买查询次数
		queryPay:function(_this){
			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
			Common.ajaxCommon('/index.php?s=/Group/pay',{ pay_type:10 },function(data){
				//微信支付
				var config=data.info
				config.success=function(res){
					_this.setData({ajaxStops:false});
					wx.showModal({
						  title: '提示',
						  content: "支付成功！您获得1次VIP查询次数",
						  showCancel:false,
						  success: function(res) {

						  }
					});
			    }
			    config.fail=function(res){
			    	  _this.setData({ajaxStops:false});
				   	  wx.showModal({
						  title: '提示',
						  content: "您已取消支付",
						  showCancel:false,
						  success: function(res) {}
					 });
				}
				wx.requestPayment(config);
			});
		},

		//查询结果
		schoolList:function(_this){
			var school=wx.getStorageSync('school');
			//console.log(school)
			var schoolArr=[];
			for(var i=0;i<school.spurt_list.length;i++){
				(function(i){
					school.spurt_list[i].abc=0;
					schoolArr.push(school.spurt_list[i]);
				})(i)
			}
			
			for(var i=0;i<school.steady_list.length;i++){
				(function(i){
					school.steady_list[i].abc=2;
					schoolArr.push(school.steady_list[i]);
				})(i)
			}
			for(var i=0;i<school.keep_list.length;i++){
				(function(i){
					school.keep_list[i].abc=1;
					schoolArr.push(school.keep_list[i]);
				})(i)
			}
			//console.log(schoolArr);
			_this.setData({
				dataArr:schoolArr
			})
		},

		//学校详情
		schoolDetail:function(_this){

			Common.ajaxCommon('/index.php?s=/Home/index/getAcademyInfo',{code:_this.data.code || 0},function(data){
				_this.setData({
		  			schoolInfo:data.info.academy_info,
		  			recruit:data.info.academy
		  			
		  		})

			});
		},

		//学校专业
		schoolSpecialty:function(_this){
			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
			Common.ajaxCommon('/index.php?s=/Home/index/getCourseInfo',{code:_this.data.code || 0,page:_this.data.page || 1,is_debug:1},function(data){
				_this.data.dataArr=_this.data.dataArr.concat(data.info.course);
				_this.setData({
					page:_this.data.page+1,
		  			dataArr:_this.data.dataArr,
		  			year:data.info.year,
		  			ajaxStops:false
		  		})
				if(data.info.course.length < data.info.page.page_num){
		  			_this.setData({
			  			pageState:"end"
			  		});
		  		}
			});
		},

		//院校列表和专业列表 收藏
		collect:function(_this,id,index,type,collect){

			Common.ajaxCommon('/index.php?s=/Collection/save',{id:id,type:type},function(data){
				var arr=_this.data.dataArr;
				arr[index].collection=data.info.collection;
				_this.setData({
					dataArr:arr
		  		});
		  		wx.showToast({
				  title: data.msg,
				  icon: 'success',
				  duration: 1500
				})
			});

		},

		//单个院校收藏
		collect2:function(_this,id){

			Common.ajaxCommon('/index.php?s=/Collection/save',{id:id,type:1},function(data){
				var schoolInfo=_this.data.schoolInfo;
				schoolInfo.collection=data.info.collection;
				_this.setData({
					schoolInfo:schoolInfo
		  		});
		  		wx.showToast({
				  title: data.msg,
				  icon: 'success',
				  duration: 1500
				})
			});

		}


	},

	//公共单页面
	commonPage:{
        versionMsg:function(_this,boole){
            Common.ajaxCommon('/index.php?s=/Home/resources/version',{},function(data){
                //console.log(data);
				_this.setData({version:data.info.value});
            },_this);
        },
	},

	//教师页
	teacherPage:{

		//院校列表
		schoolList:function(_this){
			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
			Common.ajaxCommon('/index.php?s=/College/coll_teach',{is_new:1,page:_this.data.page,initials:_this.data.initials},function(data){
				_this.data.dataArr=_this.data.dataArr.concat(data.info.college);
				_this.setData({
		  			dataArr:_this.data.dataArr,
		  			page:_this.data.page+1,
		  			ajaxStops:false
		  		});

		  		if(data.info.page.now_page == data.info.page.total_page || data.info.page.total_page==0){
		  			_this.setData({
			  			pageState:"end"
			  		});
		  		}
			});

		},

		//教师详情
		teacherDetail:function(_this,app){

			Common.ajaxCommon('/index.php?s=/College/detail',{id:_this.data.tid || 0},function(data){
				var config=data.info;
				config.information= app.convertHtmlToText(config.information);
				_this.setData({
		  			detail:config
		  		});
		  		 
			});

		},

		//院校列表 收藏
		collect:function(_this,id,pidx,index){

			Common.ajaxCommon('/index.php?s=/Collection/tch_coll',{college_name:id},function(data){
				var arr=_this.data.dataArr;
				//console.log(arr[pidx].college);
				arr[pidx].college[index].collection=data.info.collection;
				_this.setData({
					dataArr:arr
		  		});
		  		wx.showToast({
				  title: data.msg,
				  icon: 'success',
				  duration: 1500
				})
			});

		},

	},

	//新闻页
	newsPage:{

		//新闻列表 或 视频列表
        list:function(_this){
        	if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
        	Common.ajaxCommon('/index.php?s=/Resources/index',{page:_this.data.page,type:_this.data.type},function(data){

        		_this.data.dataArr=_this.data.dataArr.concat(data.info.data);
				_this.setData({
		  			dataArr:_this.data.dataArr,
		  			page:_this.data.page+1,
		  			ajaxStops:false
		  		});
		  		if(data.info.data.length < data.info.page.page_num){
		  			_this.setData({
			  			pageState:"end"
			  		});
		  		}
			});
        },

        //新闻详情
        newsDetail:function(_this){
        	Common.ajaxCommon('/index.php?s=/Resources/info_detail',{id:_this.data.id},function(data){
				_this.setData({
		  			detail:data.info
		  		});
		  		//console.log( _this.data.detail.content);
		  		//WxParse.wxParse('article', 'html', _this.data.detail.content ,_this,0);
			});
        },

        //视频详情
        videoDetail:function(_this){
        	Common.ajaxCommon('/index.php?s=/Resources/vedio_detail',{id:_this.data.id},function(data){
				_this.setData({
		  			detail:data.info
		  		});
			});
        }

	},

	//支付，提现，消费页
	payPage:{

		//全额支付
		vipPay:function(_this){
			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
			Common.ajaxCommon('/index.php?s=/Group/pay',{ pay_type:20 },function(data){
				
				//微信支付
				var config=data.info
				config.success=function(res){
					    _this.setData({ajaxStops:false});
						wx.showModal({
						  title: '提示',
						  content: "支付成功",
						  showCancel:false,
						  success: function(res) {
						  	  wx.reLaunch({
								  url: '/pages/vip/index'
							  })
						  }
					   });
			    }
			    config.fail=function(res){
			    	 _this.setData({ajaxStops:false});
				   	 wx.showModal({
						  title: '提示',
						  content: "您已取消支付",
						  showCancel:false,
						  success: function(res) {}
					 });
				}
				wx.requestPayment(config);
			});

		},

		//我要提现
		withdrawSubmit:function(_this){
			if(_this.data.money2.length==0){
				wx.showModal({
					  title: '提示',
					  content: '请输入提现金额',
					  showCancel:false,
					  success: function(res) {

					  }
				 });
				return false;
			}else if(_this.data.money2>_this.data.member.commission){
				wx.showModal({
					  title: '提示',
					  content: '超出提现金额',
					  showCancel:false,
					  success: function(res) {

					  }
				 });
				return false;
			}else if(_this.data.money2==0){
				wx.showModal({
					  title: '提示',
					  content: '提现金额不能为0',
					  showCancel:false,
					  success: function(res) {

					  }
				 });
				return false;
			}else if(_this.data.name.length==0){
				wx.showModal({
					  title: '提示',
					  content: '请输入您的姓名',
					  showCancel:false,
					  success: function(res) {

					  }
				 });
				return false;
			}else if(_this.data.mobile.length!=11){
				wx.showModal({
					  title: '提示',
					  content: '请输入11位手机号码',
					  showCancel:false,
					  success: function(res) {

					  }
				 });
				return false;
			}
			Common.ajaxCommon('/index.php?s=/Consume/withdraw',{money:_this.data.money2,name:_this.data.name,mobile:_this.data.mobile},function(data){
				wx.showModal({
					  title: '提示',
					  content: data.info,
					  showCancel:false,
					  success: function(res) {
					  	wx.reLaunch({
						  url: '/pages/withdrawRecord/index'
						})
					  }
				 });
			});
		},

		//提现记录
		withdrawRecord:function(_this){
			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
			Common.ajaxCommon('/index.php?s=/Consume/withdraw_list',{page:_this.data.page},function(data){
				_this.data.dataArr=_this.data.dataArr.concat(data.info.data);
				_this.setData({
		  			dataArr:_this.data.dataArr,
		  			page:_this.data.page+1,
		  			ajaxStops:false
		  		});
		  		if(data.info.data.length < data.info.page.page_num){
		  			_this.setData({
			  			pageState:"end"
			  		});
		  		}
			});
		},

		//消费记录
		expenditureRecord:function(_this){
			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
			Common.ajaxCommon('/index.php?s=/Consume/consume',{page:_this.data.page,type:_this.data.type},function(data){
				_this.data.dataArr=_this.data.dataArr.concat(data.info.data);
				_this.setData({
		  			dataArr:_this.data.dataArr,
		  			page:_this.data.page+1,
		  			ajaxStops:false
		  		});
		  		if(data.info.data.length < data.info.page.page_num){
		  			_this.setData({
			  			pageState:"end"
			  		});
		  		}
			});
		},

		//推荐记录
		recommendRecord:function(_this){
			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
			Common.ajaxCommon('/index.php?s=/Consume/recommend',{page:_this.data.page},function(data){
				_this.data.dataArr=_this.data.dataArr.concat(data.info.data);
				_this.setData({
		  			dataArr:_this.data.dataArr,
		  			page:_this.data.page+1,
		  			ajaxStops:false
		  		});
		  		if(data.info.data.length < data.info.page.page_num){
		  			_this.setData({
			  			pageState:"end"
			  		});
		  		}
			});
		}

	},


    //开团页
	clusterPage:{

		//初始dom
		dom:function(_this){

			var member=wx.getStorageSync('member');
			wx.request({
				  url: app.globalData.url+'/index.php?s=/Group/group', //仅为示例，并非真实的接口地址
				  data:{
				  	token_session_id:member.token_session_id || 0,
				  	group_id:_this.data.ctid || 0
				  },
				  method:"POST",
				  success: function(msg) {
					  if(msg.data.code==200){
					  		_this.setData({
								dom:msg.data.info,
								ctid:msg.data.info.group_id
					  		});
						}else{
							wx.showToast({
							  title: msg.data.msg,
							  icon: 'success',
							  duration: 1500
							})
						}
				  },
				  fail:function(){
				  	 wx.showModal({
						  title: '提示',
						  content: "请求失败",
						  showCancel:false,
						  success: function(res) {}
					 });
				  }
			});	
		},
        
        //开团
		creation:function(_this){
			if(_this.data.dom.state==0) _this.setData({payType:30});
			if(_this.data.dom.state==1) _this.setData({payType:50});
			if(_this.data.dom.state==3) _this.setData({payType:40});

			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});

			Common.ajaxCommon('/index.php?s=/Group/pay',{ pay_type:_this.data.payType,group_id:_this.data.ctid },function(data){
				
				//微信支付
				var config=data.info
				config.success=function(res){
					   _this.setData({ajaxStops:false});
					   wx.showModal({
						  title: '提示',
						  content: "支付成功",
						  showCancel:false,
						  success: function(res) {
						  	  Common.clusterPage.getId(_this);
						  	  Common.memberInfo(_this,1);
						  }
					   });
			    }
			    config.fail=function(res){
			    	   _this.setData({ajaxStops:false});
				   	   wx.showModal({
						  title: '提示',
						  content: "您已取消支付",
						  showCancel:false,
						  success: function(res) {}
					 });
				}
				wx.requestPayment(config);
			});
		},

		//支付成功，获取团id
		getId:function(_this){
			Common.ajaxCommon('/index.php?s=/Group/group',{group_id:_this.data.ctid},function(data){
				
		  		if(data.info.state==2){
		  			 wx.showModal({
						  title: '提示',
						  content: "组团成功，恭喜成为VIP",
						  showCancel:false,
						  success: function(res) {
						  	 wx.reLaunch({
							  url: '/pages/vip/index'
							})
						  }
					 });
		  			
		  		}else{
		  			_this.setData({
						dom:data.info,
						ctid:data.info.group_id
			  		});
		  		}
			});
		}

	},


	//我的海报页
	posterPage:{

		dom:function(_this){
			Common.ajaxCommon('/index.php?s=/Resources/poster',{},function(data){
        console.log(data)
	  			 _this.setData({
					image:data.info.poster,
		  		});
			});
		}

	},

	//我的收藏页
	collectPgae:{

		//收藏列表
		list:function(_this){
			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
			Common.ajaxCommon('/index.php?s=/Collection/my',{page:_this.data.page},function(data){

				_this.data.dataArr=_this.data.dataArr.concat(data.info.data);
				//console.log(_this.data.dataArr);
				_this.setData({
		  			dataArr:_this.data.dataArr,
		  			page:_this.data.page+1,
		  			ajaxStops:false
		  		});

		  		if(data.info.data.length < data.info.page.page_num){
		  			_this.setData({
			  			pageState:"end"
			  		});
		  		}
			});
		},

		//院校列表收藏
		collect:function(_this,id,index){

			Common.ajaxCommon('/index.php?s=/Collection/my_coll',{id:id},function(data){
				var arr=_this.data.dataArr;
				arr[index].collection=data.info.collection;
				_this.setData({
					dataArr:arr
		  		});
		  		wx.showToast({
				  title: data.msg,
				  icon: 'success',
				  duration: 1500
				})
			});

		},

		//专业列表 收藏
		collect2:function(_this,id,pidx,index){

			Common.ajaxCommon('/index.php?s=/Collection/my_coll',{id:id},function(data){
				var arr=_this.data.dataArr;
				arr[pidx].course[index].collection=data.info.collection;
				_this.setData({
					dataArr:arr
		  		});
		  		wx.showToast({
				  title: data.msg,
				  icon: 'success',
				  duration: 1500
				})
			});

		},

		//生成志愿
		volunteer:function(_this){
			if(_this.data.checkedArr.length==0){
				wx.showModal({
					  title: '提示',
					  content: "请勾选院校",
					  showCancel:false,
					  success: function(res) {}
				 });
				return false;
			}else if(_this.data.checkedArr.length>15){
				wx.showModal({
					  title: '提示',
					  content: "勾选的院校个数不能大于15个",
					  showCancel:false,
					  success: function(res) {}
				 });
				return false;
			}


			Common.ajaxCommon('/index.php?s=/Collection/table',{id:_this.data.checkedArr},function(data){
				//console.log(data);
				_this.setData({volunteerPop:false,sideShow:false});	
				wx.showToast({
				  title: data.msg,
				  icon: 'success',
				  duration: 1500
				});
				setTimeout(function(){
					wx.reLaunch({
					  url: '/pages/volunteer/index'
					})
				},1500);
		  		
			},_this);
			
		}

	},


	//志愿页
	volunteerPage:{

		//志愿列表
		list:function(_this){
			Common.ajaxCommon('/index.php?s=/Collection/my_table',{page:_this.data.page},function(data){
				_this.setData({
		  			dataArr:data.info
		  		});
			});
		},

		//删除志愿
		del:function(_this,id){
			Common.ajaxCommon('/index.php?s=/Collection/del_table',{id:id},function(data){
				wx.showToast({
				  title: data.msg,
				  icon: 'success',
				  duration: 1500
				});
				setTimeout(function(){
					wx.reLaunch({
					  url: '/pages/volunteer/index'
					});
				},1500)
				
			});
		},

		//详情
		detail:function(_this,id){
			Common.ajaxCommon('/index.php?s=/Collection/table_detail',{id:id},function(data){
				_this.setData({
		  			dataArr:data.info.academy,
		  			tableInfo:data.info.table_info
		  		});
			});
		},

		//编辑名称
		edit:function(_this){
			if(_this.data.name.length==0){
				wx.showModal({
					  title: '提示',
					  content:'志愿表名称不能为空',
					  showCancel:false,
					  success: function(res) {

					  }
				 });
				return false;
			}
			Common.ajaxCommon('/index.php?s=/Collection/rename',{id:_this.data.id,name:_this.data.name},function(data){
				wx.showToast({
				  title: data.msg,
				  icon: 'success',
				  duration: 1500
				});
				setTimeout(function(){
					wx.reLaunch({
					  url: '/pages/volunteer/index'
					});
				},1500)
				
			});
		}
	},

	//学校排名
	rankingPage:{

		list:function(_this){
			if(_this.data.ajaxStops) return false;
			_this.setData({ajaxStops:true});
			Common.ajaxCommon('/index.php?s=/index/academyRanking',{is_local:_this.data.is_local,page:_this.data.page,type:_this.data.type},function(data){
				_this.data.dataArr=_this.data.dataArr.concat(data.info.list);
				_this.setData({
					info:data.info.info,
		  			dataArr:_this.data.dataArr,
		  			page:_this.data.page+1,
		  			ajaxStops:false
		  		});
		  		if(data.info.list.length < data.info.page.page_num){
		  			_this.setData({
			  			pageState:"end"
			  		});
		  		}
			});
		}

  },
  // 首页
  msgkindex: {
    // 获取轮播图数据
    swiperData: function (_this) {
      Common.axioscommon('https://gk2.mingshiedu.com/index.php?s=/Home/index/banner', "get", {}, function (res) {
        _this.setData({ imgUrls: res.info })
      })
    },
    // 体验3天VIP
    vipbecom: function (_this, data, callback) {
      Common.axioscommon('https://gk2.mingshiedu.com/index.php?s=/Home/index/tempVip', "get", data, function (res) {
        if (typeof callback == "function") callback(res);
      })
    }
  },
  //判断是否是 Vip
  vipJudge:function(_this){
    console.log(wx.getStorageSync('memberUser'))
    if (wx.getStorageSync('memberUser').group === "0"){
      _this.setData({ vipbtn:true})
    }
  },
  sidebarData: function (_this) {
    _this.setData({
      paythis: {
        ajaxStops: _this.data.ajaxStops,
        authPop: _this.data.authPop,
        avatarName: _this.data.avatarName,
        avatarUrl: _this.data.avatarUrl,
        bill_image: _this.data.bill_image,
        bill_qrcode: _this.data.bill_qrcode,
        id: _this.data.id,
        member: _this.data.member,
        money: _this.data.money,
        full_money: _this.data.full_money,
        groups_status: _this.data.groups_status,
        id: _this.data.id,
        vipState: _this.data.vipState,
        sideShow: _this.data.sideShow,
        vipState: _this.data.vipState
      }
    })
  },
  // 邀请发起人接口
  invite: function (_this, data,callback) {
    Common.axioscommon('https://gk2.mingshiedu.com/index.php?s=/Home/index/updateInvited', "get", data, function (res) {
      if (typeof callback == "function") callback(res);
    })
  },
  // 分享邀请发起人
  shareApp: function (e) {
    if (e.zid && wx.setStorageSync('memberUser').id) {
      var data = {
        invited_id: e.zid,
        member_id: wx.getStorageSync('memberUser').id
      }
      Common.invite(_this, data)
    }
  }

}
module.exports=Common;

