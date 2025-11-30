'use client';

import ManageSubscriptionButton from '@/components/subscription/ManageSubscriptionButton';

interface SubscriptionCardProps {
  subscription: {
    id: string;
    paymentPlatform: string;
    paymentSubscriptionId: string;
    paymentCustomerId: string | null;
    planType: string;
    nextPlanType: string | null;
    status: string;
    amount: number;
    currency: string;
    startedAt: Date;
    expiresAt: Date | null;
    nextBillingAt: Date | null;
    canceledAt: Date | null;
  };
}

/**
 * 订阅卡片组件
 */
export default function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  // 格式化日期
  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 格式化金额
  const formatAmount = (amount: number, currency: string) => {
    return `${currency} ${(amount / 100).toFixed(2)}`;
  };

  // 获取状态信息
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      active: { text: '激活中', className: 'bg-green-500/10 text-green-500' },
      canceled: { text: '已取消', className: 'bg-gray-500/10 text-gray-500' },
      expired: { text: '已过期', className: 'bg-red-500/10 text-red-500' },
      paused: { text: '已暂停', className: 'bg-yellow-500/10 text-yellow-500' },
      pending: { text: '待支付', className: 'bg-blue-500/10 text-blue-500' },
    };
    return statusMap[status] || { text: status, className: 'bg-gray-500/10 text-gray-500' };
  };

  // 获取计划类型文本
  const getPlanTypeText = (planType: string) => {
    const planMap: Record<string, string> = {
      monthly_basic: '基础版 - 月付',
      yearly_basic: '基础版 - 年付',
      monthly_pro: '专业版 - 月付',
      yearly_pro: '专业版 - 年付',
    };
    return planMap[planType] || planType;
  };

  return (
    <div className="bg-bg-elevated rounded-2xl p-6 border border-border">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h2 className="text-xl font-bold text-white">{getPlanTypeText(subscription.planType)}</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-white/5 backdrop-blur-sm">
              <span className="text-text-dim/60 font-medium">订阅</span>
              <span className="text-text-muted/80 font-mono tracking-tight">{subscription.paymentSubscriptionId}</span>
            </div>
            {subscription.paymentCustomerId && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-white/5 backdrop-blur-sm">
                <span className="text-text-dim/60 font-medium">客户</span>
                <span className="text-text-muted/80 font-mono tracking-tight">{subscription.paymentCustomerId}</span>
              </div>
            )}
          </div>
          {/* 显示计划变更信息 */}
          {subscription.nextPlanType && subscription.nextPlanType !== subscription.planType && (
            <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20">
                <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-blue-300/80 font-medium">下次续费切换至</span>
                <span className="text-sm text-white font-semibold">{getPlanTypeText(subscription.nextPlanType)}</span>
              </div>
            </div>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
            getStatusInfo(subscription.status).className
          }`}
        >
          {getStatusInfo(subscription.status).text}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 订阅金额 */}
        <div>
          <p className="text-sm text-text-muted mb-1">订阅金额</p>
          <p className="text-lg font-semibold text-white">
            {formatAmount(subscription.amount, subscription.currency)}
          </p>
        </div>

        {/* 支付平台 */}
        <div>
          <p className="text-sm text-text-muted mb-1">支付平台</p>
          <p className="text-lg font-semibold text-white capitalize">{subscription.paymentPlatform}</p>
        </div>

        {/* 开始日期 */}
        <div>
          <p className="text-sm text-text-muted mb-1">开始日期</p>
          <p className="text-lg font-semibold text-white">{formatDate(subscription.startedAt)}</p>
        </div>

        {/* 到期日期 */}
        <div>
          <p className="text-sm text-text-muted mb-1">到期日期</p>
          <p className="text-lg font-semibold text-white">{formatDate(subscription.expiresAt)}</p>
        </div>

        {/* 下次续费日期 */}
        {subscription.nextBillingAt && subscription.status === 'active' && (
          <div>
            <p className="text-sm text-text-muted mb-1">下次续费日期</p>
            <p className="text-lg font-semibold text-white">{formatDate(subscription.nextBillingAt)}</p>
          </div>
        )}

        {/* 取消日期 */}
        {subscription.canceledAt && (
          <div>
            <p className="text-sm text-text-muted mb-1">取消日期</p>
            <p className="text-lg font-semibold text-white">{formatDate(subscription.canceledAt)}</p>
          </div>
        )}
      </div>

      {/* 管理订阅按钮 */}
      {subscription.paymentCustomerId && subscription.status === 'active' && (
        <div className="mt-6 pt-6 border-t border-border">
          <ManageSubscriptionButton customerId={subscription.paymentCustomerId} />
        </div>
      )}
    </div>
  );
}
