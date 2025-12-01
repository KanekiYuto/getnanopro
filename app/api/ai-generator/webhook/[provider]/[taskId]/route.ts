import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mediaGenerationTask } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Webhook 请求接口 (Wavespeed 格式)
interface WebhookPayload {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputs?: string[];
  error?: string;
  executionTime?: number;
}

/**
 * POST /api/ai-generator/webhook/[provider]/[taskId]
 * AI 生成器 webhook 回调接口
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string; taskId: string }> }
) {
  try {
    const { provider, taskId } = await params;

    // 解析 webhook 数据
    const payload: WebhookPayload = await request.json();
    const { status, outputs, error } = payload;

    console.log(`Webhook received from ${provider}:`, { taskId, status, outputs });

    // 根据 taskId 和 provider 查找任务
    const tasks = await db
      .select()
      .from(mediaGenerationTask)
      .where(
        and(
          eq(mediaGenerationTask.taskId, taskId),
          eq(mediaGenerationTask.provider, provider)
        )
      )
      .limit(1);

    if (tasks.length === 0) {
      console.error(`Task not found for ${provider}:`, taskId);
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const task = tasks[0];

    // 验证任务状态（避免重复处理）
    if (task.status === 'completed' || task.status === 'failed') {
      console.warn(`Task ${taskId} already finished with status: ${task.status}`);
      return NextResponse.json({ success: true, message: 'Task already finished' });
    }

    // 根据状态更新任务
    if (status === 'completed' && outputs && outputs.length > 0) {
      // 任务完成，更新结果
      const results = outputs.map((url) => ({
        url,
        type: 'image',
      }));

      await db
        .update(mediaGenerationTask)
        .set({
          status: 'completed',
          progress: 100,
          results,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(mediaGenerationTask.id, task.id));

      console.log(`Task completed: ${task.id}`, results);
    } else if (status === 'failed') {
      // 任务失败，记录错误
      await db
        .update(mediaGenerationTask)
        .set({
          status: 'failed',
          errorMessage: {
            message: error || 'Unknown error',
            code: 'generation_failed',
          },
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(mediaGenerationTask.id, task.id));

      // TODO: 创建退款交易记录

      console.error(`Task failed: ${task.id}`, error);
    } else if (status === 'processing') {
      // 任务处理中，更新进度
      await db
        .update(mediaGenerationTask)
        .set({
          status: 'processing',
          progress: 50, // Wavespeed 不提供具体进度，使用固定值
          updatedAt: new Date(),
        })
        .where(eq(mediaGenerationTask.id, task.id));

      console.log(`Task processing: ${task.id}`);
    }

    // 返回成功响应
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
