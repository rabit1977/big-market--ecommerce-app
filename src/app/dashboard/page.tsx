import { auth } from '@/auth';
import { UserDashboardClient } from '@/components/dashboard/user-dashboard-client';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'My Dashboard | Biggest Market',
  description: 'View your complete account overview, listings, spending, and more.',
};

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  return (
    <UserDashboardClient userId={session.user.id!} />
  );
}
