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
