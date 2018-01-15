//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var ocr = require('../../utils/ocr.js')
var imgHelper = require('../../utils/img_helper.js')

Page({
    chooseImage: function(){
      var that = this
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var imgFile = res.tempFiles[0]
          that.setData({
            imgFile: imgFile,
            bankInfo: false
          })
          
          console.log(imgFile.size / 1024 + 'kb')
          if (res.size > 1024 * 1024 * 3) {
            util.showModel('错误', '图片需要小于 3M')
          } else {
            that.ocrOption(imgFile.path);
          }
        }
      })
    },

    // ocr识别
    ocrOption: function (img) {
        util.showBusy("OCR识别中...")
        var that = this
        var ret = ocr.getBankNumber({
          imgPath:img,
          success: function(result){
            wx.hideLoading();
            if (result){
              that.setData({
                bankInfo: result
              })
            }else{
              util.showModel('提示', '未识别到银行卡信息')
            }
            
          },
          fail: function(){
            wx.hideLoading();
            util.showModel('提示', '识别失败')
          }
        })
    },

    //复制卡号到粘贴板
    copyNumber: function(){
      var that = this
      wx.setClipboardData({
        data: (that.data.bankInfo && that.data.bankInfo.bank_card_number ? that.data.bankInfo.bank_card_number : '').replace(/ /g,''),
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              console.log(res.data) // data

              if(res.data)
                util.showSuccess('已复制到粘贴板')
              else{
                util.showModel('提示','复制银行卡号码为空')
              }
            }
          })
        }
      })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
          current: this.data.imgFile.path,
          urls: [this.data.imgFile.path]
        })
    }

})
