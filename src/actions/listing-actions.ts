'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import { mapConvexListing } from '@/lib/utils/listings';
import { revalidatePath } from 'next/cache';

// ============================================
// TYPES
// ============================================

interface CreateListingData {
  title: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  specifications?: Record<string, any>;
  city: string;
  region?: string;
  contactPhone: string;
  contactEmail?: string;
  showPhonePublic?: boolean;
  thumbnail?: string;
  images?: { url: string; alt?: string; position: number }[];
  features?: string[];
  tags?: string[];
}

interface GetListingsFilters {
  category?: string;
  subCategory?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc';
  status?: 'ACTIVE' | 'PENDING' | 'SOLD' | 'EXPIRED';
  userId?: string; 
  page?: number;
  limit?: number;
}

// HELPERS
// ============================================

// (Moved to @/lib/utils/listings)

// ============================================
// CREATE LISTING
// ============================================

export async function createListingAction(data: CreateListingData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in to create a listing' };
    }

    const listingId = await convex.mutation(api.listings.create, {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        subCategory: data.subCategory || undefined,
        city: data.city,
        region: data.region,
        userId: session.user.id,
        thumbnail: data.thumbnail,
        images: data.images?.map(i => i.url) || [],
        specifications: data.specifications || {},
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
    });

    revalidatePath('/listings');
    revalidatePath('/my-listings');
    revalidatePath('/');

    return { success: true, listing: { id: listingId } };
  } catch (error) {
    console.error('Error creating listing:', error);
    return { success: false, error: 'Failed to create listing' };
  }
}

// ============================================
// GET LISTINGS
// ============================================

export async function getListingsAction(filters: GetListingsFilters = {}) {
  try {
    const {
      category,
      subCategory,
      search,
      status = 'ACTIVE',
      page = 1,
      limit = 20,
    } = filters;

    // Map sort to Convex expected values
    // Using string type for sortStr to allow for mapping from frontend values
    let sortStr: string = filters.sort || 'newest';
    if (sortStr === 'price-low') sortStr = 'price-asc';
    if (sortStr === 'price-high') sortStr = 'price-desc';

    let listings;
    
    listings = await convex.query(api.listings.list, { 
        category, 
        subCategory, 
        status,
        city: filters.city,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: sortStr,
        userType: undefined, 
        adType: undefined,
        condition: undefined
    });

    if (search) {
        const q = search.toLowerCase();
        listings = listings.filter((l: any) => l.title.toLowerCase().includes(q));
    }

    const total = listings.length;
    const mappedListings = listings.map(mapConvexListing);

    return {
      success: true,
      listings: mappedListings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching listings:', error);
    return { success: false, error: 'Failed to fetch listings', listings: [], pagination: null };
  }
}

// ============================================
// GET SINGLE LISTING
// ============================================

export async function getListingByIdAction(id: string) {
  try {
    const listing = await convex.query(api.listings.getById, { id: id as any });

    if (!listing) {
      return { success: false, error: 'Listing not found' };
    }

    return { success: true, listing: mapConvexListing(listing) };
  } catch (error) {
    console.error('Error fetching listing:', error);
    return { success: false, error: 'Failed to fetch listing' };
  }
}

export async function getListingsByIdsAction(ids: string[]) {
    try {
        const listings = await convex.query(api.listings.getByIds, { 
            ids: ids.map(id => id as any) 
        });
        return listings.map(mapConvexListing);
    } catch (error) {
        console.error('Error fetching listings by ids:', error);
        return [];
    }
}

// ============================================
// UPDATE LISTING
// ============================================

export async function updateListingAction(id: string, data: Partial<CreateListingData>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await convex.mutation(api.listings.update, {
        id: id as any,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        subCategory: data.subCategory || undefined,
        city: data.city,
        region: data.region,
        thumbnail: data.thumbnail,
        images: data.images?.map(i => i.url),
        specifications: data.specifications,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
    });

    revalidatePath('/listings');
    revalidatePath('/my-listings');
    revalidatePath(`/listings/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating listing:', error);
    return { success: false, error: 'Failed to update listing' };
  }
}

// ============================================
// DELETE LISTING
// ============================================

export async function deleteListingAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
  }

  try {
    await convex.mutation(api.listings.remove, { id: id as any });
    revalidatePath('/admin/listings');
    revalidatePath('/listings');
    revalidatePath('/my-listings');
    return { success: true, message: 'Listing deleted successfully' };
  } catch (error) {
    console.error('Delete listing error:', error);
    return { success: false, error: 'Failed to delete listing' };
  }
}

export async function deleteMultipleListingsAction(ids: string[]) {
  const session = await auth();
   if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
  }
  
  try {
      // In Convex we would loop through and delete or create a bulk delete mutation
      for (const id of ids) {
          await convex.mutation(api.listings.remove, { id: id as any });
      }
    revalidatePath('/admin/listings');
    revalidatePath('/listings');
    revalidatePath('/my-listings');
    return { success: true, message: 'Listings deleted successfully' };
  } catch (error) {
      console.error('Bulk delete error:', error);
      return { success: false, error: 'Failed to delete listings' };
  }
}

// ============================================
// MARK AS SOLD
// ============================================

export async function markAsSoldAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await convex.mutation(api.listings.update, {
      id: id as any,
      status: 'SOLD',
    });

    revalidatePath('/my-listings');
    revalidatePath(`/listings/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Error marking as sold:', error);
    return { success: false, error: 'Failed to mark as sold' };
  }
}

// ============================================
// RENEW LISTING
// ============================================

export async function renewListingAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await convex.mutation(api.listings.update, {
      id: id as any,
      status: 'ACTIVE',
      createdAt: Date.now(), // Bump listing to top
    });

    revalidatePath('/my-listings');
    revalidatePath(`/listings/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Error renewing listing:', error);
    return { success: false, error: 'Failed to renew listing' };
  }
}


// ============================================
// GET USER'S LISTINGS
// ============================================

export async function getMyListingsAction(status?: 'ACTIVE' | 'PENDING' | 'SOLD' | 'EXPIRED' | 'PENDING_APPROVAL', search?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized', listings: [] };
    }

    const listings = await convex.query(api.listings.getByUser, { 
        userId: session.user.id,
        search: search
    });

    const mappedListings = listings.map(mapConvexListing);

    // Filter by status if provided (and if not searching, or keep logic same? Search should probably traverse statuses unless specified)
    // Current logic: Filter AFTER fetch. If status is provided, filter by it.
    const filtered = status ? mappedListings.filter((l: any) => l.status === status) : mappedListings;

    return { success: true, listings: filtered as any };
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return { success: false, error: 'Failed to fetch listings', listings: [] };
  }
}

// ============================================
// GET ALL CATEGORIES
// ============================================

export async function getAllCategoriesAction() {
  try {
    const categories = await convex.query(api.categories.list);

    return { 
      success: true, 
      categories: categories.map(c => ({
          id: c._id,
          name: c.name,
          slug: c.slug,
          parentId: c.parentId
      }))
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, error: 'Failed to fetch categories', categories: [] };
  }
}

// ============================================
// GET CATEGORY TEMPLATE
// ============================================

export async function getCategoryTemplateAction(categoryId: string) {
  try {
    // Get all categories and find by string ID
    const categories = await convex.query(api.categories.list, {});
    const category = categories.find(c => c._id === categoryId);
    
    if (!category) {
      return { success: false, error: 'Category not found' };
    }

    return {
      success: true,
      data: {
        template: category.template || { fields: [] }
      }
    };
  } catch (error) {
    console.error('Error fetching category template:', error);
    return { success: false, error: 'Failed to fetch template' };
  }
}
