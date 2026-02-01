'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import { revalidatePath } from 'next/cache';

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
}

export async function addOrUpdateReviewAction(
  listingId: string,
  reviewData: ReviewData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const userId = session.user.id;

  try {
    const { rating, title, comment } = reviewData;

    await convex.mutation(api.reviews.upsert, {
      listingId: listingId as any,
      userId,
      rating,
      title,
      comment,
    });

    revalidatePath(`/listings/${listingId}`);
    revalidatePath(`/`);

    return { success: true };
  } catch (error) {
    console.error('Error adding or updating review:', error);
    return { success: false, error: 'Failed to submit review.' };
  }
}

export async function deleteReviewAction(reviewId: string, listingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await convex.mutation(api.reviews.remove, { id: reviewId as any });

    revalidatePath(`/listings/${listingId}`);
    revalidatePath(`/`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Failed to delete review' };
  }
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getAllReviewsAction(page = 1, limit = 10, search = '') {
  try {
    await requireAdmin();
    const reviews = await convex.query(api.reviews.listAll, { limit: 50 });

    const enriched = await Promise.all(reviews.map(async (r) => {
        const [user, listing] = await Promise.all([
            convex.query(api.users.getByExternalId, { externalId: r.userId }),
            convex.query(api.listings.getById, { id: r.listingId })
        ]);

        return {
            ...r,
            id: r._id,
            user: { name: user?.name, image: user?.image, email: user?.email },
            product: listing ? { id: listing._id, title: listing.title, thumbnail: listing.thumbnail, slug: listing._id } : null
        };
    }));

    return { 
        success: true, 
        reviews: enriched, 
        total: enriched.length, 
        pages: 1 
    };
  } catch (error) {
    console.error('Admin Fetch Reviews Error:', error);
    return { success: false, error: 'Failed to fetch reviews' };
  }
}

export async function adminDeleteReviewAction(id: string) {
    try {
        await requireAdmin();
        await convex.mutation(api.reviews.remove, { id: id as any });
        revalidatePath('/admin/reviews');
        return { success: true, message: 'Review deleted' };
    } catch (error) {
        return { success: false, error: 'Failed to delete review' };
    }
}

export async function toggleReviewVisibilityAction(id: string) {
    try {
        await requireAdmin();
        // Since we don't fetch before mutation in server action usually, 
        // we'll just implement a toggle mutation in Convex or fetch here.
        // For simplicity, let's assume we pass the target state or fetch it.
        // I'll fetch it here.
        const all = await convex.query(api.reviews.listAll, {});
        const r = all.find(item => item._id === id);
        if (!r) throw new Error('Not found');

        await convex.mutation(api.reviews.updateVisibility, {
            id: id as any,
            isApproved: !r.isApproved
        });

        revalidatePath('/admin/reviews');
        return { success: true, message: 'Visibility updated' };
    } catch (error) {
        return { success: false, error: 'Failed to update visibility' };
    }
}

export async function adminReplyReviewAction(id: string, response: string) {
    try {
        await requireAdmin();
        await convex.mutation(api.reviews.adminReply, {
            id: id as any,
            response
        });
        revalidatePath('/admin/reviews');
        return { success: true, message: 'Reply added' };
    } catch (error) {
        return { success: false, error: 'Failed to reply' };
    }
}
