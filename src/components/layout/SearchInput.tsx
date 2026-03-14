import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isPending: boolean;
  showResults: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onFocus,
      onKeyDown,
      onClear,
      isPending,
      showResults,
    },
    ref
  ) => {
    const tNav = useTranslations('Navigation');

    return (
      <div className="relative group w-full">
        {/* Left: Search icon */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center z-20 bg-background pl-2">
          <div className="flex items-center text-muted-foreground">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </div>
        </div>

        <Input
          ref={ref}
          type="search"
          placeholder={tNav('search_placeholder')}
          className="h-9 md:h-10 rounded-lg pl-9 sm:pl-10 pr-10 bg-background
                     focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary
                     text-sm placeholder:text-muted-foreground/60
                     [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden
                     transition-all duration-150 shadow-none font-bold uppercase tracking-widest text-[10px] sm:text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          disabled={isPending}
          aria-label="Search listings"
          aria-expanded={showResults}
          aria-autocomplete="list"
          aria-controls={showResults ? 'search-results' : undefined}
        />

        {/* Right Actions */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-20">
          {value && (
            <button
              onClick={onClear}
              disabled={isPending}
              aria-label="Clear search"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 rounded-lg hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';