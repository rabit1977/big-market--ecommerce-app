'use client';

import { FilterPanel, FilterState } from '@/components/listing/filter-panel';
import { ListingGrid } from '@/components/listing/listing-grid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ListingRowCarousel } from './listing-row-carousel';

interface ListingsClientProps {
  initialListings: any[];
  categories: Array<{ _id: string; name: string; slug: string }>;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
  template?: any;
  hubData?: {
    all: any[];
    cars: any[];
    realEstate: any[];
    electronics: any[];
    motorVehicles: any[];
    mobilePhones: any[];
    homeAppliances: any[];
    computers: any[];
    diy: any[];
  };
}

export function ListingsClient({
  initialListings,
  categories,
  pagination,
  template,
  hubData
}: ListingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [showHub, setShowHub] = useState(!!hubData);

  // If search params change, and we have filters, we should probably hide hub
  const hasActiveFilters = useMemo(() => {
    return searchParams.has('search') || 
           searchParams.has('category') || 
           searchParams.has('city') || 
           searchParams.has('minPrice') || 
           searchParams.has('maxPrice');
  }, [searchParams]);

  // Sync hub visibility with filters
  useEffect(() => {
    if (hasActiveFilters) setShowHub(false);
    else if (hubData) setShowHub(true);
  }, [hasActiveFilters, hubData]);

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

    if (filters.isVatIncluded) params.set('vat', 'true');
    else params.delete('vat');

    if (filters.isAffordable) params.set('affordable', 'true');
    else params.delete('affordable');

    if (filters.dateRange && filters.dateRange !== 'all') params.set('date', filters.dateRange);
    else params.delete('date');

    // Dynamic Filters
    if (filters.dynamicFilters) params.set('filters', filters.dynamicFilters);
    else params.delete('filters');

    // Listing ID Search
    if (filters.listingNumber) params.set('listingNumber', filters.listingNumber.toString());
    else params.delete('listingNumber');

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
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 relative">
      {/* Mobile Filter Sheet */}
      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
         <SheetContent side="bottom" className="w-full h-[85vh] overflow-y-auto p-0 rounded-t-[2rem]">
            <SheetTitle className="sr-only">Filter Listings</SheetTitle>
            <div className="p-4 pt-8">
               <FilterPanel onFilterChange={handleFilterChange} categories={categories} initialFilters={initialFilters} idPrefix="mobile-filter" template={template} />
            </div>
         </SheetContent>
      </Sheet>

      {/* Mobile Filter Button — inline at top of content, only on mobile */}

      {/* Sidebar Filters (Desktop Only) - Now wider! */}
      <aside className="hidden lg:block lg:sticky lg:top-24 h-fit">
        <FilterPanel onFilterChange={handleFilterChange} categories={categories} initialFilters={initialFilters} idPrefix="desktop-filter" template={template} />
      </aside>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Mobile inline Filters & Sort button */}
        <div className="lg:hidden">
          <Button
            onClick={() => setIsMobileFiltersOpen(true)}
            variant="outline"
            className="w-full h-10 font-bold tracking-tight border border-border bg-background text-foreground hover:bg-muted/50 flex items-center justify-center gap-2 rounded-xl shadow-xs active:scale-95 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters & Sort
          </Button>
        </div>

        {/* Listings Grid or Hub */}
        {showHub && hubData ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <ListingRowCarousel 
                title="Latest Discoveries" 
                listings={hubData.all} 
                viewAllHref="/listings?sort=newest" 
             />
             <ListingRowCarousel 
                title="Cars" 
                listings={hubData.cars} 
                viewAllHref="/listings?category=vehicles" 
             />
             <ListingRowCarousel 
                title="Real Estates" 
                listings={hubData.realEstate} 
                viewAllHref="/listings?category=real-estate" 
             />
             <ListingRowCarousel 
                title="Electronics & PC" 
                listings={hubData.electronics} 
                viewAllHref="/listings?category=electronics" 
             />
             <ListingRowCarousel 
                title="Motor Vehicles" 
                listings={hubData.motorVehicles} 
                viewAllHref="/listings?category=vehicles" 
             />
             <ListingRowCarousel 
                title="Mobile Phones" 
                listings={hubData.mobilePhones} 
                viewAllHref="/listings?category=mobile-phones" 
             />
             <ListingRowCarousel 
                title="Home Appliances" 
                listings={hubData.homeAppliances} 
                viewAllHref="/listings?category=appliances" 
             />
             <ListingRowCarousel 
                title="Computers" 
                listings={hubData.computers} 
                viewAllHref="/listings?category=computers-laptops" 
             />
             <ListingRowCarousel 
                title="Do it Yourself" 
                listings={hubData.diy} 
                viewAllHref="/listings?category=home-garden" 
             />
             
             <div className="pt-8 pb-12 text-center">
                <Button 
                  onClick={() => setShowHub(false)}
                  variant="outline" 
                  className="rounded-full px-8 h-12 font-bold border-2 hover:bg-muted"
                >
                    View All Listings in Grid
                </Button>
             </div>
          </div>
        ) : initialListings.length > 0 ? (
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
