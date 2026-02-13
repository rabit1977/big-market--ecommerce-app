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
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const newUsers = await ctx.db
      .query("users")
      .filter((q) => 
        q.and(
          q.neq(q.field("createdAt"), undefined),
          q.gt(q.field("createdAt"), startOfToday)
        )
      )
      .collect();

    const newListings = await ctx.db
      .query("listings")
      .filter((q) => 
        q.and(
          q.neq(q.field("createdAt"), undefined),
          q.gt(q.field("createdAt"), startOfToday)
        )
      )
      .collect();

    const todayTransactions = await ctx.db
      .query("transactions")
      .filter((q) => 
        q.and(
          q.neq(q.field("createdAt"), undefined),
          q.gt(q.field("createdAt"), startOfToday),
          q.eq(q.field("type"), "TOPUP"),
          q.eq(q.field("status"), "COMPLETED")
        )
      )
      .collect();

    const revenueToday = todayTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

    return {
      newUsers: newUsers.length,
      newListings: newListings.length,
      revenueToday,
      totalCount: newUsers.length + newListings.length + (revenueToday > 0 ? 1 : 0)
    };
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
