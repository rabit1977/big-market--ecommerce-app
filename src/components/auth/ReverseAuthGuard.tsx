'use client';

import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ReverseAuthGuardProps {
  children: React.ReactNode;
  /** Redirect authenticated users to this path */
  redirectTo?: string;
}

/**
 * Reverse Auth Guard — redirects authenticated users away from public-only
 * pages (e.g. login, signup).
 */
export function ReverseAuthGuard({ children, redirectTo = '/' }: ReverseAuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(redirectTo);
    }
  }, [status, router, redirectTo]);

  // Covers 'loading' and 'authenticated' (while redirect fires)
  if (status !== 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-slate-400 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">
            {status === 'loading' ? 'Loading...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}