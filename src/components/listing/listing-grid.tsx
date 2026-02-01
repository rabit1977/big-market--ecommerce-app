import { ListingWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
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

const sortLabels: Record<string, string> = {
  'newest': 'Newest',
  'oldest': 'Oldest',
  'price-low': 'Cheapest',
  'price-high': 'Premium',
  'popular': 'Most Popular'
};

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
  const [isPending, startTransition] = useTransition();
  
  // Fetch user favorites to sync "Like" state
  const favorites = useQuery(api.favorites.get, session?.user?.id ? { userId: session.user.id } : "skip");
  const favoriteIds = new Set(favorites?.map((f: any) => f.listingId) || []);
  
  const saveSearchMutation = useMutation(api.searches.saveSearch);

  // ... (handleSaveSearch logic)

  // ... (if listings.length === 0 logic)

  return (
    <div className={className}>
      {/* ... (Mobile Toolbar) ... */}
      
      {/* ... (Desktop Toolbar) ... */}

      <div className={cn(
        "grid gap-4 sm:gap-6",
        viewMode === 'grid' 
          ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      )}>
        {listings.map((listing) => (
          <ListingCard 
            key={listing._id} 
            listing={listing} 
            viewMode={viewMode} 
            initialIsWished={favoriteIds.has(listing._id) || (listing.id ? favoriteIds.has(listing.id) : false)}
          />
        ))}
      </div>
    </div>
  );
}
