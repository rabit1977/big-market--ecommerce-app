import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByExternalId = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first(); // Changed from .unique() to handle duplicates gracefully
  },
});

export const createWithPassword = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists to prevent duplicates
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User with this email already exists");
    }

    return await ctx.db.insert("users", {
        externalId: "pending", 
        email: args.email,
        password: args.password,
        name: args.name,
        role: args.role || "USER",
        bio: args.bio,
        createdAt: Date.now(),
    });
  },
});

export const syncUser = mutation({
  args: {
    externalId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email || existing.email,
        name: args.name || existing.name,
        image: args.image || existing.image,
        role: args.role || existing.role,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("users", {
        externalId: args.externalId,
        email: args.email,
        name: args.name,
        image: args.image,
        role: args.role || "USER",
      });
    }
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    bio: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateByExternalId = mutation({
  args: {
    externalId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    bio: v.optional(v.string()),
    image: v.optional(v.string()),
    phone: v.optional(v.string()),
    gender: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    marketingEmails: v.optional(v.boolean()),
    orderEmails: v.optional(v.boolean()),
    reviewEmails: v.optional(v.boolean()),
    city: v.optional(v.string()), // Added city
  },
  handler: async (ctx, args) => {
    const { externalId, ...data } = args;
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", externalId))
      .unique();
    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, data);
    return user._id;
  },
});

export const requestVerification = mutation({
  args: {
    externalId: v.string(),
    idDocument: v.optional(v.string()),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();
    
    if (!user) throw new Error("User not found");
    
    // In a real app, this would set status to "PENDING". 
    // For demo, we auto-verify.
    await ctx.db.patch(user._id, {
        isVerified: true,
        idDocument: args.idDocument,
        phone: args.phone,
    });
    return user._id;
  },
});

export const addCredits = mutation({
  args: {
    externalId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();
    
    if (!user) throw new Error("User not found");
    
    const currentCredits = user.credits || 0;
    await ctx.db.patch(user._id, {
        credits: currentCredits + args.amount,
    });
    return user.credits;
  },
});

export const changePassword = mutation({
  args: {
    externalId: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId)) // Corrected index name
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { password: args.newPassword });
  },
});

export const deleteAccount = mutation({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId)) // Corrected index name
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.delete(user._id);
    
    // Also delete listings? 
    // For now, let's keep it simple or user might want to keep content.
    // Ideally we cascade delete.
  },
});
