import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("asc").collect();
  },
});

export const getWithCounts = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories")
      .filter(q => q.eq(q.field("isActive"), true))
      .collect();
    
    const activeListings = await ctx.db.query("listings")
      .withIndex("by_status", q => q.eq("status", "ACTIVE"))
      .collect();
      
    const counts = new Map<string, number>();
    activeListings.forEach(l => {
      // Direct count for the primary category
      counts.set(l.category, (counts.get(l.category) || 0) + 1);
      
      // If there's a subcategory and it's different from category, count it too
      if (l.subCategory && l.subCategory !== l.category) {
        counts.set(l.subCategory, (counts.get(l.subCategory) || 0) + 1);
      }
    });

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
