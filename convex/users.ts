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
        createdAt: Date.now(),
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
    resetToken: v.optional(v.string()),
    resetTokenExpiry: v.optional(v.number()),
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
    
    // Extended fields
    banner: v.optional(v.string()),
    accountType: v.optional(v.string()),
    companyName: v.optional(v.string()),
    municipality: v.optional(v.string()),
    address: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    hasWhatsapp: v.optional(v.boolean()),
    hasViber: v.optional(v.boolean()),
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

export const getMyDashboardStats = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
     const user = await ctx.db
       .query("users")
       .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
       .unique();
       
     if (!user) return null;
     
     // 1. Listings Stats
     const listings = await ctx.db
        .query("listings")
        .withIndex("by_userId", (q) => q.eq("userId", args.externalId))
        .collect();
        
     const activeListings = listings.filter(l => l.status === 'ACTIVE').length;
     const totalViews = listings.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
     
     // 2. Spend Today
     const now = new Date();
     const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
     
     const transactions = await ctx.db
        .query("transactions")
        .withIndex("by_user", (q) => q.eq("userId", args.externalId))
        .filter(q => q.gte(q.field("createdAt"), startOfDay))
        .collect();
        
     const spendToday = transactions
        .filter(t => t.type === 'SPEND' || t.type === 'PROMOTE')
        .reduce((acc, curr) => acc + curr.amount, 0);
          
     return {
         user: {
             name: user.name,
             image: user.image,
             credits: user.credits || 0,
             isVerified: user.isVerified || false,
             membershipTier: user.membershipTier || 'FREE',
             membershipStatus: user.membershipStatus || 'INACTIVE',
             membershipExpiresAt: user.membershipExpiresAt,
             companyName: user.companyName,
             accountType: user.accountType
         },
         stats: {
             activeListings,
             totalViews,
             spendToday,
             renewedToday: 0 // Placeholder
         }
     };
  }
});

export const upgradeMembership = mutation({
  args: {
    externalId: v.string(),
    plan: v.string(),
    duration: v.string(), // 'monthly' | 'yearly'
    price: v.number(),    // Added price argument
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();

    if (!user) throw new Error("User not found");

    const now = new Date();
    let expiresAt = new Date();
    if (args.duration === 'yearly') {
        expiresAt.setFullYear(now.getFullYear() + 1);
    } else {
        expiresAt.setMonth(now.getMonth() + 1);
    }

    // Record Transaction
    await ctx.db.insert("transactions", {
        userId: args.externalId,
        amount: args.price,
        type: "SUBSCRIPTION",
        description: `${args.plan} Membership (${args.duration})`,
        status: "COMPLETED",
        createdAt: now.getTime(),
    });

    await ctx.db.patch(user._id, {
        membershipStatus: 'ACTIVE',
        membershipTier: args.plan,
        membershipExpiresAt: expiresAt.getTime(),
        isVerified: true, // Auto-verify on subscription as per user request
    });

    return { success: true, expiresAt: expiresAt.getTime() };
  },
});

export const cancelMembership = mutation({
  args: {
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
        membershipStatus: 'INACTIVE',
        membershipExpiresAt: undefined, // Or keep expiration but set status to canceling? User asked to unsubscribe "from earlier", implies immediate removal or reset. Let's reset for now to "unverify" them.
        isVerified: false,
        membershipTier: 'FREE' 
    });

    return { success: true };
  },
});

// Migration: Add createdAt to existing users who don't have it
export const backfillCreatedAt = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let updated = 0;
    
    for (const user of users) {
      if (!user.createdAt) {
        await ctx.db.patch(user._id, {
          createdAt: Date.now(), // Use current time as fallback
        });
        updated++;
      }
    }
    
    return { message: `Updated ${updated} users with createdAt field` };
  },
});
