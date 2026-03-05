'use client';

import { ListingCard } from '@/components/shared/listing/listing-card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';

interface ListingRowCarouselProps {
  title: string;
  listings: any[];
  viewAllHref: string;
}

export const ListingRowCarousel = ({ title, listings, viewAllHref }: ListingRowCarouselProps) => {
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
          className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/50"
        >
          View All <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-3">
          {listings.map((listing) => (
            <CarouselItem
              key={listing._id}
              className="pl-1 sm:pl-2 md:pl-3 basis-[45%] xs:basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
            >
              <ListingCard listing={listing} viewMode="grid" />
            </CarouselItem>
          ))}

          {/* Last Item: "View All" peek card */}
          <CarouselItem className="pl-1 sm:pl-2 md:pl-3 basis-[45%] xs:basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
            <button
              className="flex flex-col items-center justify-center w-full h-full aspect-[4/3] rounded-2xl border-2 border-dashed border-border hover:border-primary/30 hover:bg-muted/30 transition-all group cursor-pointer"
              onClick={handleViewAll}
            >
              <div className="w-9 h-9 rounded-full bg-background shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground text-center px-2 leading-tight">
                View All
              </span>
            </button>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};
