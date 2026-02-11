import { auth } from '@/auth';
import { PostListingWizard } from '@/components/sell/post-listing-wizard';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { convex } from '@/lib/convex-server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { api } from '../../../convex/_generated/api';

export const metadata: Metadata = {
  title: 'Post a Listing | Big Market',
  description: 'Sell your items on Big Market - Free classifieds platform',
};

export default async function SellPage() {
  // Check if user is authenticated
  const session = await auth();
  
  if (!session?.user) {
    // Redirect to login with return URL
    redirect('/auth/signin?callbackUrl=/sell');
  }

  // Fetch categories
  const categories = await convex.query(api.categories.list);

  return (
    <div className="min-h-screen bg-background pt-4 md:pt-6 pb-8">
      <div className="container-wide px-3 md:px-4">
        <AppBreadcrumbs />
        <PostListingWizard categories={categories} userId={session.user.id || ""} />
      </div>
    </div>
  );
}
