'use client';

import { FilterPanel, FilterState } from '@/components/listing/filter-panel';
import { ListingGrid } from '@/components/listing/listing-grid';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ListingWithRelations } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface LatestListingsClientProps {
  initialListings: ListingWithRelations[];
  categories: any[];
}

export function LatestListingsClient({ initialListings, categories }: LatestListingsClientProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const tHome = useTranslations('Home');
  
  // Apply sorting client-side for "Latest Listings"
  // Apply sorting client-side for "Latest Listings"
  const sortedListings = useMemo(() => {
    if (!initialListings || !Array.isArray(initialListings)) return [];
    
    return [...initialListings].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      // Default to newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [initialListings, sortBy]);

  const handleFilterChange = (filters: FilterState) => {
    // For homepage latest listings, we don't necessarily want to navigate away
    // but the user asked for "it to open on small screen" and show sort/filters.
    // If they apply complex filters (like city), maybe we should redirect them to /listings?
    
    if (filters.city && filters.city !== 'all') {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.city) params.set('city', filters.city);
        if (filters.priceMin) params.set('minPrice', filters.priceMin.toString());
        if (filters.priceMax) params.set('maxPrice', filters.priceMax.toString());
        window.location.href = `/listings?${params.toString()}`;
        return;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className='text-xl md:text-2xl font-black tracking-tight mb-2'>
            {tHome('latest_listings')}
          </h2>
        </div>

        {/* Desktop View All Link */}
        <Link 
          href="/listings" 
          className="group flex items-center justify-center gap-1.5 px-3.5 py-1.5 md:py-2 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-all duration-200 shrink-0 shadow-none"
        >
          <span className="text-xs font-bold uppercase tracking-widest">{tHome('view_all')}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <ListingGrid 
        listings={sortedListings as any} 
        onOpenFilters={() => setIsFiltersOpen(true)}
        showSaveSearch={false} // Don't show save search on home page latest
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetContent side="left" className="w-[85vw] sm:w-[400px] overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{tHome('filter_listings')}</SheetTitle>
          </SheetHeader>
          <div className="p-4 pt-10">
            <FilterPanel 
              onFilterChange={handleFilterChange} 
              categories={categories} 
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile View All Link */}
      <div className="text-center mt-8 md:hidden">
        <Link 
          href="/listings" 
          className="inline-flex items-center bg-secondary hover:bg-secondary/80 text-foreground font-bold transition-all group px-8 py-3 rounded-lg border border-border shadow-none"
        >
          <span className="text-xs uppercase tracking-widest">{tHome('browse_all_listings')}</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
