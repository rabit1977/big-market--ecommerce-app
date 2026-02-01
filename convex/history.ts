
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Record a view for a listing
export const recordVisit = mutation({
  args: {
    listingId: v.id("listings"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { listingId, userId } = args;

    // Check if we already have a record for this user and listing
    const existing = await ctx.db
      .query("recentlyViewed")
      .withIndex("by_user_listing", (q) => 
        q.eq("userId", userId).eq("listingId", listingId)
      )
      .first();

    const timestamp = Date.now();

    if (existing) {
      // Update the timestamp to now
      await ctx.db.patch(existing._id, {
        viewedAt: timestamp,
      });
    } else {
      // Create new record
      await ctx.db.insert("recentlyViewed", {
        listingId,
        userId,
        viewedAt: timestamp,
      });
    }
  },
});

// Get recently viewed listings for a user
export const getMyHistory = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    // Get recent views, ordered by time desc
    const history = await ctx.db
      .query("recentlyViewed")
      .withIndex("by_user_time", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);

    // Fetch the actual listings
    const listings = await Promise.all(
      history.map(async (item) => {
        const listing = await ctx.db.get(item.listingId);
        if (!listing) return null;
        
        // Fetch the seller (user) info
        // Note: listing.userId links to the externalId of the user.
        // We need to find the user where externalId == listing.userId
        const seller = await ctx.db
            .query("users")
            .withIndex("by_externalId", (q) => q.eq("externalId", listing.userId))
            .first();

        // Return listing with user info for the card
        return {
           ...listing,
           viewedAt: item.viewedAt,
           user: seller // Attach seller info
        };
      })
    );

    // Filter out nulls (deleted listings)
    return listings.filter((l) => l !== null);
  },
});
