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

// Admin: Get full user details including listings and transactions
export const getAdminUserDetails = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) return null;

    // Get user's listings
    const listings = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", user.externalId))
      .collect();

    // Get user's transactions
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user.externalId))
      .collect();

    return {
      ...user,
      listings,
      transactions,
    };
  },
});

// ============================================================
// COMPREHENSIVE USER DASHBOARD STATS (Real-time)
// ============================================================
export const getUserDashboardStats = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    // 1. Get User
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();
    if (!user) return null;

    const userId = args.externalId;
    const now = Date.now();

    // Time boundaries
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

    // 2. Listings
    const listings = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const activeListings = listings.filter((l) => l.status === "ACTIVE");
    const pendingListings = listings.filter((l) => l.status === "PENDING_APPROVAL");
    const promotedListings = listings.filter(
      (l) => l.isPromoted && l.promotionExpiresAt && l.promotionExpiresAt > now
    );
    const totalViews = listings.reduce((sum, l) => sum + (l.viewCount || 0), 0);

    // 3. Transactions (with time-bucketed spending)
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const completedTransactions = transactions.filter(
      (t) => t.status === "COMPLETED"
    );

    const spentDaily = completedTransactions
      .filter((t) => t.createdAt >= oneDayAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    const spentWeekly = completedTransactions
      .filter((t) => t.createdAt >= oneWeekAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    const spentMonthly = completedTransactions
      .filter((t) => t.createdAt >= oneMonthAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    const spentYearly = completedTransactions
      .filter((t) => t.createdAt >= oneYearAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    const spentAllTime = completedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // 4. Favorites
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // 5. Conversations / Messages
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", userId))
      .collect();
    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", userId))
      .collect();
    const unreadMessages = receivedMessages.filter((m) => !m.read);

    // Unique conversations (unique listing+other-party combos)
    const conversationSet = new Set<string>();
    [...sentMessages, ...receivedMessages].forEach((m) => {
      const other = m.senderId === userId ? m.receiverId : m.senderId;
      conversationSet.add(`${m.listingId}:${other}`);
    });

    // 6. Renewal Stats
    const currentMonth = new Date(now).getMonth();
    let monthlyRenewalsUsed = user.monthlyRenewalsUsed ?? 0;
    if (user.lastRenewalMonth !== currentMonth) {
      monthlyRenewalsUsed = 0;
    }

    let canRenewNow = true;
    let hoursUntilRenew = 0;
    if (user.lastRenewalTimestamp) {
      const hoursSince =
        (now - user.lastRenewalTimestamp) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        canRenewNow = false;
        hoursUntilRenew = Math.ceil(24 - hoursSince);
      }
    }

    // 7. Promotion Stats
    const promotionTransactions = completedTransactions.filter(
      (t) => t.description && t.description.toLowerCase().includes("promot")
    );
    const promotionSpentMonthly = promotionTransactions
      .filter((t) => t.createdAt >= oneMonthAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    const promotionSpentAllTime = promotionTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // 8. Recent transactions (last 10)
    const recentTransactions = [...completedTransactions]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    return {
      // Profile
      profile: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        city: user.city,
        accountType: user.accountType,
        companyName: user.companyName,
        createdAt: user.createdAt || user._creationTime,
        bio: user.bio,
      },
      // Verification & membership
      verification: {
        isVerified: user.isVerified ?? false,
        verificationStatus: user.verificationStatus ?? "unverified",
        accountStatus: user.accountStatus ?? "ACTIVE",
        membershipTier: user.membershipTier ?? "FREE",
        membershipStatus: user.membershipStatus ?? "EXPIRED",
        membershipExpiresAt: user.membershipExpiresAt,
      },
      // Listings overview
      listings: {
        total: listings.length,
        active: activeListings.length,
        pending: pendingListings.length,
        promoted: promotedListings.length,
        totalViews,
        limit: user.listingLimit ?? 50,
        posted: user.listingsPostedCount ?? 0,
        promotedDetails: promotedListings.map((l) => ({
          _id: l._id,
          title: l.title,
          promotionTier: l.promotionTier,
          promotionExpiresAt: l.promotionExpiresAt,
          daysLeft: l.promotionExpiresAt
            ? Math.max(0, Math.ceil((l.promotionExpiresAt - now) / (1000 * 60 * 60 * 24)))
            : 0,
        })),
      },
      // Spending breakdowns
      spending: {
        daily: spentDaily,
        weekly: spentWeekly,
        monthly: spentMonthly,
        yearly: spentYearly,
        allTime: spentAllTime,
        promotionMonthly: promotionSpentMonthly,
        promotionAllTime: promotionSpentAllTime,
      },
      // Renewals
      renewals: {
        usedThisMonth: monthlyRenewalsUsed,
        limitMonthly: 15,
        remainingMonthly: 15 - monthlyRenewalsUsed,
        canRenewNow,
        hoursUntilRenew,
        lastRenewalAt: user.lastRenewalTimestamp,
      },
      // Social
      social: {
        favoritesCount: favorites.length,
        conversationsCount: conversationSet.size,
        totalMessagesSent: sentMessages.length,
        totalMessagesReceived: receivedMessages.length,
        unreadMessages: unreadMessages.length,
      },
      // Recent transactions
      recentTransactions,
    };
  },
});
