'use client';

import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { Heart, MapPin, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useOptimistic, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface ListingCardProps {
  listing: ListingWithRelations;
  initialIsWished?: boolean;
  viewMode?: 'grid' | 'list';
}

export const ListingCard = memo(
  ({ listing, initialIsWished = false, viewMode = 'list' }: ListingCardProps) => {
    const [isPending, startTransition] = useTransition();
    const [isWished, setIsWished] = useState(initialIsWished);
    const [optimisticIsWished, setOptimisticIsWished] = useOptimistic(
      isWished,
      (state, newValue: boolean) => newValue
    );

    // Wishlist toggle handler
    const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation
      e.stopPropagation();
      
      const newValue = !optimisticIsWished;
      setOptimisticIsWished(newValue);
      
      startTransition(async () => {
        const result = await toggleWishlistAction(listing.id || listing._id);
        if (result.success) {
          setIsWished(result.isWished || false); // Update state from server
        } else {
          toast.error(result.error || 'Failed to update favorites');
          setOptimisticIsWished(!newValue); // Revert on error
        }
      });
    }, [listing.id, listing._id, optimisticIsWished, setOptimisticIsWished]);

    const activeImage = listing.images?.[0]?.url || listing.thumbnail || '/placeholder.png';
    const isGrid = viewMode === 'grid';
    // Real logic from listing and user metadata
    const tier = listing.user?.membershipTier;
    const isElite = tier === 'ELITE';
    const isPro = tier === 'PRO' || tier === 'BUSINESS';
    const isVerified = listing.user?.isVerified;
    const isPromoted = listing.isPromoted;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative flex bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden",
          isGrid ? "flex-col h-full rounded-xl" : "flex-row h-32 md:h-44 rounded-lg",
          isPromoted && "ring-2 ring-blue-500 shadow-xl shadow-blue-500/10"
        )}
      >
        {/* Main Card Link - Lower Z-Index */}
        <Link href={`/listings/${listing.id || listing._id}`} className="absolute inset-0 z-0" aria-label={`View ${listing.title}`} />

        {/* Image Section */}
        <div className={cn(
          "relative shrink-0 bg-muted overflow-hidden z-10 pointer-events-none",
          isGrid ? "aspect-[4/3] w-full" : "w-32 md:w-56 h-full"
        )}>
          <Image
            src={activeImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isGrid ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "(max-width: 768px) 33vw, 20vw"}
          />
          
          {/* Status Badges Overlay */}
          <div className="absolute top-2 left-2 z-20 pointer-events-none flex flex-col gap-1.5">
              {isPromoted && (
                 <div className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-tighter">
                    Promoted
                 </div>
              )}
              {isElite && (
                 <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-1 rounded-full shadow-lg border border-white/30 animate-pulse">
                    <Star className="h-4 w-4 fill-white text-white" />
                 </div>
              )}
              {isVerified && (
                 <div className="bg-blue-500/90 text-white rounded-full p-1 shadow-md">
                    <ShieldCheck className="h-3.5 w-3.5" />
                 </div>
              )}
          </div>
        </div>

        {/* Content Section */}
        <div className={cn(
          "flex flex-1 flex-col justify-between relative z-10 pointer-events-none min-w-0 bg-card",
          isGrid ? "p-3 space-y-1.5" : "p-3 md:p-4"
        )}>
           
           {isGrid ? (
             <>
               <h3 className="font-bold text-sm uppercase leading-tight line-clamp-2 md:line-clamp-2 text-foreground pr-6">
                  {listing.title}
               </h3>
               
               <div className="text-xs text-muted-foreground font-medium">
                  Currently Available • Verified
               </div>

               <div className="pt-1">
                   <span className="text-lg font-bold text-blue-700">
                     {formatPrice(listing.price)}
                   </span>
               </div>

               <div className="flex items-end justify-between mt-auto pt-2">
                   <div className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
                      <span>{listing.city || 'Skopje'} {'>'} {listing.city ? 'Centar' : 'Karpos'}</span>
                      <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </div>

                   {/* Grid View Heart - Bottom Right */}
                   <Button
                     size="icon" variant="ghost" onClick={handleToggleWishlist}
                     className={cn("rounded-full h-8 w-8 -mr-2 -mb-2 pointer-events-auto hover:bg-muted/50 z-30 relative", optimisticIsWished ? "text-red-500" : "text-muted-foreground")}
                   >
                     <Heart className={cn("h-5 w-5", optimisticIsWished && "fill-current")} />
                   </Button>
               </div>
             </>
           ) : (
             <>
               {/* List View Content */}
               <div className="flex justify-between items-start gap-2">
                   <h3 className="font-bold text-sm md:text-lg uppercase leading-tight line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                      {listing.title}
                   </h3>
                   <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap shrink-0">
                       {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Now'}
                   </span>
               </div>

               <div className="hidden md:block text-xs text-muted-foreground mt-1 line-clamp-2">
                   {listing.description}
               </div>

               <div className="flex items-end justify-between mt-auto">
                   <div className="flex flex-col">
                       <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1 mb-0.5 capitalize">
                           <MapPin className="h-3 w-3" />
                           {listing.city || 'Skopje'}
                       </span>
                       <span className="text-base md:text-xl font-bold text-blue-600 dark:text-blue-400">
                         {formatPrice(listing.price)}
                       </span>
                   </div>
                   
                   {/* List View Heart - Moved to Content Bottom Right */}
                   <Button
                     size="icon" variant="ghost" onClick={handleToggleWishlist}
                     className={cn("rounded-full h-9 w-9 -mr-2 -mb-2 pointer-events-auto hover:bg-muted/50 z-30", optimisticIsWished ? "text-red-500" : "text-muted-foreground")}
                   >
                     <Heart className={cn("h-5 w-5", optimisticIsWished && "fill-current")} />
                   </Button>
               </div>
             </>
           )}
        </div>
      </motion.div>
    );
  }
);

ListingCard.displayName = 'ListingCard';
