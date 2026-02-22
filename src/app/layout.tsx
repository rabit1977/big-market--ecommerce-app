import { getWishlistAction } from '@/actions/wishlist-actions';
import { AnalyticsProvider } from '@/components/analytics-provider';
import { FooterWrapper } from '@/components/layout/footer-wrapper';
import { InstallPwaPrompt } from '@/components/layout/install-pwa-prompt';
import { MobileSidebarWrapper } from '@/components/layout/mobile-sidebar-wrapper';
import { ScrollToTop } from '@/components/layout/scroll-to-top';
import { ThemeApplier } from '@/components/layout/theme-applier';
import { CompareWidget } from '@/components/listing/compare-widget';
import { SupportChatWidget } from '@/components/shared/support-chat-widget';
import { Watermark } from '@/components/shared/watermark';
import { Toast } from '@/components/toast';
import { CommandPalette } from '@/components/ui/command-palette';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: '%s | Biggest Market',
    default: 'Biggest Market - Classifieds Platform',
  },
  description: 'Buy and sell anything in your local community.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wishlist = [] } = await getWishlistAction();
  const initialWishlistCount = wishlist.length;

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('app-palette');
                  if (saved) {
                    document.documentElement.setAttribute('data-palette', saved);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers initialFavorites={wishlist}>
            <ThemeApplier />
            <ScrollToTop />
            <Suspense fallback={null}>
              <AnalyticsProvider />
            </Suspense>
            <CommandPalette />
            <div className='min-h-screen bg-background text-foreground relative'>
              <Watermark />
              <div className='relative z-10'>
                <Suspense fallback={<div className="h-16 w-full bg-background" />}>
                  <MobileSidebarWrapper
                    initialWishlistCount={initialWishlistCount}
                  />
                </Suspense>
                <main className='min-h-auto pb-20 lg:pb-0'>{children}</main>
                <FooterWrapper />
                <SupportChatWidget />
                <CompareWidget />
                <Toast />
                <InstallPwaPrompt />
              </div>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
