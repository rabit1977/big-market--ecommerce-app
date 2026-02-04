
import { query } from "./_generated/server";

export const check = query({
  args: {},
  handler: async (ctx) => {
    // Check for "Mobile Phones"
    const mobilePhones = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", "mobile-phones"))
        .unique();
    
    // Check for "Electronics" (root)
    const electronics = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", "electronics"))
        .unique();

    return {
       foundMobile: !!mobilePhones,
       mobileTemplate: mobilePhones?.template,
       foundElectronics: !!electronics,
       electronicsChildren: await ctx.db.query("categories").withIndex("by_parentId", q => q.eq("parentId", electronics?._id)).collect().then(res => res.map(r => r.name))
    };
  },
});
