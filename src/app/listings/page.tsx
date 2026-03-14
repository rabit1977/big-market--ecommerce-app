import { ListingsClient } from '@/components/listing/listings-client';

import { Button } from '@/components/ui/button';
import { fetchQuery } from 'convex/nextjs';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { api } from '../../../convex/_generated/api';
import Loading from './loading';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Browse Listings | PazarPlus',
  description: 'Find great deals in your area on PazarPlus Classifieds.',
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

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const params = await searchParams;
  const t = await getTranslations('Listings');

  // Direct ID Search Redirect
  const listingNumberVal = ensureString(params.listingNumber);
  if (listingNumberVal) {
    try {
      const listingNum = parseInt(listingNumberVal);
      if (!isNaN(listingNum)) {
        const directListing = await fetchQuery(
          api.listings.getByListingNumber,
          { listingNumber: listingNum },
        );
        if (directListing) {
          redirect(`/listings/${directListing._id}`);
        }
      }
    } catch (error) {
      // If error is a redirect, rethrow it so Next.js handles it
      if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      console.error('Error fetching listing by number:', error);
    }

    // If we are here, listingNumber was provided but NOT found.
    return (
      <div className='bg-background dark:bg-background min-h-screen pb-10'>
        <div className='border-border/50 py-2 md:py-4'>
          <div className='container-wide'>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-bold md:text-2xl'>
                {t('not_found_title')}
              </h1>
            </div>
          </div>
        </div>
        <div className='container-wide text-center py-20'>
          <div className='text-6xl mb-4 bg-background'>🔍</div>
          <h3 className='text-2xl font-bold mb-2'>
            {t('no_listing_with_id', { id: listingNumberVal })}
          </h3>
          <p className='text-muted-foreground'>{t('check_id_again')}</p>
          <Button asChild className='mt-6' variant='outline'>
            <Link href='/listings'>{t('view_all_listings')}</Link>
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
  if (sort === 'price-low') sort = 'price-asc';
  if (sort === 'price-high') sort = 'price-desc';

  // Fetch main categories and listings result
  const [categories, listingsResult] = await Promise.all([
    fetchQuery(api.categories.list),
    fetchQuery(api.listings.list, {
      category: category !== 'all' && category ? category : undefined,
      subCategory: ensureString(params.subCategory) !== 'all' ? ensureString(params.subCategory) : undefined,
      city: city !== 'all' && city ? city : undefined,
      minPrice: ensureString(params.minPrice) ? Number(ensureString(params.minPrice)) : undefined,
      maxPrice: ensureString(params.maxPrice) ? Number(ensureString(params.maxPrice)) : undefined,
      condition: params.condition !== 'all' ? ensureString(params.condition) : undefined,
      sort,
      status: 'ACTIVE',
      userType: ensureString(params.userType),
      adType: ensureString(params.adType),
      isTradePossible: ensureString(params.trade) === 'true' ? true : undefined,
      hasShipping: ensureString(params.shipping) === 'true' ? true : undefined,
      isVatIncluded: ensureString(params.vat) === 'true' ? true : undefined,
      isAffordable: ensureString(params.affordable) === 'true' ? true : undefined,
      dateRange: ensureString(params.date) !== 'all' ? ensureString(params.date) : undefined,
      dynamicFilters: ensureString(params.filters),
    }),
  ]);

  const listings = listingsResult;

  // Determine active category template
  let activeTemplate = null;
  if (category && category !== 'all') {
    const catObj = categories.find((c) => c.slug === category);
    if (catObj?.template) activeTemplate = catObj.template;
    if (params.subCategory) {
      const subCatObj = categories.find((c) => c.slug === params.subCategory);
      if (subCatObj?.template) activeTemplate = subCatObj.template;
    }
  }

  // Search filtering
  let filteredListings = listings;
  if (query) {
    const q = query.toLowerCase();
    filteredListings = filteredListings.filter((l) =>
      l.title.toLowerCase().includes(q) ||
      (l.listingNumber && l.listingNumber.toString().includes(q))
    );
  }

  // Pagination
  const limit = 12;
  const total = filteredListings.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const rawPaginatedListings = filteredListings.slice(start, start + limit);

  // Batch fetch users
  const allIdsForUsers = Array.from(new Set(rawPaginatedListings.map((l) => l.userId)));

  const users = await fetchQuery(api.users.getByExternalIds, {
    ids: allIdsForUsers,
  });
  const userMap = new Map(users.map((u: any) => [u.externalId, u]));
  const attachUser = (l: any) => ({ ...l, user: userMap.get(l.userId) });
  const paginatedListings = rawPaginatedListings.map(attachUser);

  const pagination = {
    page,
    totalPages,
    total,
  };

  return (
    <div className='bg-background dark:bg-background min-h-screen pb-12'>
      {/* Header */}
      <div className='bg-background pt-4'>
        <div className='container-wide'>
          <div className='flex items-center justify-between'>
            <p className='text-foreground md:text-lg text-sm hidden sm:block'>
              {total} {total === 1 ? t('result') : t('results')} {t('found')}
              {city && city !== 'all' && ` ${t('in_city', { city })}`}
              {query && ` ${t('for_query', { query })}`}
            </p>
          </div>
        </div>
      </div>

      <div className='container-wide'>
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
