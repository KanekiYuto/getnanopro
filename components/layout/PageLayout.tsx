'use client';

import { usePathname } from '@/i18n/routing';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// 不显示全局布局的路由路径
const HIDDEN_LAYOUT_PATHS: string[] = [
  // 在这里添加不需要显示布局的路径
  // '/admin',
];

interface PageLayoutProps {
  children: React.ReactNode;
}

/**
 * 全局页面布局组件
 * 包含 Sidebar 和 Header
 */
export default function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();

  // 检查当前路径是否应该隐藏全局布局
  const shouldHideLayout = HIDDEN_LAYOUT_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Sidebar - 左侧固定宽度 */}
      <Sidebar />

      {/* 右侧内容区域 - flex-1 自动占用剩余空间 */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Header - 固定在顶部 */}
        <Header />

        {/* Main 内容区域 - 可滚动 */}
        <main className="flex-1 bg-bg text-text overflow-y-auto scrollbar-dark">
          {children}

          {/* Footer - 放在 main 内容底部 */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
