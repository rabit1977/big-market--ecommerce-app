import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation } from "./_generated/server";

interface CategoryInput {
  name: string;
  slug: string;
  subcategories?: CategoryInput[];
}

const MACEDONIAN_CATEGORIES: CategoryInput[] = [
  { name: "All Categories", slug: "all-categories" },
  { 
    name: "Motor Vehicles", 
    slug: "motor-vehicles",
    subcategories: [
      { name: "All Motor Vehicles", slug: "all-motor-vehicles" },
      { name: "Cars", slug: "cars" },
      { name: "Motorcycles (above 50 cc)", slug: "motorcycles-above-50cc" },
      { name: "Mopeds (under 50 cc)", slug: "mopeds-under-50cc" },
      { name: "Electric Scooters", slug: "electric-scooters" },
      { name: "Buses", slug: "buses" },
      { name: "Vans", slug: "vans" },
      { name: "Trucks", slug: "trucks" },
      { name: "Trailers", slug: "trailers" },
      { name: "Damaged Vehicles / For Spare Parts", slug: "damaged-vehicles-parts" },
      { name: "Camping Vehicles", slug: "camping-vehicles" },
      { 
        name: "Agricultural Vehicles", 
        slug: "agricultural-vehicles",
        subcategories: [
          { name: "All Agricultural Vehicles", slug: "all-agricultural-vehicles" },
          { name: "Tractors", slug: "tractors" },
          { name: "Attachment Machines", slug: "attachment-machines" },
          { name: "Harvesters", slug: "harvesters" },
          { name: "Forestry Machines", slug: "forestry-machines" },
          { name: "Spare Parts", slug: "spare-parts-agri" },
          { name: "Other", slug: "other-agri" },
        ]
      },
      { 
        name: "Heavy Duty / Construction / Forklifts", 
        slug: "heavy-duty-construction",
        subcategories: [
          { name: "All Heavy Vehicles", slug: "all-heavy-vehicles" },
          { name: "Freight and Towing Vehicles", slug: "freight-towing-vehicles" },
          { name: "Construction Machines", slug: "construction-machines" },
          { name: "Forklifts and Cargo Handling", slug: "forklifts-handling" },
          { name: "Spare Parts", slug: "spare-parts-heavy" },
          { name: "Other", slug: "other-heavy" },
        ]
      },
      { 
        name: "Boats / Yachts / Jet Skis", 
        slug: "boats-yachts-jetskis",
        subcategories: [
          { name: "All Boats", slug: "all-boats" },
          { name: "Motor Boats", slug: "motor-boats" },
          { name: "Sailing Boats", slug: "sailing-boats" },
          { name: "Rowing Boats", slug: "rowing-boats" },
          { name: "Rubber Boats", slug: "rubber-boats" },
          { name: "Jet Skis", slug: "jet-skis" },
          { name: "Parts and Accessories", slug: "parts-accessories-boats" },
          { name: "Other", slug: "other-boats" },
        ]
      },
      { 
        name: "Auto Parts and Equipment", 
        slug: "auto-parts-equipment",
        subcategories: [
          { name: "All Auto Parts", slug: "all-auto-parts" },
          { name: "Tires and Rims", slug: "tires-rims" },
          { name: "Auto Hi-Fi and Navigation", slug: "auto-hifi-navigation" },
          { name: "Spare Parts", slug: "spare-parts-cars" },
          { name: "Tuning", slug: "tuning-cars" },
          { name: "Styling and Sports Equipment", slug: "styling-sports-cars" },
          { name: "Motor Oil and Additives", slug: "oil-additives-cars" },
          { name: "Car Care", slug: "car-care" },
          { name: "Car Accessories", slug: "car-accessories" },
          { name: "Roof Racks", slug: "roof-racks" },
          { name: "Tools", slug: "tools-cars" },
          { name: "Repair Instructions, Books", slug: "manuals-books-cars" },
          { name: "Other", slug: "other-auto-parts" },
        ]
      },
      { 
        name: "Motorcycle Parts and Equipment", 
        slug: "motorcycle-parts-equipment",
        subcategories: [
          { name: "All Motorcycle Parts", slug: "all-motorcycle-parts" },
          { name: "Tires and Rims", slug: "tires-rims-moto" },
          { name: "Spare Parts", slug: "spare-parts-moto" },
          { name: "Clothing/Protection", slug: "clothing-protection-moto" },
          { name: "Tuning", slug: "tuning-moto" },
          { name: "Styling and Sports Equipment", slug: "styling-sports-moto" },
          { name: "Motor Oil and Additives", slug: "oil-additives-moto" },
          { name: "Motorcycle Accessories", slug: "accessories-moto" },
          { name: "Tools", slug: "tools-moto" },
          { name: "Motorcycle Care", slug: "care-moto" },
          { name: "Repair Instructions/Books", slug: "manuals-books-moto" },
        ]
      },
      { name: "Towing Service", slug: "towing-service" },
      { name: "Car/Vehicle Buying Service", slug: "vehicle-buying" },
      { name: "Other", slug: "other-vehicles" },
    ]
  },
  { name: "Real Estate", slug: "real-estate" },
  { name: "Home and Garden", slug: "home-and-garden" },
  { name: "Fashion, Clothing and Shoes", slug: "fashion-clothing-shoes" },
  { name: "Mobile Phones and Accessories", slug: "mobile-phones-accessories" },
  { name: "Computers", slug: "computers" },
  { name: "TV, Video, Photo and Multimedia", slug: "tv-video-photo-multimedia" },
  { name: "Musical Instruments and Equipment", slug: "musical-instruments-equipment" },
  { name: "Watches and Jewelry", slug: "watches-jewelry" },
  { name: "Baby and Children's Products", slug: "baby-children-products" },
  { name: "Health, Beauty and Equipment", slug: "health-beauty" },
  { name: "CD, DVD, VHS Music, Movies", slug: "multimedia-movies" },
  { name: "Books and Literature", slug: "books-literature" },
  { name: "Office and School Supplies", slug: "office-school-supplies" },
  { name: "Leisure and Hobby, Animals", slug: "hobby-animals" },
  { name: "Sports Equipment and Activities", slug: "sports-activities" },
  { name: "Antiques, Art, Collection", slug: "antiques-art" },
  { name: "Business and Services, Machines & Tools", slug: "business-machines-tools" },
  { name: "Food and Cooking", slug: "food-cooking" },
  { name: "Shops, Trade", slug: "shops-trade" },
  { name: "Services, Repairs", slug: "services-repairs" },
  { name: "Employment", slug: "employment" },
  { name: "Events, Nightlife, Exhibitions", slug: "events-nightlife" },
  { name: "Vacation, Tourism, Tickets, Travel", slug: "vacation-tourism" },
  { name: "Personal Contacts", slug: "personal-contacts" },
  { name: "Other", slug: "other-categories" },
];

