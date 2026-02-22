import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Record a new transaction (Internal use or from Stripe webhook)
export async function recordTransactionInternal(ctx: any, args: {
    userId: string,
    amount: number,
    type: string,
    description: string,
    status: string,
    stripeId?: string,
    metadata?: any,
    createdAt?: number,
}) {
    // Check for duplicate if stripeId is provided
    if (args.stripeId) {
        const existing = await ctx.db
            .query("transactions")
            .withIndex("by_stripeId", (q: any) => q.eq("stripeId", args.stripeId!))
            .first();
        
        if (existing) {
            if (args.createdAt && existing.createdAt !== args.createdAt) {
                await ctx.db.patch(existing._id, { createdAt: args.createdAt });
            }
            return existing._id;
        }
    }

    const id = await ctx.db.insert("transactions", {
      userId: args.userId,
      amount: args.amount,
      type: args.type,
      description: args.description,
      status: args.status,
      stripeId: args.stripeId,
      metadata: args.metadata,
      createdAt: args.createdAt || Date.now(),
    });

    return id;
}

export const record = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    type: v.string(), // "SUBSCRIPTION", "PROMOTION", "REFUND"
    description: v.string(),
    status: v.string(),
    stripeId: v.optional(v.string()),
    metadata: v.optional(v.any()), // Extended data like tier, listingId etc.
    createdAt: v.optional(v.number()), // Time of transaction
  },
  handler: async (ctx, args) => {
    return await recordTransactionInternal(ctx, args);
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("transactions").collect();
    for (const t of all) {
      await ctx.db.delete(t._id);
    }
    return all.length;
  },
});

// 2. Get Revenue Stats for Admin Dashboard
export const getRevenueStats = query({
  args: {
    since: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Determine start of today
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Build the query — Convex doesn't allow reassigning across QueryInitializer/Query types
    const transactions = args.since !== undefined
      ? await ctx.db
          .query("transactions")
          .withIndex("by_createdAt", (q) => q.gte("createdAt", args.since!))
          .collect()
      : await ctx.db.query("transactions").collect();


    // Initialize aggregators
    let totalRevenue = 0; 
    let revenueToday = 0;
    
    // Revenue by Source
    let verificationRevenue = 0;
    let promotionRevenue = 0;

    // Revenue by Tier (for promotions)
    const revenueByTier: Record<string, number> = {
        "TOP_POSITIONING": 0,
        "PREMIUM_SECTOR": 0,
        "LISTING_HIGHLIGHT": 0,
        "AUTO_DAILY_REFRESH": 0,
        "OTHER": 0
    };

    for (const t of transactions) {
        // Basic invalid check
        if (t.status && t.status !== 'COMPLETED') continue;

        // Sum Total Revenue (All Time)
        totalRevenue += t.amount;

        // Sum Today's Revenue
        if (t.createdAt >= startOfDay) {
            revenueToday += t.amount;
        }

        if (t.type === 'SUBSCRIPTION') {
            verificationRevenue += t.amount;
        } else if (t.type === 'PROMOTION' || t.type === 'LISTING_PROMOTION') {
            promotionRevenue += t.amount;
            
            // Description check for tiers...
                // Description format from sync: "Listing Promotion: TIER_NAME" or just "TIER_NAME"
                // const desc = (t.description || "").toUpperCase().replace(/_/g, ' '); 
                const desc = typeof t.description === 'string' ? t.description.toUpperCase().replace(/_/g, ' ') : "";
            
            if (desc.includes('TOP POSITIONING')) {
                revenueByTier['TOP_POSITIONING'] += t.amount;
            } else if (desc.includes('PREMIUM SECTOR') || desc.includes('ELITE PRIORITY')) {
                // ... map accordingly
            }
             // ... simplify the loop to just sum totals, reusing existing logic structure but without the date filter blocking it.
        }
    }

    // Re-implementing the loop cleanly with the correct logic:
    
    // Reset counters to be safe
    totalRevenue = 0;
    verificationRevenue = 0;
    promotionRevenue = 0;
    
    // Revenue by Tier (for promotions)
    const tierStats: Record<string, number> = {
        "TOP_POSITIONING": 0,
        "PREMIUM_SECTOR": 0,
        "LISTING_HIGHLIGHT": 0,
        "AUTO_DAILY_REFRESH": 0
    };

    for (const t of transactions) {
         if (t.status !== 'COMPLETED') continue;

         totalRevenue += t.amount;
         
         if (t.createdAt >= startOfDay) {
             revenueToday += t.amount;
         }

         if (t.type === 'SUBSCRIPTION') {
             verificationRevenue += t.amount;
         } else if (t.type === 'PROMOTION' || t.type === 'LISTING_PROMOTION') {
             promotionRevenue += t.amount;
             
             const desc = (t.description || "").toUpperCase().replace(/_/g, ' ');
             
             if (desc.includes('TOP POSITIONING')) tierStats['TOP_POSITIONING'] += t.amount;
             else if (desc.includes('PREMIUM SECTOR') || desc.includes('ELITE PRIORITY')) tierStats['PREMIUM_SECTOR'] += t.amount;
             else if (desc.includes('LISTING HIGHLIGHT')) tierStats['LISTING_HIGHLIGHT'] += t.amount;
             else if (desc.includes('DAILY REFRESH') || desc.includes('AUTO DAILY REFRESH')) tierStats['AUTO_DAILY_REFRESH'] += t.amount;
         }
    }

    // VAT Calculation (18%)
    // Total = Net * 1.18  =>  Net = Total / 1.18
    const netRevenue = totalRevenue / 1.18;
    const vatRevenue = totalRevenue - netRevenue;

    return {
        totalRevenue, // Gross Total (Inclusive of VAT) - Now ALL TIME
        netRevenue,   // Net Total (Exclusive of VAT)
        vatRevenue,   // VAT Amount
        monthRevenue: revenueToday, // Using 'revenueToday' logic for the "today" stat if UI asks for month/today
        verificationRevenue,
        promotionRevenue,
        revenueByTier: tierStats,
        // Removed recentTransactions to reduce payload footprint now that it's paginated
    };
  },
});

