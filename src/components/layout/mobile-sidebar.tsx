'use client';

import { getPublicCategoriesAction } from '@/actions/category-actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/lib/context/sidebar-context';
import { useOnClickOutside } from '@/lib/hooks/useOnClickOutside';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Grid3X3, Moon, Search, Sun, X, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { activeCategory, setActiveCategory } = useSidebar();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState('');

  // Fetch categories once
  useEffect(() => {
    if (!isOpen || fetchedRef.current) return;
    fetchedRef.current = true;
    getPublicCategoriesAction().then((res) => {
      if (res.success && res.categories) setCategories(res.categories);
    });
  }, [isOpen]);

  // Reset search when sidebar closes
  useEffect(() => {
    if (!isOpen) setCategorySearch('');
  }, [isOpen]);

  // Close on route change
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      if (isOpen) onClose();
    }
  }, [pathname, isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.cssText = `position:fixed;top:-${scrollY}px;width:100%`;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useOnClickOutside(menuRef, onClose);

  // Derived category data
  const rootCategories = useMemo(() => categories.filter((c) => !c.parentId), [categories]);

  const getSubcategories = useCallback(
    (parentId: string) => categories.filter((c) => c.parentId === parentId),
    [categories]
  );

  const filteredRootCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return rootCategories;
    return rootCategories.filter((cat) => {
      if (cat.name.toLowerCase().includes(q)) return true;
      return categories.some((c) => c.parentId === cat.id && c.name.toLowerCase().includes(q));
    });
  }, [rootCategories, categories, categorySearch]);

  const getFilteredSubcategories = useCallback(
    (parentId: string) => {
      const subs = categories.filter((c) => c.parentId === parentId);
      const q = categorySearch.trim().toLowerCase();
      if (!q) return subs;
      const parent = categories.find((c) => c.id === parentId);
      if (parent?.name.toLowerCase().includes(q)) return subs;
      return subs.filter((sub) => sub.name.toLowerCase().includes(q));
    },
    [categories, categorySearch]
  );

  // Auto-expand category whose subcategory matches search
  useEffect(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return;
    const match = rootCategories.find((cat) =>
      categories.some((c) => c.parentId === cat.id && c.name.toLowerCase().includes(q))
    );
    if (match) setActiveCategory(match.id);
  }, [categorySearch, rootCategories, categories, setActiveCategory]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar Panel */}
          <motion.aside
            ref={menuRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 bottom-0 left-0 z-50 w-[85%] max-w-sm bg-background shadow-2xl flex flex-col overflow-hidden"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
              <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
                  <Zap className="h-5 w-5 text-white" fill="currentColor" />
                </div>
                <span className="font-black text-lg tracking-tight text-foreground">
                  Biggest Market<span className="text-primary">.</span>
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-8 w-8 rounded-full bm-interactive"
                  aria-label="Toggle theme"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-9 w-9 rounded-xl bm-interactive"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="h-10 pl-10 pr-8 rounded-xl text-sm bg-muted/50 focus-visible:bg-background transition-all bm-interactive"
                  autoFocus={false}
                />
                {categorySearch && (
                  <button
                    onClick={() => setCategorySearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
              <div className="py-3 px-3">
                <div className="flex items-center justify-between px-3 mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Grid3X3 className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Categories</span>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground/60">
                    {filteredRootCategories.length}
                    {categorySearch ? ` / ${rootCategories.length}` : ''}
                  </span>
                </div>

                {filteredRootCategories.length > 0 ? (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={activeCategory ?? undefined}
                    onValueChange={(val) => setActiveCategory(val || null)}
                  >
                    {filteredRootCategories.map((cat) => {
                      const subs = getFilteredSubcategories(cat.id);
                      const hasSubs = subs.length > 0;

                      return (
                        <AccordionItem key={cat.id} value={cat.id} className="border-none mb-0.5">
                          {hasSubs ? (
                            <>
                              <AccordionTrigger className="py-2.5 px-3 rounded-xl hover:no-underline text-[13px] font-bold text-foreground transition-all group data-[state=open]:bg-muted/30 bm-interactive">
                                <div className="flex items-center gap-2.5">
                                  <div className={cn(
                                    'w-1.5 h-1.5 rounded-full transition-colors',
                                    activeCategory === cat.id ? 'bg-primary' : 'bg-primary/25 group-hover:bg-primary/50'
                                  )} />
                                  <span>{cat.name}</span>
                                  <span className="text-[10px] text-muted-foreground font-normal">
                                    {subs.length}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pb-1 pt-0">
                                  <div className="ml-3 pl-3 border-l-2 border-primary/10 flex flex-col gap-0.5 mt-0.5">
                                    {subs.map((sub) => (
                                      <Link
                                        key={sub.id}
                                        href={`/listings?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(sub.name)}`}
                                        onClick={onClose}
                                        className="py-2.5 px-3 rounded-xl text-[13px] text-muted-foreground hover:text-foreground transition-all font-bold flex items-center justify-between group bm-interactive"
                                      >
                                        <span>{sub.name}</span>
                                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all text-primary" />
                                      </Link>
                                    ))}
                                    <Link
                                      href={`/listings?category=${encodeURIComponent(cat.name)}`}
                                      onClick={onClose}
                                      className="py-2 px-3 rounded-xl text-xs font-black text-primary hover:underline underline-offset-4 transition-all mt-0.5 uppercase tracking-wider"
                                    >
                                      View all {cat.name} →
                                    </Link>
                                  </div>
                              </AccordionContent>
                            </>
                          ) : (
                            <Link
                              href={`/listings?category=${encodeURIComponent(cat.name)}`}
                              onClick={onClose}
                              className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-[13px] font-bold text-foreground transition-all group bm-interactive"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/25 group-hover:bg-primary/50 transition-colors" />
                              <span>{cat.name}</span>
                            </Link>
                          )}
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-[13px] text-muted-foreground font-medium">No categories found</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="group border-t px-4 py-3 shrink-0">
              <Link
                href="/listings"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-card text-foreground text-sm font-bold transition-all bm-interactive"
              >
                <Grid3X3 className="h-4 w-4 group-hover:text-primary transition-colors" />
                Browse All Categories
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}