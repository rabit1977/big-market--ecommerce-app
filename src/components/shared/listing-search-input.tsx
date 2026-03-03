'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useConvex } from 'convex/react';
import { Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ListingSearchInputProps {
  idPrefix?: string;
  initialValue?: string;
  className?: string;
}

export function ListingSearchInput({ 
  idPrefix = 'search', 
  initialValue = '', 
  className 
}: ListingSearchInputProps) {
  const router = useRouter();
  const convex = useConvex();
  const [isPending, setIsPending] = useState(false);
  const [value, setValue] = useState(initialValue);

  // Sync state if prop changes (External control)
 useEffect(() => {
  if (initialValue !== value) setValue(initialValue);
}, [initialValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation: ensure it's a number
    const listingId = parseInt(value);
    if (!listingId || isNaN(listingId)) {
      toast.error("Please enter a valid numeric listing ID.");
      return;
    }

    setIsPending(true);
    try {
      // Direct lookup from client
      const directListing = await convex.query(api.listings.getByListingNumber, { 
        listingNumber: listingId 
      });

      if (directListing) {
        router.push(`/listings/${directListing._id}`);
      } else {
        // Fallback to the listings page which shows "Not Found" state
        toast.info(`Listing ID #${listingId} not found.`);
        router.push(`/listings?listingNumber=${listingId}`, { scroll: false });
      }
    } catch (error) {
      console.error("Lookup error:", error);
      toast.error("An error occurred while searching for the listing.");
      router.push(`/listings?listingNumber=${listingId}`, { scroll: false });
    } finally {
      setIsPending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setValue(val);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("relative flex items-center gap-1", className)}
    >
      <div className="relative flex-1">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium pointer-events-none">
          #
        </span>
        <Input
          id={`${idPrefix}-listingNumber`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="ID"
          className="h-9 text-xs pl-6 pr-2 bg-input focus:bg-input transition-colors rounded-lg shadow-none font-bold uppercase tracking-widest bm-interactive"
          value={value}
          onChange={handleInputChange}
          disabled={isPending}
        />
      </div>
      
      <Button 
        type="submit"
        size="icon" 
        variant="ghost" 
        disabled={!value || isPending}
        className="h-9 w-9 text-muted-foreground hover:text-primary shrink-0 bm-interactive"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span className="sr-only">Search Listing</span>
      </Button>
    </form>
  );
}