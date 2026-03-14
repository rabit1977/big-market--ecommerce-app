'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function MyListingsSearch() {
  const t = useTranslations('MyListings');
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
    <div className="relative w-full group">
      <Search className="absolute left-4 top-1/2 z-10 group-hover:text-primary transition-all duration-300 ease-in-out -translate-y-1/2 h-4 w-4 text-foreground opacity-60 group-hover:opacity-100" />
      <Input
        value={value}
        onChange={handleChange}
        placeholder={t('search_placeholder')}
        className="pl-12 h-10 rounded-xl bg-muted/40 backdrop-blur-sm border-1 border-card-foreground/10 placeholder:text-[10px] placeholder:font-black placeholder:uppercase placeholder:tracking-[0.1em] bm-interactive font-black text-foreground text-[10px] tracking-widest uppercase shadow-none ring-0 focus-visible:ring-0"
      />
    </div>
  );
}
