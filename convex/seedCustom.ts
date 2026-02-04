
import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation } from "./_generated/server";

interface CategoryInput {
  name: string;
  slug: string;
  subcategories?: CategoryInput[];
}

const CUSTOM_CATEGORIES: CategoryInput[] = [
  { 
    name: "Motor Vehicles", 
    slug: "motor-vehicles",
    subcategories: [
      { name: "Cars", slug: "cars" },
      { name: "Motorcycles (above 50 cc)", slug: "motorcycles" },
      { name: "Mopeds (under 50 cc)", slug: "mopeds" },
      { name: "Electric Scooters", slug: "electric-scooters" },
      { name: "Buses", slug: "buses" },
      { name: "Vans", slug: "vans" },
      { name: "Trucks", slug: "trucks" },
      { name: "Trailers", slug: "trailers" },
      { name: "Damaged Vehicles / Spare Parts", slug: "damaged-vehicles" },
      { name: "Camping Vehicles", slug: "camping-vehicles" },
      { 
          name: "Agricultural Vehicles", 
          slug: "agricultural-vehicles",
          subcategories: [
              { name: "Tractors", slug: "tractors" },
              { name: "Attachment Machines", slug: "attachment-machines" },
              { name: "Harvesters", slug: "harvesters" },
              { name: "Forestry Machines", slug: "forestry-machines" },
              { name: "Spare Parts", slug: "agri-parts" },
              { name: "Other", slug: "other-agri" },
          ]
      },
      { 
          name: "Heavy Duty / Construction / Forklifts", 
          slug: "heavy-duty",
          subcategories: [
              { name: "Freight and Towing Vehicles", slug: "freight-towing" },
              { name: "Construction Machines", slug: "construction-machines" },
              { name: "Forklifts and Cargo Handling", slug: "forklifts" },
              { name: "Spare Parts", slug: "heavy-parts" },
              { name: "Other", slug: "other-heavy" },
          ]
      },
      { 
          name: "Boats / Yachts / Jet Skis", 
          slug: "boats-watercraft",
          subcategories: [
              { name: "Motor Boats", slug: "motor-boats" },
              { name: "Sailboats", slug: "sailboats" },
              { name: "Rowing Boats", slug: "rowing-boats" },
              { name: "Rubber Boats", slug: "rubber-boats" },
              { name: "Jet Skis", slug: "jet-skis" },
              { name: "Parts and Accessories", slug: "boat-parts" },
              { name: "Other", slug: "other-boats" },
          ] 
      },
      { 
          name: "Auto Parts & Equipment", 
          slug: "auto-parts",
          subcategories: [
              { name: "Tires and Rims", slug: "tires-rims" },
              { name: "Auto Hi-Fi and Navigation", slug: "auto-hifi" },
              { name: "Spare Parts", slug: "auto-spare-parts" },
              { name: "Tuning", slug: "auto-tuning" },
              { name: "Styling and Sports Equipment", slug: "auto-styling" },
              { name: "Motor Oil and Additives", slug: "auto-oil" },
              { name: "Car Care", slug: "car-care" },
              { name: "Car Accessories", slug: "car-accessories" },
              { name: "Roof Racks / Trunks", slug: "roof-racks" },
              { name: "Tools", slug: "auto-tools" },
              { name: "Repair Manuals / Books", slug: "auto-manuals" },
              { name: "Other", slug: "other-auto-parts" },
          ] 
      },
      { 
          name: "Motorcycle Parts & Equipment", 
          slug: "moto-parts",
          subcategories: [
              { name: "Tires and Rims", slug: "moto-tires" },
              { name: "Spare Parts", slug: "moto-spare-parts" },
              { name: "Clothing / Protection", slug: "moto-clothing" },
              { name: "Tuning", slug: "moto-tuning" },
              { name: "Styling and Sports Equipment", slug: "moto-styling" },
              { name: "Motor Oil and Additives", slug: "moto-oil" },
              { name: "Motorcycle Accessories", slug: "moto-accessories" },
              { name: "Tools", slug: "moto-tools" },
              { name: "Motorcycle Care", slug: "moto-care" },
              { name: "Repair Manuals / Books", slug: "moto-manuals" },
          ] 
      },
      { name: "Towing Service", slug: "towing-service" },
      { name: "Vehicle Buying Service", slug: "vehicle-buying" },
      { name: "Other", slug: "other-vehicles" },
    ]
  },
  { name: "Nedviznosti", slug: "real-estate" },
  { name: "Бела техника", slug: "white-goods" },
  { name: "ТВ, Аудио и Видео", slug: "tv-audio-video" },
  { name: "Направете сами", slug: "diy" },
  { name: "Мали куќни апарати", slug: "small-home-appliances" },
  { name: "Апарати за нега и убавина", slug: "beauty-appliances" },
  { name: "Дом и градина", slug: "home-and-garden" },
  { name: "Авто Мото", slug: "auto-moto" },
  { name: "IT Shop", slug: "it-shop" },
  { name: "Гејминг", slug: "gaming" },
  { name: "Спорт и рекреација", slug: "sports-recreation" },
  { name: "Телефони и фотографија", slug: "phones-photography" },
  { name: "Детска опрема", slug: "baby-kids" },
  { name: "Одржување на домот", slug: "home-maintenance" },
  { name: "Убавина и нега", slug: "beauty-care" },
  { name: "Облека", slug: "clothing" },
  { name: "Модни додатоци", slug: "fashion-accessories" },
  { name: "Обувки", slug: "footwear" },
  { name: "Uslugi i serviseri", slug: "services" },
  { name: "vrabotuvanje", slug: "employment" },
  { name: "Pet shop", slug: "pet-shop" },
  { name: "Исхрана и здравје", slug: "nutrition-health" },
  { name: "Храна и пијалоци", slug: "food-drinks" },
  { name: "Играчки за деца", slug: "toys" },
  { name: "Книжарница и забава", slug: "books-entertainment" },
  { name: "Канцелариски и училишен прибор", slug: "office-school" },
  { name: "Музички инструменти и опрема", slug: "musical-instruments" },
  { name: "Домашни традиционални производи", slug: "traditional-products" },
];

