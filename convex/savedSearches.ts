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


import { Resend } from "resend";
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
           // Queue a notification to the user dashboard
           await ctx.runMutation(api.notifications.create, {
               userId,
               type: 'SYSTEM',
               title: 'New Matches for Your Saved Searches',
               message: `We found new listings matching your saved searches: ${userMatches.map(m => m.searchName).join(', ')}.`,
               link: '/my-listings'
           });

           // Fetch User Email to send an actual Resend action
           try {
             const user = await ctx.runQuery(api.users.getByExternalId, { externalId: userId });
             
             const resendApiKey = process.env.RESEND_API_KEY;
             if (user && user.email && resendApiKey) {
                const resend = new Resend(resendApiKey);

                const htmlContent = `
                  <!DOCTYPE html>
                  <html>
                  <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: sans-serif;">
                      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e4e4e7;">
                          <div style="background-color: #18181b; padding: 20px; text-align: center;">
                              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Daily Search Alerts 🚗</h1>
                          </div>
                          <div style="padding: 30px;">
                              <p style="font-size: 16px; color: #3f3f46; margin-bottom: 20px;">Hi ${user.name || 'there'},</p>
                              <p style="font-size: 16px; color: #3f3f46; margin-bottom: 30px;">Great news! We found new listings in the last 24 hours that match your saved searches.</p>
                              
                              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                                  <ul style="list-style-type: none; padding: 0; margin: 0;">
                                      ${userMatches.map(match => `
                                          <li style="margin-bottom: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 15px;">
                                              <strong style="color: #0f172a; font-size: 16px; display: block; margin-bottom: 5px;">${match.searchName}</strong>
                                              <span style="color: #0ea5e9; font-weight: bold;">${match.count} new listings</span> found!
                                              <br />
                                              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${match.url}" style="display: inline-block; margin-top: 10px; color: #18181b; text-decoration: underline; font-weight: 500;">
                                                  View Listings →
                                              </a>
                                          </li>
                                      `).join('')}
                                  </ul>
                              </div>
                              
                              <center>
                                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/my-listings" 
                                     style="display: inline-block; padding: 14px 28px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                      Manage My Alerts
                                  </a>
                              </center>
                          </div>
                          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                              <p style="font-size: 12px; color: #64748b; margin: 0;">You are receiving this because you enabled Daily Alerts for your saved searches.</p>
                          </div>
                      </div>
                  </body>
                  </html>
                `;

                await resend.emails.send({
                    from: 'Marketplace Alerts <onboarding@resend.dev>',
                    to: user.email,
                    subject: `We found ${userMatches.reduce((acc, curr) => acc + curr.count, 0)} new listings for you!`,
                    html: htmlContent,
                });
                console.log(`Sent daily alert email to ${user.email}`);
             }
           } catch (error) {
              console.error("Failed to send alert email:", error);
           }
       }
    }
  }
});
