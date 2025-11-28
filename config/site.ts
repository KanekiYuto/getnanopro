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

// Footer 链接配置
export interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const footerSections: FooterSection[] = [
  {
    title: 'Quick Links',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: '用户服务协议', href: '/terms' },
      { name: '隐私政策', href: '/privacy' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: 'https://nextjs.org/docs', external: true },
      { name: 'GitHub', href: siteConfig.links.github, external: true },
      { name: 'Tailwind CSS', href: 'https://tailwindcss.com', external: true },
    ],
  },
];

// 导航菜单配置
export interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigationGroups: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { name: 'Home', href: '/', icon: 'home' },
      { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
      { name: 'Pricing', href: '/pricing', icon: 'pricing' },
      { name: 'Analytics', href: '/analytics', icon: 'chart' },
    ],
  },
  {
    title: 'Content',
    items: [
      { name: 'Projects', href: '/projects', icon: 'folder' },
      { name: 'Documents', href: '/documents', icon: 'document' },
      { name: 'Media', href: '/media', icon: 'image' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { name: 'Profile', href: '/profile', icon: 'user' },
      { name: 'Settings', href: '/settings', icon: 'settings' },
      { name: 'Help', href: '/help', icon: 'help' },
    ],
  },
];
