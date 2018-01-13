//app.js
var config = require('./config')
var ocr = require('./utils/ocr.js')

App({
  baiduOcrToken:'',
  onLaunch: function () {
    ocr.initOcr(this)
  }
})