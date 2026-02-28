'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { api } from '@/convex/_generated/api';
import { useFavorites } from '@/lib/context/favorites-context';
import { cn } from '@/lib/utils';
import { useQuery as useConvexQuery } from 'convex/react';
import { Heart, LayoutGrid, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';


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
  const tHome = useTranslations('');
  const tFilters = useTranslations('QuickFilters');
  const tNav = useTranslations('NavActions');
  
  const { favorites } = useFavorites();
  const favCount = favorites.size;
  
  const users = useConvexQuery(api.users.list) || [];
  const stores = users.filter((u: any) => u.accountType === 'BUSINESS' || u.isVerified || u.role === 'ADMIN').slice(0, 15);
  
  const [filters, setFilters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    QUICK_FILTERS.forEach(f => {
      initial[f.id] = f.defaultChecked;
    });
    return initial;
  });

  const toggleFilter = (id: string) => {
    setFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className=''>
      <div className='container-wide py-3 md:py-4'>

        {/* Navigation & Filters Container */}
        <div className="flex items-center justify-between gap-3 md:gap-4 w-full relative">
          
          {/* Left Side: Navigation Links & Stores Carousel */}
          <div className="flex-1 min-w-0">
            <Carousel opts={{ dragFree: true, align: 'start' }} className="w-full">
              <CarouselContent className="ml-0 p-1 items-center">
                
                {/* Categories Button */}
                <CarouselItem className="basis-auto pl-2 first:pl-0">
                  <Link 
                    href="/categories"
                    className="group flex items-center justify-center gap-1.5 px-3.5 py-1.5 md:py-2 rounded-(--yt-button-border-radius) border border-border bg-card hover:border-primary/50 hover:bg-secondary transition-all duration-150 shrink-0"
                  >
                    <div className="w-5 h-5 rounded-md border border-border bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-150">
                      <LayoutGrid className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] md:text-[12px] font-medium tracking-wide text-foreground uppercase whitespace-nowrap">{tHome('categories')}</span>
                  </Link>
                </CarouselItem>

                {/* Browse All Button */}
                <CarouselItem className="basis-auto pl-2">
                  <Link 
                    href="/listings"
                    className="group flex items-center justify-center gap-1.5 px-3.5 py-1.5 md:py-2 rounded-(--yt-button-border-radius) border border-border bg-card hover:border-primary/50 hover:bg-secondary transition-all duration-150 shrink-0"
                  >
                    <div className="w-5 h-5 rounded-md border border-border bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-150">
                      <List className="w-3 h-3" />
                    </div>  
                    <span className="text-[11px] md:text-[12px] font-medium tracking-wide text-foreground uppercase whitespace-nowrap">{tHome('browse_all') || 'browse all'}</span>
                  </Link>
                </CarouselItem>

                {/* Favorites Button */}
                <CarouselItem className="basis-auto pl-2">
                  <Link 
                    href="/favorites"
                    className="group flex items-center justify-center gap-1.5 px-3.5 py-1.5 md:py-2 rounded-(--yt-button-border-radius) border border-border bg-card hover:border-primary/50 hover:bg-secondary transition-all duration-150 shrink-0"
                  >
                    <div className="relative w-5 h-5 rounded-md border border-border bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-150">
                      <Heart className={cn("w-3 h-3", favCount > 0 && "fill-current")} />
                    </div>
                    <span className="text-[11px] md:text-[12px] font-medium tracking-wide text-foreground uppercase whitespace-nowrap">{tNav('favorites')}</span>
                    {favCount > 0 && (
                      <span className="bg-primary text-white text-[8px] ml-[-6px] mb-[-6px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-md border-2 border-background z-10 transition-transform group-hover:scale-110">
                        {favCount}
                      </span>
                    )}
                  </Link>
                </CarouselItem>

                <div className="mx-2 w-px h-6 bg-border/60 shrink-0 self-center" />

                {/* Storefronts Array */}
                {stores.map(store => (
                  <CarouselItem key={store._id} className="basis-auto pl-2">
                    <Link 
                      href={`/store/${store.externalId}`}
                      className="group flex items-center justify-center gap-1.5 pr-3.5 pl-1.5 py-1.5 md:py-2 rounded-(--yt-button-border-radius) border border-border bg-card hover:border-primary/50 hover:bg-secondary transition-all duration-150 shrink-0"
                    >
                      <UserAvatar user={store as any} className="w-5 h-5 border border-border rounded-md group-hover:border-primary transition-all duration-150" />
                      <span className="text-[11px] md:text-[12px] font-medium tracking-wide text-foreground uppercase whitespace-nowrap">
                        {store.companyName || store.name || 'Store'}
                      </span>
                    </Link>
                  </CarouselItem>
                ))}

                <div className="mx-2 w-px h-6 bg-border/60 shrink-0 self-center" />

                {/* Quick Filters Array */}
                {QUICK_FILTERS.map((filter) => (
                  <CarouselItem key={filter.id} className="basis-auto pl-2">
                    <button
                      type="button"
                      onClick={() => toggleFilter(filter.id)}
                      className={cn(
                        "inline-flex items-center gap-2 px-3.5 py-1.5 md:py-2 rounded-(--yt-button-border-radius) text-[10px] md:text-[11px] font-medium tracking-wide uppercase border transition-all duration-150 active:scale-95 whitespace-nowrap shrink-0",
                        filters[filter.id]
                          ? "bg-primary border-primary text-white"
                          : "bg-card border-border text-foreground hover:bg-secondary hover:border-border"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                        filters[filter.id] 
                          ? "bg-primary text-white border-primary" 
                          : "border-muted-foreground/30 bg-muted/10 group-hover:border-muted-foreground/50"
                      )}>
                        {filters[filter.id] && (
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {tFilters(filter.id)}
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Gradient Fade for right edge (desktop) */}
          <div className="w-20 h-full absolute right-0 pointer-events-none bg-gradient-to-l from-background via-background/80 to-transparent z-10 hidden md:block" />
        </div>
      </div>
    </div>

  );
};
