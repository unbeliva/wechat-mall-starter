// cloudfunctions/createPrepay/index.js
// 模拟统一下单（用于开发/测试）
// 在真实接入支付时，请把此逻辑替换为调用你自己后端或微信支付 unifiedorder

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { orderId } = event
  const { OPENID } = cloud.getWXContext()
  if (!orderId) return { success: false, err: 'MISSING_ORDER_ID' }
  try {
    const orderRes = await db.collection('orders').doc(orderId).get()
    const order = orderRes.data
    if (!order) return { success: false, err: 'ORDER_NOT_FOUND' }
    if (order.userOpenId !== OPENID) return { success: false, err: 'NOT_ORDER_OWNER' }
    // 模拟：如果订单处于 PENDING_PAYMENT，则标记为 PAID 并返回模拟 payParams
    if (order.status !== 'PENDING_PAYMENT') {
      return { success: false, err: 'ORDER_NOT_PENDING' }
    }
    // 更新为已支付（模拟）
    await db.collection('orders').doc(orderId).update({ data: { status: 'PAID', payInfo: { method: 'MOCK', paidAt: new Date() }, updatedAt: new Date() } })

    // 返回模拟前端 pay 参数结构（与真实小程序 requestPayment 参数一致）
    const timeStamp = Math.floor(Date.now() / 1000).toString()
    const nonceStr = 'mocknonce' + Math.floor(Math.random()*100000)
    const prepay_id = 'mock_prepay_' + order.orderNo
    const payParams = {
      timeStamp,
      nonceStr,
      package: `prepay_id=${prepay_id}`,
      signType: 'MD5',
      paySign: 'MOCK_SIGN'
    }
    return { success: true, payParams }
  } catch (err) {
    return { success: false, err: err.message }
  }
}
