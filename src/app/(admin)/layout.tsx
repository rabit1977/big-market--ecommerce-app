import { AdminSidebar } from '@/components/admin/admin-sidebar';
import AdminAuthGuard from '@/components/auth/admin-auth-guard';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className='min-h-screen bg-background font-sans antialiased'>
        
        <AdminSidebar />
        
        <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
            <main className="flex-1 py-20 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
                <div className="mb-6">
                    <AppBreadcrumbs />
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
