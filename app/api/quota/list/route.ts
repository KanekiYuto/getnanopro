import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { quota } from '@/lib/db/schema';
import { eq, gte, desc } from 'drizzle-orm';

/**
 * 获取用户配额列表
 * GET /api/quota/list
 */
export async function GET(request: NextRequest) {
  try {
    // 获取当前登录用户的会话
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // 检查用户是否已登录
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const now = new Date();

    // 获取所有配额(包括已过期和未过期的)
    const allQuotas = await db
      .select()
      .from(quota)
      .where(eq(quota.userId, userId))
      .orderBy(desc(quota.issuedAt));

    // 分类配额
    const activeQuotas = allQuotas.filter(
      (q) => !q.expiresAt || q.expiresAt > now
    );
    const expiredQuotas = allQuotas.filter(
      (q) => q.expiresAt && q.expiresAt <= now
    );

    // 计算总可用配额
    let totalAvailable = 0;
    for (const q of activeQuotas) {
      const available = q.amount - q.consumed;
      totalAvailable += Math.max(0, available);
    }

    return NextResponse.json({
      success: true,
      data: {
        totalAvailable,
        activeQuotas: activeQuotas.map((q) => ({
          id: q.id,
          type: q.type,
          amount: q.amount,
          consumed: q.consumed,
          available: Math.max(0, q.amount - q.consumed),
          issuedAt: q.issuedAt,
          expiresAt: q.expiresAt,
        })),
        expiredQuotas: expiredQuotas.map((q) => ({
          id: q.id,
          type: q.type,
          amount: q.amount,
          consumed: q.consumed,
          available: Math.max(0, q.amount - q.consumed),
          issuedAt: q.issuedAt,
          expiresAt: q.expiresAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get quota list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
