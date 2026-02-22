import { AdminListingsClientWrapper } from '@/components/admin/admin-listings-client-wrapper';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Admin - Promoted Listings',
};

export default async function AdminPromotedListingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h1 className="text-3xl font-bold tracking-tight">Promoted Listings</h1>
            </div>
            <p className="text-muted-foreground">
              View and monitor all currently promoted/featured listings.
            </p>
          </div>

          {/* Badge + link back to all listings */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">✦ Promoted Only</span>
            </div>
            <Link
              href="/admin/listings"
              className="text-xs font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              View All Listings →
            </Link>
          </div>
        </div>
      </div>

      <AdminListingsClientWrapper
        status="ALL"
        isPromoted={true}
      />
    </div>
  );
}
