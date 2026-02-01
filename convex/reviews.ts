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
