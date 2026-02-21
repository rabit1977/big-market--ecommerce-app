import { v } from "convex/values";
import { query } from "./_generated/server";

export const getPublicProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Attempt to find user by externalId or internal _id
    let user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .unique();

    if (!user) {
        try {
            const potentialUser = await ctx.db.get(args.userId as any) as any;
            if (potentialUser && 'externalId' in potentialUser) {
                user = potentialUser;
            }
        } catch (e) {}
    }

    if (!user) return null;

    // Get active listings count (checking both internal and external IDs for safety)
    const listingsByExternal = await ctx.db
       .query("listings")
       .withIndex("by_userId", (q) => q.eq("userId", user.externalId))
       .collect();
       
    const listingsByInternal = await ctx.db
       .query("listings")
       .withIndex("by_userId", (q) => q.eq("userId", user._id as string))
       .collect();

    const existingIds = new Set(listingsByExternal.map(l => l._id));
    const allListings = [...listingsByExternal, ...listingsByInternal.filter(l => !existingIds.has(l._id))];
    const activeListingsCount = allListings.filter(l => l.status === 'ACTIVE').length;

    // Get average rating and review count
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", user.externalId))
      .filter(q => q.eq(q.field("isApproved"), true))
      .collect();

    const totalRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length) : 0;

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
        reviewCount: reviews.length,
        averageRating,
        phone: user.phone,
    };
  }
});
