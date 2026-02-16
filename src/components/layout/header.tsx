'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Plus,
    Store,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { NavActions } from './nav-actions';
import { SearchBar } from './search-bar';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMobileMenu: () => void;
  initialWishlistCount: number;
}

/**
 * Professional Navbar — Classifieds Platform
 *
 * All screens: [Logo] [  SearchBar (with ☰ inside)  ] [Actions]
 * Desktop adds: Browse link, Post Ad CTA
 */
const Header = ({
  isMenuOpen,
  toggleMobileMenu,
  initialWishlistCount,
}: HeaderProps) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      
      // Detect scroll direction for mobile UI behavior
      if (currentScrollY < lastScrollY && Math.abs(currentScrollY - lastScrollY) > 5) {
        setIsScrollingUp(true);
      } else if (currentScrollY > lastScrollY && Math.abs(currentScrollY - lastScrollY) > 5) {
        setIsScrollingUp(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActiveLink = useCallback(
    (href: string): boolean => {
      if (href === '/') return pathname === '/';
      return pathname.startsWith(href);
    },
    [pathname],
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm'
          : 'bg-background/90 backdrop-blur-sm border-b border-border/30'
      )}
      role='banner'
    >
      <div className='container-wide'>
        {/* ──────── MOBILE NAV (< md) ──────── */}
        <div className='flex md:hidden items-center gap-2 h-14 w-full transition-all duration-300'>
          {/* Logo — icon only on mobile — Hides on Scroll Up */}
          <div className={cn(
            "transition-all duration-300 ease-in-out flex items-center shrink-0 overflow-hidden",
            isScrollingUp ? "w-0 opacity-0 -ml-1 pointer-events-none" : "w-8 opacity-100"
          )}>
            <Link
              href='/'
              className='shrink-0 flex items-center group'
              aria-label='Biggest Market home page'
            >
              <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform'>
                <Zap className='h-4 w-4 text-white' fill='currentColor' />
              </div>
            </Link>
          </div>

          {/* Search Bar — fills remaining space, has ☰ menu inside */}
          <div className='flex-1 min-w-0 transition-all duration-300'>
            <SearchBar />
          </div>

          {/* User actions (avatar only on mobile) */}
          <NavActions initialWishlistCount={initialWishlistCount} />
        </div>

        {/* ──────── DESKTOP NAV (≥ md) ──────── */}
        <div className='hidden md:flex items-center gap-3 lg:gap-4 h-16'>
          {/* Logo + Brand */}
          <Link
            href='/'
            className='flex shrink-0 items-center gap-2.5 group mr-1'
            aria-label='Biggest Market home page'
          >
            <div className='w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-all duration-300'>
              <Zap className='h-5 w-5 text-white' fill='currentColor' />
            </div>
            <span className='text-lg font-black tracking-tight text-foreground leading-none whitespace-nowrap'>
              Biggest Market<span className='text-primary'>.</span>
            </span>
          </Link>

          {/* Browse Link */}
          <Link
            href='/listings'
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap',
              isActiveLink('/listings')
                ? 'text-primary bg-primary/8'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <Store className='h-4 w-4' />
            Browse
          </Link>

          {/* Centered Search Bar — has ☰ menu inside */}
          <div className='flex-1 max-w-xl mx-auto'>
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className='flex items-center gap-1 lg:gap-1.5 shrink-0'>
            {/* Post Ad CTA */}
            <Button
              asChild
              className='bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-md shadow-primary/15 px-5 h-9 transition-all hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
            >
              <Link href='/sell'>
                <Plus className='h-4 w-4 mr-1.5 stroke-[3]' />
                Post Ad
              </Link>
            </Button>

            {/* Favorites, Messages, User dropdown */}
            <NavActions initialWishlistCount={initialWishlistCount} />
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };

