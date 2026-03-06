'use client';

import { PromotionIcon } from '@/components/shared/listing/promotion-icon';

import { getPromotionConfig } from '@/lib/constants/promotions';
import { useFavorites } from '@/lib/context/favorites-context';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';
import { Heart, MapPin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { memo, useCallback, useState } from 'react';

interface ListingCardProps {
  listing: ListingWithRelations;
  viewMode?: 'grid' | 'list' | 'card';
  initialIsWished?: boolean; // Deprecated but kept for compatibility
}

export const ListingCard = memo(
  ({ listing, viewMode = 'list' }: ListingCardProps) => {
    const t = useTranslations('Common');
    const tBadge = useTranslations('SellerBadge');
    const tFilter = useTranslations('FilterPanel');
    const { data: session } = useSession();
    const isOwner = session?.user?.id === listing.userId;

    const getConditionLabel = (condition?: string | null) => {
      if (!condition) return null;
      switch (condition.toLowerCase()) {
        case 'new':
          return t('brand_new');
        case 'like-new':
          return tFilter('cond_like_new');
        case 'good':
          return tFilter('cond_good');
        case 'fair':
          return tFilter('cond_fair');
        case 'used':
          return t('pre_owned');
        default:
          return condition;
      }
    };
    const { isFavorite, toggleFavorite } = useFavorites();
    const isWished = isFavorite(listing.id || listing._id);

    // Wishlist toggle handler
    const handleToggleWishlist = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        toggleFavorite(listing.id || listing._id);
      },
      [listing.id, listing._id, toggleFavorite],
    );

    const imagesArray = listing.images?.length
      ? (listing.images as (string | { url: string })[])
      : ['/placeholder.png'];
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const index = Math.round(container.scrollLeft / container.clientWidth);
        if (index !== activeImageIndex) {
          setActiveImageIndex(index);
        }
      },
      [activeImageIndex],
    );
    const isGrid = viewMode === 'grid';
    const isCard = viewMode === 'card';

    // Real logic from listing and user metadata
    const tier = listing.user?.membershipTier;
    const isPromoted =
      listing.isPromoted &&
      (!listing.promotionExpiresAt || listing.promotionExpiresAt > Date.now());
    const promotionTier = isPromoted ? listing.promotionTier : null;
    const promoConfig = isPromoted ? getPromotionConfig(promotionTier) : null;
    const isVerified = listing.user?.isVerified;

    return (
      <div
        className={cn(
          'group relative bg-card rounded-xl flex bm-interactive overflow-hidden transition-all duration-200',
          isGrid || isCard
            ? 'flex-col h-full'
            : 'flex-row h-40 sm:h-44 md:h-48',
          isCard && 'mb-2 sm:mb-4',
        )}
      >
        {/* Main Card Link - Higher Z-Index but below heart button */}
        <Link
          href={`/listings/${listing.id || listing._id}`}
          className='absolute inset-0 z-10'
          aria-label={`View ${listing.title}`}
        />

        {/* Image Section - The container for the 'card' look */}
        <div
          className={cn(
            'relative overflow-hidden z-20 bg-muted transition-all duration-150',
            imagesArray.length > 1
              ? 'pointer-events-auto'
              : 'pointer-events-none',
            isGrid
              ? 'aspect-[4/3] w-full rounded-t-xl shrink-0'
              : isCard
                ? 'aspect-video w-full rounded-t-xl shrink-0'
                : 'flex-grow flex-shrink basis-10 min-w-10 max-w-54 h-full rounded-l-xl',
          )}
        >
          <div
            className='flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x touch-pan-y'
            onScroll={imagesArray.length > 1 ? handleScroll : undefined}
          >
            {imagesArray.map((img, i) => {
              const imgSrc = typeof img === 'string' ? img : img.url;
              return (
                <Link
                  key={i}
                  href={`/listings/${listing.id || listing._id}`}
                  className='relative w-full h-full flex-shrink-0 snap-center pointer-events-auto'
                  aria-label={`View ${listing.title}`}
                >
                  <Image
                    src={imgSrc}
                    alt={`${listing.title} - Image ${i + 1}`}
                    fill
                    className='object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none'
                    sizes={
                      isCard
                        ? '(max-width: 768px) 100vw, 80vw'
                        : isGrid
                          ? '(max-width: 768px) 50vw, 25vw '
                          : '(max-width: 768px) 33vw, 20vw'
                    }
                  />
                </Link>
              );
            })}
          </div>

          {imagesArray.length > 1 && (
            <div className='absolute bottom-1.5 left-0 right-0 z-30 flex justify-center gap-1.5 pointer-events-auto'>
              {imagesArray.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const container = e.currentTarget.parentElement
                      ?.previousElementSibling as HTMLElement;
                    if (container)
                      container.scrollTo({
                        left: container.clientWidth * i,
                        behavior: 'smooth',
                      });
                  }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    i === activeImageIndex
                      ? 'bg-white scale-110 shadow-sm'
                      : 'bg-white/50 scale-90',
                  )}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
          {isPromoted && promoConfig && (
            <div
              className={cn(
                'flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full absolute top-2 left-2 z-30 bg-white/90 dark:bg-black/70 backdrop-blur-xs opacity-90 border border-white/20',
                promoConfig.badgeColor.replace('bg-', 'text-'),
              )}
              title='Promoted'
            >
              <PromotionIcon
                iconName={promoConfig.icon}
                className='h-3.5 w-3.5 fill-current text-current'
              />
            </div>
          )}

          {listing.previousPrice && listing.previousPrice > listing.price && (
            <div className='absolute bottom-2 left-2 z-20 pointer-events-none'>
              <div className='bg-[#E53238] text-white text-[10px] sm:text-[12px] font-bold px-1.5 py-0.5 rounded-full'>
                {Math.round(
                  ((listing.previousPrice - listing.price) /
                    listing.previousPrice) *
                    100,
                )}
                % OFF
              </div>
            </div>
          )}
          {(isGrid || isCard) && (
            <div className='absolute top-1 right-1 sm:top-1.5 sm:right-1.5 z-30 pointer-events-none'>
              <span
                className='text-[9px] font-bold text-white/90 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-white/20'
                suppressHydrationWarning
              >
                {listing.createdAt
                  ? new Date(listing.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : ''}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div
          className={cn(
            'flex flex-[2] flex-col justify-between relative z-20 pointer-events-none min-w-0 transition-all duration-300',
            isGrid || isCard
              ? 'space-y-0.5 p-2'
              : 'px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4',
          )}
        >
          {isGrid || isCard ? (
            <>
              <div className='space-y-1'>
                <div className='flex items-start justify-between gap-1.5'>
                  <h3
                    className={cn(
                      'font-bold text-sm sm:text-base leading-snug line-clamp-2 text-foreground/90',
                      isCard && 'text-base sm:text-lg',
                    )}
                  >
                    <span className='group-hover:underline decoration-foreground/30 underline-offset-2 transition-all'>
                      {listing.title}
                    </span>
                    <span className='flex items-center justify-between border-border/40 mt-2'>
                      <span className='text-xs text-foreground/70 font-medium uppercase tracking-tight'>
                        {getConditionLabel(listing.condition)}
                      </span>
                    </span>
                  </h3>
                  <div className='flex items-center gap-1.5 flex-wrap'>
                    {/* Badge removed per user request */}
                  </div>
                </div>
              </div>

              <div className='mt-auto space-y-1'>
                <div className='flex items-baseline gap-1.5 flex-wrap'>
                  <span
                    className={cn(
                      'font-bold text-foreground',
                      isCard ? 'text-lg sm:text-xl' : 'text-base sm:text-lg',
                    )}
                    suppressHydrationWarning
                  >
                    {listing.price > 0
                      ? formatCurrency(listing.price, (listing as any).currency)
                      : 'Price on req'}
                  </span>
                  {listing.previousPrice &&
                    listing.previousPrice > listing.price && (
                      <span
                        className='text-xs sm:text-sm text-muted-foreground line-through opacity-70'
                        suppressHydrationWarning
                      >
                        {formatCurrency(
                          listing.previousPrice as number,
                          (listing as any).currency,
                        )}
                      </span>
                    )}
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1 text-xs text-muted-foreground/80 font-medium capitalize'>
                    <MapPin className='w-4 h-4 text-primary' />
                    {listing.city ? listing.city.split(' ')[0] : 'Skopje'}
                  </div>

                  <button
                    onClick={handleToggleWishlist}
                    className='w-7 h-7 p-1 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 shadow-sm flex items-center justify-center text-foreground hover:text-red-500 transition-all hover:scale-110 active:scale-95 pointer-events-auto'
                  >
                    <Heart
                      className={cn(
                        'w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors',
                        isWished && 'fill-red-500 text-red-500',
                      )}
                    />
                  </button>
                </div>

                {isCard && listing.description && (
                  <p className='text-xs text-muted-foreground line-clamp-2 mt-2 font-normal'>
                    {listing.description}
                  </p>
                )}
              </div>
            </>
          ) : (
            // List View Content - Redesigned for Responsive Excellence
            <>
              <div className='space-y-1.5 min-w-0'>
                <div className='flex items-center justify-between mb-0.5'>
                  <div className='flex items-center gap-1.5'>
                    {/* Badge removed per user request */}
                  </div>
                  <span
                    className='text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wider opacity-60'
                    suppressHydrationWarning
                  >
                    {listing.createdAt
                      ? new Date(listing.createdAt).toLocaleDateString(
                          'en-GB',
                          { day: 'numeric', month: 'short' },
                        )
                      : 'Now'}
                  </span>
                </div>

                <h3 className='font-bold text-sm sm:text-base md:text-lg leading-tight line-clamp-2 group-hover:underline decoration-foreground/30 underline-offset-2 transition-all text-foreground'>
                  {listing.title}
                </h3>

                <div className='hidden sm:block text-[11px] md:text-sm text-muted-foreground/80 line-clamp-2 opacity-70 font-medium mt-1'>
                  {listing.description}
                </div>
              </div>

              <div className='flex items-center justify-between mt-auto pt-2'>
                <div className='flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4'>
                  <div className='flex items-baseline gap-2'>
                    <span
                      className='text-base sm:text-lg md:text-xl font-bold text-foreground'
                      suppressHydrationWarning
                    >
                      {listing.price > 0
                        ? formatCurrency(
                            listing.price,
                            (listing as any).currency,
                          )
                        : 'Price on request'}
                    </span>
                    {listing.previousPrice &&
                      listing.previousPrice > listing.price && (
                        <span
                          className='text-xs sm:text-sm text-muted-foreground line-through opacity-70'
                          suppressHydrationWarning
                        >
                          {formatCurrency(
                            listing.previousPrice as number,
                            (listing as any).currency,
                          )}
                        </span>
                      )}
                  </div>
                  <div className='flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground/80 font-semibold uppercase tracking-tight'>
                    <MapPin className='w-3.5 h-3.5 text-primary/80' />
                    {listing.city || 'Skopje'}
                  </div>
                </div>

                <button
                  onClick={handleToggleWishlist}
                  className='w-8 h-8 p-1 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 shadow-sm flex items-center justify-center text-foreground hover:text-red-500 transition-all hover:scale-110 active:scale-95 pointer-events-auto'
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isWished && 'fill-red-500 text-red-500',
                    )}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);

ListingCard.displayName = 'ListingCard';
