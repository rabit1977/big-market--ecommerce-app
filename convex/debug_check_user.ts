import { v } from "convex/values";
import { query } from "./_generated/server";

export const check = query({
  args: { externalId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.externalId) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId!))
        .unique();
      return { searchedFor: args.externalId, found: user };
    }
    
    // If no ID provided, list last 10 users to check structure
    const users = await ctx.db.query("users").order("desc").take(10);
    return { recentUsers: users };
  },
});
