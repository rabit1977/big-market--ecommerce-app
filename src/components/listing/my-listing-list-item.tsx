'use client';

import { deleteListingAction, getRenewalStatsAction, renewListingAction } from '@/actions/listing-actions';
import { PromotionIcon } from '@/components/shared/listing/promotion-icon';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PRICING } from '@/lib/constants/pricing';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn, formatCurrency } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { AlertTriangle, BarChart2, CheckCircle, Clock, Edit, ExternalLink, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface MyListingListItemProps {
  listing: ListingWithRelations;
}

export const MyListingListItem = ({ listing }: MyListingListItemProps) => {
    const [isPending, startTransition] = useTransition();
    const [renewalStats, setRenewalStats] = useState<any>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
    
    // (Favorites logic removed since users cannot favorite their own listings)

    const handleDelete = async () => {
        startTransition(async () => {
             const res = await deleteListingAction(listing.id!);
             if(res.success) {
                 toast.success('Listing moved to recycle bin');
             } else {
                 toast.error(res.error || 'Failed to delete');
             }
        });
    };

    const handleRenewClick = async () => {
        if (listing.status === 'PENDING_APPROVAL') return;
        
        setIsStatsLoading(true);
        try {
            const res = await getRenewalStatsAction();
            if (res.success) {
                setRenewalStats(res.stats);
                setIsRenewDialogOpen(true);
            } else {
                toast.error("Could not fetch renewal stats.");
            }
        } catch (e) {
            toast.error("An error occurred.");
        } finally {
            setIsStatsLoading(false);
        }
    };

    const handleConfirmRenew = async () => {
        setIsRenewDialogOpen(false);
        startTransition(async () => {
             const res = await renewListingAction(listing.id!);
             if(res.success) {
                 toast.success('Listing renewed! It now appears at the top of results.');
             } else {
                 toast.error(res.error || 'Failed to renew');
             }
        });
    };

    const activeImage = listing.images?.[0]?.url || listing.thumbnail || '/placeholder.png';
    const isPromoted = listing.isPromoted && listing.promotionExpiresAt && listing.promotionExpiresAt > Date.now();
    const promoConfig = isPromoted ? getPromotionConfig(listing.promotionTier) : null;
    const daysLeft = isPromoted && listing.promotionExpiresAt ? Math.ceil((listing.promotionExpiresAt - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

// ... removed import from here

// ... (keep surrounding imports)

    // const getIcon = ... (DELETED)

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
            "group relative flex flex-row bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/20 rounded-[1.5rem] overflow-hidden transition-all duration-300",
            isPromoted && promoConfig?.borderColor && `border-2 ${promoConfig.borderColor.replace('/20', '/50')}`
        )}
      >
        {/* Image Section */}
        <div className="relative w-24 sm:w-36 md:w-48 aspect-[4/3] sm:aspect-square md:aspect-video bg-muted shrink-0 overflow-hidden">
          <Image
            src={activeImage}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge Overlay */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
             {listing.status === 'ACTIVE' && (
                 <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-wider font-bold h-6 px-2 rounded-lg">
                    <CheckCircle className="w-3 h-3 mr-1" /> Active
                 </Badge>
             )}

             {listing.status === 'PENDING_APPROVAL' && (
                 <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg shadow-amber-500/20 text-[10px] uppercase tracking-wider font-bold h-6 px-2 rounded-lg">
                    <Clock className="w-3 h-3 mr-1" /> Pending Approval
                 </Badge>
             )}

             {isPromoted && promoConfig && (
                 <Badge className={cn("text-white border-0 shadow-lg text-[10px] uppercase tracking-wider font-bold h-6 px-2 rounded-lg flex items-center", promoConfig.badgeColor)}>
                    <PromotionIcon iconName={promoConfig.icon} className="w-3 h-3 mr-1 fill-current/50" />
                    {daysLeft} days left
                 </Badge>
             )}
          </div>
          
           {/* Favorite Button removed for owned listings */}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-2.5 sm:p-4 md:p-5 min-w-0"> {/* Reduced padding */}
            <div className="flex justify-between items-start gap-3 mb-1.5 sm:mb-2">
                <Link href={`/listings/${listing.id}`} className="block min-w-0 group/link">
                   <h3 className="font-bold text-sm sm:text-base md:text-lg leading-tight group-hover/link:text-primary transition-colors line-clamp-1 mb-1 text-foreground"> {/* Smaller Title */}
                      {listing.title}
                   </h3>
                   <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider">
                     <span>ID: {listing.id!.slice(-6)}</span>
                     <span>•</span>
                     <span>{formatDistanceToNow(new Date(listing.createdAt!), { addSuffix: true })}</span>
                   </div>
                </Link>
                
                <Link href={`/listings/${listing.id}`} target="_blank" className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden sm:flex">
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>

            <div className="mb-3 sm:mb-4">
                <div className="text-base sm:text-lg md:text-xl font-black text-primary tracking-tight"> {/* Smaller Price */}
                    {formatCurrency(listing.price, (listing as any).currency)}
                </div>
                
                {/* Specs Summary */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {listing.condition && (
                        <span className="bg-muted px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border/50">
                            {listing.condition}
                        </span>
                    )}
                    {listing.specifications?.year && (
                        <span className="bg-muted px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border/50">
                            {listing.specifications.year}
                        </span>
                    )}
                </div>
            </div>

            {/* Main Action Button */}
            <div className="flex flex-row gap-2 mt-auto mb-2 sm:mb-3">
                <Button 
                    asChild
                    className={cn(
                        "flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black h-8 sm:h-9 shadow-sm text-[10px] sm:text-xs uppercase tracking-wide rounded-xl transition-all",
                        listing.status === 'PENDING_APPROVAL' && "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                    size="sm"
                >
                    <Link href={`/my-listings/promote/${listing.id}`}>
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                        Promote
                    </Link>
                </Button>

                <AlertDialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
                    <Button 
                        className={cn(
                            "flex-1 bg-foreground text-background hover:bg-primary hover:text-white font-black h-8 sm:h-9 shadow-sm text-[10px] sm:text-xs uppercase tracking-wide rounded-xl transition-all",
                            (listing.status === 'PENDING_APPROVAL' || isStatsLoading) && "opacity-50 cursor-not-allowed pointer-events-none"
                        )}
                        size="sm"
                        onClick={handleRenewClick}
                        disabled={isPending || isStatsLoading || listing.status === 'PENDING_APPROVAL'}
                    >
                        <RefreshCw className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5", (isPending || isStatsLoading) && "animate-spin")} />
                        {isStatsLoading ? 'Checking...' : 'Renew Ad'}
                    </Button>
                    <AlertDialogContent className="rounded-2xl max-w-sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 font-black uppercase tracking-tight">
                                <RefreshCw className="w-5 h-5 text-primary" />
                                Renew Listing
                            </AlertDialogTitle>
                            <AlertDialogDescription asChild className="space-y-3 pt-2">
                                <div className="space-y-3">
                                    {!renewalStats?.canRenewNow ? ( 
                                        <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex gap-3">
                                            <AlertTriangle className="w-5 h-5 shrink-0" />
                                            <p>You can renew again in {renewalStats?.hoursUntilRenew} hour{renewalStats?.hoursUntilRenew !== 1 ? 's' : ''}. Renewals are allowed once every 24 hours.</p> 
                                        </div>
                                    ) : renewalStats?.remainingMonthly <= 0 ? (
                                        <div className="bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-destructive text-xs font-bold flex gap-3">
                                            <AlertTriangle className="w-5 h-5 shrink-0" />
                                            <p>You have reached your monthly limit of 15 renewals.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-foreground text-sm font-medium leading-relaxed">
                                                Dear user, you have <span className="font-black text-primary text-base">{renewalStats?.remainingMonthly}</span> times left this month to renew your ads.
                                            </div>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider px-1">
                                                Renew this listing for another 30 days for {PRICING.RENEWAL} MKD.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
                            <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px] sm:text-xs h-10 transition-all border-border/50">Cancel</AlertDialogCancel>
                            {renewalStats?.canRenewNow && renewalStats?.remainingMonthly > 0 && ( 
                                <AlertDialogAction 
                                    onClick={handleConfirmRenew} 
                                    className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase text-[10px] sm:text-xs h-10 shadow-lg shadow-primary/20"
                                >
                                    Renew Now
                                </AlertDialogAction>
                            )}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Icon Actions Row */}
            <div className="flex items-center justify-between border-t border-border/50 pt-2 sm:pt-3 mt-1 sm:px-2"> {/* Reduced padding top */}
                <div className="flex gap-4 sm:gap-8 w-full justify-between sm:justify-start">
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button 
                                disabled={listing.status === 'PENDING_APPROVAL'}
                                className={cn(
                                    "flex items-center gap-1.5 group/btn hover:text-destructive transition-colors text-muted-foreground",
                                    listing.status === 'PENDING_APPROVAL' && "opacity-50 cursor-not-allowed pointer-events-none"
                                )}
                            >
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Delete</span>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl max-w-sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 font-black uppercase tracking-tight">
                                    <Trash2 className="w-5 h-5 text-destructive" />
                                    Move to Recycle Bin?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="space-y-2 pt-1">
                                    <span className="block">
                                        &quot;{listing.title}&quot; will be moved to the recycle bin.
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        You can restore it from the admin recycle bin within 30 days before it is permanently deleted.
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold uppercase text-xs h-10">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl font-black uppercase text-xs h-10 shadow-lg shadow-destructive/20">Move to Bin</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Link href={`/my-listings/stats/${listing.id}`} className="flex items-center gap-1.5 group/btn hover:text-emerald-500 transition-colors text-muted-foreground">
                        <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Stats</span>
                    </Link>

                    <Link 
                        href={listing.status === 'PENDING_APPROVAL' ? '#' : `/my-listings/${listing.id}/edit`} 
                        className={cn(
                            "flex items-center gap-1.5 group/btn hover:text-amber-500 transition-colors text-muted-foreground",
                            listing.status === 'PENDING_APPROVAL' && "opacity-50 cursor-not-allowed pointer-events-none"
                        )}
                    >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Edit</span>
                    </Link>


                </div>
            </div>
        </div>
      </motion.div>
    );
};
