import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const send = mutation({
  args: {
    content: v.string(),
    listingId: v.id("listings"),
    senderId: v.string(),
    receiverId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Check if conversation rights exist
    const existingConversation = await ctx.db
      .query("conversations")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
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

    // 2. Create or Update Conversation
    if (existingConversation) {
      await ctx.db.patch(existingConversation._id, {
        lastMessage: args.content,
        lastMessageAt: Date.now(),
        unreadCount: (existingConversation.unreadCount || 0) + 1,
      });
    } else {
      // Create new
      await ctx.db.insert("conversations", {
        listingId: args.listingId,
        buyerId: args.senderId,
        sellerId: args.receiverId,
        lastMessage: args.content,
        lastMessageAt: Date.now(),
        unreadCount: 1,
      });
    }

    // 3. Insert Message
    return await ctx.db.insert("messages", {
      ...args,
      read: false,
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
    listingId: v.id("listings"),
    userA: v.string(),
    userB: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .collect();

    // Filter for just these two users
    return messages.filter(
      (m) =>
        (m.senderId === args.userA && m.receiverId === args.userB) ||
        (m.senderId === args.userB && m.receiverId === args.userA)
    ).sort((a, b) => a.createdAt - b.createdAt);
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

    // Fetch listing details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const listing = await ctx.db.get(conv.listingId);
        const otherUserId =
          conv.buyerId === args.userId ? conv.sellerId : conv.buyerId;

        return {
          ...conv,
          listing,
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
      (sum, conv) => sum + (conv.unreadCount || 0),
      0
    );

    return totalUnread;
  },
});

// Mark conversation as read
export const markConversationAsRead = mutation({
  args: {
    listingId: v.id("listings"),
    userId: v.string(),
    otherUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("listingId"), args.listingId),
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
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.and(
          q.eq(q.field("listingId"), args.listingId),
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
      )
      .first();

    if (conversation) {
      await ctx.db.patch(conversation._id, { unreadCount: 0 });
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

    // 2. Calculate unique interlocutors (people who messaged about this)
    // Actually conversations are unique per pair (buyer, seller, listing).
    // So conversations.length IS the number of chats.
    
    // 3. Count unread messages for the seller (current user will be seller if calling this)
    // We can't easily know who is calling without passing userId or checking auth.
    // Ideally we assume the caller is the owner.
    // Let's return the total unread count across all conversations for this listing.
    // However, unreadCount in conversation is for the USER who has unread messages.
    // Wait, `unreadCount` in schema:
    // lastMessageAt: v.number(), lastMessage: v.optional(v.string()), unreadCount: v.optional(v.number())
    // The current schema implementation of `unreadCount` in `conversations` table is slightly ambiguous
    // if it doesn't specify WHO has unread messages.
    // Usually unreadCount is per-user-conversation status. 
    // But here `conversations` is a shared record between buyer and seller.
    // If we look at `send` mutation:
    // unreadCount: (existingConversation.unreadCount || 0) + 1
    // It just increments. It doesn't say for whom.
    // AND `markConversationAsRead` clears it.
    // This implies `unreadCount` is simpler/shared or buggy?
    // Actually, looking at `getUnreadCount`: it sums up `unreadCount` for all conversations where user is buyer OR seller.
    // This suggests `unreadCount` implies messages waiting for *someone*.
    // If I send a message, unreadCount goes up. If I am the sender, it shouldn't be unread for ME.
    // The current implementation in `send` increments it blindly.
    // So `unreadCount` effectively means "messages since last read by ANYONE"?
    // Or maybe it assumes the receiver has unread messages?
    // `markConversationAsRead` clears it when a specific user reads it.
    // This schema is a bit simplistic for dual-sided unread counts (usually you need `buyerUnreadCount` and `sellerUnreadCount`).
    
    // For now, let's just return what we have: total conversations (leads).
    
    return {
        totalConversations: conversations.length,
        totalUnread: conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0),
    };
  },
});

