// 定价配置接口
export interface PricingTier {
  id: string; // 用于匹配翻译文件中的方案数据
  monthlyPrice: number; // 月付价格
  yearlyPrice: number; // 年付价格
  highlighted?: boolean; // 是否为推荐方案
  creemPayMonthlyId?: string; // Creem Pay 月度订阅产品 ID
  creemPayYearlyId?: string; // Creem Pay 年度订阅产品 ID
}

// 年付折扣百分比
export const yearlyDiscountPercent = 20;

// 计算年付价格的辅助函数
const calculateYearlyPrice = (monthlyPrice: number): number => {
  return Math.round(monthlyPrice * 12 * (1 - yearlyDiscountPercent / 100));
};

// 定价方案配置（仅包含价格数据）
export const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    // 免费版无需 Creem Pay 产品 ID
  },
  {
    id: 'basic',
    monthlyPrice: 15,
    yearlyPrice: calculateYearlyPrice(15),
    highlighted: true,
    creemPayMonthlyId: process.env.NEXT_PUBLIC_CREEM_PAY_BASIC_MONTHLY_ID,
    creemPayYearlyId: process.env.NEXT_PUBLIC_CREEM_PAY_BASIC_YEARLY_ID,
  },
  {
    id: 'pro',
    monthlyPrice: 45,
    yearlyPrice: calculateYearlyPrice(45),
    creemPayMonthlyId: process.env.NEXT_PUBLIC_CREEM_PAY_PRO_MONTHLY_ID,
    creemPayYearlyId: process.env.NEXT_PUBLIC_CREEM_PAY_PRO_YEARLY_ID,
  },
];
