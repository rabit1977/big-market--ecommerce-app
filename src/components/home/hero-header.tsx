'use client';

import { ListingSearchInput } from '@/components/shared/listing-search-input';
import { cn } from '@/lib/utils';
import { LayoutGrid, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
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
      <div className='container-wide py-2'>

        {/* Categories Link & Quick Filters - Justified & Rounded */}
        <div className="hidden md:flex items-center justify-between gap-4 ">
          
          {/* Categories Button - Rounded Pill */}
          <Link 
            href="/categories"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary/30 hover:bg-muted transition-all duration-300"
          >
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <LayoutGrid className="w-3 h-3 text-primary" />
            </div>
            <span className="text-[11px] font-bold tracking-tight text-foreground uppercase">Categories</span>
          </Link>

  

          {/* Filters Section */}
          <div className="flex-1 flex items-center justify-end">
            {/* Filter Toggle Button - Visible on ALL screens */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
                showFilters 
                  ? "bg-primary/10 border-primary/30 text-primary shadow-sm" 
                  : "bg-background border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-tight">Quick Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Filter Chips - Visible on ALL screens when toggled */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-3 pb-1 animate-in slide-in-from-top-2 duration-200">
            {QUICK_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => toggleFilter(filter.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-300 active:scale-95",
                  filters[filter.id]
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-background border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <div className={cn(
                  "w-3 h-3 rounded-[3px] border-[1.5px] flex items-center justify-center transition-colors",
                  filters[filter.id] ? "bg-primary border-primary" : "border-muted-foreground/30"
                )}>
                  {filters[filter.id] && (
                    <svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
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
  );
};
