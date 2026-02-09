'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CITIES } from '@/lib/constants/cities';
import { useSidebar } from '@/lib/context/sidebar-context';
import { buildCategoryTree } from '@/lib/utils/category-tree';
import { useQuery } from 'convex/react';
import { MapPin, Menu, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { api } from '../../../convex/_generated/api';

// Filter definitions with Macedonian labels
const QUICK_FILTERS = [
  { id: 'forSale', label: 'Се продава', adType: 'Се продава', defaultChecked: true },
  { id: 'wanted', label: 'Се купува', adType: 'Се купува', defaultChecked: true },
  { id: 'forRent', label: 'Се изнајмува', adType: 'Се изнајмува', defaultChecked: false },
  { id: 'rentWanted', label: 'Се бара изнајмување', adType: 'Се бара изнајмување', defaultChecked: false },
  { id: 'trade', label: 'Може замена', isTradePossible: 'Да', defaultChecked: true },
  { id: 'used', label: 'Половен', condition: 'Used', defaultChecked: true },
  { id: 'new', label: 'Нов', condition: 'New', defaultChecked: true },
  { id: 'shipping', label: 'Со достава', hasShipping: true, defaultChecked: false },
  { id: 'vat', label: 'Со ДДВ', isVatIncluded: true, defaultChecked: false },
];

export const HeroHeader = () => {
  const router = useRouter();
  const { toggle } = useSidebar();
  const categories = useQuery(api.categories.list);
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [query, setQuery] = useState('');
  
  // Initialize filter state from defaults
  const [filters, setFilters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    QUICK_FILTERS.forEach(f => {
      initial[f.id] = f.defaultChecked;
    });
    return initial;
  });

  const categoryTree = useMemo(() => {
      if (!categories) return [];
      return buildCategoryTree(categories);
  }, [categories]);

  const toggleFilter = (id: string) => {
    setFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category && category !== 'all') params.set('category', category);
    if (location && location !== 'all' && location !== 'All Cities') params.set('city', location);
    
    // Build adType array from checked filters
    const adTypes: string[] = [];
    QUICK_FILTERS.forEach(f => {
      if (f.adType && filters[f.id]) {
        adTypes.push(f.adType);
      }
    });
    if (adTypes.length > 0 && adTypes.length < 4) {
      params.set('adType', adTypes.join(','));
    }
    
    // Build condition array  
    const conditions: string[] = [];
    QUICK_FILTERS.forEach(f => {
      if (f.condition && filters[f.id]) {
        conditions.push(f.condition);
      }
    });
    if (conditions.length === 1) {
      params.set('condition', conditions[0]);
    }
    
    // Boolean/String filters
    if (filters.trade) params.set('isTradePossible', 'Да');
    if (filters.shipping) params.set('hasShipping', 'true');
    if (filters.vat) params.set('isVatIncluded', 'true');
    
    router.push(`/listings?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='bg-background border-b py-6 md:py-8'>
      <div className='container-wide'>
        
        {/* Mobile search bar removed to prioritize header search */}

        {/* Desktop View: Complex Search Strip */}
        <div className="hidden md:block">
            <div className="flex items-stretch border border-border rounded-lg overflow-hidden shadow-sm h-14 bg-background">
                {/* Category Dropdown -> Opens Mobile Sidebar on Click */}
                <div className="w-48 border-r border-border flex items-center hover:bg-muted/30 transition-colors relative">
                    <Button 
                        variant="ghost" 
                        onClick={toggle}
                        className="w-full h-full border-0 focus:ring-0 focus:ring-offset-0 ring-0 shadow-none outline-none bg-transparent rounded-none px-4 gap-2 text-foreground font-medium justify-start hover:bg-transparent"
                    >
                        <Menu className="w-5 h-5 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                            All Categories
                        </span>
                    </Button>
                </div>

                {/* Search Input */}
                <div className="flex-1 relative flex items-center">
                    <Input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="BMW, Iphone, Samsung, Ad number" 
                        className="w-full h-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 outline-none text-base px-4 rounded-none bg-transparent text-foreground placeholder:text-muted-foreground/50" 
                    />
                </div>

                {/* Location Dropdown */}
                <div className="w-56 border-l border-border flex items-center hover:bg-muted/30 transition-colors relative">
                    <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="w-full h-full border-0 focus:ring-0 focus:ring-offset-0 ring-0 shadow-none outline-none bg-transparent rounded-none px-4 gap-2 text-foreground font-medium">
                            <MapPin className="w-5 h-5 shrink-0 text-muted-foreground" />
                            <SelectValue placeholder="All Macedonia" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            <SelectItem value="all">All Macedonia</SelectItem>
                            {CITIES.map((city) => (
                                <SelectItem key={city} value={city === "All Cities" ? "all" : city}>
                                    {city}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Button */}
                <Button 
                    onClick={handleSearch}
                    className="h-full w-24 rounded-none border-l border-border bg-primary hover:bg-primary/90 text-white transition-all cursor-pointer"
                >
                    <Search className="w-6 h-6" />
                </Button>
            </div>

            {/* Filter Checkboxes - Now Functional */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground select-none">
                {QUICK_FILTERS.map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={filter.id} 
                          checked={filters[filter.id]} 
                          onCheckedChange={() => toggleFilter(filter.id)}
                          className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
                        />
                        <label
                            htmlFor={filter.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-foreground transition-colors"
                        >
                            {filter.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
