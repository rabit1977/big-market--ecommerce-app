import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const TYPING_TIMEOUT_MS = 3 * 1000; // 3 seconds

export const setTyping = mutation({
  args: { conversationId: v.string(), userId: v.string(), isTyping: v.boolean() },
  handler: async (ctx, args) => {
      const existing = await ctx.db
         .query("typingIndicators")
         .withIndex("by_conversation", q => q.eq("conversationId", args.conversationId))
         .filter(q => q.eq(q.field("userId"), args.userId))
         .first();

      if (args.isTyping) {
          if (existing) {
              await ctx.db.patch(existing._id, { updatedAt: Date.now() });
          } else {
              await ctx.db.insert("typingIndicators", {
                 conversationId: args.conversationId,
                 userId: args.userId,
                 updatedAt: Date.now()
              });
          }
      } else {
          // Immediately remove if stopped typing explicitly
          if (existing) {
              await ctx.db.delete(existing._id);
          }
      }
  }
});

export const getActiveTyping = query({
   args: { conversationId: v.string(), currentUserId: v.string() },
   handler: async (ctx, args) => {
       const cutoff = Date.now() - TYPING_TIMEOUT_MS;
       
       const active = await ctx.db
          .query("typingIndicators")
          .withIndex("by_conversation", q => q.eq("conversationId", args.conversationId))
          .collect();

       // Filter out self and expired indicators
       const typingUsers = active
           .filter(t => t.userId !== args.currentUserId && t.updatedAt > cutoff)
           .map(t => t.userId);
           
       return typingUsers;
   }
});
