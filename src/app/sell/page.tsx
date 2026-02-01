import { auth } from '@/auth';
import { PostListingWizard } from '@/components/sell/post-listing-wizard';
import { fetchQuery } from 'convex/nextjs';
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
  const categories = await fetchQuery(api.categories.list);

  return (
    <div className="min-h-screen bg-background">
      <PostListingWizard categories={categories} userId={session.user.id || ""} />
    </div>
  );
}
