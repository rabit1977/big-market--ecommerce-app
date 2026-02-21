import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { recordTransactionInternal } from "./transactions";

export const getByExternalId = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    // 1. Primary lookup by externalId
    const userByExternalId = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();

    if (userByExternalId) return userByExternalId;

    // 2. Fallback: Check if the provided ID is actually a Convex ID
    // This happens for users created via email/password where the session ID might be the _id
    try {
      // Basic check to see if it's a valid ID format before trying to fetch
      const potentialUser = await ctx.db.get(args.externalId as any) as any;
      if (potentialUser && 'externalId' in potentialUser) {
          return potentialUser;
      }
      return null;
    } catch (e) {
      return null;
    }
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

export const getByResetToken = query({
  args: { resetToken: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_resetToken", (q) => q.eq("resetToken", args.resetToken))
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

/**
 * makeAdmin — Use this from the Convex dashboard to promote a user to ADMIN.
 * Run once to fix any user whose role was accidentally reset to USER.
 * Example: { "email": "your@email.com" }
 */
export const makeAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    if (users.length === 0) throw new Error(`No user found with email: ${args.email}`);

    for (const user of users) {
        await ctx.db.patch(user._id, { role: "ADMIN" });
    }
    
    return { 
        success: true, 
        count: users.length, 
        names: users.map(u => u.name).join(", ") 
    };
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

    const fallbackName = args.email ? args.email.split('@')[0].charAt(0).toUpperCase() + args.email.split('@')[0].slice(1) : 'User';
    const finalName = args.name || fallbackName;

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email || existing.email,
        name: args.name || existing.name || fallbackName,
        image: args.image || existing.image,
        // IMPORTANT: never overwrite role here — Convex DB is the source of truth.
        // OAuth logins (Google/GitHub) don't carry a role and would reset ADMIN → USER.
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
        const oldExternalId = existingByEmail.externalId;
        
        await ctx.db.patch(existingByEmail._id, {
          externalId: args.externalId,
          name: args.name || existingByEmail.name || fallbackName,
          image: args.image || existingByEmail.image,
          role: existingByEmail.role,
        });

        // Migrate listings if they were associated with old ID or internal ID
        const listingsToMigrate = await ctx.db
          .query("listings")
          .collect(); // We have to filter manually if we don't have multiple indices
        
        const userInternalId = existingByEmail._id as string;
        
        for (const listing of listingsToMigrate) {
           if (listing.userId === oldExternalId || listing.userId === userInternalId || listing.userId === "pending") {
              await ctx.db.patch(listing._id, { userId: args.externalId });
           }
        }

        // Migrate favorites
        const favoritesToMigrate = await ctx.db.query("favorites").collect();
        for (const fav of favoritesToMigrate) {
            if (fav.userId === oldExternalId || fav.userId === userInternalId) {
                await ctx.db.patch(fav._id, { userId: args.externalId });
            }
        }

        return existingByEmail._id;
      }
    }

    // Check if this is the first user ever
    const allUsers = await ctx.db.query("users").take(1);
    const isFirstUser = allUsers.length === 0;
    const finalRole = args.role || (isFirstUser ? "ADMIN" : "USER");

    return await ctx.db.insert("users", {
      externalId: args.externalId,
      email: args.email,
      name: finalName,
      image: args.image,
      role: finalRole,
      createdAt: Date.now(),
      accountStatus: finalRole === "ADMIN" ? "ACTIVE" : "PENDING_APPROVAL",
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
    hashedPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { password: args.hashedPassword });
    return { success: true };
  },
});

