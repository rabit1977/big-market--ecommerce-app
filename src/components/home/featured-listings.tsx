'use client';

import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
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
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');

  if (!listings || !Array.isArray(listings)) return null;

  // Limit listings based on variant
  const featuredListings = variant === 'vertical' ? listings.slice(0, 5) : listings.slice(0, 15);

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
            </div>

             <Link 
               href="/listings?featured=true" 
               className="inline-flex items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground border px-3 py-1.5 rounded-full border-muted-foreground/20 hover:border-primary transition-all"
             >

               {tHome('explore_all')}
             </Link>
          </div>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredListings.map((listing) => {
                const imageUrl = listing.thumbnail || (listing.images && listing.images[0]) || '/placeholder-listing.jpg';
                const promoConfig = (listing as any).isPromoted ? getPromotionConfig((listing as any).promotionTier) : null;
                
                const badgeColor = promoConfig?.badgeColor || "bg-primary";
                const borderColor = promoConfig?.borderColor || "border-primary/10";
                const bgColor = promoConfig?.bgColor || "bg-card";

                return (
                  <CarouselItem 
                    key={listing._id} 
                    className="pl-4 basis-[42%] xs:basis-[38%] sm:basis-[28%] md:basis-[22%] lg:basis-[18%]"
                  >
                    <Link href={`/listings/${listing._id}`} className="block h-full">
                      <Card className={cn(
                          "group h-full flex flex-col overflow-hidden border-border/30 hover:border-primary/20 transition-all duration-500 rounded-2xl bg-card shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1",
                          promoConfig && `ring-[0.5px] ring-inset ${borderColor.replace('border-', 'ring-')} ${bgColor.replace('bg-', 'bg-opacity-5 bg-')}`
                      )}>
                        {/* Image - Smooth eBay style */}
                        <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-[#f8f8f8]">
                          <Image
                            src={imageUrl}
                            alt={listing.title}
                            fill
                            className="object-cover mix-blend-multiply transition-all duration-700 ease-out group-hover:scale-110"
                            sizes="(max-width: 768px) 40vw, 20vw"
                          />
                          
                          {/* Premium Minimal Badge */}
                          {promoConfig && (
                            <div className="absolute top-1 left-1 z-20">
                               <div className={cn(
                                   "w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center shadow-sm backdrop-blur-md border border-white/40 transition-transform group-hover:rotate-6",
                                   badgeColor
                               )}>
                                  <PromotionIcon iconName={promoConfig.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-current" />
                               </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="px-3 pb-1 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h3 className="font-bold text-[10px] sm:text-[12px] leading-tight line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors">
                              {listing.title}
                            </h3>
                          </div>
                          
                          <div className="space-y-1">
                             <div className="text-[13px] sm:text-base font-black tracking-tight text-foreground">
                               {listing.price.toLocaleString()} <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">{tCommon('mkd')}</span>
                             </div>
                             <div className="flex items-center text-[10px] text-muted-foreground/80 font-medium">
                                <MapPin className="w-3 h-3 mr-0.5" />
                                {listing.city ? listing.city.split(' ')[0] : 'Skopje'}
                             </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
