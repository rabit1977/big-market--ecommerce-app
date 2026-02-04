
import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation } from "./_generated/server";

interface CategoryInput {
  name: string;
  slug: string;
  subcategories?: CategoryInput[];
}

// ==========================================
// AMAZON-STYLE TAXONOMY
// ==========================================
const AMAZON_CATEGORIES: CategoryInput[] = [
  // 1. ELECTRONICS
  {
    name: "Electronics",
    slug: "electronics",
    subcategories: [
      {
        name: "Mobile Phones & Accessories",
        slug: "mobile-phones-acc",
        subcategories: [
           { name: "Mobile Phones", slug: "mobile-phones" },
           { name: "Smartwatches", slug: "smartwatches" },
           { name: "Cases & Covers", slug: "cases-covers" },
           { name: "Chargers & Cables", slug: "chargers-cables" },
           { name: "Power Banks", slug: "power-banks" },
           { name: "Replacement Parts", slug: "mobile-parts" },
        ]
      },
      {
        name: "Computers & Laptops",
        slug: "computers-laptops",
        subcategories: [
           { name: "Laptops", slug: "laptops" },
           { name: "Desktops", slug: "desktops" },
           { name: "Monitors", slug: "monitors" },
           { name: "Components (GPU, CPU, RAM)", slug: "pc-components" },
           { name: "Printers & Ink", slug: "printers-ink" },
           { name: "Networking (Routers)", slug: "networking" },
        ]
      },
      {
        name: "TV & Video",
        slug: "tv-video",
        subcategories: [
           { name: "Televisions", slug: "televisions" },
           { name: "Home Audio & Speakers", slug: "home-audio" },
           { name: "Projectors", slug: "projectors" },
           { name: "TV Accessories", slug: "tv-accessories" },
        ]
      },
      {
         name: "Cameras & Photo",
         slug: "cameras-photo",
         subcategories: [
            { name: "Digital Cameras", slug: "digital-cameras" },
            { name: "Lenses", slug: "lenses" },
            { name: "Drones", slug: "drones" },
         ]
      }
    ]
  },

  // 2. VEHICLES (Consolidated)
  {
    name: "Vehicles",
    slug: "vehicles",
    subcategories: [
      {
        name: "Cars",
        slug: "cars",
        subcategories: [ // Optional deeper nesting if needed
           { name: "Sedan", slug: "cars-sedan" },
           { name: "SUV", slug: "cars-suv" },
           { name: "Hatchback", slug: "cars-hatchback" },
           { name: "Cabriolet", slug: "cars-cabriolet" },
        ] 
      },
      {
         name: "Motorcycles & Scooters",
         slug: "motorcycles",
         subcategories: [
            { name: "Motorcycles", slug: "motorcycles-bikes" },
            { name: "Scooters", slug: "scooters" },
            { name: "ATV / Quads", slug: "atv-quads" },
            { name: "Helmets & Gear", slug: "moto-gear" },
         ]
      },
      { name: "Trucks & Commercial Vehicles", slug: "trucks-commercial" },
      { name: "Bicycles", slug: "bicycles" },
      { name: "Boats & Watercraft", slug: "boats" },
      { 
        name: "Auto Parts & Accessories", 
        slug: "auto-parts",
        subcategories: [
           { name: "Tires & Wheels", slug: "tires-wheels" },
           { name: "Car Audio & Electronics", slug: "car-audio" },
           { name: "Spare Parts", slug: "car-spare-parts" },
        ]
      },
    ]
  },

  // 3. HOME & GARDEN
  {
    name: "Home & Garden",
    slug: "home-garden",
    subcategories: [
      {
        name: "Large Appliances",
        slug: "large-appliances",
        subcategories: [
           { name: "Refrigerators", slug: "refrigerators" },
           { name: "Washing Machines", slug: "washing-machines" },
           { name: "Dishwashers", slug: "dishwashers" },
           { name: "Ovens & Cookers", slug: "ovens-cookers" },
           { name: "Air Conditioners", slug: "air-conditioners" },
           { name: "Water Heaters", slug: "water-heaters" },
        ]
      },
      {
         name: "Small Appliances",
         slug: "small-appliances",
         subcategories: [
            { name: "Coffee Machines", slug: "coffee-machines" },
            { name: "Microwaves", slug: "microwaves" },
            { name: "Vacuums", slug: "vacuums" },
            { name: "Irons", slug: "irons" },
         ]
      },
      {
        name: "Furniture",
        slug: "furniture",
        subcategories: [
           { name: "Sofas & Couches", slug: "sofas" },
           { name: "Beds & Mattresses", slug: "beds-mattresses" },
           { name: "Tables & Chairs", slug: "tables-chairs" },
           { name: "Wardrobes", slug: "wardrobes" },
        ]
      },
      {
         name: "Tools & Home Improvement",
         slug: "tools-home-improvement",
         subcategories: [
            { name: "Power Tools", slug: "power-tools" },
            { name: "Hand Tools", slug: "hand-tools" },
            { name: "Electrical", slug: "electrical-supplies" },
            { name: "Plumbing & Bathroom", slug: "plumbing-bathroom" },
         ]
      }
    ]
  },

  // 4. FASHION
  {
    name: "Fashion",
    slug: "fashion",
    subcategories: [
      {
        name: "Men",
        slug: "men-fashion",
        subcategories: [
           { name: "Clothing (Shirts, Pants, etc)", slug: "men-clothing" },
           { name: "Shoes", slug: "men-shoes" },
           { name: "Watches", slug: "men-watches" },
        ]
      },
      {
        name: "Women",
        slug: "women-fashion",
        subcategories: [
           { name: "Clothing", slug: "women-clothing" },
           { name: "Shoes", slug: "women-shoes" },
           { name: "Bags", slug: "women-bags" },
           { name: "Jewelry", slug: "jewelry" },
        ]
      },
    ]
  },

  // 5. REAL ESTATE
  {
    name: "Real Estate",
    slug: "real-estate",
    subcategories: [
      { name: "Apartments for Sale", slug: "apartments-sale" },
      { name: "Apartments for Rent", slug: "apartments-rent" },
      { name: "Houses for Sale", slug: "houses-sale" },
      { name: "Houses for Rent", slug: "houses-rent" },
      { name: "Commercial Property", slug: "commercial-property" },
      { name: "Land / Plots", slug: "land-plots" },
    ]
  }
];

