import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Record a new transaction (Internal use or from Stripe webhook)
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
    // Check for duplicate if stripeId is provided
    if (args.stripeId) {
        const existing = await ctx.db
            .query("transactions")
            .withIndex("by_stripeId", (q) => q.eq("stripeId", args.stripeId!))
            .first();
        
        if (existing) {
            // Update the existing transaction if needed (e.g. to fix timestamp)
            // For now, we'll just skip or we could patch it. 
            // Let's patch it to be safe if the user re-syncs without clearing.
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
  args: {},
  handler: async (ctx) => {
    // Determine start of today
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Filter transactions for TODAY only
    const transactions = await ctx.db
        .query("transactions")
        .filter(q => q.gte(q.field("createdAt"), startOfDay))
        .collect();

    // Initialize aggregators
    let totalRevenue = 0; // This will now represent "Revenue Today"
    
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
        if (t.status !== 'COMPLETED') continue;

        totalRevenue += t.amount;

        if (t.type === 'SUBSCRIPTION') {
            verificationRevenue += t.amount;
        } else if (t.type === 'PROMOTION' || t.type === 'LISTING_PROMOTION') {
            promotionRevenue += t.amount;
            
            // Description format from sync: "Listing Promotion: TIER_NAME" or just "TIER_NAME"
            const desc = t.description.toUpperCase().replace(/_/g, ' '); // Normalize underscores to spaces for easier matching
            
            if (desc.includes('TOP POSITIONING')) {
                revenueByTier['TOP_POSITIONING'] += t.amount;
            } else if (desc.includes('PREMIUM SECTOR') || desc.includes('ELITE PRIORITY')) {
                revenueByTier['PREMIUM_SECTOR'] += t.amount;
            } else if (desc.includes('LISTING HIGHLIGHT')) {
                revenueByTier['LISTING_HIGHLIGHT'] += t.amount;
            } else if (desc.includes('DAILY REFRESH') || desc.includes('AUTO DAILY REFRESH')) {
                revenueByTier['AUTO_DAILY_REFRESH'] += t.amount;
            } else {
                revenueByTier['OTHER'] += t.amount;
            }
        }
    }

    // VAT Calculation (18%)
    // Total = Net * 1.18  =>  Net = Total / 1.18
    const netRevenue = totalRevenue / 1.18;
    const vatRevenue = totalRevenue - netRevenue;

    // Get Recent Transactions (Today only)
    // We can just sort the filtered list since we already fetched it
    const recentTransactions = transactions.sort((a, b) => b.createdAt - a.createdAt);
        
    // Enhance recent transactions with user details
    const recentWithUser = await Promise.all(
        recentTransactions.map(async (t) => {
            const user = await ctx.db
                .query("users")
                .withIndex("by_externalId", q => q.eq("externalId", t.userId))
                .first();
            return {
                ...t,
                userName: user?.name || "Unknown User",
                userEmail: user?.email || t.metadata?.userEmail || ""
            };
        })
    );

    return {
        totalRevenue, // Gross Total (Inclusive of VAT)
        netRevenue,   // Net Total (Exclusive of VAT)
        vatRevenue,   // VAT Amount
        monthRevenue: totalRevenue, 
        verificationRevenue,
        promotionRevenue,
        revenueByTier,
        recentTransactions: recentWithUser
    };
  },
});
