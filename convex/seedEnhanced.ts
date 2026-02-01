import { mutation } from "./_generated/server";

export const seedEnhancedCategories = mutation({
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

    // ============================================
    // 1. REAL ESTATE
    // ============================================
    const realEstateId = await upsertCategory("real-estate", {
      name: "Real Estate",
      description: "Properties for sale and rent",
      isFeatured: true,
      image: "🏠",
    });

    await upsertCategory("flats-apartments", {
      name: "Flats / Apartments",
      parentId: realEstateId,
      template: {
        fields: [
          { label: "Listing Type", type: "select", key: "listing_type", options: ["Sale", "Rent"], required: true },
          { label: "Size (m²)", type: "number", key: "size_m2", required: true, placeholder: "e.g. 75" },
          { label: "Rooms", type: "select", key: "rooms", options: ["Studio", "1", "2", "3", "4", "5+"], required: true },
          { label: "Bedrooms", type: "select", key: "bedrooms", options: ["1", "2", "3", "4", "5+"] },
          { label: "Bathrooms", type: "select", key: "bathrooms", options: ["1", "2", "3", "4+"] },
          { label: "Floor", type: "number", key: "floor", placeholder: "e.g. 3" },
          { label: "Total Floors", type: "number", key: "total_floors", placeholder: "e.g. 5" },
          { label: "Furnished", type: "select", key: "furnished", options: ["Unfurnished", "Semi-Furnished", "Fully Furnished"] },
          { label: "Parking", type: "select", key: "parking", options: ["No", "Yes - 1 space", "Yes - 2+ spaces"] },
          { label: "Balcony", type: "select", key: "balcony", options: ["No", "Yes"] },
          { label: "Heating", type: "select", key: "heating", options: ["Central", "Gas", "Electric", "None"] },
          { label: "Year Built", type: "number", key: "year_built", placeholder: "e.g. 2015" },
        ]
      }
    });

    await upsertCategory("houses-villas", {
      name: "Houses / Villas",
      parentId: realEstateId,
      template: {
        fields: [
          { label: "Listing Type", type: "select", key: "listing_type", options: ["Sale", "Rent"], required: true },
          { label: "Size (m²)", type: "number", key: "size_m2", required: true },
          { label: "Land Size (m²)", type: "number", key: "land_size", placeholder: "e.g. 500" },
          { label: "Bedrooms", type: "select", key: "bedrooms", options: ["1", "2", "3", "4", "5", "6+"], required: true },
          { label: "Bathrooms", type: "select", key: "bathrooms", options: ["1", "2", "3", "4", "5+"] },
          { label: "Floors", type: "select", key: "floors", options: ["1", "2", "3", "4+"] },
          { label: "Garage", type: "select", key: "garage", options: ["No", "Yes - 1 car", "Yes - 2+ cars"] },
          { label: "Garden", type: "select", key: "garden", options: ["No", "Yes"] },
          { label: "Pool", type: "select", key: "pool", options: ["No", "Yes"] },
          { label: "Furnished", type: "select", key: "furnished", options: ["Unfurnished", "Semi-Furnished", "Fully Furnished"] },
          { label: "Year Built", type: "number", key: "year_built" },
        ]
      }
    });

    await upsertCategory("land", {
      name: "Land",
      parentId: realEstateId,
      template: {
        fields: [
          { label: "Listing Type", type: "select", key: "listing_type", options: ["Sale", "Rent"], required: true },
          { label: "Size (m²)", type: "number", key: "size_m2", required: true },
          { label: "Land Type", type: "select", key: "land_type", options: ["Residential", "Commercial", "Agricultural", "Industrial"] },
          { label: "Zoning", type: "text", key: "zoning", placeholder: "e.g. Residential" },
          { label: "Utilities", type: "select", key: "utilities", options: ["None", "Water", "Electricity", "All"] },
        ]
      }
    });

    await upsertCategory("commercial-property", {
      name: "Commercial Property",
      parentId: realEstateId,
      template: {
        fields: [
          { label: "Listing Type", type: "select", key: "listing_type", options: ["Sale", "Rent"], required: true },
          { label: "Property Type", type: "select", key: "property_type", options: ["Office", "Retail", "Warehouse", "Restaurant", "Hotel", "Other"], required: true },
          { label: "Size (m²)", type: "number", key: "size_m2", required: true },
          { label: "Floor", type: "number", key: "floor" },
          { label: "Parking Spaces", type: "number", key: "parking_spaces" },
        ]
      }
    });

    // ============================================
    // 2. VEHICLES
    // ============================================
    const vehiclesId = await upsertCategory("vehicles", {
      name: "Vehicles",
      description: "Cars, motorcycles, and more",
      isFeatured: true,
      image: "🚗",
    });

    await upsertCategory("cars", {
      name: "Cars",
      parentId: vehiclesId,
      template: {
        fields: [
          { label: "Brand", type: "select", key: "brand", options: ["Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Hyundai", "Kia", "Mazda", "Peugeot", "Renault", "Fiat", "Opel", "Skoda", "Other"], required: true },
          { label: "Model", type: "text", key: "model", required: true, placeholder: "e.g. A4" },
          { label: "Year", type: "number", key: "year", required: true, placeholder: "e.g. 2020" },
          { label: "Mileage (km)", type: "number", key: "mileage", required: true, placeholder: "e.g. 45000" },
          { label: "Fuel Type", type: "select", key: "fuel", options: ["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG"], required: true },
          { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic", "Semi-Automatic"], required: true },
          { label: "Body Type", type: "select", key: "body_type", options: ["Sedan", "Hatchback", "SUV", "Coupe", "Convertible", "Wagon", "Van", "Pickup"] },
          { label: "Color", type: "select", key: "color", options: ["Black", "White", "Silver", "Gray", "Red", "Blue", "Green", "Yellow", "Brown", "Other"] },
          { label: "Engine Size (L)", type: "text", key: "engine_size", placeholder: "e.g. 2.0" },
          { label: "Power (HP)", type: "number", key: "power", placeholder: "e.g. 150" },
          { label: "Doors", type: "select", key: "doors", options: ["2", "3", "4", "5"] },
          { label: "Seats", type: "select", key: "seats", options: ["2", "4", "5", "6", "7", "8+"] },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
          { label: "VIN", type: "text", key: "vin", placeholder: "Vehicle Identification Number" },
        ]
      }
    });

    await upsertCategory("motorcycles", {
      name: "Motorcycles",
      parentId: vehiclesId,
      template: {
        fields: [
          { label: "Brand", type: "select", key: "brand", options: ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Harley-Davidson", "Ducati", "BMW", "KTM", "Triumph", "Other"], required: true },
          { label: "Model", type: "text", key: "model", required: true },
          { label: "Year", type: "number", key: "year", required: true },
          { label: "Mileage (km)", type: "number", key: "mileage", required: true },
          { label: "Engine Size (cc)", type: "number", key: "engine_cc", required: true, placeholder: "e.g. 600" },
          { label: "Type", type: "select", key: "type", options: ["Sport", "Cruiser", "Touring", "Off-Road", "Scooter", "Naked", "Adventure"] },
          { label: "Color", type: "text", key: "color" },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
        ]
      }
    });

    await upsertCategory("trucks-vans", {
      name: "Trucks & Vans",
      parentId: vehiclesId,
      template: {
        fields: [
          { label: "Brand", type: "text", key: "brand", required: true },
          { label: "Model", type: "text", key: "model", required: true },
          { label: "Year", type: "number", key: "year", required: true },
          { label: "Mileage (km)", type: "number", key: "mileage", required: true },
          { label: "Type", type: "select", key: "type", options: ["Van", "Pickup Truck", "Box Truck", "Flatbed", "Dump Truck"] },
          { label: "Fuel Type", type: "select", key: "fuel", options: ["Petrol", "Diesel", "Electric", "Hybrid"] },
          { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic"] },
          { label: "Payload Capacity (kg)", type: "number", key: "payload", placeholder: "e.g. 1000" },
        ]
      }
    });

    await upsertCategory("boats", {
      name: "Boats",
      parentId: vehiclesId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Motorboat", "Sailboat", "Yacht", "Jet Ski", "Fishing Boat", "Inflatable"], required: true },
          { label: "Brand", type: "text", key: "brand" },
          { label: "Model", type: "text", key: "model" },
          { label: "Year", type: "number", key: "year" },
          { label: "Length (m)", type: "number", key: "length", placeholder: "e.g. 7.5" },
          { label: "Engine Power (HP)", type: "number", key: "engine_power" },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
        ]
      }
    });

    // ============================================
    // 3. ELECTRONICS
    // ============================================
    const electronicsId = await upsertCategory("electronics", {
      name: "Electronics",
      description: "Phones, computers, and gadgets",
      isFeatured: true,
      image: "📱",
    });

    await upsertCategory("mobile-phones", {
      name: "Mobile Phones",
      parentId: electronicsId,
      template: {
        fields: [
          { label: "Brand", type: "select", key: "brand", options: ["Apple", "Samsung", "Xiaomi", "Huawei", "OnePlus", "Google", "Oppo", "Vivo", "Realme", "Motorola", "Nokia", "Other"], required: true },
          { label: "Model", type: "text", key: "model", required: true, placeholder: "e.g. iPhone 14 Pro" },
          { label: "Storage", type: "select", key: "storage", options: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"], required: true },
          { label: "RAM", type: "select", key: "ram", options: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB+"] },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good", "Used - Fair", "For Parts"], required: true },
          { label: "Color", type: "text", key: "color", placeholder: "e.g. Space Gray" },
          { label: "Screen Size", type: "text", key: "screen_size", placeholder: "e.g. 6.1 inches" },
          { label: "Battery Health", type: "select", key: "battery_health", options: ["100%", "95-99%", "90-94%", "85-89%", "Below 85%"] },
          { label: "Warranty", type: "select", key: "warranty", options: ["No Warranty", "1-6 months", "6-12 months", "1+ years"] },
          { label: "Box & Accessories", type: "select", key: "box_accessories", options: ["Complete with box", "Without box", "Accessories only"] },
        ]
      }
    });

    await upsertCategory("computers-laptops", {
      name: "Computers & Laptops",
      parentId: electronicsId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Laptop", "Desktop", "All-in-One", "Gaming PC"], required: true },
          { label: "Brand", type: "select", key: "brand", options: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Razer", "Microsoft", "Custom Built", "Other"], required: true },
          { label: "Model", type: "text", key: "model", placeholder: "e.g. MacBook Pro 2023" },
          { label: "Processor", type: "text", key: "processor", placeholder: "e.g. Intel i7-12700K", required: true },
          { label: "RAM", type: "select", key: "ram", options: ["4GB", "8GB", "16GB", "32GB", "64GB+"], required: true },
          { label: "Storage Type", type: "select", key: "storage_type", options: ["SSD", "HDD", "SSD + HDD"] },
          { label: "Storage Size", type: "select", key: "storage_size", options: ["128GB", "256GB", "512GB", "1TB", "2TB+"] },
          { label: "Graphics Card", type: "text", key: "gpu", placeholder: "e.g. NVIDIA RTX 3060" },
          { label: "Screen Size", type: "text", key: "screen_size", placeholder: "e.g. 15.6 inches" },
          { label: "Operating System", type: "select", key: "os", options: ["Windows 11", "Windows 10", "macOS", "Linux", "No OS"] },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good", "Used - Fair"], required: true },
        ]
      }
    });

    await upsertCategory("tablets", {
      name: "Tablets",
      parentId: electronicsId,
      template: {
        fields: [
          { label: "Brand", type: "select", key: "brand", options: ["Apple", "Samsung", "Huawei", "Lenovo", "Microsoft", "Amazon", "Other"], required: true },
          { label: "Model", type: "text", key: "model", required: true },
          { label: "Storage", type: "select", key: "storage", options: ["32GB", "64GB", "128GB", "256GB", "512GB+"] },
          { label: "Screen Size", type: "text", key: "screen_size", placeholder: "e.g. 10.9 inches" },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good", "Used - Fair"] },
          { label: "Cellular", type: "select", key: "cellular", options: ["Wi-Fi Only", "Wi-Fi + Cellular"] },
        ]
      }
    });

    await upsertCategory("tvs-audio", {
      name: "TVs & Audio",
      parentId: electronicsId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["TV", "Soundbar", "Speakers", "Headphones", "Home Theater"], required: true },
          { label: "Brand", type: "text", key: "brand", required: true },
          { label: "Model", type: "text", key: "model" },
          { label: "Screen Size (TV)", type: "text", key: "screen_size", placeholder: "e.g. 55 inches" },
          { label: "Resolution (TV)", type: "select", key: "resolution", options: ["HD", "Full HD", "4K", "8K"] },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"] },
        ]
      }
    });

    await upsertCategory("cameras", {
      name: "Cameras",
      parentId: electronicsId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["DSLR", "Mirrorless", "Point & Shoot", "Action Camera", "Video Camera"], required: true },
          { label: "Brand", type: "select", key: "brand", options: ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic", "GoPro", "DJI", "Other"], required: true },
          { label: "Model", type: "text", key: "model", required: true },
          { label: "Megapixels", type: "number", key: "megapixels", placeholder: "e.g. 24" },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"] },
          { label: "Shutter Count", type: "number", key: "shutter_count", placeholder: "Number of photos taken" },
        ]
      }
    });

    // ============================================
    // 4. JOBS
    // ============================================
    const jobsId = await upsertCategory("jobs", {
      name: "Jobs",
      description: "Find your next opportunity",
      isFeatured: true,
      image: "💼",
    });

    await upsertCategory("full-time", {
      name: "Full Time",
      parentId: jobsId,
      template: {
        fields: [
          { label: "Job Title", type: "text", key: "job_title", required: true, placeholder: "e.g. Software Engineer" },
          { label: "Company", type: "text", key: "company", placeholder: "Company name" },
          { label: "Industry", type: "select", key: "industry", options: ["IT", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "Construction", "Hospitality", "Other"] },
          { label: "Experience Level", type: "select", key: "experience", options: ["Entry Level", "Mid Level", "Senior Level", "Executive"], required: true },
          { label: "Salary Range", type: "text", key: "salary_range", placeholder: "e.g. $50,000 - $70,000" },
          { label: "Education Required", type: "select", key: "education", options: ["High School", "Bachelor's", "Master's", "PhD", "Not Required"] },
        ]
      }
    });

    await upsertCategory("part-time", {
      name: "Part Time",
      parentId: jobsId,
      template: {
        fields: [
          { label: "Job Title", type: "text", key: "job_title", required: true },
          { label: "Company", type: "text", key: "company" },
          { label: "Hours per Week", type: "text", key: "hours_per_week", placeholder: "e.g. 20 hours" },
          { label: "Hourly Rate", type: "text", key: "hourly_rate", placeholder: "e.g. $15/hour" },
        ]
      }
    });

    await upsertCategory("freelance", {
      name: "Freelance",
      parentId: jobsId,
      template: {
        fields: [
          { label: "Project Type", type: "text", key: "project_type", required: true },
          { label: "Skills Required", type: "text", key: "skills", placeholder: "e.g. React, Node.js" },
          { label: "Budget", type: "text", key: "budget", placeholder: "e.g. $500 - $1000" },
          { label: "Duration", type: "text", key: "duration", placeholder: "e.g. 2 weeks" },
        ]
      }
    });

    await upsertCategory("internships", {
      name: "Internships",
      parentId: jobsId,
      template: {
        fields: [
          { label: "Position", type: "text", key: "position", required: true },
          { label: "Company", type: "text", key: "company" },
          { label: "Duration", type: "text", key: "duration", placeholder: "e.g. 3 months" },
          { label: "Paid/Unpaid", type: "select", key: "paid", options: ["Paid", "Unpaid"] },
          { label: "Stipend", type: "text", key: "stipend", placeholder: "If paid" },
        ]
      }
    });

    // ============================================
    // 5. SERVICES
    // ============================================
    const servicesId = await upsertCategory("services", {
      name: "Services",
      description: "Professional services",
      image: "🔧",
    });

    await upsertCategory("home-services", {
      name: "Home Services",
      parentId: servicesId,
      template: {
        fields: [
          { label: "Service Type", type: "select", key: "service_type", options: ["Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry", "HVAC", "Landscaping", "Other"], required: true },
          { label: "Experience (years)", type: "number", key: "experience", placeholder: "e.g. 5" },
          { label: "Rate", type: "text", key: "rate", placeholder: "e.g. $50/hour" },
          { label: "Available Days", type: "text", key: "availability", placeholder: "e.g. Mon-Fri" },
        ]
      }
    });

    await upsertCategory("business-services", {
      name: "Business Services",
      parentId: servicesId,
      template: {
        fields: [
          { label: "Service Type", type: "select", key: "service_type", options: ["Accounting", "Legal", "Marketing", "Consulting", "IT Support", "Web Development", "Graphic Design", "Other"], required: true },
          { label: "Experience (years)", type: "number", key: "experience" },
          { label: "Rate", type: "text", key: "rate", placeholder: "e.g. $100/hour or project-based" },
        ]
      }
    });

    await upsertCategory("personal-services", {
      name: "Personal Services",
      parentId: servicesId,
      template: {
        fields: [
          { label: "Service Type", type: "select", key: "service_type", options: ["Personal Training", "Tutoring", "Photography", "Event Planning", "Beauty & Spa", "Pet Care", "Other"], required: true },
          { label: "Rate", type: "text", key: "rate", placeholder: "e.g. $30/session" },
        ]
      }
    });

    // ============================================
    // 6. FASHION
    // ============================================
    const fashionId = await upsertCategory("fashion", {
      name: "Fashion",
      description: "Clothing, shoes, and accessories",
      image: "👗",
    });

    await upsertCategory("mens-clothing", {
      name: "Men's Clothing",
      parentId: fashionId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Shirts", "T-Shirts", "Pants", "Jeans", "Shorts", "Jackets", "Suits", "Sportswear", "Other"], required: true },
          { label: "Brand", type: "text", key: "brand" },
          { label: "Size", type: "select", key: "size", options: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"], required: true },
          { label: "Condition", type: "select", key: "condition", options: ["New with tags", "New without tags", "Used - Like New", "Used - Good"], required: true },
          { label: "Color", type: "text", key: "color" },
        ]
      }
    });

    await upsertCategory("womens-clothing", {
      name: "Women's Clothing",
      parentId: fashionId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Dresses", "Tops", "Blouses", "Pants", "Jeans", "Skirts", "Jackets", "Coats", "Sportswear", "Other"], required: true },
          { label: "Brand", type: "text", key: "brand" },
          { label: "Size", type: "select", key: "size", options: ["XS", "S", "M", "L", "XL", "XXL"], required: true },
          { label: "Condition", type: "select", key: "condition", options: ["New with tags", "New without tags", "Used - Like New", "Used - Good"], required: true },
          { label: "Color", type: "text", key: "color" },
        ]
      }
    });

    await upsertCategory("shoes", {
      name: "Shoes",
      parentId: fashionId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Sneakers", "Boots", "Sandals", "Formal Shoes", "Heels", "Flats", "Sports Shoes", "Other"], required: true },
          { label: "Brand", type: "text", key: "brand" },
          { label: "Size (EU)", type: "number", key: "size", required: true, placeholder: "e.g. 42" },
          { label: "Gender", type: "select", key: "gender", options: ["Men", "Women", "Unisex"] },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"], required: true },
        ]
      }
    });

    await upsertCategory("accessories", {
      name: "Accessories",
      parentId: fashionId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Bags", "Watches", "Jewelry", "Belts", "Hats", "Sunglasses", "Scarves", "Other"], required: true },
          { label: "Brand", type: "text", key: "brand" },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"] },
          { label: "Material", type: "text", key: "material", placeholder: "e.g. Leather, Gold" },
        ]
      }
    });

    // ============================================
    // 7. HOME & GARDEN
    // ============================================
    const homeGardenId = await upsertCategory("home-garden", {
      name: "Home & Garden",
      description: "Furniture, appliances, and decor",
      image: "🏡",
    });

    await upsertCategory("furniture", {
      name: "Furniture",
      parentId: homeGardenId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Sofa", "Bed", "Table", "Chair", "Wardrobe", "Desk", "Bookshelf", "Other"], required: true },
          { label: "Material", type: "select", key: "material", options: ["Wood", "Metal", "Plastic", "Fabric", "Leather", "Glass", "Mixed"] },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good", "Used - Fair"], required: true },
          { label: "Dimensions", type: "text", key: "dimensions", placeholder: "L x W x H (cm)" },
          { label: "Color", type: "text", key: "color" },
        ]
      }
    });

    await upsertCategory("appliances", {
      name: "Appliances",
      parentId: homeGardenId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Refrigerator", "Washing Machine", "Dryer", "Dishwasher", "Oven", "Microwave", "Vacuum Cleaner", "Air Conditioner", "Other"], required: true },
          { label: "Brand", type: "text", key: "brand" },
          { label: "Model", type: "text", key: "model" },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"], required: true },
          { label: "Energy Rating", type: "select", key: "energy_rating", options: ["A+++", "A++", "A+", "A", "B", "C", "D", "Not Rated"] },
          { label: "Warranty", type: "select", key: "warranty", options: ["No Warranty", "Under Warranty", "Extended Warranty"] },
        ]
      }
    });

    await upsertCategory("home-decor", {
      name: "Home Decor",
      parentId: homeGardenId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Paintings", "Mirrors", "Rugs", "Curtains", "Lamps", "Vases", "Cushions", "Other"], required: true },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"] },
          { label: "Material", type: "text", key: "material" },
          { label: "Dimensions", type: "text", key: "dimensions", placeholder: "e.g. 50x70 cm" },
        ]
      }
    });

    await upsertCategory("garden-outdoor", {
      name: "Garden & Outdoor",
      parentId: homeGardenId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Garden Furniture", "BBQ Grill", "Plants", "Tools", "Lawn Mower", "Pool Equipment", "Other"], required: true },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"] },
          { label: "Material", type: "text", key: "material" },
        ]
      }
    });

    // ============================================
    // 8. SPORTS & LEISURE
    // ============================================
    const sportsId = await upsertCategory("sports-leisure", {
      name: "Sports & Leisure",
      description: "Sports equipment and hobbies",
      image: "⚽",
    });

    await upsertCategory("sports-equipment", {
      name: "Sports Equipment",
      parentId: sportsId,
      template: {
        fields: [
          { label: "Sport", type: "select", key: "sport", options: ["Football", "Basketball", "Tennis", "Golf", "Swimming", "Running", "Skiing", "Cycling", "Other"], required: true },
          { label: "Type", type: "text", key: "type", placeholder: "e.g. Tennis Racket" },
          { label: "Brand", type: "text", key: "brand" },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"] },
        ]
      }
    });

    await upsertCategory("bicycles", {
      name: "Bicycles",
      parentId: sportsId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Mountain Bike", "Road Bike", "City Bike", "Electric Bike", "BMX", "Folding Bike", "Kids Bike"], required: true },
          { label: "Brand", type: "text", key: "brand" },
          { label: "Frame Size", type: "text", key: "frame_size", placeholder: "e.g. 54 cm" },
          { label: "Wheel Size", type: "select", key: "wheel_size", options: ["12\"", "16\"", "20\"", "24\"", "26\"", "27.5\"", "28\"", "29\""] },
          { label: "Gears", type: "text", key: "gears", placeholder: "e.g. 21-speed" },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"], required: true },
        ]
      }
    });

    await upsertCategory("gym-fitness", {
      name: "Gym & Fitness",
      parentId: sportsId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Treadmill", "Exercise Bike", "Weights", "Bench", "Rowing Machine", "Yoga Mat", "Other"], required: true },
          { label: "Brand", type: "text", key: "brand" },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"] },
        ]
      }
    });

    // ============================================
    // 9. PETS
    // ============================================
    const petsId = await upsertCategory("pets", {
      name: "Pets",
      description: "Pets and pet supplies",
      image: "🐾",
    });

    await upsertCategory("dogs", {
      name: "Dogs",
      parentId: petsId,
      template: {
        fields: [
          { label: "Breed", type: "text", key: "breed", required: true, placeholder: "e.g. Golden Retriever" },
          { label: "Age", type: "text", key: "age", required: true, placeholder: "e.g. 2 years" },
          { label: "Gender", type: "select", key: "gender", options: ["Male", "Female"], required: true },
          { label: "Vaccinated", type: "select", key: "vaccinated", options: ["Yes", "No", "Partially"] },
          { label: "Pedigree", type: "select", key: "pedigree", options: ["Yes", "No"] },
          { label: "Size", type: "select", key: "size", options: ["Small", "Medium", "Large", "Giant"] },
        ]
      }
    });

    await upsertCategory("cats", {
      name: "Cats",
      parentId: petsId,
      template: {
        fields: [
          { label: "Breed", type: "text", key: "breed", required: true },
          { label: "Age", type: "text", key: "age", required: true },
          { label: "Gender", type: "select", key: "gender", options: ["Male", "Female"], required: true },
          { label: "Vaccinated", type: "select", key: "vaccinated", options: ["Yes", "No", "Partially"] },
          { label: "Pedigree", type: "select", key: "pedigree", options: ["Yes", "No"] },
        ]
      }
    });

    await upsertCategory("pet-accessories", {
      name: "Pet Accessories",
      parentId: petsId,
      template: {
        fields: [
          { label: "Type", type: "select", key: "type", options: ["Food", "Toys", "Beds", "Cages", "Leashes", "Bowls", "Grooming", "Other"], required: true },
          { label: "For", type: "select", key: "for_pet", options: ["Dogs", "Cats", "Birds", "Fish", "Other"] },
          { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good"] },
        ]
      }
    });

    // ============================================
    // 10. EDUCATION
    // ============================================
    const educationId = await upsertCategory("education", {
      name: "Education",
      description: "Courses and tutoring",
      image: "📚",
    });

    await upsertCategory("tutoring", {
      name: "Tutoring",
      parentId: educationId,
      template: {
        fields: [
          { label: "Subject", type: "text", key: "subject", required: true, placeholder: "e.g. Mathematics" },
          { label: "Level", type: "select", key: "level", options: ["Elementary", "Middle School", "High School", "University", "Adult"], required: true },
          { label: "Format", type: "select", key: "format", options: ["In-Person", "Online", "Both"] },
          { label: "Rate", type: "text", key: "rate", placeholder: "e.g. $25/hour" },
          { label: "Experience (years)", type: "number", key: "experience" },
        ]
      }
    });

    await upsertCategory("courses", {
      name: "Courses",
      parentId: educationId,
      template: {
        fields: [
          { label: "Course Name", type: "text", key: "course_name", required: true },
          { label: "Category", type: "select", key: "category", options: ["Programming", "Design", "Business", "Languages", "Music", "Art", "Other"], required: true },
          { label: "Format", type: "select", key: "format", options: ["In-Person", "Online", "Hybrid"] },
          { label: "Duration", type: "text", key: "duration", placeholder: "e.g. 8 weeks" },
          { label: "Level", type: "select", key: "level", options: ["Beginner", "Intermediate", "Advanced"] },
        ]
      }
    });

    return { success: true, message: "Enhanced categories seeded successfully with detailed templates!" };
  },
});
