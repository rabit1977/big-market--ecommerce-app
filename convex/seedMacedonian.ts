import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation } from "./_generated/server";

interface CategoryInput {
  name: string;
  slug: string;
  subcategories?: CategoryInput[];
}

const MACEDONIAN_CATEGORIES: CategoryInput[] = [  { 
    name: "Motor Vehicles", 
    slug: "motor-vehicles",
    subcategories: [
     
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
  { 
    name: "Real Estate", 
    slug: "real-estate",
    subcategories: [
      { 
        name: "Apartments", 
        slug: "apartments",
        subcategories: [
          { name: "Apartments for Sale", slug: "apartments-sale" },
          { name: "Apartments for Rent", slug: "apartments-rent" },
        ]
      },
      { 
        name: "Houses / Villas", 
        slug: "houses",
        subcategories: [
          { name: "Houses for Sale", slug: "houses-sale" },
          { name: "Houses for Rent", slug: "houses-rent" },
        ]
      },
      { 
        name: "Commercial Space", 
        slug: "commercial-space",
        subcategories: [
          { name: "Offices", slug: "offices" },
          { name: "Shops / Stores", slug: "shops" },
          { name: "Warehouses", slug: "warehouses" },
          { name: "Industrial Plants", slug: "industrial-plants" },
        ]
      },
      { 
        name: "Land / Plots", 
        slug: "land",
        subcategories: [
          { name: "Construction Land", slug: "construction-land" },
          { name: "Agricultural Land", slug: "agricultural-land" },
          { name: "Industrial Land", slug: "industrial-land" },
        ]
      },
      { 
        name: "Holiday Homes / Villas", 
        slug: "holiday-homes",
        subcategories: [
          { name: "Holiday Homes for Sale", slug: "holiday-homes-sale" },
          { name: "Holiday Homes for Rent", slug: "holiday-homes-rent" },
        ]
      },
      { name: "Garages / Parking", slug: "garages" },
      { name: "Rooms / Shared Accommodation", slug: "rooms-accommodation" },
      { name: "Abroad", slug: "real-estate-abroad" },
      { name: "Other Real Estate", slug: "other-real-estate" },
    ]
  },
  { 
    name: "Home Appliances", 
    slug: "home-appliances",
    subcategories: [
      { 
        name: "Air Conditioners", 
        slug: "air-conditioners",
        subcategories: [
           { name: "Inverter AC", slug: "inverter-ac" },
           { name: "Standard AC", slug: "standard-ac" },
           { name: "Mobile AC", slug: "mobile-ac" },
           { name: "Multi Split AC", slug: "multi-split-ac" },
           { name: "Fans", slug: "fans" },
           { name: "Accessories for AC", slug: "ac-accessories" },
        ]
      },
      { 
        name: "Refrigerators", 
        slug: "refrigerators",
        subcategories: [
           { name: "Combined Refrigerators", slug: "combined-refrigerators" },
           { name: "Double Door Refrigerators", slug: "double-door-refrigerators" },
           { name: "Single Door Refrigerators", slug: "single-door-refrigerators" },
           { name: "Built-in Refrigerators", slug: "built-in-refrigerators" },
           { name: "Mini Refrigerators", slug: "mini-refrigerators" },
           { name: "Portable Refrigerators", slug: "portable-refrigerators" },
           { name: "Refrigerator Elements", slug: "refrigerator-elements" },
        ]
      },
      { 
        name: "Freezers", 
        slug: "freezers",
        subcategories: [
           { name: "Vertical Freezers", slug: "vertical-freezers" },
           { name: "Horizontal Freezers", slug: "horizontal-freezers" },
           { name: "Built-in Freezers", slug: "built-in-freezers" },
        ]
      },
      { 
        name: "Washing Machines", 
        slug: "washing-machines",
        subcategories: [
           { name: "Washing Machines", slug: "washing-machines-sub" },
           { name: "Dryers", slug: "dryers" },
           { name: "Washer Dryer Combo", slug: "washer-dryer-combo" },
        ]
      },
      { 
        name: "Dishwashers", 
        slug: "dishwashers",
        subcategories: [
           { name: "Built-in Dishwashers", slug: "built-in-dishwashers" },
           { name: "Freestanding Dishwashers", slug: "freestanding-dishwashers" },
        ]
      },
      { 
        name: "Stoves, Ovens & Hobs", 
        slug: "stoves-ovens",
        subcategories: [
           { name: "Electric Stoves", slug: "electric-stoves" },
           { name: "Combined Stoves", slug: "combined-stoves" },
           { name: "Gas Stoves", slug: "gas-stoves" },
           { name: "Mini Stoves", slug: "mini-stoves" },
           { name: "Built-in Ovens", slug: "built-in-ovens" },
           { name: "Built-in Hobs", slug: "built-in-hobs" },
           { name: "Built-in Oven & Hob Sets", slug: "built-in-sets" },
           { name: "Accessories", slug: "stove-accessories" },
        ]
      },
      { 
        name: "Microwaves", 
        slug: "microwaves",
        subcategories: [
           { name: "Built-in Microwaves", slug: "built-in-microwaves" },
           { name: "Freestanding Microwaves", slug: "freestanding-microwaves" },
        ]
      },
      { 
        name: "Hoods", 
        slug: "hoods",
        subcategories: [
           { name: "Built-in Hoods", slug: "built-in-hoods" },
           { name: "Standard Hoods", slug: "standard-hoods" },
        ]
      },
      { 
        name: "Water Heaters", 
        slug: "water-heaters",
        subcategories: [
           { name: "Combined Water Heaters", slug: "combined-water-heaters" },
           { name: "Standard Water Heaters", slug: "standard-water-heaters" },
           { name: "Instant Water Heaters", slug: "instant-water-heaters" },
        ]
      },
      { 
        name: "Heaters", 
        slug: "heaters",
        subcategories: [
           { name: "Radiators", slug: "radiators" },
           { name: "Fireplaces & Stoves", slug: "fireplaces-stoves" },
           { name: "Space Heaters", slug: "space-heaters" },
           { name: "Solid Fuel Stoves", slug: "solid-fuel-stoves" },
        ]
      },
      { 
        name: "Cooling & Wine Displays", 
        slug: "cooling-displays",
        subcategories: [
           { name: "Wine Coolers", slug: "wine-coolers" },
        ]
      },
      { 
        name: "Accessories", 
        slug: "appliances-accessories",
        subcategories: [
           { name: "Stove/Oven Accessories", slug: "acc-stoves" },
           { name: "Spare Parts", slug: "acc-spare-parts" },
           { name: "Air Purifier Filters", slug: "acc-filters" },
           { name: "Washer/Dryer Accessories", slug: "acc-washing" },
           { name: "AC/Hood Accessories", slug: "acc-ac-hood" },
           { name: "Fridge/Freezer Accessories", slug: "acc-fridge" },
        ]
      },
      { 
        name: "Cleaning & Protection", 
        slug: "cleaning-protection",
        subcategories: [
           { name: "Cleaning Wipes", slug: "cleaning-wipes" },
           { name: "Cleaning Liquid", slug: "cleaning-liquid" },
           { name: "Cleaning Tablets", slug: "cleaning-tablets" },
        ]
      },
      { name: "Air Purifiers", slug: "air-purifiers" },
    ]
  },
  {
    name: "Home and Garden",
    slug: "home-and-garden",
    subcategories: [
      { 
        name: "Furniture", 
        slug: "furniture",
        subcategories: [
          { name: "Living Room", slug: "living-room" },
          { name: "Bedroom", slug: "bedroom" },
          { name: "Children's Room", slug: "childrens-room" },
          { name: "Dining Room", slug: "dining-room" },
          { name: "Kitchen", slug: "kitchen-furniture" },
          { name: "Hallway / Entryway", slug: "entryway" },
          { name: "Office Furniture", slug: "office-furniture" },
          { name: "Wardrobe Elements", slug: "wardrobe-elements" },
        ]
      },
      { 
        name: "Garden and Terrace", 
        slug: "garden-terrace",
        subcategories: [
           { name: "Garden Furniture", slug: "garden-furniture" },
           { name: "Pools", slug: "pools" },
           { name: "Solar Showers", slug: "solar-showers" },
           { name: "BBQ and Equipment", slug: "bbq-equipment" },
           { name: "Fences and Equipment", slug: "fences-equipment" },
           { name: "Flower Pots / Planters", slug: "flower-pots" },
           { name: "Garden Decoration", slug: "garden-decoration" },
           { name: "Fountains", slug: "fountains" },
           { name: "Terrace Flooring", slug: "terrace-flooring" },
        ]
      },
      { 
        name: "Kitchen and Dining", 
        slug: "kitchen-dining",
        subcategories: [
           { name: "Cooking and Baking Cookware", slug: "cookware-baking" },
           { name: "Serving Food and Drinks", slug: "serving-food-drinks" },
           { name: "Kitchen Textiles", slug: "kitchen-textiles" },
           { name: "Food Storage Containers", slug: "food-storage" },
           { name: "Shopping Carts", slug: "shopping-carts" },
        ]
      },
      { 
        name: "Bedding, Pillows and Covers", 
        slug: "bedding",
        subcategories: [
           { name: "Pillows", slug: "pillows" },
           { name: "Bedding Sets", slug: "bedding-sets" },
           { name: "Duvets", slug: "duvets" },
           { name: "Blankets", slug: "blankets" },
           { name: "Bedspreads / Covers", slug: "bedspreads" },
        ]
      },
      { 
        name: "Lighting", 
        slug: "lighting",
        subcategories: [
           { name: "Chandeliers", slug: "chandeliers" },
           { name: "Ceiling Lights", slug: "ceiling-lights" },
           { name: "Lamps", slug: "lamps" },
           { name: "Children's Room Lighting", slug: "childrens-lighting" },
           { name: "Garden Lighting", slug: "garden-lighting" },
           { name: "Light Bulbs", slug: "light-bulbs" },
           { name: "LED Strips", slug: "led-strips" },
           { name: "Track Lighting", slug: "track-lighting" },
           { name: "Other Lighting", slug: "other-lighting" },
           { name: "Recessed Lighting", slug: "recessed-lighting" },
           { name: "Decorative Lighting", slug: "decorative-lighting" },
        ]
      },
      { 
        name: "Decoration", 
        slug: "decoration",
        subcategories: [
           { name: "Home Textiles", slug: "home-textiles" },
           { name: "Paintings / Pictures", slug: "paintings-pictures" },
           { name: "Clocks", slug: "clocks" },
           { name: "Artificial Flowers and Pots", slug: "artificial-flowers" },
           { name: "Wall Decoration", slug: "wall-decoration" },
           { name: "Decorative Items", slug: "decorative-items" },
           { name: "Candles and Candlesticks", slug: "candles" },
           { name: "Picture Frames", slug: "picture-frames" },
           { name: "Vases", slug: "vases" },
           { name: "Carpets, Rugs and Mats", slug: "carpets-rugs" },
           { name: "Easter Decoration", slug: "easter-decoration" },
           { name: "Holiday Decoration", slug: "holiday-decoration" },
           { name: "Other Decoration", slug: "other-decoration" },
        ]
      },
      { 
        name: "Bathroom Equipment", 
        slug: "bathroom-equipment",
        subcategories: [
           { name: "Bathroom Furniture and Sanitary Ware", slug: "bathroom-furniture" },
           { name: "Bathroom Sets", slug: "bathroom-sets" },
           { name: "Towels", slug: "towels" },
           { name: "Bathroom Mats and Rugs", slug: "bathroom-mats" },
           { name: "Shower Curtains", slug: "shower-curtains" },
           { name: "Bath and Shower Mats (Rubber)", slug: "bath-rubber-mats" },
           { name: "Sanitary Equipment", slug: "sanitary-equipment" },
           { name: "Faucets and Accessories", slug: "faucets-accessories" },
        ]
      },
      { 
        name: "Wine and Brandy Preparation", 
        slug: "wine-brandy-production",
        subcategories: [
           { name: "Wine and Brandy Storage Vessels", slug: "wine-storage" },
           { name: "Preparation Equipment", slug: "preparation-equipment" },
           { name: "Additional Equipment", slug: "additional-equipment" },
        ]
      },
      { 
        name: "Smart Home", 
        slug: "smart-home",
        subcategories: [
           { name: "Smart Home Elements", slug: "smart-home-elements" },
           { name: "Security Equipment", slug: "security-equipment" },
        ]
      },
      { 
        name: "New Year Decoration", 
        slug: "new-year-decoration",
        subcategories: [
           { name: "Christmas Trees", slug: "christmas-trees" },
           { name: "Tree Ornaments", slug: "tree-ornaments" },
           { name: "Christmas Lights", slug: "christmas-lights" },
           { name: "Garlands, Wreaths and Branches", slug: "garlands-wreaths" },
           { name: "Decorative Christmas Ornaments", slug: "decorative-ornaments" },
        ]
      },
      { name: "Carpentry", slug: "carpentry" },
      { 
        name: "Solar Elements", 
        slug: "solar-elements",
        subcategories: [
           { name: "Solar Panels", slug: "solar-panels" },
           { name: "Charge Controllers and Inverters", slug: "charge-controllers" },
           { name: "Solar Batteries", slug: "solar-batteries" },
        ]
      },
    ]
  },
  { name: "Fashion, Clothing and Shoes", slug: "fashion-clothing-shoes" },
  { 
    name: "Mobile Phones and Accessories", 
    slug: "mobile-phones-accessories",
    subcategories: [
      { name: "Mobile Phones", slug: "mobile-phones" },
      { 
        name: "Accessories for Mobile Phones", 
        slug: "mobile-accessories",
        subcategories: [
           { name: "Batteries", slug: "mobile-batteries" },
           { name: "Chargers", slug: "mobile-chargers" },
           { name: "Screens", slug: "mobile-screens" },
           { name: "Motherboards", slug: "mobile-motherboards" },
           { name: "Headphones", slug: "mobile-headphones" },
           { name: "Memory Cards", slug: "mobile-memory-cards" },
           { name: "Antennas", slug: "mobile-antennas" },
           { name: "Cameras", slug: "mobile-cameras" },
           { name: "Microphones", slug: "mobile-microphones" },
           { name: "Cases", slug: "mobile-cases" },
           { name: "Car Chargers", slug: "mobile-car-chargers" },
           { name: "Protective Foils & Glass", slug: "mobile-protectors" },
           { name: "Bumpers", slug: "mobile-bumpers" },
           { name: "Protective Cases", slug: "mobile-cases-protectors" },
           { name: "Bluetooth Accessories", slug: "mobile-bluetooth" },
           { name: "Mobile Decorations", slug: "mobile-decorations" },
           { name: "Sim Cards", slug: "mobile-sim-cards" },
           { name: "Selfie Sticks", slug: "mobile-selfie-sticks" },
           { name: "Service Tools", slug: "mobile-service-tools" },
           { name: "Mobile Phone Services", slug: "mobile-services" },
           { name: "Buying Mobile Phones", slug: "mobile-buying" },
           { name: "Other Accessories", slug: "mobile-accessories-other" },
        ]
      },
      { name: "Smartwatches", slug: "smartwatches" },
      { name: "Landlines", slug: "landlines" },
      { name: "Faxes", slug: "faxes" },
      { name: "Old Phones", slug: "old-phones" },
      { name: "Other", slug: "mobile-other" },
    ]
  },
  { name: "Computers", slug: "computers" },
  { 
    name: "TV, Audio and Video", 
    slug: "tv-audio-video",
    subcategories: [
      {
        name: "TV",
        slug: "tv",
        subcategories: [
           { name: "Televisions", slug: "televisions" },
           { name: "TV-AV Cables", slug: "tv-av-cables" },
           { name: "TV Antennas and Receivers", slug: "tv-antennas-receivers" },
           { name: "TV Adapters", slug: "tv-adapters" },
           { name: "Screen Cleaning", slug: "screen-cleaning" },
           { name: "TV Accessories", slug: "tv-accessories" },
           { name: "TV Mounts", slug: "tv-mounts" },
           { name: "Remote Controls", slug: "remote-controls" },
        ]
      },
      {
        name: "Audio",
        slug: "audio",
        subcategories: [
           { name: "Soundbars", slug: "soundbars" },
           { name: "Headphones and Equipment", slug: "headphones-equipment" },
           { name: "Radio Clocks and Thermometers", slug: "radio-clocks" },
           { name: "Radios", slug: "radios" },
           { name: "Other Audio Equipment", slug: "other-audio" },
           { name: "Hi-Fi Systems", slug: "hifi-systems" },
           { name: "MP3 Players", slug: "mp3-players" },
           { name: "Microphones and Equipment", slug: "microphones" },
           { name: "Converters", slug: "converters" },
           { name: "Audio Systems", slug: "audio-systems" },
           { name: "Turntables", slug: "turntables" },
           { name: "Dictaphones", slug: "dictaphones" },
           { name: "CD Players", slug: "cd-players" },
           { name: "Wireless Speakers", slug: "wireless-speakers" },
           { name: "Speakers and Equipment", slug: "speakers-equipment" },
        ]
      },
      {
        name: "Video and Projectors",
        slug: "video-projectors",
        subcategories: [
           { name: "Projectors", slug: "projectors" },
           { name: "Projector Screens", slug: "projector-screens" },
           { name: "Other Video Equipment", slug: "other-video" },
           { name: "DVD Players", slug: "dvd-players" },
           { name: "Interactive Graphic Tablets", slug: "graphic-tablets" },
           { name: "Projector Accessories", slug: "projector-accessories" },
        ]
      }
    ]
  },
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
  { 
    name: "Do It Yourself (DIY)", 
    slug: "napravete-sami",
    subcategories: [
      { 
        name: "Cordless Tools", 
        slug: "cordless-tools",
        subcategories: [
          { name: "Cordless Drills & Drivers", slug: "cordless-drills" },
          { name: "Cordless Rotary Hammers", slug: "cordless-rotary-hammers" },
          { name: "Cordless Grinders", slug: "cordless-grinders" },
          { name: "Cordless Impact Drivers", slug: "cordless-impact-drivers" },
          { name: "Cordless Saws", slug: "cordless-saws" },
          { name: "Cordless Routers & Planers", slug: "cordless-routers-planers" },
          { name: "Cordless Renovators & Multitools", slug: "cordless-multitools" },
          { name: "Cordless Industrial Vacuums", slug: "cordless-vacuums" },
          { name: "Cordless Tool Sets", slug: "cordless-tool-sets" },
          { name: "Batteries & Chargers", slug: "cordless-batteries-chargers" },
          { name: "Other Cordless Tools", slug: "cordless-other" },
        ]
      },
      { 
        name: "Garden Tools", 
        slug: "garden-tools",
        subcategories: [
          { name: "Lawn Mowers", slug: "garden-mowers" },
          { name: "Grass Trimmers", slug: "garden-trimmers" },
          { name: "Pressure Washers", slug: "garden-pressure-washers" },
          { name: "Garden Hand Tools", slug: "garden-hand-tools" },
          { name: "Watering & Irrigation", slug: "garden-watering" },
          { name: "Chainsaws", slug: "garden-chainsaws" },
          { name: "Water Pumps", slug: "garden-pumps" },
          { name: "Leaf Blowers & Vacuums", slug: "garden-blowers" },
          { name: "Earth Augers", slug: "garden-augers" },
          { name: "Planting & Care", slug: "garden-planting" },
          { name: "Other Garden Tools", slug: "garden-other" },
          { name: "Nets & Foils", slug: "garden-nets" },
        ]
      },
      { 
        name: "Electric Tools", 
        slug: "electric-tools",
        subcategories: [
          { name: "Electric Drills & Drivers", slug: "electric-drills" },
          { name: "Electric Rotary Hammers", slug: "electric-rotary-hammers" },
          { name: "Electric Saws", slug: "electric-saws" },
          { name: "Electric Grinders", slug: "electric-grinders" },
          { name: "Electric Planers & Routers", slug: "electric-planers" },
          { name: "Renovators - Multitools", slug: "electric-multitools" },
          { name: "Industrial Vacuums", slug: "electric-vacuums" },
          { name: "Heat Guns", slug: "electric-heat-guns" },
          { name: "Staplers & Nailers", slug: "electric-staplers" },
          { name: "Wall Chasers", slug: "electric-wall-chasers" },
          { name: "Mixers for Construction Materials", slug: "electric-mixers" },
          { name: "Sheet Metal Shears", slug: "electric-shears" },
          { name: "Glue Guns", slug: "electric-glue-guns" },
          { name: "Other Electric Tools", slug: "electric-other" },
          { name: "Electric Tool Accessories", slug: "electric-accessories" },
          { name: "Routers", slug: "electric-routers" },
        ]
      },
      { 
        name: "Hand Tools", 
        slug: "hand-tools",
        subcategories: [
          { name: "Pliers", slug: "hand-pliers" },
          { name: "Wrenches & Spanners", slug: "hand-wrenches" },
          { name: "Screwdrivers", slug: "hand-screwdrivers" },
          { name: "Tool Sets", slug: "hand-tool-sets" },
          { name: "Cutters & Utility Knives", slug: "hand-cutters" },
          { name: "Tool Storage & Organization", slug: "hand-storage" },
          { name: "Saws & Hacksaws", slug: "hand-saws" },
          { name: "Hammers & Mallets", slug: "hand-hammers" },
          { name: "Wire Brushes & Files", slug: "hand-brushes" },
          { name: "Clamps & Vices", slug: "hand-clamps" },
          { name: "Chisels & Crowbars", slug: "hand-chisels" },
          { name: "Marking Tools", slug: "hand-marking" },
          { name: "Hand Staplers", slug: "hand-staplers" },
          { name: "Automotive Tools", slug: "hand-automotive" },
          { name: "Shears & Bolt Cutters", slug: "hand-shears" },
          { name: "Other Hand Tools", slug: "hand-other" },
        ]
      },
      { 
        name: "Painting & Ceramics", 
        slug: "painting-ceramics",
        subcategories: [
          { name: "Paint Brushes", slug: "painting-brushes" },
          { name: "Paint Rollers", slug: "painting-rollers" },
          { name: "Foils & Protection", slug: "painting-foil" },
          { name: "Trowels", slug: "painting-trowels" },
          { name: "Spatulas", slug: "painting-spatulas" },
          { name: "Ladles & Trowels", slug: "painting-ladles" },
          { name: "Mixers", slug: "painting-mixers" },
          { name: "Silicone & Foam Guns", slug: "painting-guns" },
          { name: "Telescopic Poles", slug: "painting-telescopic" },
          { name: "Ceramic Tools", slug: "ceramics-tools" },
          { name: "Tile Cutters", slug: "ceramics-cutters" },
          { name: "Ladders, Scaffolding & Platforms", slug: "painting-ladders" },
          { name: "Sanders & Abrasives", slug: "painting-sanders" },
          { name: "Buckets & Trays", slug: "painting-buckets" },
          { name: "Cleaning Brushes", slug: "painting-cleaning" },
          { name: "Other Painting Tools", slug: "painting-other" },
          { name: "Silicone Guns", slug: "painting-silicone-guns" },
          { name: "Large Brushes", slug: "painting-brushes-large" },
        ]
      },
      { 
        name: "Paints & Varnishes", 
        slug: "paints-varnishes",
        subcategories: [
          { name: "Wall Paints", slug: "paints-wall" },
          { name: "Metal Paints", slug: "paints-metal" },
          { name: "Concrete & Stone Paints", slug: "paints-concrete" },
          { name: "Wood Varnishes", slug: "paints-wood" },
          { name: "Spray Paints", slug: "paints-sprays" },
        ]
      },
      { 
        name: "Protective Equipment (PPE)", 
        slug: "protective-equipment",
        subcategories: [
          { name: "Safety Shoes", slug: "protective-shoes" },
          { name: "Protective Clothing", slug: "protective-clothing" },
          { name: "Protective Gloves", slug: "protective-gloves" },
          { name: "Protective Masks", slug: "protective-masks" },
          { name: "Safety Glasses", slug: "protective-glasses" },
          { name: "Helmets & Visors", slug: "protective-helmets" },
          { name: "Hearing Protection", slug: "protective-hearing" },
          { name: "Welding Masks", slug: "protective-welding" },
          { name: "Knee Pads", slug: "protective-knee" },
          { name: "Other PPE", slug: "protective-other" },
        ]
      },
      { 
        name: "Technical Chemistry", 
        slug: "technical-chemistry",
        subcategories: [
          { name: "Construction Silicone", slug: "chem-silicone" },
          { name: "PU Foam", slug: "chem-foam" },
          { name: "Adhesives & Putty", slug: "chem-adhesives" },
          { name: "Technical Sprays", slug: "chem-sprays" },
          { name: "Thermo & Fluoro Sprays", slug: "chem-thermo-sprays" },
          { name: "Other Technical Chemistry", slug: "chem-other" },
        ]
      },
      { 
        name: "Tool Accessories", 
        slug: "tool-accessories",
        subcategories: [
          { name: "Bits & Bit Holders", slug: "acc-bits" },
          { name: "Grinding & Cutting Accessories", slug: "acc-grinding" },
          { name: "Drills, Chisels & Points", slug: "acc-drills" },
          { name: "Saw Blades", slug: "acc-blades" },
          { name: "Milling & Grooving", slug: "acc-milling" },
          { name: "Hole Saws & Adapters", slug: "acc-crowns" },
          { name: "Staples & Nails", slug: "acc-staples" },
          { name: "Chucks & Accessories", slug: "acc-chucks" },
          { name: "Grinder Accessories", slug: "acc-grinder-parts" },
          { name: "Heat Gun Accessories", slug: "acc-heat-gun-parts" },
          { name: "Planer Accessories", slug: "acc-planer-parts" },
          { name: "Pressure Washer Accessories", slug: "acc-washer-parts" },
          { name: "Multitool Accessories", slug: "acc-multitool-parts" },
          { name: "Welding & Soldering Accessories", slug: "acc-welding" },
          { name: "Other Machine Accessories", slug: "acc-machine-other" },
          { name: "Misc Tools & storage", slug: "acc-misc" },
        ]
      },
      { 
        name: "Machines & Pneumatics", 
        slug: "machines-pneumatics",
        subcategories: [
          { name: "Log Splitters", slug: "mach-splitters" },
          { name: "Air Compressors", slug: "mach-compressors" },
          { name: "Power Generators", slug: "mach-generators" },
          { name: "Welding Machines", slug: "mach-welders" },
          { name: "Hoists & Winches", slug: "mach-lifts" },
          { name: "Hydraulic Presses", slug: "mach-presses" },
          { name: "Soldering Irons", slug: "mach-soldering" },
          { name: "Trolleys & Carts", slug: "mach-trolleys" },
          { name: "Pneumatic Tools", slug: "mach-pneumatic" },
          { name: "Floor Cleaning Machines", slug: "mach-cleaning" },
          { name: "Pipe Welders", slug: "mach-pipe-welders" },
          { name: "Forklifts & Pallet Jacks", slug: "mach-forklifts" },
          { name: "Other Machines", slug: "mach-other" },
          { name: "Pneumatic Guns", slug: "mach-pneumatic-guns" },
        ]
      },
      { 
        name: "Measuring Tools", 
        slug: "measuring-tools",
        subcategories: [
          { name: "Construction Lasers", slug: "meas-lasers" },
          { name: "Detectors", slug: "meas-detectors" },
          { name: "Measuring Tapes", slug: "meas-tapes" },
          { name: "Levels", slug: "meas-levels" },
          { name: "Rulers & Squares", slug: "meas-rulers" },
          { name: "Protractors & Compasses", slug: "meas-protractors" },
          { name: "Micrometers", slug: "meas-micrometers" },
          { name: "Multimeters & Testers", slug: "meas-multimeters" },
          { name: "Calipers", slug: "meas-calipers" },
          { name: "Thermal & Inspection Cameras", slug: "meas-cameras" },
          { name: "Tripods & Accessories", slug: "meas-tripods" },
          { name: "Other Measuring Tools", slug: "meas-other" },
        ]
      },
      { 
        name: "Tapes & Ropes", 
        slug: "tapes-ropes",
        subcategories: [
          { name: "Masking Tape", slug: "tape-crepe" },
          { name: "Insulation Tape", slug: "tape-insulation" },
          { name: "Scotch Tape", slug: "tape-scoth" },
          { name: "Double-sided Tape", slug: "tape-double" },
          { name: "Sealing Tape", slug: "tape-sealing" },
          { name: "Banding Tape", slug: "tape-banding" },
          { name: "Ropes", slug: "tape-ropes" },
          { name: "Other Tapes & Ropes", slug: "tape-other" },
        ]
      },
      { 
        name: "Metal Hardware", 
        slug: "metal-hardware",
        subcategories: [
          { name: "Screws & Bolts", slug: "metal-screws" },
          { name: "Nails", slug: "metal-nails" },
          { name: "Dowels", slug: "metal-dowels" },
          { name: "Small Hardware", slug: "metal-small" },
          { name: "Chains & Cables", slug: "metal-chains" },
          { name: "Locks & Handles", slug: "metal-locks" },
          { name: "Metal Cabinets & Safes", slug: "metal-safes" },
          { name: "Padlocks", slug: "metal-padlocks" },
          { name: "Furniture Hardware", slug: "metal-furniture" },
          { name: "Shelf Brackets", slug: "metal-brackets" },
          { name: "Other Metal Hardware", slug: "metal-other" },
        ]
      },
      { 
        name: "Electrical Materials", 
        slug: "electrical-materials",
        subcategories: [
          { name: "Extension Cords & Splitters", slug: "elec-cables" },
          { name: "Batteries & Chargers", slug: "elec-batteries" },
          { name: "Switches", slug: "elec-switches" },
          { name: "Sockets", slug: "elec-sockets" },
          { name: "Plugs", slug: "elec-plugs" },
          { name: "Modular Hardware", slug: "elec-modular" },
          { name: "Junction Boxes", slug: "elec-boxes" },
          { name: "Distribution Panels", slug: "elec-panels" },
          { name: "Circuit Breakers", slug: "elec-breakers" },
          { name: "Cable Carriers", slug: "elec-carriers" },
          { name: "Other Cables", slug: "elec-other" },
        ]
      },
      { 
        name: "Plumbing", 
        slug: "plumbing",
        subcategories: [
          { name: "Valves & Regulators", slug: "plumbing-valves" },
          { name: "Siphons & Drains", slug: "plumbing-drains" },
          { name: "Parts & Accessories", slug: "plumbing-parts" }, 
        ]
      },
      { 
        name: "Construction Materials", 
        slug: "construction-materials",
        subcategories: [
          { name: "Building Materials", slug: "const-building" },
          { name: "Flooring & Wall Coverings", slug: "const-flooring" },
          { name: "Insulation", slug: "const-insulation" },
          { name: "Drainage", slug: "const-drainage" },
          { name: "Construction Equipment", slug: "const-equipment" },
        ]
      },
      { 
        name: "Tiling Program", 
        slug: "tiling-program",
        subcategories: [
          { name: "Tile Spacers", slug: "tiling-spacers" },
        ]
      },
      { 
        name: "Agricultural Machines", 
        slug: "agricultural-machines",
        subcategories: [
           { name: "Cultivators & Tillers", slug: "agri-cultivators" },
           { name: "Storage & Transport Equipment", slug: "agri-storage" },
           { name: "Other Agricultural Machines", slug: "agri-other" },
        ]
      },
    ]
  },
  { name: "Other", slug: "other-categories" },
];


const getCustomTemplate = (slug: string, name: string) => {
  // NO baseFields - each template defines its own fields to avoid duplicates
  
  // ========================================
  // REAL ESTATE
  // ========================================
  
  if (slug.includes("apartments")) {
    return {
      titlePlaceholder: "e.g. Furnished Apartment in Center",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New Construction", "Renovated", "Good", "Needs Renovation"] },
        { label: "Square meters (m2)", type: "number", key: "m2", placeholder: "m2" },
        { label: "Number of rooms", type: "number", key: "rooms", placeholder: "Rooms" },
        { label: "Floor", type: "number", key: "floor", placeholder: "Floor" },
        { label: "Heating", type: "select", key: "heating", options: ["Central", "Electricity", "Inverter AC", "Wood", "None"] },
        { label: "Furnished", type: "select", key: "furnished", options: ["Yes", "Semi", "No"] },
        { label: "Year Built", type: "number", key: "year_built", placeholder: "Year" },
        { label: "Parking/Garage", type: "select", key: "parking", options: ["Yes", "No"] },
      ]
    };
  }

  if (slug.includes("houses") || slug.includes("holiday-homes")) {
    return {
      titlePlaceholder: "e.g. Family House with Yard",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New Construction", "Renovated", "Good", "Needs Renovation"] },
        { label: "House Area (m2)", type: "number", key: "m2", placeholder: "m2" },
        { label: "Yard Area (m2)", type: "number", key: "yard_m2", placeholder: "m2" },
        { label: "Number of rooms", type: "number", key: "rooms", placeholder: "Rooms" },
        { label: "Floors", type: "number", key: "floors", placeholder: "Floors" },
        { label: "Heating", type: "select", key: "heating", options: ["Central", "Electricity", "Heat Pump", "Wood", "Solar"] },
        { label: "Year Built", type: "number", key: "year_built", placeholder: "Year" },
      ]
    };
  }

  if (slug.includes("land")) {
    return {
      titlePlaceholder: "e.g. Construction Plot",
      fields: [
        { label: "Area (m2)", type: "number", key: "m2", placeholder: "m2" },
        { label: "Electricity", type: "select", key: "electricity", options: ["Yes", "No", "Nearby"] },
        { label: "Water", type: "select", key: "water", options: ["Yes", "No", "Nearby"] },
        { label: "Road Access", type: "select", key: "road", options: ["Asphalt", "Dirt Road", "None"] },
      ]
    };
  }

  if (slug.includes("commercial-space") || slug.includes("offices") || slug.includes("shops")) {
    return {
      titlePlaceholder: "e.g. Office Space",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["Renovated", "Good", "Needs Renovation"] },
        { label: "Area (m2)", type: "number", key: "m2", placeholder: "m2" },
        { label: "Rooms", type: "number", key: "rooms", placeholder: "Rooms" },
        { label: "Floor", type: "number", key: "floor", placeholder: "Floor" },
      ]
    };
  }
  
  // ========================================
  // MOTOR VEHICLES
  // ========================================
  
  if (slug === "cars") {
    return {
      titlePlaceholder: "e.g. Volkswagen Golf 7 1.6 TDI",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
        { label: "Brand", type: "select", key: "make", options: ["Alfa Romeo", "Audi", "BMW", "Chevrolet", "Citroen", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Kia", "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault", "Skoda", "Toyota", "Volkswagen", "Volvo", "Other"] },
        { label: "Year", type: "number", key: "year", placeholder: "Year" },
        { label: "Mileage (km)", type: "number", key: "mileage", placeholder: "km" },
        { label: "Fuel", type: "select", key: "fuel", options: ["Petrol", "Diesel", "LPG", "Electric", "Hybrid"] },
        { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic", "Semi-automatic"] },
        { label: "Power (KW)", type: "number", key: "power", placeholder: "KW" },
        { label: "Registration", type: "select", key: "registration", options: ["Registered", "Not registered", "Foreign plates"] },
        { label: "Color", type: "color-picker", key: "color" },
        { label: "Body Type", type: "select", key: "body_type", options: ["Sedan", "Hatchback", "Wagon", "SUV", "Coupe", "Convertible"] },
      ]
    };
  }

  if (slug === "buses" || slug === "vans") {
    return {
      titlePlaceholder: "e.g. Mercedes Sprinter",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
        { label: "Brand", type: "text", key: "make", placeholder: "e.g. Mercedes, MAN, Iveco" },
        { label: "Year", type: "number", key: "year", placeholder: "Year" },
        { label: "Mileage (km)", type: "number", key: "mileage", placeholder: "km" },
        { label: "Fuel", type: "select", key: "fuel", options: ["Diesel", "Petrol", "Electric", "CNG"] },
        { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic"] },
        { label: "Number of Seats", type: "number", key: "seats", placeholder: "Seats" },
        { label: "Power (KW)", type: "number", key: "power", placeholder: "KW" },
        { label: "Registration", type: "select", key: "registration", options: ["Registered", "Not registered", "Foreign plates"] },
      ]
    };
  }

  if (slug === "trucks") {
    return {
      titlePlaceholder: "e.g. MAN TGX 18.440",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
        { label: "Brand", type: "text", key: "make", placeholder: "e.g. MAN, Volvo, Scania, Mercedes" },
        { label: "Year", type: "number", key: "year", placeholder: "Year" },
        { label: "Mileage (km)", type: "number", key: "mileage", placeholder: "km" },
        { label: "Payload (tons)", type: "number", key: "payload", placeholder: "tons" },
        { label: "Fuel", type: "select", key: "fuel", options: ["Diesel", "Electric", "LNG"] },
        { label: "Transmission", type: "select", key: "transmission", options: ["Manual", "Automatic"] },
        { label: "Power (KW)", type: "number", key: "power", placeholder: "KW" },
      ]
    };
  }

  if (slug.includes("motorcycles") || slug.includes("mopeds") || slug.includes("scooters")) {
    return {
      titlePlaceholder: "e.g. Honda CBR 600RR",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
        { label: "Brand", type: "text", key: "make", placeholder: "Brand" },
        { label: "Year", type: "number", key: "year", placeholder: "Year" },
        { label: "Mileage", type: "number", key: "mileage", placeholder: "km" },
        { label: "Displacement (ccm)", type: "number", key: "ccm", placeholder: "ccm" },
        { label: "Power (KW)", type: "number", key: "power", placeholder: "KW" },
        { label: "Color", type: "color-picker", key: "color" },
      ]
    };
  }

  // ========================================
  // HOME APPLIANCES - NESTED SUBCATEGORIES FIRST
  // ========================================

  // Air Conditioners - Specific Types
  if (slug === "inverter-ac" || slug === "standard-ac" || slug === "mobile-ac" || slug === "multi-split-ac") {
    return {
      titlePlaceholder: "e.g. Gree Inverter 3.5kW",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Gree, Vivax, Daikin" },
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
        { label: "Power Cooling (kW)", type: "number", key: "power_cooling", placeholder: "kW" },
        { label: "Power Heating (kW)", type: "number", key: "power_heating", placeholder: "kW" },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A+++", "A++", "A+", "A", "B", "C", "D"] },
        { label: "Warranty (Months)", type: "number", key: "warranty", placeholder: "Months" },
      ]
    };
  }

  // Air Conditioners - Parent
  if (slug === "air-conditioners") {
    return {
      titlePlaceholder: "e.g. Air Conditioner",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Gree, Vivax, Daikin" },
        { label: "Type", type: "select", key: "ac_type", options: ["Inverter", "Standard", "Portable", "Multi Split"] },
        { label: "Power Cooling (kW)", type: "number", key: "power_cooling", placeholder: "kW" },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A+++", "A++", "A+", "A", "B", "C", "D"] },
      ]
    };
  }

  // Refrigerators - Specific Types
  if (slug === "combined-refrigerators" || slug === "double-door-refrigerators" || slug === "single-door-refrigerators" || 
      slug === "built-in-refrigerators" || slug === "mini-refrigerators") {
    return {
      titlePlaceholder: "e.g. Samsung Combined 350L",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Samsung, Beko, Gorenje, LG" },
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
        { label: "Capacity (Liters)", type: "number", key: "capacity_liters", placeholder: "Liters" },
        { label: "Height (cm)", type: "number", key: "height", placeholder: "cm" },
        { label: "No Frost", type: "select", key: "no_frost", options: ["Yes", "No"] },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A+++", "A++", "A+", "A", "B", "C"] },
        { label: "Warranty (Months)", type: "number", key: "warranty", placeholder: "Months" },
      ]
    };
  }

  // Refrigerators - Parent
  if (slug === "refrigerators") {
    return {
      titlePlaceholder: "e.g. Refrigerator",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Samsung, Beko, Gorenje" },
        { label: "Type", type: "select", key: "fridge_type", options: ["Combined", "Double Door", "Single Door", "Built-in", "Mini"] },
        { label: "Capacity (Liters)", type: "number", key: "capacity_liters", placeholder: "Liters" },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A+++", "A++", "A+", "A", "B", "C"] },
      ]
    };
  }

  // Washing Machines - Specific Types
  if (slug === "washing-machines-sub" || slug === "dryers" || slug === "washer-dryer-combo") {
    return {
      titlePlaceholder: "e.g. Beko 7kg Washing Machine",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Beko, Whirlpool, Samsung" },
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
        { label: "Load Capacity (kg)", type: "number", key: "capacity_kg", placeholder: "kg" },
        { label: "Spin Speed (RPM)", type: "number", key: "rpm", placeholder: "RPM" },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A+++", "A++", "A+", "A", "B", "C"] },
        { label: "Warranty (Months)", type: "number", key: "warranty", placeholder: "Months" },
      ]
    };
  }

  // Washing Machines - Parent
  if (slug === "washing-machines") {
    return {
      titlePlaceholder: "e.g. Washing Machine",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Type", type: "select", key: "type", options: ["Washing Machine", "Dryer", "Combo"] },
        { label: "Load Capacity (kg)", type: "number", key: "capacity_kg", placeholder: "kg" },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A+++", "A++", "A+", "A"] },
      ]
    };
  }

  // Dishwashers
  if (slug === "built-in-dishwashers" || slug === "freestanding-dishwashers") {
    return {
      titlePlaceholder: "e.g. Bosch Dishwasher 12 Place",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Bosch, Beko, Gorenje" },
        { label: "Place Settings", type: "number", key: "place_settings", placeholder: "12, 14, etc." },
        { label: "Width (cm)", type: "number", key: "width", placeholder: "45or 60" },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A+++", "A++", "A+", "A"] },
        { label: "Warranty (Months)", type: "number", key: "warranty", placeholder: "Months" },
      ]
    };
  }

  if (slug === "dishwashers") {
    return {
      titlePlaceholder: "e.g. Dishwasher",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Type", type: "select", key: "type", options: ["Built-in", "Freestanding"] },
        { label: "Place Settings", type: "number", key: "place_settings", placeholder: "12, 14, etc." },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A+++", "A++", "A+", "A"] },
      ]
    };
  }

  // Stoves & Ovens
  if (slug === "electric-stoves" || slug === "gas-stoves" || slug === "combined-stoves") {
    return {
      titlePlaceholder: "e.g. Gorenje 4-Burner Stove",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Gorenje, Beko" },
        { label: "Number of Burners", type: "number", key: "burners", placeholder: "4" },
        { label: "Oven Volume (L)", type: "number", key: "oven_volume", placeholder: "Liters" },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A", "B", "C", "D"] },
      ]
    };
  }

  // Televisions
  if (slug === "televisions") {
    return {
      titlePlaceholder: "e.g. Samsung 55' 4K Smart TV",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Samsung, LG, Sony" },
        { label: "Screen Size (inch)", type: "number", key: "screen_size_inch", placeholder: "Inches" },
        { label: "Resolution", type: "select", key: "resolution", options: ["HD Ready", "Full HD", "4K Ultra HD", "8K"] },
        { label: "Screen Type", type: "select", key: "screen_type", options: ["LED", "OLED", "QLED", "LCD"] },
        { label: "Smart TV", type: "select", key: "smart_tv", options: ["Yes", "No"] },
      ]
    };
  }

  // Mobile Phones
  if (slug === "mobile-phones") {
    return {
      titlePlaceholder: "e.g. iPhone 14 Pro 256GB",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used - Excellent", "Used - Good", "Used - Fair", "For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Apple, Samsung, Xiaomi" },
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
        { label: "Storage (GB)", type: "number", key: "storage", placeholder: "GB" },
        { label: "RAM (GB)", type: "number", key: "ram", placeholder: "GB" },
        { label: "Color", type: "color-picker", key: "color" },
        { label: "Battery Health (%)", type: "number", key: "battery_health", placeholder: "%" },
      ]
    };
  }

  // ========================================
  // FALLBACK - Generic Template
  // ========================================
  
  return {
    titlePlaceholder: `e.g. ${name}`,
    fields: [
      { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged"] },
      { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
      { label: "Description", type: "textarea", key: "description", placeholder: "Details..." },
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
