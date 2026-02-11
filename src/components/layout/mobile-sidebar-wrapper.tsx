'use client';

import { useSidebar } from '@/lib/context/sidebar-context';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from './header';
import { MobileBottomNav } from './mobile-bottom-nav';
import { MobileSidebar } from './mobile-sidebar';

interface MobileSidebarWrapperProps {
  initialWishlistCount: number;
}

/**
 * Mobile Sidebar Wrapper Component
 * Includes header, mobile sidebar, and mobile bottom navigation
 */
export function MobileSidebarWrapper({
  initialWishlistCount,
}: MobileSidebarWrapperProps) {
  const sidebar = useSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdminRoute = pathname?.startsWith('/admin');

  // Avoid hydration mismatch by rendering a consistent server/client initial state
  if (isAdminRoute) {
    return null;
  }

  // Render a placeholder height during SSR and initial client mount
  // to prevent layout shift and mismatch once 'Header' mounts.
  if (!mounted) {
    return <div className="h-16 w-full bg-background" />;
  }

  return (
    <>
      <Header
        isMenuOpen={sidebar.isOpen}
        toggleMobileMenu={sidebar.toggle}
        initialWishlistCount={initialWishlistCount}
      />
      <MobileBottomNav wishlistCount={initialWishlistCount} />
      <MobileSidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />
    </>
  );
}
