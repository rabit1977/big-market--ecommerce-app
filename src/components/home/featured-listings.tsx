'use client';

import { Card } from '@/components/ui/card';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { PromotionIcon } from '../listing/promotion-icon';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  thumbnail?: string;
  city: string;
  status: string;
  createdAt: number;
  viewCount?: number;
  _creationTime: number;
  isPromoted?: boolean;
  promotionTier?: string;
  promotionExpiresAt?: number;
}

interface FeaturedListingsProps {
  listings: Listing[];
}


export function FeaturedListings({ listings }: FeaturedListingsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  
  if (!listings || !Array.isArray(listings)) return null;

  const featuredListings = listings.slice(0, 15);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const totalItems = featuredListings.length;
        // Simplified dot calculation
        const scrollPercent = scrollLeft / (scrollWidth - clientWidth || 1);
        const dotIndex = Math.min(Math.round(scrollPercent * 4), 4);
        setActiveDot(isNaN(dotIndex) ? 0 : dotIndex);
    }
  };

  const scrollToDot = (index: number) => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const targetScroll = (index / 4) * (scrollWidth - clientWidth);
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      setActiveDot(index);
    }
  };

  if (featuredListings.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-primary/5 via-transparent to-transparent">
      <div className="container-wide py-5 sm:py-8">
        <div className="flex flex-col gap-4 mb-5 sm:mb-8 px-0">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
               <div className="flex items-center gap-2">
                 <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
                    <span className="relative flex h-2 w-2 rounded-full bg-primary" />
                 </div>
                 <h2 className="text-lg md:text-xl font-black tracking-tighter uppercase italic text-foreground">
                    Top Deals & Boosted
                 </h2>
              </div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-80">
                Premium Community Spotlight
              </p>
            </div>

             <Link 
               href="/listings?featured=true" 
               className="inline-flex items-center text-[9px] font-black uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-0.5"
             >
               Explore All
             </Link>
          </div>
        </div>

        <div className="relative group">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth snap-x snap-mandatory"
          >
            {featuredListings.map((listing) => {
              const imageUrl = listing.thumbnail || (listing.images && listing.images[0]) || '/placeholder-listing.jpg';
              // Use centralized config
              const promoConfig = (listing as any).isPromoted ? getPromotionConfig((listing as any).promotionTier) : null;
              
              // Fallback styles if promoConfig is missing but listing isPromoted (shouldn't happen often)
              const badgeColor = promoConfig?.badgeColor || "bg-primary";
              const borderColor = promoConfig?.borderColor || "border-primary/30";
              const bgColor = promoConfig?.bgColor || "bg-card";

              return (
                <div 
                  key={listing._id} 
                  className="min-w-[120px] w-[120px] sm:min-w-[150px] sm:w-[150px] snap-start"
                >
                  <Link href={`/listings/${listing._id}`}>
                    <Card className={cn(
                        "group relative h-full overflow-hidden border-border/40 p-0 hover:border-primary/30 transition-all duration-500 rounded-xl bg-card shadow-sm hover:shadow-lg",
                        promoConfig && `ring-1 ring-inset ${borderColor.replace('border-', 'ring-')} ${bgColor.replace('bg-', 'bg-opacity-10 bg-')}`
                    )}>
                      {/* Image - Flush and fixed height */}
                      <div className={cn(
                        "relative aspect-[4/3] overflow-hidden -mt-px -mx-px bg-muted"
                      )}>
                        <Image
                          src={imageUrl}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Icon Badge - Top Left inside image */}
                        {promoConfig && (
                          <div className="absolute top-1.5 left-1.5 z-20">
                             <div className={cn(
                                 "w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 transition-transform group-hover:scale-110",
                                 badgeColor
                             )}>
                                <div className="text-white">
                                    <PromotionIcon iconName={promoConfig.icon} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                                </div>
                             </div>
                          </div>
                        )}
                      </div>

                      {/* Ultra Compact Info */}
                      <div className={cn(
                        "p-2 pt-1.5 space-y-0.5",
                        (!promoConfig?.bgColor) && "bg-card"
                      )}>
                        <h3 className="font-bold text-[9px] leading-tight line-clamp-1 text-foreground/80 group-hover:text-primary transition-colors">
                          {listing.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-primary">
                             {listing.price.toLocaleString()} MKD
                           </span>
                           <span className="text-[8px] text-muted-foreground/60 font-bold flex items-center">
                              <MapPin className="w-2 h-2 mr-0.5" />
                              {listing.city.split(' ')[0]}
                           </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* New Modern Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
             {[...Array(5)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => scrollToDot(i)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300 cursor-pointer",
                    activeDot === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )} 
                />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
