// miniprogram/pages/cart/index/index.js (updated to use getCart cloud function)
Page({
  data:{ cartItems: [] },
  onLoad(){ this.loadCart() },
  loadCart(){
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({ name: 'getCart' })
      .then(res=>{
        wx.hideLoading()
        if (res.result && res.result.success) {
          this.setData({ cartItems: res.result.data })
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' })
        }
      }).catch(()=>{ wx.hideLoading(); wx.showToast({ title: '加载失败', icon:'none' }) })
  },
  toCheckout(){
    const items = this.data.cartItems.map(c=>({ productId: c.product._id, skuId: c.sku.skuId, qty: c.qty }))
    wx.navigateTo({ url: `/pages/checkout/index/index?items=${encodeURIComponent(JSON.stringify(items))}` })
  }
})
