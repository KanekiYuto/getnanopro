'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { siteConfig } from '@/config/site';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const t = useTranslations('help');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 从翻译文件获取 FAQ 数据
  const faqs: FAQItem[] = t.raw('faqs');

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* 页面标题 */}
      <div className="bg-bg-elevated border-b border-border">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
          <p className="text-text-muted">{t('subtitle')}</p>
        </div>
      </div>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* 快速联系卡片 */}
        <div className="mb-12 rounded-2xl gradient-border-colorful p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">{t('contact.title')}</h2>
              <p className="text-text-muted mb-4">{t('contact.description')}</p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white font-semibold hover:scale-105 transition-transform cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('contact.email')}
              </a>
            </div>
          </div>
        </div>

        {/* FAQ 部分 */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">{t('faq.title')}</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl gradient-border overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 py-4 border-t border-border bg-white/5">
                    <p className="text-text-muted leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
