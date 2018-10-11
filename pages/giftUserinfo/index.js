//index.js
//获取应用实例
var util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    giftUser:{},
    tixiane:0,
    hadMobile: "getPhoneNumber"
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    util.postPromise({
      'xcxUserID': wx.getStorageSync('xcxUserID'),
    }, 'services/getGiftUserinfo').then(res => {
      console.log(res)
      that.setData({
        giftUser: res,
        tixiane: res.getAmt,
        })
      if (res.mobile){
        that.setData({ hadMobile: "had", })
      }
    })


  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  clickShowAll: function () {
    wx.navigateTo({ url: '/pages/giftPoster/index?type=showAll' })
    // this.setData({ actionSheetHidden: false })
  },

  clickShowWhithdarw: function () {
    wx.navigateTo({ url: '/pages/giftPoster/index?type=showWhithdarw' })
    // this.setData({ actionSheetHidden: false })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  actionTiXian: function () {
    if (this.data.tixiane<10){
      wx.showToast({
        title: '可提现余额不足十元，暂时无法提现',
        icon:'none',
        duration: 2000
      })   
    }else{
      console.log('tixianle');
      var that = this;
      util.postPromise({
        'xcxUserID': wx.getStorageSync('xcxUserID'),
      }, 'services/tixian').then(res => {
        console.log(res);
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 2000
        }) 
      })
    }
  },

  getPhoneNumber: function (e) {
    var that = this
    if (this.data.hadMobile != 'had'){
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '未授权',
          success: function (res) {
          }
        })
      } else {
        if (wx.getStorageSync('session_key') == '') {
          wx.login({
            success: function (res) {
              if (res.code) {
                var d = app.globalData;//这里存储了appid、secret、token串
                var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
                wx.request({
                  url: l,
                  data: {},
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  success: function (res) {
                    console.log('huoqule')
                    that.setData({ sessionKey: res.data.session_key })
                  }
                });
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          });
        } else {
          this.setData({ sessionKey: wx.getStorageSync('session_key') })
        }
        console.log('meiyouhuoqule')
        console.log(this.data.sessionKey)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        util.postPromise({
          'iv': e.detail.iv,
          'encryptedData': e.detail.encryptedData,
          'sessionKey': this.data.sessionKey,
           'xcxUserID': wx.getStorageSync('xcxUserID'),
        }, 'services/getPhoneNumber').then(res => {
          that.setData({ hadMobile: "had", })
        })
      }
    }
  }
})