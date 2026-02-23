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

    // 0. Anti-Spam / Rate Limiting (Skip for ADMIN)
    if (args.senderId !== "ADMIN") {
      const oneMinuteAgo = Date.now() - 60 * 1000;
      const recentMessages = await ctx.db
        .query("messages")
        .withIndex("by_sender", (q) => q.eq("senderId", args.senderId))
        .filter((q) => q.gt(q.field("createdAt"), oneMinuteAgo))
        .collect();

      if (recentMessages.length >= 30) {
        throw new Error("You are sending messages too fast. Please wait a moment.");
      }
    }

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
    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      listingId: args.listingId,
      senderId: args.senderId,
      receiverId: args.receiverId,
      read: false,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });

    // 4. Create Notification for Receiver
    const sender = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.senderId))
      .first();
    
    let listingTitle = "General Message";
    if (args.listingId) {
        const listing = await ctx.db.get(args.listingId);
        if (listing) listingTitle = listing.title;
    }

    await ctx.db.insert("notifications", {
        userId: args.receiverId,
        type: "INQUIRY", // Use INQUIRY type so it gets the "Reply" button logic in UI
        title: "New Message",
        message: `${sender?.name || "A user"} sent you a message about "${listingTitle}"`,
        isRead: false,
        createdAt: Date.now(),
        link: `/messages?listingId=${args.listingId || ""}`,
        metadata: {
            senderId: args.senderId,
            senderName: sender?.name,
            listingId: args.listingId,
            listingTitle: listingTitle
        }
    });

    return messageId;
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
    // 1. Fetch messages sent by A (limit 100)
    const sentByA = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", args.userA))
      .order("desc")
      .take(100);

    // 2. Fetch messages sent by B (limit 100)
    const sentByB = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", args.userB))
      .order("desc")
      .take(100);

    // 3. Combine and filter in memory (fast since it's only two users' messages)
    // We treat 'null' and 'undefined' listingId as identical (Support Chats)
    return [...sentByA, ...sentByB]
      .filter((m) => {
        const isMatch = (m.senderId === args.userA && m.receiverId === args.userB) ||
                        (m.senderId === args.userB && m.receiverId === args.userA);
        
        const mListing = m.listingId || undefined;
        const argListing = args.listingId || undefined;
        const isSameListing = mListing === argListing;
        
        return isMatch && isSameListing;
      })
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(-100); // Keep only the latest 100
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
    // 1. Get the current user to find their Convex internal ID in case conversations were created with it
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .first();

    const queries = [
      ctx.db.query("conversations").withIndex("by_buyer", (q) => q.eq("buyerId", args.userId)).collect(),
      ctx.db.query("conversations").withIndex("by_seller", (q) => q.eq("sellerId", args.userId)).collect(),
    ];

    if (currentUser && currentUser._id !== args.userId) {
      queries.push(ctx.db.query("conversations").withIndex("by_buyer", (q) => q.eq("buyerId", currentUser._id)).collect());
      queries.push(ctx.db.query("conversations").withIndex("by_seller", (q) => q.eq("sellerId", currentUser._id)).collect());
    }

    const results = await Promise.all(queries);
    
    // Deduplicate by conversation _id
    const conversationsMap = new Map();
    results.flat().forEach(conv => conversationsMap.set(conv._id, conv));

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0)
    );

    // Fetch details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const listing = conv.listingId ? await ctx.db.get(conv.listingId) : null;
        
        // Check if current user is the buyer (using either externalId or internal _id)
        const isBuyer = conv.buyerId === args.userId || (currentUser && conv.buyerId === currentUser._id);
        const otherUserId = isBuyer ? conv.sellerId : conv.buyerId;

        // Fetch other user details — try externalId first, then fall back to Convex internal ID
        let otherUser = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", otherUserId))
          .first();

        if (!otherUser) {
          try {
            const byId = await ctx.db.get(otherUserId as any);
            if (byId && (byId as any).externalId) otherUser = byId as any;
          } catch {
            // otherUserId is not a valid Convex Id — leave otherUser as null
          }
        }

        // Calculate unread count for THIS user
        const unreadCount = (isBuyer ? conv.buyerUnreadCount : conv.sellerUnreadCount) || 0;

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
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .first();

    const queries = [
      ctx.db.query("conversations").withIndex("by_buyer", (q) => q.eq("buyerId", args.userId)).collect(),
      ctx.db.query("conversations").withIndex("by_seller", (q) => q.eq("sellerId", args.userId)).collect(),
    ];

    if (currentUser && currentUser._id !== args.userId) {
      queries.push(ctx.db.query("conversations").withIndex("by_buyer", (q) => q.eq("buyerId", currentUser._id)).collect());
      queries.push(ctx.db.query("conversations").withIndex("by_seller", (q) => q.eq("sellerId", currentUser._id)).collect());
    }

    const results = await Promise.all(queries);
    const conversationsMap = new Map();
    results.flat().forEach(conv => conversationsMap.set(conv._id, conv));
    const conversations = Array.from(conversationsMap.values());

    const totalUnread = conversations.reduce(
      (sum, conv) => {
          const isBuyer = conv.buyerId === args.userId || (currentUser && conv.buyerId === currentUser._id);
          const count = isBuyer ? conv.buyerUnreadCount : conv.sellerUnreadCount;
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

import { paginationOptsValidator } from "convex/server";

// Get all support conversations (ADMIN ONLY)
export const getSupportConversations = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const paginated = await ctx.db
      .query("conversations")
      .withIndex("by_type", (q) => q.eq("type", "SUPPORT"))
      .order("desc")
      .paginate(args.paginationOpts);

    // Fetch details
    const conversationsWithDetails = await Promise.all(
      paginated.page.map(async (conv) => {
        // Find the user who is NOT "ADMIN"
        const userId = conv.buyerId === "ADMIN" ? conv.sellerId : conv.buyerId;

        let user = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", userId))
          .first();

        if (!user) {
          try {
            const byId = await ctx.db.get(userId as any);
            if (byId && (byId as any).externalId) user = byId as any;
          } catch {
            // not a valid Convex Id
          }
        }

        // Admin's unread count depends on their position (buyer or seller)
        const unreadCount = conv.buyerId === "ADMIN" ? conv.buyerUnreadCount : conv.sellerUnreadCount;

        return {
          ...conv,
          otherUserId: userId,
          otherUser: user ? {
             name: user.name,
             image: user.image,
             email: user.email,
             isVerified: user.isVerified,
             id: user.externalId,
          } : { name: "Unknown User", id: userId },
          unreadCount: unreadCount || 0,
        };
      })
    );

    return { ...paginated, page: conversationsWithDetails };
  },
});

// Get total unread support messages for admin badge
export const getTotalSupportUnread = query({
  args: {},
  handler: async (ctx) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_type", (q) => q.eq("type", "SUPPORT"))
      .collect();

    return conversations.reduce((sum, conv) => {
      const adminUnread = conv.buyerId === "ADMIN" ? (conv.buyerUnreadCount || 0) : (conv.sellerUnreadCount || 0);
      return sum + adminUnread;
    }, 0);
  },
});
