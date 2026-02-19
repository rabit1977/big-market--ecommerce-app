import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Overview of platform performance and key metrics',
};

export default function AdminDashboardPage() {
  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <AdminDashboardClient />
    </div>
  );
}