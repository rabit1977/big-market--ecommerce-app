'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { User, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// Filter definitions with Macedonian labels
const QUICK_FILTERS = [
  { id: 'new', defaultChecked: true },
  { id: 'used', defaultChecked: true },
  { id: 'trade', defaultChecked: true },
  { id: 'forSale', defaultChecked: true },
  { id: 'wanted', defaultChecked: true },
  { id: 'forRent', defaultChecked: false },
  { id: 'rentWanted', defaultChecked: false },
];

export const HeroHeader = () => {
  const tFilters = useTranslations('QuickFilters');
  const tNav = useTranslations('NavActions');

  return (
    <div className=''>
      <div className='container-wide py-2 sm:py-3.5'>
        {/* Navigation & Filters Container */}
        <div className='flex items-center justify-between gap-3 md:gap-4 w-full relative'>
          {/* Left Side: Navigation Links & Stores Carousel */}
          <div className='flex-1 min-w-0'>
            <Carousel
              opts={{ dragFree: true, align: 'start' }}
              className='w-full'
            >
              <CarouselContent className='ml-0 p-1 items-center'>
                {/* My Listings Button */}
                <CarouselItem className='basis-auto pl-1 sm:pl-2 first:pl-0'>
                  <Link
                    href='/my-listings'
                    className='group flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bm-interactive transition-all duration-200 shrink-0 shadow-none'
                  >
                    <div className='w-5 h-5 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-200'>
                      <User className='w-3 h-3' />
                    </div>
                    <span className='text-[10px] md:text-[11px] font-bold tracking-widest text-foreground uppercase whitespace-nowrap'>
                      {tNav('my_listings')}
                    </span>
                  </Link>
                </CarouselItem>

                {/* All Stores (Prodavnici) Button */}
                <CarouselItem className='basis-auto pl-1 sm:pl-2'>
                  <Link
                    href='/store'
                    className='group flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bm-interactive transition-all duration-200 shrink-0 shadow-none'
                  >
                    <div className='w-5 h-5 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-200'>
                      <Users className='w-3 h-3' />
                    </div>
                    <span className='text-[10px] md:text-[11px] font-bold tracking-widest text-foreground uppercase whitespace-nowrap'>
                      {tNav('sellers')}
                    </span>
                  </Link>
                </CarouselItem>

                <div className='mx-2 w-px h-6 bg-border/60 shrink-0 self-center' />

                {/* Quick Filters Array */}
                {QUICK_FILTERS.map((filter) => {
                  let href = '/listings';
                  if (filter.id === 'new') href = '/listings?condition=new';
                  else if (filter.id === 'used')
                    href = '/listings?condition=used';
                  else if (filter.id === 'trade') href = '/listings?trade=true';
                  else if (filter.id === 'forSale')
                    href = '/listings?adType=sell';
                  else if (filter.id === 'wanted')
                    href = '/listings?adType=buy';
                  else if (filter.id === 'forRent')
                    href = '/listings?adType=rent';
                  else if (filter.id === 'rentWanted')
                    href = '/listings?adType=rent-wanted';

                  return (
                    <CarouselItem
                      key={filter.id}
                      className='basis-auto pl-1 sm:pl-2'
                    >
                      <Link
                        href={href}
                        className='inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] md:text-[11px] font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0 shadow-none bm-interactive text-foreground hover:bg-primary hover:text-white'
                      >
                        {tFilters(filter.id)}
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Gradient Fade for right edge (desktop) */}
          <div className='w-20 h-full absolute right-0 pointer-events-none bg-gradient-to-l from-background via-background/80 to-transparent z-10 hidden md:block' />
        </div>
      </div>
    </div>
  );
};
