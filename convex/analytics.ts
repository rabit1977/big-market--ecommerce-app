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
    return await ctx.db.insert("analytics", {
      ...args,
      createdAt: Date.now(),
    });
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
