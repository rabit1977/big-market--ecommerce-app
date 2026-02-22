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
import { toast } from 'sonner';

export function CompareButton({ listing, className }: { listing: ListingWithRelations; className?: string }) {
  const { items, addItem, removeItem } = useCompareStore();
  const isCompared = items.some((item: ListingWithRelations) => item._id === listing._id);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCompared) {
      removeItem(listing._id);
      toast.success('Removed from comparison');
    } else {
      if (items.length >= 3) {
        toast.error('You can only compare up to 3 listings at a time.');
        return;
      }
      addItem(listing);
      toast.success('Added to comparison');
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
        <TooltipContent>{isCompared ? 'Remove from Compare' : 'Compare'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
