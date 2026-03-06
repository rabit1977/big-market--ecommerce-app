import { v } from 'convex/values';
import { query } from './_generated/server';

export const getAllSellers = query({
  args: {},
  handler: async (ctx) => {
    const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const SEVEN_DAYS_AGO = Date.now() - 7 * 24 * 60 * 60 * 1000;

    // Get all users who are verified or have a business/pro membership tier
    const allUsers = await ctx.db.query('users').collect();

    // Include ALL admin-approved users (accountStatus ACTIVE) — admin approval is
    // the platform's verification gate. Premium/verified badges are secondary signals.
    const sellerUsers = allUsers.filter((u) => {
      const tier = (u.membershipTier || '').toLowerCase();
      return (
        u.accountStatus === 'ACTIVE' ||
        u.isVerified === true ||
        tier === 'business' ||
        tier === 'pro' ||
        tier === 'premium' ||
        u.role === 'ADMIN'
      );
    });

    // For each seller, get listing count, review stats, and featured products
    const sellers = await Promise.all(
      sellerUsers.map(async (user) => {
        const listingsByExternal = await ctx.db
          .query('listings')
          .withIndex('by_userId', (q) => q.eq('userId', user.externalId))
          .collect();
        const activeListings = listingsByExternal.filter(
          (l) => l.status === 'ACTIVE',
        );
        const activeListingsCount = activeListings.length;

        // Activity signals
        const sortedByDate = [...activeListings].sort(
          (a, b) => b.createdAt - a.createdAt,
        );
        const recentListingsCount = sortedByDate.filter(
          (l) => l.createdAt >= THIRTY_DAYS_AGO,
        ).length;
        const postedThisWeek = sortedByDate.some(
          (l) => l.createdAt >= SEVEN_DAYS_AGO,
        );
        const lastPostedAt = sortedByDate[0]?.createdAt ?? null;

        // Latest 2 active listings for product preview strip — newest first
        const featuredListings = sortedByDate.slice(0, 2).map((l) => ({
          _id: l._id as string,
          title: l.title,
          price: l.price,
          currency: l.currency || 'MKD',
          image: l.thumbnail || (l.images && l.images[0]) || null,
          condition: l.condition || null,
        }));

        let totalRatings = 0;
        let totalReviews = 0;
        for (const listing of listingsByExternal) {
          const reviews = await ctx.db
            .query('reviews')
            .withIndex('by_listing', (q) => q.eq('listingId', listing._id))
            .filter((q) => q.eq(q.field('isApproved'), true))
            .collect();

          for (const review of reviews) {
            totalRatings += review.rating;
            totalReviews++;
          }
        }

        const averageRating =
          totalReviews > 0 ? totalRatings / totalReviews : 0;

        // Check premium storefront status
        let hasPremiumStorefront = user.role === 'ADMIN';
        if (!hasPremiumStorefront) {
          const tier = (user.membershipTier || '').toLowerCase();
          hasPremiumStorefront =
            tier === 'business' || tier === 'pro' || tier === 'premium';
        }
        if (!hasPremiumStorefront) {
          const sub = await ctx.db
            .query('subscriptions')
            .withIndex('by_user_status', (q) =>
              q.eq('userId', user.externalId).eq('status', 'ACTIVE'),
            )
            .first();
          if (
            sub &&
            (sub.tier === 'pro' ||
              sub.tier === 'business' ||
              sub.tier === 'premium')
          ) {
            hasPremiumStorefront = true;
          }
        }

        return {
          _id: user._id,
          externalId: user.externalId,
          name: user.name,
          image: user.image,
          bio: user.bio,
          city: user.city,
          accountType: user.accountType || 'PERSON',
          companyName: user.companyName,
          isVerified: user.isVerified || false,
          membershipTier: user.membershipTier || 'FREE',
          createdAt: user.createdAt || user._creationTime,
          activeListingsCount,
          recentListingsCount, // listings posted in last 30 days
          postedThisWeek, // posted in last 7 days
          lastPostedAt, // timestamp of most recent active listing
          reviewCount: totalReviews,
          averageRating,
          hasPremiumStorefront,
          featuredListings,
        };
      }),
    );

    // Sort: most active (recent 30d) first, then business, then verified
    // Only show sellers who actually have at least 1 active listing
    return sellers
      .filter((s) => s.activeListingsCount > 0)
      .sort((a, b) => {
        if (b.recentListingsCount !== a.recentListingsCount)
          return b.recentListingsCount - a.recentListingsCount;
        const aTier =
          a.accountType === 'COMPANY' || a.hasPremiumStorefront ? 1 : 0;
        const bTier =
          b.accountType === 'COMPANY' || b.hasPremiumStorefront ? 1 : 0;
        if (bTier !== aTier) return bTier - aTier;
        return b.activeListingsCount - a.activeListingsCount;
      });
  },
});

