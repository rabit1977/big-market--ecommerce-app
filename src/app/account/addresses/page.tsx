import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Addresses</h1>
      <p className="text-muted-foreground">
        Manage your saved addresses here.
      </p>
      {/* Add your addresses management UI here */}
    </div>
  );
}
