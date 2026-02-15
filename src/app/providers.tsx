// app/providers.tsx
'use client';

import { ConvexClientProvider } from '@/components/convex-client-provider';
import { FavoritesProvider } from '@/lib/context/favorites-context';
import { SidebarProvider } from '@/lib/context/sidebar-context';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ 
  children,
  initialFavorites = []
}: { 
  children: React.ReactNode;
  initialFavorites?: string[];
}) {
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