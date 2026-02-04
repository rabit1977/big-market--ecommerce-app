
import { mutation } from "./_generated/server";

export const clearSeedListings = mutation({
  args: {},
  handler: async (ctx) => {
    const seedListings = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", "user_seed_123"))
      .collect();

    for (const listing of seedListings) {
      await ctx.db.delete(listing._id);
    }

    return { count: seedListings.length };
  },
});
