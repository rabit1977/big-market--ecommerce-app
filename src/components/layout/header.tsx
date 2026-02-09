'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Heart,
    Home,
    Menu,
    MessageSquare,
    Plus,
    Store,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { NavActions } from './nav-actions';
import { SearchBar } from './search-bar';

interface NavLink {
  href: string;
  label: string;
  icon?: any;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/listings', label: 'Browse', icon: Store },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
];

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMobileMenu: () => void;
  initialWishlistCount: number;
}

/**
 * Premium Header for Classifieds Platform
 */
const Header = ({
  isMenuOpen,
  toggleMobileMenu,
  initialWishlistCount,
}: HeaderProps) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Check if link is active
   */
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
        'sticky top-0 z-50 w-full transition-all duration-500 ease-in-out',
        isScrolled
          ? 'bg-background/80 backdrop-blur-sm border-b border-border/40 shadow-sm py-2 sm:py-3'
          : 'bg-transparent backdrop-blur-sm bg-background/80 border-b border-transparent py-4 sm:py-5'
      )}
      role='banner'
    >
      <div className='container-wide flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-4'>
        {/* Left: Menu Trigger - Hidden on desktop */}
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleMobileMenu}
          className='flex md:hidden h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0'
          aria-label='Open menu'
        >
          <Menu className='h-5 w-5' />
        </Button>

        {/* Logo */}
        <Link
          href='/'
          className='flex shrink-0 items-center gap-2 group mr-1 sm:mr-0'
          aria-label='Big Market home page'
        >
          <div className='relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-all duration-300'>
            <Zap className='h-5 w-5 text-white' fill="currentColor" />
          </div>
          <div className='hidden sm:block'>
            <span className='text-lg font-black tracking-tight text-foreground leading-none block'>
              Big Market<span className="text-primary">.</span>
            </span>
          </div>
        </Link>


        {/* Search Bar - Flexible and visible ONLY on mobile/tablet, hidden on md+ */}
        <div className='flex-1 md:hidden max-w-sm transition-all duration-300'>
           <div className={cn(
               "transition-all duration-300",
               isScrolled ? "scale-100 opacity-100" : "scale-105"
           )}>
             <SearchBar />
           </div>
        </div>

        {/* User Actions */}
        <div className='flex items-center gap-1 sm:gap-3 shrink-0'>
          {/* Browse Listings Link - Visible on md+ */}
          <Button asChild variant="ghost" className="hidden md:flex font-bold text-muted-foreground hover:text-foreground mr-1 hover:bg-accent cursor-pointer hover:bg-primary/5 hover:text-primary">
             <Link href="/listings">
                Browse Listings
             </Link>
          </Button>

          {/* Desktop Post Button - Visible on md+ */}
          <Button asChild className="hidden md:flex bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-lg shadow-primary/20 px-6 h-10 transition-all hover:scale-105">
             <Link href="/sell">
                <Plus className="h-5 w-5 mr-2 stroke-[3]" />
                Post Ad
             </Link>
          </Button>

          <NavActions initialWishlistCount={initialWishlistCount} />
        </div>
      </div>
      
    </header>
  );
};


export { Header };

