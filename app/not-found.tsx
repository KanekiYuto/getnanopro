import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { defaultLocale } from '@/i18n/config';
import NotFoundClient from './not-found-client';
import "./globals.css";

export default async function NotFound() {
  // 使用 getMessages 获取翻译消息
  const messages = await getMessages({ locale: defaultLocale });

  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages}>
      <NotFoundClient />
    </NextIntlClientProvider>
  );
}
