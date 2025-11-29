'use client';

import { usePathname } from '@/i18n/routing';
import useSidebarStore from '@/store/useSidebarStore';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';
import { navigationGroups, type NavItem } from '@/config/navigation';
import { useSession, signOut, signIn } from '@/lib/auth-client';
import { useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// 增强的图标组件
function Icon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, string> = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    dashboard: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z',
    pricing: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    help: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[name] || icons.home} />
    </svg>
  );
}

// 用户区域组件
function UserSection({ isCollapsed }: { isCollapsed?: boolean }) {
  const { data: session, isPending } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = '/';
          },
        },
      });
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // 加载中状态
  if (isPending) {
    return (
      <div className={classNames(
        'flex items-center gap-3 rounded-md px-3 py-2.5 animate-pulse',
        isCollapsed ? 'justify-center' : ''
      )}>
        <div className="w-8 h-8 rounded-full bg-border shrink-0" />
        {!isCollapsed && (
          <div className="flex-1">
            <div className="w-20 h-4 bg-border rounded mb-1" />
            <div className="w-32 h-3 bg-border rounded" />
          </div>
        )}
      </div>
    );
  }

  // 未登录状态
  if (!session) {
    return (
      <button
        onClick={handleSignIn}
        className={classNames(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all cursor-pointer',
          'bg-primary hover:bg-primary-hover text-white',
          isCollapsed ? 'justify-center' : ''
        )}
      >
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        {!isCollapsed && <span>登录</span>}
      </button>
    );
  }

  // 已登录状态
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={classNames(
          'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-white transition-colors cursor-pointer',
          isCollapsed ? 'justify-center' : ''
        )}
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || '用户'}
            className="w-8 h-8 rounded-full border-2 border-primary shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
          </div>
        )}
        {!isCollapsed && (
          <div className="flex-1 text-left min-w-0">
            <div className="font-medium text-white text-sm truncate">
              {session.user.name || '用户'}
            </div>
            <div className="text-xs text-text-muted truncate">
              {session.user.email}
            </div>
          </div>
        )}
        {!isCollapsed && (
          <svg
            className={classNames(
              'w-4 h-4 transition-transform',
              showMenu ? 'rotate-180' : ''
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* 下拉菜单 */}
      {showMenu && !isCollapsed && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-bg-elevated border border-border rounded-lg shadow-xl overflow-hidden">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text-muted hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>退出登录</span>
          </button>
        </div>
      )}
    </div>
  );
}

// 菜单项组件
function MenuItem({ item, isActive, onClick, isCollapsed, t }: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
  t: (key: string) => string;
}) {
  return (
    <a
      href={item.href}
      onClick={onClick}
      className={classNames(
        'group relative flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 overflow-hidden',
        isCollapsed ? 'justify-center' : '',
        isActive
          ? 'bg-primary/15 text-white border border-primary/40 shadow-lg shadow-primary/10'
          : 'text-text-muted hover:text-white hover:bg-white/8'
      )}
      title={isCollapsed ? t(`navigation.${item.name}`) : ''}
    >
      {/* 激活状态背景渐变 */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/25 via-primary/15 to-transparent" />
      )}

      {/* 左侧激活指示条 */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
      )}

      {/* 图标容器 */}
      <div className={classNames(
        'relative flex items-center justify-center shrink-0 transition-all duration-200 z-10',
        isCollapsed ? 'w-5 h-5' : 'w-5 h-5'
      )}>
        <Icon
          name={item.icon}
          className={classNames(
            'w-full h-full transition-all duration-200',
            isActive
              ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]'
              : 'text-text-muted group-hover:text-white'
          )}
        />
      </div>

      {/* 文本 */}
      {!isCollapsed && (
        <span className={classNames(
          'flex-1 truncate transition-all duration-200 z-10 relative',
          isActive ? 'font-semibold' : ''
        )}>
          {t(`navigation.${item.name}`)}
        </span>
      )}
    </a>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isCollapsed, closeSidebar } = useSidebarStore();
  const t = useTranslations('common');

  return (
    <>
      {/* 移动端 Sidebar - 抽屉式 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeSidebar}
          />

          {/* Sidebar 面板 */}
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-bg-elevated border-r border-border shadow-2xl animate-in slide-in-from-left duration-300">
            {/* 头部 */}
            <div className="relative flex h-[60px] items-center justify-center border-b border-border">
              <a href="/" className="text-2xl font-bold text-white hover:opacity-80 transition-opacity">
                {siteConfig.name}
              </a>
              <button
                type="button"
                className="absolute right-4 rounded-lg p-2 text-text-muted hover:bg-bg-hover hover:text-text transition-colors"
                onClick={closeSidebar}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-dark">
              <div className="space-y-6">
                {navigationGroups.map((group) => (
                  <div key={group.title}>
                    <div className="px-3 mb-3 text-[11px] font-semibold text-text-dim/60 uppercase tracking-widest">
                      {t(`navigation.${group.title}`)}
                    </div>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.name}>
                            <MenuItem
                              item={item}
                              isActive={isActive}
                              onClick={closeSidebar}
                              t={t}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>

            {/* 底部用户区域 */}
            <div className="border-t border-border/50 p-3">
              <UserSection />
            </div>
          </div>
        </div>
      )}

      {/* 桌面端 Sidebar - 可收缩 */}
      <div
        className={classNames(
          'hidden lg:flex lg:flex-col transition-all duration-300 ease-in-out flex-shrink-0 bg-bg-elevated border-r border-border',
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        {/* Logo 区域 */}
        <div className="flex h-[60px] shrink-0 items-center justify-center border-b border-border transition-all duration-300">
          <a
            href="/"
            className={classNames(
              'font-bold text-white hover:opacity-80 transition-opacity',
              isCollapsed ? 'text-2xl' : 'text-2xl'
            )}
            title={isCollapsed ? siteConfig.name : ''}
          >
            {isCollapsed ? siteConfig.nameShort : siteConfig.name}
          </a>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-dark">
          <div className={classNames(isCollapsed ? 'space-y-2' : 'space-y-6')}>
            {navigationGroups.map((group, index) => (
              <div key={group.title}>
                {!isCollapsed && (
                  <div className="px-3 mb-3 text-[11px] font-semibold text-text-dim/60 uppercase tracking-widest">
                    {t(`navigation.${group.title}`)}
                  </div>
                )}
                {isCollapsed && index > 0 && (
                  <div className="h-px bg-white/10 mx-3 my-2" />
                )}
                <ul className={classNames(isCollapsed ? 'space-y-1' : 'space-y-0.5')}>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <MenuItem
                          item={item}
                          isActive={isActive}
                          isCollapsed={isCollapsed}
                          t={t}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* 底部用户区域 */}
        <div className="border-t border-border/50 p-3">
          <UserSection isCollapsed={isCollapsed} />
        </div>
      </div>
    </>
  );
}
