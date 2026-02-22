import { AdminListingSearch } from '@/components/admin/AdminListingSearch';
import { AdminListingsClientWrapper } from '@/components/admin/admin-listings-client-wrapper';
import { Suspense } from 'react';

export const metadata = {
  title: 'Admin - Manage Listings',
};

interface AdminListingsPageProps {
    searchParams: Promise<{ status?: string; promoted?: string; listingNumber?: string }>;
}

// Helper to ensure we get a string from searchParams (handles potential arrays)
const ensureString = (val: any): string | undefined => {
  if (Array.isArray(val)) return val[0];
  if (typeof val === 'string') return val;
  return undefined;
};

export default async function AdminListingsPage({ searchParams }: AdminListingsPageProps) {
  const params = await searchParams;
  const status = ensureString(params.status) || 'ALL';
  const promoted = ensureString(params.promoted);
  const listingNumberStr = ensureString(params.listingNumber);
  
  const isPromoted = promoted === 'true';
  const listingNumber = listingNumberStr ? parseInt(listingNumberStr) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isPromoted ? 'Promoted Listings' : 'Manage Listings'}
                </h1>
                
                <p className="text-muted-foreground">
                    {isPromoted ? 'View and monitor all currently promoted/featured listings.' : 'Monitor and manage all listings on the platform.'}
                </p>
            </div>
            {/* Status Filter Links — only shown on the All Listings view, not Promoted */}
            {!isPromoted && (
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                  {[
                      { label: 'All', value: 'ALL' },
                      { label: 'Pending', value: 'PENDING_APPROVAL' },
                      { label: 'Active', value: 'ACTIVE' },
                      { label: 'Rejected', value: 'REJECTED' },
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
            )}
            {isPromoted && (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">✦ Promoted Only</span>
              </div>
            )}
        </div>
        
        {/* Search Bar */}
        <div className="w-full sm:w-auto">
             <Suspense fallback={<div className="h-9 w-64 bg-muted animate-pulse rounded-md" />}>
                  <AdminListingSearch />
             </Suspense>
        </div>
      </div>

      <AdminListingsClientWrapper 
        status={status} 
        isPromoted={isPromoted} 
        listingNumber={listingNumber} 
      />
    </div>
  );
}
