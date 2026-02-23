'use client';

import { ListingCard } from '@/components/listing/listing-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Building2, CalendarDays, Lock, MapPin, MessageSquare, Package, ShieldCheck, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { StoreReviews } from './store-reviews';

export function StorefrontClient({ 
  profile, 
  listings 
}: { 
  profile: any;
  listings: any[];
}) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === profile.externalId || session?.user?.role === 'ADMIN';

  const activeListings = listings.filter(l => l.status === 'ACTIVE');
  
  // Inject user relations so ListingCard resolves badges correctly
  const injectedListings = activeListings.map(listing => ({
      ...listing,
      user: {
          isVerified: profile.isVerified,
          membershipTier: profile.membershipTier || (profile.hasPremiumStorefront ? 'BUSINESS' : 'FREE'),
          // Extract specific properties to avoid type mismatches
      }
  }));

  // ----------------------------------------------------------------------
  // BASIC FALLBACK FOR NON-PREMIUM USERS (FREE TIER)
  // ----------------------------------------------------------------------
  if (!profile.hasPremiumStorefront) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          
          {/* Upgrade Prompt for the Owner */}
          {isOwner && (
            <div className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                    <Lock className="w-5 h-5 text-primary" /> Unlock Your Premium Storefront
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Want an exclusive storefront with a custom banner, company logo, review ratings, and a VIP profile? Upgrade to the Business Package (450 den).
                  </p>
               </div>
               <Link href="/premium" className="shrink-0">
                  <Button className="font-bold uppercase tracking-wide">Upgrade for 450 den</Button>
               </Link>
            </div>
          )}

          {/* Basic User Info */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.image || ''} alt={profile.name || 'User'} className="object-cover" />
              <AvatarFallback className="text-xl bg-muted text-muted-foreground font-bold">
                {profile.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {profile.name}
              </h1>
              <div className="text-sm text-muted-foreground mt-1">
                 Member since {new Date(profile.createdAt).getFullYear()}
              </div>
            </div>
          </div>

          {/* Simple Listings Grid */}
          <h2 className="text-lg font-bold uppercase tracking-tight mb-4">Seller's Items ({activeListings.length})</h2>
          {activeListings.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {injectedListings.map(listing => (
                <ListingCard key={listing._id} listing={listing as any} viewMode="grid" />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-12 text-center">This seller currently has no items for sale.</p>
          )}

        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // PREMIUM STOREFRONT (BUSINESS 450 DEN SECURED)
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cover / Banner area */}
      <div className="h-32 md:h-48 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b" />
      
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-16 md:-mt-20 mb-8 md:mb-12">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
            <AvatarImage src={profile.image || ''} alt={profile.name || 'User'} className="object-cover" />
            <AvatarFallback className="text-4xl bg-muted text-muted-foreground font-bold">
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-1.5 pt-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
               <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground">
                 {profile.accountType === 'COMPANY' && profile.companyName ? profile.companyName : profile.name}
               </h1>
               {profile.isVerified && (
                 <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mx-auto md:mx-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Seller
                 </div>
               )}
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 text-sm text-muted-foreground font-medium">
               {profile.accountType === 'COMPANY' && (
                  <span className="flex items-center gap-1.5 text-xs"><Building2 className="w-4 h-4" /> Company</span>
               )}
               {profile.city && (
                  <span className="flex items-center gap-1.5 text-xs"><MapPin className="w-4 h-4" /> {profile.city}</span>
               )}
               <span className="flex items-center gap-1.5 text-xs"><CalendarDays className="w-4 h-4" /> Member since {new Date(profile.createdAt).getFullYear()}</span>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(profile.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                  />
                ))}
                <span className="text-xs font-bold ml-1.5">{profile.averageRating.toFixed(1)} ({profile.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex w-full md:w-auto shrink-0 mt-4 md:mt-0">
             <Button size="lg" className="w-full rounded-full shadow-xl shadow-primary/20 font-black tracking-wider uppercase bg-primary hover:bg-primary/90 text-primary-foreground">
               <MessageSquare className="w-4 h-4 mr-2" />
               Message Seller
             </Button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="space-y-6">
           <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Active Listings</h2>
              <span className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs px-3 py-1 rounded-full">{activeListings.length} found</span>
           </div>

           {activeListings.length > 0 ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {injectedListings.map(listing => (
                  <ListingCard key={listing._id} listing={listing as any} viewMode="grid" />
                ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/60">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-foreground mb-1 uppercase tracking-wider">No active listings</h3>
                <p className="text-sm text-muted-foreground">This seller currently has no items for sale.</p>
             </div>
           )}
        </div>

        <StoreReviews sellerId={profile.externalId} />
      </div>
    </div>
  );
}
