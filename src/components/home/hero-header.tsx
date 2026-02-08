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

export const HeroHeader = () => {
  const router = useRouter();
  const { toggle } = useSidebar();
  const categories = useQuery(api.categories.list);
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [query, setQuery] = useState('');

  const categoryTree = useMemo(() => {
      if (!categories) return [];
      return buildCategoryTree(categories);
  }, [categories]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category && category !== 'all') params.set('category', category);
    if (location && location !== 'all' && location !== 'All Cities') params.set('city', location);
    
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

            {/* Filter Checkboxes */}
            <div className="flex flex-wrap gap-6 mt-4 text-sm text-muted-foreground select-none">
                {[
                    { id: 'se-prodava', label: 'For Sale', checked: true },
                    { id: 'se-kupuva', label: 'Wanted', checked: true },
                    { id: 'moza-e-zamena', label: 'Trade possible', checked: true },
                    { id: 'polovni', label: 'Used', checked: true },
                    { id: 'novi', label: 'New', checked: true },
                    { id: 'cargo', label: 'With shipping', checked: false },
                    { id: 'ddv', label: 'VAT included', checked: false },
                ].map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-2">
                        <Checkbox id={filter.id} defaultChecked={filter.checked} className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                        <label
                            htmlFor={filter.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
