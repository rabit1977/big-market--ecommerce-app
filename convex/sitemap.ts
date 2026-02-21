import { query } from "./_generated/server";

export const getNodes = query({
  args: {},
  handler: async (ctx) => {
    // 1. Fetch latest 5000 ACTIVE listings
    const listings = await ctx.db
       .query("listings")
       .withIndex("by_status", q => q.eq("status", "ACTIVE"))
       .order("desc")
       .take(5000);

    // 2. We can also index some storefronts (users who are verified or have active types)
    // For simplicity we just return listings for now, storefronts can be extracted from listing userIds
    const storeIds = new Set<string>();
    listings.forEach(l => {
       if (l.userId) storeIds.add(l.userId);
    });

    return {
        listings: listings.map(l => ({ _id: l._id, createdAt: l.createdAt })),
        storeFronts: Array.from(storeIds)
    };
  }
});
