
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Basic validation
    if (!args.email.includes("@")) throw new Error("Invalid email address");
    if (args.message.length < 10) throw new Error("Message too short");

    // Anti-Spam / Rate Limiting: Max 3 messages per 24 hours per email
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentSubmissions = await ctx.db
      .query("contactSubmissions")
      .withIndex("by_createdAt", (q) => q.gt("createdAt", oneDayAgo))
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (recentSubmissions.length >= 3) {
      throw new Error("You have reached the limit of 3 contact messages per day. Please try again tomorrow.");
    }

    await ctx.db.insert("contactSubmissions", {
      ...args,
      status: "NEW",
      createdAt: Date.now(),
    });
  },
});

import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    // In a real app, you would add admin check here
    return await ctx.db
      .query("contactSubmissions")
      .withIndex("by_status", (q) => q.eq("status", "NEW"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getResolved = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contactSubmissions")
      .withIndex("by_status", (q) => q.eq("status", "RESOLVED"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const resolve = mutation({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "RESOLVED" });
  },
});

export const remove = mutation({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
