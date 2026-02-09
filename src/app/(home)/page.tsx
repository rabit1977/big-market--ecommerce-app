import { CategoryGrid } from '@/components/home/category-grid';
import { FeaturedListings } from '@/components/home/featured-listings';
import { Hero } from '@/components/home/hero';
import { LatestListingsClient } from '@/components/home/latest-listings-client';
import { MembershipSection } from '@/components/home/membership-section';
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
export default async function HomePage() {
  // Fetch categories and listings in parallel
  const [categories, allListings] = await Promise.all([
    fetchQuery(api.categories.list),
    fetchQuery(api.listings.get),
  ]);

  // Limit listings for display
  const listings = allListings.slice(0, 16);
  const featuredListings = listings.slice(0, 8);
  const latestListings = listings.slice(0, 12);

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

      {/* Membership Features & Plans */}
      <MembershipSection />

      {/* Stats Section */}
      <StatsSection listingCount={listings.length} />
    </>
  );
}