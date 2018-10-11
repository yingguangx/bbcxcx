var util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    src: '/static/images/pcc-red-package.png',
    autoplay: 'true',
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 5000,
    actionSheetHidden: true,
    isgetGift: true,
    openGift: true,
    getOneGift: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mask: false,
    giftAmt:'',
    giftNumber:'',
    giftsList:'',
    noGift:false,
    oneGiftAmt:'',
    getTotalAmt:'',
    openLists:'',
    goUrl:'',
    jiaUser:'',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    console.log(option)
    //邀请新助农大使奖励
    console.log(option.inviterID)
    util.postPromise({
      'xcxUserID': wx.getStorageSync('xcxUserID'),
      'inviterID': option.inviterID
    }, 'services/pccXcxInviteTask').then(res => {
      console.log(res)
    
    })

    var that = this;
    if (app.globalData.userInfo) {                
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        mask : false
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
    util.getPromise({}, 'services/getOpenLists').then(res => {
      console.log('res')

      console.log(res)
      console.log('res')


      that.setData({
        openLists: res.data,
      })
    })

    util.postPromise({
      'xcxUserID': wx.getStorageSync('xcxUserID'),
    }, 'services/getGiftHome').then(res => {
      that.setData({
        giftAmt: res.giftAmt,
        giftNumber: res.giftNumber,
        giftsList: res.data,
        getTotalAmt: res.getTotalAmt,
      })
      if (res.giftNumber==0){
        that.setData({ noGift: true})
      }
    })
  },

  imageError: function (e) {
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "hotList.data[" + errorImgIndex + "].imageUrl" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = "https://staticcdn2.zhongtuobang.com/img/error_empImag_60x80.gif" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
  hideMask: function () {
    this.setData({
      mask: false,
    })
  },
  onShow: function () {
    var that = this;
    wx.getSetting({
      success: res => {
        if (app.globalData.userInfo) {
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
  onGotUserInfo: function (e) {
    //更新用户信息
    console.log(e)
    util.postPromise({
      'userID': wx.getStorageSync('userID'),
      'userInfo': e.detail.userInfo
    }, 'services/updateWxUserInfo').then(res => {
      console.log(res)
    })
  },

  clickShare: function () {
    this.setData({ 
      actionSheetHidden: false,
      goUrl: '/pages/giftPoster/index?type=agriculture'
      })
  },

  clickComplete: function () {
    this.setData({
      actionSheetHidden: false,
      goUrl: '/pages/giftPoster/index?type=follow'
    })
  },

  cancelPoster: function () {
    this.setData({ actionSheetHidden: true })
  },

  // 生成海报
  createPoster: function () {
    this.setData({ actionSheetHidden: true })
    wx.navigateTo({
      url: this.data.goUrl
    })
  },
  //领取红包
  actionGetGift: function () {
    // console.log(this.data.noGift)
    if (!this.data.noGift){
      this.setData({ openGift: false })
    }
    
  },
  //一键领取
  actionOpneAllGift: function () {
    this.setData({ openGift: true })
    this.setData({ isgetGift: false })
  },
  //开one红包
  actionOpneOneGift: function (e) {
    this.setData({ oneGiftAmt: e.target.dataset.giftamt })
    wx.setStorageSync('giftType', e.target.dataset.type)
    wx.setStorageSync('giftID', e.target.dataset.id)
    this.setData({ openGift: true })
    this.setData({ getOneGift: false })
  },
  //收所有的入囊中
  actionGetAllMoneyToPackage: function () {
    var that = this;
    util.postPromise({
      'xcxUserID': wx.getStorageSync('xcxUserID'),
    }, 'services/getOneMoneyToPackage').then(res => {
      that.setData({
        giftAmt: res.giftAmt,
        giftNumber: 0,
        noGift: true
      })
      console.log(res);
    })
    this.setData({ isgetGift: true });
  },
  //收一个入囊中
  actionGetOneMoneyToPackage: function () {
    var that = this;
    util.postPromise({
      'xcxUserID': wx.getStorageSync('xcxUserID'),
      'giftType': wx.getStorageSync('giftType'),
      'giftID': wx.getStorageSync('giftID')
    }, 'services/getOneMoneyToPackage').then(res => {
      that.setData({
        giftAmt: res.giftAmt,
        giftNumber: res.giftNumber,
        giftsList: res.data,
        getTotalAmt: res.getTotalAmt,
      })
      if (res.giftNumber == 0) {
        that.setData({ noGift: true })
      }
    })
    this.setData({ getOneGift: true });
  },

  //转发
  onShareAppMessage: (res) => {
    if (res.from === 'button') {
      console.log("来自页面内转发按钮"); console.log(res.target);
    } else {
      console.log("来自右上角转发菜单")
    } return {
      title: '帮帮筹助农大使',
      path: '/pages/giftHome/index?inviteID='+ wx.getStorageSync('xcxUserID'),
      imageUrl: "/images/1.jpg",
      success: (res) => { 
        
      },
      fail: (res) => { console.log("转发失败", res); }
    }
  },
})