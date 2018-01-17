//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var ocr = require('../../utils/ocr.js')
var imgHelper = require('../../utils/img_helper.js')

var app

Page({

  data:{
    // bankInfo:{
    //   bank_card_number:"6217857600036486692",
    //   bank_name:"招商银行",
    //   bank_card_type:1
    // },
    // imgFile: {
    //   path: './yhk.jpg'
    // },
    animScope: {
      obtainImgInit: true,
      bankInfoInit: true,
      copyInit: true
    }
  },

  initAnim:function(){
    var that = this;
    that.setData({
      animScope: {
        obtainImgInit: true,
        bankInfoInit: true,
        copyInit: true
      }
    })

  },

  onLoad: function (res) {
    app = getApp()
  },

  animObtainImgStart:function(){
    // 初始选择照片按钮动画
    var animObtainImgStart = wx.createAnimation({
      timingFunction: 'ease',
    })
    animObtainImgStart.scale(0.8, 0.8).step({ duration: 300, delay: 200 })
    animObtainImgStart.scale(1.2, 1.2).step({ duration: 200 })
    animObtainImgStart.scale(1, 1).step({ duration: 300 })
    this.setData({
      animObtainImgStart: animObtainImgStart.export()
    })
  },

  animObtainImg: function(){
    // 获取照片动画
    var animObtainImg = wx.createAnimation({
      timingFunction: 'ease',
    })
    animObtainImg.opacity(1).step({ duration: 2000 })
    this.setData({
      animObtainImg: animObtainImg.export()
    })
  },

  animBankInfo: function () {
    // 银行卡片动画
    var animBankInfo = wx.createAnimation({
      timingFunction: 'ease',
    })
    animBankInfo.opacity(1).translateX(0).step({ duration: 400 })
    this.setData({
      animBankInfo: animBankInfo.export()
    })
  },

  animCopy: function (reserve) {
    // 复制按钮动画
    var animCopy = wx.createAnimation({
      timingFunction: 'ease',
    })
    animCopy.opacity(reserve ? 0 : 1).translateX(reserve ? 1 : 0).step({ duration: 500 })
    this.setData({
      animCopy: animCopy.export()
    })
  },

  onShow: function(){

    this.initAnim()

    this.animObtainImgStart()

  },
  
  anim4result: function () {

    this.animObtainImg()

    this.animBankInfo()

    this.animCopy();

  },

  onShareAppMessage: function (res) {
    return {
      title: (app.nickName || '我') + '觉得这个不错，分享给你',
      imageUrl: './img_bank.png',
      success: function (res) {
        wx.showShareMenu({
          withShareTicket: true
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },

  chooseImage: function () {
    var that = this
    that.initAnim()
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

        that.animObtainImg()

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
      imgPath: img,
      success: function (result) {
        wx.hideLoading();
        if (result) {
          that.setData({
            bankInfo: result
          })
          that.anim4result()
        } else {
          util.showModel('提示', '未识别到银行卡信息')
        }

      },
      fail: function () {
        wx.hideLoading();
        util.showModel('提示', '识别失败')
      }
    })
  },

  //复制卡号到粘贴板
  copyNumber: function () {
    var that = this
    wx.setClipboardData({
      data: (that.data.bankInfo && that.data.bankInfo.bank_card_number ? that.data.bankInfo.bank_card_number : '').replace(/ /g, ''),
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data

            if (res.data)
              util.showSuccess('已复制到粘贴板')
            else {
              util.showModel('提示', '复制银行卡号码为空')
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
