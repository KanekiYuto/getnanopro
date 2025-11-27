import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

// Better Auth 服务端配置
export const auth = betterAuth({
  // 数据库配置
  database: {
    // 使用环境变量配置数据库连接
    provider: 'sqlite', // 或者 'postgresql', 'mysql'
    url: process.env.DATABASE_URL || 'file:./db.sqlite',
  },

  // 邮箱密码登录配置
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // 可选：是否需要邮箱验证
  },

  // 社交登录配置
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Google OAuth 回调地址会自动设置为 /api/auth/callback/google
    },
  },

  // 会话配置
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 天
    updateAge: 60 * 60 * 24, // 每天更新一次会话
  },

  // 使用 Next.js Cookie 适配器
  plugins: [nextCookies()],

  // 其他配置
  advanced: {
    // 生产环境使用更安全的配置
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
});
