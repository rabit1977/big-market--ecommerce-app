
import { mutation } from "./_generated/server";

export const removeOrphanedFavorites = mutation({
  args: {},
  handler: async (ctx) => {
    const favorites = await ctx.db.query("favorites").collect();
    let deletedCount = 0;

    for (const fav of favorites) {
      const listing = await ctx.db.get(fav.listingId);
      if (!listing) {
        await ctx.db.delete(fav._id);
        deletedCount++;
      }
    }

    return { success: true, deletedCount };
  },
});
