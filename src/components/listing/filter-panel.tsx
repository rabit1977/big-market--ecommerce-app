'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MapPin, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
  dateRange?: string;
  subCategory?: string;
  dynamicFilters?: string; // JSON string
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  categories: Array<{ _id: string; name: string; slug: string; parentId?: string }>;
  initialFilters?: FilterState;
  idPrefix?: string;
  template?: any; // The category template
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

export function FilterPanel({ onFilterChange, categories, initialFilters, idPrefix = 'filter', template }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    sortBy: 'newest',
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Initialize price range from props or default
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters?.priceMin || 0,
    initialFilters?.priceMax || 1000000
  ]);

  // Sync state if initialFilters changes (optional, but good for deep linking)
  useEffect(() => {
     if (initialFilters) {
        setFilters(prev => ({...prev, ...initialFilters}));
        if (initialFilters.priceMin !== undefined || initialFilters.priceMax !== undefined) {
           setPriceRange([initialFilters.priceMin || 0, initialFilters.priceMax || 1000000]);
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
    setPriceRange([0, 1000000]);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => key !== 'sortBy' && filters[key as keyof FilterState]
  ).length;

  // Dynamic Fields Logic
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, any>>({});

  // Initialize dynamic filters from initialFilters string
  useEffect(() => {
    if (initialFilters?.dynamicFilters) {
        try {
            setDynamicFilters(JSON.parse(initialFilters.dynamicFilters));
        } catch (e) { console.error("Error parsing dynamic filters", e); }
    } else {
        setDynamicFilters({}); // Reset if no dynamic filters
    }
  }, [initialFilters?.dynamicFilters, filters.category]);

  const updateDynamicFilter = (key: string, value: any) => {
      const updated = { ...dynamicFilters, [key]: value };
      
      // Remove empty values (but keep arrays if they have items)
      if (value === undefined || value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
          delete updated[key];
      }
      
      setDynamicFilters(updated);
      
      // Propagate to parent as JSON string
      const jsonString = Object.keys(updated).length > 0 ? JSON.stringify(updated) : undefined;
      updateFilter('dynamicFilters', jsonString); // This triggers onFilterChange
  };

  const toggleDynamicArrayFilter = (key: string, value: string) => {
      const current = dynamicFilters[key] || [];
      const currentArray = Array.isArray(current) ? current : [current];
      
      let newArray;
      if (currentArray.includes(value)) {
          newArray = currentArray.filter((v: string) => v !== value);
      } else {
          newArray = [...currentArray, value];
      }
      
      updateDynamicFilter(key, newArray.length > 0 ? newArray : undefined);
  };

  // Derived state for categories
  const mainCategories = useMemo(() => 
    categories.filter(c => !c.parentId),
    [categories]
  );

  const selectedMainCategory = useMemo(() => 
    categories.find(c => c.slug === filters.category),
    [categories, filters.category]
  );

  const subCategories = useMemo(() => {
    if (!selectedMainCategory) return [];
    return categories.filter(c => c.parentId === selectedMainCategory._id);
  }, [categories, selectedMainCategory]);

  // Find the actual subcategory (level 2) - could be filters.subCategory itself or its parent
  const selectedSubCategory = useMemo(() => {
    if (!filters.subCategory) return null;
    
    const directMatch = categories.find(c => c.slug === filters.subCategory);
    if (!directMatch) return null;
    
    // Check if it's a level-2 category (parent is a main category)
    if (directMatch.parentId && categories.find(c => c._id === directMatch.parentId && !c.parentId)) {
      return directMatch; // It's level 2
    }
    
    // Check if it's a level-3 category (need to find its level-2 parent)
    if (directMatch.parentId) {
      const parent = categories.find(c => c._id === directMatch.parentId);
      // Return the parent if it's level 2
      if (parent && parent.parentId && categories.find(c => c._id === parent.parentId && !c.parentId)) {
        return parent;
      }
    }
    
    return directMatch;
  }, [categories, filters.subCategory]);

  const subSubCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    return categories.filter(c => c.parentId === selectedSubCategory._id);
  }, [categories, selectedSubCategory]);

  const handleMainCategoryChange = (slug: string) => {
    const newFilters = { 
        ...filters, 
        category: slug === 'all' ? undefined : slug,
        subCategory: undefined, // Reset subcategory when main changes
        dynamicFilters: undefined // Reset dynamic filters as template might change
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setDynamicFilters({}); // Clear local dynamic state
  };

  const handleSubCategoryChange = (slug: string) => {
      const newFilters = {
          ...filters,
          subCategory: slug === 'all' ? undefined : slug,
          dynamicFilters: undefined // Reset dynamic filters
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
      setDynamicFilters({});
  };

  const handleSubSubCategoryChange = (slug: string) => {
      // When selecting a sub-subcategory, we store it in subCategory field
      // The backend filtering logic will handle the hierarchy
      const newFilters = {
          ...filters,
          subCategory: slug === 'all' ? filters.subCategory : slug,
          dynamicFilters: undefined
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
      setDynamicFilters({});
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-3">
      {/* Filter Content - Compact & Responsive */}
      <Card className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="font-bold text-sm">Filters</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 h-7 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Category Hierarchy - Compact 2-column grid on desktop */}
        <div className="space-y-2 pb-2 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Main Category */}
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-category`} className="text-[10px] uppercase text-muted-foreground font-medium">Category</Label>
              <Select
                value={filters.category || 'all'}
                onValueChange={handleMainCategoryChange}
              >
                <SelectTrigger id={`${idPrefix}-category`} className="h-8 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mainCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory */}
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-subcategory`} className={`text-[10px] uppercase font-medium ${!filters.category ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                  Subcategory
              </Label>
              <Select
                value={selectedSubCategory?.slug || 'all'}
                onValueChange={handleSubCategoryChange}
                disabled={!filters.category || subCategories.length === 0}
              >
                <SelectTrigger id={`${idPrefix}-subcategory`} className="h-8 text-xs">
                  <SelectValue placeholder={!filters.category ? "Select Category" : "All"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {subCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type (Sub-Subcategory) - Full width when visible */}
          {subSubCategories.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-subsubcategory`} className="text-[10px] uppercase text-muted-foreground font-medium">
                  Type
              </Label>
              <Select
                value={selectedSubCategory && subSubCategories.some(c => c.slug === filters.subCategory) ? filters.subCategory : 'all'}
                onValueChange={handleSubSubCategoryChange}
              >
                <SelectTrigger id={`${idPrefix}-subsubcategory`} className="h-8 text-xs">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {subSubCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>


        {/* Dynamic Filterable Fields - Compact 2-column grid */}
        {template && template.fields && (() => {
          // Only show truly filterable fields (select types with reasonable option counts)
          const filterableFields = template.fields.filter((f: any) => {
            if (['title', 'description', 'price', 'images', 'condition'].includes(f.key)) return false;
            // Only show select fields that are good for filtering
            if (f.type === 'select' && f.options && f.options.length > 1 && f.options.length <= 20) return true;
            // Skip text/number fields as they're not great for filtering large datasets
            return false;
          });
          
          if (filterableFields.length === 0) return null;
          
          return (
            <div className="space-y-2 pb-2 border-b">
              <h4 className="font-semibold text-[10px] text-primary uppercase tracking-wider">
                  Specifics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filterableFields.map((field: any) => (
                  <div key={field.key} className="space-y-1">
                    <Label htmlFor={`${idPrefix}-${field.key}`} className="text-[10px] uppercase text-muted-foreground font-medium">{field.label}</Label>
                    
                    {/* Checkbox List for many options */}
                    {field.options && field.options.length > 8 ? (
                      <ScrollArea className="h-[120px] w-full rounded border p-1.5">
                        <div className="space-y-1">
                          {field.options.map((opt: string) => {
                            const isChecked = (dynamicFilters[field.key] || []).includes(opt);
                            return (
                              <div key={opt} className="flex items-center space-x-1.5">
                                <Checkbox 
                                  id={`${idPrefix}-${field.key}-${opt}`} 
                                  checked={isChecked}
                                  onCheckedChange={() => toggleDynamicArrayFilter(field.key, opt)}
                                  className="h-3 w-3"
                                />
                                <label 
                                  htmlFor={`${idPrefix}-${field.key}-${opt}`}
                                  className="text-[11px] leading-none cursor-pointer"
                                >
                                  {opt}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    ) : (
                      /* Dropdown for fewer options */
                      <Select
                        value={dynamicFilters[field.key] || 'all'}
                        onValueChange={(val) => updateDynamicFilter(field.key, val === 'all' ? undefined : val)}
                      >
                        <SelectTrigger id={`${idPrefix}-${field.key}`} className="h-8 text-xs">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {field.options.map((opt: string) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}


        {/* Sort & Location - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2 border-b">
          {/* Sort By */}
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-sort`} className="text-[10px] uppercase text-muted-foreground font-medium">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter('sortBy', value)}
            >
              <SelectTrigger id={`${idPrefix}-sort`} className="h-8 text-xs">
                <SelectValue placeholder="Newest" />
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

          {/* Location */}
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-city`} className="flex items-center gap-1 text-[10px] uppercase text-muted-foreground font-medium">
              <MapPin className="h-2.5 w-2.5" />
              Location
            </Label>
            <Select
              value={filters.city}
              onValueChange={(value) => updateFilter('city', value)}
            >
              <SelectTrigger id={`${idPrefix}-city`} className="h-8 text-xs">
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
        </div>

        {/* Price Range - Compact */}
        <div className="space-y-1.5 pb-2 border-b">
          <Label className="text-[10px] uppercase text-muted-foreground font-medium">Price Range (€)</Label>
          <div className="space-y-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => {
                setPriceRange(value as [number, number]);
                updateFilter('priceMin', value[0]);
                updateFilter('priceMax', value[1]);
              }}
              max={1000000}
              step={1000}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Input
                id={`${idPrefix}-priceMin`}
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setPriceRange([value, priceRange[1]]);
                  updateFilter('priceMin', value);
                }}
                className="h-7 text-xs"
                placeholder="Min"
              />
              <span className="text-muted-foreground text-xs">-</span>
              <Input
                id={`${idPrefix}-priceMax`}
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1000000;
                  setPriceRange([priceRange[0], value]);
                  updateFilter('priceMax', value);
                }}
                className="h-7 text-xs"
                placeholder="Max"
              />
            </div>
            <div className="text-[10px] text-muted-foreground text-center">
              €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>

        {/* Date Posted */}
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-date`} className="text-xs">Date Posted</Label>
          <Select
            value={filters.dateRange || 'all'}
            onValueChange={(value) => updateFilter('dateRange', value)}
          >
            <SelectTrigger id={`${idPrefix}-date`} className="h-9 text-sm">
              <SelectValue placeholder="Anytime" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Anytime</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="3days">Last 3 Days</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Condition */}
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-condition`} className="text-xs">Condition</Label>
          <Select
            value={filters.condition}
            onValueChange={(value) => updateFilter('condition', value)}
          >
            <SelectTrigger id={`${idPrefix}-condition`} className="h-9 text-sm">
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
          <div className="pt-3 border-t space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Filters:</Label>
            <div className="flex flex-wrap gap-1.5">
              {filters.category && filters.category !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  {categories.find((c) => c.slug === filters.category)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleMainCategoryChange('all')}
                  />
                </Badge>
              )}
               {filters.subCategory && filters.subCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  {categories.find((c) => c.slug === filters.subCategory)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleSubCategoryChange('all')}
                  />
                </Badge>
              )}
              {filters.city && filters.city !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  {cities.find((c) => c.toLowerCase() === filters.city)}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('city', undefined)}
                  />
                </Badge>
              )}
              {/* Dynamic Filter Badges */}
              {Object.entries(dynamicFilters).map(([key, value]) => {
                  const fieldLabel = template?.fields?.find((f: any) => f.key === key)?.label || key;
                  return (
                    <Badge key={key} variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                        {fieldLabel}: {value}
                        <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => updateDynamicFilter(key, undefined)} />
                    </Badge>
                  );
              })}
              {filters.condition && filters.condition !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  {conditions.find((c) => c.value === filters.condition)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('condition', undefined)}
                  />
                </Badge>
              )}
              {filters.dateRange && filters.dateRange !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  {filters.dateRange === 'today' ? 'Today' : filters.dateRange === '3days' ? 'Last 3 Days' : 'Last 7 Days'}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('dateRange', 'all')}
                  />
                </Badge>
              )}
              {(filters.priceMin !== 0 || filters.priceMax !== 1000000) && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  €{filters.priceMin} - €{filters.priceMax}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => {
                      setPriceRange([0, 1000000]);
                      updateFilter('priceMin', undefined);
                      updateFilter('priceMax', undefined);
                    }}
                  />
                </Badge>
              )}
              {filters.userType && (
                <Badge variant="secondary" className="gap-1 capitalize text-[10px] h-5 px-1.5">
                  {filters.userType.toLowerCase()}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('userType', undefined)}
                  />
                </Badge>
              )}
              {filters.adType && (
                <Badge variant="secondary" className="gap-1 capitalize text-[10px] h-5 px-1.5">
                  {filters.adType.toLowerCase()}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('adType', undefined)}
                  />
                </Badge>
              )}
              {filters.isTradePossible && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  Exchange Possible
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('isTradePossible', false)}
                  />
                </Badge>
              )}
              {filters.hasShipping && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  Shipping
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('hasShipping', false)}
                  />
                </Badge>
              )}
              {filters.isVatIncluded && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  VAT Incl.
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('isVatIncluded', false)}
                  />
                </Badge>
              )}
              {filters.isAffordable && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                  Best Deals
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
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
