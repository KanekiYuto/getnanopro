'use client';

import useUserStore from '@/store/useUserStore';

export default function DashboardPage() {
  const { user, isLoading, quotaInfo } = useUserStore();

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录状态(等待重定向)
  if (!user) {
    return null;
  }

  // 获取用户类型
  const userType = user.userType;

  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <div className="bg-bg-elevated border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 truncate">
                欢迎回来, {user.name}
              </h1>
              <p className="text-sm sm:text-base text-text-muted">
                开始创作您的精彩内容
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-bg-hover border border-border flex-shrink-0 self-start sm:self-auto">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                userType === 'pro' ? 'bg-purple-500' :
                userType === 'basic' ? 'bg-blue-500' :
                'bg-gray-500'
              }`}></div>
              <span className="text-xs sm:text-sm font-semibold text-white capitalize whitespace-nowrap">
                {userType === 'pro' ? '专业版' : userType === 'basic' ? '基础版' : '免费版'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* 剩余配额 */}
          <div className="group relative bg-gradient-to-br from-bg-elevated to-bg-elevated/50 rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  userType === 'pro' ? 'bg-purple-500/10 text-purple-400' :
                  userType === 'basic' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-gray-500/10 text-gray-400'
                }`}>
                  {userType === 'pro' ? 'PRO' : userType === 'basic' ? 'BASIC' : 'FREE'}
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors">
                  {quotaInfo ? (
                    quotaInfo.available === -1 ? '∞' : quotaInfo.available
                  ) : (
                    userType === 'pro' ? '∞' : userType === 'basic' ? '500' : '10'
                  )}
                </h3>
                {quotaInfo?.expiresAt && (
                  <>
                    <span className="text-sm text-text-muted">/</span>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {new Date(quotaInfo.expiresAt).toLocaleDateString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })} 过期
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-text-muted">
                {userType === 'pro' ? '无限生成配额' : '剩余生成配额'}
              </p>
            </div>
          </div>

          {/* 总项目数 */}
          <div className="group relative bg-gradient-to-br from-bg-elevated to-bg-elevated/50 rounded-2xl border border-border p-6 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-all" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-secondary/10 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 text-secondary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">0</h3>
              <p className="text-sm text-text-muted">我的项目总数</p>
            </div>
          </div>

          {/* 已上传图片数 */}
          <div className="group relative bg-gradient-to-br from-bg-elevated to-bg-elevated/50 rounded-2xl border border-border p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-500 transition-colors">0</h3>
              <p className="text-sm text-text-muted">已上传图片素材</p>
            </div>
          </div>

          {/* 创建模板数 */}
          <div className="group relative bg-gradient-to-br from-bg-elevated to-bg-elevated/50 rounded-2xl border border-border p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 text-purple-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v2a1 1 0 01-2 0V5zm16 0a1 1 0 00-1-1h-4a1 1 0 100 2h2v2a1 1 0 102 0V5zM4 15a1 1 0 011 1v2h2a1 1 0 110 2H5a1 1 0 01-1-1v-4zm16 0a1 1 0 00-1 1v2h-2a1 1 0 100 2h4a1 1 0 001-1v-4z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-purple-500 transition-colors">0</h3>
              <p className="text-sm text-text-muted">我的模板收藏</p>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-bg-elevated rounded-xl border border-border p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">快速开始</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-3 transition-all">
                <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors">新建项目</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 group-hover:bg-secondary flex items-center justify-center mb-3 transition-all">
                <svg className="w-6 h-6 text-secondary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-text group-hover:text-secondary transition-colors">上传图片</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-border hover:border-purple-500 hover:bg-purple-500/5 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 group-hover:bg-purple-500 flex items-center justify-center mb-3 transition-all">
                <svg className="w-6 h-6 text-purple-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-text group-hover:text-purple-500 transition-colors">模板库</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-border hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 group-hover:bg-blue-500 flex items-center justify-center mb-3 transition-all">
                <svg className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-text group-hover:text-blue-500 transition-colors">使用教程</span>
            </button>
          </div>
        </div>

        {/* 最近生成 */}
        <div className="bg-bg-elevated rounded-xl border border-border p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">最近生成</h2>
              <p className="text-sm text-text-muted mt-1">仅展示近一周的生成内容</p>
            </div>
            <button className="text-sm text-primary hover:text-primary-hover transition-colors">
              查看全部 →
            </button>
          </div>

          {/* 空状态 */}
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-bg-hover mb-6">
              <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">近一周还没有生成内容</h3>
            <p className="text-text-muted mb-6">开始生成您的第一张图片</p>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>去生成</span>
            </button>
          </div>

          {/* 图片网格 - 当有数据时显示 */}
          {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-lg overflow-hidden bg-bg-hover border border-border hover:border-primary/50 transition-all cursor-pointer"
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium line-clamp-2 mb-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {image.createdAt}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
                    <span className="text-xs text-white font-medium">
                      {image.size}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
