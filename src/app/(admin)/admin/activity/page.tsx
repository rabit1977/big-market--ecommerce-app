import { auth } from '@/auth';
import { AdminActivityClientPage } from '@/components/admin/admin-activity-client-page';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Activity Logs | Admin Dashboard',
  description: 'View system activity and audit logs.',
};

export default async function ActivityPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <AdminActivityClientPage />;
}

