import { v } from 'convex/values';
import { mutation, query, MutationCtx, QueryCtx } from './_generated/server';

/**
 * Resolve any user ID (externalId or internal Convex _id) to the canonical externalId.
 * This prevents ID-format mismatches between follow/query operations.
 */
async function toExternalId(ctx: QueryCtx | MutationCtx, id: string): Promise<string> {
  // Try as externalId first (most common path)
  const byExternal = await ctx.db
    .query('users')
    .withIndex('by_externalId', (q) => q.eq('externalId', id))
    .unique();
  if (byExternal) return byExternal.externalId;

  // Try as internal Convex ID
  try {
    const byInternal = await ctx.db.get(id as any);
    if (byInternal && (byInternal as any).externalId) {
      return (byInternal as any).externalId as string;
    }
  } catch (_) {
    // Not a valid Convex document ID – fall through
  }

  return id; // Return as-is if we cannot resolve
}

// ─── Follow ──────────────────────────────────────────────────────────────────

export const follow = mutation({
  args: { sellerId: v.string(), followerId: v.string() },
  handler: async (ctx, { sellerId, followerId }) => {
    const sId = await toExternalId(ctx, sellerId);
    const fId = await toExternalId(ctx, followerId);

    console.log(`[FollowStore] Attempting follow: sId=${sId}, fId=${fId}`);

    if (sId === fId) {
      console.warn(`[FollowStore] User ${fId} attempted to follow themselves.`);
      throw new Error("You cannot follow your own store.");
    }

    // Prevent duplicate follows
    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) => q.eq('followerId', fId).eq('sellerId', sId))
      .unique();
    if (existing) return existing._id;

    const followId = await ctx.db.insert('followedSellers', {
      followerId: fId,
      sellerId: sId,
      createdAt: Date.now(),
    });

    // Notify the seller
    const follower = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', fId))
      .unique();
    const followerName = follower?.name || 'Someone';

    await ctx.db.insert('notifications', {
      userId: sId,
      type: 'STORE_FOLLOW',
      title: 'New Follower',
      message: `${followerName} started following your store.`,
      link: '/favorites?tab=stores',
      isRead: false,
      createdAt: Date.now(),
      metadata: {
        followerId: fId,
        followerName,
        followerImage: follower?.image ?? null,
      },
    });

    return followId;
  },
});

// ─── Unfollow ─────────────────────────────────────────────────────────────────

export const unfollow = mutation({
  args: { sellerId: v.string(), followerId: v.string() },
  handler: async (ctx, { sellerId, followerId }) => {
    const sId = await toExternalId(ctx, sellerId);
    const fId = await toExternalId(ctx, followerId);

    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) => q.eq('followerId', fId).eq('sellerId', sId))
      .unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});

// ─── isFollowing ──────────────────────────────────────────────────────────────

export const isFollowing = query({
  args: { sellerId: v.string(), followerId: v.string() },
  handler: async (ctx, { sellerId, followerId }) => {
    const sId = await toExternalId(ctx, sellerId);
    const fId = await toExternalId(ctx, followerId);

    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) => q.eq('followerId', fId).eq('sellerId', sId))
      .unique();
    return !!existing;
  },
});

// ─── Stores I follow (Buyer view) ─────────────────────────────────────────────

export const getFollowedSellers = query({
  args: { followerId: v.string() },
  handler: async (ctx, { followerId }) => {
    const fId = await toExternalId(ctx, followerId);

    const follows = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower', (q) => q.eq('followerId', fId))
      .order('desc')
      .collect();

    const sellers = await Promise.all(
      follows.map(async (follow) => {
        const seller = await ctx.db
          .query('users')
          .withIndex('by_externalId', (q) => q.eq('externalId', follow.sellerId))
          .unique();
        return seller ? { ...seller, followedAt: follow.createdAt } : null;
      }),
    );

    return sellers.filter(Boolean);
  },
});

// ─── Who follows MY store (Seller / Store-owner view) ────────────────────────

export const getStoreFollowers = query({
  args: { sellerId: v.string() },
  handler: async (ctx, { sellerId }) => {
    const sId = await toExternalId(ctx, sellerId);

    const follows = await ctx.db
      .query('followedSellers')
      .withIndex('by_seller', (q) => q.eq('sellerId', sId))
      .order('desc')
      .collect();

    const followerUsers = await Promise.all(
      follows.map(async (follow) => {
        const user = await ctx.db
          .query('users')
          .withIndex('by_externalId', (q) => q.eq('externalId', follow.followerId))
          .unique();
        return user ? { ...user, followedAt: follow.createdAt } : null;
      }),
    );

    return followerUsers.filter(Boolean);
  },
});

// ─── Follower count ──────────────────────────────────────────────────────────

export const getFollowerCount = query({
  args: { sellerId: v.string() },
  handler: async (ctx, { sellerId }) => {
    const sId = await toExternalId(ctx, sellerId);
    const follows = await ctx.db
      .query('followedSellers')
      .withIndex('by_seller', (q) => q.eq('sellerId', sId))
      .collect();
    return follows.length;
  },
});

// ─── One-time backfill ────────────────────────────────────────────────────────

export const backfillFollows = mutation({
  args: {},
  handler: async (ctx) => {
    const allFollows = await ctx.db.query('followedSellers').collect();
    let updated = 0;

    for (const follow of allFollows) {
      const canonicalSellerId = await toExternalId(ctx, follow.sellerId);
      const canonicalFollowerId = await toExternalId(ctx, follow.followerId);

      if (canonicalSellerId !== follow.sellerId || canonicalFollowerId !== follow.followerId) {
        await ctx.db.patch(follow._id, {
          sellerId: canonicalSellerId,
          followerId: canonicalFollowerId,
        });
        updated++;
      }
    }

    return { updated, status: 'done' };
  },
});

// ─── DEBUG: See all raw rows in followedSellers ───────────────────────────────
export const debugAll = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query('followedSellers').collect();
  },
});

// ─── DEBUG: Resolve any ID to its canonical externalId ───────────────────────
export const debugResolveId = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const canonical = await toExternalId(ctx, id);
    const userByExternal = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', id))
      .unique();
    return {
      input: id,
      canonical,
      foundByExternalId: !!userByExternal,
      userName: userByExternal?.name,
    };
  },
});
