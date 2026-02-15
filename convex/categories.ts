import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("asc").collect();
  },
});

export const getRoot = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", undefined))
      .collect();
  },
});

export const getChildren = query({
  args: { parentId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", args.parentId))
      .collect();
  },
});

export const getWithCounts = query({
  args: {},
  handler: async (ctx) => {
    // 1. Fetch active categories using index
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
    
    // 2. Fetch only ACTIVE listings
    const activeListings = await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
      .collect();
      
    // 3. Fast Map aggregation
    const counts = new Map<string, number>();
    for (const l of activeListings) {
      if (l.category) {
        counts.set(l.category, (counts.get(l.category) || 0) + 1);
      }
      if (l.subCategory && l.subCategory !== l.category) {
        counts.set(l.subCategory, (counts.get(l.subCategory) || 0) + 1);
      }
    }

    return categories.map(cat => ({
      ...cat,
      count: counts.get(cat.slug) || 0
    }));
  }
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    parentId: v.optional(v.string()),
    template: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    parentId: v.optional(v.string()),
    template: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
