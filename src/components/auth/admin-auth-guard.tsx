'use client';

import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  /** Optional redirect path for non-authenticated users */
  authRedirectTo?: string;
  /** Optional redirect path for non-admin users */
  unauthorizedRedirectTo?: string;
  /** Custom loading/redirecting component */
  fallback?: React.ReactNode;
}

/**
 * Admin auth guard — protects routes that require admin access.
 * Checks both authentication and admin role via NextAuth session.
 */
const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  authRedirectTo = '/auth/sign-in',
  unauthorizedRedirectTo = '/',
  fallback,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isUnauthenticated = status === 'unauthenticated' || !session?.user;
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    if (isLoading) return;

    if (isUnauthenticated) {
      toast.error('You must be logged in to access this page.');
      router.replace(authRedirectTo);
      return;
    }

    if (!isAdmin) {
      toast.error('You do not have permission to access this page.');
      router.replace(unauthorizedRedirectTo);
    }
  }, [isLoading, isUnauthenticated, isAdmin, router, authRedirectTo, unauthorizedRedirectTo]);

  const loadingUI = fallback ?? (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-slate-400 mx-auto" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          {isLoading ? 'Verifying admin access...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );

  if (isLoading || isUnauthenticated || !isAdmin) {
    return loadingUI;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;