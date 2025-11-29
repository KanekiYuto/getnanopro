'use client';

import { useTranslations } from 'next-intl';
import useUserStore from '@/store/useUserStore';
import useModalStore from '@/store/useModalStore';
import { useLoading } from '@/hooks/useLoading';
import DashboardHeader from './components/DashboardHeader';
import QuotaCard from './components/QuotaCard';
import StatCard from './components/StatCard';
import QuickActions from './components/QuickActions';
import RecentGenerations from './components/RecentGenerations';

export default function DashboardPage() {
  const { user, isLoading, quotaInfo } = useUserStore();
  const { openLoginModal } = useModalStore();
  const t = useTranslations('dashboard.stats');
  const tCommon = useTranslations('dashboard');

  // 自动管理页面加载状态
  useLoading();

  // 加载中时返回 null，由全局 Loading 显示
  if (isLoading) {
    return null;
  }

  // 未登录状态 - 显示 DashboardHeader 和登录提示
  if (!user) {
    return (
      <div className="min-h-screen">
        <DashboardHeader isLoggedIn={false} />

        {/* 登录提示区域 */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* 图标 */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            {/* 标题和描述 */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {tCommon('loginPrompt.title')}
            </h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              {tCommon('loginPrompt.description')}
            </p>

            {/* 登录按钮 */}
            <button
              onClick={openLoginModal}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-bg text-white font-semibold transition-all hover:scale-105 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>{tCommon('loginPrompt.cta')}</span>
            </button>

            {/* 功能列表 */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl gradient-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">{tCommon('loginPrompt.features.quota')}</h3>
                <p className="text-sm text-text-muted">{tCommon('loginPrompt.features.quotaDesc')}</p>
              </div>

              <div className="p-6 rounded-xl gradient-border">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">{tCommon('loginPrompt.features.projects')}</h3>
                <p className="text-sm text-text-muted">{tCommon('loginPrompt.features.projectsDesc')}</p>
              </div>

              <div className="p-6 rounded-xl gradient-border">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">{tCommon('loginPrompt.features.analytics')}</h3>
                <p className="text-sm text-text-muted">{tCommon('loginPrompt.features.analyticsDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userType = user.userType;

  return (
    <div className="min-h-screen">
      <DashboardHeader userName={user.name} userType={userType} />

      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* 剩余配额 */}
          <QuotaCard userType={userType} quotaInfo={quotaInfo} />

          {/* 总项目数 */}
          <StatCard
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            }
            value={0}
            label={t('projects')}
            color="secondary"
          />

          {/* 已上传图片数 */}
          <StatCard
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            value={0}
            label={t('images')}
            color="blue"
          />

          {/* 创建模板数 */}
          <StatCard
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v2a1 1 0 01-2 0V5zm16 0a1 1 0 00-1-1h-4a1 1 0 100 2h2v2a1 1 0 102 0V5zM4 15a1 1 0 011 1v2h2a1 1 0 110 2H5a1 1 0 01-1-1v-4zm16 0a1 1 0 00-1 1v2h-2a1 1 0 100 2h4a1 1 0 001-1v-4z"
                />
              </svg>
            }
            value={0}
            label={t('templates')}
            color="purple"
          />
        </div>

        {/* 快速操作 */}
        <QuickActions />

        {/* 最近生成 */}
        <RecentGenerations />
      </div>
    </div>
  );
}
