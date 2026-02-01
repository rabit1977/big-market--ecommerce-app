import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { CITIES } from '@/lib/constants/cities';
import { useQuery } from 'convex/react';
import { Loader2, MapPin, Menu, Search, X } from 'lucide-react';
import { forwardRef } from 'react';
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

    return (
      <div className='relative group'>
        {/* Left Dropdowns */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-muted-foreground border-r pr-1 h-8 border-border/50 z-20">
            {/* Category Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" title="Categories">
                        <Menu className={selectedCategory !== 'all' ? 'h-5 w-5 text-primary' : 'h-5 w-5'} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 max-h-[300px] overflow-auto z-[60]">
                    <DropdownMenuItem onClick={() => onCategoryChange('all')} className={selectedCategory === 'all' ? 'bg-muted' : ''}>
                        All Categories
                    </DropdownMenuItem>
                    {categories?.map((cat) => (
                        <DropdownMenuItem 
                            key={cat._id} 
                            onClick={() => onCategoryChange(cat.slug)}
                            className={selectedCategory === cat.slug ? 'bg-muted' : ''}
                        >
                            {cat.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* City Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" title="Location">
                        <MapPin className={selectedCity !== 'all' ? 'h-5 w-5 text-primary' : 'h-5 w-5'} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 max-h-[300px] overflow-auto z-[60]">
                    <DropdownMenuItem onClick={() => onCityChange('all')} className={selectedCity === 'all' ? 'bg-muted' : ''}>
                        All Macedonia
                    </DropdownMenuItem>
                    {CITIES.map((city) => (
                        <DropdownMenuItem 
                            key={city} 
                            onClick={() => onCityChange(city === "All Cities" ? "all" : city)}
                            className={(selectedCity === city || (selectedCity === 'all' && city === 'All Cities')) ? 'bg-muted' : ''}
                        >
                            {city}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <Input
          ref={ref}
          type='search'
          placeholder='BMW, Iphone, Samsung...'
          className='h-12 rounded-full pl-20 pr-12 bg-secondary/30 border-border/50 shadow-sm focus-visible:ring-primary/20 
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
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
            {value && (
                <button
                onClick={onClear}
                disabled={isPending}
                aria-label='Clear search'
                className='text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50'
                >
                <X className='h-4 w-4' />
                </button>
            )}
            
            <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center shadow-sm text-primary">
                 {isPending ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                    <Search className='h-4 w-4' />
                )}
            </div>
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
