import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByListing = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .filter((q) => q.eq(q.field("isApproved"), true))
      .order("desc")
      .collect();
  },
});

export const listAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .order("desc")
      .take(args.limit || 50);
  },
});

export const getByListingAndUser = query({
  args: { listingId: v.id("listings"), userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    listingId: v.id("listings"),
    userId: v.string(),
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        rating: args.rating,
        title: args.title,
        comment: args.comment,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("reviews", {
        ...args,
        isApproved: true,
        createdAt: Date.now(),
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateVisibility = mutation({
  args: { id: v.id("reviews"), isApproved: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isApproved: args.isApproved });
  },
});

export const adminReply = mutation({
  args: { id: v.id("reviews"), response: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      adminResponse: args.response,
      adminRespondedAt: Date.now(),
    });
  },
});

export const getSellerReviewStats = query({
    args: { sellerId: v.string() },
    handler: async (ctx, args) => {
        // Find all listings by this seller
        const listings = await ctx.db
           .query("listings")
           .withIndex("by_userId", (q) => q.eq("userId", args.sellerId))
           .collect();
           
        if (listings.length === 0) return { averageRating: 0, totalReviews: 0 };
        
        // Fetch all reviews for these listings
        let totalRating = 0;
        let totalReviews = 0;
        
        // Note: This could be optimized later with dedicated aggregations or stored fields on User
        for (const listing of listings) {
            const reviews = await ctx.db
              .query("reviews")
              .withIndex("by_listing", (q) => q.eq("listingId", listing._id))
              .collect();
              
            for (const review of reviews) {
                totalRating += review.rating;
                totalReviews++;
            }
        }
        
        return {
            averageRating: totalReviews > 0 ? totalRating / totalReviews : 0,
            totalReviews
        };
    }
});
