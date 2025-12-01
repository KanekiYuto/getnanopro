import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mediaGenerationTask, quota, quotaTransaction } from '@/lib/db/schema';
import { randomUUID } from 'crypto';
import { auth } from '@/lib/auth';
import { eq, and, gt, or, isNull } from 'drizzle-orm';

// Wavespeed API 配置
const WAVESPEED_API_URL = 'https://api.wavespeed.ai/api/v3/google/nano-banana-pro/text-to-image';
const WAVESPEED_API_KEY = process.env.WAVESPEED_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;

// 请求参数接口
interface TextToImageRequest {
  prompt: string;
  aspect_ratio?: string;
  output_format?: 'png' | 'jpeg' | 'webp';
  resolution?: '2k' | '4k';
  seed?: string;
}

// Wavespeed API 响应接口
interface WavespeedResponse {
  request_id: string;
  status: string;
  output?: {
    images?: string[];
  };
  error?: {
    message: string;
    code: string;
  };
}

/**
 * POST /api/ai-generator/provider/wavespeed/nano-banana-pro/text-to-image
 * Nano Banana Pro 文生图 API (异步模式，使用 webhook)
 */
export async function POST(request: NextRequest) {
  try {
    // 验证 API Key
    if (!WAVESPEED_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Wavespeed API key not configured' },
        { status: 500 }
      );
    }

    // 解析请求参数
    const body: TextToImageRequest = await request.json();
    const {
      prompt,
      aspect_ratio = '1:1',
      output_format = 'png',
      resolution = '2k',
      seed,
    } = body;

    // 验证必填参数
    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 验证 webhook 配置
    if (!APP_URL) {
      return NextResponse.json(
        { success: false, error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    // 获取当前用户
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 计算需要消耗的配额 (根据分辨率和模型)
    const creditsRequired = resolution === '4k' ? 20 : 10;

    // 查找可用的配额记录
    const availableQuotas = await db
      .select()
      .from(quota)
      .where(
        and(
          eq(quota.userId, userId),
          gt(quota.amount, quota.consumed),
          or(isNull(quota.expiresAt), gt(quota.expiresAt, new Date()))
        )
      )
      .orderBy(quota.issuedAt);

    // 计算总可用配额
    const totalAvailable = availableQuotas.reduce(
      (sum, q) => sum + (q.amount - q.consumed),
      0
    );

    if (totalAvailable < creditsRequired) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient credits',
          required: creditsRequired,
          available: totalAvailable,
        },
        { status: 400 }
      );
    }

    // 扣除配额并创建交易记录
    let remainingToConsume = creditsRequired;
    let selectedQuotaId: string | null = null;
    let balanceBefore = 0;
    let balanceAfter = 0;

    for (const quotaRecord of availableQuotas) {
      if (remainingToConsume <= 0) break;

      const available = quotaRecord.amount - quotaRecord.consumed;
      const toConsume = Math.min(available, remainingToConsume);

      if (!selectedQuotaId) {
        selectedQuotaId = quotaRecord.id;
        balanceBefore = available;
      }

      // 更新配额消耗
      await db
        .update(quota)
        .set({
          consumed: quotaRecord.consumed + toConsume,
          updatedAt: new Date(),
        })
        .where(eq(quota.id, quotaRecord.id));

      remainingToConsume -= toConsume;

      if (quotaRecord.id === selectedQuotaId) {
        balanceAfter = balanceBefore - toConsume;
      }
    }

    // 创建配额交易记录
    const [transaction] = await db
      .insert(quotaTransaction)
      .values({
        userId,
        quotaId: selectedQuotaId!,
        type: 'consume',
        amount: -creditsRequired,
        balanceBefore,
        balanceAfter,
        note: `Text-to-image generation: ${prompt.substring(0, 50)}...`,
      })
      .returning();

    const consumeTransactionId = transaction.id;

    // 1. 先生成 taskId
    const taskId = randomUUID();

    // 2. 构建 webhook URL
    const webhookUrl = `${APP_URL}/api/ai-generator/webhook/wavespeed/${taskId}`;

    // 3. 构建请求参数
    const requestParams: Record<string, any> = {
      prompt,
      aspect_ratio,
      output_format,
      resolution,
      enable_base64_output: false,
      enable_sync_mode: false,
    };

    // 如果提供了 seed，添加到参数中
    if (seed) {
      requestParams.seed = parseInt(seed, 10);
    }

    // 4. 构建包含 webhook 的 API URL
    const apiUrlWithWebhook = `${WAVESPEED_API_URL}?webhook=${encodeURIComponent(webhookUrl)}`;

    // 5. 调用 Wavespeed API
    const response = await fetch(apiUrlWithWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WAVESPEED_API_KEY}`,
      },
      body: JSON.stringify(requestParams),
    });

    const data: WavespeedResponse = await response.json();

    // 处理错误响应
    if (!response.ok || data.error) {
      console.error('Wavespeed API error:', data.error);
      return NextResponse.json(
        {
          success: false,
          error: data.error?.message || 'Failed to generate image',
          code: data.error?.code,
        },
        { status: response.status }
      );
    }

    // 6. API 调用成功后创建任务记录
    await db.insert(mediaGenerationTask).values({
      taskId,
      userId,
      taskType: 'text-to-image',
      provider: 'wavespeed',
      providerRequestId: data.request_id,
      model: 'nano-banana-pro',
      status: 'pending',
      progress: 0,
      parameters: {
        prompt,
        aspect_ratio,
        output_format,
        resolution,
        seed,
      },
      consumeTransactionId,
      startedAt: new Date(),
    });

    // 返回任务ID，前端可以通过轮询获取进度
    return NextResponse.json({
      success: true,
      data: {
        task_id: taskId,
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('Text-to-image generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
