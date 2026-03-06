import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Overview of platform performance and key metrics',
};

export default function AdminDashboardPage() {
  return (
    <div className=''>
      <AdminDashboardClient />
    </div>
  );
}