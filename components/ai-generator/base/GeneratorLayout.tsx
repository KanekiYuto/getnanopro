'use client';

import { ReactNode } from 'react';

interface GeneratorLayoutProps {
  // 头部模型选择器
  headerContent?: ReactNode;
  // 左侧表单内容
  formContent: ReactNode;
  // 生成按钮
  generateButton: ReactNode;
  // 右侧预览内容
  previewContent: ReactNode;
  // 加载状态
  isLoading?: boolean;
  progress?: number;
}

export default function GeneratorLayout({
  headerContent,
  formContent,
  generateButton,
  previewContent,
  isLoading = false,
  progress = 0,
}: GeneratorLayoutProps) {
  return (
    <div className="space-y-6">
      {/* 左右布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧 - 表单区域 */}
        <div className="space-y-4">
          {/* 模型选择器头部 */}
          {headerContent}

          {/* 表单内容区域 */}
          <div className="rounded-xl gradient-border">
            <div className="px-4 py-4 space-y-4">
              {formContent}
            </div>
          </div>

          {/* 生成按钮区域 - 粘性定位在底部 */}
          <div className="sticky bottom-4 rounded-xl p-4 gradient-border">
            {generateButton}
          </div>
        </div>

        {/* 右侧 - 预览区域 */}
        <div className="relative">
          <div className="rounded-xl p-6 overflow-hidden gradient-border">
            {/* 加载遮罩 */}
            {isLoading && (
              <div className="absolute inset-0 bg-bg-elevated/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="text-text-muted">生成中... {progress}%</p>
                </div>
              </div>
            )}

            {/* 预览内容 */}
            <div>
              {previewContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
