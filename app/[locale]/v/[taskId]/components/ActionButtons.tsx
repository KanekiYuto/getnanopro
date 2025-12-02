'use client';

interface ActionButtonsProps {
  shareUrl: string;
  prompt: string;
}

export default function ActionButtons({ shareUrl, prompt }: ActionButtonsProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // 可以添加一个提示，告诉用户复制成功
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1">
        {/* 复制链接按钮 */}
        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer"
          aria-label="复制链接"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        {/* 分享按钮 */}
        <button
          onClick={handleShare}
          className="p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer"
          aria-label="分享"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        {/* 更多操作按钮 */}
        <button
          className="p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer"
          aria-label="更多操作"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* 创建相似图片按钮 */}
      <a
        href="/ai-generator"
        className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        创建相似图片
      </a>
    </div>
  );
}
