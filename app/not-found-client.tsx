'use client';

import FuzzyText from '@/components/FuzzyText';
import Footer from '@/components/layout/Footer';

export default function NotFoundClient() {
  return (
    <div className="min-h-screen w-screen flex flex-col m-0 p-0 bg-[#121216]">
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        {/* 404 主标题 */}
        <FuzzyText
          fontSize="clamp(10rem, 25vw, 20rem)"
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover={true}
        >
          404
        </FuzzyText>

        {/* Not Found 副标题 */}
        <FuzzyText
          fontSize="clamp(1.8rem, 7vw, 7rem)"
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover={true}
        >
          not found
        </FuzzyText>
      </div>

      {/* Footer 组件 */}
      <Footer />
    </div>
  );
}
