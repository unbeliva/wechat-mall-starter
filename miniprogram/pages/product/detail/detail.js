// miniprogram/pages/product/detail/detail.js (updated to use addToCart cloud function)
Page({
  data: { product: { images:[], skus:[] }, selectedSkuId: null, qty: 1 },
  onLoad(e) { this.loadProduct(e.id) },
  loadProduct(id) {
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({ name: 'getProduct', data: { id } })
      .then(res => this.setData({ product: res.result.data }))
      .catch(() => wx.showToast({ title: '加载失败', icon: 'none' }))
      .finally(() => wx.hideLoading())
  },
  onSkuChange(e) { this.setData({ selectedSkuId: e.detail.value }) },
  addToCart() {
    const sku = this.data.selectedSkuId || (this.data.product.skus[0] && this.data.product.skus[0].skuId)
    if (!sku) return wx.showToast({ title: '请选择规格', icon: 'none' })
    const payload = { productId: this.data.product._id, skuId: sku, qty: this.data.qty }
    wx.showLoading({ title: '加入中' })
    wx.cloud.callFunction({ name: 'addToCart', data: payload })
      .then(res => {
        wx.hideLoading()
        if (res.result && res.result.success) wx.showToast({ title: '已加入购物车' })
        else wx.showToast({ title: '加入失败', icon: 'none' })
      }).catch(()=>{ wx.hideLoading(); wx.showToast({ title: '加入失败', icon:'none' }) })
  },
  goCart() { wx.navigateTo({ url: '/pages/cart/index/index' })
  }
})
