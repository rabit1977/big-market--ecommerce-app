import { mutation, query } from "./_generated/server";

const ALLOWED_SLUGS = [
  'motor-vehicles',
  'real-estate',
  'home-appliances',
  'home-and-garden',
  'fashion-clothing-shoes',
  'mobile-phones-accessories',
  'computers',
  'tv-audio-video',
  'musical-instruments-equipment',
  'watches-jewelry',
  'baby-children-products',
  'health-beauty',
  'multimedia-movies',
  'books-literature',
  'office-school-supplies',
  'hobby-animals',
  'sports-activities',
  'antiques-art',
  'business-machines-tools',
  'food-cooking',
  'shops-trade',
  'services-repairs',
  'employment',
  'events-nightlife',
  'vacation-tourism',
  'personal-contacts',
  'napravete-sami',
  'other'
];

export const listRootSlugs = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", undefined))
      .collect();
    return {
      count: categories.length,
      slugs: categories.map(c => c.slug).sort(),
      allowed: ALLOWED_SLUGS.sort()
    };
  },
});

export const cleanupExtraCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const allowedSet = new Set(ALLOWED_SLUGS);
    const roots = await ctx.db
      .query("categories")
      .withIndex("by_parentId", (q) => q.eq("parentId", undefined))
      .collect();
    
    let deletedRoots = 0;
    let deletedChildren = 0;
    
    for (const root of roots) {
      if (!allowedSet.has(root.slug)) {
        // Delete this root and all its children recursively
        const deleteRecursive = async (parentId: string) => {
          const children = await ctx.db
            .query("categories")
            .withIndex("by_parentId", (q) => q.eq("parentId", parentId))
            .collect();
          
          for (const child of children) {
            await deleteRecursive(child._id as string);
            await ctx.db.delete(child._id);
            deletedChildren++;
          }
        };
        
        await deleteRecursive(root._id as string);
        await ctx.db.delete(root._id);
        deletedRoots++;
      }
    }
    
    return { success: true, deletedRoots, deletedChildren };
  },
});
