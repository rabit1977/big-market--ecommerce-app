import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Queries ───────────────────────────────────────────────────────────────

/** Get the active subscription for a user */
export const getActiveSubscription = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", args.userId).eq("status", "ACTIVE")
      )
      .first();
  },
});

/** Get full subscription history for a user */
export const getUserSubscriptions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/** Get subscription by Stripe subscription ID (for webhook processing) */
export const getByStripeId = query({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_stripeId", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();
  },
});

/** Admin: get all active subscriptions */
export const getAllActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_status", (q) => q.eq("status", "ACTIVE"))
      .collect();
  },
});

// ─── Mutations ─────────────────────────────────────────────────────────────

/** Create or update a subscription record (called from Stripe webhook) */
export const upsertSubscription = mutation({
  args: {
    userId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    tier: v.string(),
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // If we have a stripeSubscriptionId, look for existing record
    if (args.stripeSubscriptionId) {
      const existing = await ctx.db
        .query("subscriptions")
        .withIndex("by_stripeId", (q) =>
          q.eq("stripeSubscriptionId", args.stripeSubscriptionId!)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          status: args.status,
          tier: args.tier,
          currentPeriodStart: args.currentPeriodStart,
          currentPeriodEnd: args.currentPeriodEnd,
          cancelAtPeriodEnd: args.cancelAtPeriodEnd,
        });
        return existing._id;
      }
    }

    // Create new record
    return await ctx.db.insert("subscriptions", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/** Cancel a subscription (set status and cancelledAt) */
export const cancelSubscription = mutation({
  args: {
    stripeSubscriptionId: v.string(),
    cancelledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripeId", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();

    if (!subscription) throw new Error("Subscription not found");

    await ctx.db.patch(subscription._id, {
      status: "CANCELLED",
      cancelledAt: args.cancelledAt ?? Date.now(),
    });
  },
});
