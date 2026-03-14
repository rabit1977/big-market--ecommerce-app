'use client';

import { FilterPanel, FilterState } from '@/components/listing/filter-panel';
import { ListingGrid } from '@/components/listing/listing-grid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

interface ListingsClientProps {
  initialListings: any[];
  categories: Array<{ _id: string; name: string; slug: string }>;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
  template?: any;
  hubData?: any;
}

export function ListingsClient({
  initialListings,
  categories,
  pagination,
  template,
}: ListingsClientProps) {
  const t = useTranslations('Listings');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isPending, startTransition] = useTransition();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Derive initial filters from URL params
  const initialFilters = useMemo<FilterState>(() => ({
    category: searchParams.get('category') || 'all',
    subCategory: searchParams.get('subCategory') || 'all',
    city: searchParams.get('city') || 'all',
    priceMin: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
    priceMax: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 1000000,
    condition: searchParams.get('condition') || 'all',
    sortBy: searchParams.get('sort') || 'newest',
    userType: searchParams.get('userType') || undefined,
    adType: searchParams.get('adType') || undefined,
    isTradePossible: searchParams.get('trade') === 'true',
    isVatIncluded: searchParams.get('vat') === 'true',
    isAffordable: searchParams.get('affordable') === 'true',
    dateRange: searchParams.get('date') || undefined,
    dynamicFilters: searchParams.get('filters') || undefined,
  }), [searchParams]);

  const handleFilterChange = (filters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    else params.delete('category');

    if (filters.subCategory && filters.subCategory !== 'all') params.set('subCategory', filters.subCategory);
    else params.delete('subCategory');
    
    if (filters.city && filters.city !== 'all') params.set('city', filters.city);
    else params.delete('city');
    
    if (filters.priceMin !== undefined && filters.priceMin > 0) params.set('minPrice', filters.priceMin.toString());
    else params.delete('minPrice');
    
    if (filters.priceMax !== undefined && filters.priceMax < 1000000) params.set('maxPrice', filters.priceMax.toString());
    else params.delete('maxPrice');
    
    if (filters.condition && filters.condition !== 'all') params.set('condition', filters.condition);
    else params.delete('condition');
    
    if (filters.sortBy) params.set('sort', filters.sortBy);
    
    if (filters.userType) params.set('userType', filters.userType);
    else params.delete('userType');

    if (filters.adType) params.set('adType', filters.adType);
    else params.delete('adType');

    if (filters.isTradePossible) params.set('trade', 'true');
    else params.delete('trade');

    if (filters.isVatIncluded) params.set('vat', 'true');
    else params.delete('vat');

    if (filters.isAffordable) params.set('affordable', 'true');
    else params.delete('affordable');

    if (filters.dateRange && filters.dateRange !== 'all') params.set('date', filters.dateRange);
    else params.delete('date');

    if (filters.dynamicFilters) params.set('filters', filters.dynamicFilters);
    else params.delete('filters');

    if (filters.listingNumber) params.set('listingNumber', filters.listingNumber.toString());
    else params.delete('listingNumber');

    params.delete('page');

    startTransition(() => {
      router.push(`/listings?${params.toString()}`, { scroll: false });
    });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    startTransition(() => {
      router.push(`/listings?${params.toString()}`);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-background dark:bg-background grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 relative">
      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
         <SheetContent side="bottom" className="w-full h-[85vh] overflow-y-auto p-0 rounded-t-lg border-t border-border">
            <SheetTitle className="sr-only">Filter Listings</SheetTitle>
            <div className="p-4 pt-8">
               <FilterPanel onFilterChange={handleFilterChange} categories={categories} initialFilters={initialFilters} idPrefix="mobile-filter" template={template} />
            </div>
         </SheetContent>
      </Sheet>

      <aside className="hidden lg:block lg:sticky lg:top-24 h-fit">
        <FilterPanel onFilterChange={handleFilterChange} categories={categories} initialFilters={initialFilters} idPrefix="desktop-filter" template={template} />
      </aside>

      <div className={cn("min-h-[800px] transition-opacity duration-300", isPending && "opacity-60 pointer-events-none")}>
        {/* Mobile top bar — simplified to just filters button */}
        <div className="lg:hidden flex items-center w-full gap-2 mb-4">
          <Button
            onClick={() => setIsMobileFiltersOpen(true)}
            variant="outline"
            className="flex-1 h-10 border border-border text-foreground hover:bg-secondary flex items-center justify-center gap-2 rounded-lg active:scale-95 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-bold">{t('filters_sort')}</span>
          </Button>
        </div>

        {initialListings.length > 0 ? (
          <div className="relative">
            <ListingGrid 
               listings={initialListings as any} 
               sortBy={initialFilters.sortBy}
               onSortChange={(val) => handleFilterChange({ ...initialFilters, sortBy: val })}
               onQuickFilter={(extraFilters) => handleFilterChange({ ...initialFilters, ...extraFilters })}
               onOpenFilters={() => setIsMobileFiltersOpen(true)}
            />
          </div>
        ) : (
          <div className="text-center py-20 bg-background rounded-lg border-2 border-dashed border-border/40">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">{t('no_listings_found')}</h2>
            <p className="text-muted-foreground mb-8">
              {t('try_adjusting')}
            </p>
            <Button onClick={() => window.location.href = '/listings'} variant="outline" className="rounded-lg font-medium border border-border">
               {t('clear_all_filters')}
            </Button>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="rounded-lg border border-border font-medium"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('previous')}
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.page) <= 1
                  );
                })
                .map((page, index, array) => {
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsis && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={page === pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10 rounded-lg border border-border font-medium"
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="rounded-lg border border-border font-medium"
            >
              {t('next')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
