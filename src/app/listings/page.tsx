import { ListingsClient } from '@/components/listing/listings-client';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { fetchQuery } from 'convex/nextjs';
import { Suspense } from 'react';
import { api } from '../../../convex/_generated/api';
import Loading from './loading';

export const dynamic = 'force-dynamic';

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
    userType?: string;
    adType?: string;
    trade?: string;
    shipping?: string;
    vat?: string;
    affordable?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;

  const query = params.search || '';
  const category = params.category || '';
  const city = params.city || '';
  const page = params.page ? Number(params.page) : 1;
  
  // Sort mapping
  let sort = params.sort || 'newest';
  if (sort === 'price-low') sort = 'price-asc'; // Align with Convex
  if (sort === 'price-high') sort = 'price-desc';

  // Fetch data directly with filters
  const [categories, listings] = await Promise.all([
    fetchQuery(api.categories.list),
    fetchQuery(api.listings.list, {
        category: category !== 'all' ? category : undefined,
        subCategory: params.subCategory,
        city: city !== 'all' ? city : undefined,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        condition: params.condition !== 'all' ? params.condition : undefined,
        sort,
        status: 'ACTIVE',
        userType: params.userType,
        adType: params.adType,
        isTradePossible: params.trade === 'true' ? true : undefined,
        hasShipping: params.shipping === 'true' ? true : undefined,
        isVatIncluded: params.vat === 'true' ? true : undefined,
        isAffordable: params.affordable === 'true' ? true : undefined
    }),
  ]);

  // Search filtering (if query exists, further filter result, or ideally use search index query if query is dominant)
  // For now, if query exists, we filter in memory since api.listings.list is optimizing for category/filters
  // TODO: Combined search+filter query in Convex
  let filteredListings = listings;
  if (query) {
      const q = query.toLowerCase();
      filteredListings = filteredListings.filter(l => l.title.toLowerCase().includes(q));
  }

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
          <div className="mb-4">
            <AppBreadcrumbs />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {category && category !== 'all'
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
