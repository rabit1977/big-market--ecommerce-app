
import { query } from "./_generated/server";

export const checkCities = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("listings").collect();
    const cities = [...new Set(all.map(l => l.city))];
    const regions = [...new Set(all.map(l => l.region))];
    return { cities, regions, total: all.length };
  },
});
