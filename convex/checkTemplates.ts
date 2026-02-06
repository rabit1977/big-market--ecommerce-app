
import { query } from "./_generated/server";

export const checkTemplates = query({
  args: {},
  handler: async (ctx) => {
    const cars = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", "cars"))
        .unique();
    
    // Check tractors template
    const tractors = await ctx.db
         .query("categories")
         .withIndex("by_slug", (q) => q.eq("slug", "tractors"))
         .unique();

    return {
       carsFields: cars?.template?.fields?.map((f: any) => f.label),
       mobileFields: (await ctx.db.query("categories").withIndex("by_slug", q=>q.eq("slug", "mobile-phones")).unique())?.template?.fields?.map((f:any)=>f.label),
       smartwatchFields: (await ctx.db.query("categories").withIndex("by_slug", q=>q.eq("slug", "smartwatches")).unique())?.template?.fields?.map((f:any)=>f.label),
       accessoryFields: (await ctx.db.query("categories").withIndex("by_slug", q=>q.eq("slug", "mobile-cases")).unique())?.template?.fields?.map((f:any)=>f.label),
    };
  },
});
