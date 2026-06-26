Page({
  data: { products: [] },
  onLoad() { this.fetchProducts() },
  fetchProducts() {
    wx.showLoading({ title: '加载中' })
    wx.cloud.callFunction({ name: 'getProducts', data: { limit: 50 } })
      .then(res => this.setData({ products: res.result.data || [] }))
      .catch(() => wx.showToast({ title: '加载失败', icon: 'none' }))
      .finally(() => wx.hideLoading())
  },
  goDetail(e) { const id = e.currentTarget.dataset.id; wx.navigateTo({ url: `/pages/product/detail/detail?id=${id}` }) }
})
