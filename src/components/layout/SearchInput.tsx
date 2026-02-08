import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { CITIES } from '@/lib/constants/cities';
import { cn } from '@/lib/utils';
import { buildCategoryTree } from '@/lib/utils/category-tree';
import { useQuery } from 'convex/react';
import { ChevronDown, Loader2, MapPin, Search, X } from 'lucide-react';
import { forwardRef, useMemo } from 'react';
import { api } from '../../../convex/_generated/api';

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
  selectedCity: string;
  onCityChange: (city: string) => void;
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
      selectedCategory,
      onCategoryChange,
      selectedCity,
      onCityChange,
    },
    ref
  ) => {
    const categories = useQuery(api.categories.list);

    const categoryTree = useMemo(() => {
        if (!categories) return [];
        return buildCategoryTree(categories);
    }, [categories]);

    return (
      <div className='relative group'>
        {/* Left Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground z-20">
            {isPending ? (
                <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
                <Search className='h-4 w-4' />
            )}
        </div>

        <Input
          ref={ref}
          type='search'
          placeholder='BMW, Iphone, Samsung...'
          className='h-12 rounded-full pl-11 pr-36 bg-secondary border-border shadow-sm focus-visible:ring-primary/20 
                     text-base placeholder:text-muted-foreground/70
                     [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          disabled={isPending}
          aria-label='Search listings'
          aria-expanded={showResults}
          aria-autocomplete='list'
          aria-controls={showResults ? 'search-results' : undefined}
        />

        {/* Right Actions */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20">
            {/* City Selector */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 gap-1.5 px-3 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                    >
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium truncate max-w-[100px] hidden sm:inline">
                            {selectedCity === 'all' ? 'All Cities' : selectedCity}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto rounded-xl shadow-xl p-1">
                    <DropdownMenuItem 
                      onClick={() => onCityChange('all')}
                      className={cn("rounded-lg", selectedCity === 'all' && "bg-primary/10 text-primary font-bold")}
                    >
                        All Cities
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    {CITIES.filter(c => c !== "All Cities").map((city) => (
                        <DropdownMenuItem 
                          key={city} 
                          onClick={() => onCityChange(city)}
                          className={cn("rounded-lg", selectedCity === city && "bg-primary/10 text-primary font-bold")}
                        >
                            {city}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {value && (
                <button
                onClick={onClear}
                disabled={isPending}
                aria-label='Clear search'
                className='p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50'
                >
                <X className='h-4 w-4' />
                </button>
            )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
