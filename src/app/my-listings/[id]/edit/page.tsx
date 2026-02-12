import { getPublicCategoriesAction } from '@/actions/category-actions';
import { getListingByIdAction } from '@/actions/listing-actions';
import { auth } from '@/auth';
import { UserEditListingForm } from '@/components/listing/user-edit-listing-form';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { notFound, redirect } from 'next/navigation';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditPageProps) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user) {
      redirect('/auth/signin');
  }

  const [listingResult, categoriesResult] = await Promise.all([
     getListingByIdAction(id),
     getPublicCategoriesAction()
  ]);

  if (!listingResult.success || !listingResult.listing) notFound();
  
  const listing = listingResult.listing;
  const categories = categoriesResult.categories || [];

  // Verify ownership
  if (listing.userId !== session.user.id && session.user.role !== 'ADMIN') {
      redirect('/my-listings');
  }

  // Block editing pending listings for non-admins
  if (listing.status === 'PENDING_APPROVAL' && session.user.role !== 'ADMIN') {
      return (
        <div className="container max-w-5xl mx-auto pt-20 text-center px-4">
             <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2rem] p-12 max-w-2xl mx-auto">
                 <h1 className="text-2xl font-black uppercase mb-4 text-amber-600">Action Restricted</h1>
                 <p className="font-bold text-muted-foreground mb-8">
                     You cannot edit this listing while it is waiting for administrator approval. 
                     Please wait until your listing is approved before making changes.
                 </p>
                 <a href="/my-listings" className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-black text-background uppercase tracking-wider transition-colors hover:bg-foreground/90">
                     Back to My Listings
                 </a>
             </div>
        </div>
      );
  }

  return (
      <div className="container max-w-4xl mx-auto pt-8 md:pt-12 min-h-screen pb-20 bg-background px-4">
           <div className="flex flex-col gap-8">
               <div className="space-y-4">
                   <AppBreadcrumbs />
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase leading-none">
                            Edit <span className="text-primary">Listing</span>
                        </h1>
                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-70">
                            Updating: {listing.title}
                        </p>
                    </div>
               </div>
               
               <div className="bg-card rounded-[2.5rem] border border-border/60 shadow-2xl shadow-primary/5 p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                    
                    <UserEditListingForm listing={listing as any} categories={categories as any} />
               </div>
           </div>
      </div>
  );
}
