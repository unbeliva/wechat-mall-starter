Page({
  data:{ cartItems: [] },
  onLoad(){ this.loadCart() },
  loadCart(){
    const db = wx.cloud.database()
    db.collection('carts').get().then(res=>{
      // 将 cart 文档中的 productId 转为完整商品信息（示例：简单查一次）
      const items = res.data.map(d=>d.item)
      const ids = items.map(i=>i.productId)
      db.collection('products').where({_id: db.command.in(ids)}).get().then(p=>{
        const map = p.data.reduce((m,x)=>{m[x._id]=x;return m},{})
        const cartItems = items.map(it=>({ item: it, product: map[it.productId], sku: (map[it.productId].skus||[]).find(s=>s.skuId===it.skuId) }))
        this.setData({ cartItems })
      })
    })
  },
  toCheckout(){
    const items = this.data.cartItems.map(c=>({ productId: c.item.productId, skuId: c.item.skuId, qty: c.item.qty }))
    wx.navigateTo({ url: `/pages/checkout/index/index?items=${encodeURIComponent(JSON.stringify(items))}` })
  }
})
