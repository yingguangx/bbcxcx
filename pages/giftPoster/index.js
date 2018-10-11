var util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgSrc:'',
  },
  onLoad: function (option) {
    var that = this
    console.log(option)
    if (option.type == "agriculture" || option.type == "showAll" || option.type == "showWhithdarw"){
      util.postPromise({
        'xcxUserID': wx.getStorageSync('xcxUserID'),
        'type': option.type
      }, 'services/getAgriculturePoster').then(res => {
        console.log(res)
        that.setData({
          imgSrc: res.data
        })
      })
    }

    if (option.type == "follow") {
      util.postPromise({
        'xcxUserID': wx.getStorageSync('xcxUserID'),
        'inviterID': option.inviterID
      }, 'services/getPccfollowInvitePoster').then(res => {
        console.log(res)
        that.setData({
          imgSrc: res.data
        })
      })
    }

    

  },

  actionSaveImg : function (){
    console.log('hh')
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            },
            fail(){
              console.log('授权失败')
            }
          })
        }
      }
    })

    var imgSrc = this.data.imgSrc
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
  }
})