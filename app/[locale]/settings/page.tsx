'use client';

import { useTranslations } from 'next-intl';
import useUserStore from '@/store/useUserStore';
import Loading from '@/components/common/Loading';
import LoginModal from '@/components/auth/LoginModal';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { user, isLoading } = useUserStore();
  const t = useTranslations('settings');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 加载中状态
  if (isLoading) {
    return <Loading />;
  }

  // 未登录状态
  if (!user) {
    return (
      <div className="min-h-screen">
        {/* 页面头部 */}
        <div className="bg-bg-elevated border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-base text-text-muted mt-2">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* 登录提示 */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('loginRequired.title')}
            </h2>
            <p className="text-text-muted mb-8">
              {t('loginRequired.description')}
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold transition-all hover:scale-105 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>{t('loginRequired.cta')}</span>
            </button>
          </div>
        </div>

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
    );
  }

  // 已登录状态
  return (
    <div className="min-h-screen bg-bg">
      {/* 页面头部 */}
      <div className="bg-bg-elevated border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-text-muted mt-2">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* 设置内容 */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 个人信息设置 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('sections.profile.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 用户名 */}
            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex-1">
                <Label>{t('sections.profile.name')}</Label>
                <p className="text-sm text-muted-foreground mt-1">{user.name || t('sections.profile.notSet')}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigator.clipboard.writeText(user.name || '')}
                title={t('actions.copy')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Button>
            </div>

            {/* 邮箱 */}
            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex-1">
                <Label>{t('sections.profile.email')}</Label>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  {t('sections.profile.verified')}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigator.clipboard.writeText(user.email)}
                  title={t('actions.copy')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* 用户类型 */}
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <Label>{t('sections.profile.plan')}</Label>
                <p className="text-sm text-muted-foreground mt-1 capitalize">{user.userType}</p>
              </div>
              <Button asChild className="bg-gradient-to-r from-primary to-primary-hover border-2 border-transparent hover:border-white/30">
                <a href="/pricing" className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {t('actions.upgrade')}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 偏好设置 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('sections.preferences.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 通知设置 */}
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <Label>{t('sections.preferences.notifications')}</Label>
                <p className="text-sm text-muted-foreground mt-1">{t('sections.preferences.notificationsDesc')}</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* 第三方账号连接 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('sections.connections.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google 账号 */}
            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center gap-3 flex-1">
                {/* Google Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary fill-current">
                    <title>Google</title>
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <Label>Google</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.email
                      ? t('sections.connections.googleConnected')
                      : t('sections.connections.googleNotConnected')}
                  </p>
                </div>
              </div>
              {user.email && (
                <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  {t('sections.connections.connected')}
                </span>
              )}
            </div>

            {/* GitHub 账号 */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3 flex-1">
                {/* GitHub Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary fill-current">
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <Label>GitHub</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('sections.connections.githubNotConnected')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
