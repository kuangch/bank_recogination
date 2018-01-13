var toBase64 = function (imgFile, callBack, type) {

  //通过微信请求的方式获取图片的 arraybuffer
  wx.request({
    url: imgFile.path,
    responseType: "arraybuffer",
    success(res) {
      console.log(res.data.lenght)
      try{
        var base64 = wx.arrayBufferToBase64(res.data) 
        callBack && callBack(base64 ? base64 : '')
      }catch(e){
        console.log(e)
        callBack(-1)
      }
    },
    fail(err) {
      callBack(-1)
    }
  })

}

module.exports = { toBase64 }