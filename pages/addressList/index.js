// pages/addressList/index.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID:0,
    addressLists:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.oid)
    this.setData({
      orderID:options.oid
    })
    var that = this;
    util.postPromise({ 'oid': this.data.orderID, 'userID': 64 }, 'services/addressList').then(res => {
      console.log(res)
      that.setData({
        addressLists: res.data.addressLists
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

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.addressLists;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].id == e.detail.value;
    }

    this.setData({
      addressLists: radioItems
    });
    
    var that = this;
    util.postPromise({ 'oid': this.data.orderID, 'userID': 64, 'aid': e.detail.value}, 'services/selectAddr',).then(res => {
      console.log(res)
      if(res.data.success){
        wx.navigateTo({
          url: '../pccOrder/index?guid=' + wx.getStorageSync('donateView') + '&oid=' + wx.getStorageSync('oid') + '&m=' + wx.getStorageSync('allMoney'),
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    });
  },
})