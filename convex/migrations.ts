import { internalMutation } from "./_generated/server";

export const assignListingNumbers = internalMutation({
  args: {},
  handler: async (ctx) => {
    // 1. Get current counter or initialize
    let counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", "listings"))
      .unique();

    if (!counter) {
      const id = await ctx.db.insert("counters", {
        name: "listings",
        nextId: 0,
        reusableIds: [],
      });
      counter = { _id: id, name: "listings", nextId: 0, reusableIds: [] } as any;
    }

    // 2. Get all listings without a number
    // We can't query by "missing field" easily, so we get all and filter
    // Or we can just iterate all and update if missing.
    // For performance, let's process in batches if many, but for now just take all.
    const listings = await ctx.db.query("listings").order("asc").collect(); // Order by creation time (default ID order usually correlates)
    
    // Sort by createdAt just to be sure to respect history
    listings.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    let assignedCount = 0;
    // We ensured counter is created above, so it exists
    let currentId = counter ? counter.nextId : 0;

    for (const listing of listings) {
      if (listing.listingNumber === undefined) {
        // Assign next ID
        // Check if currentId is already taken (reusableIds logic not needed for initial migration usually, 
        // we just assume we are filling up from 0 if it's a fresh start or appending)
        
        await ctx.db.patch(listing._id, {
          listingNumber: currentId,
        });
        
        currentId++;
        assignedCount++;
      } else {
        // If it has a number, ensure our counter is at least ahead of it
        if (listing.listingNumber >= currentId) {
            currentId = listing.listingNumber + 1;
        }
      }
    }

    // 3. Update counter
    if (counter) {
        await ctx.db.patch(counter._id, {
            nextId: currentId,
        });
    }

    return { success: true, assigned: assignedCount, nextId: currentId };
  },
});
