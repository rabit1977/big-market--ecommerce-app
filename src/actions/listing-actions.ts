'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import { ListingWithRelations } from '@/lib/types/listing';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

async function requireApproved(id: string) {
    const listing = await convex.query(api.listings.getById, { id: id as any });
    if (!listing) throw new Error("Listing not found");
    if (listing.status === 'PENDING_APPROVAL') {
        // Allow admins to bypass this if needed (optional, but requested by user to block even the owner)
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            throw new Error("Action blocked: This listing is waiting for administrator approval.");
        }
    }
    return listing;
}

export async function approveListingAction(id: string) {
    try {
        await requireAdmin();
        await convex.mutation(api.listings.approveListing, { id: id as any });
        revalidatePath('/admin/listings');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function rejectListingAction(id: string) {
    try {
        await requireAdmin();
        await convex.mutation(api.listings.rejectListing, { id: id as any });
        revalidatePath('/admin/listings');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getPendingListings() {
    try {
        await requireAdmin();
        const listings = await convex.query(api.listings.getPendingListings);
        return listings;
    } catch (e: any) {
        return [];
    }
}

export async function deleteListingAction(id: string) {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: "Unauthorized" };
        
        await requireApproved(id);

        await convex.mutation(api.listings.remove, { id: id as any });
        revalidatePath('/my-listings');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}




export async function renewListingAction(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await requireApproved(id);

        const res = await convex.mutation(api.listings.renewListing, { 
            id: id as any,
            userId: session.user.id
        });

        revalidatePath('/my-listings');
        return { success: true, data: res };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getRenewalStatsAction() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const stats = await convex.query(api.listings.getRenewalStats, { 
            userId: session.user.id 
        });

        return { success: true, stats };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function createListingAction(data: any) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const listingId = await convex.mutation(api.listings.create, {
            ...data,
            userId: session.user.id,
        });

        revalidatePath('/my-listings');
        return { success: true, listing: { id: listingId } };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

async function requireOwnershipOrAdmin(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const listing = await convex.query(api.listings.getById, { id: id as any });
    if (!listing) throw new Error("Listing not found");

    const isOwner = listing.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
        throw new Error("Unauthorized: You do not own this listing.");
    }
    
    return listing;
}

export async function updateListingAction(id: string, data: any) {
    try {
        await requireOwnershipOrAdmin(id);

        await convex.mutation(api.listings.update, {
            id: id as any,
            ...data,
        });

        revalidatePath('/my-listings');
        revalidatePath('/admin/listings');
        revalidatePath(`/listings/${id}`); // listings/[id]
        
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getCategoryTemplateAction(categoryId: string) {
    try {
        // Categories table holds the template in this schema
        const category = await convex.query(api.categories.getById, { id: categoryId as any });
        return { success: true, data: category };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getMyListingsAction(q?: string): Promise<{ success: boolean; listings?: ListingWithRelations[]; error?: string }> {
    try {
        const session = await auth();
        if (!session?.user || !session.user.id) return { success: false, error: "Unauthorized" };

        const listings = await convex.query(api.listings.getByUser, { 
            userId: session.user.id, 
            search: q 
        });

        // Map to ListingWithRelations shape
        const mappedListings = listings.map(listing => ({
            ...listing,
            id: listing._id,
            updatedAt: new Date(listing.createdAt || listing._creationTime),
            images: (listing.images || []).map((url: string) => ({ url })),
            user: {
                id: session.user.id!,
                name: session.user.name || null,
                image: session.user.image || null,
                city: null, // Session doesn't typically carry this, and it's not critical for "My Listings" view
            }
        })) as unknown as ListingWithRelations[];

        return { success: true, listings: mappedListings };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
export async function getListingByIdAction(id: string): Promise<{ success: boolean; listing?: ListingWithRelations; error?: string }> {
    try {
        const listing = await convex.query(api.listings.getById, { id: id as any });
        if (!listing) return { success: false, error: "Listing not found" };

        return { 
            success: true, 
            listing: {
                ...listing,
                id: listing._id,
                updatedAt: new Date(listing.createdAt || listing._creationTime),
                images: (listing.images || []).map((url: string) => ({ url })),
            } as unknown as ListingWithRelations
        };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
