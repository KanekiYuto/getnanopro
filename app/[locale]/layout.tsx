import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import PageLayout from '@/components/layout/PageLayout';
import UserProvider from '@/components/providers/UserProvider';
import ModalProvider from '@/components/providers/ModalProvider';
import { siteConfig } from '@/config/site';
import { locales, defaultLocale } from '@/i18n/config';
import "../globals.css";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  // 动态生成语言路径
  const languages = {
    'x-default': '/',
    ...Object.fromEntries(
      locales
        .filter((loc) => loc !== defaultLocale)
        .map((loc) => [loc, `/${loc}`])
    )
  };

  return {
    title: t('seo.title', { siteName: siteConfig.name }),
    description: t('seo.description'),
    keywords: t('seo.keywords'),
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    robots: siteConfig.robots,
    metadataBase: siteConfig.url ? new URL(siteConfig.url) : undefined,
    alternates: {
      canonical: '/',
      languages,
    },
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <UserProvider>
            <PageLayout>{children}</PageLayout>
            <ModalProvider />
          </UserProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
