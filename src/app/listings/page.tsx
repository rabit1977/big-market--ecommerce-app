import { ListingsClient } from '@/components/listing/listings-client';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { fetchQuery } from 'convex/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { api } from '../../../convex/_generated/api';
import Loading from './loading';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Browse Listings | Biggest Market',
  description: 'Find great deals in your area on Biggest Market Classifieds.',
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
    date?: string;
    filters?: string; // JSON dynamic filters
    listingNumber?: string; // Search by ID
  }>;
}

// Helper to ensure we get a string from searchParams (handles potential arrays)
const ensureString = (val: any): string | undefined => {
  if (Array.isArray(val)) return val[0];
  if (typeof val === 'string') return val;
  return undefined;
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;

  // Direct ID Search Redirect
  const listingNumberVal = ensureString(params.listingNumber);
  if (listingNumberVal) {
     try {
         const listingNum = parseInt(listingNumberVal);
         if (!isNaN(listingNum)) {
             const directListing = await fetchQuery(api.listings.getByListingNumber, { listingNumber: listingNum });
             if (directListing) {
                 redirect(`/listings/${directListing._id}`);
             }
         }
     } catch (error) {
         // If error is a redirect, rethrow it so Next.js handles it
         if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
             throw error;
         }
         console.error("Error fetching listing by number:", error);
     }
     
     // If we are here, listingNumber was provided but NOT found.
     // We should return empty results instead of showing everything.
     return (
        <div className="bg-background min-h-screen pb-20">
          <div className="bg-card border-b border-border/50 py-4 md:py-6 mb-6">
            <div className="container-wide">
              <AppBreadcrumbs items={[{ label: 'Listings', href: '/listings' }, { label: 'Not Found' }]} />
              <div className='flex items-center justify-between'>
                <h1 className="text-xl font-bold md:text-2xl">
                    Listing Not Found
                </h1>
              </div>
            </div>
          </div>
          <div className="container-wide text-center py-20">
             <div className="text-6xl mb-4">🔍</div>
             <h3 className="text-2xl font-bold mb-2">No listing found with ID {listingNumberVal}</h3>
             <p className="text-muted-foreground">
               Please check the ID and try again, or browse our latest listings below.
             </p>
             <Button asChild className="mt-6" variant="outline">
                <Link href="/listings">View All Listings</Link>
             </Button>
          </div>
        </div>
     );
  }

  const query = ensureString(params.search) || '';
  const category = ensureString(params.category) || '';
  const city = ensureString(params.city) || '';
  const pageParam = ensureString(params.page);
  const page = pageParam ? Number(pageParam) : 1;
  
  // Sort mapping
  let sort = ensureString(params.sort) || 'newest';
  if (sort === 'price-low') sort = 'price-asc'; // Align with Convex
  if (sort === 'price-high') sort = 'price-desc';

  // Fetch data directly with filters
  const [categories, listings] = await Promise.all([
    fetchQuery(api.categories.list),
    fetchQuery(api.listings.list, {
        category: category !== 'all' ? category : undefined,
        subCategory: ensureString(params.subCategory),
        city: city !== 'all' ? city : undefined,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        condition: params.condition !== 'all' ? ensureString(params.condition) : undefined,
        sort,
        status: 'ACTIVE',
        userType: ensureString(params.userType),
        adType: ensureString(params.adType),
        isTradePossible: params.trade === 'true' ? true : undefined,

        hasShipping: params.shipping === 'true' ? true : undefined,
        isVatIncluded: params.vat === 'true' ? true : undefined,
        isAffordable: params.affordable === 'true' ? true : undefined,
        dateRange: ensureString(params.date),
        dynamicFilters: ensureString(params.filters) // Added dynamicFilters
    }),
  ]);

  // Determine active category template
  let activeTemplate = null;
  if (category && category !== 'all') {
      const catObj = categories.find(c => c.slug === category);
      if (catObj?.template) activeTemplate = catObj.template;
      // Check subcategory if main category template is generic or we want more specificity
      if (params.subCategory) {
           // Subcategories are flattened if in top level list? No, Convex returns flat list. 
           // We need to look up subcategory object but api.categories.list returns all.
           const subCatObj = categories.find(c => c.slug === params.subCategory);
           if (subCatObj?.template) activeTemplate = subCatObj.template;
      }
  }

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
      <div className="bg-card border-b border-border/50 py-4 md:py-6 mb-6">
        <div className="container-wide">
          <div className="">
            <AppBreadcrumbs />
          </div>
         <div className='flex items-center justify-between'>
          <h1 className="text-xl font-bold md:text-2xl">
            {category && category !== 'all'
              ? categories.find((c) => c.slug === category)?.name || 'Listings'
              : 'All Listings'}
          </h1>
          <p className="text-muted-foreground md:text-lg text-sm">
            {total} {total === 1 ? 'result' : 'results'} found
            {city && city !== 'all' && ` in ${city}`}
            {query && ` for "${query}"`}
          </p>
        </div>
        </div>
      </div>

      <div className="container-wide">
        <Suspense fallback={<Loading />}>
          <ListingsClient
            initialListings={paginatedListings}
            categories={categories}
            pagination={pagination}
            template={activeTemplate}
          />
        </Suspense>
      </div>
    </div>
  );
}
