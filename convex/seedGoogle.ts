import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";

// Mapping of Google Root IDs to our UI Slugs for Icons/Colors
const ROOT_MAPPING: Record<number, string> = {
  1: "pets",
  166: "fashion",
  537: "baby-children",
  111: "business-industry",
  222: "electronics",
  141: "electronics", // Cameras
  602: "home-garden",
  518: "home-garden", // Furniture
  549: "home-garden", // Hardware
  783: "books",
  990: "sports",
  5181: "motor-vehicles",
  1239: "other", // Toys
  8: "other", // Arts
  436: "other", // Food
  669: "fashion", // Luggage
  5605: "other", // Health
  888: "business-industry", // Office
  989: "electronics", // Software
};

const COMMON_FIELDS = {
  CONDITION: { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Refurbished", "For parts"] },
  BRAND: { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Apple, Nike" },
  COLOR: { label: "Color", type: "text", key: "color", placeholder: "e.g. Red, Black" },
  SIZE: { label: "Size", type: "text", key: "size", placeholder: "e.g. L, 42, 10" },
  MATERIAL: { label: "Material", type: "text", key: "material", placeholder: "e.g. Cotton, Leather" },
  GENDER: { label: "Gender", type: "select", key: "gender", options: ["Men", "Women", "Unisex", "Kids"] },
  YEAR: { label: "Year", type: "number", key: "year", placeholder: "e.g. 2023" },
  MILEAGE: { label: "Mileage", type: "number", key: "mileage", placeholder: "e.g. 50000" },
};

function getDynamicFields(path: string) {
  const lowerPath = path.toLowerCase();
  const fields: any[] = [COMMON_FIELDS.CONDITION];

  if (lowerPath.includes("clothing") || lowerPath.includes("apparel") || lowerPath.includes("shoes") || lowerPath.includes("jewelry") || lowerPath.includes("watches")) {
    fields.push(COMMON_FIELDS.BRAND, COMMON_FIELDS.SIZE, COMMON_FIELDS.COLOR, COMMON_FIELDS.MATERIAL, COMMON_FIELDS.GENDER);
  } else if (lowerPath.includes("electronics") || lowerPath.includes("computers") || lowerPath.includes("phones") || lowerPath.includes("cameras") || lowerPath.includes("audio")) {
    fields.push(COMMON_FIELDS.BRAND, { label: "Model", type: "text", key: "model", placeholder: "e.g. iPhone 14 Pro" });
  } else if (lowerPath.includes("vehicles") || lowerPath.includes("cars") || lowerPath.includes("motorcycles")) {
    fields.push(COMMON_FIELDS.BRAND, COMMON_FIELDS.YEAR, COMMON_FIELDS.MILEAGE);
    fields.push({ label: "Fuel", type: "select", key: "fuel", options: ["Petrol", "Diesel", "Electric", "Hybrid", "LPG"] });
  } else if (lowerPath.includes("furniture") || lowerPath.includes("decor") || lowerPath.includes("bedding")) {
    fields.push(COMMON_FIELDS.BRAND, COMMON_FIELDS.MATERIAL, COMMON_FIELDS.COLOR);
  } else if (lowerPath.includes("animals") || lowerPath.includes("pets") || lowerPath.includes("dogs") || lowerPath.includes("cats")) {
    fields.push({ label: "Breed", type: "text", key: "breed", placeholder: "e.g. Labrador" });
    fields.push({ label: "Age", type: "text", key: "age", placeholder: "e.g. 2 months" });
  } else {
    fields.push(COMMON_FIELDS.BRAND);
  }
  
  return fields;
}

export const seedGoogleTaxonomy = action({
  args: {},
  handler: async (ctx) => {
    console.log("Fetching Google Product Taxonomy...");
    const response = await fetch("https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt");
    const text = await response.text();
    const lines = text.split("\n");

    const categories: any[] = [];
    const idToConvexId: Record<number, string> = {}; // Temporarily store for mapping parentIds

    // Parse lines
    for (const line of lines) {
      if (!line || line.startsWith("#")) continue;

      const match = line.match(/^(\d+) - (.*)$/);
      if (!match) continue;

      const id = parseInt(match[1]);
      const fullPath = match[2];
      const segments = fullPath.split(" > ");
      const name = segments[segments.length - 1];
      const parentPath = segments.slice(0, segments.length - 1).join(" > ");
      
      // Slug generation
      let slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Add ID to slug to ensure uniqueness across 5500 items
      slug = `${slug}-${id}`;

      categories.push({
        googleId: id,
        name,
        fullPath,
        parentPath,
        slug,
        template: {
          titlePlaceholder: `e.g. ${name}`,
          fields: getDynamicFields(fullPath)
        }
      });
    }

    console.log(`Parsed ${categories.length} categories. Purging old ones...`);
    await ctx.runAction(api.seedGoogle.clearCategories);

    console.log("Seeding new categories in chunks...");
    const chunkSize = 100;
    for (let i = 0; i < categories.length; i += chunkSize) {
      const chunk = categories.slice(i, i + chunkSize);
      await ctx.runMutation(api.seedGoogle.insertCategoryChunk, { chunk });
      console.log(`Seeded ${Math.min(i + chunkSize, categories.length)} / ${categories.length}...`);
    }

    console.log("Updating parent relations...");
    await ctx.runAction(api.seedGoogle.linkParentsAction);

    return { success: true, count: categories.length };
  }
});

export const clearCategories = action({
  args: {},
  handler: async (ctx) => {
    console.log("Purging categories in chunks...");
    while (true) {
      const deletedCount = await ctx.runMutation(api.seedGoogle.clearCategoryBatch);
      if (deletedCount === 0) break;
      console.log(`Deleted ${deletedCount} categories...`);
    }
  }
});

export const clearCategoryBatch = mutation({
  args: {},
  handler: async (ctx) => {
    // We only take 300 to be extremely safe with read/write limits in a single transaction
    const batch = await ctx.db.query("categories").take(300);
    for (const cat of batch) {
      await ctx.db.delete(cat._id);
    }
    return batch.length;
  }
});

export const insertCategoryChunk = mutation({
  args: { chunk: v.array(v.any()) },
  handler: async (ctx, args) => {
    for (const item of args.chunk) {
      // Find root mapping
      const rootName = item.fullPath.split(" > ")[0];
      // We look up the Google ID of the root in the full list to see if it matches our ROOT_MAPPING
      // But a simpler way: if fullPath has no " > ", it's a root.
      const isRoot = !item.fullPath.includes(" > ");
      
      let finalSlug = item.slug;
      if (isRoot) {
        const mappedRoot = ROOT_MAPPING[item.googleId];
        if (mappedRoot) {
          finalSlug = mappedRoot; // Override with our UI slug for root
        }
      }

      await ctx.db.insert("categories", {
        name: item.name,
        slug: finalSlug,
        googleId: item.googleId,
        fullPath: item.fullPath,
        parentPath: item.parentPath,
        template: item.template,
        isActive: true,
        isFeatured: isRoot && !!ROOT_MAPPING[item.googleId],
        createdAt: Date.now()
      });
    }
  }
});

export const linkParentsAction = action({
  args: {},
  handler: async (ctx) => {
    console.log("Fetching all categories for mapping...");
    const all = await ctx.runQuery(api.seedGoogle.getAllCategories);
    const pathToId: Record<string, any> = {};
    for (const cat of all as any[]) {
      if (cat.fullPath) pathToId[cat.fullPath] = cat._id;
    }

    console.log("Linking parents in chunks...");
    const chunkSize = 200;
    for (let i = 0; i < all.length; i += chunkSize) {
      const chunk = all.slice(i, i + chunkSize);
      const updates = chunk.map((cat: any) => {
        if (cat.parentPath && pathToId[cat.parentPath]) {
          return { id: cat._id, parentId: pathToId[cat.parentPath] };
        }
        return null;
      }).filter((x: any): x is { id: any; parentId: string } => x !== null);

      if (updates.length > 0) {
        await ctx.runMutation(api.seedGoogle.patchParentBatch, { updates: updates as any[] });
      }
      console.log(`Linked ${Math.min(i + chunkSize, all.length)} / ${all.length}...`);
    }
    return { success: true };
  }
});

export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    // If there are too many, we just return the first 4000 to avoid crash
    // In our lite seed, we only expect ~365 anyway.
    return await ctx.db.query("categories").take(4000);
  }
});

export const patchParentBatch = mutation({
  args: { updates: v.array(v.object({ id: v.id("categories"), parentId: v.string() })) },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, { parentId: update.parentId });
    }
  }
});
