# Additional README notes

## 新增功能说明（已推送）
- 模拟支付：已新增 cloudfunction `createPrepay`，前端可调用此云函数模拟支付流程，示例返回模拟的 payParams 并把订单状态置为 PAID（开发用）。
- 购物车持久化：新增 `addToCart`、`getCart` 云函数，购物车项保存在 `carts` 集合并关联调用者（_openid）。
- 管理权限：`changeOrderStatus` 已更新为仅允许 `admins` 集合中的用户（基于 _openid）或订单拥有者在受限情形下修改状态。请在云数据库控制台手动在 `admins` 集合中添加管理员记录。 
- 后端骨架：`server/index.js` 为示例服务，包含 unifiedorder 与 notify 的 skeleton（mock）。如需真实接入，请替换实现并配置密钥。

## 下一步（你可以选择）
1. 在云数据库的 `admins` 集合中新增管理员记录（通过控制台 -> 新建文档），以便使用管理端修改订单状态。
2. 在微信开发者工具中部署云函数：`addToCart`、`getCart`、`createPrepay`、`changeOrderStatus`、`getProducts`、`getProduct`、`createOrder`、`initData`。
3. 运行 `initData` 云函数初始化示例商品。
4. 测试购买流程：添加到购物车 -> 去下单（选择自提）-> 订单状态将根据支付方式设为 PAID（自提场景）或 PENDING_PAYMENT（若实现真实支付）-> 管理端（管理员）将状态设为 READY_FOR_PICKUP -> 用户完成自提，管理员或用户可设置为 COMPLETED。

