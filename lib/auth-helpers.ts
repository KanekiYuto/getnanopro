import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

/**
 * 服务端获取 session
 *
 * 用于在服务端组件中预加载用户会话信息
 * 避免客户端阻塞渲染
 */
export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch (error) {
    console.error('Failed to get server session:', error);
    return null;
  }
}
