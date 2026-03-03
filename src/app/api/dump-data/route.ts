import { api } from '@/../convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  const categories = await fetchQuery(api.categories.list);
  const listings = await fetchQuery(api.listings.getPendingListings);
  return NextResponse.json({ categories, listings });
}
