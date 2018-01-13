var toBase64 = function(imgFile, callBack, type) {
  
  var reader = new FileReader()
  // var base64 = wx.arrayBufferToBase64(imgFile)
  // reader.readAsDataURL(file, { type: "image/jpeg" })
  reader.onload = function(){
    //回调函数
    callBack && callBack(reader.result ? reader.result.replace("data:image/jpeg;base64,", ""): '');
  }
  
}

module.exports = { toBase64}