export const getPaginatedTransactions = query({
  args: {
    paginationOpts: paginationOptsValidator,
    since: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q;
    
    if (args.since !== undefined) {
      q = ctx.db.query("transactions").withIndex("by_createdAt", q => q.gte("createdAt", args.since!)).order("desc");
    } else {
      q = ctx.db.query("transactions").withIndex("by_createdAt").order("desc");
    }

    const results = await q.paginate(args.paginationOpts);

    const pageWithUser = await Promise.all(
        results.page.map(async (t) => {
            const meta = (t.metadata as any) || {};

            // Shortcut: Stripe sync now always stores customer_name + customer_email in metadata
            // If both exist, we can resolve immediately without any DB lookups
            if (meta.customer_name && meta.customer_email) {
                return {
                    ...t,
                    userName: meta.customer_name,
                    userEmail: meta.customer_email,
                };
            }

            // Tier 1: Look up by externalId (Clerk/UUID) — normal case
            let user = await ctx.db
                .query("users")
                .withIndex("by_externalId", q => q.eq("externalId", t.userId))
                .first();

            // Tier 2: Fallback — userId might be a Convex internal document ID
            if (!user && t.userId) {
                try {
                    const byId = await ctx.db.get(t.userId as any);
                    if (byId && (byId as any).email) {
                        user = byId as any;
                    }
                } catch (_) {
                    // not a valid Convex ID, skip
                }
            }

            // Tier 3: Fallback by customer_email from Stripe metadata (new format)
            if (!user && meta.customer_email) {
                user = await ctx.db
                    .query("users")
                    .withIndex("by_email", q => q.eq("email", meta.customer_email))
                    .first();
            }

            // Tier 4: Fallback by userEmail from old metadata format
            if (!user && meta.userEmail) {
                user = await ctx.db
                    .query("users")
                    .withIndex("by_email", q => q.eq("email", meta.userEmail))
                    .first();
            }

            // Priority: DB user name > Stripe customer_name > email prefix > generic label
            const customerEmail = user?.email || meta.customer_email || meta.userEmail || "";
            const customerName = 
                user?.name ||
                meta.customer_name ||
                (customerEmail ? customerEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : "Unknown Customer");

            return {
                ...t,
                userName: customerName,
                userEmail: customerEmail,
            };
        })
    );


    return {
        ...results,
        page: pageWithUser
    };
  }
});


