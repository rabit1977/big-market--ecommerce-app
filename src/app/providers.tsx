// app/providers.tsx
'use client';

import { ConvexClientProvider } from '@/components/convex-client-provider';
import { FavoritesProvider } from '@/lib/context/favorites-context';
import { SidebarProvider } from '@/lib/context/sidebar-context';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

export function Providers({ 
  children,
  initialFavorites = []
}: { 
  children: React.ReactNode;
  initialFavorites?: string[];
}) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('SW registered:', registration))
        .catch((error) => console.log('SW registration failed:', error));
    }
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ConvexClientProvider>
          <SidebarProvider>
            <FavoritesProvider initialFavorites={initialFavorites}>
              {children}
            </FavoritesProvider>
            <Toaster position="bottom-center" richColors />
          </SidebarProvider>
        </ConvexClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}