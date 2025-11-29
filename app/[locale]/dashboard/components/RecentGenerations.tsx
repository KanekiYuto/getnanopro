'use client';

import { useTranslations } from 'next-intl';

export default function RecentGenerations() {
  const t = useTranslations('dashboard.recent');

  // TODO: 从 API 获取最近生成的内容
  const hasGenerations = false;

  return (
    <div className="rounded-xl gradient-border p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{t('title')}</h2>
          <p className="text-sm text-text-muted mt-1">{t('subtitle')}</p>
        </div>
        <button className="text-sm gradient-text hover:opacity-80 transition-opacity cursor-pointer font-semibold">
          {t('viewAll')} →
        </button>
      </div>

      {/* 空状态 */}
      {!hasGenerations && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t('empty.title')}</h3>
          <p className="text-text-muted mb-6">{t('empty.subtitle')}</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-bg text-white font-semibold transition-all hover:scale-105 cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{t('empty.cta')}</span>
          </button>
        </div>
      )}

      {/* 图片网格 - 当有数据时显示 */}
      {/* TODO: 实现图片网格 */}
    </div>
  );
}
