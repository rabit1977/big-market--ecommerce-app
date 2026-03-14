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
import { ListingCard } from '@/components/shared/listing/listing-card';
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
            className='relative w-full h-full flex-shrink-0 snap-center overflow-hidden'
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

        <div className='flex flex-col gap-10'>
          {featuredListings.map((listing) => (
            <div key={listing._id} className='group relative'>
              <ListingCard 
                listing={listing as any} 
                viewMode="grid"
              />
            </div>
          ))}
        </div>

        {/* Note: 'See all' link removed to avoid redundancy with navbar links on large screens */}
      </div>
    );
  }

  // Horizontal (Default) Layout - Repurposed to look like eBay
  return (
    <div className='w-full overflow-hidden'>
      <div className='container-wide py-2 sm:py-3.5'>
        <div className='relative group/carousel'>
          <Carousel
            opts={{
              align: 'start',
              dragFree: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-2.5 sm:-ml-4 md:-ml-6'>
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
                    className='basis-[52%] pl-2 sm:basis-[40%] sm:pl-3 md:basis-[30%] md:pl-4 lg:basis-[23%] xl:basis-[16.6%]'
                  >
                    <div className='h-full'>
                      <ListingCard 
                        listing={listing as any} 
                        viewMode="grid"
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
