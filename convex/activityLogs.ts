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

    // Join with users
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const user = await ctx.db
          .query('users')
          .withIndex('by_externalId', (q) => q.eq('externalId', log.userId as string))
          .first();

        // Fallback to internal ID if external ID is not found, just in case
        let resolvedUser: any = user;
        if (!resolvedUser) {
           resolvedUser = await ctx.db.get(log.userId as any);
        }

        return {
          ...log,
          user: {
            name: resolvedUser?.name || 'Unknown User',
            email: resolvedUser?.email || '',
            image: resolvedUser?.image || null,
          },
        };
      })
    );

    return enrichedLogs;
  },
});
