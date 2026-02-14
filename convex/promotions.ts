import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const applyPromotion = mutation({
  args: {
    listingId: v.id("listings"),
    tier: v.string(), // e.g., 'PREMIUM', 'TOP_POSITION', 'HIGHLIGHT', 'REFRESH'
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new Error("Listing not found");

    // Apply specific logic based on tier
    // Default duration is 14 days
    const DURATION_DAYS = 14;
    const expiresAt = Date.now() + (DURATION_DAYS * 24 * 60 * 60 * 1000);

    // Determine new status: 
    // If it was PENDING_APPROVAL, keep it pending (admin must still approve).
    // If it was REJECTED, maybe move to PENDING_APPROVAL for re-review? For now, let's keep it safe.
    // Otherwise (ACTIVE or undefined), set to ACTIVE.
    const newStatus = listing.status === 'PENDING_APPROVAL' ? 'PENDING_APPROVAL' : 'ACTIVE';

    const updates: any = { 
        isPromoted: true, 
        promotionTier: args.tier,
        promotionExpiresAt: expiresAt,
        status: newStatus 
    };
    
    // For refresh or top tiers, we bump the date to keep it at top
    if (args.tier === 'DAILY_BUMP' || 
        args.tier === 'ELITE_PRIORITY' || 
        args.tier === 'TOP_POSITIONING' || 
        args.tier === 'AUTO_DAILY_REFRESH') {
        updates.createdAt = Date.now();
    }

    await ctx.db.patch(args.listingId, updates);
  },
});

export const runDailyRefreshes = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    // Find all promoted listings that have a refresh tier and haven't expired
    const listingsToRefresh = await ctx.db
      .query("listings")
      .withIndex("by_promoted", (q) => q.eq("isPromoted", true))
      .filter((q) => 
        q.and(
          q.or(
            q.eq(q.field("promotionTier"), "AUTO_DAILY_REFRESH"),
            q.eq(q.field("promotionTier"), "DAILY_BUMP")
          ),
          q.gt(q.field("promotionExpiresAt"), now)
        )
      )
      .collect();

    console.log(`Bumping ${listingsToRefresh.length} listings for daily refresh...`);

    for (const listing of listingsToRefresh) {
      await ctx.db.patch(listing._id, {
        createdAt: now
      });
    }

    return { count: listingsToRefresh.length };
  },
});

export const checkExpiringPromotions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const tomorrow = now + 24 * 60 * 60 * 1000;
    const dayAfterTomorrow = tomorrow + 24 * 60 * 60 * 1000;

    // Find promoted listings expiring between 24 and 48 hours from now
    const expiringListings = await ctx.db
      .query("listings")
      .withIndex("by_promoted", (q) => q.eq("isPromoted", true))
      .filter((q) => 
        q.and(
          q.gt(q.field("promotionExpiresAt"), tomorrow),
          q.lt(q.field("promotionExpiresAt"), dayAfterTomorrow)
        )
      )
      .collect();

    console.log(`Sending expiry notifications for ${expiringListings.length} listings...`);

    for (const listing of expiringListings) {
      await ctx.db.insert("notifications", {
        userId: listing.userId,
        type: "PROMOTION_EXPIRING",
        title: "Promotion Ending Soon",
        message: `Your promotion for "${listing.title}" expires in 24 hours. Renew now to keep your position!`,
        link: `/listings/${listing._id}`,
        isRead: false,
        createdAt: now,
      });
    }

    return { count: expiringListings.length };
  },
});
