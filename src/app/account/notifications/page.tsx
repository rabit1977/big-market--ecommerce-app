import { getNotificationsAction } from '@/actions/notification-actions';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { NotificationsClient } from './notifications-client';


export const metadata: Metadata = {
  title: 'Notifications | My Account',
  description: 'View and manage your notifications',
};

export default async function NotificationsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth?callbackUrl=/account/notifications');
  }

  const initialData = await getNotificationsAction({ page: 1, limit: 20 });

  return (
    <div className="container-wide pt-16 md:pt-20 pb-8 px-3 md:px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-lg md:text-2xl font-black tracking-tighter text-foreground mb-1">Notifications</h1>
        <p className="text-muted-foreground text-xs md:text-sm mb-5 md:mb-8">
          Stay updated on your orders, promotions, and more.
        </p>
        
        <NotificationsClient initialData={initialData} />
      </div>
    </div>
  );
}
