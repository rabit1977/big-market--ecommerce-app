
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
    <div className='container max-w-5xl mx-auto pt-4 md:pt-8 min-h-screen pb-20 px-4'>
      <AppBreadcrumbs className="mb-6 md:mb-8 text-muted-foreground/60" />
      
      {/* Dashboard Stats Header */}
      <MyListingsDashboardHeader />

      {/* Listings Section Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8 border-b border-border pb-4 md:pb-6'>
        <div>
           <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase leading-none'>My Listings</h2>
           <p className='text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-widest mt-3'>Manage your active and sold items</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <Suspense fallback={<div className="h-10 w-[300px] bg-muted animate-pulse rounded-lg" />}>
                <MyListingsSearch />
            </Suspense>
            <Button asChild className="gap-2 rounded-lg font-bold bg-primary hover:bg-primary/90 shrink-0 h-10 text-xs md:text-sm px-6 uppercase tracking-widest transition-all shadow-none">
                <Link href="/sell">
                    <Plus className="h-4 w-4 stroke-[3]" />
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
          <div className='text-center py-8 md:py-24 bg-card rounded-lg border border-border transition-all duration-200 group shadow-none'>
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center mx-auto mb-6 transition-all duration-200">
                  <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className='text-xl md:text-2xl font-bold text-foreground uppercase tracking-tight mb-2'>No listings yet</h3>
              <p className='text-muted-foreground max-w-sm mx-auto mb-8 text-xs md:text-sm font-bold uppercase tracking-widest'>
                  You haven&apos;t posted any ads yet. Start selling today!
              </p>
              <Button asChild size="lg" className="rounded-lg font-bold text-sm uppercase tracking-widest h-12 px-8 transition-transform shadow-none">
                  <Link href="/sell">Create Listing</Link>
              </Button>
          </div>
      )}
    </div>
  );
}
