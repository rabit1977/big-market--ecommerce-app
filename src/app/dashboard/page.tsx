import { auth } from '@/auth';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { fetchQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';
import { api } from '../../../convex/_generated/api';

export const metadata = {
  title: 'My Dashboard | Big Market',
  description: 'Manage your listings and account on Big Market',
};

export default async function DashboardPage() {
  // Check authentication
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  // Fetch user's listings
  const allListings = await fetchQuery(api.listings.get);
  
  // Filter user's listings (TODO: Add userId filter in Convex query)
  const userListings = allListings.filter(
    (listing) => listing.userId === session.user.id
  );

  // Calculate stats
  const stats = {
    totalListings: userListings.length,
    activeListings: userListings.filter((l) => l.status === 'ACTIVE').length,
    totalViews: userListings.reduce((sum, l) => sum + (l.viewCount || 0), 0),
    messages: 0, // TODO: Implement messaging
  };

  // TODO: Fetch user's favorites
  const favorites: any[] = [];

  return (
    <DashboardClient
      userListings={userListings as any}
      favorites={favorites}
      stats={stats}
    />
  );
}
