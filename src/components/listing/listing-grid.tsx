'use client';

import { ListingCard } from './listing-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import { ListingWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { ArrowUpDown, LayoutGrid, List, RectangleVertical, Save, SlidersHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { memo, useState, useTransition } from 'react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'list' | 'card';

interface FilterState {
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  [key: string]: any;
}

interface ListingGridProps {
  listings: ListingWithRelations[];
  className?: string;
  onOpenFilters?: () => void;
  showSaveSearch?: boolean;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  onQuickFilter?: (filters: FilterState) => void;
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'oldest',     label: 'Oldest First' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular',    label: 'Most Popular' },
];

const VIEW_MODES: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
  { mode: 'grid', icon: LayoutGrid,       label: 'Grid View' },
  { mode: 'list', icon: List,             label: 'List View' },
  { mode: 'card', icon: RectangleVertical, label: 'Detail View' },
];

const VIEW_MODE_KEY = 'listing-view-mode';

// ─── Component ────────────────────────────────────────────────────────────────

export function ListingGrid({
  listings,
  className,
  onOpenFilters,
  showSaveSearch = true,
  sortBy = 'newest',
  onSortChange,
  onQuickFilter,
}: ListingGridProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Lazy initialiser reads localStorage once — no mounted state, no flash
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'list';
    return (localStorage.getItem(VIEW_MODE_KEY) as ViewMode) || 'list';
  });

  const saveSearchMutation = useMutation(api.searches.saveSearch);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  const handleSortChange = (value: string) => {
    if (onSortChange) startTransition(() => onSortChange(value));
  };

  const handleSaveSearch = async () => {
    if (!session?.user?.id) {
      toast.error('Please login to save searches');
      return;
    }

    const query = searchParams.get('search') || '';
    const filters = Object.fromEntries(searchParams.entries());
    ['search', 'sort', 'page', 'filters'].forEach((key) => delete filters[key]);

    toast.promise(
      saveSearchMutation({
        userId: session.user.id,
        name: query || 'Saved Search',
        query,
        url: `${pathname}?${searchParams.toString()}`,
        filters: JSON.stringify(filters),
        isEmailAlert: true,
        frequency: 'daily',
      }),
      {
        loading: 'Saving search...',
        success: 'Search saved successfully!',
        error: 'Failed to save search',
      }
    );
  };

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-10"
            onClick={onOpenFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters & Sort
          </Button>
        </div>

        {/* Results Count */}
        <div className="hidden md:block text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{listings.length}</span> results
        </div>

        {/* Desktop Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Select value={sortBy} onValueChange={handleSortChange} disabled={isPending}>
            <SelectTrigger className="h-9 w-full sm:w-[180px] text-xs">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Sort option" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showSaveSearch && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0"
              aria-label="Save this search"
              onClick={handleSaveSearch}
            >
              <Save className="h-4 w-4" />
            </Button>
          )}

          <div className="flex items-center border rounded-md p-1 h-9 bg-background shrink-0" role="group" aria-label="View mode">
            {VIEW_MODES.map(({ mode, icon, label }) => (
              <ViewToggle
                key={mode}
                active={viewMode === mode}
                onClick={() => handleViewChange(mode)}
                icon={icon}
                label={label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Listings */}
      {listings.length === 0 ? (
        <EmptyState onClear={() => onQuickFilter?.({ category: 'all', subCategory: 'all' })} />
      ) : (
        <div className={cn(
          'grid gap-4',
          viewMode === 'grid' && 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          viewMode === 'list' && 'grid-cols-1',
          viewMode === 'card' && 'grid-cols-1 max-w-2xl mx-auto',
        )}>
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ViewToggle = memo(function ViewToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={active}
      className={cn('h-7 w-7 rounded-sm transition-all', active && 'bg-muted shadow-sm text-foreground')}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
});

function EmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/5">
      <div className="bg-background border rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No listings found</h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
        We couldn't find any results matching your filters. Try adjusting your search criteria.
      </p>
      {onClear && (
        <Button variant="outline" onClick={onClear}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
}