'use client';

import { PromotionIcon } from '@/components/shared/listing/promotion-icon';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { useFavorites } from '@/lib/context/favorites-context';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';
import { BadgeCheck, Heart, MapPin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback } from 'react';

interface ListingCardProps {
  listing: ListingWithRelations;
  viewMode?: 'grid' | 'list' | 'card';
  initialIsWished?: boolean; // Deprecated but kept for compatibility
}

export const ListingCard = memo(
  ({ listing, viewMode = 'list' }: ListingCardProps) => {
    const { data: session } = useSession();
    const isOwner = session?.user?.id === listing.userId;
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
    const isPromoted = listing.isPromoted && (!listing.promotionExpiresAt || listing.promotionExpiresAt > (typeof window === 'undefined' ? 0 : Date.now()));
    const promotionTier = isPromoted ? listing.promotionTier : null;
    const promoConfig = isPromoted ? getPromotionConfig(promotionTier) : null;
    const isVerified = listing.user?.isVerified;

    return (
      <div
        className={cn(
          "group relative bg-card border border-border rounded-lg p-2 flex transition-all duration-150 hover:border-primary/50",
          (isGrid || isCard) ? "flex-col h-full" : "flex-row h-24 sm:h-28 md:h-40", 
          isCard && "mb-4",
        )}
      >
        {/* Main Card Link - Higher Z-Index but below heart button */}
        <Link 
          href={`/listings/${listing.id || listing._id}`} 
          className="absolute inset-0 z-10" 
          aria-label={`View ${listing.title}`} 
        />

        {/* Image Section - The container for the 'card' look */}
        <div className={cn(
          "relative shrink-0 overflow-hidden z-20 bg-muted transition-all duration-150 pointer-events-none",
          isGrid ? "aspect-square w-full rounded-md" : isCard ? "aspect-video w-full rounded-md" : "w-24 sm:w-32 md:w-48 h-full rounded-md"
        )}>

          <Image
            src={activeImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            sizes={isCard ? "(max-width: 768px) 100vw, 80vw" : isGrid ? "(max-width: 768px) 50vw, 25vw " : "(max-width: 768px) 33vw, 20vw"}
          />
           {isPromoted && promoConfig && (
                            <div className={cn("flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full absolute top-2 left-2 z-50 bg-white/90 dark:bg-black/70 backdrop-blur-xs opacity-80", promoConfig.badgeColor.replace('bg-', 'text-'))} title="Promoted">
                                <PromotionIcon iconName={promoConfig.icon} className="h-3 w-3 fill-current" />
                            </div>
                        )}
          
          {!isOwner && (
            <button
                onClick={handleToggleWishlist}
                className="absolute top-2 right-2 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur shadow-sm flex items-center justify-center text-foreground/80 transition-all hover:scale-110 active:scale-95 pointer-events-auto"
            >
                <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors", isWished && "fill-red-500 text-red-500")} />
            </button>
          )}

          {listing.previousPrice && listing.previousPrice > listing.price && (
            <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
                <div className="bg-[#E53238] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    {Math.round(((listing.previousPrice - listing.price) / listing.previousPrice) * 100)}% OFF
                </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={cn(
          "flex flex-1 flex-col justify-between relative z-20 pointer-events-none min-w-0 pt-2 pb-1",
          (isGrid || isCard) ? "space-y-1" : "px-3 py-1",
        )}>
           
           {(isGrid || isCard) ? (
             <>
                <div className="flex items-start justify-between gap-1.5">
                    <h3 className={cn(
                        "font-medium text-[13px] sm:text-[14px] leading-snug line-clamp-2 text-foreground group-hover:underline decoration-foreground/30 underline-offset-2 transition-all",
                        isCard && "text-base sm:text-lg"
                    )}>
                       {listing.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                        <SellerBadge tier={tier} isVerified={isVerified} />
                    </div>
                </div>
                
                <div className="mt-auto space-y-0.5">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className={cn(
                            "font-bold text-foreground",
                            isCard ? "text-lg sm:text-xl" : "text-sm sm:text-base"
                        )} suppressHydrationWarning>
                            {listing.price > 0 ? formatCurrency(listing.price, (listing as any).currency) : 'Price on req'}
                        </span>
                        {listing.previousPrice && listing.previousPrice > listing.price && (
                            <span className="text-[10px] sm:text-xs text-muted-foreground line-through opacity-70" suppressHydrationWarning>
                                {formatCurrency(listing.previousPrice as number, (listing as any).currency)}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80 font-medium">
                        <MapPin className="w-3 h-3 text-primary" />
                        {listing.city || 'Skopje'}
                    </div>

                    {isCard && listing.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-2 font-normal">
                            {listing.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                        <div className="text-[9px] text-muted-foreground/60 font-medium uppercase tracking-tight">
                            {listing.condition === 'NEW' ? 'Brand New' : 'Pre-owned'}
                        </div>
                        <div className="text-[9px] text-muted-foreground/40" suppressHydrationWarning>
                           {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
             </>
           ) : (
             // List View Content
             <>
                <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm md:text-base leading-tight line-clamp-2 group-hover:underline decoration-foreground/30 underline-offset-2 transition-all text-foreground">
                         {listing.title}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                          {isPromoted && promoConfig && (
                              <div className={cn("flex items-center justify-center w-4 h-4 rounded-full opacity-70", promoConfig.badgeColor.replace('bg-', 'text-'))}>
                                  <PromotionIcon iconName={promoConfig.icon} className="h-2.5 w-2.5 fill-current" />
                              </div>
                          )}
                          <SellerBadge tier={tier} isVerified={isVerified} />
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground whitespace-nowrap shrink-0" suppressHydrationWarning>
                        {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Now'}
                    </span>
                </div>

                 <div className="hidden sm:block text-[10px] sm:text-[11px] text-muted-foreground mt-1 line-clamp-1 opacity-70">
                     {listing.description}
                 </div>

                <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-foreground" suppressHydrationWarning>
                        {listing.price > 0 ? formatCurrency(listing.price, (listing as any).currency) : 'Price on request'}
                    </span>
                    {listing.previousPrice && listing.previousPrice > listing.price && (
                        <span className="text-[10px] sm:text-xs text-muted-foreground line-through opacity-70" suppressHydrationWarning>
                            {formatCurrency(listing.previousPrice as number, (listing as any).currency)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80 font-medium mb-1">
                    <MapPin className="w-2.5 h-2.5 text-primary" />
                    {listing.city || 'Skopje'}
                </div>
             </>
           )}
        </div>
      </div>
    );
  }
);

ListingCard.displayName = 'ListingCard';

const SellerBadge = ({ tier, isVerified, className }: { tier?: string; isVerified?: boolean; className?: string }) => {
  if (tier === 'BUSINESS') {
    return (
      <div className={cn("flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/10 backdrop-blur-xs shadow-[0_0_8px_rgba(251,191,36,0.1)] transition-all duration-300", className)} title="Verified Store">
        <BadgeCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
      </div>
    );
  }
  if (isVerified) {
    return (
      <div className={cn("flex items-center justify-center w-5 h-5 rounded-full bg-blue-400/10 backdrop-blur-xs shadow-[0_0_8px_rgba(59,130,246,0.1)] transition-all duration-300", className)} title="Verified User">
        <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
      </div>
    );
  }
  return null;
};
