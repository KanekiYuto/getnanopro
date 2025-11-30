import { db } from '@/lib/db';
import { subscription, transaction, quota } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPricingTierByProductId } from '@/config/pricing';

/**
 * 订阅支付成功事件处理器
 * 当订阅支付成功时触发（首次支付、续费或升级）
 * 根据实际支付金额发放积分
 */
export async function handleSubscriptionPaid(data: any) {
  const {
    id,
    last_transaction,
    last_transaction_id,
    product,
    current_period_end_date,
    next_transaction_date,
    metadata
  } = data;

  const userId = (metadata?.referenceId) as string || null;

  // 从产品ID获取订阅计划信息
  const pricingTier = getPricingTierByProductId(product.id);

  if (!pricingTier) {
    console.error('✗ Subscription paid: Product ID not found in pricing config', { productId: product.id });
    return;
  }

  const planInfo = {
    planType: pricingTier.planType,
    subscriptionPlanType: pricingTier.subscriptionPlanType,
    quota: pricingTier.price * 100
  };

  if (!userId || !planInfo?.subscriptionPlanType) {
    console.error('✗ Subscription paid: Missing required data', { userId, productId: product.id, planInfo });
    return;
  }

  try {
    // 查找现有订阅
    const [existingSubscription] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.paymentSubscriptionId, id))
      .limit(1);

    if (!existingSubscription) {
      console.error(`✗ Subscription not found: ${id}`);
      return;
    }

    // 判断是升级还是降级
    // 如果新订阅价格高于当前价格，立即升级；否则计划下次降级
    const isUpgrade = product.price > existingSubscription.amount;

    if (isUpgrade) {
      // 升级：立即更新 planType，清空 nextPlanType
      await db
        .update(subscription)
        .set({
          planType: planInfo.subscriptionPlanType,
          nextPlanType: null,
          amount: product.price,
          currency: product.currency,
          expiresAt: new Date(current_period_end_date),
          nextBillingAt: new Date(next_transaction_date),
          updatedAt: new Date(),
        })
        .where(eq(subscription.paymentSubscriptionId, id));

      console.log(`✓ Subscription upgraded: ${id} - Plan: ${existingSubscription.planType} → ${planInfo.subscriptionPlanType}`);
    } else {
      // 降级或续费：只更新 nextPlanType，planType 保持不变
      await db
        .update(subscription)
        .set({
          nextPlanType: planInfo.subscriptionPlanType,
          amount: product.price,
          currency: product.currency,
          expiresAt: new Date(current_period_end_date),
          nextBillingAt: new Date(next_transaction_date),
          updatedAt: new Date(),
        })
        .where(eq(subscription.paymentSubscriptionId, id));

      console.log(`✓ Subscription plan scheduled: ${id} - Next plan: ${planInfo.subscriptionPlanType} (effective next billing)`);
    }

    // 如果有交易信息且支付金额大于0，创建交易记录并发放积分
    if (last_transaction && last_transaction.amount_paid > 0) {
      // 1. 创建交易记录
      const [transactionRecord] = await db.insert(transaction).values({
        userId,
        subscriptionId: existingSubscription.id,
        paymentTransactionId: last_transaction_id || last_transaction.id,
        type: 'subscription_payment',
        amount: last_transaction.amount_paid,
        currency: last_transaction.currency || 'USD',
      }).returning();

      console.log(`✓ Created transaction ${transactionRecord.id} - Amount paid: ${last_transaction.amount_paid}`);

      // 2. 根据实际支付金额发放积分
      const quotaAmount = last_transaction.amount_paid;

      // 判断配额类型：
      // - 如果实际支付金额等于产品价格，则为正常订阅配额（使用订阅计划类型）
      // - 如果实际支付金额不等于产品价格，则为订阅变更补偿配额（如升级的差额）
      const quotaType = quotaAmount === planInfo.quota
        ? planInfo.subscriptionPlanType
        : 'subscription_change_compensation';

      await db.insert(quota).values({
        userId,
        transactionId: transactionRecord.id,
        type: quotaType,
        amount: quotaAmount,
        consumed: 0,
        issuedAt: new Date(),
        expiresAt: current_period_end_date ? new Date(current_period_end_date) : null,
      });

      console.log(`✓ Granted ${quotaAmount} quota to user ${userId} - Type: ${quotaType}`);
    } else {
      console.log(`⚠ No transaction created: amount_paid is ${last_transaction?.amount_paid || 0}`);
    }

  } catch (error) {
    console.error('✗ Subscription paid handler error:', error);
    throw error;
  }
}
