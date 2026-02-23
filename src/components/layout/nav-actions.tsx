'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck, BarChart, Bell,
  ChevronRight, CreditCard, Crown,
  Heart, HelpCircle, Home, LayoutDashboard, Lock, LogOut,
  MessageSquare, Package, Pencil, Settings, ShieldCheck,
  Star, Store, Trash,
  Wallet, X
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LanguageSwitcher } from './language-switcher';
import { PaletteSwitcher } from './palette-switcher';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavActionsProps {
  initialWishlistCount: number;
}

interface MenuItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  highlight?: boolean;
  iconColor?: string;
  danger?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderSectionLabel(label: string) {
  return (
    <div className="px-2.5 pt-2.5 pb-1">
      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
        {label}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NavActions = ({ initialWishlistCount }: NavActionsProps) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const t = useTranslations('NavActions');
  const tNav = useTranslations('Navigation');

  const unreadMessagesCount =
    useQuery(api.messages.getUnreadCount, user?.id ? { userId: user.id } : 'skip') ?? 0;

  const unreadNotificationsCount =
    useQuery(api.notifications.getUnreadCount, user?.id ? { userId: user.id } : 'skip') ?? 0;

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const totalAlertCount = unreadMessagesCount + unreadNotificationsCount;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close panel on route change
  useEffect(() => {
    setIsPanelOpen(false);
  }, [pathname]);

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
    if (!isPanelOpen) return;
    const scrollY = window.scrollY;
    document.body.style.cssText = `position:fixed;top:-${scrollY}px;width:100%`;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
    };
  }, [isPanelOpen]);

  const handlePanelToggle = useCallback(() => {
    setIsPanelOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const renderMenuItem = (item: MenuItem) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={closePanel}
        className={cn(
          'flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-[13px] font-medium transition-all group',
          isActive
            ? 'bg-primary/8 text-primary font-semibold'
            : item.danger
              ? 'text-muted-foreground hover:text-destructive hover:bg-destructive/5'
              : item.highlight
                ? 'text-primary bg-primary/5 hover:bg-primary/10 font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        )}
      >
        <item.icon className={cn(
          'w-3.5 h-3.5 shrink-0',
          item.iconColor || (isActive ? 'text-primary' : ''),
          item.danger && 'group-hover:text-destructive'
        )} />
        <span className="flex-1">{item.label}</span>
        {item.badge && item.badge > 0 ? (
          <Badge className="h-[18px] min-w-[18px] px-1 bg-primary hover:bg-primary/90 text-[9px] font-bold">
            {item.badge > 99 ? '99+' : item.badge}
          </Badge>
        ) : (
          <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
        )}
      </Link>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!isMounted || (!user && status === 'loading')) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button asChild variant="ghost" size="sm" className="h-9 px-3 rounded-full font-bold hover:bg-muted ml-1">
        <Link href="/auth">
          <User className="h-4 w-4 mr-1.5" />
          {tNav('login')}
        </Link>
      </Button>
    );
  }

  const userDisplayName =
    (user as any).accountType === 'COMPANY' && (user as any).companyName
      ? (user as any).companyName
      : user.name;

  // ── Menu sections (stable — derived from user, after existence check) ──
  const isAdmin = user.role === 'ADMIN';

  const mobileOnlyItems: MenuItem[] = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/listings', icon: Store, label: t('browse_listings') },
    { href: '/messages', icon: MessageSquare, label: t('messages'), badge: unreadMessagesCount, iconColor: 'text-primary' },
    { href: '/account/notifications', icon: Star, label: t('notifications'), badge: unreadNotificationsCount, iconColor: 'text-amber-500' },
    { href: '/favorites', icon: Heart, label: t('favorites'), badge: initialWishlistCount, iconColor: 'text-rose-500' },
  ];

  const accountItems: MenuItem[] = [
    { href: '/my-listings', icon: Package, label: t('my_listings') },
    { href: `/store/${user.id}`, icon: Store, label: tNav('stores'), highlight: true, iconColor: 'text-primary' },
    { href: '/my-listings/stats', icon: BarChart, label: t('ad_statistics') },
    { href: '/my-listings/saved-searches', icon: Bell, label: t('saved_searches_alerts') },
    { href: '/wallet', icon: CreditCard, label: t('account_overview') },
    { href: '/wallet/top-up', icon: Wallet, label: t('top_up_account') },
  ];

  const settingsItems: MenuItem[] = [
    { href: '/account', icon: Settings, label: t('edit_profile') },
    { href: '/account/password', icon: Lock, label: t('change_password') },
    ...(!isAdmin ? [
      { href: '/account/verification', icon: ShieldCheck, label: t('verification') },
      { href: '/premium', icon: Crown, label: t('subscription_plans'), iconColor: 'text-amber-500' },
    ] : []),
  ];

  const supportItems: MenuItem[] = [
    { href: '/help', icon: HelpCircle, label: t('help_center') },
    { href: '/messages?type=SUPPORT', icon: MessageSquare, label: t('live_support_chat'), iconColor: 'text-primary' },
  ];

  const adminItems: MenuItem[] = isAdmin
    ? [{ href: '/admin/dashboard', icon: LayoutDashboard, label: t('admin_panel'), iconColor: 'text-primary' }]
    : [];

  const dangerItems: MenuItem[] = [
    { href: '/account/delete', icon: Trash, label: t('delete_account'), danger: true },
  ];

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Admin Dashboard */}
        {isAdmin && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild variant="ghost" size="icon"
                  className="relative hidden md:flex h-9 w-9 rounded-full text-primary hover:bg-primary/10"
                >
                  <Link href="/admin/dashboard" aria-label="Admin Dashboard">
                    <LayoutDashboard className="h-4.5 w-4.5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('admin_panel')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Favorites */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild variant="ghost" size="icon"
                className="relative hidden md:flex h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Link href="/favorites" aria-label={`Favorites${initialWishlistCount > 0 ? ` (${initialWishlistCount})` : ''}`}>
                  <Heart className="h-4.5 w-4.5" />
                  <AnimatePresence>
                    {initialWishlistCount > 0 && (
                      <motion.span
                        key="wishlist-badge"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background"
                        aria-hidden="true"
                      >
                        {initialWishlistCount > 9 ? '9+' : initialWishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('favorites')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Messages */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild variant="ghost" size="icon"
                className="relative hidden md:flex h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Link href="/messages" aria-label={`Messages${unreadMessagesCount > 0 ? ` (${unreadMessagesCount} unread)` : ''}`}>
                  <MessageSquare className={cn('h-4.5 w-4.5', unreadMessagesCount > 0 && 'text-primary')} />
                  <AnimatePresence>
                    {unreadMessagesCount > 0 && (
                      <motion.span
                        key="messages-badge"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background"
                        aria-hidden="true"
                      >
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('messages')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Help */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild variant="ghost" size="icon"
                className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/40"
              >
                <Link href="/help" aria-label="Help Center">
                  <HelpCircle className="h-4.5 w-4.5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('help_center')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Avatar — opens account panel on click */}
        <button
          onClick={handlePanelToggle}
          className="relative ml-0.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label="Open account menu"
        >
          <UserAvatar
            user={user}
            className="h-8 w-8 md:h-9 md:w-9 border-2 border-background shadow-sm hover:shadow-md transition-shadow"
          />
          <AnimatePresence>
            {totalAlertCount > 0 && !isPanelOpen && (
              <motion.span
                key="user-badge"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background md:hidden"
                aria-hidden="true"
              >
                {totalAlertCount > 9 ? '9+' : totalAlertCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Account Panel — portaled */}
      {createPortal(
        <AnimatePresence mode="wait">
          {isPanelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                onClick={closePanel}
                aria-hidden="true"
              />

              <motion.div
                ref={panelRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 bottom-0 right-0 z-[60] w-[80%] max-w-xs bg-background shadow-2xl flex flex-col overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Account menu"
              >
                {/* Header */}
                <div className="px-4 pt-4 pb-3 border-b shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UserAvatar user={user} className="h-9 w-9 border-2 border-border shadow-sm shrink-0" />
                      <div className="overflow-hidden min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[13px] truncate">{userDisplayName}</span>
                          <BadgeCheck className="w-3 h-3 text-primary shrink-0" />
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate leading-tight">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={closePanel}
                      className="h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close account menu"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <Link
                      href="/sell"
                      onClick={closePanel}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Pencil className="w-3 h-3" />
                      {t('post_ad')}
                    </Link>
                    <Link
                      href="/premium"
                      onClick={closePanel}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                    >
                      <Star className="w-3 h-3" />
                      {t('premium')}
                    </Link>
                  </div>
                </div>

                {/* Menu */}
                <div className="flex-1 overflow-y-auto overscroll-contain py-1">
                  {adminItems.length > 0 && (
                    <>
                      {renderSectionLabel(t('administration'))}
                      <div className="px-1.5">{adminItems.map(renderMenuItem)}</div>
                      <div className="mx-3 my-1 h-px bg-border/30" />
                    </>
                  )}

                  {renderSectionLabel(t('app_style'))}
                  <div className="px-1.5 mb-2"><PaletteSwitcher /></div>
                  <div className="mx-3 my-1 h-px bg-border/30" />

                  <div className="md:hidden">
                    {renderSectionLabel(t('navigation_section'))}
                    <div className="px-1.5">{mobileOnlyItems.map(renderMenuItem)}</div>
                    <div className="mx-3 my-1 h-px bg-border/30" />
                  </div>

                  {renderSectionLabel(t('listings_section'))}
                  <div className="px-1.5">{accountItems.map(renderMenuItem)}</div>
                  <div className="mx-3 my-1 h-px bg-border/30" />

                  {renderSectionLabel(t('support_section'))}
                  <div className="px-1.5">{supportItems.map(renderMenuItem)}</div>
                  <div className="mx-3 my-1 h-px bg-border/30" />

                  {renderSectionLabel(t('account_section'))}
                  <div className="px-1.5">{settingsItems.map(renderMenuItem)}</div>
                  <div className="mx-3 my-1 h-px bg-border/30" />

                  <div className="px-1.5 pb-1">{dangerItems.map(renderMenuItem)}</div>
                </div>

                {/* Footer */}
                <div className="border-t px-3 py-2 shrink-0">
                  <button
                    onClick={() => { closePanel(); handleLogout(); }}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-muted/40 hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-[12px] font-semibold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t('log_out')}
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