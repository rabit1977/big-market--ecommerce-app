
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
       tractorsFields: tractors?.template?.fields?.map((f: any) => f.label)
    };
  },
});
