'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  categories: Array<{ _id: string; name: string; slug: string }>;
  initialFilters?: FilterState;
}

export interface FilterState {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  condition?: string;
  sortBy?: string;
  userType?: string;
  adType?: string;
  isTradePossible?: boolean;
  hasShipping?: boolean;
  isVatIncluded?: boolean;
  isAffordable?: boolean;
}

const cities = [
  'Skopje', 'Bitola', 'Kumanovo', 'Prilep', 'Tetovo', 'Veles', 'Ohrid', 'Gostivar',
  'Štip', 'Strumica', 'Kavadarci', 'Kočani', 'Kičevo', 'Struga', 'Radoviš', 'Gevgelija',
];

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'used', label: 'Used' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export function FilterPanel({ onFilterChange, categories, initialFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    sortBy: 'newest',
  });
  
  // Initialize price range from props or default
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters?.priceMin || 0,
    initialFilters?.priceMax || 10000
  ]);

  // Sync state if initialFilters changes (optional, but good for deep linking)
  useEffect(() => {
     if (initialFilters) {
        setFilters(prev => ({...prev, ...initialFilters}));
        if (initialFilters.priceMin !== undefined || initialFilters.priceMax !== undefined) {
           setPriceRange([initialFilters.priceMin || 0, initialFilters.priceMax || 10000]);
        }
     }
  }, [initialFilters]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters: FilterState = { sortBy: 'newest' };
    setFilters(resetFilters);
    setPriceRange([0, 10000]);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => key !== 'sortBy' && filters[key as keyof FilterState]
  ).length;

  return (
    <div className="space-y-4">
      {/* Filter Content - Always visible, parent controls visibility */}
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Filters</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary hover:text-primary/80"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter('sortBy', value)}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilter('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Select
            value={filters.city}
            onValueChange={(value) => updateFilter('city', value)}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city.toLowerCase()}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={(value) => {
                setPriceRange(value as [number, number]);
                updateFilter('priceMin', value[0]);
                updateFilter('priceMax', value[1]);
              }}
              max={10000}
              step={100}
              className="w-full"
            />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="priceMin" className="text-xs text-muted-foreground">
                  Min
                </Label>
                <Input
                  id="priceMin"
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setPriceRange([value, priceRange[1]]);
                    updateFilter('priceMin', value);
                  }}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="priceMax" className="text-xs text-muted-foreground">
                  Max
                </Label>
                <Input
                  id="priceMax"
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 10000;
                    setPriceRange([priceRange[0], value]);
                    updateFilter('priceMax', value);
                  }}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            value={filters.condition}
            onValueChange={(value) => updateFilter('condition', value)}
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Any Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Condition</SelectItem>
              {conditions.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="pt-4 border-t space-y-2">
            <Label className="text-xs text-muted-foreground">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {filters.category && filters.category !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find((c) => c.slug === filters.category)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter('category', undefined)}
                  />
                </Badge>
              )}
              {filters.city && filters.city !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {cities.find((c) => c.toLowerCase() === filters.city)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter('city', undefined)}
                  />
                </Badge>
              )}
              {filters.condition && filters.condition !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {conditions.find((c) => c.value === filters.condition)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter('condition', undefined)}
                  />
                </Badge>
              )}
              {(filters.priceMin !== 0 || filters.priceMax !== 10000) && (
                <Badge variant="secondary" className="gap-1">
                  €{filters.priceMin} - €{filters.priceMax}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setPriceRange([0, 10000]);
                      updateFilter('priceMin', undefined);
                      updateFilter('priceMax', undefined);
                    }}
                  />
                </Badge>
              )}
              {filters.userType && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  {filters.userType.toLowerCase()}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter('userType', undefined)}
                  />
                </Badge>
              )}
              {filters.adType && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  {filters.adType.toLowerCase()}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter('adType', undefined)}
                  />
                </Badge>
              )}
              {filters.isTradePossible && (
                <Badge variant="secondary" className="gap-1">
                  Exchange Possible
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter('isTradePossible', false)}
                  />
                </Badge>
              )}
              {filters.hasShipping && (
                <Badge variant="secondary" className="gap-1">
                  Shipping
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter('hasShipping', false)}
                  />
                </Badge>
              )}
              {filters.isVatIncluded && (
                <Badge variant="secondary" className="gap-1">
                  VAT Incl.
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter('isVatIncluded', false)}
                  />
                </Badge>
              )}
              {filters.isAffordable && (
                <Badge variant="secondary" className="gap-1">
                  Best Deals
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter('isAffordable', false)}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
