'use client';

import { useState } from 'react';
import GeneratorLayout from '../base/GeneratorLayout';
import ExamplePreview, { ExampleItem } from '../base/ExampleGallery';
import MediaGallery, { MediaItem } from '../base/MediaGallery';
import CreditsCard from '../base/CreditsCard';
import AdvancedSettings from '../base/AdvancedSettings';
import FormSelect from '../form/FormSelect';
import SeedInput from '../form/SeedInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NanoBananaProGeneratorProps {
  modelSelector: React.ReactNode;
}

export default function NanoBananaProGenerator({ modelSelector }: NanoBananaProGeneratorProps) {
  // 表单状态
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [seed, setSeed] = useState('');

  // 生成状态
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<MediaItem[]>([]);

  // 宽高比选项
  const aspectRatios = [
    { value: '1:1', label: '1:1 (正方形)', width: 1024, height: 1024 },
    { value: '16:9', label: '16:9 (横屏)', width: 1344, height: 768 },
    { value: '9:16', label: '9:16 (竖屏)', width: 768, height: 1344 },
    { value: '4:3', label: '4:3 (标准)', width: 1152, height: 896 },
    { value: '3:4', label: '3:4 (竖版)', width: 896, height: 1152 },
    { value: '21:9', label: '21:9 (超宽)', width: 1536, height: 640 },
  ];

  // 示例数据
  const examples: ExampleItem[] = [
    {
      id: '1',
      thumbnail: '/test/3c3bb2c9-f19e-4f48-b005-c27e475d6bf5.webp',
      prompt: '梦幻的奇幻风景，浮空岛屿，瀑布从云端倾泻而下，神秘的紫色天空，超现实主义风格',
      tags: ['风景', '奇幻', '超现实'],
    },
    {
      id: '2',
      thumbnail: '/test/d9c7dede-2a43-47a4-8fb7-3b591d52864a.webp',
      prompt: '赛博朋克风格的未来都市，霓虹灯闪烁，高楼林立，夜晚下着雨，反光的街道',
      tags: ['城市', '科幻', '赛博朋克'],
    },
  ];

  // 处理选择示例
  const handleSelectExample = (example: ExampleItem) => {
    setPrompt(example.prompt);
  };

  // 生成图像
  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert('请输入提示词');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setGeneratedImages([]);

    // TODO: 调用实际的 API 接口
    // 当前为模拟实现
    const testImageUrl = '/test/3c3bb2c9-f19e-4f48-b005-c27e475d6bf5.webp';

    // 模拟进度更新
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);

          // 生成结果
          const imageName = testImageUrl.split('/').pop()?.split('.')[0] || 'image';
          setGeneratedImages([{
            id: `${Date.now()}`,
            url: testImageUrl,
            type: 'image',
            filename: `${imageName}.webp`,
          }]);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };


  // 表单内容
  const formContent = (
    <div className="space-y-6">
      {/* 提示词输入 */}
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-sm font-medium">
          提示词 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你想要生成的图像..."
          className="h-32 resize-none"
        />
      </div>

      {/* 宽高比选择 */}
      <FormSelect
        id="aspectRatio"
        label="宽高比"
        value={aspectRatio}
        onChange={setAspectRatio}
        options={aspectRatios.map((ratio) => ({ value: ratio.value, label: ratio.label }))}
        placeholder="选择宽高比"
      />

      {/* 高级选项 */}
      <AdvancedSettings>
        <SeedInput value={seed} onChange={setSeed} />
      </AdvancedSettings>
    </div>
  );

  // 生成按钮
  const generateButton = (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full rounded-xl px-6 py-3 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base gradient-bg"
      >
        {isLoading ? `生成中... ${progress}%` : '生成图像'}
      </button>
      <CreditsCard />
    </div>
  );

  // 下载单个文件
  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.filename || `download-${item.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 下载全部文件
  const handleDownloadAll = () => {
    generatedImages.forEach(handleDownload);
  };

  // 清空结果
  const handleClear = () => {
    setGeneratedImages([]);
    setProgress(0);
  };

  // 预览内容
  const previewContent = (
    <>
      {generatedImages.length > 0 ? (
        <MediaGallery
          items={generatedImages}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
          onClear={handleClear}
          title="生成结果"
          columns={1}
        />
      ) : (
        <ExamplePreview
          examples={examples}
          onSelectExample={handleSelectExample}
          title="快速开始"
          description="点击下方示例快速开始创作，或填写左侧表单自定义生成"
          autoPlayInterval={0}
        />
      )}
    </>
  );

  return (
    <GeneratorLayout
      headerContent={modelSelector}
      formContent={formContent}
      generateButton={generateButton}
      previewContent={previewContent}
      isLoading={isLoading}
      progress={progress}
    />
  );
}
