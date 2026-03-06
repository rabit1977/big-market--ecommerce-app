'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  ChevronDown,
  CreditCard,
  History,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  Sparkles,
  Sun,
  Tag,
  Trash2,
  Users,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { AdminNotifications } from './admin-notifications';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  count?: number;
}

export const AdminSidebar = () => {
  // We export AdminSidebar to keep layout imports working, but render an AdminNavbar structure
  const pathname = usePathname();
  const t = useTranslations('Admin');
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allNavItems: NavItem[] = [
    { href: '/admin/dashboard', label: t('overview'), icon: LayoutDashboard },
    { href: '/admin/listings', label: t('all_listings'), icon: Tag },
    { href: '/admin/users', label: t('users'), icon: Users },
    { href: '/admin/categories', label: t('categories'), icon: Layers },
    { href: '/admin/analytics', label: t('analytics'), icon: BarChart3 },
    { href: '/admin/revenue', label: t('revenue'), icon: CreditCard },
    {
      href: '/admin/listings/promoted',
      label: t('promoted_listings'),
      icon: Sparkles,
    },
    { href: '/admin/activity', label: t('activity_logs'), icon: History },
    { href: '/admin/recycle-bin', label: t('recycle_bin'), icon: Trash2 },
  ];

  const primaryNavItems = allNavItems.slice(0, 4);
  const moreNavItems = allNavItems.slice(4);

  const mobileDockItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: t('home_label') },
    { href: '/admin/listings', icon: Tag, label: t('listings_label') },
    { href: '/admin/users', icon: Users, label: t('users') },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <header
        className={cn(
          'hidden lg:flex fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300 border-b',
          scrolled
            ? 'bg-background/70 backdrop-blur-2xl border-border/50 shadow-sm'
            : 'bg-background border-transparent',
        )}
      >
        <div className='flex items-center justify-between w-full max-w-[1920px] mx-auto px-6 h-full'>
          {/* Left: Brand */}
          <Link
            href='/admin/dashboard'
            className='flex items-center gap-3 shrink-0 group'
          >
            <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform'>
              <LayoutDashboard className='w-4.5 h-4.5' />
            </div>
            <span className='font-bold text-lg tracking-tight'>Admin</span>
          </Link>

          {/* Center: Navigation Pill */}
          <nav className='absolute left-1/2 -translate-x-1/2 flex items-center bg-muted/40 backdrop-blur-md border border-border/50 p-1 rounded-full'>
            {primaryNavItems.map((item) => {
              const isActive =
                item.href === '/admin/listings'
                  ? pathname === '/admin/listings'
                  : pathname === item.href ||
                    pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-background text-primary shadow-sm ring-1 ring-border/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-4 h-4',
                      isActive ? 'text-primary' : 'opacity-70',
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring outline-none',
                    moreNavItems.some((i) => pathname.startsWith(i.href))
                      ? 'bg-background text-primary shadow-sm ring-1 ring-border/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                  )}
                >
                  <MoreHorizontal className='w-4 h-4 opacity-70' />
                  {t('more') || 'More'}
                  <ChevronDown className='w-3 h-3 opacity-50 ml-0.5' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-56 rounded-xl p-2 shadow-xl border-border/50'
              >
                <DropdownMenuLabel className='text-xs uppercase text-muted-foreground/70 tracking-wider mb-1'>
                  Tools & Analytics
                </DropdownMenuLabel>
                {moreNavItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className='rounded-lg cursor-pointer py-2.5'
                  >
                    <Link href={item.href} className='flex items-center w-full'>
                      <item.icon className='w-4 h-4 mr-3 opacity-70' />
                      <span className='font-medium'>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right: Actions */}
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='h-9 w-9 rounded-full bg-muted/40 hover:bg-muted/80 border border-transparent hover:border-border/50 transition-colors'
            >
              <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            </Button>
            <AdminNotifications user={session?.user} />

            <div className='w-px h-6 bg-border/60 mx-1' />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-2 hover:bg-muted/40 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-border/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ml-1'>
                  <Avatar className='w-8 h-8 rounded-full border border-border/50 shadow-sm'>
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback className='bg-primary/10 text-primary text-xs font-bold'>
                      {session?.user?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className='w-3 h-3 text-muted-foreground' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-60 rounded-xl p-2 shadow-xl border-border/50'
              >
                <div className='flex flex-col space-y-1 p-2 border-b border-border/50 mb-2'>
                  <p className='text-sm font-semibold leading-none'>
                    {session?.user?.name}
                  </p>
                  <p className='text-xs text-muted-foreground flex items-center pt-1.5 truncate'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500 mr-1.5'></span>
                    {session?.user?.email}
                  </p>
                </div>
                <DropdownMenuItem asChild className='rounded-lg cursor-pointer'>
                  <Link href='/'>
                    <Home className='w-4 h-4 mr-2 opacity-70' />
                    {t('store')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className='rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10'
                >
                  <button
                    className='w-full'
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className='w-4 h-4 mr-2' />
                    {t('logout')}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Top Header (Minimal) */}
      <header
        className={cn(
          'lg:hidden fixed top-0 inset-x-0 z-40 h-16 transition-all duration-300 flex items-center justify-between px-4 pb-1',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-background border-b border-border',
        )}
      >
        <Link href='/admin/dashboard' className='flex items-center gap-2 group'>
          <div className='w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm'>
            <LayoutDashboard className='w-4 h-4' />
          </div>
          <span className='font-extrabold text-lg tracking-tight'>Admin</span>
        </Link>
        <div className='flex items-center gap-2.5'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='h-8 w-8 rounded-full bg-muted/50'
          >
            <Sun className='h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100' />
          </Button>
          <AdminNotifications user={session?.user} />
        </div>
      </header>

      {/* Mobile Bottom Dock (Floating Pill) */}
      <div className='lg:hidden fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none pb-safe'>
        <nav className='pointer-events-auto bg-background/80 backdrop-blur-2xl border border-border/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] h-16 rounded-full px-2 flex items-center gap-1 min-w-[300px] justify-between'>
          {mobileDockItems.map((item) => {
            const isActive =
              item.href === '/admin/dashboard'
                ? pathname === '/admin/dashboard'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center w-[72px] h-full gap-1 transition-all duration-200 group rounded-full',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {isActive && (
                  <span className='absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary mb-1 shadow-[0_0_10px_rgba(var(--primary),0.5)]' />
                )}
                <div
                  className={cn(
                    'p-1.5 rounded-2xl transition-all duration-300',
                    isActive
                      ? 'bg-primary/10'
                      : 'bg-transparent group-hover:bg-muted/50',
                  )}
                >
                  <item.icon
                    className={cn('w-5 h-5', isActive && 'fill-primary/20')}
                  />
                </div>
                <span
                  className={cn(
                    'text-[9px] font-bold tracking-tight text-center leading-none',
                    isActive ? 'text-primary' : 'opacity-80',
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  'flex flex-col items-center justify-center w-[72px] h-full gap-1 text-muted-foreground hover:text-foreground transition-all duration-200 group rounded-full',
                  isMobileMenuOpen && 'text-primary',
                )}
              >
                <div
                  className={cn(
                    'p-1.5 rounded-2xl transition-all duration-300',
                    isMobileMenuOpen
                      ? 'bg-primary/10'
                      : 'bg-transparent group-hover:bg-muted/50',
                  )}
                >
                  <Menu className='w-5 h-5' />
                </div>
                <span
                  className={cn(
                    'text-[9px] font-bold tracking-tight text-center leading-none',
                    isMobileMenuOpen ? 'text-primary' : 'opacity-80',
                  )}
                >
                  {t('menu') || 'Menu'}
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side='bottom'
              className='h-[75vh] rounded-t-3xl p-0 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-b-0'
            >
              <div className='flex justify-center pt-3 pb-1'>
                <div className='w-12 h-1.5 rounded-full bg-muted-foreground/20' />
              </div>
              <div className='px-6 pb-2 pt-1 border-b flex items-center justify-between'>
                <SheetTitle className='text-lg font-bold tracking-tight flex items-center gap-2'>
                  <div className='w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center'>
                    <LayoutDashboard className='w-3.5 h-3.5' />
                  </div>
                  {t('admin_menu') || 'Navigation'}
                </SheetTitle>
              </div>
              <ScrollArea className='flex-1 px-4 py-4'>
                <div className='grid grid-cols-2 gap-3 mb-6'>
                  {allNavItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 py-3.5 px-4 rounded-2xl border transition-all duration-200 active:scale-95 group shadow-sm',
                          isActive
                            ? 'bg-primary/5 border-primary/20 text-primary'
                            : 'bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-border',
                        )}
                      >
                        <div
                          className={cn(
                            'p-2 rounded-xl transition-colors',
                            isActive
                              ? 'bg-primary/10'
                              : 'bg-muted group-hover:bg-primary/5 group-hover:text-primary',
                          )}
                        >
                          <item.icon className='w-4 h-4' />
                        </div>
                        <span className='text-xs font-bold whitespace-nowrap'>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className='rounded-3xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-5 shadow-sm mb-6'>
                  <div className='flex items-center gap-4 mb-5'>
                    <Avatar className='w-12 h-12 shadow-sm border border-border'>
                      <AvatarImage src={session?.user?.image || ''} />
                      <AvatarFallback className='bg-primary/10 text-primary text-xl font-bold'>
                        {session?.user?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='overflow-hidden flex-1'>
                      <p className='font-bold text-base line-clamp-1'>
                        {session?.user?.name || 'Admin User'}
                      </p>
                      <p className='text-xs text-muted-foreground line-clamp-1'>
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <Button
                      variant='outline'
                      className='rounded-xl h-10 shadow-sm border-border/80'
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href='/'>
                        <Home className='w-4 h-4 mr-2 opacity-70' />
                        {t('store')}
                      </Link>
                    </Button>
                    <Button
                      variant='destructive'
                      className='rounded-xl h-10 shadow-sm'
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      <LogOut className='w-4 h-4 mr-2' />
                      {t('sign_out')}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
};

export const AdminBottomNav = () => null;
export const AdminMobileHeader = () => null;
