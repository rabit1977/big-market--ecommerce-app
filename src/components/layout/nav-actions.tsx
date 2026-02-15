'use client';

import { getUnreadCountAction, getUnreadMessagesCountAction } from '@/actions/notification-actions';
import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BadgeCheck,
    BarChart,
    ChevronRight,
    CreditCard,
    Crown,
    Heart,
    HelpCircle,
    Home,
    LayoutDashboard,
    Lock,
    LogOut,
    MessageSquare,
    Package,
    Pencil,
    Settings,
    ShieldCheck,
    Star,
    Store,
    Trash,
    User,
    Wallet,
    X
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PaletteSwitcher } from './palette-switcher';

interface NavActionsProps {
  initialWishlistCount: number;
}

// Menu item definition for clean rendering
interface MenuItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  highlight?: boolean;
  iconColor?: string;
  showOnDesktop?: boolean;
  adminOnly?: boolean;
  danger?: boolean;
}

export const NavActions = ({ initialWishlistCount }: NavActionsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const [wishlistCount, setWishlistCount] = useState(initialWishlistCount);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [lastSeenAlertCount, setLastSeenAlertCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHasMounted(true); }, []);
  useEffect(() => { setWishlistCount(initialWishlistCount); }, [initialWishlistCount]);

  // Close panel on route change
  useEffect(() => { setIsPanelOpen(false); }, [pathname]);

  // Poll for counts
  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      try {
        const [nTotal, mTotal] = await Promise.all([
            getUnreadCountAction(),
            getUnreadMessagesCountAction()
        ]);
        setUnreadNotificationsCount(nTotal);
        setUnreadMessagesCount(mTotal);
      } catch { /* Silently fail */ }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = useCallback(() => { signOut({ callbackUrl: '/' }); }, []);

  const alertCount = unreadNotificationsCount;

  const handlePanelToggle = useCallback(() => {
    setIsPanelOpen(prev => {
      if (!prev) setLastSeenAlertCount(alertCount);
      return !prev;
    });
  }, [alertCount]);

  // Close on click outside
  useEffect(() => {
    if (!isPanelOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isPanelOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isPanelOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPanelOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isPanelOpen]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isPanelOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isPanelOpen]);

  if (!hasMounted) {
    return (
      <div className='flex items-center gap-1 sm:gap-2'>
        <Skeleton className='h-9 w-9 rounded-full' />
      </div>
    );
  }

  // ─── Menu sections ───
  const quickActions: MenuItem[] = [
    { href: '/sell', icon: Pencil, label: 'Post New Listing', highlight: true, iconColor: 'text-primary' },
    { href: '/premium', icon: Star, label: 'Become Premium', iconColor: 'text-amber-500' },
  ];

  const mobileOnlyItems: MenuItem[] = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/listings', icon: Store, label: 'Browse Listings' },
    { href: '/messages', icon: MessageSquare, label: 'Messages', badge: unreadMessagesCount, iconColor: 'text-primary' },
    { href: '/favorites', icon: Heart, label: 'Favorites', badge: wishlistCount, iconColor: 'text-primary' },
  ];

  const accountItems: MenuItem[] = [
    { href: '/my-listings', icon: Package, label: 'My Listings' },
    { href: '/my-listings/stats', icon: BarChart, label: 'Ad Statistics' },
    { href: '/wallet', icon: CreditCard, label: 'Account Overview' },
    { href: '/wallet/top-up', icon: Wallet, label: 'Top Up Account' },
  ];

  const settingsItems: MenuItem[] = [
    { href: '/account', icon: Settings, label: 'Edit Profile' },
    { href: '/account/password', icon: Lock, label: 'Change Password' },
    // Only show Verification and Premium for non-admins
    ...(user?.role !== 'ADMIN' ? [
        { href: '/account/verification', icon: ShieldCheck, label: 'Verification' },
        { href: '/premium', icon: Crown, label: 'Subscription Plans', iconColor: 'text-amber-500' },
    ] : [])
  ];
  
  const supportItems: MenuItem[] = [
    { href: '/help', icon: HelpCircle, label: 'Help Center' },
    { href: '/messages?type=SUPPORT', icon: MessageSquare, label: 'Live Support Chat', iconColor: 'text-primary' },
  ];

  const adminItems: MenuItem[] = user?.role === 'ADMIN' ? [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Panel', iconColor: 'text-primary' },
  ] : [];

  const dangerItems: MenuItem[] = [
    { href: '/account/delete', icon: Trash, label: 'Delete Account', danger: true },
  ];

  const renderMenuItem = (item: MenuItem, onNavigate: () => void) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-[13px] font-medium transition-all group",
          isActive
            ? "bg-primary/8 text-primary font-semibold"
            : item.danger
              ? "text-muted-foreground hover:text-destructive hover:bg-destructive/5"
              : item.highlight
                ? "text-primary bg-primary/5 hover:bg-primary/10 font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
        )}
      >
        <item.icon className={cn("w-3.5 h-3.5 shrink-0", item.iconColor || (isActive ? "text-primary" : ""), item.danger && "group-hover:text-destructive")} />
        <span className='flex-1'>{item.label}</span>
        {item.badge && item.badge > 0 ? (
          <Badge className='h-[18px] min-w-[18px] px-1 bg-primary hover:bg-primary/90 text-[9px] font-bold'>
            {item.badge > 99 ? '99+' : item.badge}
          </Badge>
        ) : (
          <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
        )}
      </Link>
    );
  };

  const renderSectionLabel = (label: string) => (
    <div className='px-2.5 pt-2.5 pb-1'>
      <span className='text-[9px] font-black uppercase tracking-widest text-muted-foreground/40'>
        {label}
      </span>
    </div>
  );

  return (
    <>
      <div className='flex items-center gap-1 sm:gap-1.5'>
        {/* Desktop: Admin Dashboard */}
        {user?.role === 'ADMIN' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild variant='ghost' size='icon'
                  className='relative hidden md:flex h-9 w-9 rounded-full text-primary hover:bg-primary/10'
                >
                  <Link href="/admin/dashboard">
                    <LayoutDashboard className="h-4.5 w-4.5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Admin Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Desktop: Favorites */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild variant='ghost' size='icon'
                className='relative hidden md:flex h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10'
              >
                <Link href="/favorites">
                  <Heart className="h-4.5 w-4.5" />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span key='wishlist-badge' initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background'
                      >
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Favorites</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Desktop: Messages */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild variant='ghost' size='icon'
                className='relative hidden md:flex h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10'
              >
                <Link href="/messages">
                  <MessageSquare className={cn("h-4.5 w-4.5", unreadMessagesCount > 0 && "text-primary")} />
                  <AnimatePresence>
                    {unreadMessagesCount > 0 && (
                      <motion.span key='messages-badge' initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background'
                      >
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Messages</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Desktop & Mobile: Help Center */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild variant='ghost' size='icon'
                className='relative h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/40'
              >
                <Link href="/help">
                  <HelpCircle className="h-4.5 w-4.5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help Center</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User Avatar Trigger */}
        {user ? (
          <button
            onClick={handlePanelToggle}
            className='relative ml-0.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
          >
            <UserAvatar
              user={user}
              className='h-8 w-8 md:h-9 md:w-9 border-2 border-background shadow-sm hover:shadow-md transition-shadow'
            />
            <AnimatePresence>
              {unreadNotificationsCount > 0 && unreadNotificationsCount > lastSeenAlertCount && !isPanelOpen && (
                <motion.span key='user-badge' initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background'
                >
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ) : (
          <Button asChild variant='ghost' size='sm' className='h-9 px-3 rounded-full font-bold hover:bg-muted ml-1'>
            <Link href='/auth'>
              <User className='h-4 w-4 mr-1.5' />
              Login
            </Link>
          </Button>
        )}
      </div>

      {/* ───── User Account Panel (portaled, slides from right) ───── */}
      {user && typeof document !== 'undefined' && createPortal(
        <AnimatePresence mode='wait'>
          {isPanelOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm'
                onClick={() => setIsPanelOpen(false)}
              />

              {/* Panel */}
              <motion.div
                ref={panelRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className='fixed top-0 bottom-0 right-0 z-[60] w-[80%] max-w-xs bg-background shadow-2xl flex flex-col overflow-hidden'
              >
                {/* Panel Header — User Info */}
                <div className='px-4 pt-4 pb-3 border-b shrink-0'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2.5 min-w-0'>
                      <UserAvatar user={user} className='h-9 w-9 border-2 border-border shadow-sm shrink-0' />
                      <div className='overflow-hidden min-w-0'>
                        <div className='flex items-center gap-1'>
                          <span className='font-bold text-[13px] truncate'>
                            {(user as any).accountType === 'COMPANY' && (user as any).companyName 
                              ? (user as any).companyName 
                              : user.name}
                          </span>
                          <BadgeCheck className='w-3 h-3 text-primary shrink-0' />
                        </div>
                        <p className='text-[10px] text-muted-foreground truncate leading-tight'>{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPanelOpen(false)}
                      className='h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground transition-colors'
                    >
                      <X className='h-3.5 w-3.5' />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className='grid grid-cols-2 gap-1.5'>
                    <Link
                      href='/sell'
                      onClick={() => setIsPanelOpen(false)}
                      className='flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors shadow-sm'
                    >
                      <Pencil className='w-3 h-3' />
                      Post Ad
                    </Link>
                    <Link
                      href='/premium'
                      onClick={() => setIsPanelOpen(false)}
                      className='flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold hover:bg-amber-500/20 transition-colors border border-amber-500/20'
                    >
                      <Star className='w-3 h-3' />
                      Premium
                    </Link>
                  </div>
                </div>

                {/* Scrollable Menu */}
                <div className='flex-1 overflow-y-auto overscroll-contain py-1'>
                  {/* Admin Section (First) */}
                  {adminItems.length > 0 && (
                    <>
                      {renderSectionLabel('Administration')}
                      <div className='px-1.5'>
                        {adminItems.map(item => renderMenuItem(item, () => setIsPanelOpen(false)))}
                      </div>
                      <div className='mx-3 my-1 h-px bg-border/30' />
                    </>
                  )}

                  {/* Palette Selection Section */}
                  {renderSectionLabel('App Style')}
                  <div className='px-1.5 mb-2'>
                    <PaletteSwitcher />
                  </div>
                  <div className='mx-3 my-1 h-px bg-border/30' />

                  {/* Mobile navigation — visible only below md */}
                  <div className='md:hidden'>
                    {renderSectionLabel('Navigation')}
                    <div className='px-1.5'>
                      {mobileOnlyItems.map(item => renderMenuItem(item, () => setIsPanelOpen(false)))}
                    </div>
                    <div className='mx-3 my-1 h-px bg-border/30' />
                  </div>

                  {/* Listings section */}
                  {renderSectionLabel('Listings')}
                  <div className='px-1.5'>
                    {accountItems.map(item => renderMenuItem(item, () => setIsPanelOpen(false)))}
                  </div>
                  <div className='mx-3 my-1 h-px bg-border/30' />

                    {/* Support & Help */}
                  {renderSectionLabel('Support')}
                  <div className='px-1.5'>
                    {supportItems.map(item => renderMenuItem(item, () => setIsPanelOpen(false)))}
                  </div>

                  {/* Account & Settings */}
                  <div className='mx-3 my-1 h-px bg-border/30' />
                  {renderSectionLabel('Account')}
                  <div className='px-1.5'>
                    {settingsItems.map(item => renderMenuItem(item, () => setIsPanelOpen(false)))}
                  </div>

                  {/* Danger zone */}
                  <div className='mx-3 my-1 h-px bg-border/30' />
                  <div className='px-1.5 pb-1'>
                    {dangerItems.map(item => renderMenuItem(item, () => setIsPanelOpen(false)))}
                  </div>
                </div>

                {/* Footer — Logout */}
                <div className='border-t px-3 py-2 shrink-0'>
                  <button
                    onClick={() => { setIsPanelOpen(false); handleLogout(); }}
                    className='flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-muted/40 hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-[12px] font-semibold transition-colors'
                  >
                    <LogOut className='w-3.5 h-3.5' />
                    Log Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
