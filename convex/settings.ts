import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("settings").first();
  },
});

export const update = mutation({
  args: {
    siteName: v.string(),
    siteEmail: v.optional(v.string()),
    sitePhone: v.optional(v.string()),
    currency: v.string(),
    currencySymbol: v.string(),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    termsOfService: v.optional(v.string()),
    privacyPolicy: v.optional(v.string()),
    footerText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("settings").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert("settings", {
        ...args,
        createdAt: Date.now(),
      });
    }
  },
});
