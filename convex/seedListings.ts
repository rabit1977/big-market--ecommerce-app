import { mutation } from "./_generated/server";

export const seedListings = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Get Categories
    const categories = await ctx.db.query("categories").collect();
    if (categories.length === 0) {
      return { success: false, message: "No categories found. Run seedCategories first." };
    }

    // 2. Clear existing listings
    const existingListings = await ctx.db.query("listings").collect();
    for (const l of existingListings) {
      await ctx.db.delete(l._id);
    }

    // 3. Helpers
    const cities = ["Skopje", "Bitola", "Ohrid", "Kumanovo", "Tetovo"];
    const conditions = ["new", "like-new", "good", "used", "fair"];
    const userTypes = ["INDIVIDUAL", "DEALER"];
    
    // 4. Create Dummy Listings (Updated to match Macedonian filters)
    const listings = [
      {
        title: "iPhone 14 Pro Max - Deep Purple",
        description: "Excellent condition, battery 95%. Comes with box and cable.",
        price: 850,
        categorySlug: "mobile-phones",
        city: "Skopje",
        images: ["https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800"],
        condition: "Used",
        userType: "INDIVIDUAL",
        adType: "Се продава",
        status: "ACTIVE"
      },
      {
        title: "BMW 320d 2019 M-Sport",
        description: "Full service history, new tires, registered until 2025.",
        price: 24500,
        categorySlug: "cars",
        city: "Bitola",
        images: ["https://images.unsplash.com/photo-1556189250-72ba95452242?auto=format&fit=crop&q=80&w=800"],
        condition: "Used",
        userType: "DEALER",
        adType: "Се продава",
        status: "ACTIVE",
        features: ["Navigation", "Leather Seats", "Sunroof"]
      },
      {
        title: "Apartment in Center 65m2",
        description: "Fully renovated, 3rd floor with elevator, parking included.",
        price: 95000,
        categorySlug: "apartments",
        city: "Skopje",
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"],
        condition: "Renovated", 
        userType: "INDIVIDUAL",
        adType: "Се продава",
        status: "ACTIVE"
      },
      {
        title: "Sony PlayStation 5 Disc Edition",
        description: "Brand new, sealed box. 24 months warranty.",
        price: 450,
        categorySlug: "gaming-consoles",
        city: "Ohrid",
        images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800"],
        condition: "New",
        userType: "DEALER",
        adType: "Се продава",
        status: "ACTIVE",
        hasShipping: true
      },
      {
        title: "Mountain Bike Trek Roscoe 7",
        description: "Ridden only twice. Size L. Tubeless setup.",
        price: 800,
        categorySlug: "bicycles",
        city: "Tetovo",
        images: ["https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=800"],
        condition: "Used",
        userType: "INDIVIDUAL",
        adType: "Се продава",
        status: "ACTIVE",
        isTradePossible: "Да"
      },
      {
         title: "Leather Sofa Set",
         description: "Genuine leather, brown color. 3+2+1 set.",
         price: 1200,
         categorySlug: "furniture",
         city: "Kumanovo",
         images: ["https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=800"],
         condition: "Used",
         userType: "INDIVIDUAL",
         adType: "Се продава",
         status: "ACTIVE",
         isAffordable: true 
      },
      {
          title: "MacBook Pro M1 16GB/512GB",
          description: "Perfect working order. Small scratch on bottom case.",
          price: 1100,
          categorySlug: "laptops",
          city: "Skopje",
          images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800"],
          condition: "Used",
          userType: "INDIVIDUAL",
          adType: "Се продава",
          status: "ACTIVE"
      },
      {
        title: "Winter Tires Michelin Alpin 6",
        description: "205/55 R16. Used one season. DOT 2323.",
        price: 200,
        categorySlug: "auto-parts",
        city: "Skopje",
        images: ["https://images.unsplash.com/photo-1603517604646-953e53d5a2cd?auto=format&fit=crop&q=80&w=800"],
        condition: "Used",
        userType: "INDIVIDUAL",
        adType: "Се продава",
        status: "ACTIVE",
        isVatIncluded: true
      }
    ];

    // Insert
    for (const item of listings) {
      // Find category ID by slug (relaxed match)
      const cat = categories.find(c => c.slug === item.categorySlug) || categories[0];
      
        if (item.features) {
            // @ts-ignore
            item.specifications = { features: item.features };
        }

        await ctx.db.insert("listings", {
        title: item.title,
        description: item.description,
        price: item.price,
        city: item.city,
        category: cat.slug, 
        subCategory: cat.slug, 
        // Removed categoryId
        userId: "user_seed_123", 
        status: item.status,
        images: item.images,
        thumbnail: item.images[0],
        condition: item.condition,
        userType: item.userType,
        hasShipping: item.hasShipping,
        isTradePossible: item.isTradePossible as any, // Cast to any to handle string/boolean union
        isVatIncluded: item.isVatIncluded,
        isAffordable: item.isAffordable,
        adType: item.adType, // Added adType
        specifications: (item as any).specifications || {},
        createdAt: Date.now(),
        viewCount: Math.floor(Math.random() * 500)
      });
    }

    return { success: true, message: `Seeded ${listings.length} listings` };
  }
});
