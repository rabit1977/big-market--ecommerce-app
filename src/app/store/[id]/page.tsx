import { StorefrontClient } from '@/components/store/storefront-client';
import { fetchQuery } from 'convex/nextjs';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { api } from '../../../../convex/_generated/api';

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: StorePageProps) {
  const { id } = await params;
  let profile;
  try {
    profile = await fetchQuery(api.storefront.getPublicProfile, { userId: id });
  } catch (e) {
    return { title: 'Store Not Found | PazarPlus' };
  }

  if (!profile) return { title: 'Store Not Found | PazarPlus' };

  return {
    title: `${profile.accountType === 'COMPANY' && profile.companyName ? profile.companyName : profile.name} | PazarPlus`,
    description: `View seller profile, ratings, and active listings on PazarPlus`,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { id } = await params;
  const t = await getTranslations('Store');

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
      <StorefrontClient profile={profile} listings={listings} />
    </>
  );
}
