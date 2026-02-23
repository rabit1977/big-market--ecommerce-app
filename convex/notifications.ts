import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    userId: v.string(),
    unreadOnly: v.boolean(),
    type: v.optional(v.string()),
    limit: v.number(),
    skip: v.number(),
  },
  handler: async (ctx, args) => {
    // Determine the user's possible IDs (externalId and internal _id)
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .first();

    let userIds = [args.userId];
    if (currentUser && currentUser._id !== args.userId) {
        userIds.push(currentUser._id);
    }

    let notifications = [];

    for (const uId of userIds) {
      let q = ctx.db
        .query("notifications")
        .withIndex("by_user", (query) => query.eq("userId", uId));

      if (args.unreadOnly) {
        q = ctx.db
          .query("notifications")
          .withIndex("by_user_read", (query) => query.eq("userId", uId).eq("isRead", false));
      }

      const results = await q.collect();
      notifications.push(...results);
    }

    // Sort combined results
    notifications.sort((a, b) => b.createdAt - a.createdAt);
    
    if (args.type) {
        notifications = notifications.filter(n => n.type === args.type);
    }

    const total = notifications.length;
    
    // Pagination
    const sliced = notifications.slice(args.skip, args.skip + args.limit);

    return {
      notifications: sliced,
      totalCount: total,
    };
  },
});

export const getUnreadCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.userId))
      .first();

    let userIds = [args.userId];
    if (currentUser && currentUser._id !== args.userId) {
        userIds.push(currentUser._id);
    }

    let total = 0;
    for (const uId of userIds) {
        const unread = await ctx.db
          .query("notifications")
          .withIndex("by_user_read", (q) => q.eq("userId", uId).eq("isRead", false))
          .collect();
        total += unread.length;
    }
    
    return total;
  },
});

export const markAsRead = mutation({
  args: { id: v.id("notifications"), userId: v.string() },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.id);
    if (!notification || notification.userId !== args.userId) return;
    await ctx.db.patch(args.id, { isRead: true, readAt: Date.now() });
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) => q.eq("userId", args.userId).eq("isRead", false))
      .collect();

    for (const n of unread) {
      await ctx.db.patch(n._id, { isRead: true, readAt: Date.now() });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("notifications"), userId: v.string() },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.id);
    if (!notification || notification.userId !== args.userId) return;
    await ctx.db.delete(args.id);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

export const broadcast = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const notificationIds = [];
    
    for (const user of users) {
      const id = await ctx.db.insert("notifications", {
        ...args,
        userId: user.externalId,
        isRead: false,
        createdAt: Date.now(),
      });
      notificationIds.push(id);
    }
    
    return notificationIds;
  },
});
