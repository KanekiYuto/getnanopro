'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CreemCheckout } from '@creem_io/nextjs';
import useUserStore from '@/store/useUserStore';
import { getUniquePlanTypes, getPricingTiersByPlan, isSubscriptionUpgrade, type BillingCycle, type PlanType } from '@/config/pricing';
import { quotaConfig } from '@/lib/quota/config';
import { SUBSCRIPTION_QUOTA_CONFIG } from '@/config/subscription';
import UpgradeSubscriptionButton from '@/components/subscription/UpgradeSubscriptionButton';

// 翻译文件中的方案数据接口
interface TierTranslation {
  name: string;
  description: string;
  features: string[];
  cta: string;
}

// 订阅信息接口
interface Subscription {
  id: string;
  planType: string; // 如 'monthly_basic', 'yearly_pro'
  status: string;
  amount: number; // 订阅金额(美分)
}

export default function Pricing() {
  const t = useTranslations('pricing');
  const { user } = useUserStore();
  const [isYearly, setIsYearly] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

  // 从翻译文件中获取文案数据
  const tierTranslations = t.raw('tiers') as TierTranslation[];

  // 获取当前计费周期的定价方案（去重后的方案类型列表）
  const billingCycle: BillingCycle = isYearly ? 'yearly' : 'monthly';
  const uniquePlanTypes = useMemo(() => getUniquePlanTypes(), []);

  // 获取用户当前订阅
  useEffect(() => {
    if (!user) return;

    fetch('/api/subscription/current')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setCurrentSubscription(result.data);
        }
      })
      .catch(error => console.error('Failed to fetch subscription:', error));
  }, [user]);

  // 比较订阅等级（直接比较价格）
  const compareSubscriptionLevel = (targetPrice: number): 'upgrade' | 'same' | 'downgrade' | 'none' => {
    if (!currentSubscription || currentSubscription.status !== 'active') {
      return 'none';
    }

    // 当前订阅价格(美分转美元)
    const currentPrice = currentSubscription.amount / 100;

    // 直接比较价格
    if (targetPrice > currentPrice) {
      return 'upgrade';
    } else if (targetPrice < currentPrice) {
      return 'downgrade';
    } else {
      return 'same';
    }
  };

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
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-bg-elevated/80 backdrop-blur-sm gradient-border">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 cursor-pointer ${
                !isYearly
                  ? 'gradient-bg text-white scale-105'
                  : 'text-text-muted hover:text-text hover:bg-bg-hover/50'
              }`}
            >
              {t('billing.monthly')}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 relative cursor-pointer ${
                isYearly
                  ? 'gradient-bg text-white scale-105'
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
          {uniquePlanTypes.map((planType, index) => {
            // 获取当前计费周期和所有周期的定价
            const allPricings = getPricingTiersByPlan(planType);
            const currentTier = allPricings.find(t => t.billingCycle === billingCycle);
            const monthlyTier = allPricings.find(t => t.billingCycle === 'monthly');
            const yearlyTier = allPricings.find(t => t.billingCycle === 'yearly');

            if (!currentTier) return null;

            // 计算年付节省金额
            const originalYearlyPrice = monthlyTier ? monthlyTier.price * 12 : 0;
            const yearlySavings = yearlyTier ? originalYearlyPrice - yearlyTier.price : 0;

            // 从翻译文件获取文案数据
            const translation = tierTranslations[index];

            return (
              <div
                key={`${planType}-${billingCycle}`}
                className={`group relative rounded-2xl sm:rounded-3xl transition-all duration-500 hover:translate-y-[-4px] sm:hover:translate-y-[-8px] ${
                  currentTier.highlighted
                    ? 'gradient-border-colorful bg-gradient-to-br from-primary/10 via-bg-elevated to-bg-elevated md:scale-105 z-10'
                    : 'gradient-border bg-gradient-to-br from-bg-elevated to-bg-card'
                }`}
              >
                {/* 推荐标签 */}
                {currentTier.highlighted && (
                  <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-1.5 sm:py-2 gradient-bg text-white text-xs sm:text-sm font-bold rounded-full whitespace-nowrap">
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
                        ${currentTier.price}
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
                  {(() => {
                    const productId = currentTier.creemPayProductId;

                    // 检查是否为当前订阅
                    const isCurrentSubscription = currentSubscription &&
                      currentSubscription.planType === currentTier.subscriptionPlanType &&
                      currentSubscription.status === 'active';

                    // 免费方案或产品 ID 未配置
                    if (planType === 'free' || !productId) {
                      return (
                        <button
                          disabled
                          className="group/btn w-full h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 mb-6 sm:mb-8 relative overflow-hidden cursor-not-allowed opacity-50 gradient-border text-text"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {planType === 'free' ? translation.cta : '产品配置中...'}
                          </span>
                        </button>
                      );
                    }

                    // 当前订阅
                    if (isCurrentSubscription) {
                      return (
                        <button
                          disabled
                          className="group/btn w-full h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 mb-6 sm:mb-8 relative overflow-hidden cursor-not-allowed gradient-bg text-white opacity-70"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            当前订阅
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </button>
                      );
                    }

                    // 付费方案且产品 ID 已配置
                    // 判断订阅等级（传入目标方案价格）
                    const subscriptionLevel = compareSubscriptionLevel(currentTier.price);
                    const isUpgrade = subscriptionLevel === 'upgrade';
                    const isDowngrade = subscriptionLevel === 'downgrade';
                    const buttonText = isUpgrade ? '升级订阅' : translation.cta;

                    // 如果是降级,禁用按钮
                    if (isDowngrade) {
                      return (
                        <button
                          disabled
                          className="group/btn w-full h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 mb-6 sm:mb-8 relative overflow-hidden cursor-not-allowed gradient-border text-text-muted opacity-50"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            降级方案
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </button>
                      );
                    }

                    // 如果是升级,使用 UpgradeSubscriptionButton
                    if (isUpgrade) {
                      return (
                        <UpgradeSubscriptionButton
                          productId={productId}
                          className={`group/btn w-full h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 mb-6 sm:mb-8 relative overflow-hidden cursor-pointer ${
                            currentTier.highlighted
                              ? 'gradient-bg text-white hover:scale-[1.02] active:scale-95'
                              : 'gradient-border text-text hover:text-white hover:gradient-bg active:scale-95'
                          }`}
                          onSuccess={() => {
                            // 升级成功后重新获取订阅信息
                            fetch('/api/subscription/current')
                              .then(res => res.json())
                              .then(result => {
                                if (result.success && result.data) {
                                  setCurrentSubscription(result.data);
                                }
                              })
                              .catch(error => console.error('Failed to refresh subscription:', error));
                          }}
                          onError={(error) => {
                            console.error('Upgrade error:', error);
                            // 这里可以显示错误提示
                          }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {buttonText}
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                        </UpgradeSubscriptionButton>
                      );
                    }

                    // 新订阅使用 CreemCheckout
                    return (
                      <CreemCheckout
                        productId={productId}
                        referenceId={user?.id}
                        customer={user ? {
                          email: user.email,
                          name: user.name,
                        } : undefined}
                        metadata={{
                          // planType: planType,
                          // subscriptionPlanType: currentTier.subscriptionPlanType,
                        }}
                      >
                        <button
                          className={`group/btn w-full h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 mb-6 sm:mb-8 relative overflow-hidden cursor-pointer ${
                            currentTier.highlighted
                              ? 'gradient-bg text-white hover:scale-[1.02] active:scale-95'
                              : 'gradient-border text-text hover:text-white hover:gradient-bg active:scale-95'
                          }`}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {buttonText}
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                        </button>
                      </CreemCheckout>
                    );
                  })()}

                  {/* 功能列表 */}
                  <ul className="space-y-3 sm:space-y-4">
                    {translation.features.map((feature, featureIndex) => {
                      // 获取配额数量
                      let quota = 0;
                      if (planType === 'free') {
                        quota = quotaConfig.dailyFreeQuota;
                      } else if (currentTier.subscriptionPlanType) {
                        quota = SUBSCRIPTION_QUOTA_CONFIG[currentTier.subscriptionPlanType] || 0;
                      }

                      // 格式化数字，添加千位分隔符
                      const formattedQuota = quota.toLocaleString();

                      // 替换占位符
                      const featureText = feature.replace('{quota}', formattedQuota);

                      return (
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
                            {featureText}
                          </span>
                        </li>
                      );
                    })}
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
