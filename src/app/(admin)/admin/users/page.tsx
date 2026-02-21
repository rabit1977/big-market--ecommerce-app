import { auth } from '@/auth';
import { UsersClientPage } from '@/components/admin/users-client-page';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin - Users',
};

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <UsersClientPage />;
}

