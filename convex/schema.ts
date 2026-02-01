import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.string()),
    city: v.optional(v.string()),
    externalId: v.string(), // Links to NextAuth ID
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    gender: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    
    // Extended Profile Fields
    banner: v.optional(v.string()),
    accountType: v.optional(v.string()), // 'PERSON' | 'COMPANY'
    companyName: v.optional(v.string()),
    municipality: v.optional(v.string()),
    address: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    hasWhatsapp: v.optional(v.boolean()),
    hasViber: v.optional(v.boolean()),
    
    marketingEmails: v.optional(v.boolean()),
    orderEmails: v.optional(v.boolean()),
    reviewEmails: v.optional(v.boolean()),
    password: v.optional(v.string()),
    resetToken: v.optional(v.string()),
    resetTokenExpiry: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    // New fields for Classifieds features
    // New fields for Classifieds features
    isVerified: v.optional(v.boolean()),
    credits: v.optional(v.number()),
    idDocument: v.optional(v.string()),
    // Subscription System
    membershipTier: v.optional(v.string()), // 'FREE', 'BASIC', 'PRO', 'ELITE'
    membershipStatus: v.optional(v.string()), // 'ACTIVE', 'EXPIRED', 'PENDING'
    membershipExpiresAt: v.optional(v.number()),
  }).index("by_externalId", ["externalId"])
    .index("by_email", ["email"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    parentId: v.optional(v.string()),
    position: v.optional(v.number()),
    template: v.optional(v.any()), // JSON template for category-specific fields
    createdAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_parentId", ["parentId"]),

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
    status: v.string(), // ACTIVE, SOLD, etc
    userId: v.string(), // Links to externalId
    createdAt: v.number(),
    viewCount: v.optional(v.number()),
    specifications: v.optional(v.any()), // Category-specific fields
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    // Promotion & Priority
    isPromoted: v.optional(v.boolean()),
    promotionTier: v.optional(v.string()), // 'DAILY', 'WEEKLY', 'MONTHLY'
    promotionExpiresAt: v.optional(v.number()),
    priority: v.optional(v.number()), // Higher value = higher position
    // Professional Market Fields
    userType: v.optional(v.string()), // 'PRIVATE', 'COMPANY'
    adType: v.optional(v.string()), // 'SALE', 'BUYING'
    condition: v.optional(v.string()), // 'NEW', 'USED'
    isTradePossible: v.optional(v.boolean()),
    hasShipping: v.optional(v.boolean()),
    isVatIncluded: v.optional(v.boolean()),
    isAffordable: v.optional(v.boolean()), // For 'Povolni'
  })
    .index("by_category", ["category"])
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["status", "category"],
    }),

  favorites: defineTable({
    userId: v.string(), // External ID
    listingId: v.id('listings'),
  }).index('by_user', ['userId'])
    .index('by_listing', ['listingId'])
    .index('by_user_listing', ['userId', 'listingId']),

  savedSearches: defineTable({
    userId: v.string(),
    query: v.string(),
    url: v.string(), // Full URL with filters
    name: v.optional(v.string()), 
  }).index('by_user', ['userId']),

  messages: defineTable({
    content: v.string(),
    listingId: v.id("listings"),
    senderId: v.string(),
    receiverId: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_listing", ["listingId"])
    .index("by_receiver", ["receiverId"])
    .index("by_sender", ["senderId"])
    .index("by_conversation", ["senderId", "receiverId", "listingId"]),

  conversations: defineTable({
    listingId: v.id("listings"),
    buyerId: v.string(),
    sellerId: v.string(),
    lastMessageAt: v.number(),
    lastMessage: v.optional(v.string()),
    unreadCount: v.optional(v.number()),
  }).index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"])
    .index("by_listing", ["listingId"])
    .index("by_participants", ["buyerId", "sellerId", "listingId"]),
    
  analytics: defineTable({
    eventType: v.string(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
    page: v.optional(v.string()),
    referrer: v.optional(v.string()),
    data: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_type", ["eventType"])
    .index("by_session", ["sessionId"])
    .index("by_listing", ["data.listingId"]),

  activityLogs: defineTable({
    userId: v.string(),
    action: v.string(),
    details: v.optional(v.string()),
    targetId: v.optional(v.string()),
    targetType: v.optional(v.string()), // 'listing', 'user', 'category', etc
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

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
  }).index("by_question", ["questionId"]),

  notifications: defineTable({
    userId: v.string(),
    type: v.string(), // MESSAGE, WISHLIST, SYSTEM, etc
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_read", ["userId", "isRead"]),

  reviews: defineTable({
    listingId: v.id("listings"),
    userId: v.string(), // Author
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
    isApproved: v.boolean(),
    adminResponse: v.optional(v.string()),
    adminRespondedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_listing", ["listingId"])
    .index("by_user", ["userId"]),

  transactions: defineTable({
    userId: v.string(),
    amount: v.number(),
    type: v.string(), // "TOPUP", "SPEND", "REFUND"
    description: v.string(),
    status: v.string(), // "COMPLETED", "PENDING", "FAILED"
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  verificationRequests: defineTable({
    userId: v.string(),
    idDocument: v.string(),
    status: v.string(), // "PENDING", "APPROVED", "REJECTED"
    notes: v.optional(v.string()),
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"]),

  recentlyViewed: defineTable({
    userId: v.string(), // External User ID
    listingId: v.id("listings"),
    viewedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_listing", ["userId", "listingId"])
    .index("by_user_time", ["userId", "viewedAt"]),
});
