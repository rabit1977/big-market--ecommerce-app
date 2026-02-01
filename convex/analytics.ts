import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const trackEvent = mutation({
  args: {
    eventType: v.string(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
    page: v.optional(v.string()),
    referrer: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
