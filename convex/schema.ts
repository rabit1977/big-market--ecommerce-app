import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── USERS ──────────────────────────────────────────────────────────────────
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.string()),           // 'USER' | 'ADMIN'
    city: v.optional(v.string()),
    externalId: v.string(),                 // Links to NextAuth ID
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    gender: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),

    // Extended Profile
    banner: v.optional(v.string()),
    accountType: v.optional(v.string()),    // 'PERSON' | 'COMPANY'
    companyName: v.optional(v.string()),
    municipality: v.optional(v.string()),
    address: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    hasWhatsapp: v.optional(v.boolean()),
    hasViber: v.optional(v.boolean()),

    registrationComplete: v.optional(v.boolean()),
    termsAcceptedAt: v.optional(v.number()),

    // Email Preferences
    marketingEmails: v.optional(v.boolean()),
    orderEmails: v.optional(v.boolean()),
    reviewEmails: v.optional(v.boolean()),

    // Auth
    password: v.optional(v.string()),
    resetToken: v.optional(v.string()),
    resetTokenExpiry: v.optional(v.number()),
    createdAt: v.optional(v.number()),

    // Verification
    isVerified: v.optional(v.boolean()),
    verificationStatus: v.optional(v.string()), // "unverified" | "pending_payment" | "pending_approval" | "verified"
    idDocument: v.optional(v.string()),

    // Status
    accountStatus: v.optional(v.string()),  // 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'BANNED'

    // Subscription & Usage Limits
    membershipStatus: v.optional(v.string()),    // 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'INACTIVE'
    membershipTier: v.optional(v.string()),      // 'FREE' | 'BASIC' | 'PRO' | 'ELITE'
    membershipExpiresAt: v.optional(v.number()),
    listingLimit: v.optional(v.number()),        // Max active listings allowed
    listingsPostedCount: v.optional(v.number()), // Current usage counter
    canRefreshListings: v.optional(v.boolean()),

    // Renewal Quota
    monthlyRenewalsUsed: v.optional(v.number()),
    lastRenewalTimestamp: v.optional(v.number()),
    lastRenewalMonth: v.optional(v.number()),

    // Credits / Wallet
    credits: v.optional(v.number()),
  }).index("by_externalId", ["externalId"])
    .index("by_email", ["email"])
    .index("by_accountStatus", ["accountStatus"])
    .index("by_accountType", ["accountType"])
    .index("by_isVerified", ["isVerified"])
    .index("by_resetToken", ["resetToken"])
    .index("by_createdAt", ["createdAt"]),

  // ─── CATEGORIES ─────────────────────────────────────────────────────────────
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    parentId: v.optional(v.string()),
    position: v.optional(v.number()),
    googleId: v.optional(v.number()),
    fullPath: v.optional(v.string()),
    parentPath: v.optional(v.string()),
    template: v.optional(v.any()),          // JSON template for category-specific fields
    createdAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_parentId", ["parentId"])
    .index("by_isActive", ["isActive"]),

  // ─── LISTINGS ───────────────────────────────────────────────────────────────
  listings: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    subCategory: v.optional(v.string()),
    images: v.array(v.string()),
    thumbnail: v.optional(v.string()),
    city: v.string(),
    region: v.optional(v.string()),
    status: v.string(),                     // 'ACTIVE' | 'PENDING_APPROVAL' | 'REJECTED' | 'EXPIRED' | 'SOLD'
    userId: v.string(),                     // Links to externalId
    createdAt: v.number(),
    viewCount: v.optional(v.number()),
    specifications: v.optional(v.any()),    // Category-specific dynamic fields
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),

    // Classified-specific
    userType: v.optional(v.string()),       // 'PRIVATE' | 'COMPANY'
    adType: v.optional(v.string()),         // 'SALE' | 'BUYING'
    condition: v.optional(v.string()),      // 'NEW' | 'USED'
    isTradePossible: v.optional(v.union(v.string(), v.boolean())),
    hasShipping: v.optional(v.boolean()),
    isVatIncluded: v.optional(v.boolean()),
    isAffordable: v.optional(v.boolean()),

    // Promotion
    isPromoted: v.optional(v.boolean()),
    promotionTier: v.optional(v.string()),  // 'GOLD' | 'SILVER' | 'BASIC'
    promotionExpiresAt: v.optional(v.number()),
    promotionPackageId: v.optional(v.string()), // References promotionPackages._id

    // Pricing
    previousPrice: v.optional(v.number()),
    currency: v.optional(v.string()),       // 'EUR' | 'MKD'

    // Metadata
    listingNumber: v.optional(v.number()),  // Sequential display ID
    clientNonce: v.optional(v.string()),    // Idempotency key
  }).index("by_listingNumber", ["listingNumber"])
    .index("by_category", ["category"])
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_status_category", ["status", "category"])
    .index("by_status_subCategory", ["status", "subCategory"])
    .index("by_status_city", ["status", "city"])       // ← Location browsing
    .index("by_promoted", ["isPromoted"])
    .index("by_promotionTier", ["promotionTier"])      // ← Featured tier filtering
    .index("by_adType", ["adType"])                    // ← Buy vs Sell filter
    .index("by_createdAt", ["createdAt"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_clientNonce", ["userId", "clientNonce"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["status", "category"],
    }),

  // ─── FAVORITES (WISHLISTS) ──────────────────────────────────────────────────
  favorites: defineTable({
    userId: v.string(),
    listingId: v.id("listings"),
    listName: v.optional(v.string()), // e.g. "Cars", "Apartments" (Optional for backwards compatibility)
  }).index("by_user", ["userId"])
    .index("by_listing", ["listingId"])
    .index("by_user_listing", ["userId", "listingId"])
    .index("by_user_listName", ["userId", "listName"]),

  // ─── SAVED SEARCHES ─────────────────────────────────────────────────────────
  savedSearches: defineTable({
    userId: v.string(),
    query: v.string(),
    url: v.string(),
    name: v.optional(v.string()),
    filters: v.optional(v.any()),           // Native object — not JSON string
    isEmailAlert: v.optional(v.boolean()),
    frequency: v.optional(v.string()),      // 'daily' | 'weekly'
  }).index("by_user", ["userId"]),

  // ─── MESSAGES ───────────────────────────────────────────────────────────────
  messages: defineTable({
    content: v.string(),
    listingId: v.optional(v.id("listings")),
    senderId: v.string(),
    receiverId: v.string(),
    read: v.boolean(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_listing", ["listingId"])
    .index("by_receiver", ["receiverId"])
    .index("by_sender", ["senderId"])
    .index("by_conversation", ["senderId", "receiverId", "listingId"]),

  // ─── REAL-TIME PRESENCE & TYPING ──────────────────────────────────────────────
  presence: defineTable({
    userId: v.string(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  typingIndicators: defineTable({
    conversationId: v.string(), // We use string because virtual conversations might not have an ID yet, or we can use listingId/support
    userId: v.string(),
    updatedAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  // ─── CONVERSATIONS ──────────────────────────────────────────────────────────
  conversations: defineTable({
    type: v.optional(v.string()),           // 'LISTING' | 'SUPPORT'
    listingId: v.optional(v.id("listings")),
    buyerId: v.string(),
    sellerId: v.string(),
    lastMessageAt: v.number(),
    lastMessage: v.optional(v.string()),
    buyerUnreadCount: v.optional(v.number()),
    sellerUnreadCount: v.optional(v.number()),
    participantIds: v.optional(v.array(v.string())),
  }).index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"])
    .index("by_listing", ["listingId"])
    .index("by_type", ["type"])
    .index("by_buyer_lastMessage", ["buyerId", "lastMessageAt"])     // ← Inbox sorted by newest
    .index("by_participants", ["buyerId", "sellerId", "listingId"]),

  // ─── ANALYTICS ──────────────────────────────────────────────────────────────
  analytics: defineTable({
    eventType: v.string(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
    listingId: v.optional(v.string()),      // Top-level for indexing (Convex can't index nested fields)
    page: v.optional(v.string()),
    referrer: v.optional(v.string()),
    data: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_type", ["eventType"])
    .index("by_session", ["sessionId"])
    .index("by_listing", ["listingId"]),

  // ─── ACTIVITY LOGS ──────────────────────────────────────────────────────────
  activityLogs: defineTable({
    userId: v.string(),
    action: v.string(),
    details: v.optional(v.string()),
    targetId: v.optional(v.string()),
    targetType: v.optional(v.string()),     // 'listing' | 'user' | 'category'
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_createdAt", ["userId", "createdAt"]),            // ← Sorted audit log

  // ─── SETTINGS ───────────────────────────────────────────────────────────────
  settings: defineTable({
    siteName: v.string(),
    siteEmail: v.optional(v.string()),
    sitePhone: v.optional(v.string()),
    currency: v.string(),
    currencySymbol: v.string(),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    termsOfService: v.optional(v.string()),
    privacyPolicy: v.optional(v.string()),
    footerText: v.optional(v.string()),
    createdAt: v.number(),
  }),

  // ─── Q&A ─────────────────────────────────────────────────────────────────
  questions: defineTable({
    listingId: v.id("listings"),
    userId: v.string(),
    question: v.string(),
    isPublic: v.boolean(),
    helpfulCount: v.number(),
    createdAt: v.number(),
  }).index("by_listing", ["listingId"])
    .index("by_user", ["userId"]),

  answers: defineTable({
    questionId: v.id("questions"),
    userId: v.string(),
    answer: v.string(),
    isOfficial: v.boolean(),
    createdAt: v.number(),
  }).index("by_question", ["questionId"])
    .index("by_user", ["userId"]),

  // ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
  notifications: defineTable({
    userId: v.string(),
    type: v.string(),                       // 'MESSAGE' | 'INQUIRY' | 'SYSTEM' | 'REVIEW' | 'PROMOTION'
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_read", ["userId", "isRead"])
    .index("by_user_createdAt", ["userId", "createdAt"]),            // ← Paginated notification history

  // ─── REVIEWS ────────────────────────────────────────────────────────────────
  reviews: defineTable({
    listingId: v.id("listings"),
    userId: v.string(),
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
    isApproved: v.boolean(),
    adminResponse: v.optional(v.string()),
    adminRespondedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_listing", ["listingId"])
    .index("by_user", ["userId"])
    .index("by_listing_approved", ["listingId", "isApproved"]),      // ← Only show approved reviews

  // ─── TRANSACTIONS ───────────────────────────────────────────────────────────
  transactions: defineTable({
    userId: v.string(),
    amount: v.number(),
    type: v.string(),                       // 'TOPUP' | 'SPEND' | 'REFUND' | 'SUBSCRIPTION'
    description: v.string(),
    status: v.string(),                     // 'COMPLETED' | 'PENDING' | 'FAILED'
    stripeId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_type", ["userId", "type"])                       // ← Filter wallet by type
    .index("by_stripeId", ["stripeId"])
    .index("by_createdAt", ["createdAt"]),

  // ─── VERIFICATION REQUESTS ──────────────────────────────────────────────────
  verificationRequests: defineTable({
    userId: v.string(),
    idDocument: v.string(),
    status: v.string(),                     // 'PENDING' | 'APPROVED' | 'REJECTED'
    notes: v.optional(v.string()),
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // ─── RECENTLY VIEWED ────────────────────────────────────────────────────────
  recentlyViewed: defineTable({
    userId: v.string(),
    listingId: v.id("listings"),
    viewedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_listing", ["userId", "listingId"])
    .index("by_user_time", ["userId", "viewedAt"]),

  // ─── CONTACT SUBMISSIONS ────────────────────────────────────────────────────
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    status: v.string(),                     // 'NEW' | 'READ' | 'RESOLVED'
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  // ─── COUNTERS ───────────────────────────────────────────────────────────────
  counters: defineTable({
    name: v.string(),
    nextId: v.number(),
    reusableIds: v.array(v.number()),
  }).index("by_name", ["name"]),

  // ─── LISTING INQUIRIES (guest email contact) ─────────────────────────────────
  listingInquiries: defineTable({
    listingId: v.id("listings"),
    sellerId: v.string(),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.optional(v.string()),
    message: v.string(),
    createdAt: v.number(),
    isRead: v.boolean(),
  }).index("by_seller", ["sellerId"])
    .index("by_listing", ["listingId"])
    .index("by_seller_read", ["sellerId", "isRead"]),                // ← Unread inquiries count

  // ─── SUBSCRIPTIONS ──────────────────────────────────────────────────────────
  // Dedicated subscription history — replaces scattered fields on users table
  subscriptions: defineTable({
    userId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    tier: v.string(),                       // 'BASIC' | 'PRO' | 'ELITE'
    status: v.string(),                     // 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING'
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    cancelledAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_stripeId", ["stripeSubscriptionId"])
    .index("by_status", ["status"])
    .index("by_user_status", ["userId", "status"]),                  // ← Active subscription lookup

  // ─── REPORTS ────────────────────────────────────────────────────────────────
  // User-submitted reports for trust & safety (scams, duplicates, etc.)
  reports: defineTable({
    reporterId: v.string(),
    targetType: v.string(),                 // 'listing' | 'user' | 'review'
    targetId: v.string(),
    reason: v.string(),                     // 'SCAM' | 'DUPLICATE' | 'WRONG_CATEGORY' | 'OFFENSIVE' | 'OTHER'
    description: v.optional(v.string()),
    status: v.string(),                     // 'PENDING' | 'RESOLVED' | 'DISMISSED'
    resolvedBy: v.optional(v.string()),     // Admin userId
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_reporter", ["reporterId"])
    .index("by_target", ["targetId"])
    .index("by_targetType_status", ["targetType", "status"]),        // ← Admin moderation queue

  // ─── PROMOTION PACKAGES ─────────────────────────────────────────────────────
  // Admin-managed promotion plans — prices/durations configurable without redeploy
  promotionPackages: defineTable({
    name: v.string(),                       // 'Homepage Spotlight', 'Gold Listing', etc.
    slug: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    currency: v.string(),                   // 'MKD' | 'EUR'
    durationDays: v.number(),
    tier: v.string(),                       // 'GOLD' | 'SILVER' | 'BASIC'
    features: v.array(v.string()),          // Feature list shown to users
    isActive: v.boolean(),
    position: v.optional(v.number()),       // Display sort order
    createdAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_isActive", ["isActive"])
    .index("by_tier", ["tier"]),

  // ─── LISTING BUMPS / REFRESH HISTORY ────────────────────────────────────────
  // Audit trail for listing refreshes, bumps, and promotions
  listingBumps: defineTable({
    userId: v.string(),
    listingId: v.id("listings"),
    type: v.string(),                       // 'REFRESH' | 'BUMP' | 'PROMOTE'
    bumpedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_listing", ["listingId"])
    .index("by_user_listing", ["userId", "listingId"]),
});
