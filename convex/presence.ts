import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const PRESENCE_TIMEOUT_MS = 60 * 1000; // 1 minute

export const heartbeat = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
       .query("presence")
       .withIndex("by_user", q => q.eq("userId", args.userId))
       .first();

    if (existing) {
       await ctx.db.patch(existing._id, { updatedAt: Date.now() });
    } else {
       await ctx.db.insert("presence", { userId: args.userId, updatedAt: Date.now() });
    }
  }
});

export const getOnlineUsers = query({
  args: { userIds: v.array(v.string()) },
  handler: async (ctx, args) => {
     const cutoff = Date.now() - PRESENCE_TIMEOUT_MS;
     const onlineMap: Record<string, boolean> = {};

     // De-duplicate userIds
     const uniqueUserIds = Array.from(new Set(args.userIds));

     // Fetch all presence documents in parallel
     const presenceDocs = await Promise.all(
         uniqueUserIds.map(userId => 
             ctx.db
                 .query("presence")
                 .withIndex("by_user", q => q.eq("userId", userId))
                 .first()
         )
     );

     // Map results
     uniqueUserIds.forEach((userId, index) => {
         const presence = presenceDocs[index];
         onlineMap[userId] = !!presence && presence.updatedAt > cutoff;
     });

     return onlineMap;
  }
});