export const resetPassword = mutation({
  args: {
    resetToken: v.string(),
    hashedPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_resetToken", (q) => q.eq("resetToken", args.resetToken))
      .unique();

    if (!user) throw new Error("Invalid or expired reset token");
    if (user.resetTokenExpiry && user.resetTokenExpiry < Date.now()) {
      throw new Error("Invalid or expired reset token");
    }

    await ctx.db.patch(user._id, {
      password: args.hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });
    return { success: true };
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

    const externalId = args.externalId;

    // 1. Delete all listings
    const listings = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of listings) await ctx.db.delete(item._id);

    // 2. Delete favorites
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of favorites) await ctx.db.delete(item._id);

    // 3. Delete saved searches
    const savedSearches = await ctx.db
      .query("savedSearches")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of savedSearches) await ctx.db.delete(item._id);

    // 4. Delete Messages (Sender & Receiver)
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", externalId))
      .collect();
    for (const item of sentMessages) await ctx.db.delete(item._id);

    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", externalId))
      .collect();
    for (const item of receivedMessages) await ctx.db.delete(item._id);

    // 5. Delete Conversations (Buyer & Seller)
    const buyerConvs = await ctx.db
      .query("conversations")
      .withIndex("by_buyer", (q) => q.eq("buyerId", externalId))
      .collect();
    for (const item of buyerConvs) await ctx.db.delete(item._id);

    const sellerConvs = await ctx.db
      .query("conversations")
      .withIndex("by_seller", (q) => q.eq("sellerId", externalId))
      .collect();
    for (const item of sellerConvs) await ctx.db.delete(item._id);

    // 6. Delete Notifications
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of notifications) await ctx.db.delete(item._id);

    // 7. Delete Activity Logs
    const logs = await ctx.db
      .query("activityLogs")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of logs) await ctx.db.delete(item._id);

    // 8. Delete Questions & Answers
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of questions) await ctx.db.delete(item._id);

    const answers = await ctx.db
      .query("answers")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of answers) await ctx.db.delete(item._id);

    // 9. Delete Reviews
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of reviews) await ctx.db.delete(item._id);

    // 10. Delete Transactions
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of transactions) await ctx.db.delete(item._id);

    // 11. Delete Verification Requests
    const vRequests = await ctx.db
      .query("verificationRequests")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of vRequests) await ctx.db.delete(item._id);

    // 12. Delete Recently Viewed
    const recentlyViewed = await ctx.db
      .query("recentlyViewed")
      .withIndex("by_user", (q) => q.eq("userId", externalId))
      .collect();
    for (const item of recentlyViewed) await ctx.db.delete(item._id);

    // 13. Delete Inquiries (as Seller)
    const inquiries = await ctx.db
      .query("listingInquiries")
      .withIndex("by_seller", (q) => q.eq("sellerId", externalId))
      .collect();
    for (const item of inquiries) await ctx.db.delete(item._id);

    // Finally, delete the individual user record
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
    // 1. Get User
    let user = (await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique()) as any;
    
    // Fallback: Check if the provided ID is an internal ID
    if (!user) {
        try {
            const potentialUser = await ctx.db.get(args.externalId as any) as any;
            if (potentialUser && 'externalId' in potentialUser) {
                user = potentialUser;
            }
        } catch (e) {
            // Not a valid ID
        }
    }
        
    if (!user) return null;

    const externalId = user.externalId;
    const internalId = user._id as string;
      
    // 2. Listings Stats
    const listingsByExternal = await ctx.db
       .query("listings")
       .withIndex("by_userId", (q) => q.eq("userId", externalId))
       .collect();
    
    const listingsByInternal = await ctx.db
       .query("listings")
       .withIndex("by_userId", (q) => q.eq("userId", internalId))
       .collect();

    const existingIds = new Set(listingsByExternal.map(l => l._id));
    const listings = [...listingsByExternal, ...listingsByInternal.filter(l => !existingIds.has(l._id))];
       
    const activeListings = listings.filter(l => l.status === 'ACTIVE').length;
    const totalViews = listings.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
      
    // 3. Spend Stats
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      
    const transactionsByExternal = await ctx.db
       .query("transactions")
       .withIndex("by_user", (q) => q.eq("userId", externalId))
       .collect();

    const transactionsByInternal = await ctx.db
       .query("transactions")
       .withIndex("by_user", (q) => q.eq("userId", internalId))
       .collect();
    
    const existingTIds = new Set(transactionsByExternal.map(t => t._id));
    const transactions = [...transactionsByExternal, ...transactionsByInternal.filter(t => !existingTIds.has(t._id))];
       
    const spendToday = transactions
       .filter(t => t.createdAt >= startOfDay && (
           t.type === 'SPEND' || 
           t.type === 'PROMOTE' || 
           t.type === 'PROMOTION' || 
           t.type === 'LISTING_PROMOTION' ||
           t.type === 'SUBSCRIPTION'
       ))
       .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const totalSpend = transactions
       .filter(t => 
           t.type === 'SPEND' || 
           t.type === 'PROMOTE' || 
           t.type === 'PROMOTION' || 
           t.type === 'LISTING_PROMOTION' || 
           t.type === 'SUBSCRIPTION'
       )
       .reduce((acc, curr) => acc + (curr.amount || 0), 0);
          
    return {
        user: {
            name: user.name,
            email: user.email,
            image: user.image,
            credits: user.credits || 0,
            isVerified: user.isVerified || false,
            membershipTier: (user as any)["membershipTier"] || 'FREE',
            membershipStatus: user.membershipStatus || 'INACTIVE',
            membershipExpiresAt: user.membershipExpiresAt,
            companyName: user.companyName,
            accountType: user.accountType,
            accountStatus: user.accountStatus,
            createdAt: user.createdAt || user._creationTime,
            // Quotas
            listingLimit: user.listingLimit || 50,
            listingsPostedCount: user.listingsPostedCount || 0,
            monthlyRenewalsUsed: user.monthlyRenewalsUsed || 0,
            canRefreshListings: user.canRefreshListings,
        },
        stats: {
            activeListings,
            totalViews,
            spendToday,
            totalSpend,
            renewedToday: user.monthlyRenewalsUsed || 0
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
    stripeId: v.optional(v.string()),
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

    // Record Transaction using the idempotent helper function
    await recordTransactionInternal(ctx, {
        userId: args.externalId,
        amount: args.price,
        type: "SUBSCRIPTION",
        description: `${args.plan} Membership (${args.duration})`,
        status: "COMPLETED",
        stripeId: args.stripeId,
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

    // Get user's listings (Robust Dual-ID Lookup)
    const listingsByExt = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", user.externalId))
      .collect();
    
    const listingsByInt = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id as string))
      .collect();

    // Deduplicate listings
    const existingListingIds = new Set(listingsByExt.map(l => l._id));
    const listings = [
        ...listingsByExt,
        ...listingsByInt.filter(l => !existingListingIds.has(l._id))
    ];

    // Get user's transactions (Robust Dual-ID Lookup)
    const txByExt = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user.externalId))
      .collect();

    const txByInt = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id as string))
      .collect();

    // Deduplicate transactions
    const existingTxIds = new Set(txByExt.map(t => t._id));
    const transactions = [
        ...txByExt,
        ...txByInt.filter(t => !existingTxIds.has(t._id))
    ];

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Security Check: Allow if user is accessing their own dashboard OR if they are an admin
    if (args.externalId !== identity.subject) {
      const requester = await ctx.db
        .query("users")
        .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
        .unique();
      
      if (!requester || requester.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
    }

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
    const listingsByExternal = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    
    const listingsByInternal = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id as string))
      .collect();

    const existingIdSet = new Set(listingsByExternal.map(l => l._id));
    const listings = [...listingsByExternal, ...listingsByInternal.filter(l => !existingIdSet.has(l._id))];

    const activeListings = listings.filter((l) => l.status === "ACTIVE");
    const pendingListings = listings.filter((l) => l.status === "PENDING_APPROVAL");
    const promotedListings = listings.filter(
      (l) => l.isPromoted && l.promotionExpiresAt && l.promotionExpiresAt > now
    );
    const totalViews = listings.reduce((sum, l) => sum + (l.viewCount || 0), 0);

    // 3. Transactions (with time-bucketed spending)
    const transactionsByExternal = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const transactionsByInternal = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id as string))
      .collect();
    
    const existingTIdSet = new Set(transactionsByExternal.map(t => t._id));
    const transactions = [...transactionsByExternal, ...transactionsByInternal.filter(t => !existingTIdSet.has(t._id))];

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

    // 9. Saved Searches
    const savedSearches = await ctx.db
      .query("savedSearches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // 10. Recently Viewed (last 8 with listing details)
    const recentlyViewedRaw = await ctx.db
      .query("recentlyViewed")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const recentlyViewedSorted = [...recentlyViewedRaw]
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .slice(0, 8);
    const recentlyViewedPopulated = await Promise.all(
      recentlyViewedSorted.map(async (rv) => {
        const listing = await ctx.db.get(rv.listingId);
        if (!listing) return null;
        return {
          _id: rv._id,
          listingId: rv.listingId,
          viewedAt: rv.viewedAt,
          title: listing.title,
          price: listing.price,
          thumbnail: listing.thumbnail || listing.images?.[0],
          status: listing.status,
        };
      })
    );

    // 11. Favorites with populated listing details (last 6)
    const recentFavorites = [...favorites].slice(0, 6);
    const favoritesPopulated = await Promise.all(
      recentFavorites.map(async (fav) => {
        const listing = await ctx.db.get(fav.listingId);
        if (!listing) return null;
        return {
          _id: fav._id,
          listingId: fav.listingId,
          title: listing.title,
          price: listing.price,
          thumbnail: listing.thumbnail || listing.images?.[0],
          city: listing.city,
          status: listing.status,
        };
      })
    );

    // 12. Notifications
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const recentNotifications = [...notifications]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((n) => ({
        _id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        link: n.link,
        createdAt: n.createdAt,
      }));

    // 13. Reviews written by this user
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // 14. Q&A Activity
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

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
        membershipTier: (user as any)["membershipTier"] ?? "FREE",
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
      // Recent transactions
      recentTransactions: recentTransactions.map((t) => ({
        _id: t._id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        status: t.status,
        createdAt: t.createdAt,
      })),

      // Social Stats
      social: {
        favoritesCount: favorites.length,
        conversationsCount: conversationSet.size,
        unreadMessages: unreadMessages.length,
        totalMessagesSent: sentMessages.length,
        totalMessagesReceived: receivedMessages.length,
      },

      // Saved Searches
      savedSearches: {
        count: savedSearches.length,
        items: savedSearches.map((s) => ({
          _id: s._id,
          name: s.name,
          query: s.query,
          filters: s.filters,
          isEmailAlert: s.isEmailAlert,
          url: s.url || `/listings?q=${encodeURIComponent(s.query || '')}`,
          createdAt: s._creationTime,
        })),
      },

      // Recently Viewed
      recentlyViewed: {
        totalViewed: recentlyViewedRaw.length,
        items: recentlyViewedPopulated.filter((r): r is NonNullable<typeof r> => r !== null),
      },

      // Notifications
      notifications: {
        total: notifications.length,
        unread: unreadNotifications.length,
        recent: recentNotifications,
      },

      // Activity
      activity: {
        reviewsWritten: reviews.length,
        questionsAsked: questions.length,
        averageRatingGiven: reviews.length > 0 
          ? (reviews.reduce((acc, r: any) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) 
          : 0,
      },

      // Renewals
      renewals: {
        usedThisMonth: monthlyRenewalsUsed,
        limitMonthly: (user as any).renewalLimit || 5, 
        canRenewNow,
        hoursUntilRenew,
        lastRenewalAt: user.lastRenewalTimestamp,
      },

      // Favorites Details
      favoritesDetails: favoritesPopulated.filter((f): f is NonNullable<typeof f> => f !== null),
    };
  },
});

