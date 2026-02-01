import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const log = mutation({
  args: {
    userId: v.string(),
    action: v.string(),
    details: v.optional(v.string()),
    targetId: v.optional(v.string()),
    targetType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activityLogs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("activityLogs")
      .order("desc")
      .take(args.limit || 50);

    // In a real app, we'd join with users here. 
    // For Convex, we'll fetch them separately or return user ID for client-side resolution if needed.
    // However, server actions can handle the mapping.
    return logs;
  },
});
