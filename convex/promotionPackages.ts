import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Queries ───────────────────────────────────────────────────────────────

/** Get all active promotion packages, sorted by position */
export const getActivePackages = query({
  handler: async (ctx) => {
    const packages = await ctx.db
      .query("promotionPackages")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();

    return packages.sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
  },
});

/** Get a single package by slug */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("promotionPackages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/** Get all packages (admin) */
export const getAllPackages = query({
  handler: async (ctx) => {
    const packages = await ctx.db.query("promotionPackages").collect();
    return packages.sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
  },
});

// ─── Mutations ─────────────────────────────────────────────────────────────

/** Create a new promotion package (admin only) */
export const createPackage = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    currency: v.string(),
    durationDays: v.number(),
    tier: v.string(),
    features: v.array(v.string()),
    isActive: v.boolean(),
    position: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Ensure slug is unique
    const existing = await ctx.db
      .query("promotionPackages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) throw new Error(`Package with slug "${args.slug}" already exists`);

    return await ctx.db.insert("promotionPackages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/** Update a promotion package (admin only) */
export const updatePackage = mutation({
  args: {
    id: v.id("promotionPackages"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    durationDays: v.optional(v.number()),
    tier: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    position: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const pkg = await ctx.db.get(id);
    if (!pkg) throw new Error("Package not found");

    await ctx.db.patch(id, updates);
    return id;
  },
});

/** Toggle active status of a package (admin only) */
export const toggleActive = mutation({
  args: { id: v.id("promotionPackages") },
  handler: async (ctx, args) => {
    const pkg = await ctx.db.get(args.id);
    if (!pkg) throw new Error("Package not found");
    await ctx.db.patch(args.id, { isActive: !pkg.isActive });
  },
});
