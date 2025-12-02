'use client';

interface PromptCardProps {
  prompt: string;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      // 可以添加复制成功的提示
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  return (
    <div className="col-span-2 bg-surface-secondary rounded-xl p-3 border border-border/50">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-xs text-text-muted uppercase tracking-wide">提示词</div>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-zinc-700/50 transition-colors cursor-pointer"
          aria-label="复制提示词"
        >
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      <div className="text-sm text-white line-clamp-3" title={prompt}>
        {prompt}
      </div>
    </div>
  );
}
