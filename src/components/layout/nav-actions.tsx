'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck, BarChart, Bell, CheckCheck, ChevronRight, CreditCard, Crown,
  Heart, HelpCircle, Home, LayoutDashboard, Lock, LogOut,
  Mail,
  MessageSquare, Package, Pencil, Settings, ShieldCheck,
  Star, Store, Trash, User, Wallet, X,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

  const unreadNotificationsCount =
    useQuery(api.notifications.getUnreadCount, user?.id ? { userId: user.id } : 'skip') ?? 0;
  const unreadMessagesCount =
    useQuery(api.messages.getUnreadCount, user?.id ? { userId: user.id } : 'skip') ?? 0;
  const recentNotifications = useQuery(
    api.notifications.list,
    user?.id ? { userId: user.id, limit: 3, unreadOnly: false, skip: 0 } : 'skip'
  );

  const markNotificationAsRead = useMutation(api.notifications.markAsRead);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [lastSeenAlertCount, setLastSeenAlertCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const totalAlertCount = unreadNotificationsCount + unreadMessagesCount;

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
    setIsPanelOpen((prev) => {
      if (!prev) setLastSeenAlertCount(totalAlertCount);
      return !prev;
    });
  }, [totalAlertCount]);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  // ── Menu sections (stable — derived from user, not re-created on every render) ──
  const isAdmin = user?.role === 'ADMIN';

  const mobileOnlyItems: MenuItem[] = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/listings', icon: Store, label: 'Browse Listings' },
    { href: '/messages', icon: MessageSquare, label: 'Messages', badge: unreadMessagesCount, iconColor: 'text-primary' },
    { href: '/favorites', icon: Heart, label: 'Favorites', badge: initialWishlistCount, iconColor: 'text-primary' },
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
    ...(!isAdmin ? [
      { href: '/account/verification', icon: ShieldCheck, label: 'Verification' },
      { href: '/premium', icon: Crown, label: 'Subscription Plans', iconColor: 'text-amber-500' },
    ] : []),
  ];

  const supportItems: MenuItem[] = [
    { href: '/help', icon: HelpCircle, label: 'Help Center' },
    { href: '/messages?type=SUPPORT', icon: MessageSquare, label: 'Live Support Chat', iconColor: 'text-primary' },
  ];

  const adminItems: MenuItem[] = isAdmin
    ? [{ href: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Panel', iconColor: 'text-primary' }]
    : [];

  const dangerItems: MenuItem[] = [
    { href: '/account/delete', icon: Trash, label: 'Delete Account', danger: true },
  ];

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

  if (!user && status === 'loading') {
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
          Login
        </Link>
      </Button>
    );
  }

  const userDisplayName =
    (user as any).accountType === 'COMPANY' && (user as any).companyName
      ? (user as any).companyName
      : user.name;

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
              <TooltipContent>Admin Dashboard</TooltipContent>
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
            <TooltipContent>Favorites</TooltipContent>
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
            <TooltipContent>Messages</TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
            <TooltipContent>Help Center</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Avatar + Hover Card */}
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
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
                {totalAlertCount > 0 && totalAlertCount > lastSeenAlertCount && !isPanelOpen && (
                  <motion.span
                    key="user-badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background"
                    aria-hidden="true"
                  >
                    {totalAlertCount > 9 ? '9+' : totalAlertCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </HoverCardTrigger>

          <HoverCardContent align="end" className="w-80 p-0 overflow-hidden shadow-xl border-border/60">
            <div className="bg-muted/50 p-3 border-b border-border/50 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Notifications</span>
              {totalAlertCount > 0 && (
                <Badge className="h-5 px-1.5 bg-primary text-[10px] font-bold">{totalAlertCount} new</Badge>
              )}
            </div>

            {unreadMessagesCount > 0 && (
              <div className="p-2 border-b border-border/40">
                <Link
                  href="/messages"
                  className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      You have {unreadMessagesCount} unread message{unreadMessagesCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">Click to view conversations</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </Link>
              </div>
            )}

            <ScrollArea className="max-h-[300px]">
              {!recentNotifications || (recentNotifications.notifications.length === 0 && unreadMessagesCount === 0) ? (
                <div className="py-8 text-center px-4">
                  <Bell className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs font-medium text-muted-foreground">No new notifications</p>
                </div>
              ) : (
                <div className="p-1 space-y-0.5">
                  {recentNotifications?.notifications.map((n) => {
                    const isInquiry = n.type === 'INQUIRY' || n.message.includes('sent a message about');
                    const guestName = n.metadata?.guestName || (isInquiry ? n.message.split(' sent')[0] : null);
                    const guestEmail = n.metadata?.guestEmail;

                    return (
                      <div 
                        key={n._id} 
                        className={cn(
                          "relative group rounded-xl transition-all duration-200 border border-transparent cursor-pointer",
                          !n.isRead ? "bg-primary/5 hover:bg-primary/10 border-primary/10" : "hover:bg-muted/50"
                        )}
                        onClick={async (e) => {
                          // Only trigger if not clicking buttons or links
                          if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
                          
                          if (!n.isRead && user?.id) await markNotificationAsRead({ id: n._id, userId: user.id });
                          
                          const mailtoUri = isInquiry && guestEmail ? `mailto:${guestEmail}?subject=Re: ${n.metadata?.listingTitle || 'Your Listing'}` : null;
                          if (isInquiry && mailtoUri) {
                            window.location.href = mailtoUri;
                          } else if (n.link) {
                            window.location.href = n.link;
                          }
                        }}
                      >
                        <div className="p-2.5 flex flex-col gap-2">
                          <div className="flex items-start gap-2.5">
                            {/* Icon/Indicator */}
                            <div className="relative mt-1">
                               {isInquiry ? (
                                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                   <Mail className="w-4 h-4 text-primary" />
                                 </div>
                               ) : (
                                 <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                   <Bell className="w-4 h-4 text-muted-foreground" />
                                 </div>
                               )}
                               {!n.isRead && (
                                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                               )}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                               {n.title && (
                                 <p className={cn(
                                   "text-[10px] font-black uppercase tracking-wider mb-0.5",
                                   !n.isRead ? "text-primary" : "text-muted-foreground/70"
                                 )}>
                                   {n.title}
                                 </p>
                               )}
                               <p className={cn(
                                 "text-[11px] leading-snug break-words",
                                 !n.isRead ? "font-bold text-foreground" : "text-muted-foreground"
                               )}>
                                 {n.message}
                               </p>
                               <div className="flex items-center gap-2 mt-1">
                                 <p className="text-[9px] text-muted-foreground/60 font-medium italic">
                                   {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                                 </p>
                               </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 pt-1">
                            {/* Reply Button for Inquiries (PRIORITY) */}
                            {isInquiry && guestEmail && (
                              <Button 
                                asChild
                                variant="default"
                                size="sm"
                                className="h-7 px-2.5 text-[10px] font-black uppercase tracking-tight rounded-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-sm"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (!n.isRead && user?.id) {
                                    await markNotificationAsRead({ id: n._id, userId: user.id });
                                  }
                                }}
                              >
                                <a href={`mailto:${guestEmail}?subject=Re: ${n.metadata?.listingTitle || 'Your Listing'}`}>
                                  <Mail className="w-3 h-3 mr-1" />
                                  Reply
                                </a>
                              </Button>
                            )}

                            {/* Main Link/View */}
                            <Button 
                              asChild 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2.5 text-[10px] font-black uppercase tracking-tight rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!n.isRead && user?.id) {
                                  await markNotificationAsRead({ id: n._id, userId: user.id });
                                }
                              }}
                            >
                              <Link href={n.link || '/account/notifications'}>
                                {isInquiry ? 'Listing Details' : 'View Details'}
                              </Link>
                            </Button>

                            {/* Mark as read button (only if unread) */}
                            {!n.isRead && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2.5 text-[10px] font-black uppercase tracking-tight text-muted-foreground hover:text-primary rounded-lg transition-all ml-auto"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (user?.id) await markNotificationAsRead({ id: n._id, userId: user.id });
                                }}
                              >
                                <CheckCheck className="w-3.5 h-3.5 mr-1" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <div className="p-2 border-t border-border/40 bg-muted/20">
              <Button asChild variant="ghost" size="sm" className="w-full h-7 text-[10px] font-bold text-muted-foreground hover:text-primary">
                <Link href="/account/notifications">View All Notifications</Link>
              </Button>
            </div>
          </HoverCardContent>
        </HoverCard>
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
                      Post Ad
                    </Link>
                    <Link
                      href="/premium"
                      onClick={closePanel}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                    >
                      <Star className="w-3 h-3" />
                      Premium
                    </Link>
                  </div>
                </div>

                {/* Menu */}
                <div className="flex-1 overflow-y-auto overscroll-contain py-1">
                  {adminItems.length > 0 && (
                    <>
                      {renderSectionLabel('Administration')}
                      <div className="px-1.5">{adminItems.map(renderMenuItem)}</div>
                      <div className="mx-3 my-1 h-px bg-border/30" />
                    </>
                  )}

                  {renderSectionLabel('App Style')}
                  <div className="px-1.5 mb-2"><PaletteSwitcher /></div>
                  <div className="mx-3 my-1 h-px bg-border/30" />

                  <div className="md:hidden">
                    {renderSectionLabel('Navigation')}
                    <div className="px-1.5">{mobileOnlyItems.map(renderMenuItem)}</div>
                    <div className="mx-3 my-1 h-px bg-border/30" />
                  </div>

                  {/* Mobile Notifications Section */}
                  <div className="md:hidden">
                    {renderSectionLabel('Recent Notifications')}
                    {recentNotifications?.notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center opacity-40">
                        <Bell className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-[10px] font-medium">No new notifications</p>
                      </div>
                    ) : (
                      <div className="px-1.5 space-y-1">
                        {recentNotifications?.notifications.map((n) => {
                          const isInquiry = n.type === 'INQUIRY' || n.message.includes('sent a message about');
                          const guestName = n.metadata?.guestName || (isInquiry ? n.message.split(' sent')[0] : null);
                          const guestEmail = n.metadata?.guestEmail;

                          return (
                            <div 
                              key={n._id} 
                              className={cn(
                                "p-3 rounded-xl border border-transparent transition-all cursor-pointer",
                                !n.isRead ? "bg-primary/5 border-primary/10" : "bg-muted/30"
                              )}
                              onClick={async (e) => {
                                if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
                                if (!n.isRead && user?.id) await markNotificationAsRead({ id: n._id, userId: user.id });
                                
                                const mailtoUri = isInquiry && guestEmail ? `mailto:${guestEmail}?subject=Re: ${n.metadata?.listingTitle || 'Your Listing'}` : null;
                                if (isInquiry && mailtoUri) {
                                  window.location.href = mailtoUri;
                                } else if (n.link) {
                                  closePanel();
                                  window.location.href = n.link;
                                }
                              }}
                            >
                              <div className="flex gap-3">
                                <div className="shrink-0 mt-1">
                                  {isInquiry ? <Mail className="w-4 h-4 text-primary" /> : <Bell className="w-4 h-4 text-muted-foreground" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  {n.title && (
                                    <p className={cn("text-[9px] font-black uppercase tracking-widest mb-0.5", !n.isRead ? "text-primary" : "text-muted-foreground/60")}>
                                      {n.title}
                                    </p>
                                  )}
                                  <p className={cn("text-[11px] leading-snug mb-1", !n.isRead ? "font-bold" : "text-muted-foreground")}>
                                    {n.message}
                                  </p>
                                  <p className="text-[9px] text-muted-foreground/60">{formatDistanceToNow(n.createdAt, { addSuffix: true })}</p>
                                  
                                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                    {isInquiry && guestEmail && (
                                      <Button 
                                        asChild 
                                        variant="default" 
                                        size="sm" 
                                        className="h-7 px-2.5 text-[10px] font-black uppercase tracking-tight rounded-lg bg-primary text-white"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <a href={`mailto:${guestEmail}?subject=Re: ${n.metadata?.listingTitle || 'Your Listing'}`}>
                                          <Mail className="w-3 h-3 mr-1" />
                                          Reply
                                        </a>
                                      </Button>
                                    )}
                                    <Button asChild variant="secondary" size="sm" className="h-7 px-2.5 text-[10px] font-black uppercase tracking-tight rounded-lg">
                                      <Link href={n.link || '/account/notifications'} onClick={(e) => {
                                        e.stopPropagation();
                                        closePanel();
                                      }}>
                                        {isInquiry ? 'Listing Details' : 'View Details'}
                                      </Link>
                                    </Button>
                                    {!n.isRead && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 px-2 text-[10px] font-black uppercase tracking-tight text-primary rounded-lg ml-auto"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (user?.id) markNotificationAsRead({ id: n._id, userId: user.id });
                                        }}
                                      >
                                        <CheckCheck className="w-3.5 h-3.5 mr-1" />
                                        Mark Read
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <Button asChild variant="ghost" size="sm" className="w-full h-8 text-[10px] font-bold text-muted-foreground hover:text-primary mt-1">
                          <Link href="/account/notifications" onClick={closePanel}>View All Notifications</Link>
                        </Button>
                      </div>
                    )}
                    <div className="mx-3 my-1 h-px bg-border/30" />
                  </div>

                  {renderSectionLabel('Listings')}
                  <div className="px-1.5">{accountItems.map(renderMenuItem)}</div>
                  <div className="mx-3 my-1 h-px bg-border/30" />

                  {renderSectionLabel('Support')}
                  <div className="px-1.5">{supportItems.map(renderMenuItem)}</div>
                  <div className="mx-3 my-1 h-px bg-border/30" />

                  {renderSectionLabel('Account')}
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