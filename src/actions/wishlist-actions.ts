'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import { revalidatePath } from 'next/cache';

type FavoriteActionResult = {
  success: boolean;
  wishlist?: string[];
  isWished?: boolean;
  error?: string;
};

/**
 * Get the listing IDs of all items in the current user's favorites.
 */
export async function getWishlistAction(listName?: string): Promise<FavoriteActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized', wishlist: [] };
  }

  try {
    const favorites = await convex.query(api.favorites.get, { 
       userId: session.user.id,
       ...(listName ? { listName } : {}) 
    });
    return {
      success: true,
      wishlist: favorites.map((item) => item.listingId),
    };
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return { success: false, error: 'Failed to fetch favorites.', wishlist: [] };
  }
}

/**
 * Toggle a listing in the current user's favorites.
 */
export async function toggleWishlistAction(
  listingId: string,
  listName?: string
): Promise<FavoriteActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const userId = session.user.id;

  try {
    const isWished = await convex.mutation(api.favorites.toggle, {
      userId,
      listingId: listingId as any,
      ...(listName ? { listName } : {})
    });

    revalidatePath('/favorites');
    revalidatePath(`/listings/${listingId}`);
    revalidatePath('/listings');

    return {
      success: true,
      isWished,
    };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, error: 'Operation failed.' };
  }
}

/**
 * Clear all favorites
 */
export async function clearWishlistAction(listName?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await convex.mutation(api.favorites.clear, { 
       userId: session.user.id,
       ...(listName ? { listName } : {}) 
    });

    revalidatePath('/favorites');
    revalidatePath('/listings');

    return { success: true, wishlist: [] };
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return { success: false, error: 'Failed to clear favorites.' };
  }
}
