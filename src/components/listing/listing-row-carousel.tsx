'use client';

import { ListingCard } from '@/components/shared/listing/listing-card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ListingRowCarouselProps {
  title: string;
  listings: any[];
  viewAllHref: string;
}

export const ListingRowCarousel = ({ title, listings, viewAllHref }: ListingRowCarouselProps) => {
  const t = useTranslations('Listings');
  if (listings.length === 0) return null;

  const handleViewAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use full navigation to ensure hub state resets when arriving on the grid
    window.location.assign(viewAllHref);
  };

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <button
          onClick={handleViewAll}
          className="flex items-center gap-1 text-[11px] sm:text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-muted/50 truncate max-w-[120px] sm:max-w-none"
        >
          <span className="truncate">{t('view_all_grid').replace('in Grid', '').replace('во мрежа', '').replace('во Мрежа', '') || 'View All'}</span> <ChevronRight className="h-4 w-4 shrink-0" />
        </button>
      </div>

      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2.5">
          {listings.map((listing) => (
            <CarouselItem
              key={listing._id}
              className="pl-2.5 basis-[70%] xs:basis-[48%] sm:basis-[40%] md:basis-[32%] lg:basis-[25%]"
            >
              <ListingCard listing={listing} viewMode="grid" />
            </CarouselItem>
          ))}

          {/* Last Item: "View All" peek card */}
          <CarouselItem className="pl-2.5 basis-[70%] xs:basis-[48%] sm:basis-[40%] md:basis-[32%] lg:basis-[25%]">
            <button
              className="flex flex-col items-center justify-center w-full h-full aspect-[4/3] rounded-2xl border-2 border-dashed border-border hover:border-primary/30 hover:bg-muted/30 transition-all group cursor-pointer"
              onClick={handleViewAll}
            >
              <div className="w-9 h-9 rounded-full bg-background shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight className="h-5 w-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground text-center px-1 sm:px-2 leading-tight truncate w-full">
                {t('view_all_grid').replace('in Grid', '').replace('во мрежа', '').replace('во Мрежа', '') || 'View All'}
              </span>
            </button>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};
