// cloudfunctions/changeOrderStatus/index.js (updated with admin check)
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { orderId, status } = event
  const { OPENID } = cloud.getWXContext()
  if (!orderId || !status) return { success: false, err: 'MISSING_PARAMS' }
  try {
    // Check admin: admins collection stores documents with _openid of admins
    const adminRes = await db.collection('admins').where({ _openid: OPENID }).get()
    const isAdmin = (adminRes.data && adminRes.data.length > 0)
    // Allow owner to update certain statuses (e.g., CANCEL), but require admin for status transitions like READY_FOR_PICKUP
    const orderDoc = await db.collection('orders').doc(orderId).get()
    const order = orderDoc.data
    if (!order) return { success: false, err: 'ORDER_NOT_FOUND' }
    // Basic permission logic: owner can cancel before READY_FOR_PICKUP; admins can set any status
    if (!isAdmin) {
      if (order.userOpenId !== OPENID) return { success: false, err: 'NO_PERMISSION' }
      if (status === 'READY_FOR_PICKUP' || status === 'PREPARING') return { success: false, err: 'NO_PERMISSION' }
    }
    await db.collection('orders').doc(orderId).update({ data: { status, updatedAt: new Date() } })
    return { success: true }
  } catch (err) {
    return { success: false, err: err.message }
  }
}
