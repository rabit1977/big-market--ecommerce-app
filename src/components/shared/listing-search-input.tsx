'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ListingSearchInputProps {
  idPrefix?: string;
  initialValue?: string;
  className?: string;
}

export function ListingSearchInput({ idPrefix = 'search', initialValue = '', className }: ListingSearchInputProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(initialValue);

  // Sync internal state if initialValue changes
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    const val = searchValue ? parseInt(searchValue) : undefined;
    if (val) {
      router.push(`/listings?listingNumber=${val}`);
    }
  };

  return (
    <div className={`relative flex items-center gap-1 ${className}`}>
      <div className="relative flex-1">
        <span className="absolute left-2 top-1.5 text-muted-foreground text-xs">#</span>
        <Input
          id={`${idPrefix}-listingNumber`}
          type="number"
          placeholder="Enter Item #"
          className="h-8 text-xs pl-5"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </div>
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-8 w-8 text-muted-foreground hover:text-primary"
        onClick={handleSearch}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
