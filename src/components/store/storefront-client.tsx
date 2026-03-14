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
  ChevronDown,
  ChevronUp,
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
import { useState } from 'react';
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

            <div className='shrink-0'>
              <FollowSellerButton
                sellerId={profile.externalId}
                sellerName={profile.name}
                showCount
                className='w-full sm:w-auto h-10 px-6'
              />
            </div>
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
      {/* Cover / Banner - Compact mobile height */}
      <div className='h-24 md:h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b' />

      <div className='container max-w-6xl mx-auto px-4 sm:px-6'>
        {/* Profile Header - Compacted for mobile */}
        <div className='relative flex flex-col md:flex-row items-center md:items-end gap-3 md:gap-5 -mt-12 md:-mt-16 mb-6 md:mb-10'>
          <Avatar className='h-24 w-24 md:h-32 md:w-32 border-4 border-background rounded-lg shadow-none bg-card'>
            <AvatarImage
              src={profile.image || ''}
              alt={profile.name || 'User'}
              className='object-cover'
            />
            <AvatarFallback className='text-3xl bg-muted text-muted-foreground font-bold'>
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 text-center md:text-left space-y-1 pt-1'>
            <div className='flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2.5'>
              <h1 className='text-xl md:text-2xl font-black uppercase tracking-tight text-foreground'>
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
          <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0 md:mt-0'>
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
              className='h-12 border-2 px-6 sm:px-8 rounded-lg font-bold tracking-tight uppercase flex-1 md:flex-none'
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
            <h2 className='text-lg md:text-xl font-bold uppercase tracking-tight'>
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
  const followers = useQuery(api.followedSellers.getStoreFollowers, { sellerId });
  const [isExpanded, setIsExpanded] = useState(false);

  if (followers === undefined) {
    return (
      <div className='mb-4 p-4 bg-card border border-border rounded-xl animate-pulse'>
        <div className='h-5 w-40 bg-muted rounded' />
      </div>
    );
  }

  return (
    <div className='mb-6 bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full flex items-center gap-2.5 p-4 md:p-5 hover:bg-secondary/50 transition-colors text-left group'
      >
        <div className='p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors'>
          <Users className='w-4 h-4' />
        </div>
        <div className='flex-1'>
          <h2 className='text-sm md:text-base font-black uppercase tracking-tight text-foreground flex items-center gap-2'>
            Store Followers
            <span className='bg-primary/10 text-primary font-black text-[10px] px-2 py-0.5 rounded-full border border-primary/20'>
              {followers.length}
            </span>
          </h2>
          <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 opacity-60'>
            {isExpanded ? 'Click to hide followers' : 'Click to view who follows you'}
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className='w-4 h-4 text-muted-foreground' />
        ) : (
          <ChevronDown className='w-4 h-4 text-muted-foreground' />
        )}
      </button>

      {isExpanded && (
        <div className='px-4 pb-5 md:px-5 md:pb-6 border-t border-dashed border-border/50 pt-4 animate-in fade-in slide-in-from-top-2 duration-300'>
          {followers.length === 0 ? (
            <p className='text-xs text-muted-foreground py-4 text-center border border-dashed border-border/60 rounded-xl bg-muted/20'>
              No followers yet. Share your store to get your first follower!
            </p>
          ) : (
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 font-medium'>
              {followers.map((follower: any) =>
                follower ? (
                  <div
                    key={follower._id}
                    className='flex flex-col items-center gap-1.5 p-2 bg-muted/30 rounded-xl border border-border/40 hover:border-primary/30 transition-all text-center group/item'
                  >
                    <Avatar className='h-9 w-9 rounded-full border-2 border-background shadow-sm group-hover/item:scale-105 transition-transform'>
                      <AvatarImage src={follower.image || ''} className='object-cover' />
                      <AvatarFallback className='bg-primary/10 text-primary font-bold text-[11px]'>
                        {follower.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <p className='text-[9px] font-bold truncate w-full text-foreground leading-tight px-1'>
                      {follower.name || 'User'}
                    </p>
                  </div>
                ) : null,
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
