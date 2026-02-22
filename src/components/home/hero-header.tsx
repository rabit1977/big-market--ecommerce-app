'use client';

import { cn } from '@/lib/utils';
import { LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

// Filter definitions with Macedonian labels
const QUICK_FILTERS = [
  { id: 'forSale', defaultChecked: true },
  { id: 'wanted', defaultChecked: true },
  { id: 'forRent', defaultChecked: false },
  { id: 'rentWanted', defaultChecked: false },
  { id: 'trade', defaultChecked: true },
  { id: 'used', defaultChecked: true },
  { id: 'new', defaultChecked: true },
  { id: 'shipping', defaultChecked: false },
  { id: 'vat', defaultChecked: false },
];

export const HeroHeader = () => {
  const [showFilters, setShowFilters] = useState(false);
  const tHome = useTranslations('Home');
  const tFilters = useTranslations('QuickFilters');
  
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
        <div className="flex items-center justify-between gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-1">
          
          {/* Categories Button - Rounded Pill */}
          <Link 
            href="/categories"
            className="group flex items-center justify-center gap-2 px-3 py-1.5 md:py-2 rounded-full border border-border bg-background shadow-sm hover:border-primary/30 hover:bg-muted transition-all duration-300 shrink-0"
          >
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <LayoutGrid className="w-3 h-3 text-primary" />
            </div>
            <span className="text-[11px] md:text-xs font-bold tracking-tight text-foreground uppercase whitespace-nowrap">{tHome('explore_categories')}</span>
          </Link>

          {/* Filters Section */}
          <div className="flex items-center justify-end shrink-0">
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
              <span className="text-[11px] font-bold uppercase tracking-tight">{tHome('quick_filters')}</span>
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
                {tFilters(filter.id)}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
