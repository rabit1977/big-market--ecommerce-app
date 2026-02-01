import { getPublicCategoriesAction } from '@/actions/category-actions';
import { CreateListingClient } from '@/components/admin/create-listing-client';

export const metadata = {
  title: 'Create Listing',
};

export default async function NewListingPage() {
  const result = await getPublicCategoriesAction();
  const categories = result.categories || [];

  return <CreateListingClient categories={categories as any} />;
}
