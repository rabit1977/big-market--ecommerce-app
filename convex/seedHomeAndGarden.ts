import { mutation } from "./_generated/server";

const HOME_GARDEN_SUBCATEGORIES = [
  { name: "Мебел", slug: "furniture" },
  { name: "Градина и тераса", slug: "garden-terrace" },
  { name: "Кујна и трпезарија", slug: "kitchen-dining" },
  { name: "Постелнина, перници и прекривки", slug: "bedding" },
  { name: "Осветлување", slug: "lighting" },
  { name: "Декорација", slug: "decoration" },
  { name: "Опрема за бања", slug: "bathroom-equipment" },
  { name: "Подготовка на вино и ракија", slug: "wine-brandy-production" },
  { name: "СМАРТ дом", slug: "smart-home" },
  { name: "Новогодишна декорација", slug: "new-year-decoration" },
  { name: "Столарија", slug: "carpentry" },
  { name: "Соларни елементи", slug: "solar-elements" },
];

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Find the parent category: "Home and Garden"
    const parentSlug = "home-and-garden";
    const parentCategory = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", parentSlug))
      .first();

    if (!parentCategory) {
      console.error(`Parent category '${parentSlug}' not found!`);
      return;
    }

    console.log(`Found parent category: ${parentCategory.name} (${parentCategory._id})`);

    // 2. Iterate and create subcategories
    for (const sub of HOME_GARDEN_SUBCATEGORIES) {
      // Check if subcategory already exists
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", sub.slug))
        .first();

      if (existing) {
        console.log(`Subcategory '${sub.name}' (${sub.slug}) already exists.`);
        continue;
      }

      await ctx.db.insert("categories", {
        name: sub.name,
        slug: sub.slug,
        parentId: parentCategory._id,
        isActive: true,
        isFeatured: false,
        createdAt: Date.now(),
        // Optional: add path if necessary, though it seems optional in schema
        parentPath: parentCategory.slug, 
        fullPath: `${parentCategory.slug}/${sub.slug}`,
      });

      console.log(`Inserted subcategory: ${sub.name}`);
    }

    console.log("Seeding complete!");
  },
});
