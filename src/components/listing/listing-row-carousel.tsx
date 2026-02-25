'use client';

import { ListingCard } from '@/components/shared/listing/listing-card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ListingRowCarouselProps {
  title: string;
  listings: any[];
  viewAllHref: string;
}

export const ListingRowCarousel = ({ title, listings, viewAllHref }: ListingRowCarouselProps) => {
  if (listings.length === 0) return null;

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-bold">
          <Link href={viewAllHref} className="flex items-center gap-1">
            Browse All <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-3">
          {listings.map((listing) => (
            <CarouselItem 
              key={listing._id} 
              className="pl-2 md:pl-3 basis-[45%] xs:basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
            >
              <ListingCard listing={listing} viewMode="grid" />
            </CarouselItem>
          ))}
          {/* Last Item: Peek to View All */}
          <CarouselItem className="pl-2 md:pl-3 basis-[45%] xs:basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
              <Link 
                href={viewAllHref}
                className="flex flex-col items-center justify-center h-full aspect-square rounded-2xl border-2 border-dashed border-border hover:border-muted-foreground/30 hover:bg-muted/30 transition-all group"
              >
                  <div className="w-8 h-8 rounded-full bg-background shadow-xs flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <ChevronRight className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">View All</span>
              </Link>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};
