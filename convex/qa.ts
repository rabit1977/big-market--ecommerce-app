import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getListingQuestions = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .collect();

    const enriched = await Promise.all(
      questions.map(async (q) => {
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (aq) => aq.eq("questionId", q._id))
          .collect();
        return { ...q, answers };
      })
    );

    return enriched;
  },
});

export const listAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .order("desc")
      .take(args.limit || 50);
  },
});

export const createQuestion = mutation({
  args: {
    listingId: v.id("listings"),
    userId: v.string(),
    question: v.string(),
  },
  handler: async (ctx, args) => {
    // Basic Rate Limiting
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentQuestions = await ctx.db
      .query("questions")
      .filter(q => q.and(
         q.eq(q.field("userId"), args.userId),
         q.gt(q.field("createdAt"), oneDayAgo)
      ))
      .collect();

    if (recentQuestions.length >= 10) {
      throw new Error("You have reached the daily limit of 10 questions to prevent spam.");
    }

    return await ctx.db.insert("questions", {
      ...args,
      isPublic: true,
      helpfulCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const createAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    userId: v.string(),
    answer: v.string(),
    isOfficial: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Basic Rate Limiting
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentAnswers = await ctx.db
      .query("answers")
      .filter(q => q.and(
         q.eq(q.field("userId"), args.userId),
         q.gt(q.field("createdAt"), oneDayAgo)
      ))
      .collect();

    if (recentAnswers.length >= 20) {
      throw new Error("You have reached the daily limit for anwering questions.");
    }

    return await ctx.db.insert("answers", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const removeQuestion = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    // Delete answers first
    const answers = await ctx.db
      .query("answers")
      .withIndex("by_question", (q) => q.eq("questionId", args.id))
      .collect();
    
    for (const answer of answers) {
      await ctx.db.delete(answer._id);
    }
    
    await ctx.db.delete(args.id);
  },
});

export const toggleVisibility = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    const q = await ctx.db.get(args.id);
    if (!q) return;
    await ctx.db.patch(args.id, { isPublic: !q.isPublic });
  },
});
