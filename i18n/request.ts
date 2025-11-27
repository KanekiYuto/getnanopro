import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import fs from 'fs';
import path from 'path';

async function loadMessages(locale: string) {
  const messagesDir = path.join(process.cwd(), 'messages', locale);
  const files = fs.readdirSync(messagesDir);

  const messages: Record<string, any> = {};

  for (const file of files) {
    if (file.endsWith('.json')) {
      const namespace = file.replace('.json', '');
      messages[namespace] = (await import(`@/messages/${locale}/${file}`)).default;
    }
  }

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // 自动加载该语言目录下的所有 JSON 文件作为命名空间
  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});