const getCustomTemplate = (slug: string, name: string) => {
  const baseFields = [
    { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
  ];

  // COMMON FIELD SETS
  const autoFields = [
    { label: "Brand", type: "text", key: "make", placeholder: "Choose Brand" },
    { label: "Year", type: "number", key: "year", placeholder: "Year" },
    { label: "Mileage (km)", type: "number", key: "mileage", placeholder: "km" },
    { label: "Fuel", type: "select", key: "fuel", options: ["Petrol", "Diesel", "LPG", "Electric", "Hybrid"] },
    { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic", "Semi-automatic"] },
    { label: "Registration", type: "select", key: "registration", options: ["Registered", "Not registered", "Foreign plates"] },
    { label: "Power (KW)", type: "number", key: "power", placeholder: "KW" },
  ];

  const heavyFields = [
    { label: "Year", type: "number", key: "year", placeholder: "Production Year" },
    { label: "Working Hours", type: "number", key: "working_hours", placeholder: "hours" },
    { label: "Power (KW/HP)", type: "number", key: "power", placeholder: "Power" },
    { label: "Capacity (kg)", type: "number", key: "capacity", placeholder: "kg" },
  ];

  // SPECIFIC CATEGORY LOGIC
  if (slug === "cars") {
    return {
      titlePlaceholder: "e.g. Volkswagen Golf 7 1.6 TDI",
      fields: [
        ...baseFields,
        ...autoFields,
        { label: "Color", type: "color-picker", key: "color" },
        { label: "Body Type", type: "select", key: "body_type", options: ["Sedan", "Hatchback", "Wagon", "SUV", "Coupe", "Convertible", "Pickup"] },
      ]
    };
  }

  if (slug === "buses" || slug === "vans") {
    return {
      titlePlaceholder: `e.g. ${name}`,
      fields: [
        ...baseFields,
        ...autoFields,
        { label: "Number of Seats", type: "number", key: "seats", placeholder: "Seats" },
      ]
    };
  }

  if (slug === "trucks") {
    return {
      titlePlaceholder: `e.g. MAN TGX 18.440`,
      fields: [
        ...baseFields,
        ...autoFields,
        { label: "Payload (t)", type: "number", key: "payload", placeholder: "tons" },
      ]
    };
  }

  if (slug.includes("motorcycles") || slug.includes("mopeds") || slug.includes("scooters")) {
    return {
      titlePlaceholder: `e.g. Honda CBR 600RR`,
      fields: [
        ...baseFields,
        { label: "Year", type: "number", key: "year", placeholder: "Year" },
        { label: "Mileage", type: "number", key: "mileage", placeholder: "km" },
        { label: "Displacement (ccm)", type: "number", key: "ccm", placeholder: "ccm" },
        { label: "Power (KW)", type: "number", key: "power", placeholder: "KW" },
        { label: "Color", type: "color-picker", key: "color" },
      ]
    };
  }

  if (slug.includes("tractors") || slug.includes("agricultural") || slug.includes("harvesters")) {
    return {
      titlePlaceholder: `e.g. IMT 539`,
      fields: [
        ...baseFields,
        ...heavyFields,
      ]
    };
  }

  if (slug.includes("construction") || slug.includes("heavy") || slug.includes("forklifts")) {
    return {
      titlePlaceholder: `e.g. JCB 3CX`,
      fields: [
        ...baseFields,
        ...heavyFields,
        { label: "Type", type: "text", key: "machine_type", placeholder: "e.g. Excavator, Forklift" },
      ]
    };
  }

  if (slug === "trailers") {
    return {
      titlePlaceholder: "e.g. Truck Trailer",
      fields: [
        ...baseFields,
        { label: "Year", type: "number", key: "year", placeholder: "Year" },
        { label: "Payload (t)", type: "number", key: "payload", placeholder: "tons" },
        { label: "Number of Axles", type: "number", key: "axles", placeholder: "Axles" },
      ]
    };
  }

  if (slug.includes("boats") || slug.includes("jetskis")) {
    return {
      titlePlaceholder: "e.g. Sea-Doo Spark",
      fields: [
        ...baseFields,
        { label: "Year", type: "number", key: "year", placeholder: "Year" },
        { label: "Length (m)", type: "number", key: "length", placeholder: "meters" },
        { label: "Engine Power (HP)", type: "number", key: "engine_power", placeholder: "HP" },
        { label: "Fuel", type: "select", key: "fuel", options: ["Petrol", "Diesel", "Electric"] },
      ]
    };
  }

  if (slug === "camping-vehicles") {
    return {
      titlePlaceholder: "e.g. Fiat Ducato Hymer",
      fields: [
        ...baseFields,
        ...autoFields,
        { label: "Number of Beds", type: "number", key: "beds", placeholder: "Beds" },
      ]
    };
  }

  if (slug.includes("spare-parts") || slug.includes("equipment")) {
    return {
      titlePlaceholder: "e.g. Front Bumper for BMW E46",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Refurbished"] },
        { label: "Brand", type: "text", key: "make", placeholder: "e.g. Bosch, Brembo" },
        { label: "For Vehicle (Model/Year)", type: "text", key: "compatibility", placeholder: "e.g. VW Golf 5 2005" },
      ]
    };
  }

  if (slug === "damaged-vehicles-parts") {
    return {
      titlePlaceholder: "e.g. Opel Astra for parts",
      fields: [
        { label: "Type", type: "select", key: "damage_type", options: ["For parts", "Damaged - Drivable", "Damaged - Non-drivable"] },
        { label: "Brand and Model", type: "text", key: "make_model", placeholder: "e.g. Audi A4" },
        { label: "Year", type: "number", key: "year", placeholder: "Year" },
        { label: "Description of damage", type: "textarea", key: "damage_description", placeholder: "Detailed description..." }
      ]
    };
  }

  return {
    titlePlaceholder: `e.g. ${name}`,
    fields: [
      ...baseFields,
    ]
  };
};

export const seedMacedonianCategories = action({
  args: {},
  handler: async (ctx) => {
    console.log("Purging all existing categories...");
    await ctx.runAction(api.seedGoogle.clearCategories);

    console.log("Seeding English Categories...");
    await ctx.runMutation(api.seedMacedonian.insertTree, { 
      tree: MACEDONIAN_CATEGORIES 
    });

    return { success: true, count: MACEDONIAN_CATEGORIES.length };
  }
});

export const insertTree = mutation({
  args: { tree: v.array(v.any()) },
  handler: async (ctx, args) => {
    const insertRecursive = async (items: any[], parentId?: any) => {
      for (const item of items) {
        const id = await ctx.db.insert("categories", {
          name: item.name,
          slug: item.slug,
          parentId: parentId,
          isActive: true,
          isFeatured: !parentId,
          template: getCustomTemplate(item.slug, item.name),
          createdAt: Date.now()
        });

        if (item.subcategories) {
          await insertRecursive(item.subcategories, id);
        }
      }
    };

    await insertRecursive(args.tree);
  }
});
