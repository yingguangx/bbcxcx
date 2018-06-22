// pages/repay/index.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    donateView: '',
    repays: '',
    allMoney: 0,
    mask: false,
    imgRotate: '',
    doanteRepays: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      donateView: options.donateView
    });

    util.postPromise({ 'guid': this.data.donateView }, 'services/getPccRepays').then(res => {
      that.setData({
        repays: res.data.pccRepays
      })
      console.log(this.data.repays)
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

  checkboxChange1: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var that = this;
    var allMoney = 0;
    var checkboxItems = this.data.repays, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      checkboxItems[i].show = false;
      console.log(values)
      if (values.length == 0) {
        checkboxItems[i].donateNum = 0
      }
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].money == values[j]) {
          checkboxItems[i].checked = true;
          checkboxItems[i].show = true;
          if (checkboxItems[i].donateNum == 0) {
            checkboxItems[i].donateNum = 1;
          }
          break;
        } else {
          checkboxItems[i].donateNum = 0
        }
      }
      allMoney = allMoney + parseInt(checkboxItems[i].donateNum) * parseFloat(checkboxItems[i].money)
    }
    this.setData({
      repays: checkboxItems,
      allMoney: allMoney,
    });
    console.log(this.data.repays)
  },

  maskShow: function () {
    var maskStatus = this.data.mask;
    if (maskStatus) {
      this.setData({
        mask: false,
        imgRotate: ''
      })
    } else {
      this.setData({
        mask: true,
        imgRotate: 'imgRotate'
      })
    }

  },

  deleteNumber: function (e) {
    var repays = this.data.repays;
    var index = e.currentTarget.dataset.index;
    var allMoney = this.data.allMoney;
    console.log(repays)
    console.log(e.currentTarget.dataset.index)

    if (repays[index].donateNum <= 1) {
      wx.showToast({
        title: '最少支持一份',
      })
    } else {
      repays[index].donateNum = parseInt(repays[index].donateNum) - 1;
      repays[index].donateMoney = parseInt(repays[index].donateNum) * parseFloat(repays[index].money)
      allMoney = parseFloat(allMoney) - parseFloat(repays[index].money)
      this.setData({
        repays: repays,
        allMoney: allMoney
      })
    }
  },

  addNumber: function (e) {
    var repays = this.data.repays;
    var index = e.currentTarget.dataset.index;
    var allMoney = this.data.allMoney;
    console.log(repays)
    console.log(e.currentTarget.dataset.index)
    repays[index].donateNum = parseInt(repays[index].donateNum) + 1;
    repays[index].donateMoney = parseInt(repays[index].donateNum) * parseFloat(repays[index].money)
    allMoney = parseFloat(allMoney) + parseFloat(repays[index].money)
    this.setData({
      repays: repays,
      allMoney: allMoney
    })

  },

  createOrder:function(){
    if(this.data.allMoney == 0){
      wx.showToast({
        title: '请选择回报后支持！',
        icon:'none'
      })
      return false;
    }
    util.postPromise({ 'guid': this.data.donateView,'repays':this.data.repays,'allMoney':this.data.allMoney }, 'services/createPccOrders').then(res => {
    
      console.log(res)
      if (res.success){
        wx.navigateTo({
          url: '../pccOrder/index'+res.data,
        })
      }else{
        wx.showToast({
          title: res.message,
          icon:'none'
        })
      }
    });
  }
})