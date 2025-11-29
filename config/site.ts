// 站点配置
export const siteConfig = {
  name: 'GetNanoPro',
  nameShort: 'G', // 侧边栏收缩时显示的简短名称
  url: process.env.NEXT_PUBLIC_SITE_URL,

  // SEO 元信息
  author: 'GetNanoPro Team',
  creator: 'GetNanoPro',
  publisher: 'GetNanoPro',
  robots: 'index, follow',

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

