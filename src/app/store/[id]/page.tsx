import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { StorefrontClient } from '@/components/store/storefront-client';

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StorePageProps) {
  return {
    title: 'Seller Profile | Biggest Market',
    description: 'View seller profile, ratings, and active listings on Biggest Market.',
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { id } = await params;

  return (
    <>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <AppBreadcrumbs items={[
            { label: 'Sellers', href: '/store' },
            { label: 'Profile' }
        ]} />
      </div>
      <StorefrontClient userId={id} />
    </>
  );
}
