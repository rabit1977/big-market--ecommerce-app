import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MK_LOCATIONS } from '@/lib/locations';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Loader2, MapPin, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isPending: boolean;
  showResults: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onFocus,
      onKeyDown,
      onClear,
      isPending,
      showResults,
      selectedCity,
      onCityChange,
    },
    ref
  ) => {
    const [isCityPanelOpen, setIsCityPanelOpen] = useState(false);
    const [citySearch, setCitySearch] = useState('');
    const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
    const panelRef = useRef<HTMLDivElement>(null);
    const tNav = useTranslations('Navigation');
    const tCommon = useTranslations('Common');

    const closePanel = useCallback(() => {
      setIsCityPanelOpen(false);
      setCitySearch('');
      setExpandedRegions({});
    }, []);

    // Close on click outside
    useEffect(() => {
      if (!isCityPanelOpen) return;
      const handleClick = (e: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          closePanel();
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [isCityPanelOpen, closePanel]);

    // Close on Escape
    useEffect(() => {
      if (!isCityPanelOpen) return;
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closePanel();
      };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }, [isCityPanelOpen, closePanel]);

    // Memoize filtered locations based on MK_LOCATIONS
    const filteredLocations = useMemo(() => {
      const q = citySearch.toLowerCase();
      
      return Object.entries(MK_LOCATIONS).map(([region, municipalities]) => {
        if (!q) {
          return { region, municipalities };
        }
        
        const regionMatch = region.toLowerCase().includes(q);
        const munsMatch = municipalities.filter(m => m.toLowerCase().includes(q));
        
        return {
          region,
          municipalities: regionMatch ? municipalities : munsMatch
        };
      }).filter(item => item.region.toLowerCase().includes(q) || item.municipalities.length > 0);
    }, [citySearch]);

    const handleCitySelect = useCallback((city: string) => {
      onCityChange(city);
      closePanel();
    }, [onCityChange, closePanel]);

    // Portal target — null during SSR, document.body after mount
    const [portalTarget, setPortalTarget] = useState<Element | null>(null);
    useEffect(() => { setPortalTarget(document.body); }, []);

    return (
      <>
        <div className="relative group ">
          {/* Left: Search icon */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center z-20 bg-background pl-2">
            <div className="flex items-center text-muted-foreground">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
          </div>

          <Input
            ref={ref}
            type="search"
            placeholder={tNav('search_placeholder')}
            className="h-9 md:h-10 rounded-lg pl-9 sm:pl-10 pr-24 sm:pr-32 bg-background
                       focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary
                       text-sm placeholder:text-muted-foreground/60
                       [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden
                       transition-all duration-150 shadow-none font-bold uppercase tracking-widest text-[10px] sm:text-xs"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            disabled={isPending}
            aria-label="Search listings"
            aria-expanded={showResults}
            aria-autocomplete="list"
            aria-controls={showResults ? 'search-results' : undefined}
          />

          {/* Right Actions */}
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCityPanelOpen(true)}
              aria-label={`Filter by city. Currently: ${selectedCity === 'all' ? 'All Cities' : selectedCity}`}
              className="h-7.5 md:h-8 px-2.5 md:px-3 rounded-(--bm-button-border-radius) text-muted-foreground hover:text-foreground hover:bg-secondary transition-all bg-background"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs font-medium truncate max-w-[60px] sm:max-w-[80px] hidden md:inline">
                {selectedCity === 'all' ? (tCommon('all_cities') || 'All Cities') : selectedCity}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>

            {value && (
              <button
                onClick={onClear}
                disabled={isPending}
                aria-label="Clear search"
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 rounded-lg hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* City Panel — portaled */}
        {portalTarget && createPortal(
          <AnimatePresence mode="wait">
            {isCityPanelOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                  onClick={closePanel}
                  aria-hidden="true"
                />

                <motion.div
                  ref={panelRef}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed top-0 bottom-0 right-0 z-[60] w-[85%] max-w-sm bg-background shadow-2xl flex flex-col overflow-hidden"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Select city"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="font-bold text-base">{tCommon('select_city') || 'Select City'}</h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closePanel}
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      aria-label="Close city selector"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="px-4 py-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={tCommon('search_cities') || 'Search cities...'}
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="h-9 pl-9 rounded-(--bm-button-border-radius) text-sm bg-background border-none shadow-none focus-visible:ring-0"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto overscroll-contain">
                    <div className="py-2 px-3">
                      <button
                        onClick={() => handleCitySelect('all')}
                        className={cn(
                          'w-full flex items-center gap-3 py-3 px-3 rounded-xl text-sm font-bold transition-all mb-1',
                          selectedCity === 'all'
                            ? 'bg-muted text-foreground hover:bg-muted/50 bm-interactive'
                            : 'text-foreground hover:bg-muted/50 bm-interactive'
                        )}
                      >
                        <div className={cn(
                          'w-2 h-2 rounded-full transition-colors',
                          selectedCity === 'all' ? 'bg-primary' : 'bg-primary/20'
                        )} />
                        {tCommon('all_cities') || 'All Cities'}
                      </button>

                      <div className="h-px bg-border/50 my-2" />

                      {filteredLocations.length > 0 ? (
                        filteredLocations.map(({ region, municipalities }) => {
                          const isExpanded = !!expandedRegions[region] || citySearch.length > 0;
                          
                          return (
                          <div key={region} className="mb-2">
                            <div className="flex items-center">
                              <button
                                onClick={() => handleCitySelect(region)}
                                className={cn(
                                  "flex-1 text-left px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-l-xl",
                                  selectedCity?.toLowerCase() === region.toLowerCase()
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-muted/50"
                                )}
                              >
                                {region}
                              </button>
                              <button
                                onClick={() => setExpandedRegions(prev => ({ ...prev, [region]: !prev[region] }))}
                                className="px-3 py-2 rounded-r-xl hover:bg-muted/50 text-muted-foreground transition-all"
                              >
                                <ChevronDown className={cn("h-4 w-4 transition-transform group-hover:text-primary", isExpanded && "rotate-180")} />
                              </button>
                            </div>
                            
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-1 pb-2 space-y-0.5">

                                    {municipalities.map((city) => (
                                      <button
                                        key={city}
                                        onClick={() => handleCitySelect(city)}
                                        className={cn(
                                          'w-full flex items-center gap-3 py-2 px-4 rounded-(--bm-button-border-radius) text-sm transition-all',
                                          selectedCity?.toLowerCase() === city.toLowerCase()
                                            ? 'bg-primary/10 text-primary font-bold ml-1'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary pl-6 text-sm'
                                        )}
                                      >
                                        {selectedCity?.toLowerCase() === city.toLowerCase() && (
                                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        )}
                                        {city}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )})
                      ) : (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          {tCommon('no_cities_found', { query: citySearch })}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          portalTarget
        )}
      </>
    );
  }
);

SearchInput.displayName = 'SearchInput';