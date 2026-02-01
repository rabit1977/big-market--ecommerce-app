import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListingWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import {
  Bookmark,
  Box,
  ChevronDown,
  CreditCard,
  LayoutGrid,
  List,
  Package,
  PlusCircle,
  RefreshCcw,
  Save,
  ShoppingBag,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
  Star,
  Store,
  User,
  Zap
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { Button } from '../ui/button';
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
  
  const saveSearchMutation = useMutation(api.searches.saveSearch);

  const handleSaveSearch = async () => {
    if (!session?.user?.id) {
       toast.error("Please sign in to save searches");
       return;
    }

    const query = searchParams.get('q') || searchParams.get('category') || 'All Listings';
    const url = `${pathname}?${searchParams.toString()}`;

    startTransition(async () => {
       try {
          await saveSearchMutation({
             userId: session.user.id!,
             query: query,
             url: url,
             name: query
          });
          toast.success("Searches saved to favorites");
       } catch (err) {
          toast.error("Failed to save search");
       }
    });
  };

  if (listings.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
            <h3 className="text-xl font-semibold text-muted-foreground">No listings found</h3>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
        </div>
    );
  }

  return (
    <div className={className}>
      {/* Mobile Professional Toolbar Strip */}
      <div className="md:hidden sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-4 pb-2 pt-2 px-1">
         <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            {/* View & Search Group */}
            <div className="flex items-center gap-0.5 min-w-fit">
               <Button variant="ghost" size="icon" className="h-9 w-9" asChild title="Saved Searches">
                  <Link href="/favorites?tab=searches">
                     <Bookmark className="w-5 h-5 text-muted-foreground/80" />
                  </Link>
               </Button>

               {showSaveSearch && (
                  <Button 
                    variant="ghost" size="icon" className="h-9 w-9" 
                    onClick={handleSaveSearch}
                    disabled={isPending}
                  >
                     <Save className={cn("w-5 h-5 text-muted-foreground/80", isPending && "animate-pulse")} />
                  </Button>
               )}
               
               <Button 
                 variant="ghost" size="icon" className="h-9 w-9"
                 onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
               >
                  {viewMode === 'list' ? <LayoutGrid className="w-5 h-5 text-muted-foreground/80" /> : <List className="w-5 h-5 text-muted-foreground/80" />}
               </Button>
            </div>
            
            {/* Industry Ready Dropdown Actions */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline"
                            size="default" 
                            className="bg-blue-600 border-none text-white hover:bg-blue-700 rounded-full pl-5 pr-4 h-10 font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                        >
                           {sortLabels[sortBy] || 'Browse'}
                           <ChevronDown className="w-4 h-4 opacity-90" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-2xl border-border/50 p-2 overflow-y-auto max-h-[80vh]">
                        {/* 1. Sorting */}
                        <DropdownMenuLabel className="text-[10px] px-3 py-1.5 uppercase tracking-widest text-muted-foreground opacity-60">Sort & Speed</DropdownMenuLabel>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onSortChange?.('newest')}>
                            <Zap className="w-4 h-4 mr-3 text-amber-500" /> Recently Added
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onSortChange?.('price-low')}>
                            <SortAsc className="w-4 h-4 mr-3 text-emerald-500" /> Price: Low to High
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onSortChange?.('price-high')}>
                            <SortDesc className="w-4 h-4 mr-3 text-primary" /> Price: High to Low
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />

                        {/* 2. Professional Types */}
                        <DropdownMenuLabel className="text-[10px] px-3 py-1.5 uppercase tracking-widest text-muted-foreground opacity-60">Seller Type</DropdownMenuLabel>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onQuickFilter?.({ userType: 'COMPANY' })}>
                            <Store className="w-4 h-4 mr-3 text-blue-500" /> Enterprises
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onQuickFilter?.({ userType: 'PRIVATE' })}>
                            <User className="w-4 h-4 mr-3 text-orange-500" /> Individuals
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />

                        {/* 3. Ad Context */}
                        <DropdownMenuLabel className="text-[10px] px-3 py-1.5 uppercase tracking-widest text-muted-foreground opacity-60">Listing Intent</DropdownMenuLabel>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onQuickFilter?.({ adType: 'SALE' })}>
                            <ShoppingBag className="w-4 h-4 mr-3 text-primary" /> For Sale
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onQuickFilter?.({ adType: 'BUYING' })}>
                            <PlusCircle className="w-4 h-4 mr-3 text-primary" /> Wanted Items
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />

                        {/* 4. Quality & Options */}
                        <DropdownMenuLabel className="text-[10px] px-3 py-1.5 uppercase tracking-widest text-muted-foreground opacity-60">Market Features</DropdownMenuLabel>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onQuickFilter?.({ isAffordable: true })}>
                            <Star className="w-4 h-4 mr-3 text-amber-400" /> Best Deals
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onQuickFilter?.({ condition: 'NEW' })}>
                            <Package className="w-4 h-4 mr-3 text-sky-500" /> Brand New
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onQuickFilter?.({ isTradePossible: true })}>
                            <RefreshCcw className="w-4 h-4 mr-3 text-indigo-500" /> Exchanges Welcome
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onQuickFilter?.({ hasShipping: true })}>
                            <Box className="w-4 h-4 mr-3 text-slate-500" /> Cargo Shipping
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-semibold rounded-xl px-3 py-2.5" onClick={() => onQuickFilter?.({ isVatIncluded: true })}>
                            <CreditCard className="w-4 h-4 mr-3 text-slate-700" /> VAT Included
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem className="font-bold text-blue-600 rounded-xl px-3 py-3 bg-blue-50 focus:bg-blue-100" onClick={onOpenFilters}>
                            <SlidersHorizontal className="w-4 h-4 mr-3" /> More Filters & Places
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
         </div>
      </div>

      {/* Desktop Toolbar */}
      <div className="hidden md:flex justify-between items-center mb-6 px-1">
         <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground font-semibold">
               {listings.length} Results found
            </p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/40 p-1.5 rounded-xl border border-border/50 backdrop-blur-sm">
                <Button 
                   variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                   size="icon" 
                   className={cn("h-8 w-8 rounded-lg", viewMode === 'list' && "shadow-sm border")}
                   onClick={() => setViewMode('list')}
                >
                   <List className="h-4 w-4" />
                </Button>
                <Button 
                   variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                   size="icon" 
                   className={cn("h-8 w-8 rounded-lg", viewMode === 'grid' && "shadow-sm border")}
                   onClick={() => setViewMode('grid')}
                >
                   <LayoutGrid className="h-4 w-4" />
                </Button>
            </div>
         </div>
      </div>

      <div className={cn(
        "grid gap-4 sm:gap-6",
        viewMode === 'grid' 
          ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      )}>
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
