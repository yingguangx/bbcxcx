var util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hotList: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      '/static/images/bbc2-donate-rule.png',
      '/static/images/bbc2-get-recommend.png',
      '/static/images/bbc2-r-logo.png',
      '/static/images/bbc2-redpacket-ts.png'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    loading: false,
    pageNum: 1,
    mask: false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
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
    util.getPromise({}, 'services/getHotLists').then(res => {
      that.setData({
        hotList: res
      })
    })
  },

  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  lower: function(e) {
    var hls = this.data.hotList
    var that = this
    if (that.data.loading == false && that.data.pageNum < 3) {
      wx.showNavigationBarLoading()
      that.setData({
        loading: true
      })
      wx.request({
        url: 'https://api.weixingongchang.com/services/getHotLists',
        data: {
          pageNum: that.data.pageNum
        },
        // method:'POST',
        dataType: 'json',
        success: function(res) {
          var newHot = {
            success: "true",
            data: hls.data.concat(res.data.data.data)
          }
          wx.hideNavigationBarLoading()
          that.setData({
            hotList: newHot,
            loading: false,
            pageNum: that.data.pageNum + 1
          })
        }
      })
    }
  },
  imageError: function(e) {
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "hotList.data[" + errorImgIndex + "].imageUrl" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = "https://staticcdn2.zhongtuobang.com/img/error_empImag_60x80.gif" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
  hideMask: function() {
    this.setData({
      mask: false,
    })
  },
  onShow: function() {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          that.setData({
            mask: true,
          })
        }
      }
    })
  },
  onGotUserInfo: function(e) {
    //更新用户信息
    util.postPromise({
      'userID': wx.getStorageSync('userID'),
      'userInfo': e.detail.userInfo
    }, 'services/updateWxUserInfo').then(res => {
      console.log(res)
    })
  }
})