// pages/addaddress/index.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID: 0,
    provinceID: 0,
    cityID: 0,
    distinctID: 0,
    provinceList: [],
    provinceIndex: 0,
    cityList: [],
    cityIndex: 0,
    distinctList: [],
    distinctIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      orderID: options.oid
    })

    util.postPromise({}, 'services/getProvince').then(res => {
      console.log(res)
      that.setData({
        provinceList: res.data.provinceList
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

  bindProvinceChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    var that = this;
    this.setData({
      provinceID: this.data.provinceList[e.detail.value].postID,
      provinceIndex: e.detail.value
    })

    if (e.detail.value != 0) {
      util.postPromise({ 'provinceID': this.data.provinceID }, 'services/getCity').then(res => {
        console.log(res)
        that.setData({
          cityList: res.data
        })
      });
    }


  },

  bindCityChange: function (e) {
    var that = this;
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      cityID: this.data.cityList[e.detail.value].postID,
      cityIndex: e.detail.value
    })

    if (e.detail.value != 0) {
      util.postPromise({ 'cityID': this.data.cityID }, 'services/getDistinct').then(res => {
        console.log(res)
        that.setData({
          distinctList: res.data
        })
      });
    }
  },

  bindDistinctChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      distinctID: this.data.distinctList[e.detail.value].postID,
      distinctIndex: e.detail.value
    })
  },
  
  call:function(){
    app.call();
  }
})