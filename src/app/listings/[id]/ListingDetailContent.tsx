'use client';

import { ListingQA } from '@/components/listing/listing-qa';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
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
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useFavorites } from '@/lib/context/favorites-context';
import { cn, formatCurrency } from '@/lib/utils';
import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Edit,
  Heart,
  History,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Phone,
  Share2,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

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
}

interface ListingDetailContentProps {
  listing: Listing;
  initialQuestions?: any[];
}



function getOrCreateAnalyticsSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(7);
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ListingDetailContent({ listing, initialQuestions = [] }: ListingDetailContentProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const { isFavorite: isFavCheck, toggleFavorite } = useFavorites();
  const isFavorite = isFavCheck(listing._id);
  const { data: session } = useSession();

  const recordVisit = useMutation(api.history.recordVisit);
  const trackEvent = useMutation(api.analytics.trackEvent);

  // ── Seller data ──────────────────────────────────────────────────────────
  const seller = useConvexQuery(api.users.getByExternalId, { externalId: listing.userId });
  const sellerReviewStats = useConvexQuery(api.reviews.getSellerReviewStats, { sellerId: listing.userId });
  const sellerProfile = useConvexQuery(api.storefront.getPublicProfile, { userId: listing.userId });

  useEffect(() => {
    if (!listing._id) return;
    
    // Safety check for browser environment
    if (typeof window === 'undefined') return;

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
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived values (stable, no state needed) ──────────────────────────────
  const images = listing.images ?? [];
  const mainImage = images[selectedImage] ?? listing.thumbnail ?? '/placeholder-listing.jpg';
  const contactPhone = listing.contactPhone ?? (seller as any)?.phone;
  const contactEmail = listing.contactEmail ?? (seller as any)?.email;
  const condition = listing.specifications?.condition;
  const isListingOwner = session?.user?.id === listing.userId;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canManage = isListingOwner || isAdmin;

  // Date: suppressHydrationWarning on the span avoids the useEffect+state hack.
  // The string is computed once per render on the client after hydration.
  const publishDate = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString('mk-MK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  // ── Specs: computed once, not 4× inline ──────────────────────────────────
  const filteredSpecs = useMemo(() => {
    if (!listing.specifications) return [];
    return Object.entries(listing.specifications).filter(
      ([key]) => key !== 'condition' && !key.startsWith('_'),
    );
  }, [listing.specifications]);

  const specsMidpoint = Math.ceil(filteredSpecs.length / 2);
  const specsLeft = filteredSpecs.slice(0, specsMidpoint);
  const specsRight = filteredSpecs.slice(specsMidpoint);

  // ── Contact tracking ──────────────────────────────────────────────────────
  const handleContactClick = (type: 'contact' | 'call' | 'email') => {
    trackEvent({
      eventType: `click_${type}`,
      sessionId: getOrCreateAnalyticsSessionId(),
      userId: session?.user?.id,
      data: { listingId: listing._id },
    });
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing.title, text: listing.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const listingRef =
    listing.listingNumber !== undefined ? listing.listingNumber : listing._id.slice(-7);

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
            {/* suppressHydrationWarning replaces the useEffect+publishDate state */}
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
        <AppBreadcrumbs
          className="mb-4 md:mb-6"
          items={[{ label: 'Listings', href: '/listings' }, { label: listing.title }]}
        />

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
              <button
                onClick={() => toggleFavorite(listing._id)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-all shadow-sm ${
                  isFavorite
                    ? 'bg-primary/5 border-primary/20 text-primary'
                    : 'bg-card border-border text-foreground hover:bg-accent'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved' : 'Save Ad'}
              </button>
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
                <Image src={mainImage} alt={listing.title} fill className="object-cover" priority />
              </div>

              {images.length > 1 && (
                <div className="absolute inset-0 hidden md:flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
                    <ChevronLeft className="w-6 h-6 rotate-180" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-4 left-4">
                <div className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                  {selectedImage + 1} / {Math.max(images.length, 1)} PHOTOS
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-4 md:px-0 py-2 no-scrollbar snap-x">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'relative flex-shrink-0 aspect-square w-16 md:w-24 rounded-lg overflow-hidden snap-start transition-all duration-300',
                      selectedImage === idx
                        ? 'ring-2 ring-primary scale-105 shadow-lg opacity-100'
                        : 'opacity-70 hover:opacity-100 grayscale hover:grayscale-0',
                    )}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Info Block */}
            <div className="md:hidden space-y-4 px-4 bg-background border-b py-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {seller?.isVerified && (
                    <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded tracking-tighter">
                      Verified Seller
                    </span>
                  )}
                  {!!condition && (
                    <span className="text-[10px] font-bold uppercase text-muted-foreground border border-border px-2 py-0.5 rounded tracking-tighter">
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
                    <span suppressHydrationWarning className="text-3xl font-black text-primary">
                      {listing.price > 0 ? formatCurrency(listing.price, listing.currency) : 'Price on request'}
                    </span>
                    {listing.price > 0 && (
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Fixed</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
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
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                      {contactEmail}
                    </p>
                  )}
                </div>
                {!isListingOwner && (
                  <button
                    onClick={() => toggleFavorite(listing._id)}
                    className={`p-2.5 rounded-full transition-colors ${isFavorite ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>

              <div className="pt-4 space-y-3">
                <Button asChild variant="outline" className="w-full h-12 rounded-xl border-2 hover:bg-primary/5 hover:text-primary font-black uppercase tracking-wider text-[10px] shadow-sm">
                  <Link href={`/store/${listing.userId}`}>Visit Storefront</Link>
                </Button>

                {!isListingOwner && (
                  <ContactOptionsDialog
                    session={session}
                    listing={listing}
                    contactPhone={contactPhone}
                    contactEmail={contactEmail}
                    onContact={() => handleContactClick('contact')}
                  />
                )}
              </div>
            </div>

            {/* Specifications */}
            {filteredSpecs.length > 0 && (
              <div className="bg-card md:rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted">
                  <h3 className="font-black text-foreground uppercase tracking-tight text-sm">
                    Technical Specifications
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                  <SpecsColumn specs={specsLeft} />
                  <SpecsColumn specs={specsRight} />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-card md:rounded-2xl border border-border shadow-sm px-6 py-8 space-y-6">
              <div className="space-y-1">
                <h3 className="font-black text-foreground uppercase tracking-tight text-sm">
                  Product Description
                </h3>
                <div className="h-1 w-8 bg-primary rounded-full" />
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-base">
                {listing.description}
              </p>
            </div>

            {/* Q&A Section */}
            <ListingQA 
               listingId={listing._id} 
               sellerId={listing.userId} 
               initialQuestions={initialQuestions} 
            />
          </div>

          {/* ── Right Column (Desktop) ───────────────────────────────────── */}
          <div className="hidden  md:block md:col-span-5 lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6  overflow-y-auto pr-1 no-scrollbar z-10">

              {/* Price & Actions Card */}
              <div className="bg-card border-2 border-border rounded-3xl p-6 md:p-8 shadow-xl shadow-foreground/5 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight uppercase">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {listing.city}, {listing.region ?? 'Skopje'}
                  </div>
                </div>

                <div className="p-6 bg-muted rounded-2xl flex flex-col gap-1 border border-border relative overflow-hidden">
                  {listing.status !== 'ACTIVE' && (
                    <div
                      className={cn(
                        'absolute top-3 left-4 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm z-10',
                        listing.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-red-100 text-red-700 border-red-200',
                      )}
                    >
                      {listing.status === 'PENDING_APPROVAL' ? 'Pending Approval' : listing.status}
                    </div>
                  )}
                  {listing.previousPrice && listing.previousPrice > listing.price && (
                    <div className="absolute top-3 right-4 flex items-center gap-1.5 opacity-60">
                      <History className="w-3 h-3" />
                      <span suppressHydrationWarning className="text-xs font-bold line-through">
                        {formatCurrency(listing.previousPrice, listing.currency)}
                      </span>
                    </div>
                  )}
                  <div suppressHydrationWarning className="text-4xl font-black text-primary tracking-tighter">
                    {listing.price > 0 ? formatCurrency(listing.price, listing.currency) : 'Call for Price'}
                  </div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Secured Transaction • Fixed Price
                  </div>
                </div>

                {!isListingOwner && (
                  <div className="space-y-3 pt-2">
                    <ContactOptionsDialog
                      session={session}
                      listing={listing}
                      contactPhone={contactPhone}
                      contactEmail={contactEmail}
                      onContact={() => handleContactClick('contact')}
                      large
                    />
                  </div>
                )}

                <div className="flex items-center justify-center pt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest gap-4">
                  <span>Item: {listingRef}</span>
                  <span>•</span>
                  <span suppressHydrationWarning>Posted: {publishDate}</span>
                </div>
              </div>

              {/* Seller Card */}
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
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest" suppressHydrationWarning>
                      {seller?.isVerified ? 'Verified' : 'Member'} since{' '}
                      {seller?.createdAt || (seller as any)?._creationTime 
                        ? new Date(seller.createdAt || (seller as any)._creationTime).toLocaleDateString('mk-MK', {day: '2-digit', month: '2-digit', year: 'numeric'}) 
                        : 'Recently'}
                    </p>
                    {contactEmail && (
                      <p className="text-xs font-bold text-muted-foreground mt-0.5">
                        {contactEmail}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-muted rounded-xl text-center border border-border">
                    <div className="text-lg font-black text-foreground">
                      {sellerProfile?.activeListingsCount ?? '0'}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Active Ads</p>
                  </div>
                  <div className="p-3 bg-muted rounded-xl text-center border border-border">
                    <div className="text-lg font-black text-foreground">
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
                   <Button asChild variant="outline" className="w-full rounded-xl border-2 hover:bg-primary/5 hover:text-primary font-bold uppercase tracking-wider text-xs">
                     <Link href={`/store/${listing.userId}`}>Visit Storefront</Link>
                   </Button>
                   <LeaveReviewModal listingId={listing._id} sellerId={listing.userId} />
                </div>
              </div>

              {/* Map — lazy loaded to avoid blocking LCP */}
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
    <div className="divide-y divide-border">
      {specs.map(([key, value]) => (
        <div key={key} className="flex justify-between items-center p-4 hover:bg-accent transition-colors">
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className="font-bold text-foreground text-sm">{String(value)}</span>
        </div>
      ))}
    </div>
  );
});

/**
 * ContactOptionsDialog — opens a popup with direct contact options:
 *   • Call (tel:) and SMS (sms:) — if phone available
 *   • Email (mailto:) — if email available
 *   • Chat with Seller — only for signed-in users
 */
const ContactOptionsDialog = memo(function ContactOptionsDialog({
  session,
  listing,
  contactPhone,
  contactEmail,
  onContact,
  large = false,
}: {
  session: any;
  listing: any;
  contactPhone?: string | null;
  contactEmail?: string | null;
  onContact: () => void;
  large?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const triggerCls = large
    ? 'w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg uppercase tracking-tight shadow-xl shadow-primary/20 inline-flex items-center justify-center gap-2 cursor-pointer transition-all'
    : 'flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-tight shadow-lg shadow-primary/20 active:scale-95 transition-all w-full cursor-pointer';

  const hasPhone = Boolean(contactPhone);
  const hasEmail = Boolean(contactEmail);
  const isLoggedIn = Boolean(session?.user);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className={triggerCls}
          onClick={() => { onContact(); setOpen(true); }}
        >
          <Phone className={large ? 'mr-2 h-6 w-6' : 'w-4 h-4'} />
          Contact Seller
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounded-3xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border px-6 py-5">
          <AlertDialogTitle className="text-lg font-black tracking-tight">
            Contact Seller
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground mt-0.5">
            Choose how you'd like to get in touch
          </AlertDialogDescription>
        </div>

        {/* Options */}
        <div className="px-5 py-4 space-y-2.5">
          {/* Call */}
          {hasPhone && (
            <a
              href={`tel:${contactPhone}`}
              onClick={() => { setOpen(false); onContact(); }}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-green-500/50 hover:bg-green-500/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm">Call</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{contactPhone}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-green-500 transition-colors" />
            </a>
          )}

          {/* SMS */}
          {hasPhone && (
            <a
              href={`sms:${contactPhone}`}
              onClick={() => { setOpen(false); onContact(); }}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm">SMS</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{contactPhone}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-500 transition-colors" />
            </a>
          )}

          {/* WhatsApp */}
          {hasPhone && (
            <a
              href={`https://wa.me/${contactPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I'm interested in your listing: ${listing.title} on Biggest Market.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { setOpen(false); onContact(); }}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-green-600/50 hover:bg-green-600/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-green-600/10 flex items-center justify-center shrink-0 group-hover:bg-green-600/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-green-700">WhatsApp</p>
                <p className="text-xs text-muted-foreground truncate">Send WhatsApp message</p>
              </div>
              <ChevronRight className="w-4 h-4 text-green-600/40 group-hover:text-green-600 transition-colors" />
            </a>
          )}

          {/* Viber */}
          {hasPhone && (
            <a
              href={`viber://chat?number=%2B${contactPhone?.replace(/\D/g, '')}`}
              onClick={() => { setOpen(false); onContact(); }}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-violet-600/50 hover:bg-violet-600/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-600/10 flex items-center justify-center shrink-0 group-hover:bg-violet-600/20 transition-colors">
                <Phone className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-violet-700">Viber</p>
                <p className="text-xs text-muted-foreground truncate">Chat on Viber</p>
              </div>
              <ChevronRight className="w-4 h-4 text-violet-600/40 group-hover:text-violet-600 transition-colors" />
            </a>
          )}

          {/* Email */}
          {hasEmail && (
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Inquiry about: ${listing.title}`)}`}
              onClick={() => { setOpen(false); onContact(); }}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm">Email</p>
                <p className="text-xs text-muted-foreground truncate">{contactEmail}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-orange-500 transition-colors" />
            </a>
          )}

          {/* Chat — signed-in users only */}
          {isLoggedIn && (
            <Link
              href={`/messages?listingId=${listing._id}`}
              onClick={() => { setOpen(false); onContact(); }}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-primary">Chat with Seller</p>
                <p className="text-xs text-muted-foreground">Internal message</p>
              </div>
              <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
            </Link>
          )}

          {!hasPhone && !hasEmail && !isLoggedIn && (
            <p className="text-sm text-muted-foreground text-center py-4">No contact details available</p>
          )}
        </div>

        <div className="px-5 pb-5">
          <AlertDialogCancel className="w-full rounded-2xl font-bold">
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
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
  // React 19: useTransition replaces manual isDeleting state + setIsDeleting calls
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