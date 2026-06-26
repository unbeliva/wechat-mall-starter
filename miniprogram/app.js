// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用最新微信基础库并启用云开发')
    } else {
      wx.cloud.init({ traceUser: true })
    }
  }
})
