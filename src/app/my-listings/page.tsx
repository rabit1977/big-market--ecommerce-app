
import { getMyListingsAction } from '@/actions/listing-actions';
import { MyListingsDashboardHeader } from '@/components/listing/dashboard-header';
import { MyListingListItem } from '@/components/listing/my-listing-list-item';
import { MyListingsSearch } from '@/components/listing/my-listings-search';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { ListingWithRelations } from '@/lib/types/listing';
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'My Listings',
};

import { verifyStripePayment } from '@/actions/stripe-actions';
import { Suspense } from 'react';


// ... other imports ...

interface MyListingsPageProps {
  searchParams: Promise<{ q?: string; session_id?: string; promoted?: string }>;
}

export default async function MyListingsPage({ searchParams }: MyListingsPageProps) {
  const { q, session_id, promoted } = await searchParams;

  if (session_id && promoted === 'true') {
      try {
          await verifyStripePayment(session_id);
      } catch (e) {
          console.error("Failed to verify promotion:", e);
      }
  }

  const { success, listings, error } = await getMyListingsAction(q);

  if (!success) {
      if (error === 'Unauthorized') {
          redirect('/auth/signin'); 
      }
      return <div className="p-8 text-center text-destructive font-bold text-sm uppercase tracking-wide">Error loading listings: {error}</div>;
  }

  return (
    <div className='min-h-screen bg-background dark:bg-background pt-4 md:pt-8 pb-20'>
      <div className='container max-w-5xl mx-auto px-4'>
      <AppBreadcrumbs className="mb-6 md:mb-8 text-muted-foreground/60" />
      
      {/* Dashboard Stats Header */}
      <MyListingsDashboardHeader />

      {/* Listings Section Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 border-b border-card-foreground/10 pb-8'>
        <div>
           <h2 className='text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase leading-none'>My Listings</h2>
           <p className='text-muted-foreground text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-4 opacity-60'>Manage your active and sold items</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <Suspense fallback={<div className="h-10 w-[300px] bg-muted/40 animate-pulse rounded-xl border-1 border-card-foreground/10" />}>
                <MyListingsSearch />
            </Suspense>
            <Button asChild className="gap-2 rounded-xl font-black bg-primary hover:bg-primary/95 shrink-0 h-10 text-[10px] md:text-xs px-6 uppercase tracking-[0.15em] transition-all shadow-none active:scale-95 border border-primary/20">
                <Link href="/sell">
                    <Plus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Post Ad</span>
                    <span className="sm:hidden">Post Listing</span>
                </Link>
            </Button>
        </div>
      </div>

      {listings && listings.length > 0 ? (
          <div className='flex flex-col gap-3 md:gap-4'>
              {listings.map((listing: ListingWithRelations) => (
                  <MyListingListItem key={listing.id} listing={listing} />
              ))}
          </div>
      ) : (
          <div className='text-center py-12 md:py-32 bg-card rounded-2xl bm-interactive shadow-none'>
              <div className="w-24 h-24 bg-muted/40 border-1 border-card-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-all duration-300 group-hover:bg-background group-hover:border-card-foreground/20">
                  <Package className="h-10 w-10 text-muted-foreground opacity-40" />
              </div>
              <h3 className='text-2xl md:text-4xl font-black text-foreground uppercase tracking-tighter mb-4'>No listings yet</h3>
              <p className='text-muted-foreground max-w-sm mx-auto mb-10 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] opacity-60'>
                  You haven&apos;t posted any ads yet. Start selling today!
              </p>
              <Button asChild size="lg" className="rounded-xl font-black text-xs uppercase tracking-widest h-14 px-12 transition-all active:scale-95 shadow-none border border-primary/20 bg-primary hover:bg-primary/95 text-white">
                  <Link href="/sell">Post Ad Now</Link>
              </Button>
          </div>
      )}
      </div>
    </div>
  );
}
