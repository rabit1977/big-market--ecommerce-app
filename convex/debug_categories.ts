import { query } from "./_generated/server";

export const countRoots = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", undefined))
      .collect();
    return categories.length;
  },
});
