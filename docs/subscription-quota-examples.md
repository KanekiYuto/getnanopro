# 订阅配额发放示例

本文档展示了不同场景下的配额发放逻辑。

## 配额配置

根据 `config/subscription.ts`:

| 订阅计划 | 配额数量 |
|---------|---------|
| monthly_basic | 1,500 |
| yearly_basic | 180 |
| monthly_pro | 7,500 |
| yearly_pro | 900 |

## 场景示例

### 场景 1: 首次订阅基础版月付

**操作**: 用户首次订阅 `monthly_basic`

**流程**:
1. `onSubscriptionActive` 创建订阅记录
2. `onSubscriptionPaid` 检测为首次支付
3. 发放完整配额: **1,500**

**配额记录**:
```javascript
{
  type: 'monthly_basic',
  amount: 1500,
  consumed: 0
}
```

### 场景 2: 基础版月付续费

**操作**: 用户续费 `monthly_basic`

**流程**:
1. `onSubscriptionPaid` 检测为续费(planType 相同)
2. 发放完整配额: **1,500**

**配额记录**:
```javascript
// 第一个月
{
  type: 'monthly_basic',
  amount: 1500,
  consumed: 800  // 已使用 800
}

// 续费后新增
{
  type: 'monthly_basic',
  amount: 1500,
  consumed: 0
}
```

**总可用配额**: (1500 - 800) + 1500 = **2,200**

### 场景 3: 从基础版月付升级到专业版月付

**操作**: 用户从 `monthly_basic` 升级到 `monthly_pro`

**当前配额**:
```javascript
{
  type: 'monthly_basic',
  amount: 1500,
  consumed: 500  // 已使用 500
}
```

**流程**:
1. `onSubscriptionPaid` 检测为升级(planType 不同)
2. 发放完整的新方案配额: **7,500**

**配额记录**:
```javascript
// 原有配额(保留)
{
  type: 'monthly_basic',
  amount: 1500,
  consumed: 500
}

// 升级后新配额
{
  type: 'monthly_pro',
  amount: 7500,
  consumed: 0
}
```

**总可用配额**: (1500 - 500) + 7500 = **8,500**

### 场景 4: 从基础版月付升级到基础版年付

**操作**: 用户从 `monthly_basic` 升级到 `yearly_basic`

**当前配额**:
```javascript
{
  type: 'monthly_basic',
  amount: 1500,
  consumed: 1200  // 已使用 1200
}
```

**流程**:
1. `onSubscriptionPaid` 检测为升级
2. 计算差额: 180 - 1500 = **-1,320**
3. 差额为负,不发放额外配额

**配额记录**:
```javascript
// 原有配额(保留)
{
  type: 'monthly_basic',
  amount: 1500,
  consumed: 1200
}

// 不发放新配额(降级场景)
```

**总可用配额**: 1500 - 1200 = **300**

**日志输出**:
```
⚠ Downgrade detected: quota difference is -1320, no additional quota granted
```

### 场景 5: 从基础版年付升级到专业版年付

**操作**: 用户从 `yearly_basic` 升级到 `yearly_pro`

**当前配额**:
```javascript
{
  type: 'yearly_basic',
  amount: 180,
  consumed: 50  // 已使用 50
}
```

**流程**:
1. `onSubscriptionPaid` 检测为升级
2. 发放完整的新方案配额: **900**

**配额记录**:
```javascript
// 原有配额(保留)
{
  type: 'yearly_basic',
  amount: 180,
  consumed: 50
}

// 升级后新配额
{
  type: 'yearly_pro',
  amount: 900,
  consumed: 0
}
```

**总可用配额**: (180 - 50) + 900 = **1,030**

### 场景 6: 专业版月付续费

**操作**: 用户续费 `monthly_pro`

**当前配额**:
```javascript
{
  type: 'monthly_pro',
  amount: 7500,
  consumed: 6000  // 已使用 6000
}
```

**流程**:
1. `onSubscriptionPaid` 检测为续费
2. 发放完整配额: **7,500**

**配额记录**:
```javascript
// 第一个月
{
  type: 'monthly_pro',
  amount: 7500,
  consumed: 6000
}

// 续费后新增
{
  type: 'monthly_pro',
  amount: 7500,
  consumed: 0
}
```

**总可用配额**: (7500 - 6000) + 7500 = **9,000**

## 配额类型说明

| 配额类型 | 说明 | 示例 |
|---------|------|------|
| `monthly_basic` | 基础版月付完整配额 | 首次订阅/续费/升级 |
| `yearly_basic` | 基础版年付完整配额 | 首次订阅/续费/升级 |
| `monthly_pro` | 专业版月付完整配额 | 首次订阅/续费/升级 |
| `yearly_pro` | 专业版年付完整配额 | 首次订阅/续费/升级 |

## 关键设计原则

1. **保留旧配额**: 升级时不删除或修改旧配额,用户可继续使用剩余部分
2. **发放完整配额**: 升级和续费都发放完整的新方案配额
3. **配额累积**: 用户的总可用配额 = 所有未过期配额的剩余量之和
4. **统一类型**: 升级和续费使用相同的配额类型(订阅计划类型)

## 数据库查询示例

### 查询用户总可用配额

```sql
SELECT
  SUM(amount - consumed) as available_quota
FROM quota
WHERE
  user_id = 'user_xxx'
  AND (expires_at IS NULL OR expires_at > NOW())
```

### 查询用户配额明细

```sql
SELECT
  type,
  amount,
  consumed,
  (amount - consumed) as remaining,
  issued_at,
  expires_at
FROM quota
WHERE
  user_id = 'user_xxx'
ORDER BY issued_at DESC
```

### 查询按类型分组的配额统计

```sql
SELECT
  type,
  SUM(amount) as total_amount,
  SUM(consumed) as total_consumed,
  SUM(amount - consumed) as total_remaining
FROM quota
WHERE
  user_id = 'user_xxx'
  AND (expires_at IS NULL OR expires_at > NOW())
GROUP BY type
ORDER BY total_remaining DESC
```
