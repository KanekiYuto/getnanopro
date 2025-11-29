'use client';

import { usePathname } from '@/i18n/routing';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Loading from '@/components/common/Loading';
import useLoadingStore from '@/store/useLoadingStore';

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
  const { isLoading, loadingText } = useLoadingStore();

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
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header - 固定在顶部 */}
        <Header />

        {/* Main 内容区域 - 可滚动 */}
        <main className="relative flex-1 bg-bg text-text overflow-y-auto scrollbar-dark">
          {/* 全局 Loading 遮罩层 - 只遮罩 main 区域，最先渲染 */}
          {isLoading && (
            <div className="fixed inset-0 lg:left-64 top-[60px] bg-bg/90 backdrop-blur-md z-[200] flex items-center justify-center">
              <Loading text={loadingText} fullScreen={false} />
            </div>
          )}

          {children}

          {/* Footer - 放在 main 内容底部 */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
