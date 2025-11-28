'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { pricingTiers as pricingConfig, yearlyDiscountPercent } from '@/config/pricing';

// 翻译文件中的方案数据接口
interface TierTranslation {
  name: string;
  description: string;
  features: string[];
  cta: string;
}

export default function Pricing() {
  const t = useTranslations('pricing');
  const [isYearly, setIsYearly] = useState(false);

  // 从翻译文件中获取文案数据
  const tierTranslations = t.raw('tiers') as TierTranslation[];

  return (
    <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs sm:text-sm font-semibold text-primary">定价方案</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white px-4">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            {t('subtitle')}
          </p>

          {/* 订阅周期切换 */}
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-bg-elevated/80 backdrop-blur-sm border border-border">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 cursor-pointer ${
                !isYearly
                  ? 'bg-gradient-to-r from-primary to-primary-hover text-white scale-105'
                  : 'text-text-muted hover:text-text hover:bg-bg-hover/50'
              }`}
            >
              {t('billing.monthly')}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 relative cursor-pointer ${
                isYearly
                  ? 'bg-gradient-to-r from-primary to-primary-hover text-white scale-105'
                  : 'text-text-muted hover:text-text hover:bg-bg-hover/50'
              }`}
            >
              {t('billing.yearly')}
              {/* 折扣标签 */}
              <span className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold bg-gradient-to-r from-secondary to-secondary/90 text-white rounded-full">
                {t('billing.discount')}
              </span>
            </button>
          </div>
        </div>

        {/* 定价卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {pricingConfig.map((tier, index) => {
            // 从配置文件获取价格数据
            const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
            const originalYearlyPrice = tier.monthlyPrice * 12;
            const yearlySavings = originalYearlyPrice - tier.yearlyPrice;

            // 从翻译文件获取文案数据
            const translation = tierTranslations[index];

            return (
              <div
                key={tier.id}
                className={`group relative rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 hover:translate-y-[-4px] sm:hover:translate-y-[-8px] ${
                  tier.highlighted
                    ? 'border-primary/50 bg-gradient-to-br from-primary/10 via-bg-elevated to-bg-elevated md:scale-105 z-10'
                    : 'border-border/50 bg-gradient-to-br from-bg-elevated to-bg-card hover:border-primary/30'
                }`}
              >
                {/* 推荐标签 */}
                {tier.highlighted && (
                  <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-primary via-primary to-primary-hover text-white text-xs sm:text-sm font-bold rounded-full whitespace-nowrap">
                    ✨ {t('recommended')}
                  </div>
                )}

                {/* 装饰性背景 - 仅在桌面端显示 */}
                <div className="hidden sm:block absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                <div className="relative p-6 sm:p-8">
                  {/* 方案名称 */}
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                    {translation.name}
                  </h3>
                  <p className="text-sm sm:text-base text-text-muted mb-4 sm:mb-6 leading-relaxed">{translation.description}</p>

                  {/* 价格 */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                        ${price}
                      </span>
                      <span className="text-sm sm:text-base text-text-muted">
                        /{isYearly ? t('billing.year') : t('billing.month')}
                      </span>
                      {/* 年付节省提示 */}
                      {isYearly && yearlySavings > 0 && (
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 sm:border-2 sm:border-secondary/40">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[10px] sm:text-xs font-semibold text-secondary whitespace-nowrap">
                            {t('billing.save', { amount: yearlySavings })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA 按钮 */}
                  <button
                    className={`group/btn w-full h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 mb-6 sm:mb-8 relative overflow-hidden cursor-pointer ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-primary via-primary to-primary-hover text-white hover:scale-[1.02] active:scale-95'
                        : 'border-2 border-border hover:border-primary/50 text-text hover:text-white hover:bg-gradient-to-r hover:from-primary/80 hover:to-primary active:scale-95'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {translation.cta}
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>

                  {/* 功能列表 */}
                  <ul className="space-y-3 sm:space-y-4">
                    {translation.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-text-muted leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
