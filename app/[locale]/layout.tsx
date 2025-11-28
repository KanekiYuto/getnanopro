import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import PageLayout from '@/components/layout/PageLayout';
import UserProvider from '@/components/providers/UserProvider';
import "../globals.css";

export const metadata: Metadata = {
  title: "Next.js with i18n",
  description: "Full-stack Next.js 16 application with internationalization",
};

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
          </UserProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
