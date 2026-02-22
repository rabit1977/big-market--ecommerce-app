'use client';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCompareStore } from '@/lib/store/compare-store';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { ArrowLeftRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function CompareButton({ listing, className }: { listing: ListingWithRelations; className?: string }) {
  const { items, addItem, removeItem } = useCompareStore();
  const tCompare = useTranslations('ListingGrid');
  const isCompared = items.some((item: ListingWithRelations) => item._id === listing._id);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCompared) {
      removeItem(listing._id);
      toast.success(tCompare('removed_from_compare'));
    } else {
      if (items.length >= 3) {
        toast.error(tCompare('compare_limit'));
        return;
      }

      // Enforce same category/subcategory rule
      if (items.length > 0) {
        const firstItem = items[0];
        const isSameCategory = firstItem.category === listing.category;
        const isSameSubCategory = firstItem.subCategory === listing.subCategory;

        if (!isSameCategory || !isSameSubCategory) {
          toast.error(tCompare('compare_category_error'));
          return;
        }
      }

      addItem(listing);
      toast.success(tCompare('added_to_compare'));
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleCompare}
            className={cn(
              'h-9 w-9 rounded-full transition-all shrink-0',
              isCompared
                ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                : 'bg-background/80 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-foreground shadow-sm hover:shadow active:scale-95',
              className
            )}
          >
            <ArrowLeftRight className={cn('h-4 w-4 transition-all duration-300', isCompared && 'scale-110')} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isCompared ? tCompare('remove_from_compare') : tCompare('compare')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
