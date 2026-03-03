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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/convex/_generated/api';
import { PRICING } from '@/lib/constants/pricing';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { exportReceiptPdf } from '@/lib/export-receipt-pdf';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn, formatCurrency } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { AlertTriangle, BarChart2, Clock, Edit, ExternalLink, MoreVertical, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface MyListingCardProps {
  listing: ListingWithRelations;
}

export const MyListingCard = ({ listing }: MyListingCardProps) => {
    const t = useTranslations('MyListings');
    const [isPending, startTransition] = useTransition();
    const [renewalStats, setRenewalStats] = useState<any>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
    const { data: session } = useSession();
    const userId = session?.user?.id ?? '';

    // Fetch promotion transactions for this listing (only runs when userId is available)
    const listingTransactions = useQuery(
        api.wallet.getTransactionsForListing,
        userId ? { userId, listingId: listing.id! } : 'skip'
    );
    const hasReceipt = (listingTransactions?.length ?? 0) > 0;

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

    const handleDownloadReceipt = () => {
        const tx = listingTransactions?.[0];
        if (!tx) {
            toast.error('No payment record found for this listing.');
            return;
        }
        const meta = (tx.metadata as any) ?? {};
        const receiptNum = `RCP-${new Date(tx.createdAt).getFullYear()}${String(new Date(tx.createdAt).getMonth() + 1).padStart(2, '0')}${String(new Date(tx.createdAt).getDate()).padStart(2, '0')}-${tx._id.slice(-6).toUpperCase()}`;
        exportReceiptPdf({
            platformName:     'Pazar.mk',
            platformEmail:    'info@pazar.mk',
            receiptNumber:    receiptNum,
            generatedAt:      Date.now(),
            customerName:     session?.user?.name ?? meta.customer_name ?? 'Customer',
            customerEmail:    session?.user?.email ?? meta.customer_email ?? '',
            customerId:       userId,
            listingId:        listing.id!,
            listingTitle:     listing.title,
            listingCategory:  (listing as any).category,
            listingCity:      (listing as any).city,
            listingNumber:    (listing as any).listingNumber,
            packageName:      meta.packageName ?? meta.tier ?? listing.promotionTier ?? '—',
            promotionTier:    listing.promotionTier ?? undefined,
            durationDays:     meta.durationDays,
            promotionStart:   listing.promotionExpiresAt ? listing.promotionExpiresAt - ((meta.durationDays ?? 30) * 86400000) : undefined,
            promotionEnd:     listing.promotionExpiresAt ?? undefined,
            amountPaid:       Math.abs(tx.amount),
            currency:         'MKD',
            stripeId:         tx.stripeId,
            paymentStatus:    tx.status ?? 'COMPLETED',
            paymentMethod:    'Card (Stripe)',
        });
    };

    const activeImage = listing.images?.[0]?.url || listing.thumbnail || '/placeholder.png';
    const isPromoted = listing.isPromoted && listing.promotionExpiresAt && listing.promotionExpiresAt > Date.now();
    const promoConfig = isPromoted ? getPromotionConfig(listing.promotionTier) : null;
    const daysLeft = isPromoted && listing.promotionExpiresAt ? Math.ceil((listing.promotionExpiresAt - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative flex flex-col h-full bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-card-foreground/5 shadow-none transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 bm-interactive"
      >
        {/* Status Badges Overlay */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
            {listing.status === 'ACTIVE' && (
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-emerald-500/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-white mr-2 animate-pulse" />
                   {t('status_active')}
                </div>
            )}
            {listing.status === 'PENDING_APPROVAL' && (
                <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-amber-500/20">
                   <Clock className="w-3 h-3 mr-2" />
                   {t('status_pending')}
                </div>
            )}
            {isPromoted && promoConfig && (
                <div className="bg-primary text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-primary/20">
                   <PromotionIcon iconName={promoConfig.icon} className="w-3 h-3 mr-2" />
                   {t('days_pro', { days: daysLeft })}
                </div>
            )}
        </div>

        {/* Action Dropdown Overlay */}
        <div className="absolute top-4 right-4 z-20">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-2xl bg-background/80 backdrop-blur-md border-1 border-card-foreground/10 hover:bg-background shadow-xl">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl border-1 border-card-foreground/10 bg-card/95 backdrop-blur-xl p-2 shadow-2xl">
                    <DropdownMenuItem asChild>
                        <Link href={`/my-listings/${listing.id}/edit`} className="flex items-center gap-3 py-3 rounded-xl cursor-pointer">
                            <Edit className="h-4 w-4" />
                            <span className="font-bold text-[10px] uppercase tracking-widest">{t('edit')}</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={`/my-listings/stats/${listing.id}`} className="flex items-center gap-3 py-3 rounded-xl cursor-pointer">
                            <BarChart2 className="h-4 w-4" />
                            <span className="font-bold text-[10px] uppercase tracking-widest">{t('stats')}</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={`/listings/${listing.id}`} target="_blank" className="flex items-center gap-3 py-3 rounded-xl cursor-pointer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="font-bold text-[10px] uppercase tracking-widest">{t('view_live')}</span>
                        </Link>
                    </DropdownMenuItem>
                    

                    <div className="h-px bg-card-foreground/5 my-2 mx-1" />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-3 py-3 rounded-xl cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="font-bold text-[10px] uppercase tracking-widest">{t('delete')}</span>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] max-w-sm border-1 border-card-foreground/10 bg-card shadow-2xl">
                             <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-3 font-black uppercase tracking-tight text-xl">
                                    <Trash2 className="w-6 h-6 text-destructive" />
                                    {t('delete')}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="pt-2 font-bold text-foreground/70">
                                    &quot;{listing.title}&quot; {t('will_be_moved_to_bin')}
                                    <span className="block text-[10px] text-muted-foreground uppercase tracking-widest mt-4">
                                        {t('restore_within')}
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-3 sm:gap-0 mt-6">
                                <AlertDialogCancel className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 shadow-none border-1 border-card-foreground/10 bm-interactive">{t('cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/95 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 shadow-none active:scale-95">{t('move_to_bin_confirm')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
             </DropdownMenu>
        </div>

        {/* Thumbnail Section */}
        <div className="relative aspect-video w-full bg-muted overflow-hidden">
             <Image
                src={activeImage}
                alt={listing.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">ID: {listing.id?.slice(-8)}</span>
                    <h3 className="font-black text-white text-lg sm:text-xl lg:text-2xl leading-none tracking-tighter uppercase line-clamp-1">
                        {listing.title}
                    </h3>
                </div>
            </div>
        </div>

        {/* Meta Info */}
        <div className="p-6 sm:p-8 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-8">
                <div className="text-3xl font-black text-foreground tracking-tighter uppercase">
                    {formatCurrency(listing.price, (listing as any).currency)}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(listing.createdAt || 0), { addSuffix: true })}
                </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto">
                 <Button 
                    asChild
                    className={cn(
                        "w-full bg-primary hover:bg-primary/95 text-white font-black h-14 text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-primary/10 active:scale-95",
                        listing.status === 'PENDING_APPROVAL' && "opacity-50 pointer-events-none"
                    )}
                 >
                    <Link href={`/my-listings/promote/${listing.id}`}>
                        <Sparkles className="w-4 h-4 mr-3" />
                        {t('promote')}
                    </Link>
                 </Button>

                 <AlertDialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
                    <Button 
                        variant="secondary"
                        className={cn(
                            "w-full bg-muted border-1 border-card-foreground/5 hover:bg-muted/80 text-foreground font-black h-14 text-xs uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95",
                            (listing.status === 'PENDING_APPROVAL' || isStatsLoading) && "opacity-50 pointer-events-none"
                        )}
                        onClick={handleRenewClick}
                        disabled={isPending || isStatsLoading}
                    >
                        <RefreshCw className={cn("w-4 h-4 mr-3 opacity-60", (isPending || isStatsLoading) && "animate-spin")} />
                        {isStatsLoading ? '...' : t('renew')}
                    </Button>
                    <AlertDialogContent className="rounded-[2.5rem] max-w-sm border-1 border-card-foreground/10 bg-card shadow-2xl">
                         <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-3 font-black uppercase tracking-tight text-xl">
                                <RefreshCw className="w-6 h-6 text-primary" />
                                {t('renew_listing')}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="pt-2 font-bold text-foreground/70">
                                {renewalStats?.canRenewNow ? (
                                    <>
                                        <div className="bg-primary/5 p-4 rounded-2xl border-1 border-primary/20 text-primary text-xs mb-4">
                                            {t('renewals_remaining', { count: renewalStats?.remainingMonthly })}
                                        </div>
                                        <p>{t('renew_for_days', { price: PRICING.RENEWAL })}</p>
                                    </>
                                ) : (
                                    <div className="bg-amber-500/10 p-4 rounded-2xl border-1 border-amber-500/20 text-amber-700 text-xs flex gap-3">
                                        <AlertTriangle className="w-5 h-5 shrink-0" />
                                        <p>{renewalStats?.hoursUntilRenew === 1 
                                            ? t('renew_limit_warning', { hours: renewalStats?.hoursUntilRenew })
                                            : t('renew_limit_warning_plural', { hours: renewalStats?.hoursUntilRenew })
                                        }</p>
                                    </div>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3 sm:gap-0 mt-6">
                            <AlertDialogCancel className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 border-1 border-card-foreground/10 bm-interactive">{t('cancel')}</AlertDialogCancel>
                            {renewalStats?.canRenewNow && (
                                <AlertDialogAction onClick={handleConfirmRenew} className="bg-primary hover:bg-primary/95 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 shadow-none">
                                    {t('renew_now')}
                                </AlertDialogAction>
                            )}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                 </AlertDialog>

                 {/* Receipt download — only visible when a promotion payment exists */}
                 {hasReceipt && (
                     <Button
                         variant="outline"
                         className="w-full border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-black h-12 text-xs uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-none"
                         onClick={handleDownloadReceipt}
                     >
                         <Download className="w-4 h-4 mr-3" />
                         Download Receipt
                     </Button>
                 )}
            </div>
        </div>
      </motion.div>
    );
};
