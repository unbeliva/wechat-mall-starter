// cloudfunctions/initData/index.js (updated to create admin placeholder note)
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async () => {
  try {
    // 示例商品包含 skus
    const products = [
      {
        title: '多规格 T 恤',
        price: 9990,
        stock: 100,
        images: ['https://via.placeholder.com/300x300?text=T-shirt'],
        description: '舒适棉质 T 恤',
        skus: [
          { skuId: 'sku-red-m', attrs: ['红色','M'], price: 9990, stock: 10 },
          { skuId: 'sku-red-l', attrs: ['红色','L'], price: 9990, stock: 5 },
          { skuId: 'sku-blue-m', attrs: ['蓝色','M'], price: 10990, stock: 8 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '运动鞋',
        price: 29900,
        stock: 50,
        images: ['https://via.placeholder.com/300x300?text=Shoe'],
        description: '轻便跑步鞋',
        skus: [ { skuId: 'shoe-42', attrs: ['42码'], price: 29900, stock: 6 } ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    for (const p of products) {
      await db.collection('products').add({ data: p })
    }
    // 提示：管理员账号需在云数据库 admins 集合中添加管理员用户（在管理端中插入一条文档即可）
    return { success: true, note: 'Products inserted. To create admin, add a document to `admins` collection via Cloud Database console.' }
  } catch (err) {
    return { success: false, err: err.message }
  }
}
