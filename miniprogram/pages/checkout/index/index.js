Page({
  data: { stores: [{name:'门店A',id:'store-a'},{name:'门店B',id:'store-b'}], selectedStore: {}, items: [] },
  onLoad(e){ if (e.items) this.setData({ items: JSON.parse(decodeURIComponent(e.items)) }) },
  onStoreChange(e){ this.setData({ selectedStore: this.data.stores[e.detail.value] }) },
  createOrder(){
    if (!this.data.selectedStore.id) return wx.showToast({ title: '请选择门店', icon:'none' })
    wx.showLoading({ title: '下单中' })
    wx.cloud.callFunction({ name: 'createOrder', data: { items: this.data.items, pickupStore: this.data.selectedStore, payMethod: 'SELF_PICK' } })
      .then(res=>{
        wx.hideLoading()
        if (res.result.success) {
          wx.showToast({ title: '下单成功' })
          wx.navigateTo({ url: `/pages/orders/detail/detail?id=${res.result.orderId}` })
        } else {
          wx.showToast({ title: '下单失败: '+(res.result.err || res.result.code), icon:'none' })
        }
      }).catch(()=>{ wx.hideLoading(); wx.showToast({ title: '下单异常', icon:'none' }) })
  }
})
