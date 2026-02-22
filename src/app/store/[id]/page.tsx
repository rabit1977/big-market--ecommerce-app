import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { StorefrontClient } from '@/components/store/storefront-client';
import { fetchQuery } from 'convex/nextjs';
import { notFound } from 'next/navigation';
import { api } from '../../../../convex/_generated/api';

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StorePageProps) {
  const { id } = await params;
  let profile;
  try {
    profile = await fetchQuery(api.storefront.getPublicProfile, { userId: id });
  } catch (e) {
    return { title: 'Store Not Found | Biggest Market' };
  }

  if (!profile) return { title: 'Store Not Found | Biggest Market' };

  return {
    title: `${profile.accountType === 'COMPANY' && profile.companyName ? profile.companyName : profile.name} | Biggest Market`,
    description: `View seller profile, ratings, and active listings on Biggest Market.`,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { id } = await params;

  let profile;
  let listings;

  try {
    profile = await fetchQuery(api.storefront.getPublicProfile, { userId: id });
    listings = await fetchQuery(api.listings.getByUser, { userId: id });
  } catch (error) {
    notFound();
  }

  if (!profile) {
    notFound();
  }

  return (
    <>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <AppBreadcrumbs items={[
            { label: 'Sellers', href: '/store' },
            { label: (profile.accountType === 'COMPANY' && profile.companyName ? profile.companyName : profile.name) || 'Seller' }
        ]} />
      </div>
      <StorefrontClient profile={profile} listings={listings} />
    </>
  );
}
