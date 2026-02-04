import { api, convex } from '@/lib/convex-server';
import { mapConvexListing } from '@/lib/utils/listings';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const listings = await convex.query(api.listings.search, { query });
    const mappedListings = listings.map(mapConvexListing);

    return NextResponse.json(mappedListings.slice(0, 5));
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
