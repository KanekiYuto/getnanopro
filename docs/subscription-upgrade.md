# 订阅升级功能实现文档

## 概述

本文档描述了订阅升级功能的实现,允许用户从当前订阅方案升级到更高级别的方案。

## 功能特性

1. **自动检测升级**: 系统会自动判断目标方案是否为升级(基于订阅等级)
2. **按比例计费**: 支持三种升级计费模式:
   - `proration-charge-immediately`: 立即按比例收费(默认)
   - `proration-charge`: 按比例计费,在下个账单周期收费
   - `proration-none`: 不按比例计费
3. **自动更新**: 升级成功后,订阅信息和用户权限会自动更新
4. **配额发放**:
   - **升级**: 发放完整的新方案配额
   - **续费**: 发放完整配额
   - **首次订阅**: 发放完整配额(由 `onSubscriptionActive` + `onSubscriptionPaid` 处理)
   - 旧配额保留,用户可继续使用

## 订阅等级

系统中的订阅等级从低到高为:

1. `monthly_basic` - 基础版月付
2. `yearly_basic` - 基础版年付
3. `monthly_pro` - 专业版月付
4. `yearly_pro` - 专业版年付

## 文件说明

### 后端文件

#### 1. `/app/api/subscription/upgrade/route.ts`
订阅升级 API 路由

**功能**:
- 验证用户身份
- 检查当前订阅状态
- 调用 Creem API 执行升级
- 更新本地数据库

**请求格式**:
```json
{
  "productId": "prod_xxx",
  "updateBehavior": "proration-charge-immediately"
}
```

**环境变量要求**:
- `CREEM_API_KEY`: Creem API 密钥(必需)
- `CREEM_API_URL`: Creem API 地址(必需)

#### 2. `/lib/creem/webhook-handlers.ts`
Webhook 数据库处理函数

**新增函数**: `updateSubscriptionOnPaid()`

**功能**:
- 自动检测是首次支付、续费还是升级
- 更新订阅的计划类型、价格、货币等信息
- 发放完整配额(升级和续费都发放完整配额)
- 旧配额保留不删除

#### 3. `/app/api/creem/webhook/route.ts`
Creem Webhook 处理器

**修改**:
- 添加 `getPlanInfoByProductId()` 辅助函数,从产品ID获取订阅计划信息
- 所有 webhook 事件处理器改为通过产品ID获取 `planType` 和 `subscriptionPlanType`,而不是从 metadata 获取
- `onSubscriptionPaid` 调用 `updateSubscriptionOnPaid()` 处理配额发放:
  - 自动检测是升级还是续费
  - 升级和续费都发放完整配额

#### 4. `/config/pricing.ts`
定价配置

**新增函数**: `getPricingTierByProductId(productId: string)`

**功能**:
- 根据 Creem 产品 ID 查找对应的定价配置
- 返回包含 `planType` 和 `subscriptionPlanType` 的配置信息

### 配置文件

所有订阅方案的产品ID必须在 `.env.local` 中配置:

```bash
# Creem 产品 ID
NEXT_PUBLIC_CREEM_PAY_BASIC_MONTHLY_ID=prod_xxx
NEXT_PUBLIC_CREEM_PAY_BASIC_YEARLY_ID=prod_xxx
NEXT_PUBLIC_CREEM_PAY_PRO_MONTHLY_ID=prod_xxx
NEXT_PUBLIC_CREEM_PAY_PRO_YEARLY_ID=prod_xxx

# Creem API 配置
CREEM_API_KEY=your_api_key
CREEM_API_URL=https://api.creem.io
CREEM_WEBHOOK_SECRET=your_webhook_secret
```

### 前端文件

#### 1. `/components/subscription/UpgradeSubscriptionButton.tsx`
升级订阅按钮组件

**功能**:
- 调用升级 API
- 显示加载状态
- 处理成功/失败回调

**Props**:
```typescript
interface UpgradeSubscriptionButtonProps {
  productId: string;              // 目标产品ID
  children?: React.ReactNode;      // 按钮内容
  className?: string;              // 样式类名
  updateBehavior?: string;         // 升级计费模式
  onSuccess?: () => void;          // 成功回调
  onError?: (error: string) => void; // 失败回调
}
```

