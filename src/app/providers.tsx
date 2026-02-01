// app/providers.tsx
'use client';

import { ConvexClientProvider } from '@/components/convex-client-provider';
import { QuickViewProvider } from '@/lib/context/quick-view-context';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ConvexClientProvider>
          <QuickViewProvider>
            {children}
            <Toaster position="bottom-center" richColors />
          </QuickViewProvider>
        </ConvexClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}