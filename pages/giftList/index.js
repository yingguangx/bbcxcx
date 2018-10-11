var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftsList:'',
    noGift:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.postPromise({
      'xcxUserID': wx.getStorageSync('xcxUserID'),
    }, 'services/mineAwardRecord').then(res => {
      that.setData({
        giftsList: res.data,
      })
      console.log(res.data)
      if (res.giftNumber == 0) {
        that.setData({ noGift: true })
      }
    })
  },
})