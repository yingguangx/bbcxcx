//app.js
App({
  globalData:{
    appid:'wx7767e3a8648e2624',
    secret:'2df5647341b7e93bcbd81ad4176baedc',
    userInfo: null
  },
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){         
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.appid + '&secret=' + that.globalData.secret +'&js_code=' + res.code + '&grant_type=authorization_code',
          //   data: {},
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   success: function (res) {
          //     wx.setStorageSync('openid', res.data.openid);
          //     console.log(res.data);
          //     // 获取用户信息
          //   }
          // })
        }
      }
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo;
              console.log(res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
})