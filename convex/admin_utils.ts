import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const makeAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }

    await ctx.db.patch(user._id, {
      role: "ADMIN",
      accountStatus: "ACTIVE",
    });

    return { success: true, message: `User ${args.email} is now an ADMIN` };
  },
});

export const backfillUserRoles = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let updated = 0;
    for (const user of users) {
      if (!user.role) {
        await ctx.db.patch(user._id, { role: "USER" });
        updated++;
      }
    }
    return { success: true, totalUsers: users.length, updatedCount: updated };
  },
});
