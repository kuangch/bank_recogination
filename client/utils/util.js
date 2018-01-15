const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 加载
var showBusy = text => wx.showLoading({
    title: text,
    mask: true
})

// 显示成功提示
var showSuccess = (text, duration) => {

  wx.showToast({
    title: text,
    icon: 'success',
    duration: duration || 1500
  })
} 

// 显示失败提示
var showModel = (title, content) => {

    wx.showModal({
        title,
        content: content,
        showCancel: false
    })
}

module.exports = { formatTime, showBusy, showSuccess, showModel }
