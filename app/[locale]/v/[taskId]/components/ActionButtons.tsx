'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Share2, Download, MoreVertical } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ShareToX from '@/components/ui/share-to-x';

interface ActionButtonsProps {
  shareUrl: string;
  prompt: string;
  imageUrl?: string; // 图片下载地址
}

export default function ActionButtons({ shareUrl, prompt, imageUrl }: ActionButtonsProps) {
  const t = useTranslations('share.actions');
  const [copied, setCopied] = useState(false);
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const [morePopoverOpen, setMorePopoverOpen] = useState(false);

  const handleCopyLink = async () => {
    if (copied) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setMorePopoverOpen(false);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1">
        {/* 复制链接按钮 */}
        <TooltipProvider>
          <Tooltip open={copied}>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer"
                aria-label={copied ? t('linkCopied') : t('copyLink')}
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={8}
              className="bg-zinc-800 text-white border-0"
              arrowClassName="fill-zinc-800"
            >
              <p>{t('linkCopied')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 分享按钮 - 使用 Popover */}
        <Popover open={sharePopoverOpen} onOpenChange={setSharePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer"
              aria-label={t('share')}
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-1 bg-zinc-800 border-zinc-700"
            align="start"
            arrowClassName="fill-zinc-800"
          >
            <div className="flex flex-col gap-2">
              <ShareToX
                text={prompt}
                url={shareUrl}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-700/50 transition-colors text-white text-sm"
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* 更多操作按钮 - 使用 Popover */}
        <Popover open={morePopoverOpen} onOpenChange={setMorePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer"
              aria-label={t('moreActions')}
            >
              <MoreVertical className="w-4 h-4 text-white" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-1 bg-zinc-800 border-zinc-700"
            align="start"
            arrowClassName="fill-zinc-800"
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={handleDownload}
                disabled={!imageUrl}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-700/50 transition-colors text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {t('download')}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 创建相似图片按钮 */}
      <Link
        href="/ai-generator"
        className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {t('createSimilar')}
      </Link>
    </div>
  );
}
