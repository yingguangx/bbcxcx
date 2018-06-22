// pages/pccOrder/index.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    donateView: "",
    orderID: 0,
    allMoney: 0,
    comment: '',
    reciveName: '刘明明',
    mobile: '18767622322'+'\n',
    address: '河北省唐山市路北区路别面是什么我不知道啊啊啊啊啊',
    orderDetail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;

    wx.setStorageSync('oid', options.oid);
    wx.setStorageSync('allMoney', options.m);
    wx.setStorageSync('donateView', options.guid);
    
    this.setData({
      donateView: options.guid,
      orderID: options.oid,
      allMoney: options.m
    })

    util.postPromise({ 'guid': this.data.donateView, 'oid': this.data.orderID, 'allMoney': this.data.allMoney }, 'services/orderView').then(res => {

      console.log(res)
      
      that.setData({
        orderDetail:res.data 
      })
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
  addComment: function (e) {
    console.log(e);
    this.setData({
      comment: e.detail.value
    })
  }
})