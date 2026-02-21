import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Queries ───────────────────────────────────────────────────────────────

/** Get all bumps for a specific listing */
export const getByListing = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listingBumps")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .order("desc")
      .collect();
  },
});

/** Get bump history for a user */
export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listingBumps")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/** Get the last bump for a specific listing (to check cooldown) */
export const getLastBump = query({
  args: { userId: v.string(), listingId: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listingBumps")
      .withIndex("by_user_listing", (q) =>
        q.eq("userId", args.userId).eq("listingId", args.listingId)
      )
      .order("desc")
      .first();
  },
});

// ─── Mutations ─────────────────────────────────────────────────────────────

/** Record a listing bump/refresh action */
export const recordBump = mutation({
  args: {
    userId: v.string(),
    listingId: v.id("listings"),
    type: v.string(), // 'REFRESH' | 'BUMP' | 'PROMOTE'
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("listingBumps", {
      userId: args.userId,
      listingId: args.listingId,
      type: args.type,
      bumpedAt: Date.now(),
    });
  },
});
