import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackEvent = mutation({
  args: {
    eventType: v.string(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
    page: v.optional(v.string()),
    referrer: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // 1. Insert original event
    const eventId = await ctx.db.insert("analytics", {
      ...args,
      createdAt: Date.now(),
    });

    // 2. If it's a listing view, increment the listing's viewCount
    if (args.eventType === 'view_listing' && args.data && typeof args.data === 'object' && 'listingId' in args.data) {
        try {
            const listingId = args.data.listingId as any; 
            const listing = await ctx.db.get(listingId);
            if (listing && "viewCount" in listing) {
                await ctx.db.patch(listingId, {
                    viewCount: (Number(listing.viewCount) || 0) + 1
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
    const startTime = now - (days * 24 * 60 * 60 * 1000);

    const stats = await ctx.db
      .query("analytics")
      .withIndex("by_listing", (q) => q.eq("data.listingId", args.listingId))
      .filter((q) => q.gte(q.field("createdAt"), startTime))
      .collect();

    // Group by Date
    const dailyStats: Record<string, { date: string, views: number, clicks: number }> = {};
    
    // Initialize last 'days' with 0
    for(let i = 0; i < days; i++) {
        const d = new Date(now - (i * 24 * 60 * 60 * 1000));
        const dateKey = d.toISOString().split('T')[0];
        dailyStats[dateKey] = {
            date: dateKey,
            views: 0,
            clicks: 0
        };
    }

    // Aggregate real data
    stats.forEach(ev => {
        const dateKey = new Date(ev.createdAt).toISOString().split('T')[0];
        if(!dailyStats[dateKey]) {
            // Should be covered by init loop, but just in case
             dailyStats[dateKey] = { date: dateKey, views: 0, clicks: 0 };
        }
        
        if (ev.eventType === 'view_listing') {
            dailyStats[dateKey].views++;
        } else if (ev.eventType === 'click_contact' || ev.eventType === 'click_call') {
            dailyStats[dateKey].clicks++;
        }
    });

    return Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getUserStats = query({
  args: {
    userId: v.string(), // External User ID
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const now = Date.now();
    const startTime = now - (days * 24 * 60 * 60 * 1000);

    // 1. Get all user listings
    const listings = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    if (listings.length === 0) return [];

    const listingIds = listings.map((l) => l._id);

    // 2. Fetch analytics for these listings
    // Optimization: Depending on volume, we might need a more efficient way than iterating
    // but for now, we'll fetch events and filter in memory if needed or use Promise.all if we had a by_listing index call per listing
    // Since we have 'by_listing' index on analytics, we can do parallel queries
    
    const allEvents = await Promise.all(
        listingIds.map(async (id) => {
            return await ctx.db
                .query("analytics")
                .withIndex("by_listing", (q) => q.eq("data.listingId", id))
                .filter((q) => q.gte(q.field("createdAt"), startTime))
                .collect();
        })
    );

    // Flatten events
    const events = allEvents.flat();

    // 3. Group by Date
    const dailyStats: Record<string, { date: string, views: number, clicks: number }> = {};
    
    // Initialize last 'days' with 0 to show empty days
    for(let i = 0; i < days; i++) {
        const d = new Date(now - (i * 24 * 60 * 60 * 1000));
        const dateKey = d.toISOString().split('T')[0];
        dailyStats[dateKey] = {
            date: dateKey,
            views: 0,
            clicks: 0
        };
    }

    // 4. Aggregate real data
    events.forEach(ev => {
        const dateKey = new Date(ev.createdAt).toISOString().split('T')[0];
        
        // Ensure dateKey exists (might be slightly out of range due to time/date boundary)
        if (dailyStats[dateKey]) {
             if (ev.eventType === 'view_listing') {
                 dailyStats[dateKey].views++;
             } else if (ev.eventType === 'click_contact' || ev.eventType === 'click_call') {
                 dailyStats[dateKey].clicks++;
             }
        }
    });

    return Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));
  },
});