// ==========================================
// TEMPLATE LOGIC
// ==========================================

const getCustomTemplate = (slug: string, name: string) => {
  const baseFields = [
    { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good", "Defective"] },
  ];

  // --- 1. ELECTRONICS ---
  if (slug.includes("mobile-phones")) {
     return {
        titlePlaceholder: "e.g. iPhone 15 Pro Max 256GB Titanium",
        fields: [
           ...baseFields,
           { label: "Brand", type: "select", key: "brand", options: ["Apple", "Samsung", "Xiaomi", "Google", "Huawei", "OnePlus", "Other"] },
           { label: "Model", type: "text", key: "model", required: true },
           { label: "Storage", type: "select", key: "storage", options: ["64GB", "128GB", "256GB", "512GB", "1TB"] },
           { label: "Color", type: "text", key: "color", placeholder: "e.g. Blue Titanium" },
           { label: "Battery Health (%)", type: "number", key: "battery_health" },
        ]
     };
  }
  if (slug === "cases-covers") {
      return {
          titlePlaceholder: "e.g. Spigen Case for iPhone 14",
          fields: [
              ...baseFields,
              { label: "Compatible Brand", type: "text", key: "compatible_brand" },
              { label: "Compatible Model", type: "text", key: "compatible_model" },
              { label: "Material", type: "text", key: "material", placeholder: "e.g. Leather, Silicon" },
              { label: "Color", type: "text", key: "color" },
          ]
      }
  }

  if (slug.includes("laptops") || slug.includes("desktops")) {
      return {
          titlePlaceholder: "e.g. MacBook Air M2 8GB/256GB",
          fields: [
              ...baseFields,
              { label: "Brand", type: "text", key: "brand" },
              { label: "Processor (CPU)", type: "text", key: "cpu", placeholder: "e.g. Intel i7, Apple M2" },
              { label: "RAM (GB)", type: "number", key: "ram" },
              { label: "Storage Type", type: "select", key: "storage_type", options: ["SSD", "HDD"] },
              { label: "Storage Capacity", type: "text", key: "storage_capacity", placeholder: "e.g. 512GB" },
              { label: "Screen Size", type: "number", key: "screen_size", placeholder: "inches" },
              { label: "Graphics Card", type: "text", key: "gpu" },
          ]
      }
  }

  if (slug.includes("monitors")) {
       return {
           titlePlaceholder: "e.g. Dell UltraSharp 27 4K",
           fields: [
               ...baseFields,
               { label: "Screen Size", type: "number", key: "screen_size" },
               { label: "Resolution", type: "select", key: "resolution", options: ["1080p", "1440p (2K)", "4K", "UltraWide"] },
               { label: "Refresh Rate (Hz)", type: "number", key: "refresh_rate", placeholder: "e.g. 60, 144" },
               { label: "Panel Type", type: "select", key: "panel_type", options: ["IPS", "VA", "TN", "OLED"] },
           ]
       }
  }

  if (slug.includes("televisions")) {
      return {
          titlePlaceholder: "e.g. Samsung 55\" Neo QLED 4K",
          fields: [
              ...baseFields,
              { label: "Brand", type: "text", key: "brand" },
              { label: "Screen Size (inches)", type: "number", key: "screen_size" },
              { label: "Technology", type: "select", key: "tech", options: ["LED", "QLED", "OLED", "Mini-LED"] },
              { label: "Resolution", type: "select", key: "resolution", options: ["HD", "Full HD", "4K UHD", "8K"] },
              { label: "Smart TV", type: "boolean", key: "smart_tv" },
          ]
      }
  }

  // --- 2. VEHICLES ---
  if (slug.includes("cars")) {
      return {
          titlePlaceholder: "e.g. BMW 320d M-Sport 2018",
          fields: [
              ...baseFields,
              { label: "Brand", type: "select", key: "make", options: ["Audi", "BMW", "Mercedes", "VW", "Ford", "Toyota", "Opel", "Citroen", "Peugeot", "Renault", "Kia", "Hyundai", "Other"] },
              { label: "Model", type: "text", key: "model", required: true },
              { label: "Year", type: "number", key: "year", required: true },
              { label: "Mileage (km)", type: "number", key: "mileage", required: true },
              { label: "Fuel", type: "select", key: "fuel", options: ["Diesel", "Petrol", "Hybrid", "Electric", "LPG"] },
              { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic"] },
              { label: "Body Type", type: "select", key: "body_type", options: ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Van"] },
              { label: "Power (KW)", type: "number", key: "power" },
              { label: "Color", type: "text", key: "color" },
              { label: "Registration", type: "select", key: "registration", options: ["Macedonian Plates", "Foreign Plates"] },
          ]
      }
  }

  if (slug.includes("motorcycles") || slug.includes("scooters")) {
      return {
          titlePlaceholder: "e.g. Yamaha MT-07",
          fields: [
              ...baseFields,
              { label: "Make", type: "text", key: "make" },
              { label: "Model", type: "text", key: "model" },
              { label: "Year", type: "number", key: "year" },
              { label: "Mileage (km)", type: "number", key: "mileage" },
              { label: "Engine (cc)", type: "number", key: "cc" },
          ]
      }
  }

  if (slug === "bicycles") {
      return {
          titlePlaceholder: "e.g. Trek Marlin 6 Gen 3",
          fields: [
              ...baseFields,
              { label: "Type", type: "select", key: "bike_type", options: ["Mountain", "Road", "City", "Electric", "Kids"] },
              { label: "Brand", type: "text", key: "brand" },
              { label: "Frame Size", type: "select", key: "frame_size", options: ["S", "M", "L", "XL"] },
              { label: "Wheel Size", type: "text", key: "wheel_size", placeholder: "e.g. 29\"" },
          ]
      }
  }

  // --- 3. HOME & APPLIANCES ---
  if (slug.includes("washing-machines") || slug.includes("dishwashers")) {
      return {
          titlePlaceholder: "e.g. Bosch Series 6",
          fields: [
              ...baseFields,
              { label: "Brand", type: "text", key: "brand" },
              { label: "Type", type: "select", key: "type", options: ["Freestanding", "Built-in"] },
              { label: "Capacity (kg/place settings)", type: "number", key: "capacity" },
              { label: "Energy Class", type: "select", key: "energy_class", options: ["A", "B", "C", "D", "E", "F"] },
          ]
      }
  }

  if (slug.includes("air-conditioners")) {
      return {
          titlePlaceholder: "e.g. Gree Fairy 3.5kW",
          fields: [
               ...baseFields,
               { label: "Brand", type: "text", key: "brand" },
               { label: "Power (kW/BTU)", type: "text", key: "power" },
               { label: "Type", type: "select", key: "type", options: ["Inverter", "Standard"] },
          ]
      }
  }

  if (slug === "power-tools" || slug === "hand-tools") {
      return {
          titlePlaceholder: "e.g. Makita Cordless Drill 18V",
          fields: [
              ...baseFields,
              { label: "Tool Type", type: "text", key: "tool_type", placeholder: "e.g. Drill, Grinder" },
              { label: "Power Source", type: "select", key: "power_source", options: ["Battery", "Corded", "Manual"] },
              { label: "Brand", type: "text", key: "brand" },
          ]
      }
  }

  // --- 4. FASHION ---
  if (slug.includes("clothing")) {
      return {
          titlePlaceholder: "e.g. Nike Hoodie Black Size L",
          fields: [
              ...baseFields,
              { label: "Size", type: "text", key: "size", placeholder: "e.g. S, M, L, XL" },
              { label: "Brand", type: "text", key: "brand" },
              { label: "Material", type: "text", key: "material", placeholder: "e.g. Cotton, Polyester" },
              { label: "Color", type: "text", key: "color" },
          ]
      }
  }
  if (slug.includes("shoes")) {
       return {
           titlePlaceholder: "e.g. Nike Air Force 1",
           fields: [
               ...baseFields,
               { label: "Size (EU)", type: "number", key: "size_eu" },
               { label: "Brand", type: "text", key: "brand" },
               { label: "Color", type: "text", key: "color" },
           ]
       }
  }
  if (slug === "jewelry") {
      return {
          titlePlaceholder: "e.g. Gold Necklace 14k",
          fields: [
              ...baseFields,
              { label: "Type", type: "select", key: "type", options: ["Ring", "Necklace", "Bracelet", "Earrings"] },
              { label: "Material", type: "select", key: "material", options: ["Gold", "Silver", "Platinum", "Other"] },
              { label: "Weight (g)", type: "number", key: "weight" },
          ]
      }
  }

  // --- 5. REAL ESTATE ---
  if (slug.includes("apartments") || slug.includes("houses")) {
      return {
          titlePlaceholder: "e.g. Apartment in Center 60m2",
          fields: [
              // Condition not always needed for RE but okay
              { label: "Size (m2)", type: "number", key: "size_m2", required: true },
              { label: "Rooms", type: "select", key: "rooms", options: ["Studio", "1", "2", "3", "4+"] },
              { label: "Floor", type: "number", key: "floor" },
              { label: "Heating", type: "select", key: "heating", options: ["Central", "Electricity", "None"] },
              { label: "Balcony", type: "boolean", key: "balcony" },
              { label: "Parking", type: "boolean", key: "parking" },
          ]
      }
  }

  // Default fallback
  return {
    titlePlaceholder: `e.g. ${name}`,
    fields: [ ...baseFields ]
  };
};


export const seedAmazonCategories = action({
  args: {},
  handler: async (ctx) => {
    console.log("Purging all existing categories...");
    // Reuse the existing clear action or create one
    await ctx.runAction(api.seedGoogle.clearCategories);

    console.log("Seeding Amazon-Style Categories...");
    await ctx.runMutation(api.seedAmazon.insertTree, { 
      tree: AMAZON_CATEGORIES 
    });

    return { success: true, count: AMAZON_CATEGORIES.length };
  }
});

export const insertTree = mutation({
  args: { tree: v.array(v.any()) },
  handler: async (ctx, args) => {
    // Helper recursive function
    const insertRecursive = async (items: any[], parentId?: any) => {
      for (const item of items) {
        const id = await ctx.db.insert("categories", {
          name: item.name,
          slug: item.slug,
          parentId: parentId,
          isActive: true,
          isFeatured: !parentId, // Top level featured
          template: getCustomTemplate(item.slug, item.name),
          createdAt: Date.now()
        });

        if (item.subcategories && item.subcategories.length > 0) {
          await insertRecursive(item.subcategories, id);
        }
      }
    };

    await insertRecursive(args.tree);
  }
});
