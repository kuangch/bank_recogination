const client_id = '1f5OpU2MTf1IYqtNeLfYQHpy'
const client_secret = 'bppIbvEzi4OjykBuIoWKKIWuDjGDU4DE'
var app

var __getBaiduToken = function (options) {
  var tokenCache

  options = { 
    success: options && options.success ? options.success : function () { }, 
    fail: options && options.fail ? options.fail : function () { }
  }

  //取缓存token
  try {
    tokenCache = wx.getStorageSync('baidu_ocr_token')
    if (tokenCache){
      // 单位： s
      var tokenTime = (new Date().getTime() - tokenCache.inTime)/1000
      // 提前token国企一小时前更新token防止临界点
      if (tokenTime > tokenCache.expires_in - 3600){
        tokenCache = null
      }
    }
  } catch (e) {
    console.log(e)
  }

  if (tokenCache) {
    app.baiduOcrToken = tokenCache.access_token
    options.success(app.baiduOcrToken)
    return
  }
 
  //缓存token没有，重新获取
  wx.request({
    url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
    dataType: "json",
    success(result) {
      console.log('获取token成功')
      if (result.data.access_token){
        result.data.inTime = new Date().getTime()
        wx.setStorageSync('baidu_ocr_token', result.data)
        app.baiduOcrToken = result.data.access_token
        options.success(app.baiduOcrToken)
      }else{
        options.fail()
      }
      
    },
    fail(error) {
      console.log('request fail', error);
      options.fail()
    }
  })
}

var initOcr = function(aplication){
  app = aplication
  __getBaiduToken()
}

var getBankNumber = function (options) {

  options = {
    imgPath: options.imgPath ? options.imgPath : "",
    success: options.success ? options.success : function () { },
    fail: options.fail ? options.fail : function () { },
    complete: options.complete
  }

  __getBaiduToken({
    success:function(token){
      wx.uploadFile({
        url: app.ip + '/weapp/bank_search',
        filePath: options.imgPath,
        name: 'image',
        dataType: 'json',
        formData: {
          baidu_ocr_token: token
        },
        success(result) {
          console.log('获取银行卡号码成功')
          
          try{
            let r = JSON.parse(result.data)
            options.success(r.data.result)
          }catch(e){
            console.log(e)
            options.fail()
          }
          
        },
        fail(error) {
          console.log('request fail', error);
          options.fail()
        },
        complete(info){
          if (options.complete) options.complete()
        }

      })
    },
    fail:function(){
      options.fail()
    }
  });
  
  
}

module.exports = { getBankNumber, initOcr}


