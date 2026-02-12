import { mutation } from "./_generated/server";

export const clearAllUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }
    return { deleted: users.length };
  },
});

export const cleanupOrphanedListings = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Get all current user external IDs
    const users = await ctx.db.query("users").collect();
    const validUserIds = new Set(users.map(u => u.externalId));
    
    // 2. Get all listings
    const listings = await ctx.db.query("listings").collect();
    
    let deletedCount = 0;
    
    // 3. Delete listings that don't have a valid owner
    for (const listing of listings) {
      if (!validUserIds.has(listing.userId)) {
        console.log(`Deleting orphan listing: ${listing._id} (User: ${listing.userId})`);
        await ctx.db.delete(listing._id);
        deletedCount++;
      }
    }
    
    return { 
      totalListings: listings.length,
      deletedOrphans: deletedCount 
    };
  },
});
