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

