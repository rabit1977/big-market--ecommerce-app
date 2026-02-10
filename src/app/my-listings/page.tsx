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

interface MyListingsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function MyListingsPage({ searchParams }: MyListingsPageProps) {
  const { q } = await searchParams;
  const { success, listings, error } = await getMyListingsAction(undefined, q);

  if (!success) {
      if (error === 'Unauthorized') {
          redirect('/auth/signin'); 
      }
      return <div className="p-8 text-center text-destructive">Error loading listings: {error}</div>;
  }

  return (
    <div className='container-wide pt-4 md:pt-6 min-h-screen pb-12 bg-muted/10 px-3 md:px-4'>
      <AppBreadcrumbs />
      {/* Dashboard Stats Header */}
      <MyListingsDashboardHeader />

      {/* Listings Section Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6'>
        <div>
           <h2 className='text-base md:text-xl font-black tracking-tight text-foreground'>Your Ads</h2>
           <p className='text-muted-foreground text-[10px] md:text-sm font-medium'>Manage your active and sold items</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <MyListingsSearch />
            <Button asChild className="gap-1.5 rounded-lg md:rounded-full font-bold shadow-sm bg-primary hover:bg-primary/90 shrink-0 h-8 md:h-9 text-xs md:text-sm px-3 md:px-4">
                <Link href="/sell">
                    <Plus className="h-3.5 w-3.5 stroke-[3]" />
                    <span className="hidden sm:inline">Post New Ad</span>
                    <span className="sm:hidden">Post</span>
                </Link>
            </Button>
        </div>
      </div>

      {listings && listings.length > 0 ? (
          <div className='flex flex-col gap-2.5 md:gap-4'>
              {listings.map((listing: ListingWithRelations) => (
                  <MyListingListItem key={listing.id} listing={listing} />
              ))}
          </div>
      ) : (
          <div className='text-center py-12 md:py-16 bg-card rounded-2xl border border-dashed border-border'>
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className='text-sm md:text-base font-bold text-foreground'>No listings yet</h3>
              <p className='text-muted-foreground max-w-sm mx-auto mt-1 mb-4 text-xs md:text-sm'>
                  You haven&apos;t posted any ads yet. Start selling today!
              </p>
              <Button asChild size="sm" className="rounded-lg font-bold text-xs md:text-sm">
                  <Link href="/sell">Create your first listing</Link>
              </Button>
          </div>
      )}
    </div>
  );
}
