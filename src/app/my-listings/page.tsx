import { getMyListingsAction } from '@/actions/listing-actions';
import { MyListingCard } from '@/components/listing/my-listing-card';
import { Button } from '@/components/ui/button';
import { ListingWithRelations } from '@/lib/types/listing';
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'My Listings',
};

export default async function MyListingsPage() {
  const { success, listings, error } = await getMyListingsAction();

  if (!success) {
      if (error === 'Unauthorized') {
          redirect('/auth/signin'); // Redirect to login if not authenticated
      }
      return <div className="p-8 text-center text-red-500">Error loading listings: {error}</div>;
  }

  return (
    <div className='container-wide py-8 min-h-screen pb-24'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
        <div>
           <h1 className='text-3xl font-bold tracking-tight'>My Listings</h1>
           <p className='text-muted-foreground mt-1'>Manage your active and sold items</p>
        </div>
        <Button asChild className="gap-2 rounded-full font-bold shadow-lg shadow-primary/20">
            <Link href="/sell">
                <Plus className="h-4 w-4 stroke-[3]" />
                Post New Ad
            </Link>
        </Button>
      </div>

      {listings && listings.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {listings.map((listing: ListingWithRelations) => (
                  <MyListingCard key={listing.id} listing={listing} />
              ))}
          </div>
      ) : (
          <div className='text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border'>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className='text-lg font-semibold'>No listings yet</h3>
              <p className='text-muted-foreground max-w-sm mx-auto mt-2 mb-6'>
                  You haven&apos;t posted any ads yet. Start selling today!
              </p>
              <Button asChild>
                  <Link href="/sell">Create your first listing</Link>
              </Button>
          </div>
      )}
    </div>
  );
}
