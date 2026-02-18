'use client';

/**
 * Isolated Client Component island for the search input.
 * The rest of HelpPage is a Server Component — this is the ONLY
 * piece that ships client-side JavaScript for the hero section.
 *
 * Future: hook up `query` to router.push('/listings?q=...') or
 * a server action for full-text search results.
 */

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function HelpSearch() {
  return (
    <div className="relative max-w-xl mx-auto group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        placeholder="Search for helps, guides, or rules..."
        className="h-14 pl-12 pr-4 text-base rounded-2xl border-border/50 shadow-xl shadow-primary/5 focus-visible:ring-primary/20 group-hover:border-primary/30 transition-all"
      />
    </div>
  );
}