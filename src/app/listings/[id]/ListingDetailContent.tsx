'use client';

import { ListingQA } from '@/components/listing/listing-qa';
import { SaveAdButton } from '@/components/listing/save-ad-button';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { FollowSellerButton } from '@/components/shared/follow-seller-button';
import { ContactSellerButton } from '@/components/shared/listing/contact-button';
import { ReportModal } from '@/components/shared/report-modal';
import { SellerBadge } from '@/components/shared/seller-badge';
import { UserAvatar } from '@/components/shared/user-avatar';
import { LeaveReviewModal } from '@/components/store/leave-review-modal';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useFavorites } from '@/lib/context/favorites-context';
import { cn, formatCurrency } from '@/lib/utils';
import { rgbDataURL } from '@/lib/utils/utils';
import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Copy,
  Edit,
  MapPin,
  MessageSquare,
  MoreVertical,
  Share2,
  ShieldAlert,
  Store,
  Trash2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { toast } from 'sonner';

// ─── Utilities ────────────────────────────────────────────────────────────────

function getOrCreateAnalyticsSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(7);
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  images: string[];
  thumbnail?: string;
  category: string;
  city: string;
  region?: string;
  createdAt: number;
  viewCount?: number;
  userId: string;
  contactPhone?: string;
  contactEmail?: string;
  specifications?: Record<string, unknown>;
  status: string;
  previousPrice?: number;
  listingNumber?: number;
  isPriceNegotiable?: boolean;
}

interface ListingDetailContentProps {
  listing: Listing;
  initialQuestions?: any[];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ListingDetailContent({
  listing,
  initialQuestions = [],
}: ListingDetailContentProps) {
  const router = useRouter();
  const t = useTranslations('ListingDetail');
  const tCommon = useTranslations('Common');
  const tFilter = useTranslations('FilterPanel');
  const [selectedImage, setSelectedImage] = useState(0);
  const { isFavorite: isFavCheck } = useFavorites();
  const isFavorite = isFavCheck(listing._id);
  const { data: session } = useSession();
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // condition label helper (same mapping as listing cards)
  const getConditionLabel = (condition?: string | null): string => {
    if (!condition) return '';
    switch (condition.toLowerCase()) {
      case 'new':
        return tCommon('brand_new');
      case 'like-new':
        return tFilter('cond_like_new');
      case 'good':
        return tFilter('cond_good');
      case 'fair':
        return tFilter('cond_fair');
      case 'used':
        return tCommon('pre_owned');
      case 'new construction':
        return tFilter('cond_new_construction');
      case 'old construction':
        return tFilter('cond_old_construction');
      default:
        return condition;
    }
  };

  const recordVisit = useMutation(api.history.recordVisit);
  const trackEvent = useMutation(api.analytics.trackEvent);
  const hasTrackedRef = useRef(false);

  // ── Seller data ──────────────────────────────────────────────────────────
  const seller = useConvexQuery(api.users.getByExternalId, {
    externalId: listing.userId,
  });
  const sellerReviewStats = useConvexQuery(api.reviews.getSellerReviewStats, {
    sellerId: listing.userId,
  });
  const sellerProfile = useConvexQuery(api.storefront.getPublicProfile, {
    userId: listing.userId,
  });

  // ── Category template (for field labels) ─────────────────────────────────
  const categoryTemplate = useConvexQuery(
    api.categories.getBySlug,
    listing.category ? { slug: listing.category } : 'skip',
  );
  // Build key → label map from the template fields
  const fieldLabelMap = useMemo<Record<string, string>>(() => {
    const fields = (categoryTemplate as any)?.template?.fields;
    if (!Array.isArray(fields)) return {};
    return Object.fromEntries(fields.map((f: any) => [f.key, f.label]));
  }, [categoryTemplate]);

  useEffect(() => {
    // Safety check for browser environment + React Strict Mode guard
    if (!listing._id || typeof window === 'undefined' || hasTrackedRef.current)
      return;
    hasTrackedRef.current = true;

    const sessionId = getOrCreateAnalyticsSessionId();
    trackEvent({
      eventType: 'view_listing',
      sessionId,
      userId: session?.user?.id,
      data: { listingId: listing._id },
    });

    if (session?.user?.id) {
      recordVisit({
        listingId: listing._id as Id<'listings'>,
        userId: session.user.id,
      });
    }
  }, [listing._id, session?.user?.id, trackEvent, recordVisit]);

  // ── Derived values ────────────────────────────────────────────────────────
  const images = listing.images ?? [];
  const mainImage =
    images[selectedImage] ?? listing.thumbnail ?? '/placeholder-listing.jpg';
  const contactPhone = listing.contactPhone ?? (seller as any)?.phone;
  const contactEmail = listing.contactEmail ?? (seller as any)?.email;
  const condition = listing.specifications?.condition;
  const isListingOwner = session?.user?.id === listing.userId;
  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const canManage = isListingOwner || isAdmin;

  const publishDate = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString('mk-MK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const filteredSpecs = useMemo(() => {
    if (!listing.specifications) return [];
    return Object.entries(listing.specifications).filter(
      ([key]) => key !== 'condition' && !key.startsWith('_'),
    );
  }, [listing.specifications]);

