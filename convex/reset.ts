import { mutation } from "./_generated/server";

export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
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

    for (const table of tables) {
      const records = await ctx.db.query(table as any).collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
      console.log(`Cleared table: ${table}`);
    }

    // Reset listings counter
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", "listings"))
      .unique();
    if (counter) {
      await ctx.db.patch(counter._id, {
        nextId: 0,
        reusableIds: [],
      });
      console.log("Reset listings counter");
    }

    return { success: true };
  },
});
