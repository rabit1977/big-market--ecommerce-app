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

    // ============================================
    // GLOBAL HELPERS
    // ============================================
    const condition = { label: "Condition", type: "select", key: "condition", options: ["New", "Like New", "Used", "For parts / Damaged"] };
    const brand = (ph: string) => ({ label: "Brand", type: "text", key: "brand", placeholder: ph });
    const model = (ph: string) => ({ label: "Model", type: "text", key: "model", placeholder: ph });
    
    // ============================================
    // 1. MOTOR VEHICLES
    // ============================================
    const motorVehiclesId = await upsertCategory("motor-vehicles", { name: "Motor Vehicles", image: "🚗", isFeatured: true });
    
    // Common Vehicle Specs
    const vehicleSpecs = (brandEx: string, modelEx: string) => [
      brand(brandEx),
      model(modelEx),
      { label: "Year", type: "number", key: "year", required: true, placeholder: "e.g. 2018" },
      { label: "Mileage (km)", type: "number", key: "mileage", required: true, placeholder: "e.g. 150000" },
      { label: "Fuel", type: "select", key: "fuel", options: ["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG"] },
      { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic", "Semi-automatic"] },
      { label: "Color", type: "text", key: "color", placeholder: "e.g. Black" },
      condition
    ];

    await upsertCategory("cars", { 
      name: "Cars", 
      parentId: motorVehiclesId, 
      template: { 
        titlePlaceholder: "e.g. BMW X5 3.0d 2020 Sport",
        fields: [...vehicleSpecs("e.g. BMW", "e.g. 320d"), { label: "Body Type", type: "select", key: "body_type", options: ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon"] }] 
      } 
    });

    await upsertCategory("motorcycles", { 
      name: "Motorcycles (>50cc)", 
      parentId: motorVehiclesId, 
      template: { 
        titlePlaceholder: "e.g. Honda CBR 600RR 2019",
        fields: vehicleSpecs("e.g. Honda", "e.g. CBR 1000RR") 
      } 
    });

    await upsertCategory("mopeds", { 
      name: "Mopeds (<50cc)", 
      parentId: motorVehiclesId,
      template: { titlePlaceholder: "e.g. Aprilia SR 50", fields: vehicleSpecs("e.g. Aprilia", "e.g. SR 50") }
    });

    await upsertCategory("electric-scooters", { 
      name: "Electric Scooters", 
      parentId: motorVehiclesId,
      template: { titlePlaceholder: "e.g. Xiaomi Pro 2", fields: [brand("e.g. Xiaomi"), model("e.g. M365"), condition] } 
    });

    await upsertCategory("buses", { 
      name: "Buses", 
      parentId: motorVehiclesId,
      template: { titlePlaceholder: "e.g. Mercedes Sprinter Minibus", fields: [...vehicleSpecs("e.g. Mercedes", "e.g. Sprinter"), { label: "Seats", type: "number", key: "seats", placeholder: "e.g. 20" }] }
    });

    await upsertCategory("vans", { 
      name: "Vans", 
      parentId: motorVehiclesId,
      template: { titlePlaceholder: "e.g. Ford Transit Custom", fields: vehicleSpecs("e.g. Ford", "e.g. Transit") }
    });

    await upsertCategory("trucks", { 
      name: "Trucks", 
      parentId: motorVehiclesId,
      template: { titlePlaceholder: "e.g. Volvo FH 500", fields: [...vehicleSpecs("e.g. Volvo", "e.g. FH"), { label: "Payload (kg)", type: "number", key: "payload", placeholder: "e.g. 5000" }] }
    });

    await upsertCategory("trailers", { 
      name: "Trailers", 
      parentId: motorVehiclesId,
      template: { titlePlaceholder: "e.g. Humbaur Car Trailer", fields: [brand("e.g. Humbaur"), { label: "Max Load (kg)", type: "number", key: "load", placeholder: "e.g. 750" }, condition] }
    });

    await upsertCategory("damaged-vehicles", { name: "Damaged Vehicles / For Parts", parentId: motorVehiclesId, template: { titlePlaceholder: "e.g. VW Golf 5 for parts", fields: [brand("e.g. VW"), model("e.g. Golf 5")] } });
    await upsertCategory("camping-vehicles", { name: "Camping Vehicles", parentId: motorVehiclesId, template: { titlePlaceholder: "e.g. Fiat Ducato Camper", fields: vehicleSpecs("e.g. Fiat", "e.g. Ducato") } });

    // Agricultural
    const agriculturalId = await upsertCategory("agricultural-vehicles", { name: "Agricultural Vehicles", parentId: motorVehiclesId });
    const agriSpecs = [brand("e.g. John Deere"), { label: "Power (HP)", type: "number", key: "hp", placeholder: "e.g. 100" }, { label: "Year", type: "number", key: "year", placeholder: "e.g. 2015" }, condition];

    await upsertCategory("tractors", { name: "Tractors", parentId: agriculturalId, template: { titlePlaceholder: "e.g. IMT 539 Deluxe", fields: agriSpecs } });
    await upsertCategory("attachment-machines", { name: "Attachment Machines", parentId: agriculturalId, template: { titlePlaceholder: "e.g. Plough 3 furrows", fields: [brand("e.g. Lemken"), condition] } });
    await upsertCategory("combines", { name: "Combines", parentId: agriculturalId, template: { titlePlaceholder: "e.g. Claas Dominator", fields: agriSpecs } });
    await upsertCategory("forestry-machines", { name: "Forestry Machines", parentId: agriculturalId, template: { titlePlaceholder: "e.g. Timberjack skidder", fields: agriSpecs } });
    await upsertCategory("agri-spare-parts", { name: "Spare Parts", parentId: agriculturalId, template: { titlePlaceholder: "e.g. Tractor Tire 16.9-28", fields: [brand("e.g. Michelin"), condition] } });
    await upsertCategory("agri-other", { name: "Other", parentId: agriculturalId, template: { titlePlaceholder: "e.g. Agri Equipment", fields: [] } });

    // Heavy/Construction
    const heavyConstructionId = await upsertCategory("heavy-construction", { name: "Heavy Vehicles & Construction", parentId: motorVehiclesId });
    const heavySpecs = [brand("e.g. CAT"), model("e.g. 320"), { label: "Year", type: "number", key: "year", placeholder: "e.g. 2018" }, { label: "Hours", type: "number", key: "hours", placeholder: "e.g. 5000" }, condition];

    await upsertCategory("cargo-towing", { name: "Cargo & Towing Vehicles", parentId: heavyConstructionId, template: { titlePlaceholder: "e.g. Man TGA Tow Truck", fields: heavySpecs } });
    await upsertCategory("construction-machines", { name: "Construction Machines", parentId: heavyConstructionId, template: { titlePlaceholder: "e.g. JCB 3CX Backhoe", fields: heavySpecs } });
    await upsertCategory("forklifts", { name: "Forklifts & Load Handling", parentId: heavyConstructionId, template: { titlePlaceholder: "e.g. Linde H30", fields: [brand("e.g. Linde"), { label: "Capacity (kg)", type: "number", key: "capacity", placeholder: "e.g. 3000" }, condition] } });
    await upsertCategory("heavy-spare-parts", { name: "Spare Parts", parentId: heavyConstructionId, template: { titlePlaceholder: "e.g. Hydraulic Pump for CAT", fields: [brand("e.g. CAT"), condition] } });
    await upsertCategory("heavy-other", { name: "Other", parentId: heavyConstructionId, template: { titlePlaceholder: "e.g. Other Heavy Equipment", fields: [] } });

    await upsertCategory("boats-watercraft", { name: "Boats, Ships & Jet Skis", parentId: motorVehiclesId, template: { titlePlaceholder: "e.g. Bayliner 175", fields: [brand("e.g. Bayliner"), { label: "Length (m)", type: "number", key: "length", placeholder: "e.g. 5.5" }, { label: "Year", type: "number", key: "year", placeholder: "e.g. 2010" }] } });

    // Auto Parts
    const autoPartsId = await upsertCategory("auto-parts", { name: "Auto Parts & Equipment", parentId: motorVehiclesId });
    const partSpecs = [brand("e.g. Bosch"), { label: "Fits Car Brand", type: "text", key: "fits_car", placeholder: "e.g. BMW" }, condition];

    await upsertCategory("tires-rims", { name: "Tires & Rims", parentId: autoPartsId, template: { titlePlaceholder: "e.g. 4x Michelin 205/55/16 Winter", fields: [{ label: "Size", type: "text", key: "size", placeholder: "e.g. 205/55 R16" }, { label: "Season", type: "select", key: "season", options: ["Summer", "Winter", "All-Season"] }, condition] } });
    await upsertCategory("car-audio-nav", { name: "Car Hi-Fi & Navigation", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Android Navigation for VW Golf 7", fields: partSpecs } });
    await upsertCategory("car-spare-parts", { name: "Spare Parts", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Alternator for Audi A4", fields: partSpecs } });
    await upsertCategory("car-tuning", { name: "Tuning", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Sport Springs Eibach", fields: partSpecs } });
    await upsertCategory("car-styling", { name: "Styling & Sports Equipment", parentId: autoPartsId, template: { titlePlaceholder: "e.g. M-Performance Diffuser", fields: partSpecs } });
    await upsertCategory("oil-additives", { name: "Motor Oil & Additives", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Castrol Edge 5w30 5L", fields: [brand("e.g. Castrol"), { label: "Viscosity", type: "text", key: "viscosity", placeholder: "e.g. 5W-30" }] } });
    await upsertCategory("car-care", { name: "Car Care", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Sonax Polish", fields: [brand("e.g. Sonax")] } });
    await upsertCategory("car-accessories", { name: "Car Accessories", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Floor Mats for Passat B8", fields: partSpecs } });
    await upsertCategory("roof-racks", { name: "Roof Racks / Trunk", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Thule Roof Box", fields: [brand("e.g. Thule"), condition] } });
    await upsertCategory("car-tools", { name: "Tools", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Jack Stand 2t", fields: [brand("e.g. Yato"), condition] } });
    await upsertCategory("repair-manuals", { name: "Repair Manuals & Books", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Haynes Manual Ford Focus", fields: [] } });
    await upsertCategory("car-parts-other", { name: "Other", parentId: autoPartsId, template: { titlePlaceholder: "e.g. Other Auto Part", fields: [] } });

    await upsertCategory("moto-parts", { name: "Moto Parts & Equipment", parentId: motorVehiclesId, template: { titlePlaceholder: "e.g. Akrapovic Exhaust for Yamaha R1", fields: partSpecs } });
    await upsertCategory("towing-service", { name: "Towing Service", parentId: motorVehiclesId, template: { titlePlaceholder: "e.g. Towing Service 24/7 Skopje", fields: [{label: "Location", type: "text", key: "location", placeholder: "e.g. Skopje"}] } });
    await upsertCategory("vehicle-buyout", { name: "Vehicle Buyout", parentId: motorVehiclesId, template: { titlePlaceholder: "e.g. Buying Damaged Cars", fields: [{label: "Buying", type: "text", key: "buying", placeholder: "e.g. Any cars up to 2010"}] } });
    await upsertCategory("motor-other", { name: "Other", parentId: motorVehiclesId, template: { titlePlaceholder: "e.g. Other Motor Item", fields: [] } });

    // ============================================
    // 2. REAL ESTATE
    // ============================================
    const realEstateId = await upsertCategory("real-estate", { name: "Real Estate", image: "🏠", isFeatured: true });
    
    // Estate Helpers
    const estateSpecs = (isLand = false, isBusiness = false) => [
      { label: "Type", type: "select", key: "offer_type", options: ["Sale", "Rent"] },
      { label: isLand ? "Area (m²)" : "Size (m²)", type: "number", key: "sqm", required: true, placeholder: "e.g. 75" },
      { label: "Location", type: "text", key: "location", placeholder: "e.g. Center, Karpos 3" },
      { label: "Price", type: "number", key: "price", placeholder: "e.g. 50000" },
      ...(!isLand ? [
        { label: "Rooms", type: "select", key: "rooms", options: ["Studio", "1", "2", "3", "4", "5+"] },
        { label: "Floor", type: "number", key: "floor", placeholder: "e.g. 3" },
        { label: "Total Floors", type: "number", key: "total_floors", placeholder: "e.g. 5" },
        { label: "Heating", type: "select", key: "heating", options: ["Central", "Electricity", "Wood", "Inverter", "None", "Floor"] },
        { label: "Furnished", type: "select", key: "furnished", options: ["Yes", "No", "Semi", "Empty"] },
        { label: "Condition", type: "select", key: "condition", options: ["New", "Renovated", "Solid", "Old Construction", "Under Construction"] },
        { label: "Orientation", type: "select", key: "orientation", options: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"] },
        { label: "Balcony", type: "select", key: "balcony", options: ["Yes", "No"] },
        { label: "Parking/Garage", type: "select", key: "parking", options: ["Yes", "No"] },
        { label: "Lift", type: "select", key: "lift", options: ["Yes", "No"] }
      ] : []),
      ...((isBusiness) ? [
        { label: "Business Type", type: "select", key: "business_type", options: ["Office", "Warehouse", "Store", "Industrial", "Catering"] }
      ] : [])
    ];

    await upsertCategory("houses", { name: "Houses / Villas", parentId: realEstateId, template: { titlePlaceholder: "e.g. Luxury Villa in Vodno", fields: [...estateSpecs(), { label: "Yard Area (m²)", type: "number", key: "yard_size", placeholder: "e.g. 300" }] } });
    await upsertCategory("apartments", { name: "Apartments", parentId: realEstateId, template: { titlePlaceholder: "e.g. 2-Bedroom Apartment in Center", fields: estateSpecs() } });
    await upsertCategory("rooms", { name: "Rooms", parentId: realEstateId, template: { titlePlaceholder: "e.g. Single Room for Student", fields: estateSpecs() } });
    await upsertCategory("weekend-houses", { name: "Weekend Houses", parentId: realEstateId, template: { titlePlaceholder: "e.g. Weekend House in Mavrovo", fields: [...estateSpecs(), { label: "Yard Area (m²)", type: "number", key: "yard_size", placeholder: "e.g. 500" }] } });
    await upsertCategory("shops", { name: "Shops / Stores", parentId: realEstateId, template: { titlePlaceholder: "e.g. Shop in GTC", fields: estateSpecs(false, true) } });
    
    // Business Space & Subcategories
    const businessSpaceId = await upsertCategory("business-space", { name: "Business Space", parentId: realEstateId, template: { titlePlaceholder: "e.g. Office Space 200m2", fields: estateSpecs(false, true) } });
    await upsertCategory("industry-workshop", { name: "Industry & Workshop", parentId: businessSpaceId, template: { titlePlaceholder: "e.g. Production Hall", fields: estateSpecs(false, true) } });
    await upsertCategory("offices", { name: "Offices", parentId: businessSpaceId, template: { titlePlaceholder: "e.g. Modern Office", fields: estateSpecs(false, true) } });
    await upsertCategory("warehouses-business", { name: "Warehouses", parentId: businessSpaceId, template: { titlePlaceholder: "e.g. Storage Warehouse", fields: estateSpecs(false, true) } });
    await upsertCategory("other-business", { name: "Other", parentId: businessSpaceId, template: { titlePlaceholder: "e.g. Other Business Space", fields: estateSpecs(false, true) } });

    await upsertCategory("roommates", { name: "Roommates", parentId: realEstateId, template: { titlePlaceholder: "e.g. Roommate wanted for Apartment in Aerodrom", fields: [{label: "Gender Preference", type: "select", key: "gender", options:["Male", "Female", "Any"]}, {label: "Price per Month", type: "number", key: "price"}] } });
    await upsertCategory("garages", { name: "Garages", parentId: realEstateId, template: { titlePlaceholder: "e.g. Garage in Aerodrom", fields: [estateSpecs(true)[0], estateSpecs(true)[1], {label: "Type", type: "select", key: "garage_type", options: ["Underground", "External", "Parking Spot"]}] } });
    await upsertCategory("land", { name: "Plots & Land", parentId: realEstateId, template: { titlePlaceholder: "e.g. Building Plot in Sopiste", fields: [...estateSpecs(true), {label: "Type", type: "select", key: "land_type", options: ["Building", "Agricultural", "Industrial"]}] } });
    await upsertCategory("warehouses", { name: "Warehouses (General)", parentId: realEstateId, template: { titlePlaceholder: "e.g. Large Warehouse", fields: estateSpecs(false, true) } });
    await upsertCategory("shacks", { name: "Shacks, Kiosks, Booths", parentId: realEstateId, template: { titlePlaceholder: "e.g. Kiosk in Center", fields: estateSpecs(false, true) } });
    await upsertCategory("new-construction", { name: "New Construction", parentId: realEstateId, template: { titlePlaceholder: "e.g. New Apartment Building", fields: estateSpecs() } });
    await upsertCategory("abroad", { name: "Real Estate Abroad", parentId: realEstateId, template: { titlePlaceholder: "e.g. Apartment in Greece", fields: estateSpecs() } });
    await upsertCategory("real-estate-other", { name: "Other", parentId: realEstateId, template: { titlePlaceholder: "e.g. Other Real Estate", fields: [] } });

    // ============================================
    // 3. ELECTRONICS
    // ============================================
    const electronicsId = await upsertCategory("electronics", { name: "Electronics", image: "📱", isFeatured: true });
    
    // Specs
    // Specs
    const phoneSpecs = [brand("e.g. Apple"), model("e.g. iPhone 13"), { label: "Storage", type: "select", key: "storage", options: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] }, { label: "Color", type: "text", key: "color", placeholder: "e.g. Midnight Green" }, condition];

    const phonesId = await upsertCategory("mobile-phones", { name: "Mobile Phones", parentId: electronicsId });
    await upsertCategory("iphone", { name: "iPhone", parentId: phonesId, template: { titlePlaceholder: "e.g. iPhone 14 Pro 128GB", fields: phoneSpecs } });
    await upsertCategory("samsung", { name: "Samsung", parentId: phonesId, template: { titlePlaceholder: "e.g. Samsung S23 Ultra", fields: phoneSpecs } });
    await upsertCategory("xiaomi", { name: "Xiaomi", parentId: phonesId, template: { titlePlaceholder: "e.g. Redmi Note 12", fields: phoneSpecs } });
    await upsertCategory("huawei", { name: "Huawei", parentId: phonesId, template: { titlePlaceholder: "e.g. P50 Pro", fields: phoneSpecs } });
    await upsertCategory("google", { name: "Google Pixel", parentId: phonesId, template: { titlePlaceholder: "e.g. Pixel 7", fields: phoneSpecs } });
    await upsertCategory("other-phones", { name: "Other Phones", parentId: phonesId, template: { titlePlaceholder: "e.g. Nokia 3310", fields: phoneSpecs } });
    
    await upsertCategory("phone-accessories", { name: "Phone Accessories", parentId: phonesId, template: { titlePlaceholder: "e.g. Case for iPhone 13", fields: [brand("e.g. Spigen"), { label: "Type", type: "text", key: "type", placeholder: "e.g. Case / Charger" }] } });
    await upsertCategory("smartwatches", { name: "Smartwatches & Trackers", parentId: phonesId, template: { titlePlaceholder: "e.g. Apple Watch Series 8", fields: [brand("e.g. Apple"), { label: "Type", type: "select", key: "type", options: ["Smartwatch", "Fitness Tracker", "Band"] }, condition] } });

    const computersId = await upsertCategory("computers", { name: "Computers", parentId: electronicsId });
    const pcSpecs = [brand("e.g. Lenovo"), { label: "Processor", type: "text", key: "cpu", placeholder: "e.g. i7-12700H" }, { label: "RAM", type: "select", key: "ram", options: ["4GB", "8GB", "16GB", "32GB", "64GB+"] }, { label: "Storage", type: "text", key: "ssd", placeholder: "e.g. 512GB SSD" }, { label: "Graphics", type: "text", key: "gpu", placeholder: "e.g. RTX 3060" }, condition];
    
    await upsertCategory("laptops", { name: "Laptops", parentId: computersId, template: { titlePlaceholder: "e.g. MacBook Pro M1 16GB", fields: pcSpecs } });
    await upsertCategory("desktops", { name: "Desktop PCs", parentId: computersId, template: { titlePlaceholder: "e.g. Gaming PC RTX 3080", fields: pcSpecs } });
    await upsertCategory("monitors", { name: "Monitors", parentId: computersId, template: { titlePlaceholder: "e.g. Dell U2419H IPS", fields: [brand("e.g. Dell"), { label: "Size (inch)", type: "number", key: "size", placeholder: "e.g. 24" }, { label: "Refresh Rate (Hz)", type: "text", key: "hz", placeholder: "e.g. 144Hz" }, condition] } });
    
    // Detailed PC Parts
    const partsId = await upsertCategory("pc-parts", { name: "Computer Parts", parentId: computersId });
    await upsertCategory("gpu", { name: "Graphics Cards", parentId: partsId, template: { titlePlaceholder: "e.g. RTX 3060 Ti", fields: [brand("e.g. NVIDIA"), { label: "Memory (GB)", type: "text", key: "vram", placeholder: "e.g. 8GB" }, condition] } });
    await upsertCategory("cpu", { name: "Processors (CPU)", parentId: partsId, template: { titlePlaceholder: "e.g. Ryzen 7 5800x", fields: [brand("e.g. AMD"), { label: "Socket", type: "text", key: "socket", placeholder: "e.g. AM4" }, condition] } });
    await upsertCategory("ram", { name: "RAM", parentId: partsId, template: { titlePlaceholder: "e.g. Corsair Vengeance 16GB", fields: [brand("e.g. Corsair"), { label: "Type", type: "select", key: "type", options: ["DDR3", "DDR4", "DDR5"] }, condition] } });
    await upsertCategory("motherboards", { name: "Motherboards", parentId: partsId, template: { titlePlaceholder: "e.g. ASUS ROG Strix B550", fields: [brand("e.g. ASUS")] } });
    await upsertCategory("storage-drives", { name: "Storage (SSD/HDD)", parentId: partsId, template: { titlePlaceholder: "e.g. Samsung 980 Pro 1TB", fields: [brand("e.g. Samsung"), {label: "Capacity", type: "text", key:"size"}] } });

    await upsertCategory("tablets", { name: "Tablets", parentId: computersId, template: { titlePlaceholder: "e.g. iPad Air 5", fields: phoneSpecs } });
    await upsertCategory("peripherals", { name: "Peripherals", parentId: computersId, template: { titlePlaceholder: "e.g. Logitech MX Master 3", fields: [brand("e.g. Logitech"), { label: "Type", type: "text", key: "type", placeholder: "e.g. Mouse / Keyboard" }, condition] } });
    await upsertCategory("software", { name: "Software", parentId: computersId, template: { titlePlaceholder: "e.g. Windows 11 License", fields: [] } });
    await upsertCategory("mining-crypto", { name: "Mining & Crypto", parentId: computersId, template: { titlePlaceholder: "e.g. Mining Rig 6xRx580", fields: [] } });
    await upsertCategory("gaming", { name: "Gaming Equipment", parentId: computersId, template: { titlePlaceholder: "e.g. Gaming Chair Razer", fields: [] } });
    await upsertCategory("projectors", { name: "Projectors", parentId: computersId, template: { titlePlaceholder: "e.g. Epson EB-1", fields: [brand("e.g. Epson"), {label: "Resolution", type:"text", key:"res"}, condition] } });

    const tvPhotoId = await upsertCategory("tv-video-photo", { name: "TV, Video & Photo", parentId: electronicsId });
    await upsertCategory("televisions", { name: "Televisions", parentId: tvPhotoId, template: { titlePlaceholder: "e.g. Samsung 55\" 4K Smart TV", fields: [brand("e.g. Samsung"), { label: "Screen Size (inch)", type: "number", key: "size", placeholder: "e.g. 55" }, { label: "Resolution", type: "select", key: "res", options: ["HD", "Full HD", "4K", "8K"] }, { label: "Technology", type: "select", key: "tech", options: ["LED", "OLED", "QLED", "LCD"] }, { label: "Smart TV", type: "select", key: "smart", options: ["Yes", "No"] }, condition] } });
    await upsertCategory("cameras", { name: "Cameras", parentId: tvPhotoId, template: { titlePlaceholder: "e.g. Sony A7 III Body", fields: [brand("e.g. Sony"), { label: "Type", type: "select", key: "type", options: ["DSLR", "Mirrorless", "Point & Shoot", "Action", "Drone"] }, { label: "Resolution (MP)", type: "number", key: "megapixels", placeholder: "e.g. 24" }, condition] } });
    await upsertCategory("lenses", { name: "Lenses", parentId: tvPhotoId, template: { titlePlaceholder: "e.g. Sigma 24-70mm f/2.8", fields: [brand("e.g. Sigma"), { label: "Mount", type: "text", key: "mount", placeholder: "e.g. Sony E" }, condition] } });
    await upsertCategory("gaming-consoles", { name: "Gaming Consoles", parentId: electronicsId, template: { titlePlaceholder: "e.g. PlayStation 5 Disc Edition", fields: [brand("e.g. Sony"), model("e.g. PS5"), {label: "Storage", type:"text", key:"storage"}, condition] } });
    await upsertCategory("drones", { name: "Drones", parentId: tvPhotoId, template: { titlePlaceholder: "e.g. DJI Mavic 3", fields: [brand("e.g. DJI"), condition] } });
    await upsertCategory("audio-equipment", { name: "Audio", parentId: tvPhotoId, template: { titlePlaceholder: "e.g. JBL PartyBox 310", fields: [brand("e.g. JBL"), { label: "Type", type: "select", key: "type", options: ["Speaker", "Headphones", "Soundbar", "Amplifier", "Receiver"] }, condition] } });


    // ============================================
    // 4. HOME & GARDEN
    // ============================================
    const homeGardenId = await upsertCategory("home-garden", { name: "Home & Garden", image: "🏡" });
    const furnitureSpecs = [brand("e.g. Ikea"), { label: "Material", type: "text", key: "material", placeholder: "e.g. Oak Wood" }, { label: "Color", type: "text", key: "color", placeholder: "e.g. White" }, condition];
    
    const furnitureId = await upsertCategory("furniture", { name: "Furniture", parentId: homeGardenId });
    await upsertCategory("living-room", { name: "Living Room", parentId: furnitureId, template: { titlePlaceholder: "e.g. Corner Sofa Grey", fields: furnitureSpecs } });
    await upsertCategory("bedroom", { name: "Bedroom", parentId: furnitureId, template: { titlePlaceholder: "e.g. Double Bed with Mattress", fields: furnitureSpecs } });
    await upsertCategory("kitchen", { name: "Kitchen", parentId: furnitureId, template: { titlePlaceholder: "e.g. Dining Table + 4 Chairs", fields: furnitureSpecs } });
    await upsertCategory("home-decoration", { name: "Home Decoration", parentId: homeGardenId, template: { titlePlaceholder: "e.g. Large Wall Mirror", fields: [] } });

    const appliancesId = await upsertCategory("home-appliances", { name: "White Goods & Appliances", parentId: homeGardenId });
    const applianceSpecs = (typeEx: string) => [brand("e.g. Beko"), { label: "Energy Class", type: "select", key: "class", options: ["A", "B", "C", "D", "E"] }, condition];
    
    await upsertCategory("refrigerators", { name: "Refrigerators & Freezers", parentId: appliancesId, template: { titlePlaceholder: "e.g. LG Side-by-Side Fridge", fields: [brand("e.g. LG"), { label: "Type", type: "select", key: "type", options: ["Fridge", "Freezer", "Combo"] }, {label: "Height (cm)", type:"number", key:"height"}, condition] } });
    await upsertCategory("washing-machines", { name: "Washing Machines", parentId: appliancesId, template: { titlePlaceholder: "e.g. Beko 7kg Washing Machine", fields: [brand("e.g. Beko"), { label: "Capacity (kg)", type: "number", key: "capacity", placeholder: "e.g. 7" }, {label: "RPM", type: "number", key: "rpm", placeholder: "e.g. 1400"}, condition] } });
    await upsertCategory("dishwashers", { name: "Dishwashers", parentId: appliancesId, template: { titlePlaceholder: "e.g. Bosch Series 4", fields: [brand("e.g. Bosch"), { label: "Width", type: "select", key: "width", options: ["45cm", "60cm"] }, condition] } });
    await upsertCategory("ovens-stoves", { name: "Cookers & Ovens", parentId: appliancesId, template: { titlePlaceholder: "e.g. Gorenje Electric Stove", fields: [brand("e.g. Gorenje"), { label: "Type", type: "select", key: "type", options: ["Electric", "Gas", "Combined", "Built-in"] }, condition] } });
    await upsertCategory("ac-heating", { name: "Heating & Cooling", parentId: appliancesId, template: { titlePlaceholder: "e.g. Gree Inverter 3.5kW", fields: [brand("e.g. Gree"), { label: "Type", type: "select", key: "type", options: ["Inverter AC", "Standard AC", "Heater", "Panel"] }, {label: "Power (kW)", type:"number", key:"power"}, condition] } });
    await upsertCategory("small-appliances", { name: "Small Kitchen Appliances", parentId: appliancesId, template: { titlePlaceholder: "e.g. Air Fryer Philips", fields: [brand("e.g. Philips"), { label: "Type", type: "text", key: "type", placeholder: "e.g. Blender / Mixer" }] } });
    await upsertCategory("vacuums", { name: "Vacuums & Cleaning", parentId: appliancesId, template: { titlePlaceholder: "e.g. Dyson V15", fields: [brand("e.g. Dyson"), { label: "Type", type: "select", key: "type", options: ["Standard", "Handheld", "Robot"] }, condition] } });
    
    await upsertCategory("dishes-cutlery", { name: "Dishes & Cutlery", parentId: homeGardenId, template: { titlePlaceholder: "e.g. Dinner Set 18 pcs", fields: [] } });
    await upsertCategory("garden", { name: "Garden", parentId: homeGardenId, template: { titlePlaceholder: "e.g. Garden Table and Chairs", fields: furnitureSpecs } });
    await upsertCategory("lights", { name: "Lighting", parentId: homeGardenId, template: { titlePlaceholder: "e.g. Ceiling Chandelier", fields: [] } });
    
    // ============================================
    // 5. FASHION
    // ============================================
    const fashionId = await upsertCategory("fashion", { name: "Fashion", image: "👗" });
    const clothingSpecs = [brand("e.g. Zara"), { label: "Size", type: "text", key: "size", placeholder: "e.g. L / 40" }, { label: "Color", type: "text", key: "color", placeholder: "e.g. Blue" }, condition];

    const maleFashionId = await upsertCategory("mens-fashion", { name: "Men's Fashion", parentId: fashionId });
    await upsertCategory("mens-clothing", { name: "Clothing", parentId: maleFashionId, template: { titlePlaceholder: "e.g. Hugo Boss Suit", fields: clothingSpecs } });
    await upsertCategory("mens-shoes", { name: "Shoes", parentId: maleFashionId, template: { titlePlaceholder: "e.g. Nike Air Max 90", fields: clothingSpecs } });
    
    const femaleFashionId = await upsertCategory("womens-fashion", { name: "Women's Fashion", parentId: fashionId });
    await upsertCategory("womens-clothing", { name: "Clothing", parentId: femaleFashionId, template: { titlePlaceholder: "e.g. Summer Dress Floral", fields: clothingSpecs } });
    await upsertCategory("womens-shoes", { name: "Shoes", parentId: femaleFashionId, template: { titlePlaceholder: "e.g. Leather Boots", fields: clothingSpecs } });
    
    await upsertCategory("fashion-accessories", { name: "Accessories", parentId: fashionId, template: { titlePlaceholder: "e.g. Ray-Ban Sunglasses", fields: [brand("e.g. Ray-Ban")] } });
    await upsertCategory("watches-jewelry", { name: "Watches & Jewelry", parentId: fashionId, template: { titlePlaceholder: "e.g. Seiko 5 Automatic", fields: [brand("e.g. Seiko"), condition] } });

    // ============================================
    // 6. JOBS
    // ============================================
    const jobsId = await upsertCategory("jobs", { name: "Jobs", image: "💼" });
    const jobSpecs = [{ label: "Company", type: "text", key: "company", placeholder: "e.g. Acme Corp" }, { label: "Position", type: "text", key: "position", placeholder: "e.g. Sales Manager" }, { label: "Type", type: "select", key: "type", options: ["Full-time", "Part-time", "Contract", "Freelance"] }];
    
    await upsertCategory("job-offers", { name: "Job Offers", parentId: jobsId, template: { titlePlaceholder: "e.g. Experienced Electrician Needed", fields: jobSpecs } });
    await upsertCategory("job-seekers", { name: "Job Seekers", parentId: jobsId, template: { titlePlaceholder: "e.g. Mechanical Engineer Looking for Work", fields: [{label: "Profession", type: "text", key: "profession", placeholder: "e.g. Driver"}] } });
    
    // ============================================
    // 7. SERVICES
    // ============================================
    const servicesId = await upsertCategory("services", { name: "Services", image: "🔧" });
    const serviceSpecs = [{ label: "Location", type: "text", key: "location", placeholder: "e.g. Skopje & Surroundings" }, { label: "Availability", type: "text", key: "availability", placeholder: "e.g. 24/7" }];

    await upsertCategory("construction-services", { name: "Construction & Renovation", parentId: servicesId, template: { titlePlaceholder: "e.g. Professional Painting Services", fields: serviceSpecs } });
    await upsertCategory("transport-services", { name: "Transport & Logistics", parentId: servicesId, template: { titlePlaceholder: "e.g. Van Transport Moving", fields: serviceSpecs } });
    await upsertCategory("education-courses", { name: "Education & Courses", parentId: servicesId, template: { titlePlaceholder: "e.g. Private Math Lessons", fields: serviceSpecs } });
    await upsertCategory("vehicle-service", { name: "Vehicle Services", parentId: servicesId, template: { titlePlaceholder: "e.g. Car Diagnostics", fields: serviceSpecs } });

    // ============================================
    // 8. SPORTS
    // ============================================
    const sportsId = await upsertCategory("sports", { name: "Sports Equipment", image: "⚽" });
    await upsertCategory("bicycles", { name: "Bicycles", parentId: sportsId, template: { titlePlaceholder: "e.g. Trek MTB 29\"", fields: [brand("e.g. Trek"), { label: "Wheel Size", type: "text", key: "size", placeholder: "e.g. 29 inch" }, condition] } });
    await upsertCategory("fitness", { name: "Fitness & Gym", parentId: sportsId, template: { titlePlaceholder: "e.g. Dumbbells Set 20kg", fields: [brand("e.g. Technogym"), condition] } });
    await upsertCategory("fishing-hunting", { name: "Fishing & Hunting", parentId: sportsId, template: { titlePlaceholder: "e.g. Fishing Rod Carbon", fields: [brand("e.g. Shimano"), condition] } });

    // ============================================
    // 9. BABY & KIDS
    // ============================================
    const babyId = await upsertCategory("baby-children", { name: "Baby & Children", image: "👶" });
    await upsertCategory("strollers", { name: "Strollers", parentId: babyId, template: { titlePlaceholder: "e.g. Chicco Stroller 3in1", fields: [brand("e.g. Chicco"), condition] } });
    await upsertCategory("baby-clothes", { name: "Baby Clothes", parentId: babyId, template: { titlePlaceholder: "e.g. Bundle of Bodysuits 0-3m", fields: [{label: "Size", type:"text", key:"size", placeholder:"e.g. 62cm"}, condition] } });

    // ============================================
    // 10. BOOKS & MUSIC
    // ============================================
    const booksId = await upsertCategory("books", { name: "Books", image: "📚" });
    await upsertCategory("fiction", { name: "Fiction", parentId: booksId, template: { titlePlaceholder: "e.g. Harry Potter Complete Set", fields: [{label: "Author", type: "text", key:"author", placeholder:"e.g. J.K. Rowling"}, condition] } });
    
    const musicId = await upsertCategory("musical-instruments", { name: "Musical Instruments", image: "🎸" });
    await upsertCategory("guitars", { name: "Guitars", parentId: musicId, template: { titlePlaceholder: "e.g. Fender Stratocaster", fields: [brand("e.g. Fender"), condition] } });
    await upsertCategory("pianos", { name: "Keyboards & Pianos", parentId: musicId, template: { titlePlaceholder: "e.g. Yamaha P-45", fields: [brand("e.g. Yamaha"), condition] } });

    // ============================================
    // 11. REMAINING CATEGORIES (Fillers)
    // ============================================
    // Business
    const businessId = await upsertCategory("business-industry", { name: "Business & Industry", image: "🏭" });
    await upsertCategory("machines-tools", { name: "Machines & Tools", parentId: businessId, template: { titlePlaceholder: "e.g. Lathe Machine", fields: [brand("e.g. Makita"), condition] } });
    await upsertCategory("professional-machines", { name: "Professional Machines", parentId: businessId, template: { titlePlaceholder: "e.g. Industrial Oven", fields: [condition] } });
    
    // Pets
    const petsId = await upsertCategory("pets", { name: "Pets", image: "🐕" });
    await upsertCategory("dogs", { name: "Dogs", parentId: petsId, template: { titlePlaceholder: "e.g. Golden Retriever Puppies", fields: [{label: "Breed", type:"text", key:"breed", placeholder:"e.g. Labrador"}, {label: "Age", type:"text", key:"age", placeholder:"e.g. 2 months"}] } });
    
    // Other
    await upsertCategory("other", { name: "Other", image: "📦", template: { titlePlaceholder: "e.g. Miscellaneous Item", fields: [] } });

    // ============================================
    // 14. EVENTS & WEDDINGS
    // ============================================
    const eventsId = await upsertCategory("events", { name: "Events & Weddings", image: "🎉" });
    await upsertCategory("catering", { name: "Catering", parentId: eventsId, template: { titlePlaceholder: "e.g. Wedding Catering Service", fields: serviceSpecs } });
    await upsertCategory("event-decoration", { name: "Decoration", parentId: eventsId });
    await upsertCategory("music-bands", { name: "Music & Bands", parentId: eventsId });

    // ============================================
    // 15. VACATION & TRAVEL
    // ============================================
    const vacationId = await upsertCategory("vacation", { name: "Vacation & Travel", image: "✈️" });
    await upsertCategory("travel-arrangements", { name: "Travel Arrangements", parentId: vacationId });
    await upsertCategory("airline-tickets", { name: "Airline Tickets", parentId: vacationId });

    // ============================================
    // 16. PERSONAL CONTACTS
    // ============================================
    await upsertCategory("personal-contacts", { name: "Personal Contacts", image: "❤️", template: { titlePlaceholder: "e.g. Looking for...", fields: [{label: "Age", type: "number", key: "age"}, {label: "Gender", type: "select", key: "gender", options: ["Male", "Female"]}] } });

    // ============================================
    // 17. SHOPS & TRADE
    // ============================================
    await upsertCategory("shops-trade", { name: "Shops & Trade", image: "🛍️" });

    return { success: true, message: "System PURGED and re-seeded with comprehensive English templates!" };
  },
});
