import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// ─── Queries ───────────────────────────────────────────────────────────────

/** Get all pending reports (admin moderation queue) */
export const getPendingReports = query({
  handler: async (ctx) => {
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "PENDING"))
      .order("desc")
      .collect();

    return await Promise.all(
      reports.map(async (report) => {
        // Fetch Reporter Details
        const reporter = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", report.reporterId))
          .unique();

        // Fetch Target Details
        let targetDetail: any = null;
        try {
          if (report.targetType === "listing") {
            const listing = await ctx.db.get(report.targetId as Id<"listings">);
            if (listing) {
              targetDetail = { id: listing._id, title: listing.title, image: listing.thumbnail || (listing.images && listing.images[0]) };
            }
          } else if (report.targetType === "user") {
            const user = await ctx.db.get(report.targetId as Id<"users">);
            if (user) {
              targetDetail = { id: user._id, name: user.name, email: user.email, image: user.image };
            }
          } else if (report.targetType === "review") {
             const review = await ctx.db.get(report.targetId as Id<"reviews">);
             if (review) {
                targetDetail = { id: review._id, content: review.comment, rating: review.rating };
             }
          }
        } catch (error) {
           console.error(`Failed to fetch target detail for report ${report._id}`);
        }

        return {
          ...report,
          reporter: {
            name: reporter?.name || "Unknown User",
            email: reporter?.email || "No email",
            image: reporter?.image,
          },
          target: targetDetail,
        };
      })
    );
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
