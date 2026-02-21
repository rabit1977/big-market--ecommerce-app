import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackEvent = mutation({
  args: {
    eventType: v.string(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
    listingId: v.optional(v.string()),  // Top-level for indexing
    page: v.optional(v.string()),
    referrer: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Resolve listingId — prefer explicit arg, fall back to data.listingId for backwards compat
    const listingId = args.listingId ?? (args.data && typeof args.data === 'object' && 'listingId' in args.data
      ? String(args.data.listingId)
      : undefined);

    const eventId = await ctx.db.insert("analytics", {
      eventType: args.eventType,
      sessionId: args.sessionId,
      userId: args.userId,
      listingId,
      page: args.page,
      referrer: args.referrer,
      data: args.data,
      createdAt: Date.now(),
    });

    // Increment listing viewCount on view events
    if (args.eventType === 'view_listing' && listingId) {
      try {
        const listing = await ctx.db.get(listingId as any);
        if (listing && "viewCount" in listing) {
          await ctx.db.patch(listingId as any, {
            viewCount: (Number(listing.viewCount) || 0) + 1,
          });
        }
      } catch (e) {
        console.error("Failed to update view count:", e);
      }
    }

    return eventId;
  },
});

export const getListingStats = query({
  args: {
    listingId: v.id("listings"),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const now = Date.now();
    const startTime = now - days * 24 * 60 * 60 * 1000;

    const stats = await ctx.db
      .query("analytics")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .filter((q) => q.gte(q.field("createdAt"), startTime))
      .collect();

    const dailyStats: Record<string, { date: string; views: number; clicks: number }> = {};

    for (let i = 0; i < days; i++) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split("T")[0];
      dailyStats[dateKey] = { date: dateKey, views: 0, clicks: 0 };
    }

    stats.forEach((ev) => {
      const dateKey = new Date(ev.createdAt).toISOString().split("T")[0];
      if (!dailyStats[dateKey]) dailyStats[dateKey] = { date: dateKey, views: 0, clicks: 0 };
      if (ev.eventType === "view_listing") dailyStats[dateKey].views++;
      else if (ev.eventType === "click_contact" || ev.eventType === "click_call") dailyStats[dateKey].clicks++;
    });

    return Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getUserStats = query({
  args: {
    userId: v.string(),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const now = Date.now();
    const startTime = now - days * 24 * 60 * 60 * 1000;

    const listings = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    if (listings.length === 0) return { dailyStats: [], totalFavorites: 0 };

    const listingIds = listings.map((l) => l._id);

    const allEvents = await Promise.all(
      listingIds.map((id) =>
        ctx.db
          .query("analytics")
          .withIndex("by_listing", (q) => q.eq("listingId", id))
          .filter((q) => q.gte(q.field("createdAt"), startTime))
          .collect()
      )
    );

    const events = allEvents.flat();

    const dailyStats: Record<string, { date: string; views: number; clicks: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split("T")[0];
      dailyStats[dateKey] = { date: dateKey, views: 0, clicks: 0 };
    }

    const favorites = await Promise.all(
      listingIds.map((id) =>
        ctx.db.query("favorites").withIndex("by_listing", (q) => q.eq("listingId", id)).collect()
      )
    );
    const totalFavorites = favorites.reduce((acc, favs) => acc + favs.length, 0);

    events.forEach((ev) => {
      const dateKey = new Date(ev.createdAt).toISOString().split("T")[0];
      if (dailyStats[dateKey]) {
        if (ev.eventType === "view_listing") dailyStats[dateKey].views++;
        else if (ev.eventType === "click_contact" || ev.eventType === "click_call") dailyStats[dateKey].clicks++;
      }
    });

    return {
      dailyStats: Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date)),
      totalFavorites,
    };
  },
});

export const getDetailedListingStats = query({
  args: {
    listingId: v.id("listings"),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const now = Date.now();
    const startTime = now - days * 24 * 60 * 60 * 1000;

    const events = await ctx.db
      .query("analytics")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .filter((q) => q.gte(q.field("createdAt"), startTime))
      .collect();

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .collect();

    const dailyStats: Record<string, { date: string; views: number; clicks: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split("T")[0];
      dailyStats[dateKey] = { date: dateKey, views: 0, clicks: 0 };
    }

    events.forEach((ev) => {
      const dateKey = new Date(ev.createdAt).toISOString().split("T")[0];
      if (dailyStats[dateKey]) {
        if (ev.eventType === "view_listing") dailyStats[dateKey].views++;
        else if (ev.eventType === "click_contact" || ev.eventType === "click_call") dailyStats[dateKey].clicks++;
      }
    });

    return {
      dailyStats: Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date)),
      totalFavorites: favorites.length,
      totalViews: events.filter((e) => e.eventType === "view_listing").length,
      totalClicks: events.filter((e) => e.eventType === "click_contact" || e.eventType === "click_call").length,
    };
  },
});
