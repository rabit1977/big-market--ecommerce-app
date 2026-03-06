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
        q.eq('followerId', followerId).eq('sellerId', sellerId),
      )
      .unique();
    if (existing) return existing._id;

    const followId = await ctx.db.insert('followedSellers', {
      followerId,
      sellerId,
      createdAt: Date.now(),
    });

    // Notify the seller
    if (sellerId !== followerId) {
      const follower = await ctx.db
        .query('users')
        .withIndex('by_externalId', (q) => q.eq('externalId', followerId))
        .first();

      const followerName = follower?.name || 'Someone';

      await ctx.db.insert('notifications', {
        userId: sellerId,
        type: 'SYSTEM',
        title: 'New Store Follower',
        message: `${followerName} started following your store.`,
        isRead: false,
        createdAt: Date.now(),
        metadata: {
          followerId,
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
    const existing = await ctx.db
      .query('followedSellers')
      .withIndex('by_follower_seller', (q) =>
        q.eq('followerId', followerId).eq('sellerId', sellerId),
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
        q.eq('followerId', followerId).eq('sellerId', sellerId),
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
    // 1. Resolve sellerId to internal vs external
    let resolvedSellerId = sellerId;
    const user = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', sellerId))
      .unique();

    if (user) {
      resolvedSellerId = user.externalId;
    }

    const followers = await ctx.db
      .query('followedSellers')
      .withIndex('by_seller', (q) => q.eq('sellerId', resolvedSellerId))
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
    const follows = await ctx.db
      .query('followedSellers')
      .withIndex('by_seller', (q) => q.eq('sellerId', sellerId))
      .collect();
    return follows.length;
  },
});
