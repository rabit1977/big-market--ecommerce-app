import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation, mutation } from "./_generated/server";

const ALL_TABLES = [
  "users",
  "listings",
  "favorites",
  "savedSearches",
  "messages",
  "conversations",
  "analytics",
  "activityLogs",
  "questions",
  "answers",
  "notifications",
  "reviews",
  "transactions",
  "verificationRequests",
  "recentlyViewed",
  "contactSubmissions",
  "listingInquiries",
] as const;

export const clearTable = mutation({
  args: { table: v.string(), batchSize: v.number() },
  handler: async (ctx, args) => {
    const records = await ctx.db.query(args.table as any).take(args.batchSize);
    let count = 0;
    for (const record of records) {
      await ctx.db.delete(record._id);
      count++;
    }
    
    // Check if there are more
    const remaining = await ctx.db.query(args.table as any).first();
    
    return { table: args.table, deleted: count, hasMore: !!remaining };
  },
});

export const clearAllDataAction = action({
  args: {},
  handler: async (ctx) => {
    const results = [];
    for (const table of ALL_TABLES) {
        let hasMore = true;
        let totalDeleted = 0;
        while (hasMore) {
            try {
                const result = await ctx.runMutation(api.reset.clearTable, { table, batchSize: 100 }) as any;
                totalDeleted += result.deleted;
                hasMore = result.hasMore;
            } catch (e) {
                results.push({ table, error: String(e), deletedSoFar: totalDeleted });
                hasMore = false;
            }
        }
        results.push({ table, totalDeleted });
    }

    // Reset counters
    try {
        await ctx.runMutation(internal.reset.resetCounter);
    } catch (e) {
        results.push({ table: 'counters', error: String(e) });
    }

    return { success: true, results };
  },
});

export const resetCounter = internalMutation({
    args: {},
    handler: async (ctx) => {
        const counter = await ctx.db
            .query("counters")
            .withIndex("by_name", (q) => q.eq("name", "listings"))
            .unique();
        if (counter) {
            await ctx.db.patch(counter._id, {
                nextId: 0,
                reusableIds: [],
            });
        }
    }
});
