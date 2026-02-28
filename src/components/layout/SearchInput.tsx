import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CITIES } from '@/lib/constants/cities';
import { useSidebar } from '@/lib/context/sidebar-context';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Loader2, MapPin, Menu, Search, X } from 'lucide-react';
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
    const { toggle } = useSidebar();
    const [isCityPanelOpen, setIsCityPanelOpen] = useState(false);
    const [citySearch, setCitySearch] = useState('');
    const panelRef = useRef<HTMLDivElement>(null);
    const tNav = useTranslations('Navigation');
    const tCommon = useTranslations('Common');

    const closePanel = useCallback(() => {
      setIsCityPanelOpen(false);
      setCitySearch('');
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

    // Memoize filtered cities — CITIES is a large constant array
    const filteredCities = useMemo(() =>
      CITIES.filter(
        (c) => c !== 'All Cities' && c.toLowerCase().includes(citySearch.toLowerCase())
      ),
      [citySearch]
    );

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
          {/* Left: Menu + Search icon */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center z-20 bg-card">
            <button
              type="button"
              onClick={toggle}
              className="p-1.5 md:p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary bm-interactive transition-all duration-150"
              aria-label="Open categories menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="w-px h-4 bg-border mx-0.5 hidden sm:block" />
            <div className="hidden sm:flex items-center text-muted-foreground pl-1">
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
            className="h-9 md:h-10 rounded-lg pl-10 sm:pl-16 pr-24 sm:pr-32 bg-input bg-card bm-interactive
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
              className="h-7.5 md:h-8 px-2.5 md:px-3 rounded-(--bm-button-border-radius) text-muted-foreground hover:text-foreground hover:bg-secondary transition-all bm-interactive bg-background"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs font-medium truncate max-w-[60px] sm:max-w-[80px] hidden sm:inline">
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

                  <div className="px-4 py-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={tCommon('search_cities') || 'Search cities...'}
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="h-9 pl-9 rounded-(--bm-button-border-radius) text-sm bg-background bm-interactive"
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
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-muted/50'
                        )}
                      >
                        <div className={cn(
                          'w-2 h-2 rounded-full transition-colors',
                          selectedCity === 'all' ? 'bg-primary' : 'bg-primary/20'
                        )} />
                        {tCommon('all_cities') || 'All Cities'}
                      </button>

                      <div className="h-px bg-border/50 my-2" />

                      {filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className={cn(
                              'w-full flex items-center gap-3 py-2.5 px-3 rounded-(--bm-button-border-radius) text-sm font-medium transition-all bm-interactive',
                              selectedCity === city
                                ? 'bg-secondary text-foreground font-bold'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            )}
                          >
                            <div className={cn(
                              'w-1.5 h-1.5 rounded-full transition-colors',
                              selectedCity === city ? 'bg-primary' : 'bg-muted-foreground/30'
                            )} />
                            {city}
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          No cities found for &ldquo;{citySearch}&rdquo;
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