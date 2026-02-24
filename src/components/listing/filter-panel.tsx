'use client';

import { ListingSearchInput } from '@/components/shared/listing-search-input';
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  isVatIncluded?: boolean;
  isAffordable?: boolean;
  dateRange?: string;
  subCategory?: string;
  dynamicFilters?: string;
  listingNumber?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  categories: Category[];
  initialFilters?: FilterState;
  idPrefix?: string;
  template?: any;
}

// ─── Constants (module-level — never recreated) ────────────────────────────────

const PRICE_MIN_DEFAULT = 0;
const PRICE_MAX_DEFAULT = 1_000_000;

const CITIES = [
  'Skopje', 'Bitola', 'Kumanovo', 'Prilep', 'Tetovo', 'Veles', 'Ohrid', 'Gostivar',
  'Štip', 'Strumica', 'Kavadarci', 'Kočani', 'Kičevo', 'Struga', 'Radoviš', 'Gevgelija',
];

const CONDITIONS = [
  { value: 'new',      label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good',     label: 'Good' },
  { value: 'fair',     label: 'Fair' },
  { value: 'used',     label: 'Used' },
];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'oldest',     label: 'Oldest First' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular',    label: 'Most Popular' },
];

const DATE_RANGE_LABELS: Record<string, string> = {
  today:  'Today',
  '3days': 'Last 3 Days',
  '7days': 'Last 7 Days',
};

const DEFAULT_FILTERS: FilterState = { sortBy: 'newest' };

// ─── Component ────────────────────────────────────────────────────────────────

