'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, Download, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'all';

export interface SortOption {
    label: string;
    value: string;
}

export interface AdminFilterToolbarProps {
    // Time range
    timeRange?: TimeRange;
    onTimeRangeChange?: (range: TimeRange) => void;
    showTimeRange?: boolean;

    // Search
    searchValue?: string;
    onSearchChange?: (query: string) => void;
    searchPlaceholder?: string;
    showSearch?: boolean;

    // Sort
    sortValue?: string;
    onSortChange?: (sort: string) => void;
    sortOptions?: SortOption[];
    showSort?: boolean;

    // Export
    onExport?: () => void;
    showExport?: boolean;

    // Extra actions slot
    actions?: React.ReactNode;

    className?: string;
}

const TIME_RANGES: { id: TimeRange; label: string }[] = [
    { id: 'today',  label: 'Today' },
    { id: 'week',   label: '7 Days' },
    { id: 'month',  label: '30 Days' },
    { id: 'year',   label: 'Year' },
    { id: 'all',    label: 'All Time' },
];

/** Returns the Unix-ms timestamp for the start of the given range, or undefined for "all". */
export function getSinceFromRange(range: TimeRange): number | undefined {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
        case 'today':  return d.getTime();
        case 'week':   d.setDate(d.getDate() - 7);  return d.getTime();
        case 'month':  d.setDate(d.getDate() - 30); return d.getTime();
        case 'year':   d.setFullYear(d.getFullYear() - 1); return d.getTime();
        case 'all':    return undefined;
    }
}

export function AdminFilterToolbar({
    timeRange = 'today',
    onTimeRangeChange,
    showTimeRange = true,

    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
    showSearch = true,

    sortValue,
    onSortChange,
    sortOptions = [],
    showSort = false,

    onExport,
    showExport = false,

    actions,
    className,
}: AdminFilterToolbarProps) {
    const [showFiltersPanel, setShowFiltersPanel] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    const clearSearch = useCallback(() => {
        onSearchChange?.('');
        searchRef.current?.focus();
    }, [onSearchChange]);

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {/* Main toolbar row — wraps on small screens */}
            <div className="flex flex-wrap gap-2 items-center">

                {/* Search */}
                {showSearch && (
                    <div className="relative min-w-[180px] flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchValue}
                            onChange={e => onSearchChange?.(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full h-10 pl-10 pr-8 text-sm bg-card border-1 border-card-foreground/20 rounded-xl focus:outline-none focus:border-card-foreground/50 transition-all placeholder:text-muted-foreground font-medium"
                        />
                        {searchValue && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}

                {/* Time range — compact dropdown */}
                {showTimeRange && onTimeRangeChange && (
                    <div className="relative flex items-center gap-1.5 shrink-0">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none z-10" />
                        <select
                            value={timeRange}
                            onChange={e => onTimeRangeChange(e.target.value as TimeRange)}
                            className="h-10 pl-9 pr-8 text-[10px] bg-card border-1 border-card-foreground/20 rounded-xl focus:outline-none focus:border-card-foreground/50 font-black uppercase tracking-widest appearance-none cursor-pointer text-foreground min-w-[110px] transition-all"
                        >
                            {TIME_RANGES.map(r => (
                                <option key={r.id} value={r.id}>{r.label}</option>
                            ))}
                        </select>
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                )}

                {/* Sort */}
                {showSort && sortOptions.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
                        <select
                            value={sortValue}
                            onChange={e => onSortChange?.(e.target.value)}
                            className="h-10 pl-4 pr-9 text-[10px] bg-card border-1 border-card-foreground/20 rounded-xl focus:outline-none focus:border-card-foreground/50 font-black uppercase tracking-widest appearance-none cursor-pointer transition-all"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Export */}
                {showExport && onExport && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onExport}
                        className="h-9 px-3 text-xs font-bold gap-1.5 shrink-0"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                    </Button>
                )}

                {/* custom actions */}
                {actions}
            </div>

            {/* Active filters summary */}
            {(searchValue) && (
                <div className="flex items-center gap-2 flex-wrap">
                    {searchValue && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-secondary text-primary border border-border px-2 py-1 rounded-md">
                            <Search className="w-2.5 h-2.5" />
                            &ldquo;{searchValue}&rdquo;
                            <button onClick={clearSearch} className="ml-0.5 hover:opacity-70">
                                <X className="w-2.5 h-2.5" />
                            </button>
                        </span>
                    )}
                    <button
                        onClick={() => { onSearchChange?.(''); }}
                        className="text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                        <RotateCcw className="w-2.5 h-2.5" /> Clear all
                    </button>
                </div>
            )}
        </div>
    );
}

/** Simple pill pagination component */
export function AdminPagination({
    page,
    totalPages,
    onPageChange,
    className,
}: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    className?: string;
}) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        if (totalPages <= 7) return i + 1;
        if (page <= 4) return i + 1;
        if (page >= totalPages - 3) return totalPages - 6 + i;
        return page - 3 + i;
    });

    return (
        <div className={cn('flex items-center justify-center gap-1 py-4', className)}>
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold disabled:opacity-30 hover:bg-muted/60 transition-colors"
            >
                ‹
            </button>
            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all',
                        p === page
                            ? 'bg-secondary text-primary border border-primary/30 shadow-none'
                            : 'hover:bg-muted/60 text-foreground/70'
                    )}
                >
                    {p}
                </button>
            ))}
            <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold disabled:opacity-30 hover:bg-muted/60 transition-colors"
            >
                ›
            </button>
            <span className="text-xs text-muted-foreground ml-2">
                Page {page} of {totalPages}
            </span>
        </div>
    );
}
