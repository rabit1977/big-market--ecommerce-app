
import { getMyListingsAction } from '@/actions/listing-actions';
import { MyListingsDashboardHeader } from '@/components/listing/dashboard-header';
import { MyListingCard } from '@/components/listing/my-listing-card';
import { MyListingsExportButton } from '@/components/listing/my-listings-export-button';
import { MyListingsSearch } from '@/components/listing/my-listings-search';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { ListingWithRelations } from '@/lib/types/listing';
import { Package, Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
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
  const t = await getTranslations('MyListings');

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

  // Sort listings: Promoted first, then by creation date
  const sortedListings = listings?.sort((a, b) => {
      const aPromoted = a.isPromoted && a.promotionExpiresAt && a.promotionExpiresAt > Date.now();
      const bPromoted = b.isPromoted && b.promotionExpiresAt && b.promotionExpiresAt > Date.now();
      
      if (aPromoted && !bPromoted) return -1;
      if (!aPromoted && bPromoted) return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <div className='min-h-screen pt-3 md:pt-10 pb-32 bg-background'>
      <div className='container-wide'>
        <div className="animate-fade-in-up">
            <AppBreadcrumbs className="mb-6 md:mb-10 text-muted-foreground/60 font-bold uppercase text-[10px]" />
            
            {/* Listings Section Header */}
            <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 md:mb-20 py-8 md:py-12 border-b border-card-foreground/10'>
              <div className="space-y-4">
                 <h2 className='text-2xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85] text-foreground'>
                  {t('page_title').split(' ')[0]} <br className="hidden md:block" /> <span className="text-primary">{t('page_title').split(' ').slice(1).join(' ') || t('page_title')}</span>
               </h2>
               <p className='text-xs md:text-sm font-black opacity-60 max-w-md '>
                  {t('manage_desc')}
               </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                  <Suspense fallback={<div className="h-14 w-full sm:w-[350px] bg-muted/30 animate-pulse rounded-2xl" />}>
                      <div className="w-full sm:w-[350px]">
                        <MyListingsSearch />
                      </div>
                  </Suspense>
                  {sortedListings && sortedListings.length > 0 && (
                      <MyListingsExportButton listings={sortedListings} />
                  )}
                  <Button asChild size="lg" className="w-full sm:w-auto gap-3 rounded-2xl font-black bg-primary hover:bg-primary/95 shrink-0 h-12 text-xs px-10 uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/10 active:scale-95 border border-primary/20 group">
                      <Link href="/sell">
                          <Plus className="h-5 w-5 group:hover:text-primary group:hover:scale-110 transition-all duration-300 ease-in-out opacity-60 group:hover:opacity-100" />
                          {t('post_ad')}
                      </Link>
                  </Button>
              </div>
            </div>

            {sortedListings && sortedListings.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-10'>
                    {sortedListings.map((listing: ListingWithRelations) => (
                        <MyListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-20 md:py-40 bg-card/40 backdrop-blur-sm rounded-[3rem] border-1 border-card-foreground/10 bm-interactive shadow-none group'>
                    <div className="w-32 h-32 bg-muted/40 border-1 border-card-foreground/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                        <Package className="h-12 w-12 text-muted-foreground opacity-30" />
                    </div>
                    <h3 className='text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-6'>{t('empty_title')}</h3>
                    <p className='text-muted-foreground max-w-sm mx-auto mb-12 text-xs md:text-sm font-black uppercase tracking-[0.2em] opacity-60 italic'>
                        {t('empty_desc')}
                    </p>
                    <Button asChild size="lg" className="rounded-2xl font-black text-xs uppercase tracking-[0.2em] h-16 px-16 transition-all active:scale-95 shadow-2xl shadow-primary/20 border border-primary/20 bg-primary hover:bg-primary/95 text-white">
                        <Link href="/sell">{t('start_selling')}</Link>
                    </Button>
                </div>
            )}
            <MyListingsDashboardHeader />

        </div>
      </div>
    </div>
  );
}