export const getPublicProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    let user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) {
        // Fallback: lookup by internal _id
        try {
            const potentialUser = await ctx.db.get(args.userId as any) as any;
            if (potentialUser && 'externalId' in potentialUser) {
                user = potentialUser;
            }
        } catch (e) {
            return null;
        }
    }

    if (!user) return null;

    const externalId = user.externalId;
    const internalId = user._id as string;

    // Use take() instead of collect() to avoid full table scans that can
    // exceed Convex's 1s query time limit on larger datasets.
    const listingsByExternal = await ctx.db
      .query("listings")
      .withIndex("by_userId_status", (q) => q.eq("userId", externalId).eq("status", "ACTIVE"))
      .take(500);

    const listingsByInternal = await ctx.db
      .query("listings")
      .withIndex("by_userId_status", (q) => q.eq("userId", internalId).eq("status", "ACTIVE"))
      .take(500);

    // Merge and deduplicate
    const existingIds = new Set(listingsByExternal.map(l => l._id));
    const activeListings = [...listingsByExternal, ...listingsByInternal.filter(l => !existingIds.has(l._id))];

    return {
      _id: user._id,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt || user._creationTime,
      bio: user.bio,
      city: user.city,
      isVerified: user.isVerified,
      activeListingsCount: activeListings.length,
    };
  },
});
