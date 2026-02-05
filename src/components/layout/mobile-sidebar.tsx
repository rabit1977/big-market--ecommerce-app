'use client';

import { getAllCategoriesAction } from '@/actions/listing-actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/lib/context/sidebar-context';
import { useOnClickOutside } from '@/lib/hooks/useOnClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Moon,
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

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      getAllCategoriesAction().then((res) => {
        if (res.success && res.categories) {
          setCategories(res.categories);
        }
      });
    }
  }, [isOpen, categories.length]);

  // Group categories
  const rootCategories = useMemo(() => categories.filter(c => !c.parentId), [categories]);
  const getSubcategories = useCallback((parentId: string) => categories.filter(c => c.parentId === parentId), [categories]);

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

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex'
            onClick={onClose}
            aria-hidden='true'
          />

          <motion.aside
            ref={menuRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed top-0 bottom-0 left-0 z-50 w-[85%] max-w-sm bg-background shadow-2xl flex flex-col overflow-hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between px-6 py-5 border-b shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
              <Link href="/" onClick={onClose} className='flex items-center gap-3 group'>
                <div className='relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md shadow-primary/20'>
                  <Zap className='h-5 w-5 text-white' fill="currentColor" />
                </div>
                <span className='font-bold text-lg tracking-tight text-foreground'>Big Market<span className="text-primary">.</span></span>
              </Link>
              <div className="flex items-center gap-2">
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
                    <X className='h-5 w-5' />
                 </Button>
              </div>
            </div>

            {/* Scrollable content area */}
            <div className='flex-1 overflow-y-auto min-h-0 overscroll-contain'>
              <div className='py-6 px-4 flex flex-col gap-4'>
                {/* Categories Section */}
                <div className="pt-2">
                  <p className='px-4 text-[10px] font-black text-muted-foreground mb-4 uppercase tracking-widest'>
                      Categories
                  </p>
                  <Accordion 
                    type="single" 
                    collapsible 
                    className="w-full"
                    value={activeCategory || undefined}
                    onValueChange={(val) => setActiveCategory(val || null)}
                  >
                      {rootCategories.map((cat) => {
                          const subs = getSubcategories(cat.id);
                          const hasSubs = subs.length > 0;
                          
                          return (
                              <AccordionItem key={cat.id} value={cat.id} className="border-none mb-1">
                                  {hasSubs ? (
                                      <>
                                          <AccordionTrigger className="py-3 px-4 rounded-xl hover:bg-muted/50 text-sm font-bold hover:no-underline text-foreground transition-all group">
                                              <div className="flex items-center gap-3">
                                                  <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                                  <span>{cat.name}</span>
                                              </div>
                                          </AccordionTrigger>
                                          <AccordionContent className="pb-1 pt-0">
                                              <div className="ml-4 pl-4 border-l border-border/50 flex flex-col gap-1 mt-1">
                                                  {subs.map(sub => (
                                                      <Link 
                                                          key={sub.id}
                                                          href={`/listings?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(sub.name)}`}
                                                          onClick={onClose}
                                                          className="py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all font-medium flex items-center justify-between group"
                                                      >
                                                          <span>{sub.name}</span>
                                                          <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                      </Link>
                                                  ))}
                                                  <Link 
                                                      href={`/listings?category=${encodeURIComponent(cat.name)}`}
                                                      onClick={onClose}
                                                      className="py-2 px-3 rounded-lg text-xs font-bold text-primary hover:underline mt-1"
                                                  >
                                                      View all in {cat.name}
                                                  </Link>
                                              </div>
                                          </AccordionContent>
                                      </>
                                  ) : (
                                      <Link 
                                          href={`/listings?category=${encodeURIComponent(cat.name)}`}
                                          onClick={onClose}
                                          className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-bold text-foreground hover:bg-muted/50 transition-all group"
                                      >
                                          <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                          <span>{cat.name}</span>
                                      </Link>
                                  )}
                              </AccordionItem>
                          );
                      })}
                  </Accordion>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
