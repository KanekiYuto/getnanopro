'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import useUserStore from '@/store/useUserStore';

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const { setUser, setLoading, clearUser, setQuotaInfo, setQuotaLoading } = useUserStore();

  useEffect(() => {
    if (isPending) {
      setLoading(true);
      return;
    }

    if (session?.user) {
      const userId = session.user.id;
      const userType = (session.user as any).userType || 'free';

      // 将 session 数据转换为 User 类型并存储到 store
      setUser({
        id: userId,
        name: session.user.name || '',
        email: session.user.email || '',
        emailVerified: session.user.emailVerified,
        image: session.user.image ?? '',
        userType: userType,
        createdAt: new Date((session.user as any).createdAt || Date.now()),
        updatedAt: new Date((session.user as any).updatedAt || Date.now()),
      });

      // 检查并下发每日免费配额(异步执行,不阻塞UI)
      if (userType === 'free') {
        fetch('/api/quota/daily-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userType }),
        })
          .then(() => {
            // 配额检查完成后,立即获取配额信息
            return fetch('/api/quota/info');
          })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setQuotaInfo({
                available: data.data.available,
                expiresAt: data.data.expiresAt ? new Date(data.data.expiresAt) : null,
              });
            }
          })
          .catch((err) => {
            console.error('Failed to fetch quota info:', err);
          });
      } else {
        // 非免费用户也需要获取配额信息
        setQuotaLoading(true);
        fetch('/api/quota/info')
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setQuotaInfo({
                available: data.data.available,
                expiresAt: data.data.expiresAt ? new Date(data.data.expiresAt) : null,
              });
            }
          })
          .catch((err) => {
            console.error('获取配额信息失败:', err);
            setQuotaLoading(false);
          });
      }
    } else {
      clearUser();
    }
  }, [session, isPending, setUser, setLoading, clearUser]);

  return <>{children}</>;
}
