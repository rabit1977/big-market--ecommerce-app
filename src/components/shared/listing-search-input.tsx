'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

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
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(initialValue);

  // Sync state if prop changes (External control)
 useEffect(() => {
  if (initialValue !== value) setValue(initialValue);
}, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation: ensure it's a number
    const listingId = parseInt(value);
    if (!listingId || isNaN(listingId)) return;

    // React 19 / Next.js 15: Wrap navigation in transition
    startTransition(() => {
      router.push(`/listings?listingNumber=${listingId}`);
    });
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
          className="h-9 text-xs pl-6 pr-2 bg-input border-border focus:bg-input transition-colors rounded-lg shadow-none font-bold uppercase tracking-widest"
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
        className="h-9 w-9 text-muted-foreground hover:text-primary shrink-0"
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