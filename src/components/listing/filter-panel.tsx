'use client';

import { ListingSearchInput } from '@/components/shared/listing-search-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MK_LOCATIONS } from '@/lib/locations';
import { Slider } from '@/components/ui/slider';
import { MapPin, X, ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
  hasShipping?: boolean;
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

const DEFAULT_FILTERS: FilterState = { sortBy: 'newest' };

const getLocationLabel = (cityValue: string) => {
  for (const [region, cities] of Object.entries(MK_LOCATIONS)) {
    if (region.toLowerCase() === cityValue) return `Цел регион (${region})`;
    const match = cities.find(c => c.toLowerCase() === cityValue);
    if (match) return match;
  }
  return cityValue;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function FilterPanel({
  onFilterChange,
  categories,
  initialFilters,
  idPrefix = 'filter',
  template,
}: FilterPanelProps) {
  const t = useTranslations('FilterPanel');

  // ── Translated option lists (must be inside component for hook) ──────────
  const CONDITIONS = useMemo(() => [
    { value: 'new',      label: t('cond_new') },
    { value: 'like-new', label: t('cond_like_new') },
    { value: 'good',     label: t('cond_good') },
    { value: 'fair',     label: t('cond_fair') },
    { value: 'used',     label: t('cond_used') },
  ], [t]);

  const SORT_OPTIONS = useMemo(() => [
    { value: 'newest',     label: t('newest') },
    { value: 'oldest',     label: t('oldest') },
    { value: 'price-low',  label: t('price_low_high') },
    { value: 'price-high', label: t('price_high_low') },
    { value: 'popular',    label: t('popular') },
  ], [t]);

  const DATE_RANGE_LABELS = useMemo((): Record<string, string> => ({
    today:   t('today'),
    '3days': t('last_3_days'),
    '7days': t('last_7_days'),
  }), [t]);

  const [filters, setFilters] = useState<FilterState>(initialFilters ?? DEFAULT_FILTERS);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters?.priceMin ?? PRICE_MIN_DEFAULT,
    initialFilters?.priceMax ?? PRICE_MAX_DEFAULT,
  ]);
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, any>>(() => {
    if (!initialFilters?.dynamicFilters) return {};
    try { return JSON.parse(initialFilters.dynamicFilters); } catch { return {}; }
  });
  const [region, setRegion] = useState<string | undefined>(() => {
    if (initialFilters?.city) {
        for (const [r, muns] of Object.entries(MK_LOCATIONS)) {
            if (r === initialFilters.city || muns.includes(initialFilters.city)) return r;
        }
    }
    return undefined;
  });
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [citySearch, setCitySearch] = useState('');

  // Track previous initialFilters to avoid unnecessary syncs
  const prevInitialFiltersRef = useRef(initialFilters);

  // Sync if initialFilters reference changes (deep-link / URL-driven updates)
  useEffect(() => {
    if (initialFilters === prevInitialFiltersRef.current) return;
    prevInitialFiltersRef.current = initialFilters;

    if (!initialFilters) return;
    setFilters((prev) => ({ ...prev, ...initialFilters }));

    if (initialFilters.city && initialFilters.city !== 'all') {
      // Find which region this city belongs to and expand it
      Object.entries(MK_LOCATIONS).forEach(([region, municipalities]) => {
        if (municipalities.some(m => m.toLowerCase() === initialFilters.city?.toLowerCase())) {
          setExpandedRegions(prev => ({ ...prev, [region]: true }));
        }
      });
    }

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

  // ── Price range ───────────────────────────────────────────────────────────

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
      <Card className="p-3 space-y-3 rounded-lg border-none shadow-none bg-card bm-interactive">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="font-bold text-sm">{t('title')}</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 h-7 px-2 text-xs font-medium rounded-md"
            >
              {t('clear_all')}
            </Button>
          )}
        </div>

        {/* Listing ID Search */}
        <div className="space-y-1 border-b border-border pb-2">
          <Label htmlFor={`${idPrefix}-listingNumber`} className="text-[10px] uppercase text-muted-foreground font-medium">
            {t('find_item')}
          </Label>
          <ListingSearchInput
            idPrefix={idPrefix}
            initialValue={filters.listingNumber?.toString()}
            className="w-full"
          />
        </div>

        {/* Category Hierarchy */}
        <div className="space-y-2 pb-2 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-category`} className="text-[10px] uppercase text-muted-foreground font-medium">
                {t('category')}
              </Label>
              <Select value={filters.category || 'all'} onValueChange={handleMainCategoryChange}>
                <SelectTrigger id={`${idPrefix}-category`} className="h-8 text-xs rounded-md bm-interactive">
                  <SelectValue placeholder={t('all_categories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_categories')}</SelectItem>
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
                {t('subcategory')}
              </Label>
              <Select
                value={selectedSubCategory?.slug || 'all'}
                onValueChange={handleSubCategoryChange}
                disabled={!filters.category || subCategories.length === 0}
              >
                <SelectTrigger id={`${idPrefix}-subcategory`} className="h-8 text-xs rounded-md bm-interactive">
                  <SelectValue placeholder={!filters.category ? t('select_category_first') : t('all_subcategories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_subcategories')}</SelectItem>
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
                {t('type')}
              </Label>
              <Select
                value={
                  selectedSubCategory && subSubCategories.some((c) => c.slug === filters.subCategory)
                    ? filters.subCategory
                    : 'all'
                }
                onValueChange={handleSubSubCategoryChange}
              >
                <SelectTrigger id={`${idPrefix}-subsubcategory`} className="h-8 text-xs rounded-md bm-interactive">
                  <SelectValue placeholder={t('all_types')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_types')}</SelectItem>
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
          <div className="space-y-2 pb-2 border-b border-border">
            <h4 className="font-semibold text-[10px] text-primary uppercase tracking-wider">{t('specifics')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filterableTemplateFields.map((field: any) => (
                <div key={field.key} className="space-y-1">
                  <Label htmlFor={`${idPrefix}-${field.key}`} className="text-[10px] uppercase text-muted-foreground font-medium">
                    {field.label}
                  </Label>
                  {field.options.length > 8 ? (
                    <ScrollArea className="h-[120px] w-full rounded-md p-1.5 bg-background bm-interactive">
                      <div className="space-y-1">
                        {field.options.map((opt: string) => (
                          <div key={opt} className="flex items-center space-x-1.5">
                            <Checkbox
                              id={`${idPrefix}-${field.key}-${opt}`}
                              checked={(dynamicFilters[field.key] || []).includes(opt)}
                              onCheckedChange={() => toggleDynamicArrayFilter(field.key, opt)}
                              className="h-3.5 w-3.5 rounded-sm"
                            />
                            <label htmlFor={`${idPrefix}-${field.key}-${opt}`} className="text-[11px] font-medium leading-none cursor-pointer">
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
                      <SelectTrigger id={`${idPrefix}-${field.key}`} className="h-8 text-xs rounded-md bm-interactive">
                        <SelectValue placeholder={t('all')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('all')}</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2 border-b border-border ">
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-sort`} className="text-[10px] uppercase text-muted-foreground  font-medium">{t('sort_by')}</Label>
            <Select value={filters.sortBy} onValueChange={(val) => updateFilter('sortBy', val)}>
              <SelectTrigger id={`${idPrefix}-sort`} className="h-8 text-xs rounded-md bm-interactive">
                <SelectValue placeholder={t('newest')} />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-[10px] uppercase text-muted-foreground font-medium">
              <MapPin className="h-2.5 w-2.5" /> {t('location')}
            </Label>
            
            <div className="space-y-2 pt-2">
              <Select 
                value={region || 'all'} 
                onValueChange={(v) => {
                  const val = v === 'all' ? undefined : v;
                  setRegion(val);
                  updateFilter('city', val);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-md bg-background border-border bm-interactive">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-primary" />
                    <SelectValue placeholder={t('select_city')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_cities')}</SelectItem>
                  {Object.keys(MK_LOCATIONS).map((r) => (
                    <SelectItem key={r} value={r} className={r === 'Скопје' ? "font-bold" : ""}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {region && region !== 'Друго' && MK_LOCATIONS[region] && MK_LOCATIONS[region].length > 1 && (
                <Select 
                  value={filters.city || region} 
                  onValueChange={(v) => updateFilter('city', v)}
                >
                  <SelectTrigger className="h-8 text-xs rounded-md bg-background border-border animate-in fade-in slide-in-from-top-1 bm-interactive">
                    <SelectValue placeholder={t('subcategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {MK_LOCATIONS[region].map((mun) => (
                      <SelectItem key={mun} value={mun}>
                        {mun}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-1.5 pb-2 border-b border-border">
          <Label className="text-[10px] uppercase text-muted-foreground font-medium">{t('price_range')}</Label>
          <div className="space-y-3 pt-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceSlider}
              max={PRICE_MAX_DEFAULT}
              step={100}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Input
                id={`${idPrefix}-priceMin`}
                type="number"
                value={priceRange[0]}
                onChange={handlePriceMinInput}
                className="h-8 text-xs rounded-md bg-background bm-interactive"
                placeholder={t('min')}
              />
              <span className="text-muted-foreground text-xs font-bold">-</span>
              <Input
                id={`${idPrefix}-priceMax`}
                type="number"
                value={priceRange[1]}
                onChange={handlePriceMaxInput}
                className="h-8 text-xs rounded-md bg-background bm-interactive"
                placeholder={t('max')}
              />
            </div>
            <div className="text-[10px] font-medium text-muted-foreground text-center tabular-nums">
              €{priceRange[0].toLocaleString()} – €{priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>

        {/* Date Posted */}
        <div className="space-y-1.5 pb-2 border-b border-border">
          <Label htmlFor={`${idPrefix}-date`} className="text-[10px] uppercase text-muted-foreground font-medium">{t('date_posted')}</Label>
          <Select value={filters.dateRange || 'all'} onValueChange={(val) => updateFilter('dateRange', val === 'all' ? undefined : val)}>
            <SelectTrigger id={`${idPrefix}-date`} className="h-8 text-xs rounded-md bm-interactive">
              <SelectValue placeholder={t('anytime')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('anytime')}</SelectItem>
              <SelectItem value="today">{t('today')}</SelectItem>
              <SelectItem value="3days">{t('last_3_days')}</SelectItem>
              <SelectItem value="7days">{t('last_7_days')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Condition */}
        <div className="space-y-1.5 pb-2 border-b border-border">
          <Label htmlFor={`${idPrefix}-condition`} className="text-[10px] uppercase text-muted-foreground font-medium">{t('condition')}</Label>
          <Select value={filters.condition || 'all'} onValueChange={(val) => updateFilter('condition', val === 'all' ? undefined : val)}>
            <SelectTrigger id={`${idPrefix}-condition`} className="h-8 text-xs rounded-md bm-interactive">
              <SelectValue placeholder={t('any_condition')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('any_condition')}</SelectItem>
              {CONDITIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Other Filters (Buy/Sell, User Type, Trade) */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-adType`} className="text-[10px] uppercase text-muted-foreground font-medium">{t('ad_type') || 'Тип на оглас'}</Label>
              <Select value={filters.adType || 'all'} onValueChange={(val) => updateFilter('adType', val === 'all' ? undefined : val)}>
                <SelectTrigger id={`${idPrefix}-adType`} className="h-8 text-xs rounded-md bm-interactive">
                  <SelectValue placeholder={t('all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="SALE">{t('sale') || 'Продажба'}</SelectItem>
                  <SelectItem value="BUYING">{t('buying') || 'Купувам'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor={`${idPrefix}-userType`} className="text-[10px] uppercase text-muted-foreground font-medium">{t('user_type') || 'Продавач'}</Label>
              <Select value={filters.userType || 'all'} onValueChange={(val) => updateFilter('userType', val === 'all' ? undefined : val)}>
                <SelectTrigger id={`${idPrefix}-userType`} className="h-8 text-xs rounded-md bm-interactive">
                  <SelectValue placeholder={t('all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="PRIVATE">{t('private') || 'Приватен'}</SelectItem>
                  <SelectItem value="COMPANY">{t('company') || 'Компанија'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 border-t border-border/50 mt-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`${idPrefix}-trade`} 
                checked={filters.isTradePossible === true} 
                onCheckedChange={(checked) => updateFilter('isTradePossible', checked === true ? true : undefined)}
                className="h-4 w-4"
              />
              <Label htmlFor={`${idPrefix}-trade`} className="text-[11px] font-medium cursor-pointer">
                {t('trade_possible') || 'Замена'}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`${idPrefix}-shipping`} 
                checked={filters.hasShipping === true} 
                onCheckedChange={(checked) => updateFilter('hasShipping', checked === true ? true : undefined)}
                className="h-4 w-4"
              />
              <Label htmlFor={`${idPrefix}-shipping`} className="text-[11px] font-medium cursor-pointer">
                {t('has_shipping') || 'Испорака'}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`${idPrefix}-vat`} 
                checked={filters.isVatIncluded === true} 
                onCheckedChange={(checked) => updateFilter('isVatIncluded', checked === true ? true : undefined)}
                className="h-4 w-4"
              />
              <Label htmlFor={`${idPrefix}-vat`} className="text-[11px] font-medium cursor-pointer">
                {t('is_vat_included') || 'Со ДДВ'}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`${idPrefix}-affordable`} 
                checked={filters.isAffordable === true} 
                onCheckedChange={(checked) => updateFilter('isAffordable', checked === true ? true : undefined)}
                className="h-4 w-4"
              />
              <Label htmlFor={`${idPrefix}-affordable`} className="text-[11px] font-medium cursor-pointer">
                {t('is_affordable') || 'Поволно'}
              </Label>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {activeFilterCount > 0 && (
          <div className="pt-3 border-t border-border space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('active_controls')}</Label>
            <div className="flex flex-wrap gap-1.5">
              {filters.category && filters.category !== 'all' && (
                <FilterBadge label={categories.find((c) => c.slug === filters.category)?.name} onRemove={() => handleMainCategoryChange('all')} />
              )}
              {filters.subCategory && filters.subCategory !== 'all' && (
                <FilterBadge label={categories.find((c) => c.slug === filters.subCategory)?.name} onRemove={() => handleSubCategoryChange('all')} />
              )}
              {filters.city && filters.city !== 'all' && (
                <FilterBadge label={getLocationLabel(filters.city)} onRemove={() => updateFilter('city', undefined)} />
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
              {filters.adType && (
                <FilterBadge label={filters.adType === 'SALE' ? (t('sale') || 'Продажба') : (t('buying') || 'Купувам')} onRemove={() => updateFilter('adType', undefined)} />
              )}
              {filters.userType && (
                <FilterBadge label={filters.userType === 'PRIVATE' ? (t('private') || 'Приватен') : (t('company') || 'Компанија')} onRemove={() => updateFilter('userType', undefined)} />
              )}
              {filters.isTradePossible && (
                <FilterBadge label={t('trade_possible') || 'Замена'} onRemove={() => updateFilter('isTradePossible', undefined)} />
              )}
              {filters.hasShipping && (
                <FilterBadge label={t('has_shipping') || 'Испорака'} onRemove={() => updateFilter('hasShipping', undefined)} />
              )}
              {filters.isVatIncluded && (
                <FilterBadge label={t('is_vat_included') || 'Со ДДВ'} onRemove={() => updateFilter('isVatIncluded', undefined)} />
              )}
              {filters.isAffordable && (
                <FilterBadge label={t('is_affordable') || 'Поволно'} onRemove={() => updateFilter('isAffordable', undefined)} />
              )}
              {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (filters.priceMin !== PRICE_MIN_DEFAULT || filters.priceMax !== PRICE_MAX_DEFAULT) && (
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
    <Badge variant="secondary" className="gap-1 text-[10px] h-6 px-2 rounded-md font-medium border border-border">
      {label}
      <X className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors" onClick={onRemove} />
    </Badge>
  );
}