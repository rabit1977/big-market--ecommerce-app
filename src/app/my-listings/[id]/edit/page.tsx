import { getPublicCategoriesAction } from '@/actions/category-actions';
import { getListingByIdAction } from '@/actions/listing-actions';
import { auth } from '@/auth';
import { UserEditListingForm } from '@/components/listing/user-edit-listing-form';
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

  // Verify ownership
  if (listing.userId !== session.user.id) {
      redirect('/my-listings');
  }

  const categories = categoriesResult.categories || [];

  return (
      <div className="container-wide py-10 pb-20 max-w-4xl mx-auto">
           <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Edit Listing</h1>
                <p className="text-muted-foreground mt-1">Update details for &quot;{listing.title}&quot;</p>
           </div>
           
           <UserEditListingForm listing={listing as any} categories={categories as any} />
      </div>
  );
}
