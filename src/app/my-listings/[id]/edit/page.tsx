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
      <div className="container max-w-5xl mx-auto pt-4 md:pt-8 min-h-screen pb-20 bg-background px-4">
           <AppBreadcrumbs />
           
           <div className="mb-6 md:mb-8 border-b border-border pb-6">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase leading-none mb-2">Edit Listing</h1>
                <p className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider">
                    Update details for <span className="text-primary">&quot;{listing.title}&quot;</span>
                </p>
           </div>
           
           <div className="bg-card rounded-[2rem] border border-border shadow-md p-6 md:p-8">
                <UserEditListingForm listing={listing as any} categories={categories as any} />
           </div>
      </div>
  );
}
