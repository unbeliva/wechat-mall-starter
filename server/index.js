// server/index.js - payment skeleton (optional for production)
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

// This server is a skeleton to show how you might integrate real WeChat Pay.
// For development we provide cloudfunction createPrepay which simulates payment.

app.post('/unifiedorder', (req, res) => {
  // TODO: implement real unifiedorder with mchid, apikey, and sign
  // For now return mock response structure
  const { orderNo, amount, openid } = req.body
  const prepay_id = 'mock_prepay_' + orderNo
  const payParams = {
    timeStamp: Math.floor(Date.now()/1000).toString(),
    nonceStr: 'mocknonce',
    package: `prepay_id=${prepay_id}`,
    signType: 'MD5',
    paySign: 'MOCK_SIGN'
  }
  res.json({ success: true, payParams })
})

// notify endpoint (example)
app.post('/pay/notify', (req, res) => {
  // parse xml body and validate signature -> update order status
  // Here we just return success
  res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>')
})

app.listen(3001, ()=>console.log('Mock pay server listening on 3001'))