  const specsMidpoint = Math.ceil(filteredSpecs.length / 2);
  const specsLeft = filteredSpecs.slice(0, specsMidpoint);
  const specsRight = filteredSpecs.slice(specsMidpoint);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('link_copied'));
    }
  };

  const listingRef =
    listing.listingNumber !== undefined
      ? listing.listingNumber
      : listing._id.slice(-7);
  const mapQuery = encodeURIComponent(
    listing.city + (listing.region ? `, ${listing.region}` : ''),
  );

  return (
    <div className='min-h-screen bg-background pb-12 border-b border-border'>
      {/* ── Mobile Header ────────────────────────────────────────────────── */}
      <div className='sticky top-0 z-40 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-border md:hidden'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => router.back()}
            className='p-1 hover:bg-accent rounded-full transition-colors'
            aria-label='Go back'
          >
            <ChevronLeft className='w-6 h-6 text-foreground' />
          </button>
          <div className='flex flex-col'>
            <span className='text-sm font-black tracking-tight leading-none text-foreground uppercase'>
              {t('item_ref')}: {listingRef}
            </span>
            <span
              suppressHydrationWarning
              className='text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider'
            >
              {publishDate}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='h-9 w-9 text-muted-foreground'
            onClick={handleShare}
            aria-label='Share'
          >
            <Share2 className='w-5 h-5' />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-9 w-9 text-muted-foreground'
                aria-label='More options'
              >
                <MoreVertical className='w-5 h-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-56 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-1.5 shadow-2xl'
            >
              {/* Save listing */}
              {!isListingOwner && (
                <DropdownMenuItem
                  className='flex items-center gap-2.5 py-2.5 rounded-xl cursor-pointer'
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className='pointer-events-auto w-full'>
                    <SaveAdButton listingId={listing._id} />
                  </div>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className='flex items-center gap-2.5 py-2.5 rounded-xl cursor-pointer'
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success(t('link_copied'));
                }}
              >
                <Copy className='h-4 w-4 text-muted-foreground' />
                <span className='font-semibold text-sm'>{t('copy_link')}</span>
              </DropdownMenuItem>

              {/* Visit store */}
              <DropdownMenuItem asChild>
                <Link
                  href={`/store/${listing.userId}`}
                  className='flex items-center gap-2.5 py-2.5 rounded-xl cursor-pointer'
                >
                  <Store className='h-4 w-4 text-muted-foreground' />
                  <span className='font-semibold text-sm'>
                    {t('visit_storefront')}
                  </span>
                </Link>
              </DropdownMenuItem>

              {/* Follow seller */}
              {!isListingOwner && (
                <DropdownMenuItem
                  className='p-0 rounded-xl cursor-pointer focus:bg-transparent'
                  onSelect={(e) => e.preventDefault()}
                >
                  <FollowSellerButton
                    sellerId={listing.userId}
                    sellerName={seller?.name}
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start px-2 py-2.5 h-auto font-semibold text-sm rounded-xl'
                  />
                </DropdownMenuItem>
              )}

              {/* Owner-only actions */}
              {canManage && (
                <>
                  <DropdownMenuSeparator className='my-1 bg-border' />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/my-listings/${listing._id}/edit`}
                      className='flex items-center gap-2.5 py-2.5 rounded-xl cursor-pointer'
                    >
                      <Edit className='h-4 w-4 text-muted-foreground' />
                      <span className='font-semibold text-sm'>
                        {t('edit_ad')}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='p-0 rounded-xl cursor-pointer focus:bg-transparent'
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <DeleteListingButton listingId={listing._id} compact />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='container-wide px-4 md:pt-3'>
        {/* ── Desktop Actions ───────────────────────────────────────────── */}
        <div className='hidden md:flex items-center justify-between mb-8 border-b border-border'>
          <div className='pt-6'>
            <AppBreadcrumbs />
          </div>
          <div className='flex items-center justify-between gap-3'>
            <button
              onClick={handleShare}
              className='flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-all'
            >
              <Share2 className='w-4 h-4' />
              {t('share')}
            </button>
            {!isListingOwner && <SaveAdButton listingId={listing._id} />}
            {canManage && (
              <>
                <Link
                  href={`/my-listings/${listing._id}/edit`}
                  className='flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-border transition-all'
                >
                  <Edit className='w-4 h-4' />
                  {t('edit_ad')}
                </Link>
                <DeleteListingButton listingId={listing._id} compact />
              </>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 mb-12'>
          {/* ── Left Column ─────────────────────────────────────────────── */}
          <div className='md:col-span-7 lg:col-span-8 space-y-4 md:space-y-6'>
            {/* Image Gallery */}
            <div className='relative group overflow-hidden md:rounded-lg border border-border bg-muted'>
              <div
                className='flex w-full aspect-[4/3] md:aspect-video overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pointer-events-auto'
                onScroll={(e) => {
                  const container = e.currentTarget;
                  const index = Math.round(
                    container.scrollLeft / container.clientWidth,
                  );
                  if (index !== selectedImage) setSelectedImage(index);
                }}
              >
                {images.length > 0 ? (
                  images.map((img, i) => (
                    <div
                      key={i}
                      className='relative w-full h-full flex-shrink-0 snap-center pointer-events-auto'
                    >
                      <Image
                        src={typeof img === 'string' ? img : (img as any).url}
                        alt={`${listing.title} - Image ${i + 1}`}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 1200px'
                        placeholder='blur'
                        blurDataURL={rgbDataURL(241, 245, 249)}
                        className='object-cover pointer-events-none'
                        priority={i === 0}
                      />
                    </div>
                  ))
                ) : (
                  <div className='relative w-full h-full flex-shrink-0 snap-center pointer-events-auto'>
                    <Image
                      src={mainImage}
                      alt={listing.title}
                      fill
                      className='object-cover pointer-events-none'
                      priority
                    />
                  </div>
                )}
              </div>

              {/* Floating Meta Items */}
              <div className='absolute top-3 right-3 z-30 pointer-events-auto'>
                {!isListingOwner && (
                  <SaveAdButton
                    listingId={listing._id}
                    showText={false}
                    className='p-2 sm:p-2.5'
                    iconClassName='w-4 h-4 sm:w-6 sm:h-6'
                  />
                )}
              </div>

              <div className='hidden md:flex absolute top-3 left-3 z-30 text-white bg-black/60 backdrop-blur-md p-2.5 rounded-lg border border-white/10 flex-col pointer-events-none'>
                <span className='text-sm font-black tracking-tight leading-none text-white uppercase'>
                  {t('item_ref')}: {listingRef}
                </span>
                <span
                  suppressHydrationWarning
                  className='text-[10px] font-bold text-white mt-1 uppercase tracking-wider'
                >
                  {publishDate}
                </span>
              </div>

              {/* Clickable Dots mapped directly here under the image */}
              {images.length > 1 && (
                <div className='absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2 pointer-events-auto'>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const container = e.currentTarget.parentElement
                          ?.parentElement?.firstElementChild as HTMLElement;
                        if (container)
                          container.scrollTo({
                            left: container.clientWidth * i,
                            behavior: 'smooth',
                          });
                      }}
                      className={cn(
                        'w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.4)]',
                        i === selectedImage
                          ? 'bg-white scale-125'
                          : 'bg-white/60 scale-90 hover:bg-white/80',
                      )}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Info Block */}
            <div className='md:hidden space-y-4 px-4 bg-background border-b py-2'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 mb-1 flex-wrap'>
                  {/* SellerBadge will be next to title now */}
                  {!!condition && (
                    <span className='text-[10px] font-bold uppercase text-muted-foreground py-0.5 rounded tracking-wider'>
                      {t('condition')}: {getConditionLabel(String(condition))}
                    </span>
                  )}
                  {listing.status !== 'ACTIVE' && (
                    <span
                      className={cn(
                        'text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-tighter',
                        listing.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-red-100 text-red-700 border border-red-200',
                      )}
                    >
                      {listing.status === 'PENDING_APPROVAL'
                        ? t('pending_approval')
                        : listing.status}
                    </span>
                  )}
                </div>
                <div className='flex items-start justify-between gap-2'>
                  <h1 className='text-xl font-bold text-foreground leading-tight flex-1'>
                    {listing.title}
                  </h1>
                  <SellerBadge seller={seller} showLabel />
                </div>
                <div className='flex flex-col'>
                  {listing.previousPrice &&
                    listing.previousPrice > listing.price && (
                      <span
                        suppressHydrationWarning
                        className='text-xs font-bold text-muted-foreground/50 line-through mb-[-2px]'
                      >
                        {formatCurrency(
                          listing.previousPrice,
                          listing.currency,
                        )}
                      </span>
                    )}
                  <div className='flex items-baseline gap-2'>
                    <span
                      suppressHydrationWarning
                      className='text-4xl font-black text-foreground tracking-tighter'
                    >
                      {listing.price > 0
                        ? formatCurrency(listing.price, listing.currency)
                        : t('price_on_request')}
                    </span>
                    <div className='flex items-center gap-2 mt-0.5'>
                      {listing.price > 0 && (
                        <span className='text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-1.5 py-0.5 rounded'>
                          {listing.isPriceNegotiable
                            ? t('negotiable')
                            : t('fixed')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {filteredSpecs.length > 0 && (
              <div className='space-y-3 pt-4 md:pt-2'>
                <div className='flex items-center gap-2 px-1'>
                  <div className='w-1 h-4 bg-primary rounded-full' />
                  <h3 className='font-bold text-foreground uppercase tracking-tight text-xs'>
                    {t('technical_specs')}
                  </h3>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-0.5 px-1'>
                  <SpecsColumn
                    specs={specsLeft}
                    fieldLabelMap={fieldLabelMap}
                  />
                  <SpecsColumn
                    specs={specsRight}
                    fieldLabelMap={fieldLabelMap}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className='bg-card md:rounded-lg border border-border px-5 py-6 md:px-8 md:py-8 space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='w-1 h-4 bg-primary rounded-full' />
                <h3 className='font-bold text-foreground uppercase tracking-tight text-xs'>
                  {t('about_item')}
                </h3>
              </div>
              <div className='relative'>
                <p
                  className={cn(
                    'text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base transition-all duration-300',
                    !isDescExpanded &&
                      listing.description.length > 300 &&
                      'max-h-[120px] overflow-hidden mask-fade-bottom',
                  )}
                >
                  {listing.description}
                </p>
                {listing.description.length > 300 && (
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className='mt-4 flex items-center gap-1.5 text-foreground text-[11px] font-medium uppercase tracking-widest hover:bg-secondary transition-all bg-background border border-border px-4 py-2 rounded-lg'
                  >
                    {isDescExpanded ? (
                      <>
                        <ChevronUp className='w-3.5 h-3.5' />
                        {t('show_less')}
                      </>
                    ) : (
                      <>
                        <ChevronDown className='w-3.5 h-3.5' />
                        {t('read_full_desc')}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* RESTORED: Mobile Seller & Contact Info */}
            <div className='sm:hidden flex items-center gap-3 pt-4 border-t border-border'>
              <Link
                href={`/store/${listing.userId}`}
                className='shrink-0 hover:opacity-80 transition-opacity'
              >
                <UserAvatar
                  user={seller}
                  className='w-10 h-10 border-2 border-border'
                />
              </Link>
              <div className='flex-1 min-w-0'>
                <Link
                  href={`/store/${listing.userId}`}
                  className='group flex items-center gap-1.5 w-fit'
                >
                  <span className='font-bold text-sm text-foreground group-hover:text-primary transition-colors'>
                    {seller?.name ?? t('seller')}
                  </span>
                  <SellerBadge seller={seller} size='sm' showLabel />
                </Link>
                <p className='text-[10px] font-medium text-muted-foreground uppercase tracking-wider'>
                  {seller?.isVerified || seller?.accountStatus === 'ACTIVE'
                    ? t('verified_since')
                    : t('member_since')}{' '}
                  {seller?.createdAt || (seller as any)?._creationTime
                    ? new Date(
                        seller.createdAt || (seller as any)._creationTime,
                      ).toLocaleDateString('mk-MK', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : t('recently')}
                </p>
                {contactEmail && (
                  <p className='text-[10px] text-primary font-semibold uppercase tracking-wider mt-0.5 hover:underline cursor-pointer'>
                    {contactEmail}
                  </p>
                )}
              </div>
            </div>

            {/* RESTORED: Mobile Action Buttons */}
            <div className='sm:hidden flex flex-col pt-3 space-y-3 gap-3 w-full'>
              {!isListingOwner && (
                <div className='space-y-3 pt-2'>
                  <ContactSellerButton
                    sellerId={listing.userId}
                    listingId={listing._id}
                    sellerName={seller?.name || 'Seller'}
                    contactPhone={contactPhone}
                    contactEmail={contactEmail}
                    listingTitle={listing.title}
                    label={
                      <div className='flex items-center gap-2'>
                        <MessageSquare className='w-5 h-5' />
                        <span>{t('contact_options')}</span>
                      </div>
                    }
                    className='w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-base uppercase tracking-tight inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95'
                  />
                </div>
              )}
              <div className='grid grid-cols-2 gap-2 w-full'>
                <Button
                  asChild
                  variant='outline'
                  className='w-full h-10 border rounded-lg text-muted-foreground border-border bg-background font-medium text-xs uppercase tracking-tight inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95'
                >
                  <Link href={`/store/${listing.userId}`}>
                    {t('visit_storefront')}
                  </Link>
                </Button>
                {!isListingOwner && (
                  <FollowSellerButton
                    sellerId={listing.userId}
                    sellerName={seller?.name}
                    variant='outline'
                    className='w-full h-10 rounded-lg text-muted-foreground border-border bg-background font-medium text-sm uppercase tracking-tight active:scale-95'
                  />
                )}
              </div>
            </div>
            <div className='mt-4 flex flex-col gap-2 cursor-pointer md:hidden'>
              <LeaveReviewModal
                listingId={listing._id}
                sellerId={listing.userId}
              />
            </div>

            {/* Q&A Section */}
            <ListingQA
              listingId={listing._id}
              sellerId={listing.userId}
              initialQuestions={initialQuestions}
            />
          </div>

          {/* ── Right Column (Desktop) ───────────────────────────────────── */}
          <div className='hidden md:block md:col-span-5 lg:col-span-4 space-y-6'>
            <div className='sticky top-24 space-y-6  overflow-y-auto pr-1 no-scrollbar z-10'>
              {/* Price & Actions Card */}
              <div className='bg-card border border-border rounded-lg p-6 md:p-8 space-y-6'>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <h1 className='text-xl font-bold text-muted-foreground tracking-tight leading-tight uppercase flex-1'>
                      {listing.title}
                    </h1>
                    <SellerBadge seller={seller} showLabel />
                  </div>
                  <div className='flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest'>
                    <MapPin className='w-3.5 h-3.5 text-primary' />
                    {listing.city}, {listing.region ?? 'Skopje'}
                  </div>
                  <div
                    suppressHydrationWarning
                    className='text-5xl font-black text-foreground tracking-tighter leading-none'
                  >
                    {listing.price > 0
                      ? formatCurrency(listing.price, listing.currency)
                      : t('call_for_price')}
                    {listing.price > 0 && (
                      <span className='text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded'>
                        {listing.isPriceNegotiable
                          ? t('negotiable')
                          : t('fixed')}
                      </span>
                    )}
                  </div>
                </div>
                {!isListingOwner && (
                  <div className='space-y-3 pt-2'>
                    <ContactSellerButton
                      sellerId={listing.userId}
                      listingId={listing._id}
                      sellerName={seller?.name || 'Seller'}
                      contactPhone={contactPhone}
                      contactEmail={contactEmail}
                      listingTitle={listing.title}
                      label={
                        <div className='flex items-center gap-2'>
                          <MessageSquare className='w-5 h-5' />
                          <span>{t('contact_options')}</span>
                        </div>
                      }
                      className='w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-base uppercase tracking-tight inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95'
                    />
                  </div>
                )}
              </div>

              {/* RESTORED: Seller Card */}
              <div className='bg-card border border-border rounded-lg p-6 overflow-hidden'>
                <div className='flex items-center gap-4 mb-6'>
                  <Link
                    href={`/store/${listing.userId}`}
                    className='shrink-0 hover:opacity-80 transition-opacity'
                  >
                    <UserAvatar
                      user={seller}
                      className='w-16 h-16 border-4 border-muted shadow-md'
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/store/${listing.userId}`}
                      className='group flex items-center gap-1.5 mb-1 w-fit'
                    >
                      <h4 className='font-black text-foreground text-lg group-hover:text-primary transition-colors'>
                        {seller?.name ??
                          (seller === undefined ? t('loading') : t('seller'))}
                      </h4>
                      <SellerBadge seller={seller} showLabel />
                    </Link>
                    <p
                      className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'
                      suppressHydrationWarning
                    >
                      {seller?.isVerified || seller?.accountStatus === 'ACTIVE'
                        ? t('verified_since')
                        : t('member_since')}{' '}
                      {seller?.createdAt || (seller as any)?._creationTime
                        ? new Date(
                            seller.createdAt || (seller as any)._creationTime,
                          ).toLocaleDateString('mk-MK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : t('recently')}
                    </p>
                    {contactEmail && (
                      <p className='text-sm underline font-bold text-muted-foreground mt-0.5'>
                        {contactEmail}
                      </p>
                    )}
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='p-3 bg-secondary rounded-lg text-center border border-border'>
                    <div className='text-base font-black text-foreground'>
                      {sellerProfile?.activeListingsCount ?? '0'}
                    </div>
                    <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-tighter'>
                      {t('active_ads')}
                    </p>
                  </div>
                  <div className='p-3 bg-secondary rounded-lg text-center border border-border'>
                    <div className='text-base font-black text-foreground'>
                      {sellerReviewStats && sellerReviewStats.totalReviews > 0
                        ? sellerReviewStats.averageRating.toFixed(1)
                        : t('new_seller')}
                    </div>
                    <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-tighter'>
                      {sellerReviewStats && sellerReviewStats.totalReviews > 0
                        ? `${sellerReviewStats.totalReviews} ${t('reviews')}${sellerReviewStats.totalReviews !== 1 ? '' : ''}`
                        : t('seller_rating')}
                    </p>
                  </div>
                </div>

                <div className='mt-4 flex flex-col gap-2'>
                  <Button
                    asChild
                    variant='secondary'
                    className='w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-sm uppercase tracking-tight inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95'
                  >
                    <Link href={`/store/${listing.userId}`}>
                      {t('visit_storefront')}
                    </Link>
                  </Button>
                  {!isListingOwner && (
                    <FollowSellerButton
                      sellerId={listing.userId}
                      sellerName={seller?.name}
                      variant='outline'
                      showCount
                      className='w-full h-10'
                    />
                  )}
                  <LeaveReviewModal
                    listingId={listing._id}
                    sellerId={listing.userId}
                  />
                </div>
              </div>

              {/* Map — fixed the incorrect template string formatting */}
              <LazyMap
                query={mapQuery}
                city={listing.city}
                region={listing.region}
              />

              {/* Safety */}
              <div className='space-y-2 px-2'>
                <p className='text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3'>
                  {t('safety_trust')}
                </p>
                <ReportModal targetId={listing._id} targetType='listing'>
                  <button className='w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg group hover:bg-secondary transition-all'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-md bg-secondary group-hover:bg-border transition-colors border border-border'>
                        <ShieldAlert className='w-4 h-4 text-muted-foreground group-hover:text-foreground' />
                      </div>
                      <span className='text-xs font-medium text-foreground'>
                        {t('report_suspicious')}
                      </span>
                    </div>
                    <ChevronLeft className='w-4 h-4 text-muted-foreground rotate-180' />
                  </button>
                </ReportModal>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Map & Safety */}
        <div className='md:hidden px-4 py-8 space-y-6'>
          <div className='bg-card border border-border rounded-2xl overflow-hidden shadow-sm aspect-[4/3] relative'>
            <iframe
              width='100%'
              height='100%'
              frameBorder='0'
              src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              loading='lazy'
              className='filter contrast-[1.1]'
              title={`Map of ${listing.city}`}
            />
            <div className='absolute bottom-4 left-4 bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black shadow-lg border border-border'>
              {listing.city}
            </div>
          </div>

          <div className='p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2'>
            <div className='flex items-center gap-2 text-amber-900'>
              <ShieldAlert className='w-4 h-4' />
              <span className='font-black text-xs uppercase tracking-tighter'>
                {t('safety_first')}
              </span>
            </div>
            <p className='text-xs text-amber-800 leading-relaxed font-medium mb-3'>
              {t('safety_tip')}
            </p>
            <ReportModal targetId={listing._id} targetType='listing'>
              <button className='w-full flex items-center justify-between p-3 bg-white border border-amber-200 rounded-xl group hover:border-amber-400 transition-all text-left mt-2'>
                <span className='text-xs font-bold text-amber-900'>
                  {t('report_suspicious')}
                </span>
                <ChevronLeft className='w-4 h-4 text-amber-700 rotate-180' />
              </button>
            </ReportModal>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components (memoized) ────────────────────────────────────────────────

/** Renders one column of the specs grid — memoized to skip re-renders */
const SpecsColumn = memo(function SpecsColumn({
  specs,
  fieldLabelMap = {},
}: {
  specs: [string, unknown][];
  fieldLabelMap?: Record<string, string>;
}) {
  /** Convert a camelCase/snake_case key into a human-readable fallback */
  const humanize = (key: string) =>
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim();

  return (
    <div className='flex flex-col'>
      {specs.map(([key, value]) => (
        <div
          key={key}
          className='flex justify-between items-baseline py-2 md:py-3 border-b border-border/40 last:border-0 group transition-colors'
        >
          <span className='flex-2 text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-wider pr-2'>
            {fieldLabelMap[key] ?? humanize(key)}
          </span>
          <span className='flex-1 font-bold text-foreground text-xs md:text-sm text-left shrink-0'>
            {String(value)}
          </span>
        </div>
      ))}
    </div>
  );
});

/** Map iframe — loading="lazy" defers network request until visible in viewport */
const LazyMap = memo(function LazyMap({
  query,
  city,
  region,
}: {
  query: string;
  city: string;
  region?: string;
}) {
  return (
    <div className='bg-card border border-border rounded-lg overflow-hidden aspect-[1.5/1] relative group'>
      <iframe
        width='100%'
        height='100%'
        frameBorder='0'
        loading='lazy'
        src={`https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        className='filter grayscale-[0.3] contrast-[1.1] opacity-90 group-hover:opacity-100 transition-opacity'
        title={`Map of ${city}`}
      />
      <div className='absolute bottom-4 left-4 right-4 pointer-events-none'>
        <div className='bg-card/95 backdrop-blur-md px-4 py-2 rounded-md text-[11px] font-medium border border-border flex items-center gap-2 w-fit text-foreground uppercase tracking-tight'>
          <MapPin className='w-4 h-4 text-primary' />
          {city} • {region ?? 'CENTAR'}
        </div>
      </div>
    </div>
  );
});

// ─── Delete Button ────────────────────────────────────────────────────────────

function DeleteListingButton({
  listingId,
  compact,
}: {
  listingId: string;
  compact?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('ListingDetail');
  const deleteListing = useMutation(api.listings.remove);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteListing({ id: listingId as Id<'listings'> });
        router.push('/my-listings');
      } catch {
        toast.error(t('delete_confirm_desc'));
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={compact ? 'ghost' : 'destructive'}
          className={
            compact
              ? 'w-full justify-start px-2 py-2.5 h-auto font-semibold text-sm rounded-xl text-foreground hover:bg-accent focus:bg-accent'
              : 'h-10 sm:h-11 md:h-12 bg-red-600 rounded-lg hover:bg-red-700 text-white font-medium text-xs sm:text-sm sm:col-span-2 md:col-span-1 min-w-0'
          }
          disabled={isPending}
        >
          <div
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 min-w-0 w-full',
              compact ? 'justify-start pl-0.5' : 'justify-center',
            )}
          >
            <Trash2
              className={
                compact
                  ? 'w-4 h-4 text-muted-foreground shrink-0'
                  : 'w-4 h-4 shrink-0 hover:text-red-700'
              }
            />
            {isPending ? (
              '...'
            ) : compact ? (
              t('delete')
            ) : (
              <span className='truncate'>
                {t('delete_listing').replace('?', '')}
              </span>
            )}
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='rounded-lg border border-border p-10 max-w-md'>
        <AlertDialogHeader className='space-y-4'>
          <div className='w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2'>
            <Trash2 className='w-8 h-8 text-red-600' />
          </div>
          <AlertDialogTitle className='text-3xl font-black uppercase tracking-tight text-center'>
            {t('delete_listing')}
          </AlertDialogTitle>
          <AlertDialogDescription className='font-bold text-muted-foreground text-center text-base'>
            {t('delete_confirm_desc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex-col sm:flex-row gap-3 pt-6'>
          <AlertDialogCancel className='rounded-lg font-bold uppercase text-[11px] tracking-widest h-12 border border-border flex-1'>
            {t('keep_listing')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className='rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-[11px] tracking-widest h-12 flex-1 disabled:opacity-70'
          >
            {isPending ? t('deleting') : t('delete_permanently')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
