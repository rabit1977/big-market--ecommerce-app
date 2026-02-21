import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Queries ───────────────────────────────────────────────────────────────

/** Get all pending reports (admin moderation queue) */
export const getPendingReports = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "PENDING"))
      .order("desc")
      .collect();
  },
});

/** Get reports by target (e.g., all reports for a specific listing) */
export const getByTarget = query({
  args: { targetId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_target", (q) => q.eq("targetId", args.targetId))
      .collect();
  },
});

/** Get reports filed by a specific user */
export const getByReporter = query({
  args: { reporterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_reporter", (q) => q.eq("reporterId", args.reporterId))
      .order("desc")
      .collect();
  },
});

/** Count pending reports (for admin badge) */
export const getPendingCount = query({
  handler: async (ctx) => {
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "PENDING"))
      .collect();
    return reports.length;
  },
});

// ─── Mutations ─────────────────────────────────────────────────────────────

/** Submit a report (any logged-in user) */
export const submitReport = mutation({
  args: {
    reporterId: v.string(),
    targetType: v.string(),   // 'listing' | 'user' | 'review'
    targetId: v.string(),
    reason: v.string(),       // 'SCAM' | 'DUPLICATE' | 'WRONG_CATEGORY' | 'OFFENSIVE' | 'OTHER'
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Prevent duplicate reports from the same user on the same target
    const existing = await ctx.db
      .query("reports")
      .withIndex("by_target", (q) => q.eq("targetId", args.targetId))
      .filter((q) =>
        q.and(
          q.eq(q.field("reporterId"), args.reporterId),
          q.eq(q.field("status"), "PENDING")
        )
      )
      .first();

    if (existing) {
      throw new Error("You already have a pending report for this item.");
    }

    return await ctx.db.insert("reports", {
      ...args,
      status: "PENDING",
      createdAt: Date.now(),
    });
  },
});

/** Resolve a report (admin only) */
export const resolveReport = mutation({
  args: {
    reportId: v.id("reports"),
    resolvedBy: v.string(),
    action: v.string(), // 'RESOLVED' | 'DISMISSED'
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) throw new Error("Report not found");

    await ctx.db.patch(args.reportId, {
      status: args.action,
      resolvedBy: args.resolvedBy,
      resolvedAt: Date.now(),
    });
  },
});
