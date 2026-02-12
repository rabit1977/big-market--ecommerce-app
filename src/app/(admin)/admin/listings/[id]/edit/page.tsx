import { getPublicCategoriesAction } from '@/actions/category-actions';
import { getListingByIdAction } from '@/actions/listing-actions';
import { EditListingForm } from '@/components/admin/edit-listing-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

function EditListingSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-8 w-48' />
      <div className='space-y-4'>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className='h-10 w-full' />
        ))}
      </div>
    </div>
  );
}

async function EditListingContent({ listingId }: { listingId: string }) {
  const [listingResult, categoriesResult] = await Promise.all([
     getListingByIdAction(listingId),
     getPublicCategoriesAction()
  ]);

  if (!listingResult.success || !listingResult.listing) notFound();
  const listing = listingResult.listing;
  const categories = categoriesResult.categories || [];

  return (
      <div className='max-w-4xl mx-auto pb-20 pt-8 px-4'>
        <div className='mb-10 animate-in fade-in slide-in-from-top-4 duration-700'>
            <Button variant='ghost' asChild className='hover:bg-primary/5 dark:hover:bg-primary/10 rounded-full mb-8 -ml-3 text-muted-foreground hover:text-primary transition-all group'>
                <Link href='/admin/listings'>
                    <ArrowLeft className='h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform' />
                    Back to Listings Management
                </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className='flex items-center gap-5'>
                   <div className='h-16 w-16 rounded-[2rem] bg-gradient-to-br from-primary via-primary to-violet-600 flex items-center justify-center shadow-xl shadow-primary/20 ring-4 ring-primary/5'>
                     <Settings className='h-8 w-8 text-white animate-spin-slow' style={{ animationDuration: '8s' }} />
                   </div>
                   <div className="space-y-1">
                      <h1 className='text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase'>
                        Edit <span className="text-primary">Listing</span>
                      </h1>
                      <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">Admin Mode</span>
                          <p className='text-muted-foreground font-bold text-sm tracking-tight'>
                             Updating ID: <span className="font-mono text-foreground/80">{listing._id.slice(-8)}</span>
                          </p>
                      </div>
                   </div>
                </div>
            </div>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-border/60 shadow-2xl shadow-primary/5 p-8 md:p-12 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
            <EditListingForm listing={listing} categories={categories} />
        </div>
      </div>
  );
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditListingSkeleton />}>
      <EditListingContent listingId={id} />
    </Suspense>
  );
}
