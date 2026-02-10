import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth');
  }

  return (
    <div className="container mx-auto pt-4 md:pt-6 pb-8 px-3 md:px-4 max-w-3xl">
      <h1 className="text-lg md:text-2xl font-black tracking-tighter text-foreground mb-1">My Addresses</h1>
      <p className="text-muted-foreground text-xs md:text-sm mb-5 md:mb-8">
        Manage your saved addresses here.
      </p>
      {/* Add your addresses management UI here */}
    </div>
  );
}
