'use client';

import { NotificationWithMeta } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { NotificationItem } from './NotificationItem';

export interface NotificationListProps {
  notifications: NotificationWithMeta[];
  onMarkAsRead?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  compact?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
  showEmptyIcon?: boolean;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  compact = false,
  maxHeight = 'max-h-[400px]',
  emptyMessage = 'No notifications yet',
  showEmptyIcon = true,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3">
        {showEmptyIcon && (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Inbox className="w-5 h-5 text-muted-foreground/50" />
          </div>
        )}
        <p className="text-[13px] text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('divide-y divide-border/30', !compact && 'px-1')}>
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          id={n.id}
          type={n.type}
          title={n.title}
          message={n.message}
          link={n.link}
          isRead={n.isRead}
          createdAt={n.createdAt}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          metadata={n.metadata as any}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          compact={compact}
        />
      ))}
    </div>
  );
}