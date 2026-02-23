import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

async function resolveUserIds(ctx: QueryCtx | MutationCtx, userId: string): Promise<string[]> {
  const ids = [userId];
  
  // 1. Try to find by externalId
  const user = await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", userId))
    .first();

  if (user) {
    if (user._id !== userId) ids.push(user._id);
    if (user.externalId !== userId) ids.push(user.externalId);
  } else {
    // 2. Try to find by internal ID
    const normalizedId = ctx.db.normalizeId("users", userId);
    if (normalizedId) {
      const byId = await ctx.db.get(normalizedId);
      if (byId) {
        if (byId.externalId && byId.externalId !== userId) ids.push(byId.externalId);
        if (byId._id !== userId) ids.push(byId._id);
      }
    }
  }
  return Array.from(new Set(ids));
}

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

    // 1. Resolve all possible IDs for Sender and Receiver
    const senderIds = await resolveUserIds(ctx, args.senderId);
    const receiverIds = await resolveUserIds(ctx, args.receiverId);

    // 3. Check if conversation exists using ANY combination of the resolved IDs
    let existingConversation;

    if (args.listingId) {
      existingConversation = await ctx.db
        .query("conversations")
        .withIndex("by_listing", (q) => q.eq("listingId", args.listingId!))
        .filter((q) =>
          q.or(
            q.and(
              q.or(...senderIds.map(id => q.eq(q.field("buyerId"), id))),
              q.or(...receiverIds.map(id => q.eq(q.field("sellerId"), id)))
            ),
            q.and(
              q.or(...receiverIds.map(id => q.eq(q.field("buyerId"), id))),
              q.or(...senderIds.map(id => q.eq(q.field("sellerId"), id)))
            )
          )
        )
        .first();
    } else {
      // Support or generic chat
      existingConversation = await ctx.db
        .query("conversations")
        .withIndex("by_type", (q) => q.eq("type", type))
        .filter((q) => 
          q.or(
            q.and(
              q.or(...senderIds.map(id => q.eq(q.field("buyerId"), id))),
              q.or(...receiverIds.map(id => q.eq(q.field("sellerId"), id)))
            ),
            q.and(
              q.or(...receiverIds.map(id => q.eq(q.field("buyerId"), id))),
              q.or(...senderIds.map(id => q.eq(q.field("sellerId"), id)))
            )
          )
        )
        .first();
    }

    // 2. Create or Update Conversation
    if (existingConversation) {
      // Check if sender is the buyer of this conversation
      const isBuyer = senderIds.includes(existingConversation.buyerId);
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
      // For LISTING chat, the initiator (sender) is always the buyer
      const isSenderBuyer = type === "LISTING";
      
      await ctx.db.insert("conversations", {
        type,
        listingId: args.listingId,
        buyerId: isSenderBuyer ? args.senderId : participantIds[0],
        sellerId: isSenderBuyer ? args.receiverId : participantIds[1],
        lastMessage: args.content,
        lastMessageAt: Date.now(),
        buyerUnreadCount: isSenderBuyer ? 0 : 1, 
        sellerUnreadCount: isSenderBuyer ? 1 : 0, 
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
    let senderRecord = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.senderId))
      .first();

    if (!senderRecord) {
        const normId = ctx.db.normalizeId("users", args.senderId);
        if (normId) senderRecord = await ctx.db.get(normId);
    }
    
    let listingTitle = "General Message";
    if (args.listingId) {
        const listing = await ctx.db.get(args.listingId);
        if (listing) listingTitle = listing.title;
    }

    await ctx.db.insert("notifications", {
        userId: args.receiverId,
        type: "MESSAGE",
        title: "New Message",
        message: `${senderRecord?.name || "A user"} sent you a message about "${listingTitle}"`,
        isRead: false,
        createdAt: Date.now(),
        link: `/messages?listingId=${args.listingId || ""}`,
        metadata: {
            senderId: args.senderId,
            senderName: senderRecord?.name,
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
  },
});

export const getConversation = query({
  args: {
    listingId: v.optional(v.id("listings")),
    userA: v.string(),
    userB: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Resolve all possible IDs for User A and User B
    const userAIds = await resolveUserIds(ctx, args.userA);
    const userBIds = await resolveUserIds(ctx, args.userB);

    // 3. Fetch messages sent by any of User A's IDs
    const sentByAQueries = userAIds.map(id => 
        ctx.db.query("messages").withIndex("by_sender", (q) => q.eq("senderId", id)).order("desc").take(100)
    );
    
    // 4. Fetch messages sent by any of User B's IDs
    const sentByBQueries = userBIds.map(id => 
        ctx.db.query("messages").withIndex("by_sender", (q) => q.eq("senderId", id)).order("desc").take(100)
    );

    const allQueries = [...sentByAQueries, ...sentByBQueries];
    const allResults = await Promise.all(allQueries);
    const messages = allResults.flat();

    // Deduplicate by message _id (in case of overlap, though unlikely)
    const messagesMap = new Map();
    messages.forEach((m: any) => messagesMap.set(m._id, m));
    const uniqueMessages = Array.from(messagesMap.values());

    return uniqueMessages
      .filter((m: any) => {
        const isMatch = (userAIds.includes(m.senderId) && userBIds.includes(m.receiverId)) ||
                        (userBIds.includes(m.senderId) && userAIds.includes(m.receiverId));
        
        const mListing = m.listingId || undefined;
        const argListing = args.listingId || undefined;
        const isSameListing = mListing === argListing;
        
        return isMatch && isSameListing;
      })
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(-100);
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
    const userIds = await resolveUserIds(ctx, args.userId);

    const queries = userIds.flatMap(id => [
      ctx.db.query("conversations").withIndex("by_buyer", (q) => q.eq("buyerId", id)).collect(),
      ctx.db.query("conversations").withIndex("by_seller", (q) => q.eq("sellerId", id)).collect(),
    ]);

    const results = await Promise.all(queries);
    
    // Deduplicate by conversation _id
    const conversationsMap = new Map();
    results.flat().forEach((conv: any) => conversationsMap.set(conv._id, conv));

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0)
    );

    // Fetch details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const listing = conv.listingId ? await ctx.db.get(conv.listingId) : null;
        
        // Check if current user is the buyer (using any resolved ID)
        const isBuyer = userIds.includes(conv.buyerId);
        const otherUserId = isBuyer ? conv.sellerId : conv.buyerId;

        // Fetch other user details — try externalId first, then fall back to Convex internal ID
        let otherUserRecord = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", otherUserId))
          .first();

        if (!otherUserRecord) {
          const normalizedId = ctx.db.normalizeId("users", otherUserId);
          if (normalizedId) {
            otherUserRecord = await ctx.db.get(normalizedId);
          }
        }

        // Calculate unread count for THIS user
        const unreadCount = (isBuyer ? conv.buyerUnreadCount : conv.sellerUnreadCount) || 0;

        return {
          ...conv,
          otherUser: otherUserRecord ? {
            name: otherUserRecord.name || `User ${otherUserId.substring(0, 4)}`, // Fallback to "User [ID]"
            image: otherUserRecord.image,
            isVerified: otherUserRecord.isVerified
          } : { name: `User ${otherUserId.substring(0, 4)}` }, // Fallback to "User [ID]"
          listing,
          unreadCount,
          otherUserId,
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
    const userIds = await resolveUserIds(ctx, args.userId);

    const queries = userIds.flatMap(id => [
      ctx.db.query("conversations").withIndex("by_buyer", (q) => q.eq("buyerId", id)).collect(),
      ctx.db.query("conversations").withIndex("by_seller", (q) => q.eq("sellerId", id)).collect(),
    ]);

    const results = await Promise.all(queries);
    const conversationsMap = new Map();
    results.flat().forEach((conv: any) => conversationsMap.set(conv._id, conv));
    const conversations = Array.from(conversationsMap.values());

    const totalUnread = conversations.reduce(
      (sum: number, conv: any) => {
          const isBuyer = userIds.includes(conv.buyerId);
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
    const userIds = await resolveUserIds(ctx, args.userId);
    const otherUserIds = await resolveUserIds(ctx, args.otherUserId);

    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          args.listingId 
            ? q.eq(q.field("listingId"), args.listingId)
            : q.eq(q.field("listingId"), undefined),
          q.or(...otherUserIds.map(id => q.eq(q.field("senderId"), id))),
          q.or(...userIds.map(id => q.eq(q.field("receiverId"), id))),
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
              q.or(...userIds.map(id => q.eq(q.field("buyerId"), id))),
              q.or(...otherUserIds.map(id => q.eq(q.field("sellerId"), id)))
            ),
            q.and(
              q.or(...otherUserIds.map(id => q.eq(q.field("buyerId"), id))),
              q.or(...userIds.map(id => q.eq(q.field("sellerId"), id)))
            )
          )
        )
        .first();
    } else {
        conversation = await ctx.db
            .query("conversations")
            .filter((q) => 
                q.or(
                    q.and(
                        q.or(...userIds.map(id => q.eq(q.field("buyerId"), id))),
                        q.or(...otherUserIds.map(id => q.eq(q.field("sellerId"), id)))
                    ),
                    q.and(
                        q.or(...otherUserIds.map(id => q.eq(q.field("buyerId"), id))),
                        q.or(...userIds.map(id => q.eq(q.field("sellerId"), id)))
                    )
                )
            )
            .first();
    }

    if (conversation) {
      if (userIds.includes(conversation.buyerId)) {
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

// Get all support conversations (ADMIN ONLY) - Uses built-in pagination when no search/date filters
export const getSupportConversations = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Fetch conversations with basic type filter
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_type", (q) => q.eq("type", "SUPPORT"))
      .order("desc")
      .collect();

    // 2. Resolve details and Apply filters in memory
    // Note: For large datasets, we would use a Search Index, but for curated support chats this is performant.
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const userId = conv.buyerId === "ADMIN" ? conv.sellerId : conv.buyerId;
        
        // Resolve other user details
        let user = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", userId))
          .first();

        if (!user) {
          const normalizedId = ctx.db.normalizeId("users", userId);
          if (normalizedId) {
             user = await ctx.db.get(normalizedId);
          }
        }

        const unreadCount = conv.buyerId === "ADMIN" ? (conv.buyerUnreadCount || 0) : (conv.sellerUnreadCount || 0);

        return {
          ...conv,
          otherUserId: userId,
          otherUser: {
             name: user?.name ?? "Unknown User",
             image: user?.image,
             email: user?.email,
             isVerified: user?.isVerified,
             id: user?.externalId ?? userId,
          },
          unreadCount,
        };
      })
    );

    let filtered = conversationsWithDetails;

    // 3. Apply Search Filter
    if (args.search) {
        const search = args.search.toLowerCase();
        filtered = filtered.filter(c => 
            c.otherUser.name?.toLowerCase().includes(search) || 
            c.otherUser.email?.toLowerCase().includes(search) ||
            c.lastMessage?.toLowerCase().includes(search)
        );
    }

    // 4. Apply Date Filter
    if (args.startDate) {
        filtered = filtered.filter(c => (c.lastMessageAt || 0) >= args.startDate!);
    }
    if (args.endDate) {
        filtered = filtered.filter(c => (c.lastMessageAt || 0) <= args.endDate!);
    }

    // 5. Manual Pagination (since we filtered in memory)
    // We use the cursor in paginationOpts to simulate real pagination
    const numToReturn = args.paginationOpts.numItems;
    const startIndex = parseInt(args.paginationOpts.cursor || "0", 10);
    const page = filtered.slice(startIndex, startIndex + numToReturn);
    const nextIndex = startIndex + numToReturn;
    const isDone = nextIndex >= filtered.length;

    return {
        page,
        isDone,
        continueCursor: isDone ? "" : nextIndex.toString()
    };
  },
});

export const exportSupport = query({
    args: {},
    handler: async (ctx) => {
        const conversations = await ctx.db
            .query("conversations")
            .withIndex("by_type", (q) => q.eq("type", "SUPPORT"))
            .order("desc")
            .collect();
            
        return await Promise.all(
          conversations.map(async (conv) => {
            const userId = conv.buyerId === "ADMIN" ? conv.sellerId : conv.buyerId;
            let user = await ctx.db
              .query("users")
              .withIndex("by_externalId", (q) => q.eq("externalId", userId))
              .first();

            if (!user) {
              const normalizedId = ctx.db.normalizeId("users", userId);
              if (normalizedId) user = await ctx.db.get(normalizedId);
            }

            return {
              ...conv,
              otherUser: {
                name: user?.name,
                email: user?.email,
              }
            };
          })
        );
    }
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
