'use client';

import { FilterPanel, FilterState } from '@/components/listing/filter-panel';
import { ListingGrid } from '@/components/listing/listing-grid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

interface ListingsClientProps {
  initialListings: any[];
  categories: Array<{ _id: string; name: string; slug: string }>;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
  template?: any;
}

export function ListingsClient({
  initialListings,
  categories,
  pagination,
  template
}: ListingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Removed stale state: filteredListings
  
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
    hasShipping: searchParams.get('shipping') === 'true',
    isVatIncluded: searchParams.get('vat') === 'true',
    isAffordable: searchParams.get('affordable') === 'true',
    dateRange: searchParams.get('date') || undefined,
    dynamicFilters: searchParams.get('filters') || undefined,
  }), [searchParams]);

  const handleFilterChange = (filters: FilterState) => {
    // Build URL search params
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
    
    // New Professional Filters
    if (filters.userType) params.set('userType', filters.userType);
    else params.delete('userType');

    if (filters.adType) params.set('adType', filters.adType);
    else params.delete('adType');

    if (filters.isTradePossible) params.set('trade', 'true');
    else params.delete('trade');

    if (filters.hasShipping) params.set('shipping', 'true');
    else params.delete('shipping');

    if (filters.isVatIncluded) params.set('vat', 'true');
    else params.delete('vat');

    if (filters.isAffordable) params.set('affordable', 'true');
    else params.delete('affordable');

    if (filters.dateRange && filters.dateRange !== 'all') params.set('date', filters.dateRange);
    else params.delete('date');

    // Dynamic Filters
    if (filters.dynamicFilters) params.set('filters', filters.dynamicFilters);
    else params.delete('filters');

    // Reset pagination
    params.delete('page');

    // Navigate with new params
    router.push(`/listings?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/listings?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Mobile Filter Sheet */}
      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
         <SheetContent side="left" className="w-full sm:w-[450px] overflow-y-auto p-0">
            <div className="p-4 pt-12">
               <FilterPanel onFilterChange={handleFilterChange} categories={categories} initialFilters={initialFilters} idPrefix="mobile-filter" template={template} />
            </div>
         </SheetContent>
      </Sheet>

      {/* Sidebar Filters (Desktop Only) - Now wider! */}
      <aside className="hidden lg:block lg:sticky lg:top-24 h-fit">
        <FilterPanel onFilterChange={handleFilterChange} categories={categories} initialFilters={initialFilters} idPrefix="desktop-filter" template={template} />
      </aside>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Listings Grid - passes handler to open mobile filters */}
        {initialListings.length > 0 ? (
          <ListingGrid 
             listings={initialListings as any} 
             onOpenFilters={() => setIsMobileFiltersOpen(true)}
             sortBy={initialFilters.sortBy}
             onSortChange={(val) => handleFilterChange({ ...initialFilters, sortBy: val })}
             onQuickFilter={(extraFilters) => handleFilterChange({ ...initialFilters, ...extraFilters })}
          />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No listings found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, current, and pages around current
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.page) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis
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
                        className="w-10"
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
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
