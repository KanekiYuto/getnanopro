import { pgTable, text, timestamp, boolean, integer, uuid } from 'drizzle-orm/pg-core';

// Better Auth 用户表
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  // 用户类型: free(免费), basic(基础版), pro(专业版)
  userType: text('user_type').notNull().default('free'),
  // 当前活跃的订阅ID (关联 subscription 表)
  currentSubscriptionId: uuid('current_subscription_id'),
});

// Better Auth 会话表
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

// Better Auth 账户表 (用于 OAuth)
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

// Better Auth 验证表
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
});

// 配额信息表
export const quota = pgTable('quota', {
  // UUID 主键,由数据库自动生成
  id: uuid('id').primaryKey().defaultRandom(),
  // 用户ID
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  // 关联的交易ID (可选,免费配额时为空)
  transactionId: uuid('transaction_id').references(() => transaction.id, { onDelete: 'cascade' }),
  // 配额类型: daily_free(免费配额-每日), monthly_basic(月度订阅-基础版), monthly_pro(月度订阅-专业版), yearly_basic(年度订阅-基础版), yearly_pro(年度订阅-专业版), quota_pack(配额包)
  type: text('type').notNull(),
  // 配额数量 (默认为 0)
  amount: integer('amount').notNull().default(0),
  // 已消耗配额数量
  consumed: integer('consumed').notNull().default(0),
  // 下发时间
  issuedAt: timestamp('issued_at').notNull(),
  // 过期时间 (null 表示永不过期)
  expiresAt: timestamp('expires_at'),
  // 创建时间
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // 更新时间
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 订阅信息表
export const subscription = pgTable('subscription', {
  // UUID 主键,由数据库自动生成
  id: uuid('id').primaryKey().defaultRandom(),
  // 用户ID
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  // 支付平台: creem, stripe, paypal 等
  paymentPlatform: text('payment_platform').notNull(),
  // 支付平台的订阅ID
  paymentSubscriptionId: text('payment_subscription_id').notNull(),
  // 支付平台的客户ID
  paymentCustomerId: text('payment_customer_id'),
  // 订阅计划类型: monthly_basic, monthly_pro, yearly_basic, yearly_pro
  planType: text('plan_type').notNull(),
  // 下次计划类型: 用于计划升级/降级,在下次续费时生效
  nextPlanType: text('next_plan_type'),
  // 订阅状态: active(活跃), canceled(已取消), expired(已过期), pending(待支付)
  status: text('status').notNull().default('pending'),
  // 订阅金额(分/美分)
  amount: integer('amount').notNull(),
  // 货币类型: USD, CNY 等
  currency: text('currency').notNull().default('USD'),
  // 订阅开始时间
  startedAt: timestamp('started_at'),
  // 订阅结束时间
  expiresAt: timestamp('expires_at'),
  // 下次续费时间
  nextBillingAt: timestamp('next_billing_at'),
  // 取消时间
  canceledAt: timestamp('canceled_at'),
  // 创建时间
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // 更新时间
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 交易记录表
export const transaction = pgTable('transaction', {
  // UUID 主键,由数据库自动生成
  id: uuid('id').primaryKey().defaultRandom(),
  // 用户ID
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  // 关联的订阅ID (可选,一次性支付时为空)
  subscriptionId: uuid('subscription_id').references(() => subscription.id, { onDelete: 'cascade' }),
  // 支付平台的交易ID
  paymentTransactionId: text('payment_transaction_id').notNull(),
  // 交易类型: subscription_payment(订阅支付), one_time_payment(一次性支付), refund(退款)
  type: text('type').notNull(),
  // 交易金额(分/美分)
  amount: integer('amount').notNull(),
  // 货币类型: USD, CNY 等
  currency: text('currency').notNull().default('USD'),
  // 创建时间
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
