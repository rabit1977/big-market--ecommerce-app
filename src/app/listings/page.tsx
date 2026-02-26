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
        <div className="bg-background min-h-screen pb-10">
          <div className="bg-card border-border/50 py-2 md:py-4">
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

  // Check if we are in "Hub" mode (no major filters)
  const isHubView = !query && !category && !city && !params.subCategory && !params.minPrice && !params.maxPrice && !params.listingNumber;

  // Fetch data directly with filters
  const [categories, listingsResult, carsListings, realEstateListings, electronicsListings, motorVehiclesListings, mobilePhonesListings, homeAppliancesListings, computersListings, diyListings, homeAndGardenListings] = await Promise.all([
    fetchQuery(api.categories.list),
    fetchQuery(api.listings.list, {
        category: category !== 'all' ? category : undefined,
        subCategory: ensureString(params.subCategory),
        city: city !== 'all' ? city : undefined,
        minPrice: ensureString(params.minPrice) ? Number(ensureString(params.minPrice)) : undefined,
        maxPrice: ensureString(params.maxPrice) ? Number(ensureString(params.maxPrice)) : undefined,
        condition: params.condition !== 'all' ? ensureString(params.condition) : undefined,
        sort,
        status: 'ACTIVE',
        userType: ensureString(params.userType),
        adType: ensureString(params.adType),
        isTradePossible: ensureString(params.trade) === 'true' ? true : undefined,
        isVatIncluded: ensureString(params.vat) === 'true' ? true : undefined,
        isAffordable: ensureString(params.affordable) === 'true' ? true : undefined,
        dateRange: ensureString(params.date),
        dynamicFilters: ensureString(params.filters)
    }),
    isHubView ? fetchQuery(api.listings.list, { category: 'cars', limit: 12, status: 'ACTIVE' }) : Promise.resolve([]), // Specific for Cars
    isHubView ? fetchQuery(api.listings.list, { category: 'real-estate', limit: 12, status: 'ACTIVE' }) : Promise.resolve([]),
    isHubView ? fetchQuery(api.listings.list, { category: 'electronics', limit: 12, status: 'ACTIVE' }) : Promise.resolve([]),
    isHubView ? fetchQuery(api.listings.list, { category: 'vehicles', limit: 12, status: 'ACTIVE' }) : Promise.resolve([]), // Parent for Motor Vehicles
    isHubView ? fetchQuery(api.listings.list, { category: 'mobile-phones', limit: 12, status: 'ACTIVE' }) : Promise.resolve([]),
    isHubView ? fetchQuery(api.listings.list, { category: 'appliances', limit: 12, status: 'ACTIVE' }) : Promise.resolve([]),
    isHubView ? fetchQuery(api.listings.list, { category: 'computers-laptops', limit: 12, status: 'ACTIVE' }) : Promise.resolve([]),
    isHubView ? fetchQuery(api.listings.list, { category: 'home-services', limit: 12, status: 'ACTIVE' }) : Promise.resolve([]), // Using home-services for DIY
    isHubView ? fetchQuery(api.listings.list, { category: 'home-garden', limit: 12, status: 'ACTIVE' }) : Promise.resolve([]),
  ]);

  const listings = listingsResult;

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
  const rawPaginatedListings = filteredListings.slice(start, start + limit);

  // Batch fetch users for all displayed listings (Main list + all Hub rows)
  const allIdsForUsers = Array.from(new Set([
    ...rawPaginatedListings.map(l => l.userId),
    ...carsListings.map(l => (l as any).userId),
    ...realEstateListings.map(l => (l as any).userId),
    ...electronicsListings.map(l => (l as any).userId),
    ...motorVehiclesListings.map(l => (l as any).userId),
    ...mobilePhonesListings.map(l => (l as any).userId),
    ...homeAppliancesListings.map(l => (l as any).userId),
    ...computersListings.map(l => (l as any).userId),
    ...diyListings.map(l => (l as any).userId),
    ...homeAndGardenListings.map(l => (l as any).userId),
  ]));

  const users = await fetchQuery(api.users.getByExternalIds, { ids: allIdsForUsers });
  const userMap = new Map(users.map((u: any) => [u.externalId, u]));

  // Attach users helper
  const attachUser = (l: any) => ({ ...l, user: userMap.get(l.userId) });

  const paginatedListings = rawPaginatedListings.map(attachUser);
  const carsWithUsers = carsListings.map(attachUser);
  const realEstateWithUsers = realEstateListings.map(attachUser);
  const electronicsWithUsers = electronicsListings.map(attachUser);
  const motorVehiclesWithUsers = motorVehiclesListings.map(attachUser);
  const mobilePhonesWithUsers = mobilePhonesListings.map(attachUser);
  const homeAppliancesWithUsers = homeAppliancesListings.map(attachUser);
  const computersWithUsers = computersListings.map(attachUser);
  const diyWithUsers = diyListings.map(attachUser);
  const homeAndGardenWithUsers = homeAndGardenListings.map(attachUser);

  const pagination = {
    page,
    totalPages,
    total,
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <div className="bg-card pt-4">
        <div className="container-wide">
          <div className="flex items-center justify-between">
            <AppBreadcrumbs />
             <p className="text-muted-foreground md:text-lg text-sm hidden sm:block">
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
            hubData={isHubView ? {
               all: paginatedListings,
               cars: carsWithUsers,
               realEstate: realEstateWithUsers,
               electronics: electronicsWithUsers,
               motorVehicles: motorVehiclesWithUsers,
               mobilePhones: mobilePhonesWithUsers,
               homeAppliances: homeAppliancesWithUsers,
               computers: computersWithUsers,
               diy: diyWithUsers,
               homeAndGarden: homeAndGardenWithUsers,
            } : undefined}
          />
        </Suspense>
      </div>
    </div>
  );
}
