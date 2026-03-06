'use client';

import {
  deleteListingAction,
  getRenewalStatsAction,
  renewListingAction,
} from '@/actions/listing-actions';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { PRICING } from '@/lib/constants/pricing';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { exportReceiptPdf } from '@/lib/export-receipt-pdf';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn, formatCurrency } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart2,
  Clock,
  Download,
  Edit,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  MoreVertical,
  MousePointerClick,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
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
    userId ? { userId, listingId: listing.id! } : 'skip',
  );
  const hasReceipt = (listingTransactions?.length ?? 0) > 0;

  // Per-listing quick stats — live, real-time from Convex
  const quickStats = useQuery(
    api.analytics.getListingQuickStats,
    listing.id ? { listingId: listing.id as Id<'listings'> } : 'skip',
  );

  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deleteListingAction(listing.id!);
      if (res.success) {
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
      if (res.success) {
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
      platformName: 'Pazar.mk',
      platformEmail: 'info@pazar.mk',
      receiptNumber: receiptNum,
      generatedAt: Date.now(),
      customerName: session?.user?.name ?? meta.customer_name ?? 'Customer',
      customerEmail: session?.user?.email ?? meta.customer_email ?? '',
      customerId: userId,
      listingId: listing.id!,
      listingTitle: listing.title,
      listingCategory: (listing as any).category,
      listingCity: (listing as any).city,
      listingNumber: (listing as any).listingNumber,
      packageName:
        meta.packageName ?? meta.tier ?? listing.promotionTier ?? '—',
      promotionTier: listing.promotionTier ?? undefined,
      durationDays: meta.durationDays,
      promotionStart: listing.promotionExpiresAt
        ? listing.promotionExpiresAt - (meta.durationDays ?? 30) * 86400000
        : undefined,
      promotionEnd: listing.promotionExpiresAt ?? undefined,
      amountPaid: Math.abs(tx.amount),
      currency: 'MKD',
      stripeId: tx.stripeId,
      paymentStatus: tx.status ?? 'COMPLETED',
      paymentMethod: 'Card (Stripe)',
    });
  };

  const imagesArray = listing.images?.length
    ? (listing.images as (string | { url: string })[])
    : ['/placeholder.png'];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    if (index !== activeImageIndex) setActiveImageIndex(index);
  };

  const isPromoted =
    listing.isPromoted &&
    listing.promotionExpiresAt &&
    listing.promotionExpiresAt > Date.now();
  const promoConfig = isPromoted
    ? getPromotionConfig(listing.promotionTier)
    : null;
  const daysLeft =
    isPromoted && listing.promotionExpiresAt
      ? Math.ceil(
          (listing.promotionExpiresAt - Date.now()) / (1000 * 60 * 60 * 24),
        )
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className='group relative flex flex-col h-full bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden border border-card-foreground/5 shadow-none transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 bm-interactive'
    >
      {/* Status Badges Overlay */}
      <div className='absolute top-2.5 left-2.5 z-20 flex flex-wrap gap-1.5 pointer-events-none'>
        {listing.status === 'ACTIVE' && (
          <div className='bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-emerald-500/20'>
            <div className='w-1 h-1 rounded-full bg-white mr-1.5 animate-pulse' />
            {t('status_active')}
          </div>
        )}
        {listing.status === 'PENDING_APPROVAL' && (
          <div className='bg-amber-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-amber-500/20'>
            <Clock className='w-2.5 h-2.5 mr-1.5' />
            {t('status_pending')}
          </div>
        )}
        {isPromoted && promoConfig && (
          <div className='bg-primary text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-primary/20'>
            <PromotionIcon
              iconName={promoConfig.icon}
              className='w-2.5 h-2.5 mr-1.5'
            />
            {t('days_pro', { days: daysLeft })}
          </div>
        )}
      </div>

      {/* Action Dropdown Overlay */}
      <div className='absolute top-2.5 right-2.5 z-20'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='secondary'
              size='icon'
              className='h-8 w-8 rounded-xl bg-background/80 backdrop-blur-md border border-card-foreground/10 hover:bg-background shadow-xl'
            >
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-48 rounded-2xl border border-card-foreground/10 bg-card/95 backdrop-blur-xl p-1.5 shadow-2xl'
          >
            <DropdownMenuItem asChild>
              <Link
                href={`/my-listings/${listing.id}/edit`}
                className='flex items-center gap-2.5 py-2.5 rounded-lg cursor-pointer'
              >
                <Edit className='h-3.5 h-3.5' />
                <span className='font-bold text-[9px] uppercase tracking-widest'>
                  {t('edit')}
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/my-listings/stats/${listing.id}`}
                className='flex items-center gap-2.5 py-2.5 rounded-lg cursor-pointer'
              >
                <BarChart2 className='h-3.5 h-3.5' />
                <span className='font-bold text-[9px] uppercase tracking-widest'>
                  {t('stats')}
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/listings/${listing.id}`}
                target='_blank'
                className='flex items-center gap-2.5 py-2.5 rounded-lg cursor-pointer'
              >
                <ExternalLink className='h-3.5 h-3.5' />
                <span className='font-bold text-[9px] uppercase tracking-widest'>
                  {t('view_live')}
                </span>
              </Link>
            </DropdownMenuItem>

            <div className='h-px bg-card-foreground/5 my-1.5 mx-1' />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className='flex items-center gap-2.5 py-2.5 rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive'
                >
                  <Trash2 className='h-3.5 h-3.5' />
                  <span className='font-bold text-[9px] uppercase tracking-widest'>
                    {t('delete')}
                  </span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className='rounded-[2rem] max-w-sm border border-card-foreground/10 bg-card shadow-2xl'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='flex items-center gap-3 font-black uppercase tracking-tight text-lg'>
                    <Trash2 className='w-5 h-5 text-destructive' />
                    {t('delete')}
                  </AlertDialogTitle>
                  <AlertDialogDescription className='pt-2 font-bold text-foreground/70 text-sm'>
                    &quot;{listing.title}&quot; {t('will_be_moved_to_bin')}
                    <span className='block text-[9px] text-muted-foreground uppercase tracking-widest mt-3'>
                      {t('restore_within')}
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='gap-2 mt-6'>
                  <AlertDialogCancel className='flex-1 rounded-xl font-black uppercase tracking-widest text-[9px] h-12 shadow-none border border-card-foreground/10 bm-interactive'>
                    {t('cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className='flex-1 bg-destructive hover:bg-destructive/95 text-white rounded-xl font-black uppercase tracking-widest text-[9px] h-12 shadow-none active:scale-95'
                  >
                    {t('move_to_bin_confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thumbnail Section */}
      <div className='relative aspect-[5/4] w-full bg-muted overflow-hidden'>
        <div
          className='flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x touch-pan-y'
          onScroll={imagesArray.length > 1 ? handleScroll : undefined}
        >
          {imagesArray.map((img, i) => {
            const imgSrc = typeof img === 'string' ? img : img.url;
            return (
              <Link
                key={i}
                href={`/listings/${listing.id}`}
                className='relative w-full h-full flex-shrink-0 snap-center pointer-events-auto'
                aria-label={`View ${listing.title}`}
              >
                <Image
                  src={imgSrc}
                  alt={`${listing.title} - Image ${i + 1}`}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none'
                  sizes='(max-width: 768px) 50vw, 33vw'
                />
              </Link>
            );
          })}
        </div>
        {/* Clickable Dots */}
        {imagesArray.length > 1 && (
          <div className='absolute bottom-[3.5rem] left-0 right-0 z-30 flex justify-center gap-1.5 pointer-events-auto'>
            {imagesArray.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const container = e.currentTarget.parentElement
                    ?.previousElementSibling as HTMLElement;
                  if (container)
                    container.scrollTo({
                      left: container.clientWidth * i,
                      behavior: 'smooth',
                    });
                }}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300 shadow-md',
                  i === activeImageIndex
                    ? 'bg-white scale-110 shadow-black/50'
                    : 'bg-white/50 scale-90',
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none' />

        {/* Date Badge — bottom-right corner */}
        <div className='absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/10 px-2 py-1 rounded-lg pointer-events-none'>
          <Clock className='w-2.5 h-2.5 text-white/60 shrink-0' />
          <span className='text-[8px] font-black uppercase tracking-widest text-white/70 leading-none'>
            {formatDistanceToNow(new Date(listing.createdAt || 0), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div className='absolute bottom-3 left-3 right-16 flex flex-col pointer-events-none'>
          <h3 className='font-black text-white text-sm sm:text-base leading-tight tracking-tight uppercase line-clamp-2 drop-shadow-md'>
            {listing.title}
          </h3>
        </div>
      </div>

      {/* Meta Info */}
      <div className='p-3.5 flex flex-col flex-1'>
        <div className='flex flex-col gap-1 mb-4'>
          <div className='flex items-center justify-between'>
            <div className='text-xl font-black text-foreground tracking-tighter uppercase'>
              {formatCurrency(listing.price, (listing as any).currency)}
            </div>
          </div>
          <div className='flex items-center'>
            <span className='text-[8px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10'>
              ID: {listing.id?.slice(-8)}
            </span>
          </div>
        </div>

        {/* ── Live Analytics Strip ─────────────────────────────── */}
        <div className='mb-4 bg-muted/30 border border-card-foreground/5 rounded-2xl p-2.5'>
          <div className='grid grid-cols-4 gap-1 text-center'>
            {/* Views */}
            <div className='flex flex-col items-center gap-0.5'>
              <Eye className='w-3 h-3 text-orange-500 opacity-70' />
              <span className='font-black text-xs text-foreground leading-none'>
                {quickStats === undefined ? '—' : (quickStats.viewCount ?? 0)}
              </span>
              <span className='text-[7px] font-black uppercase tracking-tight text-muted-foreground'>
                Views
              </span>
            </div>
            {/* Saved */}
            <div className='flex flex-col items-center gap-0.5 border-l border-card-foreground/5'>
              <Heart className='w-3 h-3 text-rose-500 opacity-70' />
              <span className='font-black text-xs text-foreground leading-none'>
                {quickStats === undefined ? '—' : quickStats.favorites}
              </span>
              <span className='text-[7px] font-black uppercase tracking-tight text-muted-foreground'>
                Saved
              </span>
            </div>
            {/* Leads */}
            <div className='flex flex-col items-center gap-0.5 border-l border-card-foreground/5'>
              <MousePointerClick className='w-3 h-3 text-blue-500 opacity-70' />
              <span className='font-black text-xs text-foreground leading-none'>
                {quickStats === undefined ? '—' : quickStats.contactClicks}
              </span>
              <span className='text-[7px] font-black uppercase tracking-tight text-muted-foreground'>
                Leads
              </span>
            </div>
            {/* Inquiries */}
            <div className='flex flex-col items-center gap-0.5 border-l border-card-foreground/5'>
              <MessageSquare className='w-3 h-3 text-emerald-500 opacity-70' />
              <span className='font-black text-xs text-foreground leading-none'>
                {quickStats === undefined ? '—' : quickStats.inquiries}
              </span>
              <span className='text-[7px] font-black uppercase tracking-tight text-muted-foreground'>
                Msgs
              </span>
            </div>
          </div>
          <Link
            href={`/my-listings/stats/${listing.id}`}
            className='flex items-center justify-center gap-1.5 mt-2 pt-2 border-t border-card-foreground/5 text-[8px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors'
          >
            <BarChart2 className='w-2.5 h-2.5' />
            Analytics
          </Link>
        </div>

        {/* Main Action Buttons */}
        <div className='flex flex-row gap-2 mt-auto'>
          <Button
            asChild
            size='sm'
            className={cn(
              'flex-1 bg-primary hover:bg-primary/95 text-white font-black h-10 text-[9px] uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-95',
              listing.status === 'PENDING_APPROVAL' &&
                'opacity-50 pointer-events-none',
            )}
          >
            <Link href={`/my-listings/promote/${listing.id}`}>
              <Sparkles className='w-3 h-3 mr-2' />
              {t('promote')}
            </Link>
          </Button>

          <div className='flex flex-1 gap-2'>
            <AlertDialog
              open={isRenewDialogOpen}
              onOpenChange={setIsRenewDialogOpen}
            >
              <Button
                variant='secondary'
                size='sm'
                className={cn(
                  'flex-1 bg-muted border border-card-foreground/5 hover:bg-muted/80 text-foreground font-black h-10 text-[9px] uppercase tracking-[0.15em] rounded-xl transition-all active:scale-95',
                  (listing.status === 'PENDING_APPROVAL' || isStatsLoading) &&
                    'opacity-50 pointer-events-none',
                )}
                onClick={handleRenewClick}
                disabled={isPending || isStatsLoading}
              >
                <RefreshCw
                  className={cn(
                    'w-3 h-3 mr-2 opacity-60',
                    (isPending || isStatsLoading) && 'animate-spin',
                  )}
                />
                {isStatsLoading ? '...' : t('renew')}
              </Button>
              <AlertDialogContent className='rounded-[2rem] max-w-sm border border-card-foreground/10 bg-card shadow-2xl'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='flex items-center gap-3 font-black uppercase tracking-tight text-lg'>
                    <RefreshCw className='w-5 h-5 text-primary' />
                    {t('renew_listing')}
                  </AlertDialogTitle>
                  <AlertDialogDescription className='pt-2 font-bold text-foreground/70 text-sm'>
                    {renewalStats?.canRenewNow ? (
                      <>
                        <div className='bg-primary/5 p-3 rounded-xl border border-primary/20 text-primary text-[10px] mb-3 uppercase tracking-widest font-black'>
                          {t('renewals_remaining', {
                            count: renewalStats?.remainingMonthly,
                          })}
                        </div>
                        <p>{t('renew_for_days', { price: PRICING.RENEWAL })}</p>
                      </>
                    ) : (
                      <div className='bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-700 text-[10px] flex gap-2 font-bold'>
                        <AlertTriangle className='w-4 h-4 shrink-0' />
                        <p>
                          {renewalStats?.hoursUntilRenew === 1
                            ? t('renew_limit_warning', {
                                hours: renewalStats?.hoursUntilRenew,
                              })
                            : t('renew_limit_warning_plural', {
                                hours: renewalStats?.hoursUntilRenew,
                              })}
                        </p>
                      </div>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='gap-2 mt-6'>
                  <AlertDialogCancel className='flex-1 rounded-xl font-black uppercase tracking-widest text-[9px] h-12 border border-card-foreground/10 bm-interactive'>
                    {t('cancel')}
                  </AlertDialogCancel>
                  {renewalStats?.canRenewNow && (
                    <AlertDialogAction
                      onClick={handleConfirmRenew}
                      className='flex-1 bg-primary hover:bg-primary/95 text-white rounded-xl font-black uppercase tracking-widest text-[9px] h-12 shadow-none'
                    >
                      {t('renew_now')}
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {hasReceipt && (
              <Button
                variant='outline'
                size='icon'
                className='h-10 w-10 shrink-0 border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl transition-all active:scale-95 shadow-none'
                onClick={handleDownloadReceipt}
              >
                <Download className='w-4 h-4' />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
