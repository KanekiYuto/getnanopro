import { useEffect, useInsertionEffect, useRef } from 'react';
import useLoadingStore from '@/store/useLoadingStore';

/**
 * 自定义 hook 用于管理页面级别的 loading 状态
 * 页面组件挂载时自动显示 loading，渲染完成后自动隐藏（至少显示 500ms）
 *
 * @param text - 可选的加载文本
 */
export function useLoading(text?: string) {
  const { showLoading, hideLoading } = useLoadingStore();
  const startTimeRef = useRef<number>(0);

  // useInsertionEffect 在所有 DOM 变更之前同步触发
  // 页面组件一挂载就立即显示 loading
  useInsertionEffect(() => {
    showLoading(text);
    startTimeRef.current = Date.now();
  }, [text, showLoading]);

  // 页面渲染完成后隐藏 loading，但至少显示 500ms
  useEffect(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, 500 - elapsed);

    const timer = setTimeout(() => {
      hideLoading();
    }, remaining);

    return () => {
      clearTimeout(timer);
      hideLoading();
    };
  }, [hideLoading]);
}
