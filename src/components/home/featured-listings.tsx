'use client';

import { SaveAdButton } from '@/components/listing/save-ad-button';
import { PromotionIcon } from '@/components/shared/listing/promotion-icon';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';
import { MapPin, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useRef, useState } from 'react';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  previousPrice?: number;
  currency?: string;
  condition?: string;
  category: string;
  images: string[];
  thumbnail?: string;
  city: string;
  status: string;
  createdAt: number;
  viewCount?: number;
  _creationTime: number;
  isPromoted?: boolean;
  isVerified?: boolean;
  promotionTier?: string;
  promotionExpiresAt?: number;
  categoryName?: string;
  subCategoryName?: string;
}

function FeaturedImageCarousel({
  images,
  title,
  href,
  aspect = 'aspect-square',
}: {
  images: string[];
  title: string;
  href: string;
  aspect?: string;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      if (container.clientWidth === 0) return;
      const index = Math.round(container.scrollLeft / container.clientWidth);
      if (index !== activeImageIndex) {
        setActiveImageIndex(index);
      }
    },
    [activeImageIndex],
  );

  const scrollToImage = (i: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.clientWidth * i,
        behavior: 'smooth',
      });
    }
  };

  const imagesArray = images?.length ? images : ['/placeholder.png'];

  return (
    <div
      className={cn(
        'relative overflow-hidden group/image w-full h-full',
        aspect,
      )}
    >
      <div
        ref={scrollRef}
        className='flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x'
        onScroll={imagesArray.length > 1 ? handleScroll : undefined}
      >
        {imagesArray.map((img, i) => (
          <div
            key={i}
            className='relative w-full h-full flex-shrink-0 snap-center'
          >
            <Image
              src={img}
              alt={`${title} - image ${i + 1}`}
              fill
              className='object-cover transition-transform duration-700 ease-out group-hover:scale-105'
              sizes='(max-width: 768px) 45vw, 20vw'
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {imagesArray.length > 1 && (
        <div className='absolute bottom-2 left-0 right-0 z-30 flex justify-center gap-1.5 pointer-events-none'>
          {imagesArray.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollToImage(i);
              }}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300 pointer-events-auto shadow-sm',
                i === activeImageIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 scale-90 hover:bg-white/80',
              )}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FeaturedListingsProps {
  listings: Listing[];
  variant?: 'horizontal' | 'vertical';
  title?: string;
}

export function FeaturedListings({
  listings,
  variant = 'horizontal',
  title,
}: FeaturedListingsProps) {
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');
  const tFilter = useTranslations('FilterPanel');
  // Removed local isFavorite/toggleFavorite hooks as SaveAdButton handles it internally

  const getConditionLabel = (condition?: string | null) => {
    if (!condition) return null;
    switch (condition.toLowerCase()) {
      case 'new':
        return tCommon('brand_new');
      case 'like-new':
        return tFilter('cond_like_new');
      case 'good':
        return tFilter('cond_good');
      case 'fair':
        return tFilter('cond_fair');
      case 'used':
        return tCommon('pre_owned');
      default:
        return condition;
    }
  };

  if (!listings || !Array.isArray(listings)) return null;

  // Limit listings based on variant
  const featuredListings =
    variant === 'vertical' ? listings.slice(0, 4) : listings.slice(0, 15);

  if (featuredListings.length === 0) {
    return null;
  }

  // Vertical (Sidebar) Layout
  if (variant === 'vertical') {
    return (
      <div className='space-y-3 sticky top-24'>
        <div className='flex items-center justify-between px-1 mb-2'>
          <div className='flex items-center gap-2'>
            <div className='relative flex items-center justify-center'>
              <span className='relative flex h-2 w-2 rounded-full bg-primary' />
            </div>
            <h2 className='text-base font-bold tracking-tight uppercase text-foreground/80'>
              {title || tHome('top_boosted')}
            </h2>
          </div>
        </div>

        <div className='flex flex-col lg:gap-4'>
          {featuredListings.map((listing) => {
            const imageUrl =
              listing.thumbnail ||
              (listing.images && listing.images[0]) ||
              '/placeholder-listing.jpg';
            const promoConfig = (listing as any).isPromoted
              ? getPromotionConfig((listing as any).promotionTier)
              : null;
            const bgColor = promoConfig?.bgColor || 'bg-card';
            return (
              <div key={listing._id} className='group relative'>
                <Card
                  className={cn(
                    'p-0 overflow-hidden transition-all duration-200 rounded-lg bg-card shadow-none',
                    promoConfig &&
                      `ring-1 ring-inset ring-primary/10 ${bgColor.replace('bg-', 'bg-')}`,
                  )}
                >
                  {/* Main Link Overlay */}
                  <Link
                    href={`/listings/${listing._id}`}
                    className='absolute inset-0 z-10'
                    aria-label={listing.title}
                  />
                  {/* Image Area */}
                  <div className='relative aspect-[4/3] w-full flex-none block m-0 p-0 overflow-hidden bg-muted rounded-t-lg z-20'>
                    <FeaturedImageCarousel
                      images={listing.images}
                      title={listing.title}
                      href={`/listings/${listing._id}`}
                      aspect='aspect-[4/3]'
                    />

                    {/* Floating Badges */}
                    <div className='absolute top-1.5 left-1.5 z-30 flex flex-col gap-2 pointer-events-none'>
                      {promoConfig && (
                        <div
                          className={cn(
                            'w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20',
                            promoConfig.badgeColor,
                          )}
                        >
                          <PromotionIcon
                            iconName={promoConfig.icon}
                            className='w-3 h-3 text-white fill-current'
                          />
                        </div>
                      )}
                      {listing.isVerified && (
                        <div className='bg-primary text-white rounded-full p-1.5'>
                          <ShieldCheck className='h-4 w-4' />
                        </div>
                      )}
                    </div>

                    {/* Date Badge */}
                    <div
                      className='absolute top-1 right-1 z-30 pointer-events-none'
                      suppressHydrationWarning
                    >
                      <span className='text-[9px] font-bold text-white/80 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-white/10'>
                        {listing.createdAt
                          ? new Date(listing.createdAt).toLocaleDateString(
                              'en-GB',
                              { day: 'numeric', month: 'short' },
                            )
                          : ''}
                      </span>
                    </div>

                    {/* Price Tag Overlay - Bottom Right */}
                    <div className='absolute bottom-2 right-2 z-30 pointer-events-none'>
                      <div className='bg-background/90 backdrop-blur text-foreground px-2 py-1 rounded-lg border border-border/50'>
                        <span className='text-xs font-bold'>
                          {formatCurrency(listing.price, listing.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Heart Button Overlay - Top Right */}
                    <div className='absolute top-1.5 right-1.5 z-30 pointer-events-auto'>
                      <SaveAdButton listingId={listing._id} showText={false} />
                    </div>
                  </div>

                  {/* Simple Content */}
                  <div className='p-3 bg-card flex-1 z-20 relative pointer-events-none'>
                    <h3 className='text-base sm:text-lg font-bold line-clamp-2 leading-snug group-hover:underline decoration-foreground/30 underline-offset-2 transition-all text-foreground mb-2 truncate'>
                      {(listing as any).categoryName && (
                        <span className='block text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-0.5 leading-none'>
                          {(listing as any).categoryName}
                          {(listing as any).subCategoryName && (
                            <span className='lowercase font-normal text-muted-foreground/60 mx-1'>in</span>
                          )}
                          {(listing as any).subCategoryName}
                        </span>
                      )}
                      {listing.title}
                    </h3>

                    <div className='flex items-center gap-1.5 flex-wrap mb-2'>
                      {listing.isVerified && (
                        <div className='bg-primary/10 text-primary rounded-full p-0.5'>
                          <ShieldCheck className='h-3 w-3' />
                        </div>
                      )}
                    </div>

                    <div className='flex items-center justify-between text-muted-foreground mt-auto'>
                      <div className='flex items-center gap-1 text-sm font-medium'>
                        <MapPin className='w-3 h-3 text-primary' />
                        {listing.city ? listing.city.split(' ')[0] : 'Skopje'}
                      </div>
                      <div className='text-xs font-bold text-foreground opacity-90 capitalize'>
                        {tHome('view_deal')} &rarr;
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {listings.length > 4 && (
          <Link
            href='/listings?featured=true'
            className='flex items-center justify-center w-full py-3 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-all shadow-none bm-interactive rounded-lg bg-card mt-2'
          >
            {tHome('see_all_premium')}
          </Link>
        )}
      </div>
    );
  }

  // Horizontal (Default) Layout - Repurposed to look like eBay
  return (
    <div className='w-full overflow-hidden'>
      <div className='container-wide py-3 sm:py-5'>
        <div className='relative group/carousel'>
          <Carousel
            opts={{
              align: 'start',
              dragFree: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-2'>
              {featuredListings.map((listing) => {
                const hasDiscount =
                  listing.previousPrice &&
                  listing.previousPrice > listing.price;
                const discountPercent = hasDiscount
                  ? Math.round(
                      ((listing.previousPrice! - listing.price) /
                        listing.previousPrice!) *
                        100,
                    )
                  : 0;

                return (
                  <CarouselItem
                    key={listing._id}
                    className='basis-[50%] pl-2 sm:basis-[40%] md:basis-[32%] lg:basis-[25%]'
                  >
                    <div className='group relative block h-full bm-interactive rounded-2xl bg-card transition-all duration-200 '>
                      <Link
                        href={`/listings/${listing._id}`}
                        className='absolute inset-0 z-10'
                        aria-label={listing.title}
                      />
                      <div className='relative flex flex-col h-full'>
                        {/* eBay Style Image Card */}
                        <div className='relative aspect-square w-full rounded-t-2xl overflow-hidden bg-muted transition-all duration-200 z-20'>
                          <FeaturedImageCarousel
                            images={listing.images}
                            title={listing.title}
                            href={`/listings/${listing._id}`}
                          />

                          {/* Status Badges Overlays */}
                          <div className='absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-30 pointer-events-none flex flex-col gap-1 sm:gap-2'>
                            {(listing as any).isPromoted && (
                              <div
                                className={cn(
                                  'flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/20 backdrop-blur-md transition-all duration-300',
                                  getPromotionConfig(
                                    (listing as any).promotionTier,
                                  )?.badgeColor || 'bg-foreground',
                                )}
                              >
                                <PromotionIcon
                                  iconName={
                                    getPromotionConfig(
                                      (listing as any).promotionTier,
                                    )?.icon || 'sparkles'
                                  }
                                  className='h-3 w-3 sm:h-4 sm:w-4 dark:text-white dark:fill-white text-white fill-white'
                                />
                              </div>
                            )}
                            {listing.isVerified && (
                              <div className='bg-primary text-white rounded-full p-1 sm:p-1.5 shadow-md'>
                                <ShieldCheck className='h-3 w-3 sm:h-4 sm:w-4' />
                              </div>
                            )}
                          </div>

                          {/* Discount Badge - eBay style */}
                          {hasDiscount && (
                            <div className='absolute bottom-2 left-2 z-30 pointer-events-none'>
                              <div className='bg-[#E53238] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full'>
                                {discountPercent}% OFF
                              </div>
                            </div>
                          )}

                          {/* Date Badge */}
                          <div
                            className='absolute top-1 right-1 z-30 pointer-events-none'
                            suppressHydrationWarning
                          >
                            <span className='text-[9px] font-bold text-white/80 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-white/10'>
                              {listing.createdAt
                                ? new Date(
                                    listing.createdAt,
                                  ).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                  })
                                : ''}
                            </span>
                          </div>
                        </div>

                        {/* eBay Style Content Section */}
                        <div className='flex flex-col flex-1 p-2 z-20 relative pointer-events-none'>
                          <h3 className='text-sm sm:text-base font-bold leading-[1.3] line-clamp-2 text-muted-foreground group-hover:underline decoration-foreground/30 underline-offset-2 transition-all truncate'>
                            {(listing as any).categoryName && (
                              <span className='block text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1 leading-none'>
                                {(listing as any).categoryName}
                                {(listing as any).subCategoryName && (
                                  <span className='lowercase font-normal text-muted-foreground/60 mx-1'>in</span>
                                )}
                                {(listing as any).subCategoryName}
                              </span>
                            )}
                            {listing.title}
                          </h3>

                          <div className='flex items-center gap-1.5 flex-wrap'>
                            {listing.isVerified && (
                              <div className='bg-primary/10 text-primary rounded-full p-0.5'>
                                <ShieldCheck className='h-3 w-3' />
                              </div>
                            )}
                          </div>

                          <div className='mt-auto space-y-0.5'>
                            <div className='flex items-baseline gap-1.5 flex-wrap mb-1'>
                              <span className='text-base sm:text-lg font-bold text-foreground'>
                                {formatCurrency(
                                  listing.price,
                                  listing.currency,
                                )}
                              </span>
                              {hasDiscount && (
                                <span className='text-sm sm:text-base text-muted-foreground line-through opacity-70'>
                                  {formatCurrency(
                                    listing.previousPrice!,
                                    listing.currency,
                                  )}
                                </span>
                              )}
                            </div>

                            <div className='flex items-center justify-between gap-1 text-sm sm:text-base text-muted-foreground font-medium'>
                              <div className='flex items-center gap-1 font-semibold uppercase tracking-tight text-[10px]'>
                                <MapPin className='w-3 h-3 text-primary' />
                                {listing.city
                                  ? listing.city.split(' ')[0]
                                  : 'Skopje'}
                              </div>
                              {/* Heart Button Overlay - Top Right */}
                              <div className='absolute top-1.5 right-1.5 z-30 pointer-events-auto'>
                                <SaveAdButton
                                  listingId={listing._id}
                                  showText={false}
                                />
                              </div>
                            </div>

                            {listing.condition && (
                              <div className='text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-tight mt-1'>
                                {getConditionLabel(listing.condition)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {/* Added arrows */}
            <CarouselPrevious className='hidden md:flex -left-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-background/80 backdrop-blur border-border' />
            <CarouselNext className='hidden md:flex -right-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-background/80 backdrop-blur border-border' />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
