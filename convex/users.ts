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
      .first();
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
        accountStatus: "PENDING_APPROVAL",
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
    }

    // Fallback: Check by email
    if (args.email) {
      const existingByEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existingByEmail) {
        await ctx.db.patch(existingByEmail._id, {
          externalId: args.externalId,
          name: args.name || existingByEmail.name,
          image: args.image || existingByEmail.image,
          role: existingByEmail.role,
        });
        return existingByEmail._id;
      }
    }

    return await ctx.db.insert("users", {
      externalId: args.externalId,
      email: args.email,
      name: args.name,
      image: args.image,
      role: args.role || "USER",
      createdAt: Date.now(),
      accountStatus: "PENDING_APPROVAL",
    });
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
    isVerified: v.optional(v.boolean()),
    accountStatus: v.optional(v.string()),
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
    city: v.optional(v.string()),
    
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
      .first();
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
    
    await ctx.db.patch(user._id, {
        isVerified: false,
        verificationStatus: "pending_approval",
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
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
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
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();

    if (!user) throw new Error("User not found");

    // Delete all listings by this user
    const listings = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", args.externalId))
      .collect();

    for (const listing of listings) {
      await ctx.db.delete(listing._id);
    }

    await ctx.db.delete(user._id);
  },
});

export const completeRegistration = mutation({
  args: {
    externalId: v.string(),
    city: v.string(),
    municipality: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      city: args.city,
      municipality: args.municipality,
      phone: args.phone,
      registrationComplete: true,
      termsAcceptedAt: Date.now(),
    });

    return user._id;
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
     
     // 2. Spend Stats
     const now = new Date();
     const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
     
     const transactions = await ctx.db
        .query("transactions")
        .withIndex("by_user", (q) => q.eq("userId", args.externalId))
        .collect();
        
     const spendToday = transactions
        .filter(t => t.createdAt >= startOfDay && (
            t.type === 'SPEND' || 
            t.type === 'PROMOTE' || 
            t.type === 'PROMOTION' || 
            t.type === 'LISTING_PROMOTION' ||
            t.type === 'SUBSCRIPTION'
        ))
        .reduce((acc, curr) => acc + curr.amount, 0);

     const totalSpend = transactions
        .filter(t => 
            t.type === 'SPEND' || 
            t.type === 'PROMOTE' || 
            t.type === 'PROMOTION' || 
            t.type === 'LISTING_PROMOTION' || 
            t.type === 'SUBSCRIPTION'
        )
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
             accountType: user.accountType,
             accountStatus: user.accountStatus,
             // Quotas
             listingLimit: user.listingLimit || 50, // Default to 50 as per request
             listingsPostedCount: user.listingsPostedCount || 0,
             monthlyRenewalsUsed: user.monthlyRenewalsUsed || 0,
             canRefreshListings: user.canRefreshListings,
         },
         stats: {
             activeListings,
             totalViews,
             spendToday,
             totalSpend,
             renewedToday: user.monthlyRenewalsUsed || 0 // Using this as a proxy for "Renewals Used" generally
         }
     };
  }
});

export const upgradeMembership = mutation({
  args: {
    externalId: v.string(),
    plan: v.string(),
    duration: v.string(), // 'monthly' | 'yearly'
    price: v.number(),
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
        verificationStatus: "pending_approval", 
        isVerified: false, 
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
        membershipExpiresAt: undefined,
        isVerified: false,
        membershipTier: 'FREE' 
    });

    return { success: true };
  },
});

export const backfillCreatedAt = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let updated = 0;
    
    for (const user of users) {
      if (!user.createdAt) {
        await ctx.db.patch(user._id, {
          createdAt: Date.now(),
        });
        updated++;
      }
    }
    
    return { message: `Updated ${updated} users with createdAt field` };
  },
});

// Admin Mutations
export const approveUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      accountStatus: "ACTIVE",
    });
  },
});

export const rejectUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      accountStatus: "SUSPENDED",
    });
  },
});

export const approveVerification = mutation({
   args: { id: v.id("users") },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.id, {
          isVerified: true,
          verificationStatus: "verified",
      });
   }
});

export const backfillAccountStatus = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let updated = 0;
    for (const user of users) {
       if (!user.accountStatus) {
           await ctx.db.patch(user._id, { accountStatus: "ACTIVE" });
           updated++;
       }
    }
    return { message: `Backfilled ${updated} users to ACTIVE` };
  }
});
