//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var ocr = require('../../utils/ocr.js')
var imgHelper = require('../../utils/img_helper.js')

var app

Page({

  data: {
    DESC: [
      {
        title: true,
        desc: '建议'
      },
      {
        desc: '图片小于3M'
      },
      {
        desc: '分辨率低于4k'
      },
      {
        desc: '保证清晰度'
      }

    ],
    animScope: {
      DESC: true,
      obtainImgInit: true,
      bankInfoInit: true,
      copyInit: true
    }
  },

  // 重置显示结果动画
  resetResultAnim: function () {

    this.animBankInfo(true)
    this.animCopy(true)
    this.animDESC(true)
    this.animObtainImgStart(true)

  },

  // 显示结果动画
  anim4result: function () {

    this.animBankInfo()

    this.animCopy()

  },

  animDESC: function (reserve) {
    // 描述动画
    var animDESC = wx.createAnimation({
      timingFunction: 'ease',
    })
    animDESC.opacity(reserve ? 0 : 1).step({ duration: reserve ? 500 : 1500 })
    this.setData({
      animDESC: animDESC.export()
    })
  },

  animObtainImgStart: function (reserve) {
    // 初始选择照片按钮动画
    var animObtainImgStart = wx.createAnimation({
      timingFunction: 'ease',
    })
    if (reserve) {
      animObtainImgStart.opacity(0).scale(0.2, 0.2).step({ duration: 500 })
    } else {
      animObtainImgStart.opacity(0.8).scale(0.8, 0.8).step({ duration: 300, delay: 200 })
      animObtainImgStart.opacity(1).scale(1.2, 1.2).step({ duration: 200 })
      animObtainImgStart.scale(1, 1).step({ duration: 300 })
    }
    this.setData({
      animObtainImgStart: animObtainImgStart.export()
    })
  },

  animObtainImg: function (reserve) {
    // 获取照片动画
    var animObtainImg = wx.createAnimation({
      timingFunction: 'ease',
    })
    animObtainImg.opacity(reserve ? 0 : 1).step({ duration: 2000 })
    this.setData({
      animObtainImg: animObtainImg.export()
    })
  },

  animBankInfo: function (reserve) {
    // 银行卡片动画
    var animBankInfo = wx.createAnimation({
      timingFunction: 'ease',
    })
    animBankInfo.opacity(reserve ? 0 : 1).translateX(reserve ? '-800px' : 0).step({ duration: 800 })
    this.setData({
      animBankInfo: animBankInfo.export()
    })
  },

  animCopy: function (reserve) {
    // 复制按钮动画
    var animCopy = wx.createAnimation({
      timingFunction: 'ease',
    })
    animCopy.opacity(reserve ? 0 : 1).translateX(reserve ? '800px' : 0).step({ duration: 1000 })
    this.setData({
      animCopy: animCopy.export()
    })
  },

  onLoad: function (res) {
    app = getApp()
  },

  onShow: function () {

    // 初始描述文字动画
    this.animDESC()

    // 初始选择图片按钮动画
    this.animObtainImgStart()

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

  isFirst : true,
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          splashShow: false,
        })
        // 重置动画
        that.resetResultAnim()
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imgFile = res.tempFiles[0]
        that.setData({
          imgFile: imgFile,
          // bankInfo: false
        })

        // 显示获取银行卡照片模块
        if (that.isFirst){
          that.animObtainImg()
        }  

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
