import { AdminListingsTable } from '@/components/admin/AdminListingsTable';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { api, convex } from '@/lib/convex-server';

export const metadata = {
  title: 'Admin - Manage Listings',
};

interface AdminListingsPageProps {
    searchParams: Promise<{ status?: string }>;
}

export default async function AdminListingsPage({ searchParams }: AdminListingsPageProps) {
  const { status = 'ALL' } = await searchParams;
  const listings = await convex.query(api.listings.list, { status });
  
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
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage Listings</h1>
                <p className="text-muted-foreground">Monitor and manage all listings on the platform.</p>
            </div>
            {/* Simple Status Filter Links */}
            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                {[
                    { label: 'All', value: 'ALL' },
                    { label: 'Pending', value: 'PENDING_APPROVAL' },
                    { label: 'Active', value: 'ACTIVE' },
                    { label: 'Rejected', value: 'REJECTED' },
                    { label: 'Sold', value: 'SOLD' }
                ].map((s) => (
                    <a 
                        key={s.value} 
                        href={`/admin/listings?status=${s.value}`}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            status === s.value 
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {s.label}
                    </a>
                ))}
            </div>
        </div>
      </div>

      <AdminListingsTable listings={serializedListings} />
    </div>
  );
}
