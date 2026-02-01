import { ListingsClient } from '@/components/listing/listings-client';
import { fetchQuery } from 'convex/nextjs';
import { Suspense } from 'react';
import { api } from '../../../convex/_generated/api';
import Loading from './loading';

export const metadata = {
  title: 'Browse Listings | Big Market',
  description: 'Find great deals in your area on Big Market Classifieds.',
};

interface ListingsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    subCategory?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    city?: string;
    condition?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;

  const query = params.search || '';
  const category = params.category || '';
  const city = params.city || '';
  const page = params.page ? Number(params.page) : 1;

  // Fetch data from Convex
  const [categories, allListings] = await Promise.all([
    fetchQuery(api.categories.list),
    fetchQuery(api.listings.get),
  ]);

  // Filter listings based on search params
  let filteredListings = allListings;

  if (category && category !== 'all') {
    filteredListings = filteredListings.filter((l) => l.category === category);
  }

  if (city && city !== 'all') {
    filteredListings = filteredListings.filter(
      (l) => l.city.toLowerCase() === city.toLowerCase()
    );
  }

  if (query) {
    filteredListings = filteredListings.filter((l) =>
      l.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Sort listings
  const sort = params.sort || 'newest';
  filteredListings = [...filteredListings].sort((a, b) => {
    switch (sort) {
      case 'oldest':
        return a.createdAt - b.createdAt;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return (b.viewCount || 0) - (a.viewCount || 0);
      default: // newest
        return b.createdAt - a.createdAt;
    }
  });

  // Pagination
  const limit = 12;
  const total = filteredListings.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedListings = filteredListings.slice(start, start + limit);

  const pagination = {
    page,
    totalPages,
    total,
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border/50 py-8 mb-8">
        <div className="container-wide">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {category
              ? categories.find((c) => c.slug === category)?.name || 'Listings'
              : 'All Listings'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {total} {total === 1 ? 'result' : 'results'} found
            {city && city !== 'all' && ` in ${city}`}
            {query && ` for "${query}"`}
          </p>
        </div>
      </div>

      <div className="container-wide">
        <Suspense fallback={<Loading />}>
          <ListingsClient
            initialListings={paginatedListings}
            categories={categories}
            pagination={pagination}
          />
        </Suspense>
      </div>
    </div>
  );
}
