import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getRequest = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("verificationRequests")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
  },
});

export const submit = mutation({
  args: {
    userId: v.string(),
    idDocument: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("verificationRequests")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "PENDING"))
      .first();

    if (existing) {
      throw new Error("You already have a pending verification request");
    }

    return await ctx.db.insert("verificationRequests", {
      userId: args.userId,
      idDocument: args.idDocument,
      status: "PENDING",
      createdAt: Date.now(),
    });
  },
});

export const listAll = query({
    args: { status: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (args.status) {
            return await ctx.db
                .query("verificationRequests")
                .withIndex("by_status", (q) => q.eq("status", args.status as any))
                .collect();
        }
        return await ctx.db.query("verificationRequests").collect();
    }
});

export const process = mutation({
    args: {
        id: v.id("verificationRequests"),
        status: v.string(), // APPROVED, REJECTED
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const req = await ctx.db.get(args.id);
        if (!req) throw new Error("Request not found");

        await ctx.db.patch(args.id, {
            status: args.status,
            notes: args.notes,
            processedAt: Date.now(),
        });

        if (args.status === "APPROVED") {
            // Update user status
            const user = await ctx.db
                .query("users")
                .withIndex("by_externalId", (q) => q.eq("externalId", req.userId))
                .unique();
            if (user) {
                await ctx.db.patch(user._id, { isVerified: true });
            }
        }
    }
});
