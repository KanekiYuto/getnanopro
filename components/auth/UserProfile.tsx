'use client';

import { useSession, signOut } from '@/lib/auth-client';

// 用户信息展示和退出登录组件
export default function UserProfile() {
  const { data: session, isPending } = useSession();

  // 加载中状态
  if (isPending) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-elevated animate-pulse">
        <div className="w-8 h-8 rounded-full bg-border" />
        <div className="w-20 h-4 rounded bg-border" />
      </div>
    );
  }

  // 未登录状态
  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = '/';
          },
        },
      });
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* 用户头像 */}
      {session.user.image && (
        <img
          src={session.user.image}
          alt={session.user.name || '用户'}
          className="w-8 h-8 rounded-full border-2 border-primary"
        />
      )}

      {/* 用户名 */}
      <span className="text-sm font-medium text-text">
        {session.user.name || session.user.email}
      </span>

      {/* 退出登录按钮 */}
      <button
        onClick={handleSignOut}
        className="px-3 py-1.5 text-sm rounded-lg border border-border hover:border-primary/50 hover:bg-bg-hover text-text-muted hover:text-text transition-all"
      >
        退出
      </button>
    </div>
  );
}
