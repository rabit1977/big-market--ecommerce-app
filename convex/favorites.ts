import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getPopulated = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const listings = await Promise.all(
      favorites.map(async (fav) => {
        const listing = await ctx.db.get(fav.listingId);
        if (!listing) return null;
        
        // Fetch seller details
        let user = null;
        if (listing.userId) {
             // listing.userId is External ID or Convex ID? 
             // Schema says 'userId' is v.string(). If it's convex ID:
             // user = await ctx.db.get(listing.userId as any);
             // If it's external ID (Auth0/NextAuth), we need query.
             // But usually in listings table we store user _id?
             // Checking schema... "userId: v.string()". It's likely ExternalId.
             // We need to query user by external ID.
             user = await ctx.db
                .query("users")
                .withIndex("by_externalId", (q) => q.eq("externalId", listing.userId))
                .unique();
        }

        return { ...listing, user, favoritedAt: fav._creationTime };
      })
    );

    return listings.filter(Boolean);
  },
});

export const toggle = mutation({
  args: { userId: v.string(), listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_listing", (q) =>
        q.eq("userId", args.userId).eq("listingId", args.listingId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // isWished: false
    } else {
      await ctx.db.insert("favorites", {
        userId: args.userId,
        listingId: args.listingId,
      });

      // Notify the listing owner
      const listing = await ctx.db.get(args.listingId);
      if (listing && listing.userId !== args.userId) {
          // Get the favoriting user's details for the notification
          const favoritingUser = await ctx.db
            .query("users")
            .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
            .first();

          const userName = favoritingUser?.name || "Someone";

          await ctx.db.insert("notifications", {
              userId: listing.userId,
              type: "FAVORITE",
              title: "New Favorite",
              message: `${userName} favorited your listing "${listing.title}"`,
              link: `/listings/${listing._id}`,
              isRead: false,
              createdAt: Date.now(),
              metadata: {
                  listingId: listing._id,
                  favoritedBy: args.userId,
                  image: listing.thumbnail || listing.images[0]
              }
          });
      }

      return true; // isWished: true
    }
  },
});

export const clear = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const fav of favorites) {
      await ctx.db.delete(fav._id);
    }
  },
});
