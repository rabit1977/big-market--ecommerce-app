'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

// Filter definitions with Macedonian labels
const QUICK_FILTERS = [
  { id: 'forSale', label: 'Се продава', defaultChecked: true },
  { id: 'wanted', label: 'Се купува', defaultChecked: true },
  { id: 'forRent', label: 'Се изнајмува', defaultChecked: false },
  { id: 'rentWanted', label: 'Се бара изнајмување', defaultChecked: false },
  { id: 'trade', label: 'Може замена', defaultChecked: true },
  { id: 'used', label: 'Половен', defaultChecked: true },
  { id: 'new', label: 'Нов', defaultChecked: true },
  { id: 'shipping', label: 'Со достава', defaultChecked: false },
  { id: 'vat', label: 'Со ДДВ', defaultChecked: false },
];

export const HeroHeader = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    QUICK_FILTERS.forEach(f => {
      initial[f.id] = f.defaultChecked;
    });
    return initial;
  });

  const toggleFilter = (id: string) => {
    setFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className='bg-muted/20 border-b border-border/30'>
      <div className='container-wide'>

        {/* Desktop: Inline Filter Checkboxes */}
        <div className="hidden md:flex items-center gap-x-4 py-2">
          {QUICK_FILTERS.map((filter) => (
            <div key={filter.id} className="flex items-center space-x-1.5">
              <Checkbox 
                id={`hero-${filter.id}`} 
                checked={filters[filter.id]} 
                onCheckedChange={() => toggleFilter(filter.id)}
                className="rounded-sm h-3.5 w-3.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
              />
              <label
                htmlFor={`hero-${filter.id}`}
                className="text-xs font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors select-none"
              >
                {filter.label}
              </label>
            </div>
          ))}
        </div>

        {/* Mobile: Toggle + Collapsible Chips */}
        <div className="md:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 w-full py-2 text-xs font-medium transition-colors",
              showFilters ? "text-primary" : "text-muted-foreground"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Quick Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="flex flex-wrap gap-1.5 pb-2.5 animate-in slide-in-from-top-2 duration-200">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-200 active:scale-95",
                    filters[filter.id]
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-sm border-[1.5px] flex items-center justify-center transition-colors",
                    filters[filter.id] ? "bg-primary border-primary" : "border-muted-foreground/40"
                  )}>
                    {filters[filter.id] && (
                      <svg className="w-1.5 h-1.5 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
