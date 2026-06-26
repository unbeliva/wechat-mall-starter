# wechat-mall-starter

微信小程序电商 Starter（云开发）

功能亮点
- 支持商品 SKU（多规格）
- 购物车、下单、订单状态机（自提流程）
- 云函数：getProducts、getProduct、createOrder、changeOrderStatus、initData

说明
- 本仓库为示例 starter，使用微信云开发（Cloud Base / 腾讯云 + 小程序云函数 + 云数据库）
- 默认小程序 AppID 已填入项目配置（请在微信开发者工具中确认）
- 请在微信开发者工具中登录并启用“云开发”，创建或选择一个云环境（envId），部署云函数，并在云数据库创建 collections（products, orders, users）或运行 initData 云函数初始化样例数据。

快速开始
1. 在微信开发者工具中打开本项目（导入本仓库），确保 AppID 正确（已配置在 miniprogram/project.config.json）。
2. 打开“云开发”面板，创建或选择 env，并记下 envId。
3. 部署云函数：在云开发面板选择“部署全部云函数”。
4. 在云数据库手动创建集合 products/orders/users，或在“云函数”中运行 initData 来自动插入示例数据。
5. 预览小程序：商品列表 -> 加入购物车 -> 下单（自提） -> 管理端改状态为 READY_FOR_PICKUP -> 用户完成自提。

注意与扩展
- 目前订单创建会由服务端校验价格与库存；示例中为自提场景默认将订单置为 PAID（无线上支付）。如需接入微信支付，请参考微信支付接口，或联系我来帮你集成。
- 并发库存问题：示例没有实现分布式事务或强一致库存锁；若你有高并发需求，建议在后端使用事务/锁或基于 Redis 的库存预扣方案。


