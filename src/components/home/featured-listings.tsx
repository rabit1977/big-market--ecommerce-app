'use client';

import { Card } from '@/components/ui/card';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  variant?: 'horizontal' | 'vertical';
}


export function FeaturedListings({ listings, variant = 'horizontal' }: FeaturedListingsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');
  
  if (!listings || !Array.isArray(listings)) return null;

  // Limit listings based on variant
  const featuredListings = variant === 'vertical' ? listings.slice(0, 5) : listings.slice(0, 15);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        // ... (scroll logic only relevant for horizontal)
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

  // Vertical (Sidebar) Layout
  if (variant === 'vertical') {
     return (
        <div className="space-y-4 sticky top-24">
             <div className="flex items-center justify-between px-1 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
                        <span className="relative flex h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <h2 className="text-base font-black tracking-tight uppercase text-foreground/80">
                        {tHome('top_boosted')}
                    </h2>
                  </div>
             </div>

             <div className="flex flex-col gap-4">
                 {featuredListings.map((listing) => {
                    const imageUrl = listing.thumbnail || (listing.images && listing.images[0]) || '/placeholder-listing.jpg';
                    const promoConfig = (listing as any).isPromoted ? getPromotionConfig((listing as any).promotionTier) : null;
                    const badgeColor = promoConfig?.badgeColor || "bg-primary";
                    const borderColor = promoConfig?.borderColor || "border-primary/30";
                    const bgColor = promoConfig?.bgColor || "bg-card";
                    
                    return (
                        <div key={listing._id} className="group">
                             <Link href={`/listings/${listing._id}`}>
                                <Card className={cn(
                                    "overflow-hidden border-border/40 hover:border-primary/40 transition-all duration-300 rounded-xl bg-card shadow-sm hover:shadow-xl hover:-translate-y-1",
                                    promoConfig && `ring-1 ring-inset ${borderColor.replace('border-', 'ring-')} ${bgColor.replace('bg-', 'bg-opacity-5 bg-')}`
                                )}>
                                     {/* Image Area - Bigger for Sidebar */}
                                     <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
                                         <Image 
                                            src={imageUrl} 
                                            alt={listing.title} 
                                            fill 
                                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                            sizes="(max-width: 1280px) 25vw, 20vw"
                                         />
                                         
                                         {/* Floating Badge */}
                                         {promoConfig && (
                                            <div className="absolute top-2 left-2 z-10">
                                                <div className={cn(
                                                    "px-2 py-1 rounded-md flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-white/20",
                                                    badgeColor
                                                )}>
                                                    <PromotionIcon iconName={promoConfig.icon} className="w-3 h-3 text-white fill-current" />
                                                    <span className="text-[10px] font-black uppercase text-white tracking-wider">
                                                        {(promoConfig as any).title?.split(' ')[0] || 'PROMO'}
                                                    </span>
                                                </div>
                                            </div>
                                         )}

                                          {/* Price Tag Overlay - Bottom Right */}
                                          <div className="absolute bottom-2 right-2 z-10">
                                              <div className="bg-background/90 backdrop-blur text-foreground px-2 py-1 rounded-md shadow-sm border border-border/50">
                                                  <span className="text-xs font-black">
                                                      {listing.price.toLocaleString()} <span className="text-[9px] font-bold text-muted-foreground">{tCommon('mkd')}</span>
                                                  </span>
                                              </div>
                                          </div>
                                     </div>

                                     {/* Simple Content */}
                                     <div className="p-3 bg-card/50">
                                          <h3 className="text-sm font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-2">
                                              {listing.title}
                                          </h3>
                                          
                                          <div className="flex items-center justify-between text-muted-foreground">
                                              <div className="flex items-center gap-1 text-[10px]">
                                                  <MapPin className="w-3 h-3" />
                                                  {listing.city ? listing.city.split(' ')[0] : 'Skopje'}
                                              </div>
                                              <div className="text-[10px] font-medium opacity-70">
                                                  {tHome('view_deal')} &rarr;
                                              </div>
                                          </div>
                                     </div>
                                </Card>
                             </Link>
                        </div>
                    );
                 })}
             </div>
             
             <Link 
                href="/listings?featured=true" 
                className="flex items-center justify-center w-full py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg border border-dashed border-border hover:border-primary/30 transition-all"
             >
                {tHome('see_all_premium')}
             </Link>
        </div>
     );
  }

  // Horizontal (Default) Layout
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
                 <h2 className="text-lg md:text-xl font-black tracking-tighter uppercase text-foreground">
                    {tHome('top_deals_boosted')}
                 </h2>
              </div>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-80">
                {tHome('premium_community_spotlight')}
              </p>
            </div>

             <Link 
               href="/listings?featured=true" 
               className="inline-flex items-center text-[9px] font-black uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-0.5"
             >
               {tHome('explore_all')}
             </Link>
          </div>
        </div>

        <div className="relative group ">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar pb-2 scroll-smooth snap-x snap-mandatory"
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
                  className="min-w-[200px] w-[190px] sm:min-w-[220px] sm:w-[240px] sm:h-[300px] h-[270px] snap-start"
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
                        "p-2.5 pt-2 space-y-1",
                        (!promoConfig?.bgColor) && "bg-card"
                      )}>
                        <h3 className="font-bold text-[10px] sm:text-[11px] leading-tight line-clamp-1 text-foreground/90 group-hover:text-primary transition-colors">
                          {listing.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                           <span className="text-[11px] sm:text-xs font-black text-primary">
                             {listing.price.toLocaleString()} {tCommon('mkd')}
                           </span>
                           <span className="text-[9px] text-muted-foreground/60 font-bold flex items-center">
                              <MapPin className="w-2.5 h-2.5 mr-0.5" />
                              {listing.city ? listing.city.split(' ')[0] : 'Skopje'}
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
