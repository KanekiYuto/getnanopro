'use client';

/**
 * 无订阅状态组件
 */
export default function EmptyState() {
  return (
    <div className="bg-bg-elevated rounded-2xl p-12 border border-border text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">暂无订阅</h3>
      <p className="text-text-muted mb-6">您当前没有任何活跃的订阅</p>
      <a
        href="/#pricing"
        className="inline-block px-6 py-3 rounded-lg gradient-bg text-white font-semibold hover:scale-105 transition-transform cursor-pointer"
      >
        查看订阅方案
      </a>
    </div>
  );
}
