// 配额配置
export const quotaConfig = {
  // 每日免费配额数量
  dailyFreeQuota: 30,

  // 基础版月度配额
  basicMonthlyQuota: 500,

  // 专业版月度配额 (-1 表示无限)
  proMonthlyQuota: -1,

  // 基础版年度配额
  basicYearlyQuota: 6000,

  // 专业版年度配额 (-1 表示无限)
  proYearlyQuota: -1,

  // 配额类型
  quotaTypes: {
    dailyFree: 'daily_free',
    monthlyBasic: 'monthly_basic',
    monthlyPro: 'monthly_pro',
    yearlyBasic: 'yearly_basic',
    yearlyPro: 'yearly_pro',
    quotaPack: 'quota_pack',
  },
} as const;
