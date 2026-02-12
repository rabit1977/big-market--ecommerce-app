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

export async function approveListing(id: string) {
    try {
        await requireAdmin();
        await convex.mutation(api.listings.approveListing, { id: id as any });
        revalidatePath('/admin/listings');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function rejectListing(id: string) {
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

        await convex.mutation(api.listings.remove, { id: id as any });
        revalidatePath('/my-listings');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function markAsSoldAction(id: string) {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: "Unauthorized" };

        await convex.mutation(api.listings.update, { 
            id: id as any, 
            status: 'SOLD' 
        });
        revalidatePath('/my-listings');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}


export async function renewListingAction(id: string) {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: "Unauthorized" };

        await convex.mutation(api.listings.update, { 
            id: id as any, 
            createdAt: Date.now(),
            status: 'ACTIVE'
        });
        revalidatePath('/my-listings');
        return { success: true };
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
