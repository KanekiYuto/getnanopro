import { TaskData } from '../types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://getnanopro.com';
const APP_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || SITE_URL;

/**
 * 通过 API 获取任务信息
 */
export async function fetchTaskData(shareId: string): Promise<TaskData | null> {
  try {
    const response = await fetch(`${APP_URL}/api/ai-generator/share/${shareId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch task data:', error);
    return null;
  }
}
