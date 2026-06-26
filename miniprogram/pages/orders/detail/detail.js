// miniprogram/pages/orders/detail/detail.js (updated: use order._id vs doc id consistency)
Page({
  data:{ order: {} },
  onLoad(e){ this.load(e.id) },
  load(id){ wx.cloud.database().collection('orders').doc(id).get().then(res=>this.setData({ order: res.data })) },
  markReady(){ const id=this.data.order._id; wx.cloud.callFunction({ name:'changeOrderStatus', data:{ orderId: id, status: 'READY_FOR_PICKUP' } }).then(()=>{ wx.showToast({ title: '已标为准备完成' }); this.load(id) }) }
})
