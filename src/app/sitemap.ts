import { fetchQuery } from 'convex/nextjs';
import { MetadataRoute } from 'next';
import { api } from '../../convex/_generated/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://biggestmarket.com';

  // Base static routes
  const sitemapData: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/listings`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/auth/signin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
     // Fetch dynamic nodes (listings and storefronts)
     const nodes = await fetchQuery(api.sitemap.getNodes, {});

     for (const listing of nodes.listings) {
         sitemapData.push({
             url: `${baseUrl}/listings/${listing._id}`,
             lastModified: new Date(listing.createdAt),
             changeFrequency: 'weekly',
             priority: 0.8,
         });
     }

     for (const storeId of nodes.storeFronts) {
         sitemapData.push({
             url: `${baseUrl}/store/${storeId}`,
             lastModified: new Date(),
             changeFrequency: 'daily',
             priority: 0.7,
         });
     }
  } catch (error) {
     console.error("Error generating dynamic sitemap routes:", error);
  }

  return sitemapData;
}
