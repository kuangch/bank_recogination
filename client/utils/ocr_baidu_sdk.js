var app

var initOcr = function(aplication){
  app = aplication
}

var getBankNumber = function (options) {

  options = {
    imgPath: options.imgPath ? options.imgPath : "",
    success: options.success ? options.success : function () { },
    fail: options.fail ? options.fail : function () { },
    complete: options.complete
  }

  wx.uploadFile({
    url: app.ip + '/weapp/bank_search',
    filePath: options.imgPath,
    name: 'image',
    dataType: 'json',
    formData: {
      baidu_ocr_token: ''
    },
    success(result) {
      console.log('获取银行卡号码成功')
      try {
        let r = JSON.parse(result.data)
        options.success(r.data.result)
      } catch (e) {
        console.log(e)
        options.fail()
      }

    },
    fail(error) {
      console.log('request fail', error);
      options.fail()
    },
    complete(info) {
      if (options.complete) options.complete()
    }

  })
  
}

module.exports = { getBankNumber, initOcr}


