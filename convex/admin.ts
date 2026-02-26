/** Triggering fresh analysis for admin queries */
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    // Note: Convex doesn't have a direct count() yet, but we can iterate efficiently or use a counter if needed.
    // For now, we'll keep it but be aware of scan limits.
    const users = await ctx.db.query("users").collect();
    const activeListings = await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
      .collect();
    const totalListings = await ctx.db.query("listings").collect();
    const promotedListings = await ctx.db
      .query("listings")
      .withIndex("by_promoted", (q) => q.eq("isPromoted", true))
      .collect();
    
    const contactSubmissionsCount = (await ctx.db
      .query("contactSubmissions")
      .withIndex("by_status", (q) => q.eq("status", "NEW"))
      .collect()).length;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const todayTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_createdAt", (q) => q.gt("createdAt", startOfToday))
      .collect();
    
    const totalRevenue = todayTransactions
      .filter(t => t.status === "COMPLETED")
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    return {
      users: users.length,
      activeListings: activeListings.length,
      listings: totalListings.length,
      promotedListings: promotedListings.length,
      pendingVerifications: 0,
      newInquiries: contactSubmissionsCount,
      totalRevenue,
    };
  },
});

export const getDailyDeltas = query({
  args: {},
  handler: async (ctx) => {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      const newUsers = await ctx.db
        .query("users")
        .withIndex("by_createdAt", (q) => q.gt("createdAt", startOfToday))
        .collect();

      const newListings = await ctx.db
        .query("listings")
        .withIndex("by_createdAt", (q) => q.gt("createdAt", startOfToday))
        .collect();

      const validTransactions = await ctx.db
        .query("transactions")
        .withIndex("by_createdAt", (q) => q.gt("createdAt", startOfToday))
        .collect();
      
      const filteredTransactions = validTransactions.filter(t => 
          (t.type === "TOPUP" || t.type === "SUBSCRIPTION" || t.type === "PROMOTION" || t.type === "LISTING_PROMOTION") && 
          t.status === "COMPLETED"
      );

      const revenueToday = filteredTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

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

export const getListingsDetailed = query({
  args: {
    status: v.optional(v.string()),
    isPromoted: v.optional(v.boolean()),
    listingNumber: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let listings;
    const limit = args.limit || 100;

    if (args.listingNumber) {
        const exact = await ctx.db
            .query("listings")
            .withIndex("by_listingNumber", (q) => q.eq("listingNumber", args.listingNumber))
            .first();
        listings = exact ? [exact] : [];
    } else if (args.isPromoted) {
        listings = await ctx.db
            .query("listings")
            .withIndex("by_promoted", (q) => q.eq("isPromoted", true))
            .take(limit);
    } else {
        const statusFilter = args.status || "ACTIVE";
        if (statusFilter === "ALL") {
            listings = await ctx.db
                .query("listings")
                .withIndex("by_createdAt")
                .order("desc")
                .take(limit);
        } else {
            listings = await ctx.db
                .query("listings")
                .withIndex("by_status", (q) => q.eq("status", statusFilter))
                .order("desc")
                .take(limit);
        }
    }

    // Optimization: Collect unique user IDs and fetch them in parallel (more efficiently)
    const userIds = [...new Set(listings.map(l => l.userId))];
    const userEntries = await Promise.all(
      userIds.map(async (id) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", id))
          .unique();
        return [id, user];
      })
    );
    const userMap = new Map(userEntries as any);

    return listings.map((listing) => {
      const user: any = userMap.get(listing.userId);
      return {
        ...listing,
        creatorName: user?.name || user?.email || "Unknown",
        creatorPhone: user?.phone || "No Phone",
      };
    });
  },
});
