import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { MetadataRoute } from 'next';

// Force Next.js to render this dynamically on every request
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  let listings: any[] = [];
  try {
    listings = await fetchQuery(api.listings.getSeoSitemapListings);
  } catch (error) {
    console.warn("Sitemap: Failed to fetch listings", error);
  }

  const listingUrls = listings.map((listing) => ({
    url: `${baseUrl}/items/${listing._id}`,
    lastModified: new Date(listing.createdAt).toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
  
  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...listingUrls
  ];
}
