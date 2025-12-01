'use client';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
}

export interface TaskInfo {
  prompt: string;
  created_at: string;
  completed_at: string;
}

interface MediaGalleryProps {
  items: MediaItem[];
  taskInfo: TaskInfo;
}

export default function MediaGallery({
  items,
  taskInfo,
}: MediaGalleryProps) {
  // 处理单个文件下载
  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `download-${item.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理全部下载
  const handleDownloadAll = () => {
    items.forEach(handleDownload);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">生成结果</h3>
        <span className="text-sm text-muted-foreground">{items.length} 个文件</span>
      </div>

      {/* 媒体展示 */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden bg-surface-secondary border border-border/50"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x divide-border/50">
              {/* 左侧：图片区域 */}
              <div className="relative bg-muted flex items-center justify-center">
                {item.type === 'image' && (
                  <img
                    src={item.url}
                    alt={taskInfo.prompt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {item.type === 'video' && (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                )}
                {item.type === 'audio' && (
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground py-32">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                    <span className="text-sm">音频文件</span>
                  </div>
                )}
              </div>

              {/* 右侧：信息区域 */}
              <div className="p-4 lg:p-5 space-y-3">
                {/* 头部 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                  </div>

                  {/* 下载按钮 */}
                  <button
                    onClick={() => handleDownload(item)}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all flex items-center gap-1.5 text-sm font-medium cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    下载
                  </button>
                </div>

                {/* 提示词 */}
                <div className="p-3 rounded-xl bg-muted/30 border border-border/20">
                  <p className="text-sm text-white/90 leading-relaxed">
                    {taskInfo.prompt}
                  </p>
                </div>

                {/* 参数网格 */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* 生成耗时 */}
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/10">
                    <p className="text-xs text-text-muted mb-1.5">生成耗时</p>
                    <p className="text-sm text-white font-semibold truncate">
                      {Math.round(
                        (new Date(taskInfo.completed_at).getTime() - new Date(taskInfo.created_at).getTime()) / 1000
                      )}秒
                    </p>
                  </div>

                  {/* 完成时间 */}
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/10">
                    <p className="text-xs text-text-muted mb-1.5">完成时间</p>
                    <p className="text-sm text-white font-semibold truncate">
                      {new Date(taskInfo.completed_at).toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* 全部下载按钮 */}
                {items.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    className="w-full px-4 py-2.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    全部下载
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
