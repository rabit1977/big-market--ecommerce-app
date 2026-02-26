'use client';

import { ListingQA } from '@/components/listing/listing-qa';
import { SaveAdButton } from '@/components/listing/save-ad-button';
import { ContactSellerButton } from '@/components/shared/listing/contact-button';
import { ReportModal } from '@/components/shared/report-modal';
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
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useFavorites } from '@/lib/context/favorites-context';
import { cn, formatCurrency } from '@/lib/utils';
import { rgbDataURL } from '@/lib/utils/utils';
import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import {
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Edit,
  MapPin,
  MessageSquare,
  MoreVertical,
  Share2,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useMemo, useRef, useState, useTransition } from 'react';
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

export function ListingDetailContent({ listing, initialQuestions = [] }: ListingDetailContentProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const { isFavorite: isFavCheck } = useFavorites();
  const isFavorite = isFavCheck(listing._id);
  const { data: session } = useSession();
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const recordVisit = useMutation(api.history.recordVisit);
  const trackEvent = useMutation(api.analytics.trackEvent);
  const hasTrackedRef = useRef(false);

  // ── Seller data ──────────────────────────────────────────────────────────
  const seller = useConvexQuery(api.users.getByExternalId, { externalId: listing.userId });
  const sellerReviewStats = useConvexQuery(api.reviews.getSellerReviewStats, { sellerId: listing.userId });
  const sellerProfile = useConvexQuery(api.storefront.getPublicProfile, { userId: listing.userId });

  useEffect(() => {
    // Safety check for browser environment + React Strict Mode guard
    if (!listing._id || typeof window === 'undefined' || hasTrackedRef.current) return;
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
  const mainImage = images[selectedImage] ?? listing.thumbnail ?? '/placeholder-listing.jpg';
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
      navigator.share({ title: listing.title, text: listing.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const listingRef = listing.listingNumber !== undefined ? listing.listingNumber : listing._id.slice(-7);
  const mapQuery = encodeURIComponent(listing.city + (listing.region ? `, ${listing.region}` : ''));

  return (
    <div className="min-h-screen bg-background pb-12 border-b border-border">

      {/* ── Mobile Header ────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-accent rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight leading-none text-foreground uppercase">
              Item: {listingRef}
            </span>
            <span
              suppressHydrationWarning
              className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider"
            >
              {publishDate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={handleShare} aria-label="Share">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" aria-label="More options">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="container-wide px-4 pt-4 md:pt-6">

        {/* ── Desktop Actions ───────────────────────────────────────────── */}
        <div className="hidden md:flex items-center justify-end mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-bold text-foreground hover:bg-accent transition-all shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            {!isListingOwner && (
              <SaveAdButton listingId={listing._id} />
            )}
            {canManage && (
              <>
                <Link
                  href={`/my-listings/${listing._id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-bold text-primary hover:bg-primary/20 transition-all shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit Ad
                </Link>
                <DeleteListingButton listingId={listing._id} compact />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 mb-12">

          {/* ── Left Column ─────────────────────────────────────────────── */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4 md:space-y-6">

            {/* Image Gallery */}
            <div className="relative group bg-slate-900 overflow-hidden md:rounded-2xl shadow-xl">
              <div className="relative aspect-[4/3] md:aspect-video w-full">
                <Image 
                  src={mainImage} 
                  alt={listing.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 1200px"
                  placeholder="blur"
                  blurDataURL={rgbDataURL(241, 245, 249)}
                  className="object-cover" 
                  priority 
                />  
                <div className="hidden md:flex absolute top-2 right-2 text-white bg-black/50 p-2 rounded-lg flex-col">
                  <span className="text-sm font-black tracking-tight leading-none text-white uppercase">
                    Item: {listingRef}
                  </span>
                  <span
                    suppressHydrationWarning
                    className="text-[10px] font-bold text-white mt-1 uppercase tracking-wider"
                  >
                    {publishDate}
                  </span>
                </div>
                {images.length > 1 ? (
                  <div className="absolute inset-0 flex items-center opacity-0 px-2 group-hover:opacity-100 transition-opacity pointer-events-none justify-between">
                    <button
                      onClick={() => setSelectedImage((p) => (p > 0 ? p - 1 : images.length - 1))}
                      className="p-3 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all pointer-events-auto"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((p) => (p < images.length - 1 ? p + 1 : 0))}
                      className="p-3 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all pointer-events-auto"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 hidden md:flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>   
                )}
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                  {selectedImage + 1} / {Math.max(images.length, 1)}
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <Carousel
                opts={{ dragFree: true, align: 'start' }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 py-2 gap-1">
                  {images.map((img, idx) => (
                    <CarouselItem
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        'pl-2 basis-[5rem] md:basis-[6rem] cursor-pointer'
                      )}
                    >
                      <div
                        className={cn(
                          'relative aspect-square rounded overflow-hidden transition-all duration-300',
                          selectedImage === idx
                            ? 'ring-1 ring-offset-3 ring-offset-background scale-105 shadow-lg opacity-100'
                            : 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
                        )}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image 
                          src={img} 
                          alt="" 
                          fill 
                          sizes="96px"
                          placeholder="blur"
                          blurDataURL={rgbDataURL(241, 245, 249)}
                          className="object-cover" 
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}

            {/* Mobile Info Block */}
            <div className="md:hidden space-y-4 px-4 bg-background border-b py-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {seller?.isVerified && (
                    <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded tracking-tighter">
                      Verified Seller
                    </span>
                  )}
                  {!!condition && (
                    <span className="text-[10px] font-bold uppercase text-muted-foreground py-0.5 rounded tracking-wider">
                      Condition: {String(condition)}
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
                      {listing.status === 'PENDING_APPROVAL' ? 'Pending Approval' : listing.status}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-foreground leading-tight">{listing.title}</h1>
                <div className="flex flex-col">
                  {listing.previousPrice && listing.previousPrice > listing.price && (
                    <span suppressHydrationWarning className="text-xs font-bold text-muted-foreground/50 line-through mb-[-2px]">
                      {formatCurrency(listing.previousPrice, listing.currency)}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span suppressHydrationWarning className="text-4xl font-black text-foreground tracking-tighter">
                      {listing.price > 0 ? formatCurrency(listing.price, listing.currency) : 'Price on request'}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {listing.price > 0 && (
                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-1.5 py-0.5 rounded">
                          {listing.isPriceNegotiable ? 'Po dogovor' : 'Fixed'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {filteredSpecs.length > 0 && (
              <div className="space-y-3 px-3 pt-4 md:pt-2">
                <div className="flex items-center gap-2 px-1">
                   <div className="w-1 h-4 bg-primary rounded-full" />
                   <h3 className="font-black text-foreground uppercase tracking-tight text-xs">
                    Technical Specifications
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-0.5 px-1">
                  <SpecsColumn specs={specsLeft} />
                  <SpecsColumn specs={specsRight} />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-card md:rounded-2xl border border-border shadow-sm px-5 py-6 md:px-8 md:py-8 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h3 className="font-black text-foreground uppercase tracking-tight text-xs">
                  About this Item
                </h3>
              </div>
              <div className="relative">
                <p className={cn(
                  "text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base transition-all duration-300",
                  !isDescExpanded && listing.description.length > 300 && "max-h-[120px] overflow-hidden mask-fade-bottom"
                )}>
                  {listing.description}
                </p>
                {listing.description.length > 300 && (
                  <button 
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="mt-4 flex items-center gap-1.5 text-primary text-xs font-black uppercase tracking-widest hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-lg"
                  >
                    {isDescExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        Read Full Description
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* RESTORED: Mobile Seller & Contact Info */}
            <div className="sm:hidden flex items-center gap-3 pt-4 border-t border-border">
              <Link href={`/store/${listing.userId}`} className="shrink-0 hover:opacity-80 transition-opacity">
                <UserAvatar user={seller} className="w-10 h-10 border-2 border-border" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/store/${listing.userId}`} className="group flex items-center gap-1 w-fit">
                  <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{seller?.name ?? 'Seller'}</span>
                  {seller?.isVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
                </Link>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider" suppressHydrationWarning>
                  Member since {seller?.createdAt || (seller as any)?._creationTime 
                    ? new Date(seller.createdAt || (seller as any)._creationTime).toLocaleDateString('mk-MK', {day: '2-digit', month: '2-digit', year: 'numeric'}) 
                    : 'Recently'}
                </p>
                {contactEmail && (
                  <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mt-0.5 hover:underline cursor-pointer">
                    {contactEmail}
                  </p>
                )}
              </div>
              {!isListingOwner && (
                <SaveAdButton 
                  listingId={listing._id} 
                  showText={false}
                  className="p-2.5" 
                  iconClassName="w-6 h-6" 
                />
              )}
            </div>

            {/* RESTORED: Mobile Action Buttons */}
            <div className="sm:hidden flex flex-col pt-3 space-y-3 gap-3 w-full">
              {!isListingOwner && (
                <div className="space-y-3 pt-2">
                  <ContactSellerButton
                    sellerId={listing.userId}
                    listingId={listing._id}
                    sellerName={seller?.name || 'Seller'}
                    contactPhone={contactPhone}
                    contactEmail={contactEmail}
                    listingTitle={listing.title}
                    label={
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        <span>Contact Options</span>
                      </div>
                    }
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg uppercase tracking-tight shadow-xl shadow-primary/20 inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  />
                </div>
              )}
              <Button asChild variant="outline" className="w-full h-10 border rounded-2xl text-muted-foreground border-border bg-background border-1 font-black text-base uppercase tracking-tight inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95">
                <Link href={`/store/${listing.userId}`}>Visit Storefront</Link>
              </Button>
            </div>
            <div className="mt-4 flex flex-col gap-2 cursor-pointer md:hidden">
              <LeaveReviewModal listingId={listing._id} sellerId={listing.userId} />
            </div>

            {/* Q&A Section */}
            <ListingQA 
               listingId={listing._id} 
               sellerId={listing.userId} 
               initialQuestions={initialQuestions} 
            />
          </div>

          {/* ── Right Column (Desktop) ───────────────────────────────────── */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6  overflow-y-auto pr-1 no-scrollbar z-10">

              {/* Price & Actions Card */}
              <div className="bg-card border-2 border-border rounded-3xl p-6 md:p-8 shadow-xl shadow-foreground/5 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-muted-foreground tracking-tight leading-tight uppercase">
                      {listing.title}
                    </h1>
                    {listing.price > 0 && (
                      <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded">
                        {listing.isPriceNegotiable ? 'Po dogovor' : 'Fixed'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {listing.city}, {listing.region ?? 'Skopje'}
                  </div>
                   <div suppressHydrationWarning className="text-5xl font-black text-foreground tracking-tighter leading-none">
                    {listing.price > 0 ? formatCurrency(listing.price, listing.currency) : 'Call for Price'}
                  </div>
                </div>
                {!isListingOwner && (
                  <div className="space-y-3 pt-2">
                    <ContactSellerButton
                      sellerId={listing.userId}
                      listingId={listing._id}
                      sellerName={seller?.name || 'Seller'}
                      contactPhone={contactPhone}
                      contactEmail={contactEmail}
                      listingTitle={listing.title}
                      label={
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          <span>Contact Options</span>
                        </div>
                      }
                      className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg uppercase tracking-tight shadow-xl shadow-primary/20 inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    />
                  </div>
                )}
              </div>

              {/* RESTORED: Seller Card */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <Link href={`/store/${listing.userId}`} className="shrink-0 hover:opacity-80 transition-opacity">
                     <UserAvatar user={seller} className="w-16 h-16 border-4 border-muted shadow-md" />
                  </Link>
                  <div>
                    <Link href={`/store/${listing.userId}`} className="group flex items-center gap-1.5 mb-0.5 w-fit">
                      <h4 className="font-black text-foreground text-lg group-hover:text-primary transition-colors">{seller?.name ?? 'Loading...'}</h4>
                      {seller?.isVerified && <BadgeCheck className="w-5 h-5 text-primary" />}
                    </Link>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest" suppressHydrationWarning>
                      {seller?.isVerified ? 'Verified' : 'Member'} since{' - '}
                      {seller?.createdAt || (seller as any)?._creationTime 
                        ? new Date(seller.createdAt || (seller as any)._creationTime).toLocaleDateString('mk-MK', {day: 'numeric', month: 'short', year: 'numeric'}) 
                        : 'Recently'}
                    </p>
                    {contactEmail && (
                      <p className="text-sm underline font-bold text-muted-foreground mt-0.5">
                        {contactEmail}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-muted rounded-xl text-center border border-border">
                    <div className="text-base font-black text-foreground">
                      {sellerProfile?.activeListingsCount ?? '0'}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Active Ads</p>
                  </div>
                  <div className="p-3 bg-muted rounded-xl text-center border border-border">
                    <div className="text-base font-black text-foreground">
                      {sellerReviewStats && sellerReviewStats.totalReviews > 0
                        ? sellerReviewStats.averageRating.toFixed(1)
                        : 'NEW'}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      {sellerReviewStats && sellerReviewStats.totalReviews > 0
                        ? `${sellerReviewStats.totalReviews} Review${sellerReviewStats.totalReviews !== 1 ? 's' : ''}`
                        : 'Seller Rating'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col gap-2">
                   <Button asChild variant="secondary" className="w-full h-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base uppercase tracking-tight shadow-xl shadow-primary/20 inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95">
                     <Link href={`/store/${listing.userId}`}>Visit Storefront</Link>
                   </Button>
                   <LeaveReviewModal listingId={listing._id} sellerId={listing.userId} />
                </div>
              </div>

              {/* Map — fixed the incorrect template string formatting */}
              <LazyMap query={mapQuery} city={listing.city} region={listing.region} />

              {/* Safety */}
              <div className="space-y-2 px-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                  Safety & Trust
                </p>
                <ReportModal targetId={listing._id} targetType="listing">
                  <button className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <ShieldAlert className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="text-xs font-bold text-foreground">Report suspicious activity</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                  </button>
                </ReportModal>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Map & Safety */}
        <div className="md:hidden px-4 py-8 space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm aspect-[4/3] relative">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              loading="lazy"
              className="filter contrast-[1.1]"
              title={`Map of ${listing.city}`}
            />
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black shadow-lg border border-border">
              {listing.city}
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldAlert className="w-4 h-4" />
              <span className="font-black text-xs uppercase tracking-tighter">Safety First</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium mb-3">
              Do not pay in advance. Meet the seller in a public place. Always inspect the item before buying.
            </p>
            <ReportModal targetId={listing._id} targetType="listing">
              <button className="w-full flex items-center justify-between p-3 bg-white border border-amber-200 rounded-xl group hover:border-amber-400 transition-all text-left mt-2">
                <span className="text-xs font-bold text-amber-900">Report suspicious activity</span>
                <ChevronLeft className="w-4 h-4 text-amber-700 rotate-180" />
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
}: {
  specs: [string, unknown][];
}) {
  return (
    <div className="flex flex-col">
      {specs.map(([key, value]) => (
        <div key={key} className="flex justify-between items-baseline py-2 md:py-3 border-b border-border/40 last:border-0 group transition-colors">
          <span className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-wider pr-2">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className="font-bold text-foreground text-xs md:text-sm text-right shrink-0">{String(value)}</span>
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
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm aspect-[1.5/1] relative group">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        loading="lazy"
        src={`https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        className="filter grayscale-[0.3] contrast-[1.1] opacity-90 group-hover:opacity-100 transition-opacity"
        title={`Map of ${city}`}
      />
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="bg-card/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black shadow-xl border border-border flex items-center gap-2 w-fit text-foreground uppercase tracking-tight">
          <MapPin className="w-4 h-4 text-primary" />
          {city} • {region ?? 'CENTAR'}
        </div>
      </div>
    </div>
  );
});

// ─── Delete Button ────────────────────────────────────────────────────────────

function DeleteListingButton({ listingId, compact }: { listingId: string; compact?: boolean }) {
  // React 19: useTransition natively supports async boundaries
  const [isPending, startTransition] = useTransition();
  const deleteListing = useMutation(api.listings.remove);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteListing({ id: listingId as Id<'listings'> });
        router.push('/my-listings');
      } catch {
        toast.error('Failed to delete listing. Please try again.');
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
              ? 'h-9 px-4 rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold text-sm transition-all'
              : 'h-10 sm:h-11 md:h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm sm:col-span-2 md:col-span-1 min-w-0'
          }
          disabled={isPending}
        >
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 w-full">
            <Trash2 className="w-4 h-4 shrink-0" />
            {isPending ? '...' : compact ? 'Delete' : <span className="truncate">Delete Listing</span>}
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2.5rem] border-2 border-border p-10 max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <AlertDialogTitle className="text-3xl font-black uppercase tracking-tight text-center">
            Delete Listing?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-bold text-muted-foreground text-center text-base">
            This action is permanent and cannot be undone. Are you sure you want to remove this ad from
            Biggest Market?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-3 pt-6">
          <AlertDialogCancel className="rounded-full font-black uppercase text-xs tracking-widest h-14 border-2 flex-1">
            Keep Listing
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest h-14 shadow-xl shadow-red-200 flex-1 disabled:opacity-70"
          >
            {isPending ? 'Deleting…' : 'Delete Permanently'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}