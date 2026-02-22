import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { userId: v.string(), listName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("favorites").withIndex("by_user", (q) => q.eq("userId", args.userId));
    const allFavs = await q.collect();
    if (args.listName) {
      return allFavs.filter(f => f.listName === args.listName || (!f.listName && args.listName === 'Default'));
    }
    return allFavs;
  },
});

export const getPopulated = query({
  args: { userId: v.string(), listName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let allFavs = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (args.listName) {
      allFavs = allFavs.filter(f => f.listName === args.listName || (!f.listName && args.listName === 'Default'));
    }

    const favorites = allFavs;

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

        return { ...listing, user, favoritedAt: fav._creationTime, listName: fav.listName || 'Default' };
      })
    );

    return listings.filter(Boolean);
  },
});

export const toggle = mutation({
  args: { userId: v.string(), listingId: v.id("listings"), listName: v.optional(v.string()) },
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
        listName: args.listName,
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
  args: { userId: v.string(), listName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const fav of favorites) {
      if (!args.listName || fav.listName === args.listName || (!fav.listName && args.listName === 'Default')) {
         await ctx.db.delete(fav._id);
      }
    }
  },
});

export const getUserLists = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const lists = new Set<string>();
    favorites.forEach(f => {
       lists.add(f.listName || "Default");
    });

    return Array.from(lists);
  }
});

export const moveToList = mutation({
  args: { userId: v.string(), listingId: v.id("listings"), newListName: v.string() },
  handler: async (ctx, args) => {
     const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_listing", (q) =>
        q.eq("userId", args.userId).eq("listingId", args.listingId)
      )
      .unique();
     
     if (existing) {
        await ctx.db.patch(existing._id, { listName: args.newListName });
     } else {
        await ctx.db.insert("favorites", {
           userId: args.userId,
           listingId: args.listingId,
           listName: args.newListName
        });
     }
  }
});
