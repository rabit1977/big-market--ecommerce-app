import { auth } from '@/auth';
import { PostListingWizard } from '@/components/sell/post-listing-wizard';

import { convex } from '@/lib/convex-server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { api } from '../../../convex/_generated/api';

export const metadata: Metadata = {
  title: 'Post a Listing | PazarPlus',
  description: 'Sell your items on PazarPlusee classifieds platform',
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
    <div className='min-h-screen bg-background pt-4 md:pt-6 pb-8'>
      <div className='container-wide px-3 md:px-4'>
        <PostListingWizard
          categories={categories}
          userId={session.user.id || ''}
        />
      </div>
    </div>
  );
}
