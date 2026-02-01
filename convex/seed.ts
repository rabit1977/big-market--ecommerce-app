import { mutation } from "./_generated/server";

export const seedCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const upsertCategory = async (slug: string, data: any) => {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      const doc = {
        isActive: true,
        isFeatured: false,
        ...data,
        slug,
        createdAt: existing?.createdAt || Date.now(),
      };

      if (existing) {
        await ctx.db.patch(existing._id, doc);
        return existing._id;
      } else {
        return await ctx.db.insert("categories", doc);
      }
    };

    // 1. REAL ESTATE
    const realEstateId = await upsertCategory("real-estate", {
      name: "Real Estate",
      description: "Properties for sale and rent",
      isFeatured: true,
    });

    await upsertCategory("flats-apartments", {
      name: "Flats / Apartments",
      parentId: realEstateId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Sale", "Rent"] },
          { label: "Size (m²)", type: "number", key: "size_m2", required: true },
          { label: "Rooms", type: "select", key: "rooms", options: ["Studio", "1", "2", "3", "4+"] },
          { label: "Floor", type: "number", key: "floor" },
          { label: "Bathrooms", type: "number", key: "bathrooms" }
        ]
      }
    });

    await upsertCategory("houses-villas", {
      name: "Houses / Villas",
      parentId: realEstateId,
    });

    await upsertCategory("land", {
      name: "Land",
      parentId: realEstateId,
    });

    await upsertCategory("commercial-property", {
      name: "Commercial Property",
      parentId: realEstateId,
    });

    // 2. VEHICLES
    const vehiclesId = await upsertCategory("vehicles", {
      name: "Vehicles",
      description: "Cars, motorcycles, and more",
      isFeatured: true,
    });

    await upsertCategory("cars", {
      name: "Cars",
      parentId: vehiclesId,
      template: {
        fields: [
          { label: "Brand", type: "text", key: "brand", required: true },
          { label: "Model", type: "text", key: "model", required: true },
          { label: "Year", type: "number", key: "year" },
          { label: "Fuel", type: "select", key: "fuel", options: ["Petrol", "Diesel", "Electric", "Hybrid"] },
          { label: "Mileage (km)", type: "number", key: "mileage" },
          { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic"] }
        ]
      }
    });

    await upsertCategory("motorcycles", {
      name: "Motorcycles",
      parentId: vehiclesId,
    });

    await upsertCategory("trucks-vans", {
      name: "Trucks & Vans",
      parentId: vehiclesId,
    });

    await upsertCategory("boats", {
      name: "Boats",
      parentId: vehiclesId,
    });

    // 3. ELECTRONICS
    const electronicsId = await upsertCategory("electronics", {
      name: "Electronics",
      description: "Phones, computers, and gadgets",
      isFeatured: true,
    });

    await upsertCategory("mobile-phones", {
      name: "Mobile Phones",
      parentId: electronicsId,
      template: {
        fields: [
          { label: "Brand", type: "select", key: "brand", options: ["Apple", "Samsung", "Xiaomi", "Huawei", "Other"] },
          { label: "Model", type: "text", key: "model", required: true },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good", "For Parts"] },
          { label: "Storage", type: "select", key: "storage", options: ["64GB", "128GB", "256GB", "512GB+"] }
        ]
      }
    });

    await upsertCategory("computers-laptops", {
      name: "Computers & Laptops",
      parentId: electronicsId,
    });

    await upsertCategory("tablets", {
      name: "Tablets",
      parentId: electronicsId,
    });

    await upsertCategory("tvs-audio", {
      name: "TVs & Audio",
      parentId: electronicsId,
    });

    await upsertCategory("cameras", {
      name: "Cameras",
      parentId: electronicsId,
    });

    // 4. JOBS
    const jobsId = await upsertCategory("jobs", {
      name: "Jobs",
      description: "Find your next opportunity",
      isFeatured: true,
    });

    await upsertCategory("full-time", {
      name: "Full Time",
      parentId: jobsId,
    });

    await upsertCategory("part-time", {
      name: "Part Time",
      parentId: jobsId,
    });

    await upsertCategory("freelance", {
      name: "Freelance",
      parentId: jobsId,
    });

    await upsertCategory("internships", {
      name: "Internships",
      parentId: jobsId,
    });

    // 5. SERVICES
    const servicesId = await upsertCategory("services", {
      name: "Services",
      description: "Professional services",
    });

    await upsertCategory("home-services", {
      name: "Home Services",
      parentId: servicesId,
    });

    await upsertCategory("business-services", {
      name: "Business Services",
      parentId: servicesId,
    });

    await upsertCategory("personal-services", {
      name: "Personal Services",
      parentId: servicesId,
    });

    // 6. FASHION
    const fashionId = await upsertCategory("fashion", {
      name: "Fashion",
      description: "Clothing, shoes, and accessories",
    });

    await upsertCategory("mens-clothing", {
      name: "Men's Clothing",
      parentId: fashionId,
    });

    await upsertCategory("womens-clothing", {
      name: "Women's Clothing",
      parentId: fashionId,
    });

    await upsertCategory("shoes", {
      name: "Shoes",
      parentId: fashionId,
    });

    await upsertCategory("accessories", {
      name: "Accessories",
      parentId: fashionId,
    });

    // 7. HOME & GARDEN
    const homeGardenId = await upsertCategory("home-garden", {
      name: "Home & Garden",
      description: "Furniture, appliances, and decor",
    });

    await upsertCategory("furniture", {
      name: "Furniture",
      parentId: homeGardenId,
    });

    await upsertCategory("appliances", {
      name: "Appliances",
      parentId: homeGardenId,
    });

    await upsertCategory("home-decor", {
      name: "Home Decor",
      parentId: homeGardenId,
    });

    await upsertCategory("garden-outdoor", {
      name: "Garden & Outdoor",
      parentId: homeGardenId,
    });

    // 8. SPORTS & LEISURE
    const sportsId = await upsertCategory("sports-leisure", {
      name: "Sports & Leisure",
      description: "Sports equipment and hobbies",
    });

    await upsertCategory("sports-equipment", {
      name: "Sports Equipment",
      parentId: sportsId,
    });

    await upsertCategory("bicycles", {
      name: "Bicycles",
      parentId: sportsId,
    });

    await upsertCategory("gym-fitness", {
      name: "Gym & Fitness",
      parentId: sportsId,
    });

    // 9. PETS
    const petsId = await upsertCategory("pets", {
      name: "Pets",
      description: "Pets and pet supplies",
    });

    await upsertCategory("dogs", {
      name: "Dogs",
      parentId: petsId,
    });

    await upsertCategory("cats", {
      name: "Cats",
      parentId: petsId,
    });

    await upsertCategory("pet-accessories", {
      name: "Pet Accessories",
      parentId: petsId,
    });

    // 10. EDUCATION
    const educationId = await upsertCategory("education", {
      name: "Education",
      description: "Courses and tutoring",
    });

    await upsertCategory("tutoring", {
      name: "Tutoring",
      parentId: educationId,
    });

    await upsertCategory("courses", {
      name: "Courses",
      parentId: educationId,
    });

    return { success: true, message: "All categories seeded successfully" };
  },
});
