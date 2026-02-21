'use client';

import {
  deleteNotificationAction,
  getNotificationsAction,
  getUnreadCountAction,
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
} from '@/actions/notification-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationWithMeta } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { NotificationList } from './NotificationList';

interface NotificationBellProps {
  initialUnreadCount?: number;
  className?: string;
}

const CACHE_TTL = 15_000; // ms
const POLL_INTERVAL = 30_000; // ms

export function NotificationBell({
  initialUnreadCount = 0,
  className,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [notifications, setNotifications] = useState<NotificationWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const lastFetchTimeRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Track hover with a boolean ref — no state needed, no re-render
  const hasHoverFetchedRef = useRef(false);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => { abortControllerRef.current?.abort(); }, []);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && notifications.length > 0 && now - lastFetchTimeRef.current < CACHE_TTL) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
      const result = await getNotificationsAction({ limit: 10 });
      if (!controller.signal.aborted) {
        setNotifications(result.notifications);
        setUnreadCount(result.unreadCount);
        lastFetchTimeRef.current = Date.now();
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        // Silent fail — badge still shows stale count
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, [notifications.length]);

  // ── Polling (unread count only) ───────────────────────────────────────────
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let active = true;

    const poll = async () => {
      try {
        const count = await getUnreadCountAction();
        if (active) setUnreadCount(count);
      } catch {
        // Silent fail
      } finally {
        if (active) timeoutId = setTimeout(poll, POLL_INTERVAL);
      }
    };

    timeoutId = setTimeout(poll, POLL_INTERVAL);
    return () => { active = false; clearTimeout(timeoutId); };
  }, []);

  // ── Mark single as read (optimistic) ─────────────────────────────────────
  const handleMarkAsRead = useCallback(async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.isRead) return; // Already read — no-op

    const prevNotifications = notifications;
    const prevCount = unreadCount;

    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, isRead: true, readAt: new Date() } : n)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsReadAction(id);
    } catch {
      setNotifications(prevNotifications);
      setUnreadCount(prevCount);
      toast.error('Failed to update notification');
    }
  }, [notifications, unreadCount]);

  // ── Mark all as read (optimistic) ────────────────────────────────────────
  const handleMarkAllAsRead = useCallback(() => {
    const prevNotifications = notifications;
    const prevCount = unreadCount;

    startTransition(async () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date() })));
      setUnreadCount(0);

      try {
        await markAllNotificationsAsReadAction();
      } catch {
        setNotifications(prevNotifications);
        setUnreadCount(prevCount);
        toast.error('Failed to mark all as read');
      }
    });
  }, [notifications, unreadCount]);

  // ── Delete (optimistic) ───────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    const prevNotifications = notifications;

    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.isRead) setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await deleteNotificationAction(id);
    } catch {
      setNotifications(prevNotifications);
      if (target && !target.isRead) setUnreadCount((prev) => prev + 1);
      toast.error('Failed to delete');
    }
  }, [notifications]);

  // ── Popover open handler ──────────────────────────────────────────────────
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) fetchNotifications();
  }, [fetchNotifications]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors',
            className
          )}
          aria-label={`Notifications (${unreadCount} unread)`}
          onMouseEnter={() => {
            if (!hasHoverFetchedRef.current) {
              fetchNotifications();
              hasHoverFetchedRef.current = true;
            }
          }}
          onMouseLeave={() => { hasHoverFetchedRef.current = false; }}
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                key="notification-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-0.5"
              >
                <Badge
                  variant="default"
                  className="h-4 min-w-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground border-2 border-background shadow-xs pointer-events-none"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-0 rounded-2xl shadow-2xl border-border/50 overflow-hidden flex flex-col h-auto max-h-[calc(100vh-120px)]" align="end" sideOffset={10}>
        <div className="flex items-center justify-between px-4 py-3.5 border-b bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-[13px] uppercase tracking-tight text-foreground">Notifications</h3>
            {unreadCount > 0 && <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{unreadCount} New</span>}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
              className="h-7 text-[11px] font-bold text-primary hover:text-primary hover:bg-primary/10 px-2 rounded-lg"
            >
              {isPending
                ? <Loader2 className="w-3 h-3 animate-spin mr-1" />
                : <CheckCheck className="w-3.5 h-3.5 mr-1" />}
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          {isLoading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-muted-foreground gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Loader2 className="w-6 h-6 animate-spin text-primary relative" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">Checking for updates...</span>
            </div>
          ) : (
            <NotificationList
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              compact
              emptyMessage="You're all caught up!"
            />
          )}
        </ScrollArea>

        <div className="border-t p-3 bg-muted/30 shrink-0">
          <Link
            href="/account/notifications"
            onClick={() => setIsOpen(false)}
            className="group flex items-center justify-center gap-2 w-full text-center py-2.5 text-[11px] font-black text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl transition-all uppercase tracking-widest"
          >
            View all notifications
            <motion.div
               animate={{ x: [0, 3, 0] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div className="w-1 h-1 bg-primary rounded-full" />
            </motion.div>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
