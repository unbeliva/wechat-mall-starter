// cloudfunctions/addToCart/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { productId, skuId, qty = 1 } = event
  const { OPENID } = cloud.getWXContext()
  if (!productId) return { success: false, err: 'MISSING_PRODUCT' }
  try {
    const doc = { productId, skuId, qty, createdAt: new Date(), updatedAt: new Date() }
    const r = await db.collection('carts').add({ data: doc })
    return { success: true, cartId: r._id }
  } catch (err) {
    return { success: false, err: err.message }
  }
}
