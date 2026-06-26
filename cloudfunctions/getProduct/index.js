// cloudfunctions/getProduct/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event) => {
  const { id } = event
  try {
    const res = await db.collection('products').doc(id).get()
    return { success: true, data: res.data }
  } catch (err) {
    return { success: false, err: err.message }
  }
}
