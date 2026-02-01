import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("listings").order("desc").collect();
    // Prioritize promoted
    return results.sort((a, b) => {
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      return 0;
    });
  },
});

export const list = query({
  args: { 
    category: v.optional(v.string()), 
    subCategory: v.optional(v.string()),
    status: v.optional(v.string()),
    // New Professional Filters
    userType: v.optional(v.string()),
    adType: v.optional(v.string()),
    condition: v.optional(v.string()),
    isTradePossible: v.optional(v.boolean()),
    hasShipping: v.optional(v.boolean()),
    isVatIncluded: v.optional(v.boolean()),
    isAffordable: v.optional(v.boolean()),
    isPromoted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results;
    
    if (args.status) {
      results = await ctx.db
        .query("listings")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else if (args.category) {
      results = await ctx.db
        .query("listings")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .collect();
    } else {
      results = await ctx.db.query("listings").order("desc").collect();
    }
    
    // Server-side filtering
    if (args.status && args.category) results = results.filter(r => r.category === args.category);
    if (args.subCategory) results = results.filter(r => r.subCategory === args.subCategory);
    if (args.userType) results = results.filter(r => r.userType === args.userType);
    if (args.adType) results = results.filter(r => r.adType === args.adType);
    if (args.condition) results = results.filter(r => r.condition === args.condition);
    if (args.isTradePossible !== undefined) results = results.filter(r => r.isTradePossible === args.isTradePossible);
    if (args.hasShipping !== undefined) results = results.filter(r => r.hasShipping === args.hasShipping);
    if (args.isVatIncluded !== undefined) results = results.filter(r => r.isVatIncluded === args.isVatIncluded);
    if (args.isAffordable !== undefined) results = results.filter(r => r.isAffordable === args.isAffordable);
    if (args.isPromoted !== undefined) results = results.filter(r => r.isPromoted === args.isPromoted);
    
    // Sort logic: Promoted first, then by priority, then by date (inherent in results)
    return results.sort((a, b) => {
      // 1. Promoted first
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      
      // 2. High priority next
      const pA = a.priority || 0;
      const pB = b.priority || 0;
      if (pA !== pB) return pB - pA;
      
      
      // 3. Date (Renewed/Created)
      const dateA = a.createdAt || a._creationTime;
      const dateB = b.createdAt || b._creationTime;
      return dateB - dateA;
    });
  },
});

export const getById = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id("listings")) },
  handler: async (ctx, args) => {
    const results = await Promise.all(args.ids.map(id => ctx.db.get(id)));
    return results.filter(r => r !== null);
  },
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc") 
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    subCategory: v.optional(v.string()),
    city: v.string(),
    region: v.optional(v.string()),
    images: v.array(v.string()),
    thumbnail: v.optional(v.string()),
    userId: v.string(),
    specifications: v.optional(v.any()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    // New Fields
    userType: v.optional(v.string()),
    adType: v.optional(v.string()),
    condition: v.optional(v.string()),
    isTradePossible: v.optional(v.boolean()),
    hasShipping: v.optional(v.boolean()),
    isVatIncluded: v.optional(v.boolean()),
    isAffordable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("listings", {
      ...args,
      status: "ACTIVE",
      createdAt: Date.now(),
      viewCount: 0,
    });
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listings")
      .withSearchIndex("search_title", (q) => q.search("title", args.query))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("listings"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    subCategory: v.optional(v.string()),
    city: v.optional(v.string()),
    region: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    thumbnail: v.optional(v.string()),
    status: v.optional(v.string()),
    specifications: v.optional(v.any()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    // New Fields
    userType: v.optional(v.string()),
    adType: v.optional(v.string()),
    condition: v.optional(v.string()),
    isTradePossible: v.optional(v.boolean()),
    hasShipping: v.optional(v.boolean()),
    isVatIncluded: v.optional(v.boolean()),
    isAffordable: v.optional(v.boolean()),
    
    // System Fields
    createdAt: v.optional(v.number()),
    isPromoted: v.optional(v.boolean()),
    promotionTier: v.optional(v.string()),
    promotionExpiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
