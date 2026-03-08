const fs = require('fs');

const raw = JSON.parse(
  fs.readFileSync('./convex_categories_raw.json', 'utf-8'),
);

// Map _id to slug to replace parentId with parentSlug
const idToSlug = {};
raw.forEach((c) => {
  idToSlug[c._id] = c.slug;
});

const cleanedCategories = raw.map((c) => {
  return {
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    isActive: c.isActive,
    isFeatured: c.isFeatured,
    parentSlug: c.parentId ? idToSlug[c.parentId] : null,
    template: c.template || null,
  };
});

// Since the array is large, we can dump it into a TS file
const tsContent = `import { internalMutation } from "./_generated/server";

const categoriesData = ${JSON.stringify(cleanedCategories, null, 2)};

export const seedCategories = internalMutation({
  args: {},
  handler: async (ctx) => {
    // 1. Build a map of slug to _id for inserted categories
    const slugToId = new Map<string, string>();

    // 2. Separate into roots and children
    const roots = categoriesData.filter(c => !c.parentSlug);
    const children = categoriesData.filter(c => c.parentSlug);

    // 3. Helper to insert and handle existing
    const insertOrUpdate = async (catData: any, parentId: string | undefined = undefined) => {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", catData.slug))
        .unique();

      if (existing) {
         // Optionally update, but for now just map the ID
         slugToId.set(catData.slug, existing._id);
      } else {
         const id = await ctx.db.insert("categories", {
           name: catData.name,
           slug: catData.slug,
           description: catData.description,
           image: catData.image,
           isActive: catData.isActive,
           isFeatured: catData.isFeatured,
           parentId: parentId as any,
           template: catData.template,
           createdAt: Date.now(),
         });
         slugToId.set(catData.slug, id);
      }
    };

    // 4. Insert roots
    for (const root of roots) {
      await insertOrUpdate(root);
    }

    // 5. Insert children (needs to handle arbitrary depth, so we loop until all are placed)
    let remaining = [...children];
    let loops = 0;
    while(remaining.length > 0 && loops < 20) {
       const nextRemaining = [];
       for (const child of remaining) {
          const parentId = slugToId.get(child.parentSlug!);
          if (parentId) {
             await insertOrUpdate(child, parentId);
          } else {
             nextRemaining.push(child);
          }
       }
       if (nextRemaining.length === remaining.length) {
          console.error("Circular dependency or missing parent detected among categories.");
          break;
       }
       remaining = nextRemaining;
       loops++;
    }

    return { success: true, count: categoriesData.length };
  }
});
`;

fs.writeFileSync('./convex/seed.ts', tsContent);
console.log('convex/seed.ts generated successfully!');
