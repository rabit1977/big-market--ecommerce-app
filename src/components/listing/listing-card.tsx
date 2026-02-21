'use client';

import { getPromotionConfig } from '@/lib/constants/promotions';
import { useFavorites } from '@/lib/context/favorites-context';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPrice } from '@/lib/utils/formatters';
import { Heart, MapPin, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback } from 'react';
import { Button } from '../ui/button';
import { PromotionIcon } from './promotion-icon';

interface ListingCardProps {
  listing: ListingWithRelations;
  viewMode?: 'grid' | 'list' | 'card';
  initialIsWished?: boolean; // Deprecated but kept for compatibility
}

export const ListingCard = memo(
  ({ listing, viewMode = 'list' }: ListingCardProps) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isWished = isFavorite(listing.id || listing._id);

    // Wishlist toggle handler
    const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation
      e.stopPropagation();
      toggleFavorite(listing.id || listing._id);
    }, [listing.id, listing._id, toggleFavorite]);

    const activeImage = listing.images?.[0]?.url || listing.thumbnail || '/placeholder.png';
    const isGrid = viewMode === 'grid';
    const isCard = viewMode === 'card';
    
    // Real logic from listing and user metadata
    const tier = listing.user?.membershipTier;
    const isPromoted = listing.isPromoted && (!listing.promotionExpiresAt || listing.promotionExpiresAt > Date.now());
    const promotionTier = isPromoted ? listing.promotionTier : null;
    const promoConfig = isPromoted ? getPromotionConfig(promotionTier) : null;
    const isVerified = listing.user?.isVerified;

    return (
      <div
        className={cn(
          "group relative flex bg-card border border-border/50 shadow-sm hover:shadow-lg overflow-hidden",
          (isGrid || isCard) ? "flex-col h-full rounded-xl" : "flex-row h-24 sm:h-28 md:h-40 rounded-lg", 
          isCard && "mb-4 border-border shadow-md", // Extra spacing/shadow for full card
          (promotionTier === 'LISTING_HIGHLIGHT' || promotionTier === 'VISUAL_HIGHLIGHT') && "bg-emerald-100/30 dark:bg-emerald-500/10 border-emerald-400/30 dark:border-emerald-500/30 shadow-md ring-1 ring-emerald-500/20"
        )}
      >
        {/* Main Card Link - Higher Z-Index but below heart button */}
        <Link 
          href={`/listings/${listing.id || listing._id}`} 
          className="absolute inset-0 z-20" 
          aria-label={`View ${listing.title}`} 
        />

        {/* Image Section */}
        <div className={cn(
          "relative shrink-0 overflow-hidden z-10",
          !(promotionTier === 'LISTING_HIGHLIGHT' || promotionTier === 'VISUAL_HIGHLIGHT') && "bg-white",
          isGrid ? "aspect-[4/3] w-full" : isCard ? "aspect-video w-full" : "w-24 sm:w-32 md:w-48 h-full"
        )}>
          <Image
            src={activeImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isCard ? "(max-width: 768px) 100vw, 80vw" : isGrid ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "(max-width: 768px) 33vw, 20vw"}
          />
          
          {/* Status Badges Overlay */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-20 pointer-events-none flex flex-col gap-1 sm:gap-2">
              {isPromoted && promoConfig && promoConfig.badgeColor && (
                <div className={cn(
                    "flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-lg border border-white/20 backdrop-blur-md transition-all duration-300", 
                    promoConfig.badgeColor
                )}>
                    <PromotionIcon iconName={promoConfig.icon} className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white fill-current" />
                </div>
              )}
              {isVerified && (
                 <div className="bg-primary text-white rounded-full p-0.5 sm:p-1 shadow-md">
                    <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                 </div>
              )}
          </div>
        </div>

        {/* Content Section */}
        <div className={cn(
          "flex flex-1 flex-col justify-between relative z-30 pointer-events-none min-w-0",
          !(promotionTier === 'LISTING_HIGHLIGHT' || promotionTier === 'VISUAL_HIGHLIGHT') && "bg-card",
          (isGrid || isCard) ? "p-2 sm:p-3 space-y-1 sm:space-y-1.5" : "p-2 sm:p-3 md:p-3.5",
          isCard && "p-4 sm:p-5" // More padding for card view
        )}>
           
           {(isGrid || isCard) ? (
             <>
                 <div className="flex justify-between items-start">
                    <h3 className={cn(
                        "font-bold text-xs sm:text-sm uppercase leading-tight line-clamp-2 text-foreground pr-6",
                        isCard && "text-base sm:text-lg" // Larger title for card
                    )}>
                       {(listing as any).listingNumber !== undefined && <span className="text-muted-foreground mr-1">#{(listing as any).listingNumber}:</span>}
                       {listing.title}
                    </h3>
                 </div>
                
                <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                   {listing.city || 'Skopje'} • Verified
                </div>
                
                {/* Description for Card View */}
                {isCard && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 hidden sm:block">
                        {listing.description}
                    </p>
                )}

                <div className="pt-0.5 sm:pt-1 flex flex-col">
                    {listing.previousPrice && listing.previousPrice > listing.price && (
                        <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground/50 line-through leading-none mb-0.5" suppressHydrationWarning>
                            {formatPrice(listing.previousPrice)}
                        </span>
                    )}
                    <span className={cn(
                        "font-bold text-primary",
                        isCard ? "text-lg sm:text-xl" : "text-sm sm:text-base"
                    )} suppressHydrationWarning>
                        {formatCurrency(listing.price, (listing as any).currency)}
                    </span>
                </div>

                <div className="flex items-end justify-between mt-auto pt-1.5 sm:pt-2">
                    <div className="text-[9px] sm:text-[10px] text-muted-foreground/80 flex items-center gap-1">
                       <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Button
                      size="icon" variant="ghost" onClick={handleToggleWishlist}
                      className={cn("rounded-full h-7 w-7 sm:h-8 sm:w-8 -mr-1.5 -mb-1.5 sm:-mr-2 sm:-mb-2 pointer-events-auto hover:bg-muted/50 z-30 relative", isWished ? "text-red-500" : "text-muted-foreground")}
                    >
                      <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isWished && "fill-current")} />
                    </Button>
                </div>
             </>
           ) : (
             // List View Content (kept mostly same)
             <>
               <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-xs sm:text-sm md:text-base uppercase leading-tight line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                       {(listing as any).listingNumber !== undefined && <span className="text-muted-foreground mr-1">#{(listing as any).listingNumber}:</span>}
                       {listing.title}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Now'}
                    </span>
                </div>

                 <div className="hidden sm:block text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">
                     {listing.description.length > 150 
                         ? `${listing.description.substring(0, 150)}...` 
                         : listing.description}
                 </div>

                <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground flex items-center gap-0.5 sm:gap-1 mb-0.5 capitalize">
                            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            {listing.city || 'Skopje'}
                        </span>
                         {listing.previousPrice && listing.previousPrice > listing.price && (
                             <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/50 line-through leading-none mb-0.5" suppressHydrationWarning>
                                 {formatCurrency(listing.previousPrice, (listing as any).currency)}
                             </span>
                         )}
                         <span className="text-sm sm:text-base md:text-lg font-bold text-primary" suppressHydrationWarning>
                             {formatCurrency(listing.price, (listing as any).currency)}
                         </span>
                    </div>
                    
                    <Button
                      size="icon" variant="ghost" onClick={handleToggleWishlist}
                      className={cn("rounded-full h-7 w-7 sm:h-8 sm:w-8 -mr-1.5 -mb-1.5 sm:-mr-2 sm:-mb-2 pointer-events-auto hover:bg-muted/50 z-30", isWished ? "text-red-500" : "text-muted-foreground")}
                    >
                      <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isWished && "fill-current")} />
                    </Button>
                </div>
             </>
           )}
        </div>
      </div>
    );
  }
);

ListingCard.displayName = 'ListingCard';
