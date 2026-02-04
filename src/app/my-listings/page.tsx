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
      return <div className="p-8 text-center text-red-500">Error loading listings: {error}</div>;
  }

  return (
    <div className='container-wide py-8 pt-24 min-h-screen pb-24 bg-gray-50/30'>
      <AppBreadcrumbs />
      {/* Dashboard Stats Header */}
      <MyListingsDashboardHeader />

      {/* Listings Section Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 px-2'>
        <div>
           <h2 className='text-2xl font-bold tracking-tight text-slate-900'>Your Ads</h2>
           <p className='text-muted-foreground text-sm'>Manage your active and sold items</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <MyListingsSearch />
            <Button asChild className="gap-2 rounded-full font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 shrink-0">
                <Link href="/sell">
                    <Plus className="h-4 w-4 stroke-[3]" />
                    <span className="hidden sm:inline">Post New Ad</span>
                    <span className="sm:hidden">Post</span>
                </Link>
            </Button>
        </div>
      </div>

      {listings && listings.length > 0 ? (
          <div className='flex flex-col gap-4'>
              {listings.map((listing: ListingWithRelations) => (
                  <MyListingListItem key={listing.id} listing={listing} />
              ))}
          </div>
      ) : (
          <div className='text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm'>
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Package className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className='text-lg font-semibold text-slate-900'>No listings yet</h3>
              <p className='text-muted-foreground max-w-sm mx-auto mt-2 mb-6'>
                  You haven&apos;t posted any ads yet. Start selling today!
              </p>
              <Button asChild size="lg" className="rounded-xl font-bold">
                  <Link href="/sell">Create your first listing</Link>
              </Button>
          </div>
      )}
    </div>
  );
}
