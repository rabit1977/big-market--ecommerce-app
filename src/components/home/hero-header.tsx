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
  const tHome = useTranslations('Home');
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
    <div className='bg-muted/20 border-b border-border/30'>
      <div className='container-wide py-2'>

        {/* Navigation & Filters Container */}
        <div className="flex items-center justify-between gap-3 md:gap-4 pb-1 w-full relative">
          
          {/* Left Side: Navigation Links & Stores Carousel */}
          <div className="flex-1 min-w-0">
            <Carousel opts={{ dragFree: true, align: 'start' }} className="w-full">
              <CarouselContent className="ml-0 p-1 items-center">
                
                {/* Categories Button */}
                <CarouselItem className="basis-auto pl-2 first:pl-0">
                  <Link 
                    href="/categories"
                    className="group flex items-center justify-center gap-1 px-2.5 py-1 md:py-1.5 rounded-full border border-border bg-background shadow-xs hover:border-muted-foreground/20 hover:bg-muted/50 transition-all duration-300 shrink-0"
                  >
                    <div className="w-4 h-4 rounded-sm border border-border bg-muted/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300 shadow-none">
                      <LayoutGrid className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-foreground uppercase whitespace-nowrap">{'categories'}</span>
                  </Link>
                </CarouselItem>
                {/* Browse All Button */}
                <CarouselItem className="basis-auto pl-2">
                  <Link 
                    href="/listings"
                    className="group flex items-center justify-center gap-1 px-2.5 py-1 md:py-1.5 rounded-full border border-border bg-background shadow-xs hover:border-muted-foreground/20 hover:bg-muted/50 transition-all duration-300 shrink-0"
                  >
                    <div className="w-4 h-4 rounded-sm border border-border bg-muted/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300 shadow-none">
                      <List className="w-2.5 h-2.5" />
                    </div>  
                    <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-foreground uppercase whitespace-nowrap">{'browse all'}</span>
                  </Link>
                </CarouselItem>

                {/* Favorites Button */}
                <CarouselItem className="basis-auto pl-2">
                  <Link 
                    href="/favorites"
                    className="group flex items-center justify-center gap-1 px-2.5 py-1 md:py-1.5 rounded-full border border-border bg-background shadow-xs hover:border-muted-foreground/20 hover:bg-muted/50 transition-all duration-300 shrink-0"
                  >
                    <div className="relative w-4 h-4 rounded-sm border border-border bg-muted/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300 shadow-none">
                      <Heart className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-foreground uppercase whitespace-nowrap">{tNav('favorites')}</span>
                    {favCount > 0 && (
                      <span className="bg-foreground text-background text-[7px] ml-[-4px] mb-[-4px] font-black rounded-full w-3 h-3 flex items-center justify-center shadow-lg border border-background z-10">
                        {favCount}
                      </span>
                    )}
                  </Link>
                </CarouselItem>
                    {/* Storefronts Array */}
                {stores.map(store => (
                  <CarouselItem key={store._id} className="basis-auto pl-2">
                    <Link 
                      href={`/store/${store.externalId}`}
                      className="group flex items-center justify-center gap-1 pr-2.5 pl-1 py-1 md:py-1.5 rounded-full border border-border bg-background shadow-xs hover:border-muted-foreground/20 hover:bg-muted/50 transition-all duration-300 shrink-0"
                    >
                      <UserAvatar user={store as any} className="w-4 h-4 border border-border rounded-sm shadow-sm text-[6px] group-hover:border-foreground transition-all duration-300" />
                      <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-foreground border-foreground uppercase whitespace-nowrap">
                        {store.companyName || store.name || 'Store'}
                      </span>
                    </Link>
                  </CarouselItem>
                ))}

                {/* Quick Filters Array */}
                {QUICK_FILTERS.map((filter) => (
                  <CarouselItem key={filter.id} className="basis-auto pl-2">
                    <button
                      type="button"
                      onClick={() => toggleFilter(filter.id)}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0",
                        filters[filter.id]
                          ? "bg-background text-foreground "
                          : "bg-background border-border text-foreground hover:bg-muted/50 hover:border-muted-foreground/30"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-sm border flex items-center justify-center transition-all shrink-0",
                        filters[filter.id] 
                          ? "bg-foreground text-background border-foreground" 
                          : "border-muted-foreground/40 bg-transparent group-hover:border-muted-foreground/60"
                      )}>
                        {filters[filter.id] && (
                          <svg className="w-2.5 h-2.5 text-background" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          <div className="w-12 h-full absolute right-0 pointer-events-none bg-gradient-to-l from-background to-transparent z-10 hidden md:block" />
        </div>
      </div>
    </div>
  );
};
