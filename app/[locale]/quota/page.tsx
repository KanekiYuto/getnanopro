'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useTranslations } from 'next-intl';
import useUserStore from '@/store/useUserStore';
import LoginRequired from '@/components/common/LoginRequired';
import QuotaSummaryCard from './components/QuotaSummaryCard';
import QuotaTabSwitch from './components/QuotaTabSwitch';
import QuotaSkeletonCards from './components/QuotaSkeletonCards';
import QuotaList from './components/QuotaList';

interface QuotaItem {
  id: string;
  type: string;
  amount: number;
  consumed: number;
  available: number;
  issuedAt: Date;
  expiresAt: Date | null;
}

export default function QuotaPage() {
  const t = useTranslations('quota');
  const { user } = useUserStore();
  const [totalAvailable, setTotalAvailable] = useState<number | null>(null);
  const [activeQuotas, setActiveQuotas] = useState<QuotaItem[] | null>(null);
  const [expiredQuotas, setExpiredQuotas] = useState<QuotaItem[] | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const expiredTabRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const isInitialMount = useRef(true);

  // 获取总配额（仅在已登录时）
  useEffect(() => {
    if (user) {
      fetchTotalQuota();
    }
  }, [user]);

  // 根据当前标签页加载对应数据（仅在已登录时）
  useEffect(() => {
    if (!user) return;

    if (activeTab === 'active' && activeQuotas === null) {
      fetchActiveQuotas();
    } else if (activeTab === 'expired' && expiredQuotas === null) {
      fetchExpiredQuotas();
    }
  }, [activeTab, activeQuotas, expiredQuotas, user]);

  // 更新下划线位置
  useLayoutEffect(() => {
    const updateIndicator = () => {
      const currentRef = activeTab === 'active' ? activeTabRef : expiredTabRef;
      if (currentRef.current) {
        const { offsetLeft, offsetWidth } = currentRef.current;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    };

    if (isInitialMount.current) {
      // 初始挂载时使用双重 RAF 确保布局完成
      isInitialMount.current = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateIndicator();
        });
      });
    } else {
      // 后续切换立即更新
      updateIndicator();
    }

    window.addEventListener('resize', updateIndicator);

    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab]);

  const fetchTotalQuota = async () => {
    try {
      const response = await fetch('/api/quota/total');
      const result = await response.json();

      if (result.success) {
        setTotalAvailable(result.data.totalAvailable);
      }
    } catch (error) {
      console.error('Failed to fetch total quota:', error);
    }
  };

  const fetchActiveQuotas = async () => {
    try {
      const response = await fetch('/api/quota/list?type=active');
      const result = await response.json();

      if (result.success) {
        setActiveQuotas(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch active quotas:', error);
      setActiveQuotas([]);
    }
  };

  const fetchExpiredQuotas = async () => {
    try {
      const response = await fetch('/api/quota/list?type=expired');
      const result = await response.json();

      if (result.success) {
        setExpiredQuotas(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch expired quotas:', error);
      setExpiredQuotas([]);
    }
  };

  // 未登录状态
  if (!user) {
    return (
      <div className="min-h-screen">
        {/* 页面标题 */}
        <div className="bg-bg-elevated border-b border-border">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
            <p className="text-text-muted">{t('subtitle')}</p>
          </div>
        </div>

        {/* 登录提示 */}
        <LoginRequired
          title="登录查看配额"
          description="登录后即可查看您的配额使用情况和历史记录"
          icon={
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
        />
      </div>
    );
  }

  // 已登录状态
  return (
    <div className="space-y-6 pb-8">
      {/* 页面标题 */}
      <div className="bg-bg-elevated border-b border-border">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
          <p className="text-text-muted">{t('subtitle')}</p>
        </div>
      </div>

      <div className="px-6">
        {/* 总配额卡片 */}
        <QuotaSummaryCard
          totalAvailable={totalAvailable}
          activeQuotasCount={activeQuotas?.length || 0}
        />

        {/* 标签页切换 */}
        <QuotaTabSwitch
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTabRef={activeTabRef}
          expiredTabRef={expiredTabRef}
          activeQuotasCount={activeQuotas?.length || 0}
          expiredQuotasCount={expiredQuotas?.length || 0}
          indicatorStyle={indicatorStyle}
        />

        {/* 配额列表 */}
        <div className="relative">
          <div
            className={`transition-all duration-300 ${
              activeTab === 'active'
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'
            }`}
          >
            {activeQuotas === null ? (
              <QuotaSkeletonCards />
            ) : (
              <QuotaList quotas={activeQuotas} type="active" />
            )}
          </div>
          <div
            className={`transition-all duration-300 ${
              activeTab === 'expired'
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
            }`}
          >
            {expiredQuotas === null ? (
              <QuotaSkeletonCards />
            ) : (
              <QuotaList quotas={expiredQuotas} type="expired" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
