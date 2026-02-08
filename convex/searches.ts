import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveSearch = mutation({
  args: {
    userId: v.string(),
    query: v.string(),
    url: v.string(),
    name: v.optional(v.string()),
    filters: v.string(),
    isEmailAlert: v.boolean(),
    frequency: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check if exists
    const existing = await ctx.db
      .query("savedSearches")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("url"), args.url))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("savedSearches", {
      userId: args.userId,
      query: args.query,
      url: args.url,
      name: args.name,
      filters: args.filters,
      isEmailAlert: args.isEmailAlert,
      frequency: args.frequency
    });
  },
});

export const getSavedSearches = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("savedSearches")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const deleteSavedSearch = mutation({
  args: { id: v.id("savedSearches") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
