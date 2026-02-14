import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const usersCount = (await ctx.db.query("users").collect()).length;
    const listingsCount = (await ctx.db.query("listings").collect()).length;
    const promotedListings = await ctx.db
      .query("listings")
      .withIndex("by_promoted", (q) => q.eq("isPromoted", true))
      .collect();
    const verificationRequestsCount = (await ctx.db
      .query("verificationRequests")
      .withIndex("by_status", (q) => q.eq("status", "PENDING"))
      .collect()).length;
    const contactSubmissionsCount = (await ctx.db
      .query("contactSubmissions")
      .withIndex("by_status", (q) => q.eq("status", "NEW"))
      .collect()).length;

    return {
      users: usersCount,
      listings: listingsCount,
      promotedListings: promotedListings.length,
      pendingVerifications: verificationRequestsCount,
      newInquiries: contactSubmissionsCount,
    };
  },
});

export const getDailyDeltas = query({
  args: {},
  handler: async (ctx) => {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      // Use filter instead of withIndex to handle cases where the index may not exist yet on production
      const allUsers = await ctx.db.query("users").collect();
      const newUsers = allUsers.filter(u => u.createdAt && u.createdAt > startOfToday);

      const allListings = await ctx.db.query("listings").collect();
      const newListings = allListings.filter(l => l.createdAt && l.createdAt > startOfToday);

      const allTransactions = await ctx.db.query("transactions").collect();
      const validTransactions = allTransactions.filter(t => 
          t.createdAt && t.createdAt > startOfToday &&
          t.type === "TOPUP" && t.status === "COMPLETED"
      );

      const revenueToday = validTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

      return {
        newUsers: newUsers.length,
        newListings: newListings.length,
        revenueToday,
        totalCount: newUsers.length + newListings.length + (revenueToday > 0 ? 1 : 0)
      };
    } catch (error) {
      console.error("getDailyDeltas error:", error);
      return {
        newUsers: 0,
        newListings: 0,
        revenueToday: 0,
        totalCount: 0
      };
    }
  },
});

export const getPromotedListings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("listings")
      .withIndex("by_promoted", (q) => q.eq("isPromoted", true))
      .collect();
  },
});
