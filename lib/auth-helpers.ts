import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

/**
 * 服务端获取 session
 *
 * 用于在服务端组件中预加载用户会话信息
 * 避免客户端阻塞渲染
 *
 * 注意: 此函数会导致页面动态渲染,请在 layout 中设置 export const dynamic = 'force-dynamic'
 */
export async function getServerSession() {
  // 构建时跳过 session 获取
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch (error) {
    // 构建时的错误可以忽略
    if (process.env.NODE_ENV !== 'production') {
      console.log('Failed to get server session:');
    }
    return null;
  }
}
