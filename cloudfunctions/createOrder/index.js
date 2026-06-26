// cloudfunctions/createOrder/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 订单状态：PENDING_PAYMENT, PAID, PREPARING, READY_FOR_PICKUP, COMPLETED, CANCELLED, REFUNDING, REFUNDED

exports.main = async (event, context) => {
  const { items = [], pickupStore = {}, payMethod = 'SELF_PICK' } = event
  const { OPENID } = cloud.getWXContext()
  try {
    if (!items || items.length === 0) return { success: false, err: 'NO_ITEMS' }
    // 获取商品与 sku 信息
    const prodIds = items.map(i=>i.productId)
    const prodRes = await db.collection('products').where({ _id: db.command.in(prodIds) }).get()
    const prodMap = prodRes.data.reduce((m,p)=>{ m[p._id]=p; return m }, {})
    let totalServer = 0
    const orderItems = []
    for (const it of items) {
      const p = prodMap[it.productId]
      if (!p) return { success: false, err: 'PRODUCT_NOT_FOUND', productId: it.productId }
      const sku = (p.skus||[]).find(s => s.skuId === it.skuId) || { price: p.price, stock: p.stock, attrs: [] }
      if ((sku.stock||p.stock) < it.qty) return { success: false, err: 'OUT_OF_STOCK', productId: it.productId }
      totalServer += (sku.price || p.price) * it.qty
      orderItems.push({ productId: p._id, skuId: sku.skuId || null, title: p.title, price: (sku.price||p.price), qty: it.qty, attrs: sku.attrs || [] })
    }
    // 创建订单号
    const orderNo = 'ORD' + Date.now()
    const status = (payMethod === 'SELF_PICK') ? 'PAID' : 'PENDING_PAYMENT'
    const order = {
      orderNo,
      userOpenId: OPENID,
      items: orderItems,
      total: totalServer,
      pickupStore,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const r = await db.collection('orders').add({ data: order })
    // 扣减库存（简单实现：逐个更新）
    for (const it of orderItems) {
      // 优先扣 sku.stock
      const prod = prodMap[it.productId]
      if (prod.skus && prod.skus.length) {
        const skus = prod.skus.map(s => { if (s.skuId === it.skuId) s.stock = (s.stock || 0) - it.qty; return s })
        await db.collection('products').doc(prod._id).update({ data: { skus, stock: (prod.stock || 0) - it.qty } })
      } else {
        await db.collection('products').doc(prod._id).update({ data: { stock: (prod.stock || 0) - it.qty } })
      }
    }
    return { success: true, orderId: r._id, order }
  } catch (err) {
    return { success: false, err: err.message }
  }
}
