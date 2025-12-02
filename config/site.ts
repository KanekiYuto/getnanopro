import { locales } from '@/i18n/config';

// 站点配置
export const siteConfig = {
  name: 'GetNanoPro',
  nameShort: 'G', // 侧边栏收缩时显示的简短名称
  url: process.env.NEXT_PUBLIC_SITE_URL,
  description: '使用先进的 AI 技术生成高质量图片，支持多种模型和参数定制',

  // SEO 元信息
  author: 'GetNanoPro Team',
  creator: 'GetNanoPro',
  publisher: 'GetNanoPro',
  robots: 'index, follow',

  // OpenGraph 配置
  openGraph: {
    siteName: 'GetNanoPro',
    type: 'website' as const,
  },

  // 支持的语言列表（从 i18n 配置导入）
  locales,

  // Twitter 配置
  twitter: {
    site: '@GetNanoPro',
    creator: '@GetNanoPro',
    card: 'summary_large_image' as const,
  },

  // 社交链接
  links: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },

  // 联系方式
  contact: {
    email: 'support@getnanopro.com',
  },

  // 法律信息
  legal: {
    termsLastUpdated: '2025-11-27',
    privacyLastUpdated: '2025-11-27',
  }
};

