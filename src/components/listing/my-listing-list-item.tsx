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
import { Button } from '@/components/ui/button';
import { PRICING } from '@/lib/constants/pricing';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn, formatCurrency } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { AlertTriangle, BarChart2, Clock, Edit, ExternalLink, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface MyListingListItemProps {
  listing: ListingWithRelations;
}

export const MyListingListItem = ({ listing }: MyListingListItemProps) => {
    const t = useTranslations('MyListings');
    const [isPending, startTransition] = useTransition();
    const [renewalStats, setRenewalStats] = useState<any>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
    
    // (Favorites logic removed since users cannot favorite their own listings)

    const handleDelete = async () => {
        startTransition(async () => {
             const res = await deleteListingAction(listing.id!);
             if(res.success) {
                 toast.success(t('listing_moved_to_bin'));
             } else {
                 toast.error(res.error || t('failed_to_delete'));
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
                toast.error(t('could_not_fetch_renewal'));
            }
        } catch (e) {
            toast.error(t('an_error_occurred'));
        } finally {
            setIsStatsLoading(false);
        }
    };

    const handleConfirmRenew = async () => {
        setIsRenewDialogOpen(false);
        startTransition(async () => {
             const res = await renewListingAction(listing.id!);
             if(res.success) {
                 toast.success(t('listing_renewed'));
             } else {
                 toast.error(res.error || t('failed_to_renew'));
             }
        });
    };

    const activeImage = listing.images?.[0]?.url || listing.thumbnail || '/placeholder.png';
    const isPromoted = listing.isPromoted && listing.promotionExpiresAt && listing.promotionExpiresAt > Date.now();
    const promoConfig = isPromoted ? getPromotionConfig(listing.promotionTier) : null;
    const daysLeft = isPromoted && listing.promotionExpiresAt ? Math.ceil((listing.promotionExpiresAt - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
            "group relative flex flex-row bg-card/40 backdrop-blur-sm transition-all duration-300 rounded-[2rem] overflow-visible bm-interactive shadow-none mt-4",
        )}
      >
        {/* Legend-style Status Labels */}
        <div className="absolute -top-3 left-6 md:left-10 z-20 justify-center w-full flex gap-2">
            {listing.status === 'ACTIVE' && (
                <div className="bg-background px-3 py-1 rounded-full border-1 border-card-foreground/10 text-[9px] font-black uppercase tracking-[0.2em] text-foreground flex items-center shadow-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                   {t('status_active')}
                </div>
            )}
            {listing.status === 'PENDING_APPROVAL' && (
                <div className="bg-background px-3 py-1 rounded-full border-1 border-card-foreground/10 text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 flex items-center shadow-sm">
                   <Clock className="w-3 h-3 mr-2 opacity-60" />
                   {t('status_pending')}
                </div>
            )}
            {isPromoted && promoConfig && (
                <div className="bg-primary text-white px-3 py-1 rounded-full border-1 border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] flex items-center shadow-lg shadow-primary/20">
                   <PromotionIcon iconName={promoConfig.icon} className="w-3 h-3 mr-2" />
                   {t('days_pro', { days: daysLeft })}
                </div>
            )}
        </div>
        {/* Image Section */}
        <div className="relative w-24 sm:w-36 md:w-48 aspect-[4/3] sm:aspect-square md:aspect-video bg-muted shrink-0 overflow-hidden rounded-l-[2rem]">
          <Image
            src={activeImage}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
           {/* Favorite Button removed for owned listings */}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-2.5 sm:p-4 md:p-5 min-w-0 rounded-r-[2rem]">
            <div className="flex justify-between items-start gap-3 mb-1.5 sm:mb-2">
                <Link href={`/listings/${listing.id}`} className="block min-w-0 group/link">
                   <h3 className="font-bold text-base sm:text-lg pt-2 md:text-lg leading-tight group-hover/link:text-primary transition-colors line-clamp-1 mb-1 text-foreground">
                      {listing.title}
                   </h3>
                   <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest">
                     <span>ID: {listing.id!.slice(-6)}</span>
                     <span>•</span>
                     <span>{formatDistanceToNow(new Date(listing.createdAt!), { addSuffix: true })}</span>
                   </div>
                </Link>
                
                 <Link href={`/listings/${listing.id}`} target="_blank" className="p-2.5 rounded-xl text-muted-foreground transition-all hover:text-primary bm-interactive shadow-none">
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>

            <div className="mb-3 sm:mb-4">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase">
                    {formatCurrency(listing.price, (listing as any).currency)}
                </div>
                
                {/* Specs Summary */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {listing.condition && (
                        <span className="bg-secondary px-2 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest bm-interactive">
                            {listing.condition}
                        </span>
                    )}
                    {listing.specifications?.year && (
                        <span className="bg-secondary px-2 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest bm-interactive">
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
                        "flex-1 bg-primary hover:bg-primary/95 text-white font-black h-10 shadow-none text-[10px] sm:text-xs uppercase tracking-[0.15em] rounded-xl transition-all active:scale-95",
                        listing.status === 'PENDING_APPROVAL' && "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                    size="sm"
                >
                    <Link href={`/my-listings/promote/${listing.id}`}>
                        <Sparkles className="w-3.5 h-3.5 mr-2 text-white/90" />
                        {t('promote')}
                    </Link>
                </Button>

                <AlertDialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
                    <Button 
                        className={cn(
                            "flex-1 bg-secondary/50 hover:bg-secondary text-foreground font-black h-10 shadow-none text-[10px] sm:text-xs uppercase tracking-[0.15em] rounded-xl transition-all active:scale-95 border-1 bm-interactive",
                            (listing.status === 'PENDING_APPROVAL' || isStatsLoading) && "opacity-50 cursor-not-allowed pointer-events-none"
                        )}
                        size="sm"
                        onClick={handleRenewClick}
                        disabled={isPending || isStatsLoading || listing.status === 'PENDING_APPROVAL'}
                    >
                        <RefreshCw className={cn("w-3.5 h-3.5 mr-2 text-foreground/40", (isPending || isStatsLoading) && "animate-spin")} />
                        {isStatsLoading ? '...' : t('renew')}
                    </Button>
                    <AlertDialogContent className="rounded-lg max-w-sm border-border bg-card">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 font-bold uppercase tracking-tight text-lg">
                                <RefreshCw className="w-5 h-5 text-primary" />
                                {t('renew_listing')}
                            </AlertDialogTitle>
                            <AlertDialogDescription asChild className="space-y-3 pt-2">
                                <div className="space-y-3">
                                    {!renewalStats?.canRenewNow ? ( 
                                        <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex gap-3">
                                            <AlertTriangle className="w-5 h-5 shrink-0" />
                                            <p>{renewalStats?.hoursUntilRenew === 1 
                                                ? t('renew_limit_warning', { hours: renewalStats?.hoursUntilRenew })
                                                : t('renew_limit_warning_plural', { hours: renewalStats?.hoursUntilRenew })
                                            }</p>
                                        </div>
                                    ) : renewalStats?.remainingMonthly <= 0 ? (
                                        <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-destructive text-xs font-bold flex gap-3">
                                            <AlertTriangle className="w-5 h-5 shrink-0" />
                                            <p>{t('monthly_limit_reached')}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-secondary p-4 rounded-lg border border-border text-foreground text-sm font-medium leading-relaxed">
                                                {t('renewals_remaining', { count: renewalStats?.remainingMonthly })}
                                            </div>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest px-1">
                                                {t('renew_for_days', { price: PRICING.RENEWAL })}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
                            <AlertDialogCancel className="rounded-lg font-bold uppercase text-[10px] sm:text-xs h-10 transition-all border-border shadow-none">{t('cancel')}</AlertDialogCancel>
                            {renewalStats?.canRenewNow && renewalStats?.remainingMonthly > 0 && ( 
                                <AlertDialogAction 
                                    onClick={handleConfirmRenew} 
                                    className="bg-primary hover:bg-primary/90 text-white rounded-lg font-bold uppercase text-[10px] sm:text-xs h-10 shadow-none"
                                >
                                    {t('renew_now')}
                                </AlertDialogAction>
                            )}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Icon Actions Row */}
            <div className="flex items-center justify-between border-t border-card-foreground/10 pt-4 mt-3 sm:px-1"> 
                <div className="flex gap-3 sm:gap-6 w-full justify-between sm:justify-start">
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button 
                                disabled={listing.status === 'PENDING_APPROVAL'}
                                 className={cn(
                                     "flex items-center gap-2 group/btn transition-all text-foreground px-3 py-2 rounded-xl bm-interactive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30",
                                     listing.status === 'PENDING_APPROVAL' && "opacity-50 cursor-not-allowed pointer-events-none"
                                 )}
                            >
                                <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('delete')}</span>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl max-w-sm border-1 border-card-foreground/20 bg-card shadow-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 font-black uppercase tracking-tight text-lg">
                                    <Trash2 className="w-5 h-5 text-destructive" />
                                    {t('move_to_bin')}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="space-y-3 pt-2 font-medium">
                                    <span className="block text-foreground">
                                        &quot;{listing.title}&quot; {t('will_be_moved_to_bin')}
                                    </span>
                                    <span className="block text-xs text-muted-foreground uppercase tracking-wider">
                                        {t('restore_within')}
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
                                <AlertDialogCancel className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 shadow-none border-1 border-card-foreground/20 bm-interactive transition-all">{t('cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-12 shadow-none transition-all active:scale-95">{t('move_to_bin_confirm')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Link href={`/my-listings/stats/${listing.id}`} className="flex items-center gap-2 group/btn transition-all text-foreground px-3 py-2 rounded-xl bm-interactive">
                        <BarChart2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('stats')}</span>
                    </Link>

                    <Link 
                        href={listing.status === 'PENDING_APPROVAL' ? '#' : `/my-listings/${listing.id}/edit`} 
                        className={cn(
                            "flex items-center gap-2 group/btn transition-all text-foreground px-3 py-2 rounded-xl bm-interactive",
                            listing.status === 'PENDING_APPROVAL' && "opacity-50 cursor-not-allowed pointer-events-none"
                        )}
                    >
                        <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t('edit')}</span>
                    </Link>
                </div>
            </div>
        </div>
      </motion.div>
    );
};
