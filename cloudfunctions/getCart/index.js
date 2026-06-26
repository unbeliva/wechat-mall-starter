// cloudfunctions/getCart/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  try {
    const carts = await db.collection('carts').where({ _openid: OPENID }).get()
    const items = carts.data || []
    const prodIds = items.map(i => i.productId)
    const prods = await db.collection('products').where({ _id: db.command.in(prodIds) }).get()
    const prodMap = (prods.data || []).reduce((m,p)=>{ m[p._id]=p; return m }, {})
    const cartItems = items.map(it => {
      const p = prodMap[it.productId] || {}
      const sku = (p.skus||[]).find(s=>s.skuId===it.skuId) || { price: p.price, attrs: [] }
      return { cartId: it._id, product: p, sku, qty: it.qty }
    })
    return { success: true, data: cartItems }
  } catch (err) {
    return { success: false, err: err.message }
  }
}
