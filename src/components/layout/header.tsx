'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    Heart,
    Home,
    MessageSquare,
    Pencil,
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
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm py-2 sm:py-3'
          : 'bg-transparent border-b border-transparent py-4 sm:py-5'
      )}
      role='banner'
    >
      <div className='container-wide flex items-center justify-between gap-2 sm:gap-4'>
        {/* Logo */}
        <Link
          href='/'
          className='flex shrink-0 items-center gap-3 group'
          aria-label='Big Market home page'
        >
          <div className='relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300'>
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className='h-6 w-6 text-white' fill="currentColor" />
          </div>
          <div className='hidden xs:block'>
            <span className='text-xl font-black tracking-tight text-foreground leading-none block'>
              Big Market<span className="text-primary">.</span>
            </span>
            <span className='text-[11px] text-muted-foreground font-bold tracking-widest uppercase'>
              Classifieds
            </span>
          </div>
        </Link>

        {/* Categories Sidebar - Removed as it is now integrated visually in Search Bar */}
        {/* <div>
            <CategorySidebar />
        </div> */}

        {/* Search Bar - Hidden on very small screens, shown from sm up */}
        <div className='hidden md:block flex-1 max-w-sm lg:max-w-md xl:max-w-xl mx-4 transition-all duration-300'>
           <div className={cn(
               "transition-all duration-300",
               isScrolled ? "scale-100 opacity-100" : "scale-105"
           )}>
             <SearchBar />
           </div>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden lg:flex items-center gap-6 mx-4'>
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative py-2 text-sm font-bold transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                    {link.icon && <link.icon className="w-4 h-4" />}
                    <span>{link.label}</span>
                </div>
                {isActive && (
                    <motion.div
                        layoutId='activeNavLine'
                        className='absolute -bottom-[21px] left-0 right-0 h-[3px] bg-primary rounded-t-full'
                    />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className='flex items-center gap-1 sm:gap-3'>
          {/* Desktop Post Button */}
          <Button asChild className="hidden lg:flex bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg shadow-orange-500/20 px-6 h-10 transition-all hover:scale-105">
             <Link href="/sell">
                <Plus className="h-5 w-5 mr-2 stroke-[3]" />
                Post New Listing
             </Link>
          </Button>

          {/* Mobile Action Icons */}
          <div className="flex lg:hidden items-center gap-0.5 mr-1">
             <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Link href="/sell" title="Post New Listing">
                   <Pencil className="h-5 w-5" />
                </Link>
             </Button>
             {/* Heart icon removed - moved to NavActions with badge */}
             <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10">
                <Link href="/messages" title="Messages">
                   <MessageSquare className="h-5 w-5" />
                </Link>
             </Button>
          </div>
          
          <NavActions initialWishlistCount={initialWishlistCount} />
        </div>
      </div>
      
    </header>
  );
};


export { Header };