export const getPublicProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Attempt to find user by externalId or internal _id
    let user = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', args.userId))
      .unique();

    if (!user) {
      const normalizedId = ctx.db.normalizeId('users', args.userId);
      if (normalizedId) {
        const potentialUser = await ctx.db.get(normalizedId);
        if (potentialUser) {
          user = potentialUser;
        }
      }
    }

    if (!user) return null;

    // Get active listings count (checking both internal and external IDs for safety)
    const listingsByExternal = await ctx.db
      .query('listings')
      .withIndex('by_userId', (q) => q.eq('userId', user.externalId))
      .collect();

    const listingsByInternal = await ctx.db
      .query('listings')
      .withIndex('by_userId', (q) => q.eq('userId', user._id as string))
      .collect();

    const existingIds = new Set(listingsByExternal.map((l) => l._id));
    const allListings = [
      ...listingsByExternal,
      ...listingsByInternal.filter((l) => !existingIds.has(l._id)),
    ];
    const activeListingsCount = allListings.filter(
      (l) => l.status === 'ACTIVE',
    ).length;

    // Get average rating and review count by checking the seller's listings
    let totalRatings = 0;
    let reviewCount = 0;

    for (const listing of allListings) {
      const reviews = await ctx.db
        .query('reviews')
        .withIndex('by_listing', (q) => q.eq('listingId', listing._id))
        .filter((q) => q.eq(q.field('isApproved'), true))
        .collect();

      for (const review of reviews) {
        totalRatings += review.rating;
        reviewCount++;
      }
    }

    const averageRating = reviewCount > 0 ? totalRatings / reviewCount : 0;

    // Check for premium storefront subscription
    let hasPremiumStorefront = user.role === 'ADMIN';
    if (!hasPremiumStorefront) {
      // Check directly on user doc (synced by activateMembership)
      const userTier = (user.membershipTier || '').toLowerCase();
      if (
        userTier === 'business' ||
        userTier === 'pro' ||
        userTier === 'premium'
      ) {
        hasPremiumStorefront = true;
      }

      if (!hasPremiumStorefront) {
        // Check subscriptions table for both potential IDs
        const userIds = [user.externalId, user._id as string];
        const subQueries = userIds.map((id) =>
          ctx.db
            .query('subscriptions')
            .withIndex('by_user_status', (q) =>
              q.eq('userId', id).eq('status', 'ACTIVE'),
            )
            .first(),
        );

        const results = await Promise.all(subQueries);
        const activeSubscription = results.find((s) => s !== null);

        if (
          activeSubscription &&
          (activeSubscription.tier === 'pro' ||
            activeSubscription.tier === 'business' ||
            activeSubscription.tier === 'premium')
        ) {
          hasPremiumStorefront = true;
        }
      }
    }

    return {
      _id: user._id,
      externalId: user.externalId,
      name: user.name,
      image: user.image,
      banner: user.banner,
      bio: user.bio,
      createdAt: user.createdAt || user._creationTime,
      isVerified: user.isVerified || false,
      accountType: user.accountType || 'PERSON',
      companyName: user.companyName,
      city: user.city,
      activeListingsCount,
      reviewCount,
      averageRating,
      phone: user.phone,
      email: user.email,
      hasWhatsapp: user.hasWhatsapp,
      hasViber: user.hasViber,
      hasPremiumStorefront,
    };
  },
});
