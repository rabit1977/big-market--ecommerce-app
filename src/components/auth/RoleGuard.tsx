'use client';

import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

// 1. Strict Typing
type UserRole = 'user' | 'admin' | 'moderator';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole | UserRole[];
  authRedirectTo?: string;
  unauthorizedRedirectTo?: string;
  unauthorizedMessage?: string;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  authRedirectTo = '/auth/login',
  unauthorizedRedirectTo = '/',
  unauthorizedMessage = 'You do not have permission to access this page.',
  fallback,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // React 19 / Next.js 16 Strict Mode:
  // Effects run twice in dev. We use a ref to ensure the toast only fires once per session state change.
  const toastShownRef = useRef(false);

  // 2. State Derivation (React 19 Style - No useMemo needed)
  // The React Compiler (standard in Next.js 15/16) automatically memoizes these calculations.
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const userRole = session?.user?.role as UserRole | undefined;
  
  const isLoading = status === 'loading';
  const isUnauthenticated = status === 'unauthenticated';
  const isAuthenticated = status === 'authenticated';
  
  // Strict boolean check
  const hasPermission = isAuthenticated && userRole && allowedRoles.includes(userRole);

  // 3. Side Effects (Navigation)
  useEffect(() => {
    // If we are loading, or if we have permission, do nothing.
    if (isLoading || hasPermission) return;

    // Reset toast ref if the status changes significantly so we can show errors again if needed
    // (Optional logic, depends on how aggressive you want the toasts to be)
    
    // Case A: Not Logged In
    if (isUnauthenticated) {
      if (!toastShownRef.current) {
        toast.error('You must be logged in to access this page.');
        toastShownRef.current = true;
      }
      router.replace(authRedirectTo);
    }

    // Case B: Logged In, No Permission
    if (isAuthenticated && !hasPermission) {
      if (!toastShownRef.current) {
        toast.error(unauthorizedMessage);
        toastShownRef.current = true;
      }
      router.replace(unauthorizedRedirectTo);
    }
  }, [
    // Dependencies
    isLoading,
    isUnauthenticated,
    isAuthenticated,
    hasPermission,
    router,
    authRedirectTo,
    unauthorizedRedirectTo,
    unauthorizedMessage,
    // Stable dependency key for the array prop (removes need for useMemo)
    JSON.stringify(requiredRole)
  ]);

  // 4. Render Layout

  // Loading State
  if (isLoading) {
    return (
      fallback || (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Verifying permissions...
          </p>
        </div>
      )
    );
  }

  // Success State
  if (hasPermission) {
    return <>{children}</>;
  }

  // Fallback (While redirecting)
  // Returning null prevents "Layout Shift" or flashing restricted content
  return null;
};

export { RoleGuard };
