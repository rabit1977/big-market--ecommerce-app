import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const usersCount = (await ctx.db.query("users").collect()).length;
    const activeListingsCount = (await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
      .collect()).length;
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

    // Calculate Total Revenue (Gross)
    const allTransactions = await ctx.db
      .query("transactions")
      .collect();
    
    const totalRevenue = allTransactions
      .filter(t => t.status === "COMPLETED")
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    return {
      users: usersCount,
      activeListings: activeListingsCount,
      listings: listingsCount,
      promotedListings: promotedListings.length,
      pendingVerifications: verificationRequestsCount,
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
  },
  handler: async (ctx, args) => {
    let listings;
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
            .collect();
    } else {
        const statusFilter = args.status || "ACTIVE";
        if (statusFilter === "ALL") {
            listings = await ctx.db
                .query("listings")
                .withIndex("by_createdAt")
                .order("desc")
                .collect();
        } else {
            listings = await ctx.db
                .query("listings")
                .withIndex("by_status", (q) => q.eq("status", statusFilter))
                .order("desc")
                .collect();
        }
    }

    const detailedListings = await Promise.all(
      listings.map(async (listing) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", listing.userId))
          .unique();
        
        return {
          ...listing,
          creatorName: user?.name || user?.email || "Unknown",
          creatorPhone: user?.phone || "No Phone",
        };
      })
    );

    return detailedListings;
  },
});
