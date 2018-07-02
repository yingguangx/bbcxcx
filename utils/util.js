const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getPromise(data,url){
  var data = data;
  var url = url;
  return new Promise((resolve, reject) => {
    var that = this;
    wx.request({
      url: 'http://ztbapi/' + url,
      data: data,
      dataType: 'json',
      header: {
        'HTTP_X_REST_TOKEN': 'ztb'
      },
      success: function (res) {
        resolve(res.data.data)
      },
      fail: function () {
        wx.showToast({
          title: '网络连接失败！',
        });
      }
    })
  });
}

function postPromise(data, url) {
  var data = data;
  var url = url;
  return new Promise((resolve, reject) => {
    var that = this;
    wx.request({
      url: 'http://ztbapi/' + url,
      data: data,
      dataType: 'json',
      header: {
              'content-type': 'application/json',
              'HTTP_X_REST_TOKEN':'ztb'
              },
      method:'POST',
      success: function (res) {
        resolve(res.data.data)
      },
      fail: function () {
        wx.showToast({
          title: '网络连接失败！',
        });
      }
    })
  });
}

module.exports = {
  formatTime: formatTime,
  getPromise: getPromise,
  postPromise: postPromise,
}
