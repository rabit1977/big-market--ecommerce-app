'use client';

import { sendMessageAction } from '@/actions/message-actions';
import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import {
    AlertTriangle,
    CheckCircle,
    Heart,
    Mail,
    MapPin,
    Phone,
    Shield,
    User,
    XCircle
} from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface ListingContactPanelProps {
  listing: ListingWithRelations;
  initialIsWished: boolean;
}

export function ListingContactPanel({
  listing,
  initialIsWished,
}: ListingContactPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [isWished, setIsWished] = useState(initialIsWished);
  const [showPhone, setShowPhone] = useState(false);

  // Status config
  const isActive = listing.status === 'ACTIVE';
  const isSold = listing.status === 'SOLD';

  const statusConfig = useMemo(() => {
    if (isSold) {
      return {
        label: 'Sold',
        sublabel: 'No longer available',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        dotColor: 'bg-red-500',
        icon: XCircle,
      };
    }
    if (!isActive) {
        return {
            label: listing.status,
            sublabel: 'Not available',
            color: 'text-orange-600',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/20',
            dotColor: 'bg-orange-500',
            icon: AlertTriangle,
        };
    }
    return {
      label: 'Available',
      sublabel: 'Ready for pickup',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      dotColor: 'bg-emerald-500',
      icon: CheckCircle,
    };
  }, [isActive, isSold, listing.status]);

  const handleToggleWishlist = () => {
    startTransition(async () => {
      const result = await toggleWishlistAction(listing.id);

      if (!result.success) {
        toast.error(result.error ?? 'Wishlist update failed');
        return;
      }

      const wished = !!result.isWished;
      setIsWished(wished);

      toast.success(wished ? 'Added to favorites' : 'Removed from favorites');
    });
  };
  
  const handleSendMessage = () => {
    const content = window.prompt("Enter your message to the seller:");
    if (!content) return;
    
    startTransition(async () => {
        const result = await sendMessageAction({
            content,
            listingId: listing.id,
            receiverId: listing.userId
        });
        
        if (result.success) {
            toast.success("Message sent!");
        } else {
            toast.error(result.error || "Failed to send message");
        }
    });
  };

  const StatusIcon = statusConfig.icon;

  return (
    <div className='glass-card p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700'>
      {/* Header - Category */}
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <span className='text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary'>
          {listing.category}
        </span>
      </div>

      {/* Title */}
      <div className='space-y-2 sm:space-y-3'>
        <h1 className='text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight'>
          {listing.title}
        </h1>

        {/* Price Section */}
        <div className='flex items-baseline gap-3 sm:gap-4 flex-wrap'>
          <p className='text-2xl sm:text-4xl lg:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-primary'>
            {formatPrice(listing.price)}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-xl border transition-all',
        statusConfig.bgColor,
        statusConfig.borderColor
      )}>
        <div className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center',
          statusConfig.bgColor
        )}>
          <StatusIcon className={cn('h-5 w-5', statusConfig.color)} />
        </div>
        <div className='flex-1'>
          <p className={cn('font-bold', statusConfig.color)}>
            {statusConfig.label}
          </p>
          <p className='text-xs text-muted-foreground'>
            {statusConfig.sublabel}
          </p>
        </div>
        {isActive && (
          <div className={cn(
            'h-3 w-3 rounded-full animate-pulse',
            statusConfig.dotColor
          )}
          style={{ boxShadow: `0 0 10px currentColor` }}
          />
        )}
      </div>

      <Separator className='bg-border/60' />

      {/* Contact Actions */}
      <div className='space-y-4'>
        <div className='flex gap-3 justify-end'>
          <Button
            size='icon'
            variant='outline'
            onClick={handleToggleWishlist}
            disabled={isPending}
            className={cn(
              'h-12 w-12 rounded-full border transition-all shrink-0',
              isWished 
                ? 'bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:border-red-800 dark:hover:bg-red-900/50' 
                : 'border-border/60 hover:bg-secondary/50 hover:border-primary/30'
            )}
            title={isWished ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart
              className={cn('h-5 w-5 transition-all duration-300', {
                'fill-red-500 text-red-500 scale-110': isWished,
                'text-muted-foreground': !isWished
              })}
            />
          </Button>
        </div>

        {/* Contact Seller Buttons */}
        {isActive && (
          <>
            <Button
              size='lg'
              onClick={() => setShowPhone(!showPhone)}
              className='w-full h-12 md:h-14 text-base font-bold rounded-2xl shadow-xl transition-all btn-premium btn-glow shadow-primary/25 hover:shadow-primary/40'
            >
              <Phone className='mr-3 h-4 w-4' />
              {showPhone ? listing.contactPhone || 'No phone provided' : 'Show Phone Number'}
            </Button>

            <Button
              size='lg'
              variant='outline'
              onClick={handleSendMessage}
              disabled={isPending}
              className='w-full h-12 md:h-14 text-base font-bold rounded-2xl border-2'
            >
              <Mail className='mr-3 h-4 w-4' />
              Send Message
            </Button>
          </>
        )}
      </div>

      {/* Seller Info */}
      <div className='bg-muted/50 p-4 rounded-xl space-y-3'>
        <div className='flex items-center gap-2 text-sm font-semibold'>
          <User className='h-4 w-4 text-primary' />
          <span>Seller Information</span>
        </div>
        <div className='space-y-2 text-sm'>
             <div className="flex items-center gap-3">
                 {/* Avatar could go here if we had user image url in simplified types */}
                 <span className="font-bold">{listing.user?.name || 'User'}</span>
             </div>
          {listing.city && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <MapPin className='h-4 w-4' />
              <span>{listing.city}</span>
            </div>
          )}
        </div>
      </div>

      {/* Trust Badge */}
      <div className='flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50 text-center'>
        <Shield className='h-5 w-5 text-primary' />
        <span className='text-xs font-medium text-muted-foreground'>Meet safely in public places</span>
      </div>

      {/* Additional Product Info */}
      <Separator className='bg-border/60' />
      <div className='space-y-2 text-sm'>
        {listing.category && (
            <div className='flex justify-between'>
            <span className='text-muted-foreground'>Category</span>
            <span className='font-medium'>{listing.category}</span>
            </div>
        )}
        {listing.subCategory && (
            <div className='flex justify-between'>
            <span className='text-muted-foreground'>Subcategory</span>
            <span className='font-medium'>{listing.subCategory}</span>
            </div>
        )}
      </div>

      {/* Tags */}
      {listing.tags && listing.tags.length > 0 && (
        <div className='flex flex-wrap gap-2 pt-2'>
          {listing.tags.map((tag) => (
            <span 
              key={tag} 
              className='text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20'
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
