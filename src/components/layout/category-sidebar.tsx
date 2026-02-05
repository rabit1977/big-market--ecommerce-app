'use client';

import { getAllCategoriesAction } from '@/actions/listing-actions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]); // Stack of parent IDs

  useEffect(() => {
    if (open && categories.length === 0) {
      getAllCategoriesAction().then((res) => {
        if (res.success && res.categories) {
            setCategories(res.categories.map(c => ({
              ...c,
              parentId: c.parentId ?? null
            })));
        }
      });
    }
  }, [open, categories.length]);

  const currentCategories = useMemo(() => {
    return categories.filter((c) => c.parentId === currentParentId);
  }, [categories, currentParentId]);

  const handleCategoryClick = (category: Category) => {
    const hasChildren = categories.some((c) => c.parentId === category.id);

    if (hasChildren) {
      // Drill down
      setHistory([...history, currentParentId ?? 'root']);
      setCurrentParentId(category.id);
    } else {
      // Navigate
      setOpen(false);
      
      const parent = categories.find(c => c.id === category.parentId);
      if (parent) {
          router.push(`/listings?category=${encodeURIComponent(parent.name)}&subCategory=${encodeURIComponent(category.name)}`);
      } else {
          router.push(`/listings?category=${encodeURIComponent(category.name)}`);
      }
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prev = newHistory.pop();
    setHistory(newHistory);
    setCurrentParentId(prev === 'root' ? null : prev || null);
  };

  const currentParentName = useMemo(() => {
      if (!currentParentId) return 'All Categories';
      return categories.find(c => c.id === currentParentId)?.name;
  }, [currentParentId, categories]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={handleBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
                <SheetTitle className="text-base font-bold">{currentParentName}</SheetTitle>
            </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-65px)]">
            <div className="flex flex-col p-2">
                {currentCategories.map((category) => {
                    const hasChildren = categories.some(c => c.parentId === category.id);
                    return (
                        <Button
                            key={category.id}
                            variant="ghost"
                            className={cn(
                                "justify-between w-full text-left h-auto py-3 px-4 rounded-xl hover:bg-muted/50 transition-all font-medium",
                                !hasChildren && "text-muted-foreground font-normal"
                            )}
                            onClick={() => handleCategoryClick(category)}
                        >
                            <span>{category.name}</span>
                            {hasChildren && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                    );
                })}
                
                {currentCategories.length === 0 && categories.length > 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                        No subcategories found.
                    </div>
                )}
                 {categories.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                        Loading categories...
                    </div>
                )}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
