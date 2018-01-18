//app.js
var config = require('./config')
var ocr = require('./utils/ocr_baidu_sdk.js')

App({
  nikcName:undefined,
  ip:'https://aduls9yo.qcloud.la',
  // ip:'http://10.0.2.177:5757',
  // baiduOcrToken:'',
  onLaunch: function () {
    var that = this
    ocr.initOcr(that)

    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        wx.getUserInfo({
          success: function (res) {
            that.nickName = res.userInfo.nickName
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})