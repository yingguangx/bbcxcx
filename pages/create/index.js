var util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    minePcc:[],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      '/static/images/bbc2-donate-rule.png',
      '/static/images/bbc2-get-recommend.png',
      '/static/images/bbc2-r-logo.png',
      '/static/images/bbc2-redpacket-ts.png'
    ],
    loading:false,
    pageNum:1
  },
  //事件处理函数
  bindViewTap: function() {
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
    } else if (this.data.canIUse){
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
    util.getPromise({'userID':wx.getStorageSync('userID')},'services/getMinePcc').then(res=>{
      that.setData({
        minePcc:res
      })
    })
  },
  // lower: function (e) {
  //   var hls = this.data.hotList
  //   var that = this
  //   if (that.data.loading == false && that.data.pageNum < 3){
  //     wx.showNavigationBarLoading() 
  //     that.setData({
  //       loading:true
  //     })
  //     wx.request({
  //       url: 'http://ztbapi/services/getHotLists',
  //       data:{
  //         pageNum:that.data.pageNum
  //       },
  //       // method:'POST',
  //       dataType:'json',
  //       success:function(res){
  //         var newHot = {
  //           success:"true",
  //           data: hls.data.concat(res.data.data.data)
  //         }
  //         wx.hideNavigationBarLoading()
  //         that.setData({
  //           hotList: newHot,
  //           loading:false,
  //           pageNum: that.data.pageNum+1
  //         })
  //       }
  //     })
  //   }
  // },
  imageError: function (e) {
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "hotList.data[" + errorImgIndex + "].imageUrl" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = "https://staticcdn2.zhongtuobang.com/img/error_empImag_60x80.gif" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
})