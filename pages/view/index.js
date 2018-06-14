var util = require('../../utils/util.js')
// pages/view/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    donateView:'',
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
    pccInfo:{},
    active:'view-condition-content',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      donateView: options.donateView
    })

    util.postPromise({ 'guid': this.data.donateView}, 'services/getPccView').then(res => {
      that.setData({
        pccInfo: res
      })
      console.log(that.data.pccInfo)
    });
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

  redirectHome:function(){
    app.redirectHome()
  },

  tagClick:function(e){
    this.setData({
      active: e.currentTarget.id
    })
  },

  imageError: function (e) {
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "pccInfo.data.pccComments.[" + errorImgIndex + "].headImgUrl" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = "https://static.zhongtuobang.com/img/error_empImag_60x80.gif" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  }
})