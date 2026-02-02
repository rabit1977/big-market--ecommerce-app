import { mutation } from "./_generated/server";

export const clearAndSeedCategories = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. DELETE ALL EXISTING CATEGORIES
    const allCategories = await ctx.db.query("categories").collect();
    for (const cat of allCategories) {
      await ctx.db.delete(cat._id);
    }

    const upsertCategory = async (slug: string, data: any) => {
      return await ctx.db.insert("categories", {
        isActive: true,
        isFeatured: false,
        ...data,
        slug,
        createdAt: Date.now(),
      });
    };

    // Global Spec Helpers
    const condition = { label: "Condition", type: "select", key: "condition", options: ["New", "Like New", "Used", "For parts / Damaged"] };
    const brand = { label: "Brand", type: "text", key: "brand" };

    // ============================================
    // 1. MOTOR VEHICLES
    // ============================================
    const motorVehiclesId = await upsertCategory("motor-vehicles", { name: "Motor Vehicles", image: "🚗", isFeatured: true });
    
    const vehicleSpecs = [
      brand,
      { label: "Model", type: "text", key: "model", required: true },
      { label: "Year", type: "number", key: "year", required: true },
      { label: "Mileage (km)", type: "number", key: "mileage", required: true },
      { label: "Fuel", type: "select", key: "fuel", options: ["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG"] },
      { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic", "Semi-automatic"] },
      condition
    ];

    await upsertCategory("cars", { name: "Cars", parentId: motorVehiclesId, template: { fields: vehicleSpecs } });
    await upsertCategory("motorcycles-over-50", { name: "Motorcycles (> 50cc)", parentId: motorVehiclesId, template: { fields: vehicleSpecs } });
    await upsertCategory("mopeds-under-50", { name: "Mopeds (< 50cc)", parentId: motorVehiclesId });
    await upsertCategory("electric-scooters", { name: "Electric Scooters", parentId: motorVehiclesId });
    await upsertCategory("buses", { name: "Buses", parentId: motorVehiclesId, template: { fields: [...vehicleSpecs, { label: "Seats", type: "number", key: "seats" }] } });
    await upsertCategory("vans", { name: "Vans", parentId: motorVehiclesId, template: { fields: vehicleSpecs } });
    await upsertCategory("trucks", { name: "Trucks", parentId: motorVehiclesId, template: { fields: [...vehicleSpecs, { label: "Payload (kg)", type: "number", key: "payload" }] } });
    await upsertCategory("trailers", { name: "Trailers", parentId: motorVehiclesId });
    await upsertCategory("damaged-vehicles", { name: "Damaged / For Parts", parentId: motorVehiclesId });
    await upsertCategory("camping-vehicles", { name: "Camping Vehicles", parentId: motorVehiclesId });

    const agriculturalId = await upsertCategory("agricultural-vehicles", { name: "Agricultural Vehicles", parentId: motorVehiclesId });
    await upsertCategory("tractors", { name: "Tractors", parentId: agriculturalId, template: { fields: [brand, { label: "Power (HP)", type: "number", key: "hp" }, { label: "Year", type: "number", key: "year" }] } });
    await upsertCategory("harvesters", { name: "Harvesters", parentId: agriculturalId });
    await upsertCategory("attachment-machines", { name: "Attachment Machines", parentId: agriculturalId });
    await upsertCategory("forestry-machines", { name: "Forestry Machines", parentId: agriculturalId });

    await upsertCategory("heavy-vehicles", { name: "Heavy Vehicles / Construction", parentId: motorVehiclesId });
    await upsertCategory("boats", { name: "Boats / Jet Skis", parentId: motorVehiclesId });
    await upsertCategory("auto-parts", { name: "Auto Parts & Equipment", parentId: motorVehiclesId });
    await upsertCategory("motorcycle-parts", { name: "Motorcycle Parts & Clothing", parentId: motorVehiclesId });
    await upsertCategory("towing-service", { name: "Towing Service", parentId: motorVehiclesId });
    await upsertCategory("vehicle-buy-up", { name: "Vehicle Buy-up", parentId: motorVehiclesId });

    // ============================================
    // 2. REAL ESTATE
    // ============================================
    const realEstateId = await upsertCategory("real-estate", { name: "Real Estate", image: "🏠", isFeatured: true });
    
    const estateSpecs = (isLand = false) => [
      { label: "Type", type: "select", key: "offer_type", options: ["Sale", "Rent"] },
      { label: isLand ? "Area (m²)" : "Size (m²)", type: "number", key: "sqm", required: true },
      ...(!isLand ? [
        { label: "Rooms", type: "select", key: "rooms", options: ["1", "2", "3", "4", "5+"] },
        { label: "Floor", type: "number", key: "floor" },
        { label: "Heating", type: "select", key: "heating", options: ["Central", "Electricity", "Wood", "Inverter"] }
      ] : [])
    ];

    await upsertCategory("apartments", { name: "Apartments", parentId: realEstateId, template: { fields: estateSpecs() } });
    await upsertCategory("houses-villas", { name: "Houses / Villas", parentId: realEstateId, template: { fields: estateSpecs() } });
    await upsertCategory("business-space", { name: "Business Space", parentId: realEstateId, template: { fields: estateSpecs() } });
    await upsertCategory("plots-land", { name: "Plots and Fields", parentId: realEstateId, template: { fields: estateSpecs(true) } });
    await upsertCategory("garages", { name: "Garages", parentId: realEstateId });

    // ============================================
    // 3. ELECTRONICS
    // ============================================
    const electronicsId = await upsertCategory("electronics", { name: "Electronics", image: "📱", isFeatured: true });
    
    const phonesId = await upsertCategory("mobile-phones", { name: "Mobile Phones", parentId: electronicsId });
    const phoneSpecs = [brand, { label: "Model", type: "text", key: "model" }, { label: "Storage", type: "select", key: "storage", options: ["64GB", "128GB", "256GB", "512GB", "1TB"] }, condition];
    await upsertCategory("iphone", { name: "iPhone", parentId: phonesId, template: { fields: phoneSpecs } });
    await upsertCategory("samsung", { name: "Samsung", parentId: phonesId, template: { fields: phoneSpecs } });
    await upsertCategory("phone-accessories", { name: "Phone Accessories", parentId: phonesId });

    const computersId = await upsertCategory("computers", { name: "Computers", parentId: electronicsId });
    await upsertCategory("laptops", { name: "Laptops", parentId: computersId, template: { fields: [brand, { label: "RAM", type: "select", key: "ram", options: ["8GB", "16GB", "32GB", "64GB+"] }, condition] } });
    await upsertCategory("desktop-pcs", { name: "Desktop PCs", parentId: computersId });
    await upsertCategory("computer-accessories", { name: "Accessories & Parts", parentId: computersId });

    const tvPhotoId = await upsertCategory("tv-video-photo", { name: "TV, Video & Photo", parentId: electronicsId });
    await upsertCategory("televisions", { name: "Televisions", parentId: tvPhotoId });
    await upsertCategory("cameras", { name: "Cameras & Photo", parentId: tvPhotoId });
    await upsertCategory("gaming-consoles", { name: "Gaming & Consoles", parentId: electronicsId });

    // ============================================
    // 4. HOME & GARDEN
    // ============================================
    const homeGardenId = await upsertCategory("home-garden", { name: "Home & Garden", image: "🏡" });
    const furnitureId = await upsertCategory("furniture", { name: "Furniture", parentId: homeGardenId });
    await upsertCategory("living-room", { name: "Living Room", parentId: furnitureId });
    await upsertCategory("bedroom", { name: "Bedroom", parentId: furnitureId });
    await upsertCategory("kitchen", { name: "Kitchen", parentId: furnitureId });

    const appliancesId = await upsertCategory("home-appliances", { name: "Home Appliances", parentId: homeGardenId });
    await upsertCategory("refrigerators", { name: "Refrigerators", parentId: appliancesId, template: { fields: [brand, condition] } });
    await upsertCategory("washing-machines", { name: "Washing Machines", parentId: appliancesId });
    await upsertCategory("garden-equipment", { name: "Garden", parentId: homeGardenId });

    // ============================================
    // 5. FASHION
    // ============================================
    const fashionId = await upsertCategory("fashion", { name: "Fashion", image: "👗" });
    const maleFashionId = await upsertCategory("mens-fashion", { name: "Men's Fashion", parentId: fashionId });
    await upsertCategory("mens-clothing", { name: "Clothing", parentId: maleFashionId });
    await upsertCategory("mens-shoes", { name: "Shoes", parentId: maleFashionId });
    
    const femaleFashionId = await upsertCategory("womens-fashion", { name: "Women's Fashion", parentId: fashionId });
    await upsertCategory("womens-clothing", { name: "Clothing", parentId: femaleFashionId });
    await upsertCategory("womens-shoes", { name: "Shoes", parentId: femaleFashionId });
    await upsertCategory("watches-jewelry", { name: "Watches & Jewelry", parentId: fashionId });

    // ============================================
    // 6. BABY & KIDS
    // ============================================
    const babyId = await upsertCategory("baby-kids", { name: "Baby & Kids", image: "👶" });
    await upsertCategory("baby-clothing", { name: "Clothing", parentId: babyId });
    await upsertCategory("baby-toys", { name: "Toys", parentId: babyId });
    await upsertCategory("baby-equipment", { name: "Equipment (Strollers, Seats)", parentId: babyId });

    // ============================================
    // 7. SPORTS & HOBBIES
    // ============================================
    const sportsHobbyId = await upsertCategory("sports-leisure", { name: "Sports & Leisure", image: "⚽" });
    await upsertCategory("bicycles", { name: "Bicycles", parentId: sportsHobbyId, template: { fields: [brand, condition] } });
    await upsertCategory("fitness-gym", { name: "Fitness & Gym", parentId: sportsHobbyId });
    await upsertCategory("fishing-hunting", { name: "Fishing & Hunting", parentId: sportsHobbyId });
    await upsertCategory("musical-instruments", { name: "Musical Instruments", parentId: sportsHobbyId });

    // ============================================
    // 8. BUSINESS & INDUSTRY
    // ============================================
    const businessId = await upsertCategory("business-industry", { name: "Business & Industry", image: "🛠️" });
    await upsertCategory("shop-equipment", { name: "Shop Equipment", parentId: businessId });
    await upsertCategory("catering-equipment", { name: "Catering", parentId: businessId });
    await upsertCategory("professional-machines", { name: "Professional Machines", parentId: businessId });
    await upsertCategory("office-supplies", { name: "Office Supplies", parentId: businessId });

    // ============================================
    // 9. PETS
    // ============================================
    const petsId = await upsertCategory("pets", { name: "Pets", image: "🐕" });
    await upsertCategory("dogs", { name: "Dogs", parentId: petsId });
    await upsertCategory("cats", { name: "Cats", parentId: petsId });
    await upsertCategory("pet-equipment", { name: "Pet Equipment", parentId: petsId });

    // ============================================
    // 10. JOBS
    // ============================================
    const jobsId = await upsertCategory("jobs", { name: "Jobs", image: "💼" });
    await upsertCategory("it-software-jobs", { name: "IT & Software", parentId: jobsId });
    await upsertCategory("sales-marketing-jobs", { name: "Sales & Marketing", parentId: jobsId });
    await upsertCategory("manual-labor-jobs", { name: "Manual Labor", parentId: jobsId });

    // ============================================
    // 11. SERVICES
    // ============================================
    const servicesId = await upsertCategory("services", { name: "Services", image: "🔧" });
    await upsertCategory("construction-repair", { name: "Construction & Repair", parentId: servicesId });
    await upsertCategory("transport-moving", { name: "Transport & Moving", parentId: servicesId });
    await upsertCategory("education-courses", { name: "Education & Courses", parentId: servicesId });

    // ============================================
    // 12. BOOKS & ART
    // ============================================
    const booksArtId = await upsertCategory("books-art", { name: "Books, Art & Collections", image: "📚" });
    await upsertCategory("books-literature", { name: "Books", parentId: booksArtId });
    await upsertCategory("art-paintings", { name: "Art & Paintings", parentId: booksArtId });
    await upsertCategory("antiques", { name: "Antiques", parentId: booksArtId });

    // ============================================
    // 13. HEALTH & BEAUTY
    // ============================================
    const healthBeautyId = await upsertCategory("health-beauty", { name: "Health & Beauty", image: "💄" });
    await upsertCategory("perfumes-cosmetics", { name: "Perfumes & Cosmetics", parentId: healthBeautyId });
    await upsertCategory("medical-equipment", { name: "Medical Equipment", parentId: healthBeautyId });

    return { success: true, message: "System PURGED and re-seeded with comprehensive English categories!" };
  },
});
