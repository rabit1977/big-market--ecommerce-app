'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function MyListingsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const debouncedSearch = useDebouncedCallback((term: string) => {
    router.push(`?${createQueryString('q', term)}`);
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <div className="relative w-full sm:w-[300px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={handleChange}
        placeholder="SEARCH YOUR LISTINGS..."
        className="pl-9 h-10 rounded-lg bg-input border-border font-bold text-[10px] sm:text-xs tracking-widest uppercase shadow-none focus-visible:ring-primary/20"
      />
    </div>
  );
}
