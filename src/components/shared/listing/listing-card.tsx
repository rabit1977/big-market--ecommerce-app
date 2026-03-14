'use client';

import { PromotionIcon } from '@/components/shared/listing/promotion-icon';

import { SaveAdButton } from '@/components/listing/save-ad-button';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
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
    // Removed local heart toggle logic

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
          'group relative flex',
          isGrid || isCard
            ? 'flex-col h-full'
            : 'flex-row h-36 sm:h-40 md:h-44',
          isCard && 'mb-4',
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
            'relative overflow-hidden z-20 bg-background transition-all duration-150',
            imagesArray.length > 1
              ? 'pointer-events-auto'
              : 'pointer-events-none',
            isGrid
              ? 'aspect-[3/2] w-full rounded-t-xl shrink-0'
              : isCard
                ? 'aspect-[3/2] w-full rounded-t-xl shrink-0'
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

          {/* Heart Button Overlay - Moved to bottom row per user request */}
        </div>

        <div
          className={cn(
            'flex flex-col relative z-20 pointer-events-none min-w-0 transition-all duration-300',
            isGrid 
              ? 'flex-1 p-1' 
              : isCard
                ? 'flex-1 p-2 sm:p-2.5'
                : 'flex-[2] py-2 px-3 sm:px-4 sm:py-2.5',
          )}
        >
          {/* Title Row */}
          <div className='mb-1'>
            <h3
              className={cn(
                'font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors tracking-tight',
                isGrid ? 'text-[9px] sm:text-[11px]' : isCard ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl md:text-2xl',
              )}
            >
              {listing.title}
            </h3>
          </div>

          {/* Key Fields Descriptions */}
          {(() => {
            const specs = (listing as any).specifications || {};
            const attributes: string[] = [];

            // Always include city first
            if (listing.city) {
              attributes.push(listing.city.split(',')[0].split(' ')[0]);
            }

            const cat = (listing.category || '').toLowerCase();
            const subCat = (listing.subCategory || '').toLowerCase();
            const catName = (listing.categoryName || '').toLowerCase();

            if (
              cat.includes('motor') ||
              subCat.includes('car') ||
              catName.includes('motor')
            ) {
              if (specs.year) attributes.push(`${specs.year}`);
              if (specs.mileage_km)
                attributes.push(`${formatNumber(specs.mileage_km)} km`);
              if (specs.engine_power_kw)
                attributes.push(`${specs.engine_power_kw} kW`);
              if (specs.fuel_type) attributes.push(specs.fuel_type);
            } else if (
              cat.includes('real') ||
              subCat.includes('apart') ||
              subCat.includes('hous') ||
              catName.includes('real')
            ) {
              const condition = getConditionLabel(
                listing.condition || specs.condition,
              );
              if (condition) attributes.push(condition as string);
              if (specs.m2 || specs.area_m2)
                attributes.push(`${specs.m2 || specs.area_m2} m²`);
              if (specs.rooms)
                attributes.push(
                  `${specs.rooms}${typeof specs.rooms === 'number' ? ' rooms' : ''}`,
                );
            } else {
              const condition = getConditionLabel(
                listing.condition || specs.condition,
              );
              if (condition) attributes.push(condition as string);
            }

            if (attributes.length === 0) return null;

            return (
              <div className={cn(
                'flex flex-wrap items-center gap-x-0.5 gap-y-0',
                isGrid ? 'mb-0' : 'mb-1'
              )}>
                {attributes.map((attr, i) => (
                  <React.Fragment key={i}>
                    <span className={cn(
                      'text-muted-foreground font-semibold capitalize tracking-wide',
                      isGrid ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'
                    )}>
                      {attr}
                    </span>
                    {i < attributes.length - 1 && (
                      <span className='text-[10px] text-primary/30 font-black'>
                        •
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            );
          })()}

          {/* Price & Date Row */}
          <div className='flex items-center justify-between mb-1'>
            <div className='flex items-baseline gap-1.5 flex-wrap min-w-0'>
                <span
                  className={cn(
                    'font-black text-foreground tracking-tight truncate max-w-[80px] sm:max-w-none',
                    isGrid ? 'text-[10px] sm:text-[12px]' : 'text-lg sm:text-xl',
                  )}
                  suppressHydrationWarning
                >
                  {listing.price > 0
                    ? formatCurrency(listing.price, (listing as any).currency)
                    : 'Price on req'}
                </span>
              {listing.previousPrice &&
                listing.previousPrice > listing.price && (
                  <span className={cn(
                    'text-muted-foreground/60 line-through',
                    isGrid ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'
                  )}>
                    {formatCurrency(
                      listing.previousPrice,
                      (listing as any).currency,
                    )}
                  </span>
                )}
            </div>
            <span
              className={cn(
                'text-muted-foreground/50 font-bold uppercase tracking-tighter shrink-0',
                isGrid ? 'text-[8px] sm:text-[10px]' : 'text-[10px]'
              )}
              suppressHydrationWarning
            >
              {listing.createdAt
                ? new Date(listing.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })
                : 'Now'}
            </span>
          </div>

          {/* Breadcrumb & Heart Button Row */}
          <div className='flex items-center justify-between mt-auto pt-1'>
            <div className={cn(
              'flex items-center gap-1 text-muted-foreground font-semibold uppercase tracking-wider truncate mr-1',
              isGrid ? 'text-[7px] leading-none' : isCard ? 'text-[9px] sm:text-[10px]' : 'text-[9px] sm:text-[10px]'
            )}>
              <span className={cn(
                'truncate',
                isGrid ? 'max-w-[35px] sm:max-w-[60px]' : isCard ? 'max-w-none' : 'max-w-[80px] sm:max-w-none'
              )}>
                {listing.categoryName || listing.category}
              </span>
              {listing.subCategoryName && (
                <>
                  <span className='opacity-40'>&gt;</span>
                  <span className={cn(
                    'truncate',
                    isGrid ? 'max-w-[35px] sm:max-w-[60px]' : isCard ? 'max-w-none' : 'max-w-[80px] sm:max-w-none'
                  )}>
                    {listing.subCategoryName}
                  </span>
                </>
              )}
            </div>

            <div className={cn(
              'pointer-events-auto shrink-0',
              isGrid ? 'scale-100 sm:scale-110 -mr-1' : 'scale-105 sm:scale-125 -mr-0.5'
            )}>
              {!isOwner && (
                <SaveAdButton
                  listingId={listing.id || listing._id}
                  showText={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ListingCard.displayName = 'ListingCard';
