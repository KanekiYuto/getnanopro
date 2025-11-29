'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 配置 NProgress
NProgress.configure({
  showSpinner: false, // 是否显示加载指示器
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.08, // 初始化时的最小百分比
  easing: 'ease', // 动画缓动函数
  speed: 200, // 递增进度条的速度
});

export default function NProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 监听路由变化事件(适用于 Next.js App Router)
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    // 监听页面加载状态
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleStart);
      window.addEventListener('load', handleComplete);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleStart);
        window.removeEventListener('load', handleComplete);
      }
    };
  }, []);

  return <>{children}</>;
}
