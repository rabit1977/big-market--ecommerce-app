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
  { name: "Home and Garden", slug: "home-and-garden" },
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

  // REAL ESTATE LOGIC
  if (slug.includes("apartments")) {
    return {
      titlePlaceholder: "e.g. Furnished Apartment in Center",
      fields: [
        ...baseFields,
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
        ...baseFields,
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
      titlePlaceholder: "e.g. Construction Plot in Karpos",
      fields: [
        ...baseFields,
        { label: "Area (m2)", type: "number", key: "m2", placeholder: "m2" },
        { label: "Electricity", type: "select", key: "electricity", options: ["Yes", "No", "Nearby"] },
        { label: "Water", type: "select", key: "water", options: ["Yes", "No", "Nearby"] },
        { label: "Road Access", type: "select", key: "road", options: ["Asphalt", "Dirt Road", "None"] },
      ]
    };
  }

  if (slug.includes("commercial-space") || slug.includes("offices") || slug.includes("shops")) {
    return {
      titlePlaceholder: "e.g. Office Space in Aerodrom",
      fields: [
        ...baseFields,
        { label: "Area (m2)", type: "number", key: "m2", placeholder: "m2" },
        { label: "Rooms", type: "number", key: "rooms", placeholder: "Rooms" },
        { label: "Floor", type: "number", key: "floor", placeholder: "Floor" },
      ]
    };
  }
  
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

  if (slug === "home-appliances" || slug === "air-conditioners" || slug === "refrigerators" || slug === "washing-machines" || slug === "stoves-ovens") {
    return {
      titlePlaceholder: "e.g. Samsung Inverter AC 3.5kW",
      fields: [
        { label: "Condition", type: "select", key: "condition", options: ["New", "Used", "Damaged / For Parts"] },
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Samsung, Beko, Gorenje" },
        { label: "Model", type: "text", key: "model", placeholder: "Model number" },
        { label: "Energy Class", type: "select", key: "energy_class", options: ["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"] },
        { label: "Warranty (Months)", type: "number", key: "warranty", placeholder: "Months left" },
      ]
    };
  }

  // --- TV, AUDIO & VIDEO SPECIFIC LOGIC ---

  if (slug === "televisions") {
    return {
      titlePlaceholder: "e.g. Samsung 55' 4K Smart TV",
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. Samsung, LG, Sony" },
        { label: "Model", type: "text", key: "model", placeholder: "Model Name" },
        { label: "Screen Size (inch)", type: "number", key: "screen_size_inch", placeholder: "Inches" },
        { label: "Resolution", type: "select", key: "resolution", options: ["HD Ready", "Full HD", "4K Ultra HD", "8K"] },
        { label: "Screen Type", type: "select", key: "screen_type", options: ["LED","Mini-Led", "OLED", "QLED", "LCD", "Plasma", "CRT"] },
        { label: "Smart TV", type: "select", key: "smart_tv", options: ["Yes", "No", "Android TV", "WebOS", "Tizen"] },
      ]
    };
  }

  if (slug === "soundbars" || slug === "hifi-systems" || slug === "home-theater" || slug === "speakers-equipment" || slug === "wireless-speakers") {
    return {
      titlePlaceholder: "e.g. JBL Bar 5.1 Soundbar",
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "e.g. JBL, Sony, Bose" },
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
        { label: "Power (Watts)", type: "number", key: "power_watts", placeholder: "Total Power (RMS)" },
        { label: "Connectivity", type: "select", key: "connectivity", options: ["Bluetooth", "Wired", "WiFi", "Optical", "HDMI ARC"] },
        { label: "Channels", type: "select", key: "channels", options: ["2.0", "2.1", "5.1", "7.1", "Other"] },
      ]
    };
  }

  if (slug === "headphones-equipment") {
    return {
      titlePlaceholder: "e.g. Sony WH-1000XM4",
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
        { label: "Type", type: "select", key: "type", options: ["In-Ear", "On-Ear", "Over-Ear", "True Wireless"] },
        { label: "Connection", type: "select", key: "connection", options: ["Wired", "Bluetooth/Wireless"] },
        { label: "Noise Cancellation", type: "select", key: "anc", options: ["Yes", "No"] },
      ]
    };
  }

  if (slug === "projectors") {
    return {
      titlePlaceholder: "e.g. Epson EH-TW7000",
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
        { label: "Resolution", type: "select", key: "resolution", options: ["SVGA", "XGA", "Full HD", "4K"] },
        { label: "Brightness (Lumens)", type: "number", key: "lumens", placeholder: "Lumens" },
        { label: "Lamp Life (Hours)", type: "number", key: "lamp_life", placeholder: "Hours" },
      ]
    };
  }

  if (slug === "tv-av-cables" || slug === "tv-adapters" || slug === "converters") {
    return {
      titlePlaceholder: "e.g. HDMI Cable 2.1",
      fields: [
        ...baseFields,
        { label: "Type", type: "text", key: "cable_type", placeholder: "e.g. HDMI, RCA, Optical" },
        { label: "Length (m)", type: "number", key: "length", placeholder: "Meters" },
      ]
    };
  }

  if (slug === "tv-mounts") {
    return {
      titlePlaceholder: "e.g. Wall Mount for 55 inch TV",
      fields: [
        ...baseFields,
        { label: "Type", type: "select", key: "mount_type", options: ["Fixed", "Tilt", "Full Motion", "Ceiling", "Desktop Stand"] },
        { label: "Supported Size (Max Inch)", type: "number", key: "max_inch", placeholder: "Max Inches" },
      ]
    };
  }

  if (slug === "dvd-players" || slug === "cd-players" || slug === "mp3-players" || slug === "radios" || slug === "dictaphones") {
     return {
      titlePlaceholder: `e.g. Sony DVD Player`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
      ]
    };
  }
  
  // --- TOOLS & DIY SPECIFIC LOGIC ---
  
  // 1. DRILLS & DRIVERS
  if (slug.includes("drills") || slug.includes("impact-drivers") || slug.includes("rotary-hammers") || slug.includes("screw")) {
    const isCordless = slug.includes("cordless");
    return {
      titlePlaceholder: `e.g. Bosch Professional GSB 18V-50`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Power Source", type: "select", key: "power_source", options: ["Cordless (Battery)", "Electric (Corded)"], defaultValue: isCordless ? "Cordless (Battery)" : "Electric (Corded)" },
        { label: "Voltage (V)", type: "number", key: "voltage", placeholder: "V (if cordless)" },
        { label: "Power (W)", type: "number", key: "power_watts", placeholder: "W (if corded)" },
        { label: "Max Torque (Nm)", type: "number", key: "torque", placeholder: "Nm" },
        { label: "Chuck Type", type: "select", key: "chuck_type", options: ["Keyless", "Keyed", "SDS Plus", "SDS Max", "Hex"] },
      ]
    };
  }

  // 2. GRINDERS
  if (slug.includes("grinders")) {
    const isCordless = slug.includes("cordless");
    return {
      titlePlaceholder: `e.g. Makita GA4530`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Power Source", type: "select", key: "power_source", options: ["Cordless (Battery)", "Electric (Corded)"], defaultValue: isCordless ? "Cordless (Battery)" : "Electric (Corded)" },
        { label: "Disc Diameter (mm)", type: "select", key: "disc_diameter", options: ["115mm", "125mm", "150mm", "180mm", "230mm"] },
        { label: "Power (W)", type: "number", key: "power_watts", placeholder: "W" },
        { label: "Switch Type", type: "text", key: "switch_type", placeholder: "Paddle / Slide" },
      ]
    };
  }

  // 3. SAWS
  if (slug.includes("saws")) {
    return {
      titlePlaceholder: `e.g. DeWalt DCS570`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Type", type: "select", key: "saw_type", options: ["Circular Saw", "Jigsaw", "Reciprocating Saw", "Mitre Saw", "Table Saw"] },
        { label: "Blade Diameter (mm)", type: "number", key: "blade_diameter", placeholder: "mm" },
        { label: "Cutting Depth (mm)", type: "number", key: "cutting_depth", placeholder: "mm" },
        { label: "Power (W)", type: "number", key: "power_watts", placeholder: "W" },
      ]
    };
  }

  // 4. BATTERIES & CHARGERS
  if (slug.includes("batteries")) {
     return {
      titlePlaceholder: `e.g. Makita 18V 5Ah`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Voltage (V)", type: "number", key: "voltage", placeholder: "V" },
        { label: "Capacity (Ah)", type: "number", key: "capacity", placeholder: "Ah" },
        { label: "Type", type: "text", key: "type", placeholder: "Li-Ion / NiCd" },
      ]
    };
  }

  // 5. GARDEN - MOWERS
  if (slug.includes("mowers")) {
     return {
      titlePlaceholder: `e.g. Husqvarna LC 140P`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Power Source", type: "select", key: "power_source", options: ["Petrol", "Electric", "Battery", "Manual"] },
        { label: "Cutting Width (cm)", type: "number", key: "cutting_width", placeholder: "cm" },
        { label: "Collector Volume (L)", type: "number", key: "collector_volume", placeholder: "Liters" },
        { label: "Self-propelled", type: "select", key: "self_propelled", options: ["Yes", "No"] },
      ]
    };
  }

  // 6. GARDEN - TRIMMERS & CHAINSAWS
  if (slug.includes("trimmers") || slug.includes("chainsaws")) {
     return {
      titlePlaceholder: `e.g. Stihl FS 55`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Power Source", type: "select", key: "power_source", options: ["Petrol", "Electric", "Battery"] },
        { label: "Power (HP/Kw)", type: "text", key: "power", placeholder: "HP / kW" },
        { label: "Bar/Shaft Length", type: "text", key: "length", placeholder: "cm" },
      ]
    };
  }

  // 7. MACHINES - GENERATORS
  if (slug.includes("generators")) {
      return {
      titlePlaceholder: `e.g. Honda EU22i`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Output Power (kVA)", type: "number", key: "power_kva", placeholder: "kVA" },
        { label: "Fuel Type", type: "select", key: "fuel", options: ["Petrol", "Diesel"] },
        { label: "Phase", type: "select", key: "phase", options: ["Single-phase", "Three-phase"] },
      ]
    };
  }

  // 8. MACHINES - COMPRESSORS
  if (slug.includes("compressors")) {
      return {
      titlePlaceholder: `e.g. Abac 50L`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Tank Capacity (L)", type: "number", key: "tank_capacity", placeholder: "Liters" },
        { label: "Max Pressure (bar)", type: "number", key: "pressure", placeholder: "bar" },
        { label: "Airflow (l/min)", type: "number", key: "airflow", placeholder: "l/min" },
      ]
    };
  }

   // 9. MACHINES - WELDERS
  if (slug.includes("welders")) {
      return {
      titlePlaceholder: `e.g. Telwin Force 165`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Welding Type", type: "select", key: "welding_type", options: ["MMA (Stick)", "MIG/MAG", "TIG", "Plasma"] },
        { label: "Max Current (A)", type: "number", key: "current", placeholder: "Amperes" },
      ]
    };
  }

   // 10. PROTECTIVE EQUIPMENT
   if (slug.includes("protective-")) {
    return {
      titlePlaceholder: `e.g. ${name}`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Size", type: "select", key: "size", options: ["S", "M", "L", "XL", "XXL", "Universal", "39", "40", "41", "42", "43", "44", "45", "46"] },
        { label: "Material", type: "text", key: "material", placeholder: "Material" },
        { label: "Protection Level", type: "text", key: "protection_level", placeholder: "e.g. FFP2, S3" },
      ]
    };
  }

  // 11. GENERAL / OTHER TOOLS
  if (slug.includes("electric") || slug.includes("mach-") || slug.includes("garden-") || slug.includes("planers") || slug.includes("routers") || slug.includes("multitools") || slug.includes("heat-guns") || slug.includes("staplers")) {
    return {
      titlePlaceholder: `e.g. ${name}`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Power (W)", type: "number", key: "power_watts", placeholder: "Watts" },
        { label: "Type", type: "text", key: "type", placeholder: "Type" },
      ]
    };
  }

  if (slug.includes("hand-") || slug.includes("meas-") || slug.includes("tiling-") || slug.includes("metal-") || slug.includes("const-") || slug.includes("acc-") || slug.includes("paints-") || slug.includes("chem-") || slug.includes("elec-") || slug.includes("plumbing-") || slug.includes("tape-") || slug.includes("agri-")) {
    // Keep generic for these or add more specifics if needed, but this covers the rest
     return {
      titlePlaceholder: `e.g. ${name}`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Material", type: "text", key: "material", placeholder: "Material" },
        { label: "Dimensions/Size", type: "text", key: "dimensions", placeholder: "Dimensions" },
      ]
    };
  }
  
  // MOBILE PHONES LOGIC
  if (slug === "mobile-phones") {
    return {
      titlePlaceholder: "e.g. iPhone 15 Pro Max 256GB",
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" }, 
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
        { label: "Internal Memory", type: "select", key: "memory", options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB+"] },
        { label: "Color", type: "color-picker", key: "color" },
        { label: "Operating System", type: "select", key: "os", options: ["iOS", "Android", "HarmonyOS", "Other"] },
        { label: "Warranty", type: "select", key: "warranty", options: ["Yes", "No"] },
      ]
    };
  }

  if (slug === "smartwatches") {
     return {
      titlePlaceholder: "e.g. Apple Watch Series 9",
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand", placeholder: "Brand" },
        { label: "Model", type: "text", key: "model", placeholder: "Model" },
        { label: "Case Size (mm)", type: "number", key: "size_mm", placeholder: "mm" },
        { label: "Color", type: "color-picker", key: "color" },
        { label: "Cellular", type: "select", key: "cellular", options: ["Yes", "No"] },
      ]
     };
  }


  if (slug === "mobile-memory-cards") {
    return {
      titlePlaceholder: "e.g. Samsung MicroSD EVO Select 128GB",
      fields: [
        ...baseFields,
        { label: "Type", type: "select", key: "card_type", options: ["MicroSD", "SD", "Nano Memory", "CF", "Other"] },
        { label: "Capacity", type: "select", key: "capacity", options: ["8GB", "16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] },
        { label: "Class", type: "text", key: "class", placeholder: "e.g. Class 10, UHS-I" },
      ]
    };
  }

  if (slug === "mobile-batteries") {
    return {
      titlePlaceholder: "e.g. Samsung Galaxy S22 Battery",
      fields: [
         ...baseFields,
         { label: "Compatible Brand", type: "text", key: "compatible_brand", placeholder: "e.g. Samsung" },
         { label: "Compatible Model", type: "text", key: "compatible_model", placeholder: "e.g. S22" },
         { label: "Capacity", type: "number", key: "capacity_mah", placeholder: "mAh" },
      ]
    };
  }

  if (slug.startsWith("mobile-")) {
    // Generic template for mobile accessories if not specific
    return {
      titlePlaceholder: "e.g. Samsung Galaxy S24 Case",
      fields: [
        ...baseFields,
         { label: "Compatible Brand", type: "text", key: "compatible_brand", placeholder: "e.g. Samsung" },
         { label: "Compatible Model", type: "text", key: "compatible_model", placeholder: "e.g. S24 Ultra" },
         { label: "Type", type: "text", key: "type", placeholder: "Type" },
      ]
    };
  }

  if (slug.includes("tv") || slug.includes("audio") || slug.includes("video") || slug.includes("projector")) {
     return {
      titlePlaceholder: `e.g. ${name}`,
      fields: [
        ...baseFields,
        { label: "Brand", type: "text", key: "brand" },
        { label: "Description", type: "textarea", key: "desc_tech", placeholder: "Technical details" },
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
