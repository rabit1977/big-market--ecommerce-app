import { FeaturedListings } from '@/components/home/featured-listings';
import { Hero } from '@/components/home/hero';
import { LatestListingsClient } from '@/components/home/latest-listings-client';
import { fetchQuery } from 'convex/nextjs';
import { api } from '../../../convex/_generated/api';

/**
 * Home Page Component
 * 
 * Biggest Market-inspired classifieds homepage with:
 * - Hero section with search
 * - Platform statistics
 * - Featured listings
 * - Latest listings
 */
import { verifyStripePayment } from '@/actions/stripe-actions';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id as string;
  const promoted = params.promoted === 'true';

  // If redirected from a successful promotion payment, verify it server-side immediately
  if (sessionId && promoted) {
    try {
      await verifyStripePayment(sessionId);
    } catch (e) {
      console.error("Failed to verify promotion on homepage:", e);
    }
  }

  let categories: any[] = [];
  let allListings: any[] = [];
  let error = null;

  try {
    // Fetch categories and listings in parallel
    [categories, allListings] = await Promise.all([
        fetchQuery(api.categories.list),
        fetchQuery(api.listings.get),
    ]);
  } catch (e) {
    console.error("Error fetching homepage data:", e);
    error = e;
  }
  
  const now = Date.now();

  // 1. Get raw listings
  const featuredTiers = ['HOMEPAGE', 'TOP_POSITIONING'];
  const rawFeatured = allListings
    .filter((l: any) => l.status === 'ACTIVE' && l.isPromoted && featuredTiers.includes(l.promotionTier || '') && (!l.promotionExpiresAt || l.promotionExpiresAt > now))
    .slice(0, 15);

  const rawLatest = allListings
    .filter((l: any) => l.status === 'ACTIVE')
    .slice(0, 12);

  // 2. Batch fetch users for all listings to be displayed
  const userIds = Array.from(new Set([
    ...rawFeatured.map((l: any) => l.userId),
    ...rawLatest.map((l: any) => l.userId)
  ]));

  const users = await fetchQuery(api.users.getByExternalIds, { ids: userIds });
  const userMap = new Map(users.map((u: any) => [u.externalId, u]));

  // 3. Attach users to listings
  const featuredListings = rawFeatured.map((l: any) => ({
    ...l,
    user: userMap.get(l.userId)
  }));

  const latestListings = rawLatest.map((l: any) => ({
    ...l,
    user: userMap.get(l.userId)
  }));

  return (
    <div className='min-h-screen bg-background dark:bg-background'>
      {/* 1. Hero Section with Search (Absolute Top) */}
      <Hero />

      {/* 2. Featured Listings Carousel (Hot Deals) - Mobile/Tablet Only */}
      <div className="lg:hidden">
        {featuredListings.length > 0 && (
          <FeaturedListings listings={featuredListings as any} variant="horizontal" />
        )}
      </div>

      {/* 3. Main Content Grid */}
      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Latest Listings - Left Column */}
            <div className="lg:col-span-3 bg-background dark:bg-background">
                <LatestListingsClient 
                  initialListings={latestListings as any} 
                  categories={categories} 
                />
            </div>

            {/* Featured Sidebar - Desktop Only */}
            <div className="hidden lg:block lg:col-span-1">
                {featuredListings.length > 0 && (
                  <FeaturedListings listings={featuredListings as any} variant="vertical" />
                )}
            </div>

        </div>
      </div>
    </div>
  );
}