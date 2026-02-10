'use client';

import { getAllCategoriesAction } from '@/actions/listing-actions';
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
import {
    ChevronRight,
    Grid3X3,
    Moon,
    Search,
    Sun,
    X,
    Zap
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';


interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { activeCategory, setActiveCategory } = useSidebar();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const previousOpenState = useRef(isOpen);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; parentId?: string | null }[]>([]);
  const [categorySearch, setCategorySearch] = useState('');

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      getAllCategoriesAction().then((res) => {
        if (res.success && res.categories) {
          setCategories(res.categories);
        }
      });
    }
  }, [isOpen, categories.length]);

  // Reset search when sidebar closes
  useEffect(() => {
    if (!isOpen) setCategorySearch('');
  }, [isOpen]);

  // Group categories
  const rootCategories = useMemo(() => categories.filter(c => !c.parentId), [categories]);
  const getSubcategories = useCallback((parentId: string) => categories.filter(c => c.parentId === parentId), [categories]);

  // Filter categories based on search
  const filteredRootCategories = useMemo(() => {
    if (!categorySearch.trim()) return rootCategories;
    const query = categorySearch.toLowerCase();
    return rootCategories.filter(cat => {
      // Match root category name
      if (cat.name.toLowerCase().includes(query)) return true;
      // Match any subcategory name
      const subs = categories.filter(c => c.parentId === cat.id);
      return subs.some(sub => sub.name.toLowerCase().includes(query));
    });
  }, [rootCategories, categories, categorySearch]);

  // Get filtered subcategories (highlight matching ones)
  const getFilteredSubcategories = useCallback((parentId: string) => {
    const subs = categories.filter(c => c.parentId === parentId);
    if (!categorySearch.trim()) return subs;
    const query = categorySearch.toLowerCase();
    // If parent matches, show all subs; otherwise only matching subs
    const parent = categories.find(c => c.id === parentId);
    if (parent && parent.name.toLowerCase().includes(query)) return subs;
    return subs.filter(sub => sub.name.toLowerCase().includes(query));
  }, [categories, categorySearch]);

  // Auto-expand matching categories when searching
  useEffect(() => {
    if (categorySearch.trim()) {
      const query = categorySearch.toLowerCase();
      const matchingParent = rootCategories.find(cat => {
        const subs = categories.filter(c => c.parentId === cat.id);
        return subs.some(sub => sub.name.toLowerCase().includes(query));
      });
      if (matchingParent) {
        setActiveCategory(matchingParent.id);
      }
    }
  }, [categorySearch, rootCategories, categories, setActiveCategory]);

  // Close menu on path change
  useEffect(() => {
    if (previousOpenState.current && isOpen) {
      startTransition(() => onClose());
    }
    previousOpenState.current = isOpen;
  }, [pathname, isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  useOnClickOutside(menuRef, onClose);

  const totalCategories = rootCategories.length;

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
            onClick={onClose}
            aria-hidden='true'
          />

          {/* Sidebar Panel */}
          <motion.aside
            ref={menuRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed top-0 bottom-0 left-0 z-50 w-[85%] max-w-sm bg-background shadow-2xl flex flex-col overflow-hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between px-5 py-4 border-b shrink-0'>
              <Link href="/" onClick={onClose} className='flex items-center gap-2.5 group'>
                <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20'>
                  <Zap className='h-4 w-4 text-white' fill="currentColor" />
                </div>
                <span className='font-bold text-base tracking-tight text-foreground'>Big Market<span className="text-primary">.</span></span>
              </Link>
              <div className="flex items-center gap-1">
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="h-8 w-8 rounded-full hover:bg-muted"
                 >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                 </Button>
                 <Button
                    variant='ghost'
                    size='icon'
                    onClick={onClose}
                    className='h-8 w-8 rounded-full hover:bg-muted'
                 >
                    <X className='h-4 w-4' />
                 </Button>
              </div>
            </div>

            {/* Search Categories */}
            <div className='px-4 py-3 border-b'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search categories...'
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className='h-9 pl-9 pr-8 rounded-lg text-sm bg-muted/50 border-border/50'
                  autoFocus={false}
                />
                {categorySearch && (
                  <button 
                    onClick={() => setCategorySearch('')}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  >
                    <X className='h-3.5 w-3.5' />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Categories */}
            <div className='flex-1 overflow-y-auto min-h-0 overscroll-contain'>
              <div className='py-3 px-3'>
                {/* Section Header */}
                <div className='flex items-center justify-between px-3 mb-3'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Grid3X3 className='h-3.5 w-3.5' />
                    <span className='text-[10px] font-black uppercase tracking-widest'>
                      Categories
                    </span>
                  </div>
                  <span className='text-[10px] font-semibold text-muted-foreground/60'>
                    {filteredRootCategories.length}{categorySearch ? ` / ${totalCategories}` : ''}
                  </span>
                </div>

                {filteredRootCategories.length > 0 ? (
                  <Accordion 
                    type="single" 
                    collapsible 
                    className="w-full"
                    value={activeCategory || undefined}
                    onValueChange={(val) => setActiveCategory(val || null)}
                  >
                    {filteredRootCategories.map((cat) => {
                      const subs = categorySearch ? getFilteredSubcategories(cat.id) : getSubcategories(cat.id);
                      const hasSubs = subs.length > 0;
                      
                      return (
                        <AccordionItem key={cat.id} value={cat.id} className="border-none mb-0.5">
                          {hasSubs ? (
                            <>
                              <AccordionTrigger className="py-2.5 px-3 rounded-xl hover:bg-muted/50 text-sm font-semibold hover:no-underline text-foreground transition-all group data-[state=open]:bg-muted/30">
                                <div className="flex items-center gap-2.5">
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-colors",
                                    activeCategory === cat.id ? "bg-primary" : "bg-primary/25 group-hover:bg-primary/50"
                                  )} />
                                  <span>{cat.name}</span>
                                  <span className='text-[10px] text-muted-foreground/50 font-normal'>
                                    {subs.length}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pb-1 pt-0">
                                <div className="ml-3 pl-3 border-l border-border/40 flex flex-col gap-0.5 mt-0.5">
                                  {subs.map(sub => (
                                    <Link 
                                      key={sub.id}
                                      href={`/listings?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(sub.name)}`}
                                      onClick={onClose}
                                      className="py-2 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all font-medium flex items-center justify-between group"
                                    >
                                      <span>{sub.name}</span>
                                      <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                  ))}
                                  <Link 
                                    href={`/listings?category=${encodeURIComponent(cat.name)}`}
                                    onClick={onClose}
                                    className="py-1.5 px-3 rounded-lg text-xs font-bold text-primary hover:bg-primary/5 transition-colors mt-0.5"
                                  >
                                    View all in {cat.name} →
                                  </Link>
                                </div>
                              </AccordionContent>
                            </>
                          ) : (
                            <Link 
                              href={`/listings?category=${encodeURIComponent(cat.name)}`}
                              onClick={onClose}
                              className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/50 transition-all group"
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
                  <div className='text-center py-8'>
                    <Search className='h-8 w-8 text-muted-foreground/30 mx-auto mb-2' />
                    <p className='text-sm text-muted-foreground'>No categories found</p>
                    <p className='text-xs text-muted-foreground/60 mt-1'>Try a different search term</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer: Browse All */}
            <div className='border-t px-4 py-3 shrink-0'>
              <Link
                href='/listings'
                onClick={onClose}
                className='flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary text-sm font-bold transition-colors'
              >
                <Grid3X3 className='h-4 w-4' />
                Browse All Categories
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
