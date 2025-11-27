'use client';

import { useState } from 'react';
import useSidebarStore from '@/store/useSidebarStore';
import { useTranslations } from 'next-intl';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const t = useTranslations('common');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isCollapsed, toggleSidebar, toggleCollapsed } = useSidebarStore();

  return (
    <>
      <header className="sticky top-0 z-50 bg-bg-elevated border-b border-border h-[60px] flex-shrink-0">
        <nav className="h-full px-4 lg:px-8" aria-label="Global">
          <div className="w-full h-full grid grid-cols-3 lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* 左侧: 侧边栏按钮 */}
            <div className="flex justify-start items-center gap-2">
              {/* Sidebar 收缩按钮 - 仅在桌面端显示 */}
              <button
                type="button"
                className="hidden lg:inline-flex items-center justify-center rounded-lg p-2 text-text-muted hover:bg-white/10 hover:text-white transition-colors duration-200"
                onClick={toggleCollapsed}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <span className="sr-only">
                  {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                </span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                  />
                </svg>
              </button>

              {/* Sidebar 切换按钮 - 仅在移动端显示 */}
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-text-muted hover:bg-white/10 hover:text-white transition-colors duration-200"
                onClick={toggleSidebar}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M9 3v18"></path>
                </svg>
                <span className="sr-only">Toggle Sidebar</span>
              </button>
            </div>

            {/* 中间: Logo - 仅在移动端显示并居中 */}
            <div className="lg:hidden flex justify-center items-center">
              <a
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity duration-200"
              >
                <p className="text-xl font-bold text-white">
                  Logo
                </p>
              </a>
            </div>

            {/* 中间: 导航菜单 (桌面端) */}
            <div className="hidden lg:flex items-center justify-center gap-x-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-text-muted hover:text-text transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-bg-hover"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* 右侧: 移动端菜单按钮 */}
            <div className="flex justify-end items-center gap-2">
              {/* 移动端菜单按钮 */}
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-text-muted hover:bg-white/10 hover:text-white transition-colors duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

      </header>

      {/* 移动端菜单打开时的遮罩层 */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[60px] bg-black/40 z-40 animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 移动端菜单面板 - 占满剩余高度 */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[60px] left-0 right-0 bottom-0 bg-bg-elevated z-50 overflow-y-auto animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-text-muted hover:bg-white/8 hover:text-white transition-all duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
