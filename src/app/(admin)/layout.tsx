import { AdminSidebar } from '@/components/admin/admin-sidebar';
import AdminAuthGuard from '@/components/auth/admin-auth-guard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className='min-h-screen bg-background font-sans antialiased flex flex-col'>
        <AdminSidebar />
        <div className='flex flex-col flex-1 transition-all duration-300 ease-in-out'>
          <main className='flex-1 pt-24 pb-20 lg:pt-28 lg:pb-8 px-1.5 md:px-4 lg:px-8 max-w-7xl mx-auto w-full'>
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
