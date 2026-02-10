
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

    await ctx.db.insert("contactSubmissions", {
      ...args,
      status: "NEW",
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    // In a real app, you would add admin check here
    return await ctx.db
      .query("contactSubmissions")
      .withIndex("by_status")
      .order("desc")
      .collect();
  },
});
