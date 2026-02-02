import { query } from "./_generated/server";

export const checkHierarchy = query({
  args: {},
  handler: async (ctx) => {
    const withParent = await ctx.db.query("categories")
      .filter(q => q.neq(q.field("parentId"), undefined))
      .take(1);
    const withoutParent = await ctx.db.query("categories")
      .filter(q => q.eq(q.field("parentId"), undefined))
      .take(5);
    return { 
      hasParents: withParent.length > 0,
      sampleWithout: withoutParent.map(c => c.name)
    };
  }
});
