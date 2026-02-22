import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── QUERIES ─────────────────────────────────────────────────────────────────

/** List all soft-deleted listings (admin only) */
export const listDeleted = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("listings")
      .withIndex("by_deletedAt", (q) => q.gt("deletedAt", 0))
      .order("desc")
      .take(args.limit ?? 100);
    return items;
  },
});

// ─── MUTATIONS ───────────────────────────────────────────────────────────────

/** Soft-delete: mark listing as deleted instead of removing from DB */
export const softDelete = mutation({
  args: {
    listingId: v.id("listings"),
    deletedBy: v.optional(v.string()),
    deletedByName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new Error("Listing not found");
    if (listing.deletedAt) throw new Error("Already deleted");

    await ctx.db.patch(args.listingId, {
      deletedAt: Date.now(),
      deletedBy: args.deletedBy,
      deletedByName: args.deletedByName,
      status: "DELETED",
    });

    return { success: true };
  },
});

/** Restore a soft-deleted listing back to ACTIVE */
export const restore = mutation({
  args: {
    listingId: v.id("listings"),
    restoreStatus: v.optional(v.string()), // defaults to "ACTIVE"
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new Error("Listing not found");

    await ctx.db.patch(args.listingId, {
      deletedAt: undefined,
      deletedBy: undefined,
      deletedByName: undefined,
      status: args.restoreStatus ?? "ACTIVE",
    });

    return { success: true };
  },
});

/** Permanently delete a soft-deleted listing (irreversible) */
export const purge = mutation({
  args: {
    listingId: v.id("listings"),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new Error("Listing not found");
    if (!listing.deletedAt) throw new Error("Listing is not in recycle bin — move to bin first");

    await ctx.db.delete(args.listingId);
    return { success: true };
  },
});

/** Purge all items older than `olderThanDays` days from the recycle bin */
export const purgeOld = mutation({
  args: {
    olderThanDays: v.optional(v.number()), // default 30
  },
  handler: async (ctx, args) => {
    const days = args.olderThanDays ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const old = await ctx.db
      .query("listings")
      .withIndex("by_deletedAt", (q) => q.gt("deletedAt", 0).lt("deletedAt", cutoff))
      .collect();

    for (const item of old) {
      await ctx.db.delete(item._id);
    }

    return { purged: old.length };
  },
});
