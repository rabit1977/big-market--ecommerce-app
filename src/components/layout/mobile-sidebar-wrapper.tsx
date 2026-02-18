'use client';

import { useSidebar } from '@/lib/context/sidebar-context';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { MobileBottomNav } from './mobile-bottom-nav';
import { MobileSidebar } from './mobile-sidebar';

interface MobileSidebarWrapperProps {
  initialWishlistCount: number;
}

export function MobileSidebarWrapper({ initialWishlistCount }: MobileSidebarWrapperProps) {
  const sidebar = useSidebar();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

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