#### 2. `/components/Pricing.tsx`
定价页面组件

**修改**:
- 导入 `UpgradeSubscriptionButton` 组件
- 根据 `isUpgrade()` 判断使用升级按钮还是购买按钮
- 升级成功后自动刷新订阅信息

## 工作流程

### 用户升级流程

1. 用户访问定价页面
2. 系统获取用户当前订阅信息
3. 系统判断目标方案是否为升级
4. 用户点击"升级订阅"按钮
5. 调用 `/api/subscription/upgrade` API
6. API 调用 Creem 升级接口
7. Creem 处理升级并触发 webhook
8. Webhook 更新本地数据库
9. 前端刷新订阅信息

### Webhook 处理流程

#### 首次订阅流程

1. Creem 触发 `subscription.active` 事件
   - `onSubscriptionActive` 创建订阅记录(不发放配额)
2. Creem 触发 `subscription.paid` 事件
   - `onSubscriptionPaid` → `updateSubscriptionOnPaid()`
   - 检测为首次支付(planType 相同)
   - 发放完整配额
3. Creem 触发 `grant_access` 事件
   - `onGrantAccess` 授予用户权限

#### 升级订阅流程

1. 用户点击"升级订阅"按钮
2. 调用 `/api/subscription/upgrade` API
3. Creem 处理升级并触发 `subscription.paid` 事件
4. `onSubscriptionPaid` → `updateSubscriptionOnPaid()`
   - 检测为升级(planType 不同)
   - 发放完整的新方案配额
   - 更新订阅信息
5. Creem 触发 `grant_access` 事件
   - `onGrantAccess` 更新用户权限

#### 续费流程

1. Creem 自动续费并触发 `subscription.paid` 事件
2. `onSubscriptionPaid` → `updateSubscriptionOnPaid()`
   - 检测为续费(planType 相同)
   - 发放完整配额
3. 订阅信息自动更新

## 注意事项

1. **环境变量**:
   - 必须配置 `CREEM_API_KEY` 和 `CREEM_API_URL`
   - 必须配置所有产品的 `NEXT_PUBLIC_CREEM_PAY_*_ID`
2. **产品ID映射**:
   - 系统通过产品ID自动识别订阅计划类型
   - 确保 `config/pricing.ts` 中的产品ID与环境变量一致
3. **订阅状态**: 只有状态为 `active` 的订阅才能升级
4. **幂等性**: 所有 webhook 处理函数都是幂等的,可以安全地重试
5. **配额发放逻辑**:
   - **升级**: 发放完整配额,类型为订阅计划类型
   - **续费/首次**: 发放完整配额,类型为订阅计划类型
   - 旧配额保留不变,用户可继续使用累积配额
6. **计费**: 默认使用 `proration-charge-immediately` 立即按比例收费
7. **Metadata**: 前端不再需要传递 `planType` 和 `subscriptionPlanType` 到 metadata,这些信息会从产品ID自动获取

## 测试建议

1. **功能测试**:
   - 测试从 monthly_basic 升级到 yearly_basic
   - 测试从 monthly_basic 升级到 monthly_pro
   - 测试从 yearly_basic 升级到 yearly_pro

2. **边界测试**:
   - 测试无活跃订阅时的升级请求
   - 测试升级到相同或更低级别的方案
   - 测试 API 密钥未配置的情况

3. **集成测试**:
   - 验证 webhook 正确更新数据库
   - 验证积分正确发放
   - 验证用户权限正确更新

## 故障排查

### 升级失败

检查:
- CREEM_API_KEY 和 CREEM_API_URL 是否配置正确
- 当前订阅状态是否为 active
- 目标产品ID是否有效

### 数据未更新

检查:
- Webhook 是否成功接收
- Webhook 处理器是否报错
- 数据库连接是否正常

### 积分未发放

检查:
- `grantSubscriptionQuota()` 是否执行
- 是否存在重复发放的情况(检查日志中的 "⚠ Quota already granted" 警告)
