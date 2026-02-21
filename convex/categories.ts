import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("asc").collect();
  },
});

// Helper to get counts for a list of categories
async function getCategoryCounts(ctx: any, categories: any[], isSubCategory: boolean) {
    // 1. Fetch all ACTIVE listings to aggregate in memory (more efficient than N queries if N is large)
    // However, if listings are huge, this is slow. 
    // For now, given it's admin, let's do parallel queries which Convex handles well.
    const counts = await Promise.all(categories.map(async (cat) => {
        let count = 0;
        if (isSubCategory) {
             count = (await ctx.db
                .query("listings")
                .withIndex("by_status_subCategory", (q: any) => q.eq("status", "ACTIVE").eq("subCategory", cat.slug))
                .collect()).length;
        } else {
             count = (await ctx.db
                .query("listings")
                .withIndex("by_status_category", (q: any) => q.eq("status", "ACTIVE").eq("category", cat.slug))
                .collect()).length;
        }
        return { ...cat, count };
    }));
    return counts;
}

export const getRoot = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", undefined))
      .collect();
    
    return await getCategoryCounts(ctx, categories, false);
  },
});

export const getChildren = query({
  args: { parentId: v.string() },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", args.parentId))
      .collect();

    return await getCategoryCounts(ctx, categories, true);
  },
});

export const getWithCounts = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();

    // Replaced full-table scan Memory mapping with targeted index counts.
    // Fetch counts in parallel without loading actual documents.
    const countsArray = await Promise.all(categories.map(async (cat) => {
        let count = 0;
        
        // If parent ID is empty, this is a Parent Category
        if (!cat.parentId) {
             const items = await ctx.db
                .query("listings")
                .withIndex("by_status_category", (q: any) => q.eq("status", "ACTIVE").eq("category", cat.slug))
                .collect();
             count = items.length;
        } else {
             // Otherwise it is a Sub Category
             const items = await ctx.db
                .query("listings")
                .withIndex("by_status_subCategory", (q: any) => q.eq("status", "ACTIVE").eq("subCategory", cat.slug))
                .collect();
             count = items.length;
        }

        return { slug: cat.slug, count };
    }));

    const countMap = new Map<string, number>();
    countsArray.forEach(c => countMap.set(c.slug, c.count));

    return categories.map(cat => ({
      ...cat,
      count: countMap.get(cat.slug) || 0
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
