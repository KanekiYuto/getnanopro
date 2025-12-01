'use client';

import { Button } from '@/components/ui/button';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  filename?: string;
}

interface MediaGalleryProps {
  items: MediaItem[];
  onDownload?: (item: MediaItem) => void;
  onDownloadAll?: () => void;
  onClear?: () => void;
  title?: string;
  columns?: 1 | 2 | 3 | 4;
}

export default function MediaGallery({
  items,
  onDownload,
  onDownloadAll,
  onClear,
  title = '生成结果',
  columns = 2,
}: MediaGalleryProps) {
  // 处理单个文件下载
  const handleDownload = (item: MediaItem) => {
    if (onDownload) {
      onDownload(item);
    } else {
      // 默认下载逻辑
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.filename || `download-${item.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 网格列数样式
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  // 根据列数设置容器最大宽度
  const maxWidthClass = columns === 1 ? 'max-w-md mx-auto' : '';

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">{items.length} 个文件</span>
      </div>

      {/* 媒体网格 */}
      <div className={`grid ${gridColsClass} gap-4 ${maxWidthClass}`}>
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group relative rounded-lg overflow-hidden border border-border hover:border-foreground/50 transition-colors bg-card"
          >
            {/* 媒体预览容器 */}
            <div className="relative w-full aspect-square bg-muted flex items-center justify-center">
              {item.type === 'image' && (
                <img
                  src={item.url}
                  alt={item.filename || `媒体 ${index + 1}`}
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
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
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

              {/* 文件序号 */}
              <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded">
                #{index + 1}
              </div>

              {/* 悬浮操作按钮 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(item)}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  下载
                </Button>
              </div>
            </div>

            {/* 文件名（可选） */}
            {item.filename && (
              <div className="p-2 bg-card border-t border-border">
                <p className="text-xs text-muted-foreground truncate" title={item.filename}>
                  {item.filename}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 批量操作按钮 */}
      <div className="flex gap-2">
        {onDownloadAll && (
          <Button variant="outline" className="flex-1" onClick={onDownloadAll}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            全部下载
          </Button>
        )}
        {onClear && (
          <Button variant="outline" className="flex-1" onClick={onClear}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            清空结果
          </Button>
        )}
      </div>
    </div>
  );
}
