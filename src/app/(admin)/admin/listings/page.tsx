import { auth } from '@/auth';
import { ListingsClient } from '@/components/admin/listings-client';
import { Button } from '@/components/ui/button';
import { PaginationControls } from '@/components/ui/pagination';
import { api, convex } from '@/lib/convex-server';
import { Layers, Package, PlusCircle, Tag } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface AdminListingsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    category?: string;
    q?: string;
    status?: string;
  }>;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }
}

export default async function AdminListingsPage(props: AdminListingsPageProps) {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const skip = (page - 1) * limit;

  const { category, status, q } = searchParams;

  // Build where clause equivalent for Convex
  let rawListings: any[] = [];
  if (q) {
      rawListings = await convex.query(api.listings.search, { query: q });
  } else {
      rawListings = await convex.query(api.listings.list, { 
          category: (category && category !== 'all') ? category : undefined,
          status: (status && status !== 'all') ? status : undefined 
      });
  }

  // Pagination (Convex returns all results for now, so we slice)
  const totalCount = rawListings.length;
  const slicedListings = rawListings.slice(skip, skip + limit);

  // Stats and Categories
  const allListingsDocs = await convex.query(api.listings.get);
  const categoriesSet = new Set<string>();
  let activeCount = 0;
  let soldCount = 0;

  allListingsDocs.forEach(l => {
      if (l.category) categoriesSet.add(l.category);
      if (l.status === 'ACTIVE') activeCount++;
      if (l.status === 'SOLD') soldCount++;
  });

  const categories = Array.from(categoriesSet);

  const listings = slicedListings.map((listing) => ({
    ...listing,
    id: listing._id,
    createdAt: new Date(listing._creationTime).toISOString(),
    updatedAt: new Date(listing._creationTime).toISOString(),
    thumbnail: listing.thumbnail || (listing.images?.[0]) || '/placeholder.png'
  }));

  const totalPages = Math.ceil(totalCount / limit);

  const stats = {
    total: totalCount,
    categories: categories.length,
    active: activeCount,
    sold: soldCount,
  };

  const statItems = [
    { 
      label: 'Listings', 
      value: stats.total, 
      icon: Package, 
      color: 'text-primary', 
      bg: 'bg-primary/10', 
      border: 'border-primary/20' 
    },
    { 
      label: 'Categories', 
      value: stats.categories, 
      icon: Layers, 
      color: 'text-primary', 
      bg: 'bg-primary/10', 
      border: 'border-primary/20' 
    },
    { 
      label: 'Active', 
      value: stats.active, 
      icon: Tag, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20' 
    },
    { 
      label: 'Sold', 
      value: stats.sold, 
      icon: Tag, 
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10', 
      border: 'border-orange-500/20' 
    },
  ];

  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground flex items-center gap-2 sm:gap-3 flex-wrap'>
            Listings
            <span className='inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20'>
              {stats.total}
            </span>
          </h1>
          <p className='text-sm sm:text-lg text-muted-foreground font-medium'>
            Manage platform listings
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className='flex gap-2 sm:gap-3'>
          <Button 
            asChild 
            size='default'
            className='w-full sm:w-auto rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all btn-premium flex-1'
          >
            <Link href='/admin/listings/new'>
              <PlusCircle className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
              Add Listing
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters Placeholder */}
      <div className="bg-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground">Filters coming soon...</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5'>
        {statItems.map((stat, i) => (
          <div 
            key={i} 
            className={`glass-card  p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group border gap-2 flex-row-reverse ${stat.border}`}
          >
            <div className='flex justify-between items-start mb-2'>
              <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                <stat.icon className='h-4 w-4 sm:h-6 sm:w-6' />
              </div>
            </div>
            <div className='flex flex-col items-start min-w-24'>
              <h3 className='text-xl sm:text-3xl font-black tracking-tight  text-foreground'>
                {stat.value}
              </h3>
              <p className='text-[10px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-0.5 sm:mt-1'>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Listings List */}
      <div className='glass-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60'>
        <div className='p-4 sm:p-6 lg:p-8'> 
          {listings.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 sm:py-20 text-center space-y-4 sm:space-y-6'>
              <div className='w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-secondary/50 flex items-center justify-center'>
                <Package className='h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/50' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-xl sm:text-2xl font-black text-foreground'>
                  No listings found
                </h3>
              </div>
            </div>
          ) : (
            <ListingsClient
              listings={listings}
            />
          )}

          {listings.length > 0 && (
            <div className='mt-6 sm:mt-8'>
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                hasNextPage={page < totalPages}
                hasPreviousPage={page > 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
