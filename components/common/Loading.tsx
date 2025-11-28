'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ text, fullScreen = true }: LoadingProps) {
  const t = useTranslations('common');

  const content = (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="inline-block w-12 h-12 border-4 rounded-full mb-4"
        style={{
          borderColor: 'var(--color-primary)',
          borderTopColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.p
        className="text-text-muted"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {text || t('loading')}
      </motion.p>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
