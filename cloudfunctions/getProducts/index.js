// cloudfunctions/getProducts/index.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event) => {
  const { limit = 20, skip = 0 } = event
  try {
    const res = await db.collection('products').limit(limit).skip(skip).get()
    return { success: true, data: res.data }
  } catch (err) {
    return { success: false, err: err.message }
  }
}
