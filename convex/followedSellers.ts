import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/** Follow a seller */
export const follow = mutation({
  args: { sellerId: v.string(), followerId: v.string() },
  handler: async (ctx, { sellerId, followerId }) => {
    // Prevent duplicate follows
    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) =>
        q.eq('followerId', followerId).eq('sellerId', sellerId)
      )
      .unique();
    if (existing) return existing._id;

    return await ctx.db.insert('followedSellers', {
      followerId,
      sellerId,
      createdAt: Date.now(),
    });
  },
});

/** Unfollow a seller */
export const unfollow = mutation({
  args: { sellerId: v.string(), followerId: v.string() },
  handler: async (ctx, { sellerId, followerId }) => {
    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) =>
        q.eq('followerId', followerId).eq('sellerId', sellerId)
      )
      .unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});

/** Check if a specific user follows a specific seller */
export const isFollowing = query({
  args: { sellerId: v.string(), followerId: v.string() },
  handler: async (ctx, { sellerId, followerId }) => {
    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) =>
        q.eq('followerId', followerId).eq('sellerId', sellerId)
      )
      .unique();
    return !!existing;
  },
});

/** Get all sellers a user follows (with their user data) */
export const getFollowedSellers = query({
  args: { followerId: v.string() },
  handler: async (ctx, { followerId }) => {
    const follows = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower', (q) => q.eq('followerId', followerId))
      .order('desc')
      .collect();

    // Fetch user data for each followed seller
    const sellers = await Promise.all(
      follows.map(async (follow) => {
        const seller = await ctx.db
          .query('users')
          .withIndex('by_externalId', (q) => q.eq('externalId', follow.sellerId))
          .unique();
        return seller ? { ...seller, followedAt: follow.createdAt } : null;
      })
    );

    return sellers.filter(Boolean);
  },
});

/** Get follower count for a seller */
export const getFollowerCount = query({
  args: { sellerId: v.string() },
  handler: async (ctx, { sellerId }) => {
    const follows = await ctx.db
      .query('followedSellers')
      .withIndex('by_seller', (q) => q.eq('sellerId', sellerId))
      .collect();
    return follows.length;
  },
});
