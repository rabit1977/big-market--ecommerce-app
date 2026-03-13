import { v } from 'convex/values';
import { mutation, query, MutationCtx, QueryCtx } from './_generated/server';

/**
 * Helper to ensure we always work with the canonical externalId.
 */
async function getCanonicalExternalId(ctx: QueryCtx | MutationCtx, id: string): Promise<string> {
  // 1. Try as externalId
  const userByExternal = await ctx.db
    .query('users')
    .withIndex('by_externalId', (q) => q.eq('externalId', id))
    .unique();
  if (userByExternal) return userByExternal.externalId;

  // 2. Try as internal ID
  try {
    const internalUser = await ctx.db.get(id as any);
    if (internalUser && (internalUser as any).externalId) {
      return (internalUser as any).externalId;
    }
  } catch (e) {
    // Not a valid Convex ID
  }

  return id;
}

/** Follow a seller */
export const follow = mutation({
  args: { sellerId: v.string(), followerId: v.string() },
  handler: async (ctx, { sellerId, followerId }) => {
    const sId = await getCanonicalExternalId(ctx, sellerId);
    const fId = await getCanonicalExternalId(ctx, followerId);

    // Prevent duplicate follows
    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) =>
        q.eq('followerId', fId).eq('sellerId', sId),
      )
      .unique();
    if (existing) return existing._id;

    const followId = await ctx.db.insert('followedSellers', {
      followerId: fId,
      sellerId: sId,
      createdAt: Date.now(),
    });

    // Notify the seller
    if (sId !== fId) {
      console.log(`[Followers] Creating notification for seller ${sId} from follower ${fId}`);
      const follower = await ctx.db
        .query('users')
        .withIndex('by_externalId', (q) => q.eq('externalId', fId))
        .unique();

      const followerName = follower?.name || 'A user';

      await ctx.db.insert('notifications', {
        userId: sId,
        type: 'STORE_FOLLOW',
        title: 'New Store Follower',
        message: `${followerName} started following your store.`,
        link: '/favorites?tab=stores',
        isRead: false,
        createdAt: Date.now(),
        metadata: {
          followerId: fId,
          followerName,
          followerImage: follower?.image,
        },
      });
    }

    return followId;
  },
});

/** Unfollow a seller */
export const unfollow = mutation({
  args: { sellerId: v.string(), followerId: v.string() },
  handler: async (ctx, { sellerId, followerId }) => {
    const sId = await getCanonicalExternalId(ctx, sellerId);
    const fId = await getCanonicalExternalId(ctx, followerId);

    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) =>
        q.eq('followerId', fId).eq('sellerId', sId),
      )
      .unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});

/** Check if a specific user follows a specific seller */
export const isFollowing = query({
  args: { sellerId: v.string(), followerId: v.string() },
  handler: async (ctx, { sellerId, followerId }) => {
    const sId = await getCanonicalExternalId(ctx, sellerId);
    const fId = await getCanonicalExternalId(ctx, followerId);

    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) =>
        q.eq('followerId', fId).eq('sellerId', sId),
      )
      .unique();
    return !!existing;
  },
});

/** Get all sellers a user follows (with their user data) */
export const getFollowedSellers = query({
  args: { followerId: v.string() },
  handler: async (ctx, { followerId }) => {
    const fId = await getCanonicalExternalId(ctx, followerId);

    const follows = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower', (q) => q.eq('followerId', fId))
      .order('desc')
      .collect();

    // Fetch user data for each followed seller
    const sellers = await Promise.all(
      follows.map(async (follow) => {
        const seller = await ctx.db
          .query('users')
          .withIndex('by_externalId', (q) =>
            q.eq('externalId', follow.sellerId),
          )
          .unique();
        return seller ? { ...seller, followedAt: follow.createdAt } : null;
      }),
    );

    return sellers.filter(Boolean);
  },
});

/** Get all users who follow a seller (Store Followers) */
export const getStoreFollowers = query({
  args: { sellerId: v.string() },
  handler: async (ctx, { sellerId }) => {
    const sId = await getCanonicalExternalId(ctx, sellerId);

    const followers = await ctx.db
      .query('followedSellers')
      .withIndex('by_seller', (q) => q.eq('sellerId', sId))
      .order('desc')
      .collect();

    // Fetch user data for each follower
    const followerUsers = await Promise.all(
      followers.map(async (follow) => {
        const followerUser = await ctx.db
          .query('users')
          .withIndex('by_externalId', (q) =>
            q.eq('externalId', follow.followerId),
          )
          .unique();
        return followerUser
          ? { ...followerUser, followedAt: follow.createdAt }
          : null;
      }),
    );

    return followerUsers.filter(Boolean);
  },
});

/** Get follower count for a seller */
export const getFollowerCount = query({
  args: { sellerId: v.string() },
  handler: async (ctx, { sellerId }) => {
    const sId = await getCanonicalExternalId(ctx, sellerId);
    const follows = await ctx.db
      .query('followedSellers')
      .withIndex('by_seller', (q) => q.eq('sellerId', sId))
      .collect();
    return follows.length;
  },
});

/** Backfill to normalize all existing follows to use canonical externalIds */
export const backfillFollows = mutation({
  args: {},
  handler: async (ctx) => {
    const allFollows = await ctx.db.query('followedSellers').collect();
    let updated = 0;

    for (const follow of allFollows) {
      const canonicalSellerId = await getCanonicalExternalId(ctx, follow.sellerId);
      const canonicalFollowerId = await getCanonicalExternalId(ctx, follow.followerId);

      if (
        canonicalSellerId !== follow.sellerId ||
        canonicalFollowerId !== follow.followerId
      ) {
        await ctx.db.patch(follow._id, {
          sellerId: canonicalSellerId,
          followerId: canonicalFollowerId,
        });
        updated++;
      }
    }

    return { message: `Normalized ${updated} follow records.`, status: 'success' };
  },
});
