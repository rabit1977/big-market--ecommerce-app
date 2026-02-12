import { getPendingListings } from '@/actions/listing-actions';
import { PendingListingsTable } from '@/components/admin/pending-listings-table';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';

export const metadata = {
  title: 'Admin - Pending Listings',
};

export default async function AdminListingsPage() {
  const listings = await getPendingListings();
  
  const serializedListings = (listings || []).map(l => ({
      ...l,
      _id: l._id,
      id: l._id,
      _creationTime: l._creationTime,
  }));

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <AppBreadcrumbs />
        <h1 className="text-3xl font-bold tracking-tight">Pending Listings</h1>
        <p className="text-muted-foreground">Review and approve new listings from users.</p>
      </div>

      <PendingListingsTable listings={serializedListings} />
    </div>
  );
}
