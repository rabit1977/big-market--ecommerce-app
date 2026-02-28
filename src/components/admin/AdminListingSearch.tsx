'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";



export function AdminListingSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('listingNumber') || '';
  const [text, setText] = useState(initialSearch);
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQuery = params.get('listingNumber') || '';

    if (query === currentQuery) return;

    if (query) {
      params.set('listingNumber', query);
    } else {
      params.delete('listingNumber');
    }
    router.push(`/admin/listings?${params.toString()}`);

  }, [query, router, searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="SEARCH BY ITEM #..."
        className="pl-9 h-9 bg-input border-border rounded-lg shadow-none font-bold uppercase tracking-widest text-[10px] sm:text-xs"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}