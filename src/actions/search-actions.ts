'use server';

import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';

export async function searchListingsAction(query: string) {
  if (!query || query.length < 2) return [];

  // Assuming you have a Convex query or similar DB call
  // If using Prisma/Postgres, replace with your DB call
  try {
     // Example: Using Convex
     const listings = await fetchQuery(api.listings.search, { query });
     
     // OR Example: Return mock data if backend isn't ready
     // return await db.listing.findMany({ where: { title: { contains: query } } });
     
     return listings;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}