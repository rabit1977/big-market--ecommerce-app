'use client';

import { getPublicCategoriesAction } from '@/actions/category-actions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export function CategorySidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Fetch once — guard against re-fetching on close/reopen
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;
    setIsLoading(true);
    getPublicCategoriesAction()
      .then((res) => {
        if (res.success && res.categories) {
          setCategories(
            res.categories.map((c) => ({ ...c, parentId: c.parentId ?? null }))
          );
        }
      })
      .finally(() => setIsLoading(false));
  }, [open]);

  // Pre-compute a child-lookup set for O(1) hasChildren checks
  const parentIds = useMemo(
    () => new Set(categories.map((c) => c.parentId).filter(Boolean)),
    [categories]
  );

  const currentCategories = useMemo(
    () => categories.filter((c) => c.parentId === currentParentId),
    [categories, currentParentId]
  );

  const currentParentName = useMemo(() => {
    if (!currentParentId) return 'All Categories';
    return categories.find((c) => c.id === currentParentId)?.name ?? 'All Categories';
  }, [currentParentId, categories]);

  const handleCategoryClick = (category: Category) => {
    const hasChildren = parentIds.has(category.id);

    if (hasChildren) {
      setHistory((prev) => [...prev, currentParentId ?? 'root']);
      setCurrentParentId(category.id);
    } else {
      setOpen(false);
      // Reset drill-down state for next open
      setHistory([]);
      setCurrentParentId(null);

      const parent = categories.find((c) => c.id === category.parentId);
      if (parent) {
        router.push(
          `/listings?category=${encodeURIComponent(parent.name)}&subCategory=${encodeURIComponent(category.name)}`
        );
      } else {
        router.push(`/listings?category=${encodeURIComponent(category.name)}`);
      }
    }
  };

  const handleBack = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const prevId = next.pop()!;
      setCurrentParentId(prevId === 'root' ? null : prevId);
      return next;
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    // Reset drill-down state when sheet is closed
    if (!nextOpen) {
      setHistory([]);
      setCurrentParentId(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hidden md:flex">
          <Menu className="h-5 w-5" />
          <span className="font-semibold">Categories</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 text-left bg-muted/10">
          <div className="flex items-center gap-2">
            {currentParentId && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2"
                onClick={handleBack}
                aria-label="Go back"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <SheetTitle className="text-base font-bold">{currentParentName}</SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="flex flex-col p-2">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Loading categories...
              </div>
            ) : currentCategories.length === 0 && categories.length > 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No subcategories found.
              </div>
            ) : (
              currentCategories.map((category) => {
                const hasChildren = parentIds.has(category.id);
                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={cn(
                      'justify-between w-full text-left h-auto py-3 px-4 rounded-xl hover:bg-muted/50 transition-all font-medium',
                      !hasChildren && 'text-muted-foreground font-normal'
                    )}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <span>{category.name}</span>
                    {hasChildren && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}