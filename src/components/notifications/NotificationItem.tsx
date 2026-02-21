'use client';


import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Bell,
  CheckCheck,
  Heart,
  Mail,
  MessageSquare,
  Package,
  RefreshCw,
  Tag,
  TrendingDown,
  Truck,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export type NotificationType = 
  | 'ORDER_UPDATE' 
  | 'PRICE_DROP' 
  | 'BACK_IN_STOCK' 
  | 'PROMOTION' 
  | 'REVIEW_REPLY' 
  | 'SHIPMENT_UPDATE' 
  | 'ACCOUNT_ALERT' 
  | 'WISHLIST_SALE' 
  | 'SYSTEM'
  | 'INFO'
  | 'SUCCESS'
  | 'ERROR'
  | 'WARNING'
  | 'INQUIRY';

// ============================================
// TYPE ICON MAPPING
// ============================================

interface TypeConfig {
  icon: any; // Allow for dynamic icons
  color: string;
  bgColor: string;
}

const typeConfigs: Record<string, TypeConfig> = {
  INQUIRY: {
    icon: Mail,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  ORDER_UPDATE: {
    icon: Package,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  PRICE_DROP: {
    icon: TrendingDown,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  BACK_IN_STOCK: {
    icon: RefreshCw,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  PROMOTION: {
    icon: Tag,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  REVIEW_REPLY: {
    icon: MessageSquare,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  SHIPMENT_UPDATE: {
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10',
  },
  ACCOUNT_ALERT: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  WISHLIST_SALE: {
    icon: Heart,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  SYSTEM: {
    icon: Bell,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  INFO: {
    icon: Bell,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  SUCCESS: {
    icon: Bell,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  ERROR: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  WARNING: {
    icon: AlertCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
};

// ============================================
// TYPES
// ============================================

export interface NotificationItemProps {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
  metadata?: any;
  onMarkAsRead?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  compact?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function NotificationItem({
  id,
  type,
  title,
  message,
  link,
  isRead,
  createdAt,
  metadata,
  onMarkAsRead,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const config = typeConfigs[type] || typeConfigs.SYSTEM;
  const Icon = config.icon;

  const isInquiry = type === 'INQUIRY' || message.includes('sent a message about');
  const meta = metadata as any;
  const guestName = meta?.guestName || (isInquiry ? message.split(' sent')[0] : null);
  const guestEmail = meta?.guestEmail;
  const listingTitle = meta?.listingTitle || 'Your Listing';

  const mailtoUri = isInquiry && guestEmail 
    ? `mailto:${guestEmail}?subject=Re: ${listingTitle}`
    : null;

  const handleClick = (e: React.MouseEvent) => {
    // If we clicked a button or an anchor tag, don't trigger the container click
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }

    if (!isRead && onMarkAsRead) {
      startTransition(() => {
        onMarkAsRead(id);
      });
    }

    if (isInquiry && mailtoUri) {
      window.location.href = mailtoUri;
    } else if (link) {
      router.push(link);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      startTransition(() => {
        onDelete(id);
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative flex flex-col gap-2 p-3 rounded-xl transition-all duration-200 cursor-pointer',
        !isRead && 'bg-primary/5 dark:bg-primary/10',
        isPending && 'opacity-50 pointer-events-none',
        compact ? 'p-2.5' : 'p-3',
        'hover:bg-muted/50 border border-transparent hover:border-border/40'
      )}
    >
      <div className="flex gap-3">
          {/* Unread indicator */}
          {!isRead && (
            <span className="absolute left-1 top-4 w-1.5 h-1.5 rounded-full bg-primary" />
          )}

          {/* Icon */}
          <div
            className={cn(
              'shrink-0 flex items-center justify-center rounded-xl',
              config.bgColor,
              compact ? 'w-9 h-9' : 'w-10 h-10'
            )}
          >
            <Icon className={cn('w-4 h-4', config.color)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'font-bold text-foreground truncate',
                compact ? 'text-xs' : 'text-sm'
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                'text-muted-foreground line-clamp-2',
                compact ? 'text-[11px]' : 'text-sm'
              )}
            >
              {message}
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>

          {/* Delete button (only for desktop hover) */}
          {onDelete && !compact && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="shrink-0 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete notification"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pl-12">
          {/* Reply Button for Inquiries */}
          {isInquiry && guestEmail && (
            <Button 
              asChild
              variant="default"
              size="sm"
              className="h-7 px-3 text-[10px] font-black uppercase tracking-tight rounded-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-sm"
              onClick={(e) => {
                  e.stopPropagation();
                  if (!isRead && onMarkAsRead) {
                      onMarkAsRead(id);
                  }
              }}
            >
              <a href={mailtoUri!}>
                <Mail className="w-3 h-3 mr-1.5" />
                Reply to {guestName || 'Guest'}
              </a>
            </Button>
          )}

          {/* Mark as read button */}
          {!isRead && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-3 text-[10px] font-black uppercase tracking-tight text-muted-foreground hover:text-primary rounded-lg transition-all"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onMarkAsRead) onMarkAsRead(id);
              }}
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              Mark Read
            </Button>
          )}

          {/* Detail Link button if it's NOT an inquiry (since inquiries open mail client) */}
          {!isInquiry && link && (
              <Button asChild variant="ghost" size="sm" className="h-7 px-3 text-[10px] font-black uppercase tracking-tight rounded-lg">
                  <Link href={link} onClick={(e) => {
                    e.stopPropagation();
                    if (!isRead && onMarkAsRead) onMarkAsRead(id);
                  }}>View Details</Link>
              </Button>
          )}

          {isInquiry && link && (
             <Button asChild variant="ghost" size="sm" className="h-7 px-3 text-[10px] font-black uppercase tracking-tight rounded-lg text-muted-foreground hover:text-foreground">
                <Link href={link} onClick={(e) => {
                  e.stopPropagation();
                  if (!isRead && onMarkAsRead) onMarkAsRead(id);
                }}>Listing Details</Link>
             </Button>
          )}
      </div>
    </div>
  );
}
