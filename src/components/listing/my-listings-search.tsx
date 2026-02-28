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
    <div className="relative w-full">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40" />
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Search your inventory..."
        className="pl-14 h-14 rounded-2xl bg-muted/40 backdrop-blur-sm border-1 border-card-foreground/10 placeholder:text-[10px] placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em] bm-interactive font-black text-foreground text-xs tracking-widest uppercase shadow-none ring-0 focus-visible:ring-0"
      />
    </div>
  );
}
