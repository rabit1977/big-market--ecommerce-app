import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const send = mutation({
  args: {
    content: v.string(),
    listingId: v.optional(v.id("listings")),
    senderId: v.string(),
    receiverId: v.string(),
    imageUrl: v.optional(v.string()), 
    type: v.optional(v.string()), 
  },
  handler: async (ctx, args) => {
    const type = args.type || (args.listingId ? "LISTING" : "SUPPORT");
    const participantIds = [args.senderId, args.receiverId].sort();

    // 1. Check if conversation exists
    let existingConversation;

    
    if (args.listingId) {
      existingConversation = await ctx.db
        .query("conversations")
        .withIndex("by_listing", (q) => q.eq("listingId", args.listingId!))
        .filter((q) => 
            // Check if participants match precisely (ignoring role)
            // matching participantIds is safer than checking buyer/seller role permutations
            q.eq(q.field("participantIds"), participantIds)
        )
        .first();
        
      // Fallback: If no participantIds field (legacy), check roles
      if (!existingConversation) {
          existingConversation = await ctx.db
            .query("conversations")
            .withIndex("by_listing", (q) => q.eq("listingId", args.listingId!))
            .filter((q) =>
              q.or(
                q.and(
                  q.eq(q.field("buyerId"), args.senderId),
                  q.eq(q.field("sellerId"), args.receiverId)
                ),
                q.and(
                  q.eq(q.field("buyerId"), args.receiverId),
                  q.eq(q.field("sellerId"), args.senderId)
                )
              )
            )
            .first();
      }
    } else {
      // Support or generic chat
      existingConversation = await ctx.db
        .query("conversations")
        .withIndex("by_type", (q) => q.eq("type", type))
        .filter((q) => 
          q.and(
            q.eq(q.field("buyerId"), participantIds[0]),
            q.eq(q.field("sellerId"), participantIds[1])
          )
        )
        .first();
    }

    // 2. Create or Update Conversation
    if (existingConversation) {
      const isBuyer = existingConversation.buyerId === args.senderId;
      const updates: any = {
        lastMessage: args.content,
        lastMessageAt: Date.now(),
      };

      if (isBuyer) {
        // Sender is buyer, so increment seller's unread count
        updates.sellerUnreadCount = (existingConversation.sellerUnreadCount || 0) + 1;
        updates.buyerUnreadCount = 0; // Reset sender's unread count
      } else {
        // Sender is seller, so increment buyer's unread count
        updates.buyerUnreadCount = (existingConversation.buyerUnreadCount || 0) + 1;
        updates.sellerUnreadCount = 0; // Reset sender's unread count
      }

      await ctx.db.patch(existingConversation._id, updates);
    } else {
      // Create new
      // Determine initial unread count: receiver gets 1 unread
      const isSenderBuyer = (args.listingId ? args.senderId : participantIds[0]) === args.senderId;
      
      await ctx.db.insert("conversations", {
        type,
        listingId: args.listingId,
        buyerId: args.listingId ? args.senderId : participantIds[0],
        sellerId: args.listingId ? args.receiverId : participantIds[1],
        lastMessage: args.content,
        lastMessageAt: Date.now(),
        buyerUnreadCount: isSenderBuyer ? 0 : 1, // If sender is buyer, buyer has read it (0). If sender is seller, buyer has 1 unread.
        sellerUnreadCount: isSenderBuyer ? 1 : 0, // If sender is buyer, seller has 1 unread.
        participantIds,
      });
    }

    // 3. Insert Message
    return await ctx.db.insert("messages", {
      content: args.content,
      listingId: args.listingId,
      senderId: args.senderId,
      receiverId: args.receiverId,
      read: false,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").order("desc").collect();
  },
});

export const getConversation = query({
  args: {
    listingId: v.optional(v.id("listings")),
    userA: v.string(),
    userB: v.string(),
  },
  handler: async (ctx, args) => {
    let messages;
    if (args.listingId) {
      messages = await ctx.db
        .query("messages")
        .withIndex("by_listing", (q) => q.eq("listingId", args.listingId!))
        .collect();
    } else {
      messages = await ctx.db
        .query("messages")
        .filter((q) =>
          q.or(
            q.and(q.eq(q.field("senderId"), args.userA), q.eq(q.field("receiverId"), args.userB)),
            q.and(q.eq(q.field("senderId"), args.userB), q.eq(q.field("receiverId"), args.userA))
          )
        )
        .collect();
    }

    // Filter and sort
    return messages
      .filter(
        (m) =>
          (m.senderId === args.userA && m.receiverId === args.userB) ||
          (m.senderId === args.userB && m.receiverId === args.userA)
      )
      .sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const getForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const received = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", args.userId))
      .collect();

    const sent = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", args.userId))
      .collect();

    return [...received, ...sent].sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const markRead = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { read: true });
  },
});

// Get all conversations for a user
export const getConversations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("buyerId"), args.userId),
          q.eq(q.field("sellerId"), args.userId)
        )
      )
      .order("desc")
      .collect();

    // Fetch details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const listing = conv.listingId ? await ctx.db.get(conv.listingId) : null;
        const otherUserId =
          conv.buyerId === args.userId ? conv.sellerId : conv.buyerId;

        // Fetch other user details
        const otherUser = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", otherUserId))
          .first();

        // Calculate unread count for THIS user
        const unreadCount = (conv.buyerId === args.userId ? conv.buyerUnreadCount : conv.sellerUnreadCount) || 0;

        return {
          ...conv,
          listing,
          otherUserId,
          otherUser: otherUser ? {
             name: otherUser.name,
             image: otherUser.image,
             isVerified: otherUser.isVerified
          } : undefined,
          unreadCount, // Inject dynamic unread count for frontend compatibility
        };
      })
    );

    return conversationsWithDetails;
  },
});

