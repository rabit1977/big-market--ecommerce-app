import { mutation } from "./_generated/server";

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const listings = await ctx.db.query("listings").collect();
    for (const l of listings) {
      await ctx.db.delete(l._id);
    }
    
    // Clear favorites too
    const favorites = await ctx.db.query("favorites").collect();
    for (const f of favorites) {
      await ctx.db.delete(f._id);
    }

    return { success: true, message: `Cleared ${listings.length} listings and ${favorites.length} favorites` };
  },
});

export const clearFavorites = mutation({
  args: {},
  handler: async (ctx) => {
    const favorites = await ctx.db.query("favorites").collect();
    for (const f of favorites) {
      await ctx.db.delete(f._id);
    }
    return { success: true, message: `Cleared ${favorites.length} favorites` };
  },
});
