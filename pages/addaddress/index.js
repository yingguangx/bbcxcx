// pages/addaddress/index.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID:64,
    orderID: 0,
    aid: 0,
    provinceID: 0,
    cityID: 0,
    distinctID: 0,
    provinceList: [],
    provinceIndex: 0,
    cityList: [],
    cityIndex: 0,
    distinctList: [],
    distinctIndex: 0,
    comment:'',
    receiveName:'',
    receiveMobile:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    util.postPromise({}, 'services/getProvince').then(res => {
      console.log(res)
      that.setData({
        provinceList: res.data.provinceList
      })
    });

    if(options.oid){
      this.setData({
        orderID: options.oid
      })
    }else{
      this.setData({
        aid:options.aid
      })
      util.getPromise({ 'aid': options.aid}, 'services/getAddr').then(res => {
        console.log(res)
        var provinceList = that.data.provinceList;
        var cityList = that.data.cityList;
        var distinctList = that.data.distinctList;
        
        provinceList[0] = { 'postID': res.data.provinceID, 'name': res.data.provinceName};
        cityList[0] = { 'postID': res.data.cityID, 'name': res.data.cityName};
        distinctList[0] = { 'postID': res.data.districtID, 'name': res.data.districtName };
        var area = res.data.area;
        var receiveName = res.data.receivedName;
        var receiveMobile = res.data.receivedMobile;
        console.log(area)
        console.log(receiveName)
        console.log(receiveMobile)        
        that.setData({
          provinceList: provinceList,
          cityList: cityList,
          distinctList: distinctList,
          comment: area,
          receiveName: receiveName,
          receiveMobile: receiveMobile,
          provinceID: res.data.provinceID,
          cityID: res.data.cityID,
          distinctID: res.data.districtID     
        })
        console.log(that.data)
      });
    }
    

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
  },

  addComment: function (e) {
    console.log(e);
    this.setData({
      comment: e.detail.value
    })
  },

  addReviveName:function(e){
    console.log(e);
    this.setData({
      receiveName: e.detail.value
    })
  },

  addReviveMobile: function (e) {
    console.log(e);
    this.setData({
      receiveMobile: e.detail.value
    })
  },

  createAddr:function(){
    var that = this;
    if (this.validateComment()){
      if(this.data.aid != 0){
        var json_data = {
          addressID:this.data.aid,
          userID: this.data.userID,
          receivedName: this.data.receiveName,
          receivedMobile: this.data.receiveMobile,
          provinceID: this.data.provinceID,
          cityID: this.data.cityID,
          distinctID: this.data.distinctID,
          comment: this.data.comment,
          oid: wx.getStorageSync('oid')
        }
      }else{
        var json_data = {
          userID: this.data.userID,
          receivedName: this.data.receiveName,
          receivedMobile: this.data.receiveMobile,
          provinceID: this.data.provinceID,
          cityID: this.data.cityID,
          distinctID: this.data.distinctID,
          comment: this.data.comment,
          oid: wx.getStorageSync('oid')
        }
      }
      
      util.postPromise({json_data}, 'services/changeAddress').then(res => {
        if(res.success){
          wx.navigateTo({
            url: '../pccOrder/index?guid=' + wx.getStorageSync('donateView') + '&oid=' + wx.getStorageSync('oid') + '&m=' + wx.getStorageSync('allMoney'),
          })
        }else{
          wx.showToast({
            title: res.message,
            icon:'none'
          })
        }
      });
    }
  },

  validateComment:function(){
    if (this.data.provinceID == 0) {
      wx.showToast({
        title: '请选择省份！',
        icon:'none',
      })
      return false;
    }
    if (this.data.cityID == 0) {
      wx.showToast({
        title: '请选择城市！',
        icon: 'none',
      })
      return false;
    }
    if (this.data.distinctID == 0) {
      wx.showToast({
        title: '请选择县区！',
        icon: 'none',
      })
      return false;
    }
    if (this.data.comment == "") {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
      })
      return false;
    }
    if (!(/^[\u4e00-\u9fa5]+$/.test(this.data.receiveName))) {
      wx.showToast({
        title: '请输入正确的姓名！',
        icon: 'none',
      })
      return false;
    }
    if (!this.data.receiveMobile.match(/^1[2|3|4|5|6|7|8|9][0-9]\d{8}$/)) {
      wx.showToast({
        title: '手机号码格式不正确！请重新输入！',
        icon: 'none',
      })
      return false;
    }
    return true;
  }
})