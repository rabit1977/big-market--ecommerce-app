import { CategoryGrid } from '@/components/home/category-grid';
import { FeaturedListings } from '@/components/home/featured-listings';
import { Hero } from '@/components/home/hero';
import { LatestListingsClient } from '@/components/home/latest-listings-client';
import { StatsSection } from '@/components/home/stats-section';
import { fetchQuery } from 'convex/nextjs';
import { api } from '../../../convex/_generated/api';

/**
 * Home Page Component
 * 
 * Big Market-inspired classifieds homepage with:
 * - Hero section with search
 * - Category grid
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

  // Limit listings for display
  const now = Date.now();
  
  // 1. Get all currently promoted listings for the horizontal scroll (Excluding Auto Daily Refresh)
  const featuredListings = allListings
    .filter((l: any) => l.isPromoted && l.promotionTier !== 'AUTO_DAILY_REFRESH' && (!l.promotionExpiresAt || l.promotionExpiresAt > now))
    .slice(0, 15);

  // 2. Latest listings includes EVERYTHING, ordered by newest first (but our backend query 'get' already handles promotion sorting)
  const latestListings = allListings.slice(0, 12);

  return (
    <>
      {/* 1. Hero Section with Search (Absolute Top) */}
      <Hero />

      {/* 2. Featured Listings Carousel (Hot Deals) */}
      {featuredListings.length > 0 && (
        <FeaturedListings listings={featuredListings as any} />
      )}

      {/* 3. Latest Listings */}
      <div className="container-wide py-6 bg-muted/20">
        <LatestListingsClient 
          initialListings={latestListings as any} 
          categories={categories} 
        />
      </div>
      {/* Category Grid */}
      <CategoryGrid categories={categories} />



      {/* Stats Section */}
      <StatsSection listingCount={allListings.length} />
    </>
  );
}