export const seedCustomCategories = action({
  args: {},
  handler: async (ctx) => {
    console.log("Purging all existing categories...");
    // Reuse the existing clear action 
    await ctx.runAction(api.seedGoogle.clearCategories);

    console.log("Seeding Custom Categories...");
    await ctx.runMutation(api.seedCustom.insertTree, { 
      tree: CUSTOM_CATEGORIES 
    });

    return { success: true, count: CUSTOM_CATEGORIES.length };
  }
});

// ==========================================
// TEMPLATE LOGIC
// ==========================================
const getCustomTemplate = (slug: string, name: string) => {
  const baseFields = [
    { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Like New", "Used - Good", "Defective"] },
  ];

  const autoFields = [
      { label: "Brand", type: "select", key: "make", options: ["Audi", "BMW", "Mercedes", "VW", "Ford", "Toyota", "Opel", "Citroen", "Peugeot", "Renault", "Kia", "Hyundai", "Other"] },
      { label: "Model", type: "text", key: "model", required: true },
      { label: "Year", type: "number", key: "year", required: true },
      { label: "Mileage (km)", type: "number", key: "mileage", required: true },
      { label: "Fuel", type: "select", key: "fuel", options: ["Diesel", "Petrol", "Hybrid", "Electric", "LPG", "CNG"] },
      { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic", "Semi-auto"] },
      { label: "Registration", type: "select", key: "registration", options: ["Macedonian Plates", "Foreign Plates", "Not Registered"] },
      { label: "Power (KW)", type: "number", key: "power" },
      { label: "Color", type: "text", key: "color" },
  ];

  if (slug === "cars") {
      return {
          titlePlaceholder: "e.g. BMW 320d M-Sport",
          fields: [
              ...baseFields,
              ...autoFields,
              { label: "Body Type", type: "select", key: "body_type", options: ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Van"] },
          ]
      };
  }

  if (slug === "motorcycles" || slug === "mopeds" || slug === "electric-scooters") {
      return {
          titlePlaceholder: "e.g. Yamaha MT-07",
          fields: [
              ...baseFields,
              { label: "Make", type: "text", key: "make" },
              { label: "Model", type: "text", key: "model" },
              { label: "Year", type: "number", key: "year" },
              { label: "Mileage (km)", type: "number", key: "mileage" },
              { label: "Engine (cc)", type: "number", key: "cc" },
              { label: "Power (KW)", type: "number", key: "power" },
          ]
      };
  }

  if (slug === "trucks" || slug === "buses" || slug === "vans" || slug === "freight-towing") {
      return {
          titlePlaceholder: `e.g. MAN TGX`,
          fields: [
              ...baseFields,
              ...autoFields,
              { label: "Load Capacity (kg)", type: "number", key: "capacity" },
              { label: "Axles", type: "number", key: "axles" },
          ]
      };
  }

  if (slug === "tractors" || slug === "harvesters" || slug === "construction-machines" || slug === "forklifts") {
       return {
           titlePlaceholder: `e.g. JCB 3CX`,
           fields: [
               ...baseFields,
               { label: "Make", type: "text", key: "make" },
               { label: "Model", type: "text", key: "model" },
               { label: "Year", type: "number", key: "year" },
               { label: "Working Hours", type: "number", key: "hours" },
               { label: "Power (KW/HP)", type: "number", key: "power" },
               { label: "Weight (tons)", type: "number", key: "weight" },
           ]
       };
  }

  if (slug.includes("boats") || slug === "motor-boats" || slug === "sailboats") {
      return {
          titlePlaceholder: "e.g. Sea-Doo Spark",
          fields: [
              ...baseFields,
              { label: "Make", type: "text", key: "make" },
              { label: "Year", type: "number", key: "year" },
              { label: "Length (m)", type: "number", key: "length" },
              { label: "Engine Type", type: "select", key: "engine_type", options: ["Inboard", "Outboard"] },
              { label: "Fuel", type: "select", key: "fuel", options: ["Petrol", "Diesel"] },
              { label: "Power (HP)", type: "number", key: "power" },
          ]
      };
  }

  if (slug.includes("parts") || slug.includes("accessories") || slug.includes("equipment") || slug.includes("tires")) {
       return {
           titlePlaceholder: "e.g. Winter Tires Michelin 205/55/16",
           fields: [
               { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Good", "Defective"] },
               { label: "Brand", type: "text", key: "brand" },
               { label: "Compatible Vehicle", type: "text", key: "compatibility", placeholder: "e.g. Golf 5" },
           ]
       };
  }

  return {
    titlePlaceholder: `e.g. ${name}`,
    fields: [ ...baseFields ]
  };
};

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

        if (item.subcategories && item.subcategories.length > 0) {
          await insertRecursive(item.subcategories, id);
        }
      }
    };

    await insertRecursive(args.tree);
  }
});
