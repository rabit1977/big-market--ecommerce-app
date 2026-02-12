'use client';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ListingWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { ArrowUpDown, LayoutGrid, List, Save, SlidersHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { ListingCard } from './listing-card';

interface ListingGridProps {
  listings: ListingWithRelations[];
  className?: string;
  onOpenFilters?: () => void;
  showSaveSearch?: boolean;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  onQuickFilter?: (filters: any) => void;
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export function ListingGrid({ 
  listings, 
  className, 
  onOpenFilters, 
  showSaveSearch = true,
  sortBy = 'newest',
  onSortChange,
  onQuickFilter
}: ListingGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Fetch user favorites to sync "Like" state
  const favorites = useQuery(api.favorites.get, session?.user?.id ? { userId: session.user.id } : "skip");
  const favoriteIds = new Set(favorites?.map((f: any) => f.listingId) || []);
  
  const saveSearchMutation = useMutation(api.searches.saveSearch);

  const handleSaveSearch = async () => {
    if (!session?.user?.id) {
      toast.error('Please login to save searches');
      return;
    }

    const query = searchParams.get('search') || '';
    const filters = Object.fromEntries(searchParams.entries());
    
    // Remove nextjs params
    delete filters.search;
    delete filters.sort;
    delete filters.page;
    delete filters.filters; // remove dynamic filter string if exists as separate param

    const promise = saveSearchMutation({
      userId: session.user.id,
      name: query || 'Saved Search',
      query,
      url: `${pathname}?${searchParams.toString()}`,
      filters: JSON.stringify(filters),
      isEmailAlert: true,
      frequency: 'daily'
    });

    toast.promise(promise, {
      loading: 'Saving search...',
      success: 'Search saved successfully!',
      error: 'Failed to save search'
    });
  };

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        {/* Mobile: Filter Button (Visible only on small screens) */}
        <div className="lg:hidden w-full">
           <Button 
             variant="outline" 
             className="w-full flex items-center justify-center gap-2 h-10 border-dashed"
             onClick={onOpenFilters}
           >
             <SlidersHorizontal className="h-4 w-4" />
             Filters & Sort
           </Button>
        </div>

        {/* Results Count (Desktop) */}
        <div className="hidden md:block text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{listings.length}</span> results
        </div>

        {/* Desktop Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
           {/* Sort Dropdown */}
           {mounted ? (
             <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="h-9 w-full sm:w-[180px] text-xs">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Sort option" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-xs">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
           ) : (
             <div className="h-9 w-full sm:w-[180px] bg-muted animate-pulse rounded-md" />
           )}
            {/* Save Search (Desktop) */}
            {showSaveSearch && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={handleSaveSearch}
              >
                <Save className="h-4 w-4" />
              </Button>
            )}

          {/* View Mode Toggles (Desktop only usually, but good to have) */}
          <div className="flex items-center border rounded-md p-1 h-9">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-7 w-7 rounded-sm", viewMode === 'grid' && "bg-muted shadow-sm")}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-7 w-7 rounded-sm", viewMode === 'list' && "bg-muted shadow-sm")}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

        </div>
      </div>
      
      {/* Listings Grid */}
      {listings.length === 0 ? (
         <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <div className="bg-muted/50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No listings found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
              Try adjusting your filters or search criteria to find what you're looking for.
            </p>
            {onQuickFilter && (
                <Button variant="outline" onClick={() => onQuickFilter({ category: 'all', subCategory: 'all', minPrice: undefined, maxPrice: undefined })}>
                Clear Filters
                </Button>
            )}
         </div>
      ) : (
        <div className={cn(
          "grid gap-4",
          viewMode === 'grid' 
            ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        )}>
          {listings.map((listing) => (
            <ListingCard 
              key={listing._id} 
              listing={listing} 
              viewMode={viewMode} 
              initialIsWished={favoriteIds.has(listing._id) || (typeof listing.id === 'string' && favoriteIds.has(listing.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
