'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Loading from '@/components/common/Loading';

interface QuotaItem {
  id: string;
  type: string;
  amount: number;
  consumed: number;
  available: number;
  issuedAt: Date;
  expiresAt: Date | null;
}

interface QuotaData {
  totalAvailable: number;
  activeQuotas: QuotaItem[];
  expiredQuotas: QuotaItem[];
}

export default function QuotaPage() {
  const t = useTranslations('quota');
  const [quotaData, setQuotaData] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const expiredTabRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    fetchQuotaList();
  }, []);

  // 更新下划线位置
  useEffect(() => {
    const updateIndicator = () => {
      const currentRef = activeTab === 'active' ? activeTabRef : expiredTabRef;
      if (currentRef.current) {
        const { offsetLeft, offsetWidth } = currentRef.current;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  const fetchQuotaList = async () => {
    try {
      const response = await fetch('/api/quota/list');
      const result = await response.json();

      if (result.success) {
        setQuotaData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch quota list:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return t('table.noExpiry');
    return new Date(date).toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const renderQuotaList = (quotas: QuotaItem[]) => {
    if (quotas.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-bg-hover flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-text-dim"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-text-muted">
            {activeTab === 'active' ? t('empty.active') : t('empty.expired')}
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {quotas.map((quota) => {
          const percentage = quota.amount > 0 ? (quota.consumed / quota.amount) * 100 : 0;

          return (
            <div
              key={quota.id}
              className="group bg-gradient-to-br from-bg-elevated to-bg-elevated/50 gradient-border rounded-2xl p-6 transition-all duration-300 cursor-pointer"
            >
              {/* 配额类型和状态 */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {t(`quotaTypes.${quota.type}`)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(quota.issuedAt)}</span>
                    <span className="text-text-dim">→</span>
                    <span>{formatDate(quota.expiresAt)}</span>
                  </div>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    quota.available > 0
                      ? 'bg-success/15 text-success'
                      : 'bg-text-dim/15 text-text-dim'
                  }`}
                >
                  {quota.available > 0 ? t('status.active') : t('status.depleted')}
                </div>
              </div>

              {/* 配额进度条 */}
              <div className="mb-4">
                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">
                      {formatAmount(quota.available)}
                    </span>
                    <span className="text-sm text-text-muted">
                      / {formatAmount(quota.amount)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-text-muted">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="relative w-full h-3 bg-bg-card rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                      percentage < 50
                        ? 'bg-gradient-to-r from-success to-success/80'
                        : percentage < 80
                          ? 'bg-gradient-to-r from-warning to-warning/80'
                          : 'bg-gradient-to-r from-error to-error/80'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* 使用统计 - 精简版 */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{t('stats.consumed')}:</span>
                  <span className="text-sm font-bold text-white">{quota.consumed.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{t('stats.remaining')}:</span>
                  <span className="text-sm font-bold text-success">{formatAmount(quota.available)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

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
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent gradient-border-colorful rounded-3xl p-8 mb-6 overflow-hidden group transition-all duration-300">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-primary/10 transition-all duration-500" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
                <div className="relative p-5 rounded-2xl gradient-bg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-2 font-medium">{t('summary.title')}</p>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {quotaData?.totalAvailable.toLocaleString()}
                  </h2>
                  <span className="text-lg text-primary font-semibold">{t('summary.credits')}</span>
                </div>
              </div>
            </div>

            {/* 右侧装饰 */}
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-semibold text-success">{t('status.active')}</span>
              </div>
              <p className="text-xs text-text-dim">
                {quotaData?.activeQuotas.length || 0} {t('tabs.active')}
              </p>
            </div>
          </div>
        </div>

        {/* 标签页切换 */}
        <div className="mb-8">
          <div className="relative flex items-center gap-8 border-b border-border">
            <button
              ref={activeTabRef}
              onClick={() => setActiveTab('active')}
              className={`relative pb-4 font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'active'
                  ? 'text-white'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                {t('tabs.active')}
                {quotaData && quotaData.activeQuotas.length > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                      activeTab === 'active'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-bg-hover text-text-dim'
                    }`}
                  >
                    {quotaData.activeQuotas.length}
                  </span>
                )}
              </div>
            </button>
            <button
              ref={expiredTabRef}
              onClick={() => setActiveTab('expired')}
              className={`relative pb-4 font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'expired'
                  ? 'text-white'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                {t('tabs.expired')}
                {quotaData && quotaData.expiredQuotas.length > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                      activeTab === 'expired'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-bg-hover text-text-dim'
                    }`}
                  >
                    {quotaData.expiredQuotas.length}
                  </span>
                )}
              </div>
            </button>

            {/* 滑动下划线指示器 */}
            <div
              className="absolute bottom-0 h-0.5 rounded-full transition-all duration-500 ease-out gradient-bg"
              style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }}
            />
            {/* 发光效果 */}
            <div
              className="absolute bottom-0 h-4 w-10 rounded-full bg-primary/20 blur-xl transition-all duration-500 ease-out"
              style={{ left: `${indicatorStyle.left + indicatorStyle.width / 2 - 20}px` }}
            />
          </div>
        </div>

        {/* 配额列表 */}
        <div className="relative">
          <div
            className={`transition-all duration-300 ${
              activeTab === 'active'
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'
            }`}
          >
            {quotaData && renderQuotaList(quotaData.activeQuotas)}
          </div>
          <div
            className={`transition-all duration-300 ${
              activeTab === 'expired'
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
            }`}
          >
            {quotaData && renderQuotaList(quotaData.expiredQuotas)}
          </div>
        </div>
      </div>
    </div>
  );
}
