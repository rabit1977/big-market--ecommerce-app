import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

export const save = mutation({
  args: {
    userId: v.string(),     // externalId
    query: v.string(),
    url: v.string(),
    name: v.optional(v.string()),
    filters: v.optional(v.any()), // JSON string or object
    isEmailAlert: v.optional(v.boolean()),
    frequency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Verify user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .unique();

    if (!user) throw new Error("User not found");

    // 2. Prevent duplicate identical searches
    const existing = await ctx.db
       .query("savedSearches")
       .withIndex("by_user", (q) => q.eq("userId", user.externalId))
       .collect();

    if (existing.some(s => s.url === args.url)) {
        return { success: true, message: "Search is already saved." };
    }

    // 3. Save Search
    const newId = await ctx.db.insert("savedSearches", {
       userId: user.externalId, // force externalId
       query: args.query,
       url: args.url,
       name: args.name,
       filters: args.filters,
       isEmailAlert: args.isEmailAlert,
       frequency: args.frequency,
    });

    return { success: true, id: newId };
  }
});

export const remove = mutation({
  args: { id: v.id("savedSearches"), userId: v.string() },
  handler: async (ctx, args) => {
    const saved = await ctx.db.get(args.id);
    if (!saved) return { success: false, message: "Not found" };

    if (saved.userId !== args.userId) {
        // Fallback check against internal _id just in case
        const user = await ctx.db.get(args.userId as any) as any;
        if (!user || saved.userId !== user.externalId) {
             throw new Error("Unauthorized to delete this saved search");
        }
    }

    await ctx.db.delete(args.id);
    return { success: true };
  }
});

export const toggleAlerts = mutation({
   args: { id: v.id("savedSearches"), userId: v.string(), isEmailAlert: v.boolean() },
   handler: async (ctx, args) => {
      const saved = await ctx.db.get(args.id);
      if (!saved) throw new Error("Not found");
      
      if (saved.userId !== args.userId) {
          throw new Error("Unauthorized");
      }

      await ctx.db.patch(args.id, { isEmailAlert: args.isEmailAlert });
      return { success: true };
   }
});

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // 1. Verify 
    let user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .unique();

    if (!user) {
        try {
            const potentialUser = await ctx.db.get(args.userId as any) as any;
            if (potentialUser && 'externalId' in potentialUser) {
               user = potentialUser;
            }
        } catch(e) {}
    }

    if (!user) return [];

    const searches = await ctx.db
       .query("savedSearches")
       .withIndex("by_user", (q) => q.eq("userId", user.externalId))
       .collect();

    // Map backward compatability if the user record ID was used 
    const fallbackSearches = await ctx.db
       .query("savedSearches")
       .withIndex("by_user", (q) => q.eq("userId", user._id as string))
       .collect();

    return [...searches, ...fallbackSearches];
  }
});

export const checkIsSaved = query({
  args: { userId: v.string(), url: v.string() },
  handler: async (ctx, args) => {
     const searches = await ctx.db
       .query("savedSearches")
       .withIndex("by_user", (q) => q.eq("userId", args.userId))
       .collect();
       
     const match = searches.find(s => s.url === args.url);
     return { isSaved: !!match, id: match?._id };
  }
});

// --- Scheduled Alerts Logic ---

// Internal query to fetch all active alerts
export const getActiveAlerts = query({
  handler: async (ctx) => {
    return await ctx.db
       .query("savedSearches")
       .filter(q => q.eq(q.field("isEmailAlert"), true))
       .collect();
  }
});


import { api } from "./_generated/api";

export const processDailyAlerts = action({
  handler: async (ctx) => {
    // 1. Fetch all active alerts
    const alerts = await ctx.runQuery(api.savedSearches.getActiveAlerts);
    if (!alerts.length) return;

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    // Group alerts by user to send one combined email if needed
    const alertsByUser = alerts.reduce((acc: Record<string, typeof alerts>, alert) => {
        if (!acc[alert.userId]) acc[alert.userId] = [];
        acc[alert.userId].push(alert);
        return acc;
    }, {});

    for (const [userId, userAlerts] of Object.entries(alertsByUser)) {
       const userMatches: { searchName: string; count: number; url: string }[] = [];

       for (const alert of userAlerts) {
           const filters = alert.filters || {};
           
           // Call the actual list query to apply precise filtering
           try {
               const listings = await ctx.runQuery(api.listings.list, {
                  category: filters.category !== 'all' ? filters.category : undefined,
                  subCategory: filters.subCategory,
                  city: filters.city !== 'all' ? filters.city : undefined,
                  minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
                  maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
                  condition: filters.condition !== 'all' ? filters.condition : undefined,
                  status: 'ACTIVE',
               });

               // Only count those created in the last 24h
               // (Since the query sorts by newest, we can just filter the returned slice)
               const newMatches = listings.filter((l: any) => l.createdAt > oneDayAgo);

               // In-memory text search if required
               const finalMatches = filters.search 
                  ? newMatches.filter((l: any) => l.title.toLowerCase().includes((filters.search as string).toLowerCase()))
                  : newMatches;

               if (finalMatches.length > 0) {
                   userMatches.push({
                      searchName: alert.name || "Custom Search",
                      count: finalMatches.length,
                      url: alert.url,
                   });
               }
           } catch (err) {
               console.error(`Failed to process alert ${alert._id}`, err);
           }
       }

       if (userMatches.length > 0) {
           // Queue an email to the user (implemented via Resend action)
           // For now, just generate a notification record so the user sees it in their dashboard
           await ctx.runMutation(api.notifications.create, {
               userId,
               type: 'SYSTEM',
               title: 'New Matches for Your Saved Searches',
               message: `We found new listings matching your saved searches: ${userMatches.map(m => m.searchName).join(', ')}.`,
               link: '/my-listings' // Or a dedicated alerts page
           });
       }
    }
  }
});
