import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTransactions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const topUp = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Create transaction record
    await ctx.db.insert("transactions", {
      userId: args.userId,
      amount: args.amount,
      type: "TOPUP",
      description: args.description || "Balance top-up",
      status: "COMPLETED",
      createdAt: Date.now(),
    });

    // 2. Update user credits
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      credits: (user.credits || 0) + args.amount,
    });

    return true;
  },
});

export const spend = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .unique();

    if (!user) throw new Error("User not found");
    if ((user.credits || 0) < args.amount) {
        throw new Error("Insufficient credits");
    }

    // 1. Create transaction record
    await ctx.db.insert("transactions", {
      userId: args.userId,
      amount: -args.amount,
      type: "SPEND",
      description: args.description,
      status: "COMPLETED",
      createdAt: Date.now(),
    });

    // 2. Update user credits
    await ctx.db.patch(user._id, {
      credits: (user.credits || 0) - args.amount,
    });

    return true;
  },
});
