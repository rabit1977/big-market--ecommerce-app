
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
    <div className='min-h-screen pt-12 md:pt-20 pb-32 bg-background'>
      <div className='container max-w-6xl mx-auto px-4'>
        <div className="animate-fade-in-up">
            <AppBreadcrumbs className="mb-8 md:mb-12 text-muted-foreground/60 font-bold uppercase tracking-[0.2em] text-[10px]" />
            
            <MyListingsDashboardHeader />

            {/* Listings Section Header */}
            <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 md:mb-20 pb-12 border-b border-card-foreground/10'>
              <div className="space-y-4">
                 <h2 className='text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] text-foreground'>
                    My <br className="hidden md:block" /> <span className="text-primary">Listings</span>
                 </h2>
                 <p className='text-xs md:text-sm font-black uppercase tracking-[0.2em] opacity-60 max-w-md'>
                    Manage, promote, and track the performance of your active marketplace items.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                  <Suspense fallback={<div className="h-14 w-full sm:w-[350px] bg-muted/30 animate-pulse rounded-2xl" />}>
                      <div className="w-full sm:w-[350px]">
                        <MyListingsSearch />
                      </div>
                  </Suspense>
                  <Button asChild size="lg" className="w-full sm:w-auto gap-3 rounded-2xl font-black bg-primary hover:bg-primary/95 shrink-0 h-14 text-xs px-10 uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/10 active:scale-95 border border-primary/20">
                      <Link href="/sell">
                          <Plus className="h-5 w-5" />
                          Post Ad
                      </Link>
                  </Button>
              </div>
            </div>

            {listings && listings.length > 0 ? (
                <div className='grid grid-cols-1 gap-6 md:gap-8'>
                    {listings.map((listing: ListingWithRelations) => (
                        <MyListingListItem key={listing.id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-20 md:py-40 bg-card/40 backdrop-blur-sm rounded-[3rem] border-1 border-card-foreground/10 bm-interactive shadow-none group'>
                    <div className="w-32 h-32 bg-muted/40 border-1 border-card-foreground/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                        <Package className="h-12 w-12 text-muted-foreground opacity-30" />
                    </div>
                    <h3 className='text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-6'>Empty Inventory</h3>
                    <p className='text-muted-foreground max-w-sm mx-auto mb-12 text-xs md:text-sm font-black uppercase tracking-[0.2em] opacity-60 italic'>
                        Your marketplace floor is currently empty. Ready to find a new owner for your items?
                    </p>
                    <Button asChild size="lg" className="rounded-2xl font-black text-xs uppercase tracking-[0.2em] h-16 px-16 transition-all active:scale-95 shadow-2xl shadow-primary/20 border border-primary/20 bg-primary hover:bg-primary/95 text-white">
                        <Link href="/sell">Start Selling Now</Link>
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
