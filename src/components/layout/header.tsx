'use client';

import { NotificationBell } from '@/components/notifications/NotificationBell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, LayoutGrid, List, Plus, Search, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavActions } from './nav-actions';
import { SearchBar } from './search-bar';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMobileMenu: () => void;
  initialWishlistCount: number;
}

const Header = ({ isMenuOpen, toggleMobileMenu, initialWishlistCount }: HeaderProps) => {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const tNav = useTranslations('NavActions');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      setIsScrolled(currentScrollY > 10);

      if (Math.abs(delta) > 5) {
        setIsScrollingUp(delta < 0);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // No deps — reads lastScrollY from ref, not state

  const isActiveLink = useCallback(
    (href: string): boolean => {
      if (href === '/') return pathname === '/';
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-background transition-all duration-300',
        isScrolled
          ? 'bg-background backdrop-blur-md border-b border-border/50 shadow-sm'
          : 'bg-background backdrop-blur-sm border-b border-border/30'
      )}
      role="banner"
    >
      <div className="container-wide">
        {/* ── MOBILE NAV (< md) ── */}
        <div className="flex md:hidden items-center gap-2 h-14 w-full transition-all duration-300">
          <div
            className={cn(
              'transition-all duration-300 ease-in-out flex items-center shrink-0 overflow-hidden',
              isScrollingUp ? 'w-0 opacity-0 -ml-1 pointer-events-none' : 'w-8 opacity-100'
            )}
          >
            <Link
              href="/"
              className="shrink-0 flex items-center group"
              aria-label="PazarPlus home page"
            >
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-all duration-150">
                <Zap className="h-4 w-4 text-white" fill="currentColor" />
              </div>
            </Link>
          </div>

          <div className="flex-1 min-w-0 transition-all duration-300">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            <NavActions initialWishlistCount={initialWishlistCount} />
          </div>
        </div>

        {/* ── DESKTOP NAV (≥ md) ── */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-center gap-3 lg:gap-4 h-16">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2.5 group mr-1"
              aria-label="PazarPlus page"
            >
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-all duration-150">
                <Zap className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <span className="hidden xl:inline text-xl font-bold tracking-tight text-foreground leading-none whitespace-nowrap">
                PazarPlus<span className="text-primary">.</span>
              </span>
            </Link>

            {/* Main Navigation Links - DESKTOP (md+) */}
            <nav className="hidden md:flex items-center gap-1 mx-2">
              <Link 
                href="/listings"
                className={cn(
                  "h-9 px-4 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:bg-accent flex items-center gap-1.5",
                  isActiveLink('/listings') ? "text-primary bg-primary/5" : "text-muted-foreground"
                )}
                title={t('listings')}
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{t('listings')}</span>
              </Link>
              <Link 
                href="/categories"
                className={cn(
                  "h-9 px-4 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:bg-accent flex items-center gap-1.5",
                  isActiveLink('/categories') ? "text-primary bg-primary/5" : "text-muted-foreground"
                )}
                title={tNav('categories')}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{tNav('categories')}</span>
              </Link>
              <Link 
                href="/favorites"
                className={cn(
                  "h-9 px-4 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:bg-accent flex items-center gap-1.5",
                  isActiveLink('/favorites') ? "text-primary bg-primary/5" : "text-muted-foreground"
                )}
                title={tNav('favorites')}
              >
                <Heart className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{tNav('favorites')}</span>
              </Link>
            </nav>

            <div className="flex-1 max-w-xl mx-auto">
              <SearchBar />
            </div>

            <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
              <Button
                asChild
                className="bg-background text-foreground font-medium rounded-full px-6 h-9 transition-all active:scale-[0.98] hover:bg-secondary"
              >
                <Link href="/sell">
                  <Plus className="h-4 w-4 stroke-[3] text-primary" />
                  {t('post_ad')}
                </Link>
              </Button>

              <div className="mx-1 w-px h-6 bg-border/40" />

              <NotificationBell />
              <NavActions initialWishlistCount={initialWishlistCount} />
            </div>
          </div>
        </div>
      </div>
    </header>

  );
};

export { Header };

