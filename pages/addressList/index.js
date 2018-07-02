// pages/addressList/index.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID: 0,
    addressLists: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.oid)
    this.setData({
      orderID: options.oid
    })
    var that = this;
    util.postPromise({ 'oid': this.data.orderID, 'userID': wx.getStorageSync('userID') }, 'services/addressList').then(res => {
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
    util.postPromise({ 'oid': wx.getStorageSync('oid'), 'userID': wx.getStorageSync('userID'), 'aid': e.detail.value }, 'services/selectAddr', ).then(res => {
      console.log(res)
      if (res.success) {
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        prePage.setData({
          receiveName: res.data.receivedName,
          mobile: res.data.receivedMobile + "\n",
          address: res.data.provinceName + res.data.cityName + res.data.districtName + res.data.area,
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    });
  },

  deleteAddr: function (e) {
    var aid = e.currentTarget.dataset.aid;
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除该地址?',
      success: function (res) {
        if (res.confirm) {
          util.getPromise({ 'aid': aid }, 'services/deleteAddr').then(res => {
            console.log(res)
            if (res.data.success) {
              var addressLists = that.data.addressLists;
              addressLists.splice(index, 1);
              that.setData({
                addressLists: addressLists
              })
              wx.showToast({
                title: '删除成功！',
              })

            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          });
        } else if (res.cancel) {
          
        }
      }
    })
  }
})