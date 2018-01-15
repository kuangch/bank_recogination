//app.js
var config = require('./config')
var ocr = require('./utils/ocr.js')

App({
  ip:'https://aduls9yo.qcloud.la',
  baiduOcrToken:'',
  onLaunch: function () {
    ocr.initOcr(this)
  }
})