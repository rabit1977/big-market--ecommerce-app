'use client';

import { cn } from '@/lib/utils';
import { Heart, Home, LayoutGrid, Package, PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface MobileBottomNavProps {
  wishlistCount?: number;
}

export function MobileBottomNav({ wishlistCount = 0 }: MobileBottomNavProps) {
  const t = useTranslations('NavActions');
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const NAV_ITEMS = [
    { label: t('home'),        icon: Home,       href: '/' },
    { label: t('categories'), icon: LayoutGrid, href: '/categories' },
    { label: t('post_ad'),     icon: PlusCircle,  href: '/sell',      primary: true },
    { label: t('favorites'),   icon: Heart,       href: '/favorites',  showBadge: true },
    { label: t('my_listings'), icon: Package,     href: '/my-listings' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else if (Math.abs(delta) > 5) {
        // Scroll down → show, scroll up → hide
        setIsVisible(delta > 0);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // No deps — reads scroll position from ref, not state

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-card backdrop-blur-lg border-t border-border/50 pb-[env(safe-area-inset-bottom)] transition-all duration-300 md:hidden',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const badgeCount = item.showBadge ? wishlistCount : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={badgeCount > 0 ? `${item.label} (${badgeCount})` : item.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-all relative',
                item.primary ? '-mt-8' : ''
              )}
            >
              {item.primary ? (
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 border-[4px] border-background group-hover:scale-105 transition-transform">
                  <item.icon className="w-7 h-7" />
                </div>
              ) : (
                <div className={cn(
                  'flex flex-col items-center gap-1',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}>
                  <div className="relative">
                    <item.icon className={cn('w-6 h-6 transition-all', active ? 'fill-current' : 'stroke-[1.5]')} />
                    {badgeCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border border-background">
                        {badgeCount > 9 ? '9+' : badgeCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}