export function FilterPanel({
  onFilterChange,
  categories,
  initialFilters,
  idPrefix = 'filter',
  template,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters ?? DEFAULT_FILTERS);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters?.priceMin ?? PRICE_MIN_DEFAULT,
    initialFilters?.priceMax ?? PRICE_MAX_DEFAULT,
  ]);
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, any>>(() => {
    if (!initialFilters?.dynamicFilters) return {};
    try { return JSON.parse(initialFilters.dynamicFilters); } catch { return {}; }
  });

  // Track previous initialFilters to avoid unnecessary syncs
  const prevInitialFiltersRef = useRef(initialFilters);

  // Sync if initialFilters reference changes (deep-link / URL-driven updates)
  useEffect(() => {
    if (initialFilters === prevInitialFiltersRef.current) return;
    prevInitialFiltersRef.current = initialFilters;

    if (!initialFilters) return;
    setFilters((prev) => ({ ...prev, ...initialFilters }));

    if (initialFilters.priceMin !== undefined || initialFilters.priceMax !== undefined) {
      setPriceRange([
        initialFilters.priceMin ?? PRICE_MIN_DEFAULT,
        initialFilters.priceMax ?? PRICE_MAX_DEFAULT,
      ]);
    }

    try {
      setDynamicFilters(initialFilters.dynamicFilters ? JSON.parse(initialFilters.dynamicFilters) : {});
    } catch {
      setDynamicFilters({});
    }
  }, [initialFilters]);

  // ── Derived category data ─────────────────────────────────────────────────

  const mainCategories = useMemo(() => categories.filter((c) => !c.parentId), [categories]);

  const selectedMainCategory = useMemo(
    () => categories.find((c) => c.slug === filters.category),
    [categories, filters.category]
  );

  const subCategories = useMemo(
    () => (selectedMainCategory ? categories.filter((c) => c.parentId === selectedMainCategory._id) : []),
    [categories, selectedMainCategory]
  );

  const selectedSubCategory = useMemo(() => {
    if (!filters.subCategory) return null;
    const direct = categories.find((c) => c.slug === filters.subCategory);
    if (!direct) return null;
    // Level 2: parent is a root category
    if (direct.parentId && categories.find((c) => c._id === direct.parentId && !c.parentId)) return direct;
    // Level 3: find level-2 parent
    if (direct.parentId) {
      const parent = categories.find((c) => c._id === direct.parentId);
      if (parent?.parentId && categories.find((c) => c._id === parent.parentId && !c.parentId)) return parent;
    }
    return direct;
  }, [categories, filters.subCategory]);

  const subSubCategories = useMemo(
    () => (selectedSubCategory ? categories.filter((c) => c.parentId === selectedSubCategory._id) : []),
    [categories, selectedSubCategory]
  );

  const filterableTemplateFields = useMemo(() => {
    if (!template?.fields) return [];
    return template.fields.filter((f: any) => {
      if (['title', 'description', 'price', 'images', 'condition'].includes(f.key)) return false;
      return f.type === 'select' && f.options?.length > 1 && f.options.length <= 20;
    });
  }, [template]);

  // ── Filter update helpers ─────────────────────────────────────────────────

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      // Schedule onFilterChange outside the updater to avoid calling router.push
      // during a render (which would trigger the "Cannot update Router while rendering" error).
      setTimeout(() => onFilterChange(next), 0);
      return next;
    });
  }, [onFilterChange]);

  const applyFilters = useCallback((next: FilterState) => {
    setFilters(next);
    onFilterChange(next);
  }, [onFilterChange]);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPriceRange([PRICE_MIN_DEFAULT, PRICE_MAX_DEFAULT]);
    setDynamicFilters({});
    onFilterChange(DEFAULT_FILTERS);
  }, [onFilterChange]);

  // ── Price range — batch two filter updates into one ───────────────────────

  const handlePriceSlider = useCallback((value: number[]) => {
    const [min, max] = value as [number, number];
    setPriceRange([min, max]);
    setFilters((prev) => {
      const next = { ...prev, priceMin: min, priceMax: max };
      setTimeout(() => onFilterChange(next), 0);
      return next;
    });
  }, [onFilterChange]);

  const handlePriceMinInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value) || 0;
    setPriceRange(([, max]) => [min, max]);
    updateFilter('priceMin', min);
  }, [updateFilter]);

  const handlePriceMaxInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value) || PRICE_MAX_DEFAULT;
    setPriceRange(([min]) => [min, max]);
    updateFilter('priceMax', max);
  }, [updateFilter]);

  // ── Category handlers ─────────────────────────────────────────────────────

  const handleMainCategoryChange = useCallback((slug: string) => {
    applyFilters({
      ...filters,
      category: slug === 'all' ? undefined : slug,
      subCategory: undefined,
      dynamicFilters: undefined,
    });
    setDynamicFilters({});
  }, [filters, applyFilters]);

  const handleSubCategoryChange = useCallback((slug: string) => {
    applyFilters({
      ...filters,
      subCategory: slug === 'all' ? undefined : slug,
      dynamicFilters: undefined,
    });
    setDynamicFilters({});
  }, [filters, applyFilters]);

  const handleSubSubCategoryChange = useCallback((slug: string) => {
    applyFilters({
      ...filters,
      subCategory: slug === 'all' ? filters.subCategory : slug,
      dynamicFilters: undefined,
    });
    setDynamicFilters({});
  }, [filters, applyFilters]);

  // ── Dynamic filter helpers ────────────────────────────────────────────────

  const updateDynamicFilter = useCallback((key: string, value: any) => {
    setDynamicFilters((prev) => {
      const next = { ...prev };
      if (value === undefined || value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
        delete next[key];
      } else {
        next[key] = value;
      }
      const jsonString = Object.keys(next).length > 0 ? JSON.stringify(next) : undefined;
      // Update filters state and notify parent outside the updater to avoid
      // calling router.push during render.
      setFilters((prevFilters) => {
        const nextFilters = { ...prevFilters, dynamicFilters: jsonString };
        setTimeout(() => onFilterChange(nextFilters), 0);
        return nextFilters;
      });
      return next;
    });
  }, [onFilterChange]);

  const toggleDynamicArrayFilter = useCallback((key: string, value: string) => {
    setDynamicFilters((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : prev[key] ? [prev[key]] : [];
      const newArray = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      const next = { ...prev };
      if (newArray.length > 0) {
        next[key] = newArray;
      } else {
        delete next[key];
      }
      const jsonString = Object.keys(next).length > 0 ? JSON.stringify(next) : undefined;
      setFilters((prevFilters) => {
        const nextFilters = { ...prevFilters, dynamicFilters: jsonString };
        setTimeout(() => onFilterChange(nextFilters), 0);
        return nextFilters;
      });
      return next;
    });
  }, [onFilterChange]);

  // ── Active filter count ───────────────────────────────────────────────────

  const activeFilterCount = useMemo(
    () => Object.keys(filters).filter((k) => k !== 'sortBy' && filters[k as keyof FilterState]).length,
    [filters]
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
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

        {/* Listing ID Search */}
        <div className="space-y-1 border-b pb-2">
          <Label htmlFor={`${idPrefix}-listingNumber`} className="text-[10px] uppercase text-muted-foreground font-medium">
            Find Specific Item
          </Label>
          <ListingSearchInput
            idPrefix={idPrefix}
            initialValue={filters.listingNumber?.toString()}
            className="w-full"
          />
        </div>

        {/* Category Hierarchy */}
        <div className="space-y-2 pb-2 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-category`} className="text-[10px] uppercase text-muted-foreground font-medium">
                Category
              </Label>
              <Select value={filters.category || 'all'} onValueChange={handleMainCategoryChange}>
                <SelectTrigger id={`${idPrefix}-category`} className="h-8 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mainCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor={`${idPrefix}-subcategory`}
                className={`text-[10px] uppercase font-medium ${!filters.category ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}
              >
                Subcategory
              </Label>
              <Select
                value={selectedSubCategory?.slug || 'all'}
                onValueChange={handleSubCategoryChange}
                disabled={!filters.category || subCategories.length === 0}
              >
                <SelectTrigger id={`${idPrefix}-subcategory`} className="h-8 text-xs">
                  <SelectValue placeholder={!filters.category ? 'Select Category' : 'All'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {subCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {subSubCategories.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-subsubcategory`} className="text-[10px] uppercase text-muted-foreground font-medium">
                Type
              </Label>
              <Select
                value={
                  selectedSubCategory && subSubCategories.some((c) => c.slug === filters.subCategory)
                    ? filters.subCategory
                    : 'all'
                }
                onValueChange={handleSubSubCategoryChange}
              >
                <SelectTrigger id={`${idPrefix}-subsubcategory`} className="h-8 text-xs">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {subSubCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Dynamic Template Fields */}
        {filterableTemplateFields.length > 0 && (
          <div className="space-y-2 pb-2 border-b">
            <h4 className="font-semibold text-[10px] text-primary uppercase tracking-wider">Specifics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filterableTemplateFields.map((field: any) => (
                <div key={field.key} className="space-y-1">
                  <Label htmlFor={`${idPrefix}-${field.key}`} className="text-[10px] uppercase text-muted-foreground font-medium">
                    {field.label}
                  </Label>
                  {field.options.length > 8 ? (
                    <ScrollArea className="h-[120px] w-full rounded border p-1.5">
                      <div className="space-y-1">
                        {field.options.map((opt: string) => (
                          <div key={opt} className="flex items-center space-x-1.5">
                            <Checkbox
                              id={`${idPrefix}-${field.key}-${opt}`}
                              checked={(dynamicFilters[field.key] || []).includes(opt)}
                              onCheckedChange={() => toggleDynamicArrayFilter(field.key, opt)}
                              className="h-3 w-3"
                            />
                            <label htmlFor={`${idPrefix}-${field.key}-${opt}`} className="text-[11px] leading-none cursor-pointer">
                              {opt}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
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
        )}

        {/* Sort & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2 border-b">
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-sort`} className="text-[10px] uppercase text-muted-foreground font-medium">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(val) => updateFilter('sortBy', val)}>
              <SelectTrigger id={`${idPrefix}-sort`} className="h-8 text-xs">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-city`} className="flex items-center gap-1 text-[10px] uppercase text-muted-foreground font-medium">
              <MapPin className="h-2.5 w-2.5" /> Location
            </Label>
            <Select value={filters.city} onValueChange={(val) => updateFilter('city', val)}>
              <SelectTrigger id={`${idPrefix}-city`} className="h-8 text-xs">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-1.5 pb-2 border-b">
          <Label className="text-[10px] uppercase text-muted-foreground font-medium">Price Range (€)</Label>
          <div className="space-y-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceSlider}
              max={PRICE_MAX_DEFAULT}
              step={1000}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Input
                id={`${idPrefix}-priceMin`}
                type="number"
                value={priceRange[0]}
                onChange={handlePriceMinInput}
                className="h-7 text-xs"
                placeholder="Min"
              />
              <span className="text-muted-foreground text-xs">-</span>
              <Input
                id={`${idPrefix}-priceMax`}
                type="number"
                value={priceRange[1]}
                onChange={handlePriceMaxInput}
                className="h-7 text-xs"
                placeholder="Max"
              />
            </div>
            <div className="text-[10px] text-muted-foreground text-center">
              €{priceRange[0].toLocaleString()} – €{priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>

        {/* Date Posted */}
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-date`} className="text-xs">Date Posted</Label>
          <Select value={filters.dateRange || 'all'} onValueChange={(val) => updateFilter('dateRange', val)}>
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
          <Select value={filters.condition} onValueChange={(val) => updateFilter('condition', val)}>
            <SelectTrigger id={`${idPrefix}-condition`} className="h-9 text-sm">
              <SelectValue placeholder="Any Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Condition</SelectItem>
              {CONDITIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filter Badges */}
        {activeFilterCount > 0 && (
          <div className="pt-3 border-t space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Filters:</Label>
            <div className="flex flex-wrap gap-1.5">
              {filters.category && filters.category !== 'all' && (
                <FilterBadge label={categories.find((c) => c.slug === filters.category)?.name} onRemove={() => handleMainCategoryChange('all')} />
              )}
              {filters.subCategory && filters.subCategory !== 'all' && (
                <FilterBadge label={categories.find((c) => c.slug === filters.subCategory)?.name} onRemove={() => handleSubCategoryChange('all')} />
              )}
              {filters.city && filters.city !== 'all' && (
                <FilterBadge label={CITIES.find((c) => c.toLowerCase() === filters.city)} onRemove={() => updateFilter('city', undefined)} />
              )}
              {Object.entries(dynamicFilters).map(([key, value]) => {
                const fieldLabel = template?.fields?.find((f: any) => f.key === key)?.label ?? key;
                return (
                  <FilterBadge key={key} label={`${fieldLabel}: ${value}`} onRemove={() => updateDynamicFilter(key, undefined)} />
                );
              })}
              {filters.condition && filters.condition !== 'all' && (
                <FilterBadge label={CONDITIONS.find((c) => c.value === filters.condition)?.label} onRemove={() => updateFilter('condition', undefined)} />
              )}
              {filters.dateRange && filters.dateRange !== 'all' && (
                <FilterBadge label={DATE_RANGE_LABELS[filters.dateRange]} onRemove={() => updateFilter('dateRange', 'all')} />
              )}
              {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
                <FilterBadge
                  label={`€${filters.priceMin ?? 0} – €${filters.priceMax ?? PRICE_MAX_DEFAULT}`}
                  onRemove={() => {
                    setPriceRange([PRICE_MIN_DEFAULT, PRICE_MAX_DEFAULT]);
                    setFilters((prev) => {
                      const next = { ...prev, priceMin: undefined, priceMax: undefined };
                      setTimeout(() => onFilterChange(next), 0);
                      return next;
                    });
                  }}
                />
              )}
              {filters.userType     && <FilterBadge label={filters.userType.toLowerCase()}  onRemove={() => updateFilter('userType', undefined)} />}
              {filters.adType       && <FilterBadge label={filters.adType.toLowerCase()}    onRemove={() => updateFilter('adType', undefined)} />}
              {filters.isTradePossible && <FilterBadge label="Exchange Possible" onRemove={() => updateFilter('isTradePossible', false)} />}
              {filters.isVatIncluded   && <FilterBadge label="VAT Incl."         onRemove={() => updateFilter('isVatIncluded', false)} />}
              {filters.isAffordable    && <FilterBadge label="Best Deals"        onRemove={() => updateFilter('isAffordable', false)} />}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── FilterBadge helper ───────────────────────────────────────────────────────

function FilterBadge({ label, onRemove }: { label?: string; onRemove: () => void }) {
  if (!label) return null;
  return (
    <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
      {label}
      <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={onRemove} />
    </Badge>
  );
}