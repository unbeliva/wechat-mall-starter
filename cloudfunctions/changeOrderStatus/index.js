// cloudfunctions/changeOrderStatus/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event) => {
  const { orderId, status } = event
  if (!orderId || !status) return { success: false, err: 'MISSING_PARAMS' }
  try {
    const r = await db.collection('orders').doc(orderId).update({ data: { status, updatedAt: new Date() } })
    return { success: true }
  } catch (err) {
    return { success: false, err: err.message }
  }
}
