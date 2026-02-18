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
import { NotificationWithMeta } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { NotificationList } from './NotificationList';

// ============================================
// TYPES
// ============================================

interface NotificationBellProps {
  initialUnreadCount?: number;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function NotificationBell({
  initialUnreadCount = 0,
  className,
}: NotificationBellProps) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [notifications, setNotifications] = useState<NotificationWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for caching & cleanup
  const lastFetchTimeRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isHoveredRef = useRef(false);

  const [isPending, startTransition] = useTransition();

  // 1. Fetch Logic (Optimized with AbortController)
  const fetchNotifications = useCallback(async (force = false) => {
    // Cache check: Don't refetch if data is less than 15 seconds old unless forced
    const now = Date.now();
    if (!force && notifications.length > 0 && now - lastFetchTimeRef.current < 15000) {
      return;
    }

    // Cleanup previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
      const result = await getNotificationsAction({ limit: 5 });
      if (!controller.signal.aborted) {
        setNotifications(result.notifications);
        setUnreadCount(result.unreadCount);
        lastFetchTimeRef.current = Date.now();
      }
    } catch (error) {
       // Ignore abort errors
       if ((error as Error).name !== 'AbortError') {
         console.error('Failed to fetch notifications:', error);
       }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [notifications.length]);

  // 2. Smart Polling (Recursive Timeout > Interval)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const poll = async () => {
      try {
        const count = await getUnreadCountAction();
        if (isMounted) setUnreadCount(count);
      } catch {
        // Silent fail
      } finally {
        // Schedule next poll only after current one finishes
        if (isMounted) timeoutId = setTimeout(poll, 30000);
      }
    };

    // Start polling loop
    timeoutId = setTimeout(poll, 30000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // 3. Mark Single as Read (Optimistic)
  const handleMarkAsRead = useCallback(async (id: string) => {
    // Optimistic Update
    const previousUnreadCount = unreadCount;
    const previousNotifications = [...notifications];

    // Update UI immediately
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date() } : n))
    );
    
    // Only decrement if it was actually unread
    const target = notifications.find(n => n.id === id);
    if (target && !target.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    // Server Action
    try {
      await markNotificationAsReadAction(id);
    } catch (error) {
      // Rollback on error
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
      toast.error("Failed to update notification");
    }
  }, [notifications, unreadCount]);

  // 4. Mark All Read (Optimistic)
  const handleMarkAllAsRead = useCallback(() => {
    const previousUnreadCount = unreadCount;
    const previousNotifications = [...notifications];

    startTransition(async () => {
      // Optimistic
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);

      try {
        await markAllNotificationsAsReadAction();
      } catch (error) {
        // Rollback
        setNotifications(previousNotifications);
        setUnreadCount(previousUnreadCount);
        toast.error("Failed to mark all as read");
      }
    });
  }, [notifications, unreadCount]);

  // 5. Delete (Optimistic)
  const handleDelete = useCallback(async (id: string) => {
    const previousNotifications = [...notifications];
    const target = notifications.find((n) => n.id === id);
    
    // Optimistic Remove
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await deleteNotificationAction(id);
    } catch (error) {
      setNotifications(previousNotifications);
      if (target && !target.isRead) setUnreadCount(c => c + 1);
      toast.error("Failed to delete");
    }
  }, [notifications]);

  return (
    <Popover 
      open={isOpen} 
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          // Normal fetch on click, but cache might handle it
          fetchNotifications(); 
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors',
            className
          )}
          aria-label={`Notifications (${unreadCount} unread)`}
          // ✨ UX Optimization: Prefetch on hover
          onMouseEnter={() => {
            if (!isHoveredRef.current) {
               fetchNotifications();
               isHoveredRef.current = true;
            }
          }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
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
      <PopoverContent
        className="w-[360px] p-0 rounded-2xl shadow-xl border-border/50"
        align="end"
        sideOffset={10}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
          <h3 className="font-bold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
              className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 px-2"
            >
              {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <CheckCheck className="w-3 h-3 mr-1" />
              )}
              Mark all read
            </Button>
          )}
        </div>

        {/* List with Loading State */}
        {isLoading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs">Loading updates...</span>
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            compact
            maxHeight="max-h-[320px]"
            emptyMessage="You're all caught up!"
          />
        )}

        {/* Footer */}
        <div className="border-t p-2 bg-muted/20">
          <Link
            href="/account/notifications"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors uppercase tracking-wider"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}