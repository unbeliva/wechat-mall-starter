Page({
  data:{ orders: [] },
  onLoad(){ this.load() },
  load(){ wx.cloud.database().collection('orders').orderBy('createdAt','desc').get().then(res=>this.setData({ orders: res.data })) }
})
