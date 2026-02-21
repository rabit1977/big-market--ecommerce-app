'use client';

import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Bell,
  CheckCheck,
  ExternalLink,
  Heart,
  Mail,
  MessageSquare,
  Package,
  RefreshCw,
  Tag,
  TrendingDown,
  Truck,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface TypeConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const typeConfigs: Record<string, TypeConfig> = {
  INQUIRY:         { icon: Mail,          color: 'text-violet-500',  bgColor: 'bg-violet-500/10'  },
  ORDER_UPDATE:    { icon: Package,       color: 'text-blue-500',    bgColor: 'bg-blue-500/10'    },
  PRICE_DROP:      { icon: TrendingDown,  color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  BACK_IN_STOCK:   { icon: RefreshCw,     color: 'text-purple-500',  bgColor: 'bg-purple-500/10'  },
  PROMOTION:       { icon: Tag,           color: 'text-orange-500',  bgColor: 'bg-orange-500/10'  },
  REVIEW_REPLY:    { icon: MessageSquare, color: 'text-cyan-500',    bgColor: 'bg-cyan-500/10'    },
  SHIPMENT_UPDATE: { icon: Truck,         color: 'text-sky-500',     bgColor: 'bg-sky-500/10'     },
  ACCOUNT_ALERT:   { icon: AlertCircle,   color: 'text-red-500',     bgColor: 'bg-red-500/10'     },
  WISHLIST_SALE:   { icon: Heart,         color: 'text-rose-500',    bgColor: 'bg-rose-500/10'    },
  SYSTEM:          { icon: Bell,          color: 'text-slate-400',   bgColor: 'bg-slate-400/10'   },
  INFO:            { icon: Bell,          color: 'text-blue-400',    bgColor: 'bg-blue-400/10'    },
  SUCCESS:         { icon: Bell,          color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  ERROR:           { icon: AlertCircle,   color: 'text-red-500',     bgColor: 'bg-red-500/10'     },
  WARNING:         { icon: AlertCircle,   color: 'text-amber-500',   bgColor: 'bg-amber-500/10'   },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface NotificationItemProps {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any> | null;
  onMarkAsRead?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  /** compact=true is used inside the bell dropdown; false is for the full page */
  compact?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  const config = typeConfigs[type] ?? typeConfigs.SYSTEM;
  const Icon = config.icon;

  const isInquiry = type === 'INQUIRY' || message.includes('sent a message about') || message.includes('sent an email about');
  const meta = metadata as Record<string, any> | null | undefined;
  
  // Robust metadata extraction
  const guestName = meta?.guestName || meta?.senderName || (isInquiry ? message.split(' sent')[0] : null);
  const guestEmail = meta?.guestEmail || null;
  const senderId = meta?.senderId || null;
  const listingTitle = meta?.listingTitle || 'Your Listing';
  const listingId = meta?.listingId || null;

  // Debug: log what we have (remove after fix confirmed)
  if (isInquiry) {
    console.log('[NotificationItem] INQUIRY debug:', {
      type, metadata, guestEmail, senderId, mailtoHref: isInquiry && guestEmail
        ? `mailto:${guestEmail}`
        : null
    });
  }

  // Use mailto link for external guest emails
  const mailtoHref = isInquiry && guestEmail
    ? `mailto:${guestEmail}?subject=Re: ${encodeURIComponent(listingTitle)}&body=${encodeURIComponent('\n\n---\nRegarding: ' + listingTitle)}`
    : null;

  // Use internal chat link for registered users
  const internalChatHref = isInquiry && senderId
    ? `/messages?listingId=${listingId || ''}`
    : null;

  const markRead = () => {
    if (!isRead && onMarkAsRead) {
      startTransition(() => { onMarkAsRead(id); });
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // If clicking a button or link inside, don't trigger container click
    if ((e.target as HTMLElement).closest('button, a')) return;
    
    markRead();
    
    // Default action for inquiry is also to reply if possible
    if (isInquiry && internalChatHref) {
      router.push(internalChatHref);
    } else if (isInquiry && mailtoHref) {
      window.location.href = mailtoHref;
    } else if (link) {
      router.push(link);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) startTransition(() => { onDelete(id); });
  };

  return (
    <div
      onClick={handleContainerClick}
      className={cn(
        'group relative flex gap-3 transition-all duration-200 cursor-pointer select-none',
        compact ? 'px-3 py-2.5' : 'px-5 py-4',
        !isRead
          ? 'bg-primary/[0.03] dark:bg-primary/[0.06]'
          : 'hover:bg-muted/40',
        isPending && 'opacity-40 pointer-events-none',
        'border-l-2 border-transparent',
        !isRead && 'border-l-primary'
      )}
    >
      {/* Icon */}
      <div className={cn(
        'shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
        config.bgColor,
        compact ? 'w-8 h-8' : 'w-11 h-11',
      )}>
        <Icon className={cn(compact ? 'w-3.5 h-3.5' : 'w-5 h-5', config.color)} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* Title row */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className={cn(
            'font-black tracking-tight leading-none',
            compact ? 'text-[10px] uppercase' : 'text-[13px]',
            isRead ? 'text-muted-foreground/70' : 'text-foreground',
          )}>
            {title}
          </p>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] font-bold text-muted-foreground/40 whitespace-nowrap uppercase tracking-tighter">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 transition-all ml-1 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-md p-1"
                aria-label="Delete"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <p className={cn(
          'text-muted-foreground leading-snug line-clamp-2 mb-2',
          compact ? 'text-[10.5px] font-medium' : 'text-[12px]',
        )}>
          {message}
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Internal Reply — registered users */}
          {isInquiry && internalChatHref ? (
             <Link
               href={internalChatHref}
               onClick={(e) => { e.stopPropagation(); markRead(); }}
               className={cn(
                 'inline-flex items-center gap-1.5 rounded-lg font-black uppercase tracking-widest transition-all',
                 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20',
                 compact ? 'h-5.5 px-2.5 text-[8.5px]' : 'h-8 px-4 text-[10px]',
               )}
             >
               <Mail className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
               Reply
             </Link>
          ) : isInquiry && mailtoHref ? (
            /* External Reply — guests: use a plain <a> so the browser handles
               mailto: natively without going through the Next.js router */
            <a
              href={mailtoHref}
              onClick={(e) => { e.stopPropagation(); markRead(); }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg font-black uppercase tracking-widest transition-all',
                'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 cursor-pointer',
                compact ? 'h-5.5 px-2.5 text-[8.5px]' : 'h-8 px-4 text-[10px]',
              )}
            >
              <Mail className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
              Reply via Email
            </a>
          ) : isInquiry && (
             <div className="text-[9px] font-bold text-destructive/60 uppercase">No reply channel</div>
          )}

          {/* View listing / details */}
          {link && !internalChatHref && (
            <Link
              href={link}
              onClick={(e) => { e.stopPropagation(); markRead(); }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg font-black uppercase tracking-widest transition-all',
                'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50',
                compact ? 'h-5.5 px-2.5 text-[8.5px]' : 'h-8 px-4 text-[10px]',
              )}
            >
              <ExternalLink className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
              Listing
            </Link>
          )}

          {/* Mark read */}
          {!isRead && onMarkAsRead && (
            <button
              onClick={(e) => { e.stopPropagation(); markRead(); }}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg font-black uppercase tracking-widest transition-all',
                'text-primary/60 hover:text-primary hover:bg-primary/5',
                compact ? 'h-5.5 px-2 text-[8.5px]' : 'h-8 px-3 text-[10px]',
              )}
            >
              <CheckCheck className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
              Mark
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