// Get unread message count
export const getUnreadCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("buyerId"), args.userId),
          q.eq(q.field("sellerId"), args.userId)
        )
      )
      .collect();

    const totalUnread = conversations.reduce(
      (sum, conv) => {
          const count = conv.buyerId === args.userId ? conv.buyerUnreadCount : conv.sellerUnreadCount;
          return sum + (count || 0);
      },
      0
    );

    return totalUnread;
  },
});

// Mark conversation as read
export const markConversationAsRead = mutation({
  args: {
    listingId: v.optional(v.id("listings")),
    userId: v.string(),
    otherUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          args.listingId 
            ? q.eq(q.field("listingId"), args.listingId)
            : q.eq(q.field("listingId"), undefined),
          q.eq(q.field("senderId"), args.otherUserId),
          q.eq(q.field("receiverId"), args.userId),
          q.eq(q.field("read"), false)
        )
      )
      .collect();

    await Promise.all(
      messages.map((msg) => ctx.db.patch(msg._id, { read: true }))
    );

    // Update conversation unread count
    let conversation;
    if (args.listingId) {
      conversation = await ctx.db
        .query("conversations")
        .withIndex("by_listing", (q) => q.eq("listingId", args.listingId!))
        .filter((q) =>
          q.or(
            q.and(
              q.eq(q.field("buyerId"), args.userId),
              q.eq(q.field("sellerId"), args.otherUserId)
            ),
            q.and(
              q.eq(q.field("buyerId"), args.otherUserId),
              q.eq(q.field("sellerId"), args.userId)
            )
          )
        )
        .first();
    } else {
        const participantIds = [args.userId, args.otherUserId].sort();
        conversation = await ctx.db
            .query("conversations")
            .filter((q) => 
                q.and(
                    q.eq(q.field("buyerId"), participantIds[0]),
                    q.eq(q.field("sellerId"), participantIds[1])
                )
            )
            .first();
    }

    if (conversation) {
      if (conversation.buyerId === args.userId) {
          await ctx.db.patch(conversation._id, { buyerUnreadCount: 0 });
      } else {
          await ctx.db.patch(conversation._id, { sellerUnreadCount: 0 });
      }
    }

    return messages.length;
  },
});

export const getListingStats = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    // 1. Get total conversations for this listing
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .collect();

    // 2. Count unread messages (assuming caller is the SELLER here, as this is for "My Listings")
    // If the conversation listingId matches, the creator of the listing is the seller.
    
    return {
        totalConversations: conversations.length,
        totalUnread: conversations.reduce((acc, curr) => acc + (curr.sellerUnreadCount || 0), 0),
    };
  },
});

// Get all support conversations (ADMIN ONLY)
export const getSupportConversations = query({
  args: {},
  handler: async (ctx) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_type", (q) => q.eq("type", "SUPPORT"))
      .order("desc")
      .collect();

    // Fetch details
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        // For support, buyer is the USER, seller is ADMIN
        const userId = conv.buyerId;

        const user = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", userId))
          .first();

        // Admin is 'seller', so unread count is sellerUnreadCount
        const unreadCount = conv.sellerUnreadCount || 0;

        return {
          ...conv,
          otherUserId: userId,
          otherUser: user ? {
             name: user.name,
             image: user.image,
             email: user.email,
             isVerified: user.isVerified,
             id: user.externalId,
          } : { name: "Unknown User" },
          unreadCount,
        };
      })
    );

    return conversationsWithDetails;
  },
});
