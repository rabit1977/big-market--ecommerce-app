
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
  const { success, listings, error } = await getMyListingsAction(q);

  if (!success) {
      if (error === 'Unauthorized') {
          redirect('/auth/signin'); 
      }
      return <div className="p-8 text-center text-destructive font-bold text-sm uppercase tracking-wide">Error loading listings: {error}</div>;
  }

  return (
    <div className='container max-w-5xl mx-auto pt-4 md:pt-8 min-h-screen pb-20 bg-background px-4'>
      <AppBreadcrumbs className="mb-6 md:mb-8" />
      
      {/* Dashboard Stats Header */}
      <MyListingsDashboardHeader />

      {/* Listings Section Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8 border-b border-border pb-4 md:pb-6'>
        <div>
           <h2 className='text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase leading-none'>My Listings</h2>
           <div className="h-1 w-12 bg-primary rounded-full mt-2 mb-2" />
           <p className='text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider'>Manage your active and sold items</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <MyListingsSearch />
            <Button asChild className="gap-2 rounded-full font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 shrink-0 h-10 md:h-12 text-xs md:text-sm px-6 uppercase tracking-tight transition-all hover:scale-105">
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
          <div className='text-center py-16 md:py-24 bg-card rounded-[2rem] border-2 border-dashed border-border/60 hover:border-primary/20 transition-all duration-300 group shadow-sm'>
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                  <Package className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className='text-xl md:text-2xl font-black text-foreground uppercase tracking-tight mb-2'>No listings yet</h3>
              <p className='text-muted-foreground max-w-sm mx-auto mb-8 text-xs md:text-sm font-bold'>
                  You haven&apos;t posted any ads yet. Start selling today!
              </p>
              <Button asChild size="lg" className="rounded-full font-black text-sm uppercase tracking-wider shadow-xl shadow-primary/20 h-12 px-8 hover:scale-105 transition-transform">
                  <Link href="/sell">Create Listing</Link>
              </Button>
          </div>
      )}
    </div>
  );
}
