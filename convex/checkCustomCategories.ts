
import { query } from "./_generated/server";

export const checkCustom = query({
  args: {},
  handler: async (ctx) => {
    // 1. Get Motor Vehicles
    const motorVehicles = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", "motor-vehicles"))
        .unique();
    if (!motorVehicles) return { status: "Motor Vehicles missing" };

    // 2. Get Agricultural Vehicles
    const agricultural = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", "agricultural-vehicles"))
        .unique();
    if (!agricultural) return { status: "Agricultural Vehicles missing" };

    // 3. Get Tractors (Child of Agricultural)
    const tractors = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", "tractors"))
        .unique();

    return {
       foundMotorVehicles: !!motorVehicles,
       foundAgricultural: !!agricultural,
       agriParentCorrect: agricultural.parentId === motorVehicles._id,
       foundTractors: !!tractors,
       tractorsParentCorrect: tractors?.parentId === agricultural._id
    };
  },
});
