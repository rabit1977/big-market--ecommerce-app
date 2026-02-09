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
import { useSidebar } from '@/lib/context/sidebar-context';
import { cn } from '@/lib/utils';
import { ChevronDown, Loader2, MapPin, Menu, Search, X } from 'lucide-react';
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
    const { toggle } = useSidebar();

    return (
      <div className='relative group'>
        {/* Left: Menu button (opens sidebar) + Search icon */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center z-20">
            <button
              type="button"
              onClick={toggle}
              className="p-1.5 md:p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              aria-label="Open categories menu"
            >
              <Menu className='h-4 w-4' />
            </button>
            <div className="w-px h-4 bg-border mx-0.5 hidden sm:block" />
            <div className="hidden sm:flex items-center text-muted-foreground pl-1">
              {isPending ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                  <Search className='h-4 w-4' />
              )}
            </div>
        </div>

        <Input
          ref={ref}
          type='search'
          placeholder='Search listings...'
          className='h-10 md:h-11 rounded-full pl-10 sm:pl-16 pr-24 sm:pr-32 bg-secondary/80 border-border/60 shadow-sm 
                     focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30
                     text-sm placeholder:text-muted-foreground/60
                     [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden
                     transition-all duration-200'
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
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-20">
            {/* City Selector */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 md:h-8 gap-1 px-2 md:px-2.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                    >
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium truncate max-w-[60px] sm:max-w-[80px] hidden sm:inline">
                            {selectedCity === 'all' ? 'All Cities' : selectedCity}
                        </span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
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
                className='p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 rounded-full hover:bg-muted'
                >
                <X className='h-3.5 w-3.5' />
                </button>
            )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
