
import { query } from "./_generated/server";

export const checkListings = query({
  args: {},
  handler: async (ctx) => {
    // 1. Without Order
    const noOrder = await ctx.db
        .query("listings")
        .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
        .collect();

    // 2. With Desc Order
    const withDesc = await ctx.db
        .query("listings")
        .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
        .order("desc")
        .collect();

    return {
      noOrderCount: noOrder.length,
      withDescCount: withDesc.length,
      sample: noOrder.length > 0 ? noOrder[0].title : "None"
    };
  },
});
