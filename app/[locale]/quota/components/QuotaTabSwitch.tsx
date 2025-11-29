'use client';

import { useTranslations } from 'next-intl';
import { RefObject } from 'react';

interface QuotaTabSwitchProps {
  activeTab: 'active' | 'expired';
  setActiveTab: (tab: 'active' | 'expired') => void;
  activeTabRef: RefObject<HTMLButtonElement | null>;
  expiredTabRef: RefObject<HTMLButtonElement | null>;
  activeQuotasCount: number;
  expiredQuotasCount: number;
  indicatorStyle: { left: number; width: number };
}

export default function QuotaTabSwitch({
  activeTab,
  setActiveTab,
  activeTabRef,
  expiredTabRef,
  activeQuotasCount,
  expiredQuotasCount,
  indicatorStyle,
}: QuotaTabSwitchProps) {
  const t = useTranslations('quota');

  return (
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
            {activeQuotasCount > 0 && (
              <span
                className={`min-w-[24px] h-6 px-2 flex items-center justify-center rounded text-xs font-medium transition-all duration-300 ${
                  activeTab === 'active'
                    ? 'bg-white text-black'
                    : 'badge-gradient-bg text-gray-400'
                }`}
              >
                {activeQuotasCount}
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
            {expiredQuotasCount > 0 && (
              <span
                className={`min-w-[24px] h-6 px-2 flex items-center justify-center rounded text-xs font-medium transition-all duration-300 ${
                  activeTab === 'expired'
                    ? 'bg-white text-black'
                    : 'badge-gradient-bg text-gray-400'
                }`}
              >
                {expiredQuotasCount}
              </span>
            )}
          </div>
        </button>

        {/* 滑动下划线指示器 */}
        {indicatorStyle.width > 0 && (
          <>
            <div
              className="absolute bottom-0 h-0.5 rounded-full transition-all duration-500 ease-out gradient-bg"
              style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }}
            />
            {/* 发光效果 */}
            <div
              className="absolute bottom-0 h-4 w-10 rounded-full bg-primary/20 blur-xl transition-all duration-500 ease-out"
              style={{ left: `${indicatorStyle.left + indicatorStyle.width / 2 - 20}px` }}
            />
          </>
        )}
      </div>
    </div>
  );
}
