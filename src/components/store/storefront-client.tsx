'use client';

import { FollowSellerButton } from '@/components/shared/follow-seller-button';
import { ContactSellerButton } from '@/components/shared/listing/contact-button';
import { ListingCard } from '@/components/shared/listing/listing-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import {
  Building2,
  CalendarDays,
  Lock,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { StoreReviews } from './store-reviews';

export function StorefrontClient({
  profile,
  listings,
}: {
  profile: any;
  listings: any[];
}) {
  const { data: session } = useSession();
  const t = useTranslations('Store');
  const isOwner =
    session?.user?.id === profile.externalId || session?.user?.role === 'ADMIN';

  const activeListings = listings.filter((l) => l.status === 'ACTIVE');

  const injectedListings = activeListings.map((listing) => ({
    ...listing,
    user: {
      isVerified: profile.isVerified,
      membershipTier:
        profile.membershipTier ||
        (profile.hasPremiumStorefront ? 'BUSINESS' : 'FREE'),
    },
  }));

  // ────────────────────────────────────────────────────────────────────────────
  // NON-PREMIUM (FREE TIER) — basic profile view
  // ────────────────────────────────────────────────────────────────────────────
  if (!profile.hasPremiumStorefront) {
    return (
      <div className='min-h-screen bg-background pb-20'>
        <div className='container max-w-6xl mx-auto px-4 sm:px-6 pt-8'>
          {/* Upgrade Prompt (owner only) */}
          {isOwner && (
            <div className='mb-8 p-6 bg-secondary border border-border rounded-lg flex flex-col md:flex-row items-center justify-between gap-4'>
              <div>
                <h3 className='text-xl font-bold flex items-center gap-2 mb-1'>
                  <Lock className='w-5 h-5 text-primary' />{' '}
                  {t('unlock_storefront')}
                </h3>
                <p className='text-muted-foreground text-sm'>
                  {t('unlock_desc')}
                </p>
              </div>
              <Link href='/premium' className='shrink-0'>
                <Button className='font-medium uppercase tracking-wide rounded-lg h-10 px-6'>
                  {t('upgrade')}
                </Button>
              </Link>
            </div>
          )}

          {/* Basic User Info */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-border'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16 rounded-lg'>
                <AvatarImage
                  src={profile.image || ''}
                  alt={profile.name || 'User'}
                  className='object-cover'
                />
                <AvatarFallback className='text-xl bg-muted text-muted-foreground font-bold'>
                  {profile.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className='text-2xl font-bold tracking-tight text-foreground'>
                  {profile.name}
                </h1>
                <div className='text-sm text-muted-foreground mt-1'>
                  {t('member_since')}{' '}
                  {profile.createdAt
                    ? new Date(profile.createdAt).getFullYear()
                    : 'N/A'}
                </div>
              </div>
            </div>

            {!isOwner && (
              <div className='shrink-0'>
                <FollowSellerButton
                  sellerId={profile.externalId}
                  sellerName={profile.name}
                  showCount
                  className='w-full sm:w-auto h-10 px-6'
                />
              </div>
            )}
          </div>

          {/* Simple Listings Grid */}
          <h2 className='text-lg font-bold uppercase tracking-tight mb-4'>
            {t('sellers_items', { count: activeListings.length })}
          </h2>
          {activeListings.length > 0 ? (
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
              {injectedListings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing as any}
                  viewMode='grid'
                />
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground py-12 text-center'>
              {t('no_items_for_sale')}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // PREMIUM STOREFRONT
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen bg-background pb-20'>
      {/* Cover / Banner */}
      <div className='h-32 md:h-48 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b' />

      <div className='container max-w-6xl mx-auto px-4 sm:px-6'>
        {/* Profile Header */}
        <div className='relative flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-16 md:-mt-20 mb-8 md:mb-12'>
          <Avatar className='h-32 w-32 md:h-40 md:w-40 border-4 border-background rounded-lg shadow-none bg-card'>
            <AvatarImage
              src={profile.image || ''}
              alt={profile.name || 'User'}
              className='object-cover'
            />
            <AvatarFallback className='text-4xl bg-muted text-muted-foreground font-bold'>
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 text-center md:text-left space-y-1.5 pt-2'>
            <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-3'>
              <h1 className='text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground'>
                {profile.accountType === 'COMPANY' && profile.companyName
                  ? profile.companyName
                  : profile.name}
              </h1>
              {profile.isVerified && (
                <div className='inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider mx-auto md:mx-0'>
                  <ShieldCheck className='w-3.5 h-3.5' />
                  {t('verified_seller')}
                </div>
              )}
            </div>

            <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 text-sm text-muted-foreground font-medium'>
              {profile.accountType === 'COMPANY' && (
                <span className='flex items-center gap-1.5 text-xs'>
                  <Building2 className='w-4 h-4' /> {t('company')}
                </span>
              )}
              {profile.city && (
                <span className='flex items-center gap-1.5 text-xs'>
                  <MapPin className='w-4 h-4' /> {profile.city}
                </span>
              )}
              <span className='flex items-center gap-1.5 text-xs'>
                <CalendarDays className='w-4 h-4' /> {t('member_since')}{' '}
                {profile.createdAt
                  ? new Date(profile.createdAt).getFullYear()
                  : 'N/A'}
              </span>
            </div>

            <a
              href='#reviews'
              className='flex items-center justify-center md:justify-start gap-1 pt-1 hover:opacity-80 transition-opacity cursor-pointer'
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(profile.averageRating ?? 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                />
              ))}
              <span className='text-xs font-bold ml-1.5 hover:underline decoration-foreground/30 underline-offset-2'>
                {(profile.averageRating ?? 0).toFixed(1)} ({profile.reviewCount ?? 0}{' '}
                {t('found')})
              </span>
            </a>
          </div>

          {/* Action buttons */}
          <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0 mt-6 md:mt-0'>
            {!isOwner && (
              <ContactSellerButton
                sellerId={profile.externalId}
                sellerName={
                  profile.accountType === 'COMPANY' && profile.companyName
                    ? profile.companyName
                    : profile.name
                }
                contactPhone={profile.phone}
                contactEmail={profile.email}
                className='rounded-lg shadow-none font-medium tracking-tight h-12 px-6 sm:px-8 border border-primary bg-primary hover:bg-primary/95 text-primary-foreground transition-all active:scale-95 flex-1 md:flex-none'
                label={
                  <span className='flex items-center justify-center'>
                    <Phone className='w-5 h-5 mr-3 animate-pulse' />
                    {t('contact_seller')}
                  </span>
                }
              />
            )}
            <FollowSellerButton
              sellerId={profile.externalId}
              sellerName={
                profile.accountType === 'COMPANY' && profile.companyName
                  ? profile.companyName
                  : profile.name
              }
              showCount
              size='lg'
              className={cn(
                'h-12 border-2 px-6 sm:px-8 rounded-lg font-bold tracking-tight uppercase flex-1 md:flex-none',
                isOwner && 'opacity-60 pointer-events-none',
              )}
            />
          </div>
        </div>

        {/* ── Followers section (visible to store owner) ── */}
        {isOwner && (
          <StoreFollowersPanel sellerId={profile.externalId} />
        )}

        {/* ── Listings Grid ── */}
        <div className='space-y-6'>
          <div className='flex items-center justify-between border-b border-border pb-4'>
            <h2 className='text-xl md:text-2xl font-bold uppercase tracking-tight'>
              {t('active_listings')}
            </h2>
            <span className='bg-primary text-primary-foreground font-bold text-xs px-3 py-1 rounded-md'>
              {activeListings.length} {t('found')}
            </span>
          </div>

          {activeListings.length > 0 ? (
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4'>
              {injectedListings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing as any}
                  viewMode='grid'
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-20 bg-background rounded-lg border border-border'>
              <Package className='w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50' />
              <h3 className='text-lg font-bold text-foreground mb-1 uppercase tracking-wider'>
                {t('no_active_listings')}
              </h3>
              <p className='text-sm text-muted-foreground'>
                {t('no_items_for_sale')}
              </p>
            </div>
          )}
        </div>

        <StoreReviews sellerId={profile.externalId} />
      </div>
    </div>
  );
}

// ─── Followers panel shown on the store page to the owner ─────────────────────

function StoreFollowersPanel({ sellerId }: { sellerId: string }) {
  const { data: session } = useSession();
  const followers = useQuery(api.followedSellers.getStoreFollowers, { sellerId });
  const allRows = useQuery(api.followedSellers.debugAll, {});
  const resolvedId = useQuery(api.followedSellers.debugResolveId, { id: sellerId });

  if (followers === undefined) {
    // Loading…
    return (
      <div className='mb-8 p-6 bg-card border border-border rounded-2xl animate-pulse'>
        <div className='h-5 w-40 bg-muted rounded mb-4' />
        <div className='flex gap-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-14 w-14 bg-muted rounded-xl' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='mb-8 p-5 md:p-6 bg-card border border-border rounded-2xl'>
      <div className='flex items-center gap-2 mb-4'>
        <Users className='w-5 h-5 text-primary' />
        <h2 className='text-base md:text-lg font-black uppercase tracking-tight text-foreground'>
          Store Followers
        </h2>
        <span className='ml-auto bg-primary/10 text-primary font-black text-xs px-2.5 py-1 rounded-full'>
          {followers.length}
        </span>
      </div>

      {/* ── TEMPORARY DEBUG — remove after fixing ── */}
      <details className='mb-3 text-[10px] font-mono bg-muted/60 border border-yellow-400/40 rounded-lg p-2 text-muted-foreground'>
        <summary className='cursor-pointer font-bold text-yellow-600'>🔍 Debug Info (remove later)</summary>
        <div className='mt-2 space-y-1 break-all'>
          <p><strong>Your logged in ID:</strong> {session?.user?.id}</p>
          <p><strong>Store you are looking at (sellerId):</strong> {sellerId}</p>
          <hr className="my-2 border-yellow-400/20" />
          <p className="font-bold">Summary of Database rows:</p>
          <ul className="list-disc pl-4 mt-1">
            <li>Times YOU followed someone else: {allRows?.filter((r: any) => r.followerId === session?.user?.id).length ?? 0}</li>
            <li>Times SOMEONE ELSE followed this store: {allRows?.filter((r: any) => r.sellerId === resolvedId?.canonical).length ?? 0}</li>
          </ul>
        </div>
      </details>
      {/* ── END DEBUG ── */}

      {followers.length === 0 ? (
        <p className='text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl'>
          No followers yet. Share your store to get your first follower!
        </p>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
          {followers.map((follower: any) =>
            follower ? (
              <div
                key={follower._id}
                className='flex flex-col items-center gap-1.5 p-3 bg-muted/30 rounded-xl border border-border/40 hover:border-primary/30 transition-all text-center'
              >
                <Avatar className='h-10 w-10 rounded-full border-2 border-background shadow-sm'>
                  <AvatarImage src={follower.image || ''} className='object-cover' />
                  <AvatarFallback className='bg-primary/10 text-primary font-bold text-sm'>
                    {follower.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <p className='text-[10px] font-bold truncate w-full text-center text-foreground leading-tight'>
                  {follower.name || 'User'}
                </p>
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
