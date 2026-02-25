'use client';

import { PromotionIcon } from '@/components/shared/listing/promotion-icon';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { useFavorites } from '@/lib/context/favorites-context';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';
import { Heart, MapPin, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  previousPrice?: number;
  currency?: string;
  condition?: string;
  category: string;
  images: string[];
  thumbnail?: string;
  city: string;
  status: string;
  createdAt: number;
  viewCount?: number;
  _creationTime: number;
  isPromoted?: boolean;
  isVerified?: boolean;
  promotionTier?: string;
  promotionExpiresAt?: number;
}

interface FeaturedListingsProps {
  listings: Listing[];
  variant?: 'horizontal' | 'vertical';
  title?: string;
}

export function FeaturedListings({ listings, variant = 'horizontal', title }: FeaturedListingsProps) {
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!listings || !Array.isArray(listings)) return null;

  // Limit listings based on variant
  const featuredListings = variant === 'vertical' ? listings.slice(0, 5) : listings.slice(0, 15);

  if (featuredListings.length === 0) {
    return null;
  }

  // Vertical (Sidebar) Layout
  if (variant === 'vertical') {
     return (
        <div className="space-y-3 sticky top-24">
             <div className="flex items-center justify-between px-1 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-foreground/10 rounded-full animate-ping scale-150" />
                        <span className="relative flex h-2 w-2 rounded-full bg-foreground" />
                    </div>
                    <h2 className="text-base font-black tracking-tight uppercase text-foreground/80">
                        {title || tHome('top_boosted')}
                    </h2>
                  </div>
             </div>

             <div className="flex flex-col gap-4">
                 {featuredListings.map((listing) => {
                    const imageUrl = listing.thumbnail || (listing.images && listing.images[0]) || '/placeholder-listing.jpg';
                    const promoConfig = (listing as any).isPromoted ? getPromotionConfig((listing as any).promotionTier) : null;
                    const badgeColor = promoConfig?.badgeColor || "bg-muted-foreground";
                    const borderColor = promoConfig?.borderColor || "border-border";
                    const bgColor = promoConfig?.bgColor || "bg-card";
                    
                    return (
                        <div key={listing._id} className="group">
                             <Link href={`/listings/${listing._id}`}>
                                <Card className={cn(
                                    "p-0 overflow-hidden border-border/40 hover:border-foreground/20 transition-all duration-300 rounded-xl bg-card shadow-sm hover:shadow-xl hover:-translate-y-1",
                                    promoConfig && `ring-1 ring-inset ring-border ${bgColor.replace('bg-', 'bg-opacity-5 bg-')}`
                                )}>
                                     {/* Image Area - Added flex-none, block, m-0, p-0 to kill all gaps */}
                                     <div className="relative aspect-[4/3] w-full flex-none block m-0 p-0 overflow-hidden bg-white">
                                         <Image 
                                            src={imageUrl} 
                                            alt={listing.title} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                            sizes="(max-width: 1280px) 25vw, 20vw"
                                         />
                                         
                                         {/* Floating Badges */}
                                         <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                                            {promoConfig && (
                                                <div className={cn(
                                                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20",
                                                    promoConfig.badgeColor
                                                )}>
                                                    <PromotionIcon iconName={promoConfig.icon} className="w-4 h-4 text-white fill-current" />
                                                </div>
                                            )}
                                            {listing.isVerified && (
                                                <div className="bg-[#0053a0] text-white rounded-full p-1.5 shadow-md">
                                                    <ShieldCheck className="h-4 w-4" />
                                                </div>
                                            )}
                                         </div>

                                          {/* Price Tag Overlay - Bottom Right */}
                                          <div className="absolute bottom-2 right-2 z-10">
                                              <div className="bg-background/90 backdrop-blur text-foreground px-2 py-1 rounded-md shadow-sm border border-border/50">
                                                  <span className="text-xs font-black">
                                                      {formatCurrency(listing.price, listing.currency)}
                                                  </span>
                                              </div>
                                          </div>
                                     </div>

                                     {/* Simple Content */}
                                     <div className="p-3 bg-card/50">
                                          <h3 className="text-sm font-bold line-clamp-2 leading-snug group-hover:underline decoration-foreground/30 underline-offset-2 transition-all text-foreground mb-2">
                                              {listing.title}
                                          </h3>
                                          
                                          <div className="flex items-center justify-between text-muted-foreground">
                                              <div className="flex items-center gap-1 text-[10px]">
                                                  <MapPin className="w-3 h-3 text-primary" />
                                                  {listing.city ? listing.city.split(' ')[0] : 'Skopje'}
                                              </div>
                                              <div className="text-[10px] font-medium opacity-70 italic">
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
                className="flex items-center justify-center w-full py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg border border-dashed border-border hover:border-muted-foreground/30 transition-all"
             >
                {tHome('see_all_premium')}
             </Link>
        </div>
     );
  }

  // Horizontal (Default) Layout - Repurposed to look like eBay
  return (
    <div className="w-full overflow-hidden">
      <div className="container-wide py-6 sm:py-10">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title || tHome('top_deals_boosted')}
            </h2>

             <Link 
               href="/listings?featured=true" 
               className="text-sm font-semibold text-foreground/80 hover:underline underline-offset-4 transition-all"
             >
               {tHome('explore_all')}
             </Link>
          </div>
        </div>

        <div className="relative group/carousel">
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 sm:-ml-5">
              {featuredListings.map((listing) => {
                const imageUrl = listing.thumbnail || (listing.images && listing.images[0]) || '/placeholder-listing.jpg';
                const isWished = isFavorite(listing._id);
                
                const handleToggleWishlist = (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(listing._id);
                };

                const hasDiscount = listing.previousPrice && listing.previousPrice > listing.price;
                const discountPercent = hasDiscount ? Math.round(((listing.previousPrice! - listing.price) / listing.previousPrice!) * 100) : 0;

                return (
                  <CarouselItem 
                    key={listing._id} 
                    className="pl-3 sm:pl-5 basis-[46%] xs:basis-[42%] sm:basis-[30%] md:basis-[22%] lg:basis-[18%]"
                  >
                    <Link href={`/listings/${listing._id}`} className="group block h-full">
                        <div className="relative flex flex-col h-full">
                            {/* eBay Style Image Card */}
                            <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-muted transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                                <Image
                                    src={imageUrl}
                                    alt={listing.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    sizes="(max-width: 768px) 45vw, 20vw"
                                />
                                
                                {/* Status Badges Overlays */}
                                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-20 pointer-events-none flex flex-col gap-1 sm:gap-2">
                                    {(listing as any).isPromoted && (
                                        <div className={cn(
                                            "flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-lg border border-white/20 backdrop-blur-md transition-all duration-300", 
                                            getPromotionConfig((listing as any).promotionTier)?.badgeColor || "bg-foreground"
                                        )}>
                                            <PromotionIcon 
                                                iconName={getPromotionConfig((listing as any).promotionTier)?.icon || 'sparkles'} 
                                                className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white fill-current" 
                                            />
                                        </div>
                                    )}
                                    {listing.isVerified && (
                                        <div className="bg-[#0053a0] text-white rounded-full p-1 sm:p-1.5 shadow-md">
                                            <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Heart Button - eBay style */}
                                <button 
                                    onClick={handleToggleWishlist}
                                    className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/70 backdrop-blur shadow-sm flex items-center justify-center dark:text-foreground text-white transition-all hover:scale-110 active:scale-95"
                                >
                                    <Heart className={cn("w-4 h-4 transition-colors", isWished && "fill-red-500 text-red-500")} />
                                </button>

                                {/* Discount Badge - eBay style */}
                                {hasDiscount && (
                                    <div className="absolute bottom-2 left-2 z-20">
                                        <div className="bg-[#E53238] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            {discountPercent}% OFF
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* eBay Style Content Section */}
                            <div className="pt-2.5 pb-2 flex flex-col flex-1">
                                <h3 className="text-[13px] sm:text-[14px] font-medium leading-[1.3] line-clamp-2 text-foreground/90 group-hover:underline decoration-foreground/30 underline-offset-2 mb-1.5 transition-all">
                                    {listing.title}
                                </h3>
                                
                                <div className="mt-auto space-y-0.5">
                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                        <span className="text-sm sm:text-base font-bold text-foreground">
                                            {formatCurrency(listing.price, listing.currency)}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-[10px] sm:text-xs text-muted-foreground line-through opacity-70">
                                                {formatCurrency(listing.previousPrice!, listing.currency)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80 font-medium">
                                        <MapPin className="w-3 h-3 text-primary" />
                                        {listing.city ? listing.city.split(' ')[0] : 'Skopje'}
                                    </div>

                                    {listing.condition && (
                                        <div className="text-[10px] text-muted-foreground/60 font-medium capitalize">
                                            {listing.condition === 'NEW' ? 'Brand New' : 'Pre-owned'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {/* Added arrows */}
            <CarouselPrevious className="hidden md:flex -left-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-background/80 backdrop-blur border-border" />
            <CarouselNext className="hidden md:flex -right-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-background/80 backdrop-blur border-border" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
