import { internalMutation } from './_generated/server';

const categoriesData = [
  {
    "name": "Motor Vehicles",
    "slug": "motor-vehicles",
    "description": "All motorized vehicles, parts, and related services.",
    "image": "",
    "isActive": true,
    "isFeatured": true,
    "parentSlug": null,
    "template": {
      "fields": [],
      "titlePlaceholder": "e.g. Motor Vehicles"
    }
  },
  {
    "name": "Cars",
    "slug": "cars",
    "description": "Passenger cars and light motor vehicles.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motor-vehicles",
    "template": {
      "fields": [
        {
          "key": "vin",
          "label": "VIN",
          "placeholder": "17-character VIN",
          "type": "text"
        },
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used", "Damaged / For Parts"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Toyota", "Nissan", "Ford", "Peugeot", "Renault", "Fiat", "Opel", "Hyundai", "Kia", "Skoda", "Seat", "Mazda", "Honda", "Volvo", "Porsche", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. Golf, 320d, A4",
          "type": "text"
        },
        {
          "key": "year",
          "label": "Year of Manufacture",
          "placeholder": "YYYY",
          "type": "number"
        },
        {
          "key": "mileage_km",
          "label": "Mileage (km)",
          "placeholder": "km",
          "type": "number"
        },
        {
          "key": "fuel_type",
          "label": "Fuel Type",
          "options": ["Diesel", "Petrol", "Petrol + LPG", "Hybrid", "Plug-in Hybrid", "Electric"],
          "type": "select"
        },
        {
          "key": "transmission",
          "label": "Transmission",
          "options": ["Manual", "Automatic", "Semi-Automatic / DSG"],
          "type": "select"
        },
        {
          "key": "body_type",
          "label": "Body Type",
          "options": ["Sedan", "Hatchback", "SUV / Off-Road", "Station Wagon", "Coupe", "Convertible", "Minivan / MPV", "Pickup"],
          "type": "select"
        },
        {
          "key": "engine_capacity_ccm",
          "label": "Engine Capacity (ccm)",
          "placeholder": "e.g. 1968",
          "type": "number"
        },
        {
          "key": "engine_power_kw",
          "label": "Engine Power (kW)",
          "placeholder": "kW",
          "type": "number"
        },
        {
          "key": "registration",
          "label": "Registration Status",
          "options": ["Macedonian Plates", "Foreign Plates", "Customs Cleared", "Unregistered"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. VW Golf 2.0 TDI 2018"
    }
  },
  {
    "name": "Motorcycles & Scooters",
    "slug": "motorcycles-scooters",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motor-vehicles",
    "template": {
      "fields": [],
      "titlePlaceholder": "e.g. Motorcycles"
    }
  },
  {
    "name": "Motorcycles (Above 50cc)",
    "slug": "motorcycles-above-50cc",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motorcycles-scooters",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used", "Damaged / For Parts"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Yamaha", "Honda", "Suzuki", "Kawasaki", "BMW", "Ducati", "KTM", "Aprilia", "Harley-Davidson", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. YZF-R6",
          "type": "text"
        },
        {
          "key": "year",
          "label": "Year",
          "placeholder": "YYYY",
          "type": "number"
        },
        {
          "key": "mileage_km",
          "label": "Mileage (km)",
          "placeholder": "km",
          "type": "number"
        },
        {
          "key": "engine_capacity_ccm",
          "label": "Engine Capacity (ccm)",
          "placeholder": "ccm",
          "type": "number"
        },
        {
          "key": "motorcycle_type",
          "label": "Type",
          "options": ["Sport", "Naked", "Cruiser / Chopper", "Touring", "Enduro / Motocross", "Custom", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Yamaha R6 2015"
    }
  },
  {
    "name": "Mopeds & Scooters (Under 50cc)",
    "slug": "mopeds-under-50cc",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motorcycles-scooters",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used", "Damaged"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Vespa", "Piaggio", "Aprilia", "Peugeot", "Yamaha", "Honda", "KYMCO", "SYM", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. Primavera 50",
          "type": "text"
        },
        {
          "key": "year",
          "label": "Year",
          "placeholder": "YYYY",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. Vespa Primavera 50"
    }
  },
  {
    "name": "Electric Scooters & Bikes",
    "slug": "electric-scooters-bikes",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motorcycles-scooters",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Like New", "Used", "Damaged"],
          "type": "select"
        },
        {
          "key": "type",
          "label": "Vehicle Type",
          "options": ["Electric Kick Scooter", "Electric Bicycle (e-Bike)", "Electric Moped"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Xiaomi", "Ninebot / Segway", "Dualtron", "Kugoo", "MS Energy", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. Pro 2",
          "type": "text"
        }
      ],
      "titlePlaceholder": "e.g. Xiaomi Pro 2"
    }
  },
  {
    "name": "Quads & ATVs",
    "slug": "quads-atvs",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motorcycles-scooters",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Yamaha", "Polaris", "Can-Am", "Honda", "Suzuki", "CFMoto", "Odes", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. CForce 450",
          "type": "text"
        },
        {
          "key": "engine_capacity_ccm",
          "label": "Engine Capacity (ccm)",
          "placeholder": "ccm",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. CFMoto CForce 450"
    }
  },
  {
    "name": "Parts, Tires & Accessories",
    "slug": "parts-tires-accessories-root",
    "description": "Unified category for all vehicle parts, tires, and accessories.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motor-vehicles",
    "template": {
      "fields": [],
      "titlePlaceholder": "e.g. Parts & Accessories"
    }
  },
  {
    "name": "Tires & Rims",
    "slug": "tires-rims",
    "description": "Tires, rims, and complete wheels for all types of vehicles.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "parts-tires-accessories-root",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "vehicle_type",
          "label": "Intended For",
          "options": ["Cars & SUVs", "Motorcycles & Scooters", "Vans & Minibuses", "Trucks & Buses", "Agricultural & Heavy Machinery", "ATVs / Quads", "Other"],
          "type": "select"
        },
        {
          "key": "item_type",
          "label": "Item Type",
          "options": ["Tires Only", "Rims/Alloys Only", "Complete Set (Tires + Rims)"],
          "type": "select"
        },
        {
          "key": "tire_season",
          "label": "Tire Season",
          "options": ["Summer", "Winter", "All-Season", "Off-Road / M/T", "Not Applicable"],
          "type": "select"
        },
        {
          "key": "tire_width",
          "label": "Tire Width",
          "placeholder": "e.g. 205",
          "type": "number"
        },
        {
          "key": "tire_profile",
          "label": "Tire Profile",
          "placeholder": "e.g. 55",
          "type": "number"
        },
        {
          "key": "rim_diameter",
          "label": "Diameter (Inches)",
          "placeholder": "e.g. 16",
          "type": "number"
        },
        {
          "key": "rim_material",
          "label": "Rim Material",
          "options": ["Alloy (Aluminium)", "Steel", "Not Applicable"],
          "type": "select"
        },
        {
          "key": "rim_bolt_pattern",
          "label": "Bolt Pattern (Raspon)",
          "placeholder": "e.g. 5x112",
          "type": "text"
        }
      ],
      "titlePlaceholder": "e.g. 4x Michelin 205/55 R16 Winter"
    }
  },
  {
    "name": "Car Spare Parts",
    "slug": "car-spare-parts",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "parts-tires-accessories-root",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "part_category",
          "label": "Category",
          "options": ["Engine & Components", "Body / Exterior", "Interior", "Electrical & Lighting", "Suspension & Steering", "Brakes", "Exhaust", "Transmission / Drivetrain", "Cooling / Heating", "Other"],
          "type": "select"
        },
        {
          "key": "compatible_make",
          "label": "Compatible Make",
          "placeholder": "e.g. VW, Audi",
          "type": "text"
        },
        {
          "key": "compatible_model",
          "label": "Compatible Model",
          "placeholder": "e.g. Golf 5",
          "type": "text"
        }
      ],
      "titlePlaceholder": "e.g. VW Golf 5 Front Bumper OEM"
    }
  },
  {
    "name": "Motorcycle Spare Parts",
    "slug": "moto-spare-parts",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "parts-tires-accessories-root",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "part_category",
          "label": "Category",
          "options": ["Engine", "Fairings / Plastics", "Electrical", "Brakes", "Exhaust", "Suspension", "Chains & Sprockets", "Other"],
          "type": "select"
        },
        {
          "key": "compatible_make",
          "label": "Compatible Make",
          "placeholder": "e.g. Yamaha",
          "type": "text"
        }
      ],
      "titlePlaceholder": "e.g. Yamaha R6 Akrapovic Exhaust"
    }
  },
  {
    "name": "Machinery & Transport Spare Parts",
    "slug": "machinery-transport-parts",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "parts-tires-accessories-root",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "vehicle_type",
          "label": "Part For",
          "options": ["Trucks", "Buses", "Tractors", "Construction Machinery", "Trailers", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Scania R450 Headlight"
    }
  },
  {
    "name": "Marine Parts & Accessories",
    "slug": "marine-parts-accessories",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "parts-tires-accessories-root",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "category",
          "label": "Category",
          "options": ["Outboard Motors", "Inboard Engines", "Propellers", "Navigation & Electronics", "Safety Gear", "Boat Trailers", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Yamaha 15HP Outboard Motor"
    }
  },
  {
    "name": "Car Audio & Navigation",
    "slug": "car-audio-navigation",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "parts-tires-accessories-root",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "type",
          "label": "Type",
          "options": ["Car Radio / Android Multimedia", "Speakers", "Amplifiers", "Subwoofers", "GPS Navigation", "Dash Cams"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Android 10 Multimedia for VW"
    }
  },
  {
    "name": "Car Care & Cosmetics",
    "slug": "car-care-cosmetics",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "parts-tires-accessories-root",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New (Sealed)"],
          "type": "select"
        },
        {
          "key": "type",
          "label": "Type",
          "options": ["Polish & Wax", "Interior Cleaners", "Shampoos", "Motor Oils & Fluids", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Castrol 5W-30 Motor Oil"
    }
  },
  {
    "name": "Motorcycle Clothing & Helmets",
    "slug": "moto-clothing-helmets",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "parts-tires-accessories-root",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "type",
          "label": "Type",
          "options": ["Helmets", "Jackets", "Pants", "Full Suits", "Gloves", "Boots", "Protectors"],
          "type": "select"
        },
        {
          "key": "size",
          "label": "Size",
          "placeholder": "e.g. M, L, XL, 44",
          "type": "text"
        }
      ],
      "titlePlaceholder": "e.g. Shoei NXR 2 Helmet Size L"
    }
  },
  {
    "name": "Automotive Tools & Diagnostics",
    "slug": "automotive-tools-diag",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "parts-tires-accessories-root",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "type",
          "label": "Type",
          "options": ["OBD2 Diagnostic Tools", "Hand Tool Sets", "Jacks & Lifts", "Air Compressors", "Specialized Tools", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. VCDS Diagnostic Cable / Gedore Set"
    }
  },
  {
    "name": "Boats & Watercraft",
    "slug": "boats-watercraft",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motor-vehicles",
    "template": {
      "fields": [],
      "titlePlaceholder": "e.g. Boats"
    }
  },
  {
    "name": "Motor Boats & Yachts",
    "slug": "motor-boats-yachts",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "boats-watercraft",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "placeholder": "e.g. Bayliner",
          "type": "text"
        },
        {
          "key": "engine_type",
          "label": "Engine Type",
          "options": ["Outboard (Vanbrodski)", "Inboard (Vgraden)", "Inboard/Outboard", "No Engine"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Bayliner 175 with Mercury 135HP"
    }
  },
  {
    "name": "Sailing Boats",
    "slug": "sailing-boats",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "boats-watercraft",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "placeholder": "e.g. Bavaria",
          "type": "text"
        },
        {
          "key": "length_meters",
          "label": "Length (m)",
          "placeholder": "m",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. Bavaria 38 Cruiser"
    }
  },
  {
    "name": "Jet Skis",
    "slug": "jet-skis",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "boats-watercraft",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Sea-Doo", "Yamaha", "Kawasaki", "Other"],
          "type": "select"
        },
        {
          "key": "engine_power_hp",
          "label": "Engine Power (HP)",
          "placeholder": "HP",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. Sea-Doo Spark 90HP"
    }
  },
  {
    "name": "Rowing & Rubber Boats",
    "slug": "rowing-rubber-boats",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "boats-watercraft",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "type",
          "label": "Type",
          "options": ["Rubber / Inflatable Boat", "RIB", "Kayak", "Canoe", "Rowing Boat", "SUP Board", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Zodiac Inflatable Boat 3.2m"
    }
  },
  {
    "name": "Camping & Caravans",
    "slug": "camping-caravans",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motor-vehicles",
    "template": {
      "fields": [],
      "titlePlaceholder": "e.g. Campers"
    }
  },
  {
    "name": "Motorhomes / Campers",
    "slug": "motorhomes",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "camping-caravans",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used", "Damaged"],
          "type": "select"
        },
        {
          "key": "camper_brand",
          "label": "Camper Manufacturer",
          "placeholder": "e.g. Adria, Hymer",
          "type": "text"
        },
        {
          "key": "sleeping_capacity",
          "label": "Sleeping Capacity",
          "options": ["1", "2", "3", "4", "5", "6+"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Fiat Ducato Adria Camper"
    }
  },
  {
    "name": "Caravans / Towable Campers",
    "slug": "towable-caravans",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "camping-caravans",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "placeholder": "e.g. Hobby, Knaus",
          "type": "text"
        },
        {
          "key": "length_meters",
          "label": "Length (m)",
          "placeholder": "m",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. Hobby Premium 560"
    }
  },
  {
    "name": "Commercial & Transport Vehicles",
    "slug": "commercial-transport-vehicles",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motor-vehicles",
    "template": {
      "fields": [],
      "titlePlaceholder": "e.g. Transport"
    }
  },
  {
    "name": "Vans & Minibuses",
    "slug": "vans-minibuses",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "commercial-transport-vehicles",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used", "Damaged"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Mercedes-Benz", "VW", "Ford", "Renault", "Fiat", "Peugeot", "Citroen", "Iveco", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. Sprinter, Transit",
          "type": "text"
        },
        {
          "key": "vehicle_configuration",
          "label": "Configuration",
          "options": ["Panel Van (Cargo)", "Minibus (Passenger)", "Crew Cab (Mixto)", "Dropside / Flatbed", "Refrigerated"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Mercedes Sprinter 316 CDI"
    }
  },
  {
    "name": "Trucks (Up to 7.5t)",
    "slug": "trucks-light",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "commercial-transport-vehicles",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used", "Damaged"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Iveco", "Mercedes-Benz", "MAN", "Renault", "Fuso", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. Daily",
          "type": "text"
        },
        {
          "key": "truck_body_type",
          "label": "Body Type",
          "options": ["Box / Closed", "Curtainsider", "Tipper / Dumper", "Flatbed", "Refrigerated", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Iveco Daily 35C15 Tipper"
    }
  },
  {
    "name": "Heavy Trucks (Over 7.5t)",
    "slug": "trucks-heavy",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "commercial-transport-vehicles",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used", "Damaged"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["MAN", "Mercedes-Benz", "Volvo", "Scania", "DAF", "Renault", "Iveco", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. R450, Actros",
          "type": "text"
        },
        {
          "key": "truck_type",
          "label": "Type",
          "options": ["Tractor Unit (Glava)", "Tipper", "Box", "Curtainsider", "Refrigerated", "Chassis Cab", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Scania R450 Tractor Unit"
    }
  },
  {
    "name": "Buses & Coaches",
    "slug": "buses-coaches",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "commercial-transport-vehicles",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Mercedes-Benz", "Setra", "MAN", "Neoplan", "Volvo", "Scania", "Other"],
          "type": "select"
        },
        {
          "key": "seats",
          "label": "Number of Seats",
          "placeholder": "e.g. 50+1+1",
          "type": "text"
        }
      ],
      "titlePlaceholder": "e.g. Setra S 415 HD Coach"
    }
  },
  {
    "name": "Trailers & Semi-Trailers",
    "slug": "trailers-semitrailers",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "commercial-transport-vehicles",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Schmitz Cargobull", "Krone", "Kögel", "Schwarzmüller", "Other"],
          "type": "select"
        },
        {
          "key": "type",
          "label": "Type",
          "options": ["Curtainsider Semi", "Refrigerated Semi", "Tipper Semi", "Low Loader", "Car Transporter", "Light Car Trailer", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Schmitz Cargobull Curtainsider"
    }
  },
  {
    "name": "Agricultural & Heavy Machinery",
    "slug": "agri-heavy-machinery",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motor-vehicles",
    "template": {
      "fields": [],
      "titlePlaceholder": "e.g. Tractors"
    }
  },
  {
    "name": "Tractors",
    "slug": "tractors-agri",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "agri-heavy-machinery",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["John Deere", "Massey Ferguson", "New Holland", "IMT", "Fendt", "Deutz-Fahr", "Case IH", "Zetor", "Belarus", "Kubota", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. 6120M, 539",
          "type": "text"
        },
        {
          "key": "engine_power_hp",
          "label": "Engine Power (HP)",
          "placeholder": "HP",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. John Deere 6120M"
    }
  },
  {
    "name": "Harvesters & Combines",
    "slug": "harvesters-combines",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "agri-heavy-machinery",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["CLAAS", "John Deere", "New Holland", "Zmaj", "Case IH", "Fendt", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. Lexion 600",
          "type": "text"
        }
      ],
      "titlePlaceholder": "e.g. CLAAS Lexion 600"
    }
  },
  {
    "name": "Construction Machinery",
    "slug": "construction-machinery",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "agri-heavy-machinery",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "machinery_type",
          "label": "Type",
          "options": ["Excavator", "Mini Excavator", "Backhoe Loader (Kombinirka)", "Wheel Loader", "Bulldozer", "Grader", "Roller", "Skid Steer (Bobcat)", "Other"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Caterpillar", "JCB", "Komatsu", "Volvo", "Liebherr", "Bobcat", "Hitachi", "Other"],
          "type": "select"
        },
        {
          "key": "model",
          "label": "Model",
          "placeholder": "e.g. 4CX",
          "type": "text"
        }
      ],
      "titlePlaceholder": "e.g. JCB 4CX Backhoe Loader"
    }
  },
  {
    "name": "Forklifts & Handling",
    "slug": "forklifts-handling-machinery",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "agri-heavy-machinery",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "options": ["Linde", "Toyota", "Jungheinrich", "Hyster", "Still", "Clark", "Other"],
          "type": "select"
        },
        {
          "key": "lifting_capacity_kg",
          "label": "Lifting Capacity (kg)",
          "placeholder": "kg",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. Linde H25D Diesel Forklift"
    }
  },
  {
    "name": "Forestry Machinery",
    "slug": "forestry-machinery",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "agri-heavy-machinery",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "machinery_type",
          "label": "Type",
          "options": ["Skidder", "Forwarder", "Harvester", "Wood Chipper", "Other"],
          "type": "select"
        },
        {
          "key": "make",
          "label": "Make",
          "placeholder": "e.g. Timberjack",
          "type": "text"
        }
      ],
      "titlePlaceholder": "e.g. Timberjack 460 Skidder"
    }
  },
  {
    "name": "Attachment Machines / Implements",
    "slug": "attachment-implements",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "agri-heavy-machinery",
    "template": {
      "fields": [
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Used"],
          "type": "select"
        },
        {
          "key": "implement_type",
          "label": "Type",
          "options": ["Plough", "Seeder", "Sprayer", "Baler", "Mower", "Loader Bucket", "Hydraulic Hammer", "Other"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Lemken 3-Furrow Reversible Plough"
    }
  },
  {
    "name": "Vehicle Services",
    "slug": "vehicle-services",
    "description": "",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "motor-vehicles",
    "template": {
      "fields": [
        {
          "key": "service_type",
          "label": "Service Type",
          "options": [
            "Towing & Recovery (Slep Sluzba)", 
            "Mechanic / Garage", 
            "Auto Body & Paint (Limar/Farbar)", 
            "Auto Glass", 
            "Detailing & Wash", 
            "Diagnostic & Electrical", 
            "Tire Services (Vulkanizer)",
            "Vehicle Buying (Scrap / Used)", 
            "Other"
          ],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. 24/7 Towing Service"
    }
  },
  {
    "name": "Real Estate",
    "slug": "real-estate",
    "description": "Apartments, houses, commercial spaces, and land for sale or rent.",
    "image": "",
    "isActive": true,
    "isFeatured": true,
    "parentSlug": null,
    "template": {
      "fields": [],
      "titlePlaceholder": "e.g. Real Estate"
    }
  },
  {
    "name": "Apartments",
    "slug": "apartments",
    "description": "Flats, studios, and penthouses.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "real-estate",
    "template": {
      "fields": [
        {
          "key": "transaction_type",
          "label": "Ad Type",
          "options": ["For Sale", "For Rent", "Wanted to Buy", "Wanted to Rent"],
          "type": "select"
        },
        {
          "key": "isTradePossible",
          "label": "Open to Exchange/Trade",
          "options": ["Yes", "No"],
          "type": "select"
        },
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New Construction (Under Construction)", "New (Finished)", "Renovated", "Good / Maintained", "Needs Renovation"],
          "type": "select"
        },
        {
          "key": "m2",
          "label": "Area (m2)",
          "placeholder": "e.g. 65",
          "type": "number"
        },
        {
          "key": "rooms",
          "label": "Number of Rooms",
          "options": ["Garsonjera (Studio)", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"],
          "type": "select"
        },
        {
          "key": "floor",
          "label": "Floor",
          "placeholder": "e.g. 3",
          "type": "number"
        },
        {
          "key": "total_floors",
          "label": "Total Floors in Building",
          "placeholder": "e.g. 5",
          "type": "number"
        },
        {
          "key": "elevator",
          "label": "Elevator",
          "options": ["Yes", "No"],
          "type": "select"
        },
        {
          "key": "balcony",
          "label": "Balcony / Terrace",
          "options": ["Yes", "No", "French Balcony"],
          "type": "select"
        },
        {
          "key": "heating",
          "label": "Heating System",
          "options": ["Central City Heating", "Electricity / Inverter AC", "Private Central (Wood/Pellet)", "Heat Pump", "None"],
          "type": "select"
        },
        {
          "key": "furnished",
          "label": "Furnished Status",
          "options": ["Fully Furnished", "Empty (Unfurnished)", "Kitchen Only"],
          "type": "select"
        },
        {
          "key": "parking",
          "label": "Parking",
          "options": ["Free Public Parking", "Zoned Parking", "Underground Garage", "Private Parking Spot", "None"],
          "type": "select"
        },
        {
          "key": "title_deed",
          "label": "Title Deed (Имотен лист)",
          "options": ["Yes (Clear)", "In Process", "No"],
          "type": "select"
        },
        {
          "key": "year_built",
          "label": "Year Built",
          "placeholder": "YYYY",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. 2-Bedroom Apartment in Centar"
    }
  },
  {
    "name": "Houses & Villas",
    "slug": "houses",
    "description": "Family houses, townhouses, and luxury villas.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "real-estate",
    "template": {
      "fields": [
        {
          "key": "transaction_type",
          "label": "Ad Type",
          "options": ["For Sale", "For Rent", "Wanted to Buy", "Wanted to Rent"],
          "type": "select"
        },
        {
          "key": "isTradePossible",
          "label": "Open to Exchange/Trade",
          "options": ["Yes", "No"],
          "type": "select"
        },
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New Construction", "Renovated", "Good / Maintained", "Needs Renovation"],
          "type": "select"
        },
        {
          "key": "m2",
          "label": "House Area (m2)",
          "placeholder": "m2",
          "type": "number"
        },
        {
          "key": "yard_m2",
          "label": "Yard Area (m2)",
          "placeholder": "m2",
          "type": "number"
        },
        {
          "key": "rooms",
          "label": "Total Rooms",
          "placeholder": "e.g. 5",
          "type": "number"
        },
        {
          "key": "floors",
          "label": "Number of Floors",
          "options": ["1 (Single Story)", "2", "3", "4+"],
          "type": "select"
        },
        {
          "key": "heating",
          "label": "Heating",
          "options": ["Central City Heating", "Electricity / Inverter AC", "Heat Pump", "Wood / Pellets", "Solar"],
          "type": "select"
        },
        {
          "key": "furnished",
          "label": "Furnished Status",
          "options": ["Fully Furnished", "Empty", "Partially Furnished"],
          "type": "select"
        },
        {
          "key": "title_deed",
          "label": "Title Deed (Имотен лист)",
          "options": ["Yes (Clear)", "In Process", "No"],
          "type": "select"
        },
        {
          "key": "year_built",
          "label": "Year Built",
          "placeholder": "YYYY",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. Modern Family House with Garden"
    }
  },
  {
    "name": "Commercial & Business Space",
    "slug": "commercial-space",
    "description": "Offices, shops, warehouses, and industrial plants.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "real-estate",
    "template": {
      "fields": [
        {
          "key": "transaction_type",
          "label": "Ad Type",
          "options": ["For Sale", "For Rent", "Wanted"],
          "type": "select"
        },
        {
          "key": "commercial_type",
          "label": "Type of Space",
          "options": [
            "Office Space", 
            "Retail Shop / Store", 
            "Warehouse / Storage", 
            "Industrial Plant / Factory", 
            "Restaurant / Café / Bar", 
            "Hotel / Motel / Hostel", 
            "Other"
          ],
          "type": "select"
        },
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New Construction", "Renovated", "Good", "Needs Renovation"],
          "type": "select"
        },
        {
          "key": "m2",
          "label": "Total Area (m2)",
          "placeholder": "m2",
          "type": "number"
        },
        {
          "key": "floor",
          "label": "Floor",
          "placeholder": "0 = Ground floor",
          "type": "number"
        },
        {
          "key": "heating",
          "label": "Heating / Cooling",
          "options": ["Central HVAC", "Electricity/AC", "None"],
          "type": "select"
        },
        {
          "key": "parking",
          "label": "Parking",
          "options": ["Private Parking", "Public Parking Nearby", "No Parking", "Loading Dock Available"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. 80m2 Office Space in Business Center"
    }
  },
  {
    "name": "Land & Plots",
    "slug": "land",
    "description": "Construction, agricultural, and industrial land.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "real-estate",
    "template": {
      "fields": [
        {
          "key": "transaction_type",
          "label": "Ad Type",
          "options": ["For Sale", "For Rent", "Wanted"],
          "type": "select"
        },
        {
          "key": "land_type",
          "label": "Type of Land",
          "options": [
            "Construction Land (Градежно)", 
            "Agricultural Land (Земјоделско)", 
            "Industrial Land", 
            "Forest", 
            "Other"
          ],
          "type": "select"
        },
        {
          "key": "isTradePossible",
          "label": "Open to Exchange (npr. so kompenzacija)",
          "options": ["Yes", "No"],
          "type": "select"
        },
        {
          "key": "m2",
          "label": "Area (m2)",
          "placeholder": "m2",
          "type": "number"
        },
        {
          "key": "electricity",
          "label": "Electricity Access",
          "options": ["Yes (Connected)", "Nearby", "No"],
          "type": "select"
        },
        {
          "key": "water",
          "label": "Water / Sewage Access",
          "options": ["Yes (Connected)", "Nearby", "No"],
          "type": "select"
        },
        {
          "key": "road",
          "label": "Road Access",
          "options": ["Asphalt", "Dirt Road", "None"],
          "type": "select"
        },
        {
          "key": "title_deed",
          "label": "Title Deed / Urban Plan (DUP)",
          "options": ["Clear Title & DUP", "Clear Title (No DUP)", "In Process"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. 500m2 Construction Plot with DUP"
    }
  },
  {
    "name": "Holiday Homes / Cabins",
    "slug": "holiday-homes",
    "description": "Weekend houses, lake houses, and mountain cabins.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "real-estate",
    "template": {
      "fields": [
        {
          "key": "transaction_type",
          "label": "Ad Type",
          "options": ["For Sale", "For Rent (Short Term)", "For Rent (Long Term)", "Wanted"],
          "type": "select"
        },
        {
          "key": "condition",
          "label": "Condition",
          "options": ["New", "Renovated", "Good", "Needs Renovation"],
          "type": "select"
        },
        {
          "key": "m2",
          "label": "Cabin Area (m2)",
          "placeholder": "m2",
          "type": "number"
        },
        {
          "key": "yard_m2",
          "label": "Yard Area (m2)",
          "placeholder": "m2",
          "type": "number"
        },
        {
          "key": "rooms",
          "label": "Total Rooms",
          "placeholder": "Rooms",
          "type": "number"
        },
        {
          "key": "heating",
          "label": "Heating",
          "options": ["Wood / Fireplace", "Electricity", "Pellets", "None"],
          "type": "select"
        },
        {
          "key": "utilities",
          "label": "Utilities (Water/Electricity)",
          "options": ["Both Connected", "Only Electricity", "Only Water / Well", "Off-grid / Solar"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Weekend House near Lake"
    }
  },
  {
    "name": "Garages & Parking",
    "slug": "garages",
    "description": "Garages, parking spots, and storage units.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "real-estate",
    "template": {
      "fields": [
        {
          "key": "transaction_type",
          "label": "Ad Type",
          "options": ["For Sale", "For Rent", "Wanted"],
          "type": "select"
        },
        {
          "key": "garage_type",
          "label": "Type",
          "options": ["Underground Garage", "Street Garage", "Parking Spot", "Storage Room (Podrum)"],
          "type": "select"
        },
        {
          "key": "m2",
          "label": "Area (m2)",
          "placeholder": "m2",
          "type": "number"
        },
        {
          "key": "security",
          "label": "Security Features",
          "options": ["Standard Lock", "Remote Roll-door", "Camera / Guard", "Open Air"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. 18m2 Garage in Centar"
    }
  },
  {
    "name": "Rooms & Roommates",
    "slug": "rooms-accommodation",
    "description": "Single rooms and shared apartment listings.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "real-estate",
    "template": {
      "fields": [
        {
          "key": "transaction_type",
          "label": "Ad Type",
          "options": ["Offering Room", "Looking for Room (Roommate)"],
          "type": "select"
        },
        {
          "key": "m2",
          "label": "Room Area (m2)",
          "placeholder": "m2",
          "type": "number"
        },
        {
          "key": "bills_included",
          "label": "Are utilities/bills included?",
          "options": ["Yes", "No", "Partially"],
          "type": "select"
        },
        {
          "key": "bathroom",
          "label": "Bathroom",
          "options": ["Private (En-suite)", "Shared"],
          "type": "select"
        },
        {
          "key": "gender_preference",
          "label": "Roommate Preference",
          "options": ["Any", "Male Only", "Female Only", "Students Only"],
          "type": "select"
        }
      ],
      "titlePlaceholder": "e.g. Furnished Room for Student"
    }
  },
  {
    "name": "Real Estate Abroad",
    "slug": "real-estate-abroad",
    "description": "Properties located outside the country.",
    "image": "",
    "isActive": true,
    "isFeatured": false,
    "parentSlug": "real-estate",
    "template": {
      "fields": [
        {
          "key": "transaction_type",
          "label": "Ad Type",
          "options": ["For Sale", "For Rent (Vacation)", "For Rent (Long Term)"],
          "type": "select"
        },
        {
          "key": "country",
          "label": "Country",
          "options": ["Greece", "Turkey", "Bulgaria", "Albania", "Serbia", "Montenegro", "Croatia", "Germany", "UAE / Dubai", "Other"],
          "type": "select"
        },
        {
          "key": "property_type",
          "label": "Property Type",
          "options": ["Apartment / Studio", "House / Villa", "Land", "Commercial Space"],
          "type": "select"
        },
        {
          "key": "m2",
          "label": "Area (m2)",
          "placeholder": "m2",
          "type": "number"
        },
        {
          "key": "distance_to_sea",
          "label": "Distance to Sea/Beach (Meters)",
          "placeholder": "e.g. 50, 500 (Leave blank if not applicable)",
          "type": "number"
        }
      ],
      "titlePlaceholder": "e.g. Seaside Studio in Halkidiki"
    }
  },

  {
    name: 'Home Appliances',
    slug: 'home-appliances',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Home Appliance',
    },
  },
 
  // ─────────────────────────────────────────────
  // AIR CONDITIONERS
  // ─────────────────────────────────────────────
  {
    name: 'Air Conditioners',
    slug: 'air-conditioners',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Gree, Vivax, Daikin', type: 'text' },
        { key: 'ac_type', label: 'Type', options: ['Inverter', 'Standard', 'Portable', 'Multi Split'], type: 'select' },
        { key: 'power_cooling', label: 'Power Cooling (kW)', placeholder: 'kW', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'], type: 'select' },
      ],
      titlePlaceholder: 'e.g. Air Conditioner',
    },
  },
  {
    name: 'Inverter AC',
    slug: 'inverter-ac',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'air-conditioners',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Gree, Vivax, Daikin', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'power_cooling', label: 'Power Cooling (kW)', placeholder: 'kW', type: 'number' },
        { key: 'power_heating', label: 'Power Heating (kW)', placeholder: 'kW', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2022', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White', type: 'text' },
      ],
      titlePlaceholder: 'e.g. Gree Inverter 3.5kW',
    },
  },
  {
    name: 'Standard AC',
    slug: 'standard-ac',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'air-conditioners',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Gree, Vivax, Daikin', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'power_cooling', label: 'Power Cooling (kW)', placeholder: 'kW', type: 'number' },
        { key: 'power_heating', label: 'Power Heating (kW)', placeholder: 'kW', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2022', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Gree Standard 2.5kW',
    },
  },
  {
    name: 'Mobile AC',
    slug: 'mobile-ac',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'air-conditioners',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Gree, Vivax, Daikin', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'power_cooling', label: 'Power Cooling (kW)', placeholder: 'kW', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Vivax Portable 2.6kW',
    },
  },
  {
    name: 'Multi Split AC',
    slug: 'multi-split-ac',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'air-conditioners',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Gree, Vivax, Daikin', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'num_indoor_units', label: 'Number of Indoor Units', placeholder: 'e.g. 2', type: 'number' },
        { key: 'power_cooling', label: 'Total Power Cooling (kW)', placeholder: 'kW', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Daikin Multi Split 2x3kW',
    },
  },
  {
    name: 'Fans',
    slug: 'fans',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'air-conditioners',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'fan_type', label: 'Type', options: ['Stand', 'Tower', 'Table', 'Ceiling', 'Window', 'Industrial'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Stand Fan 50W',
    },
  },
  {
    name: 'Accessories for AC',
    slug: 'ac-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'air-conditioners',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. AC Remote Control',
    },
  },
 
  // ─────────────────────────────────────────────
  // REFRIGERATORS
  // ─────────────────────────────────────────────
  {
    name: 'Refrigerators',
    slug: 'refrigerators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Samsung, Beko, Gorenje', type: 'text' },
        { key: 'fridge_type', label: 'Type', options: ['Combined', 'Double Door', 'Single Door', 'Built-in', 'Mini'], type: 'select' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
      ],
      titlePlaceholder: 'e.g. Refrigerator',
    },
  },
  {
    name: 'Combined Refrigerators',
    slug: 'combined-refrigerators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'refrigerators',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Samsung, Beko, Gorenje, LG', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Total Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'freezer_capacity_liters', label: 'Freezer Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'height', label: 'Height (cm)', placeholder: 'cm', type: 'number' },
        { key: 'no_frost', label: 'No Frost', options: ['Yes', 'No'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Inox, White, Black', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Samsung Combined 350L',
    },
  },
  {
    name: 'Double Door Refrigerators',
    slug: 'double-door-refrigerators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'refrigerators',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Samsung, Beko, Gorenje, LG', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'height', label: 'Height (cm)', placeholder: 'cm', type: 'number' },
        { key: 'no_frost', label: 'No Frost', options: ['Yes', 'No'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Inox, White', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. LG Double Door 500L',
    },
  },
  {
    name: 'Single Door Refrigerators',
    slug: 'single-door-refrigerators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'refrigerators',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Samsung, Beko, Gorenje, LG', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'height', label: 'Height (cm)', placeholder: 'cm', type: 'number' },
        { key: 'no_frost', label: 'No Frost', options: ['Yes', 'No'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Inox', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Gorenje Single Door 250L',
    },
  },
  {
    name: 'Built-in Refrigerators',
    slug: 'built-in-refrigerators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'refrigerators',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Samsung, Beko, Gorenje, LG', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'height', label: 'Height (cm)', placeholder: 'cm', type: 'number' },
        { key: 'width', label: 'Width (cm)', placeholder: 'cm', type: 'number' },
        { key: 'no_frost', label: 'No Frost', options: ['Yes', 'No'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Bosch Built-in Fridge 200L',
    },
  },
  {
    name: 'Mini Refrigerators',
    slug: 'mini-refrigerators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'refrigerators',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Samsung, Beko, Gorenje, LG', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Black', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Mini Fridge 50L',
    },
  },
  {
    name: 'Portable Refrigerators',
    slug: 'portable-refrigerators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'refrigerators',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Portable Fridge 30L',
    },
  },
  {
    name: 'Refrigerator Elements',
    slug: 'refrigerator-elements',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'refrigerators',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Refrigerator Shelf / Drawer',
    },
  },
 
  // ─────────────────────────────────────────────
  // FREEZERS
  // ─────────────────────────────────────────────
  {
    name: 'Freezers',
    slug: 'freezers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'freezer_type', label: 'Type', options: ['Vertical', 'Horizontal / Chest', 'Built-in'], type: 'select' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'no_frost', label: 'No Frost', options: ['Yes', 'No'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Inox', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Vertical Freezer 200L',
    },
  },
  {
    name: 'Vertical Freezers',
    slug: 'vertical-freezers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'freezers',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'no_frost', label: 'No Frost', options: ['Yes', 'No'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Inox', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Beko Vertical Freezer 180L',
    },
  },
  {
    name: 'Horizontal Freezers',
    slug: 'horizontal-freezers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'freezers',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'no_frost', label: 'No Frost', options: ['Yes', 'No'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Chest Freezer 300L',
    },
  },
  {
    name: 'Built-in Freezers',
    slug: 'built-in-freezers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'freezers',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'no_frost', label: 'No Frost', options: ['Yes', 'No'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'height', label: 'Height (cm)', placeholder: 'cm', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Built-in Freezer 100L',
    },
  },
 
  // ─────────────────────────────────────────────
  // WASHING MACHINES
  // ─────────────────────────────────────────────
  {
    name: 'Washing Machines',
    slug: 'washing-machines',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'type', label: 'Type', options: ['Washing Machine', 'Dryer', 'Washer-Dryer Combo'], type: 'select' },
        { key: 'capacity_kg', label: 'Load Capacity (kg)', placeholder: 'kg', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A'], type: 'select' },
      ],
      titlePlaceholder: 'e.g. Washing Machine 7kg',
    },
  },
  {
    name: 'Washing Machines',
    slug: 'washing-machines-sub',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'washing-machines',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Beko, Whirlpool, Samsung', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'installation', label: 'Installation', options: ['Front Load', 'Top Load'], type: 'select' },
        { key: 'capacity_kg', label: 'Load Capacity (kg)', placeholder: 'kg', type: 'number' },
        { key: 'rpm', label: 'Spin Speed (RPM)', placeholder: 'RPM', type: 'number' },
        { key: 'noise_level_db', label: 'Noise Level (dB)', placeholder: 'dB', type: 'number' },
        { key: 'steam_function', label: 'Steam Function', options: ['Yes', 'No'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Inox', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2022', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Beko 7kg Front Load',
    },
  },
  {
    name: 'Dryers',
    slug: 'dryers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'washing-machines',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Beko, Whirlpool, Samsung', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'dryer_type', label: 'Dryer Type', options: ['Condenser', 'Heat Pump', 'Vented'], type: 'select' },
        { key: 'capacity_kg', label: 'Load Capacity (kg)', placeholder: 'kg', type: 'number' },
        { key: 'noise_level_db', label: 'Noise Level (dB)', placeholder: 'dB', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Inox', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2022', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Samsung Heat Pump Dryer 8kg',
    },
  },
  {
    name: 'Washer-Dryer Combo',
    slug: 'washer-dryer-combo',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'washing-machines',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Beko, Whirlpool, Samsung', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'wash_capacity_kg', label: 'Wash Capacity (kg)', placeholder: 'kg', type: 'number' },
        { key: 'dry_capacity_kg', label: 'Dry Capacity (kg)', placeholder: 'kg', type: 'number' },
        { key: 'rpm', label: 'Spin Speed (RPM)', placeholder: 'RPM', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A', 'B', 'C'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2022', type: 'number' },
      ],
      titlePlaceholder: 'e.g. LG Washer-Dryer Combo 8/5kg',
    },
  },
 
  // ─────────────────────────────────────────────
  // DISHWASHERS
  // ─────────────────────────────────────────────
  {
    name: 'Dishwashers',
    slug: 'dishwashers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'type', label: 'Type', options: ['Built-in', 'Freestanding'], type: 'select' },
        { key: 'place_settings', label: 'Place Settings', placeholder: '12, 14, etc.', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A'], type: 'select' },
      ],
      titlePlaceholder: 'e.g. Dishwasher 14 Place',
    },
  },
  {
    name: 'Built-in Dishwashers',
    slug: 'built-in-dishwashers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'dishwashers',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Bosch, Beko, Gorenje', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'place_settings', label: 'Place Settings', placeholder: '12, 14, etc.', type: 'number' },
        { key: 'width', label: 'Width (cm)', placeholder: '45 or 60', type: 'number' },
        { key: 'noise_level_db', label: 'Noise Level (dB)', placeholder: 'dB', type: 'number' },
        { key: 'drying_type', label: 'Drying Type', options: ['Heat', 'Zeolite', 'Auto Open', 'Fan'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2022', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Bosch Built-in 13 Place 44dB',
    },
  },
  {
    name: 'Freestanding Dishwashers',
    slug: 'freestanding-dishwashers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'dishwashers',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Bosch, Beko, Gorenje', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'place_settings', label: 'Place Settings', placeholder: '12, 14, etc.', type: 'number' },
        { key: 'width', label: 'Width (cm)', placeholder: '45 or 60', type: 'number' },
        { key: 'noise_level_db', label: 'Noise Level (dB)', placeholder: 'dB', type: 'number' },
        { key: 'drying_type', label: 'Drying Type', options: ['Heat', 'Zeolite', 'Auto Open', 'Fan'], type: 'select' },
        { key: 'energy_class', label: 'Energy Class', options: ['A+++', 'A++', 'A+', 'A'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Inox', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2022', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Gorenje Freestanding 14 Place',
    },
  },
 
  // ─────────────────────────────────────────────
  // STOVES, OVENS & HOBS
  // ─────────────────────────────────────────────
  {
    name: 'Stoves, Ovens & Hobs',
    slug: 'stoves-ovens',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Gas Stove 4-Burner',
    },
  },
  {
    name: 'Electric Stoves',
    slug: 'electric-stoves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'stoves-ovens',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Gorenje, Beko', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'installation_type', label: 'Installation', options: ['Freestanding', 'Built-in'], type: 'select' },
        { key: 'burners', label: 'Number of Burners', placeholder: '4', type: 'number' },
        { key: 'hob_type', label: 'Hob Type', options: ['Ceramic', 'Induction', 'Radiant'], type: 'select' },
        { key: 'oven_volume', label: 'Oven Volume (L)', placeholder: 'Liters', type: 'number' },
        { key: 'energy_class', label: 'Energy Class', options: ['A', 'B', 'C', 'D'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Inox, White, Black', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Gorenje Electric Stove 4-Burner',
    },
  },
  {
    name: 'Gas Stoves',
    slug: 'gas-stoves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'stoves-ovens',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Gorenje, Beko', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'installation_type', label: 'Installation', options: ['Freestanding', 'Built-in'], type: 'select' },
        { key: 'burners', label: 'Number of Burners', placeholder: '4', type: 'number' },
        { key: 'oven_volume', label: 'Oven Volume (L)', placeholder: 'Liters', type: 'number' },
        { key: 'oven_type', label: 'Oven Type', options: ['Gas', 'Electric', 'None'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Inox, White', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Beko Gas Stove 4-Burner',
    },
  },
  {
    name: 'Combined Stoves',
    slug: 'combined-stoves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'stoves-ovens',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Gorenje, Beko', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'installation_type', label: 'Installation', options: ['Freestanding', 'Built-in'], type: 'select' },
        { key: 'burners', label: 'Number of Burners', placeholder: '4', type: 'number' },
        { key: 'oven_volume', label: 'Oven Volume (L)', placeholder: 'Liters', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Inox, White', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Combined Stove Gas/Electric 4-Burner',
    },
  },
  {
    name: 'Built-in Ovens',
    slug: 'built-in-ovens',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'stoves-ovens',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'fuel_type', label: 'Fuel Type', options: ['Electric', 'Gas', 'Steam'], type: 'select' },
        { key: 'oven_volume', label: 'Oven Volume (L)', placeholder: 'Liters', type: 'number' },
        { key: 'functions', label: 'Functions', placeholder: 'e.g. fan, grill, pyrolysis', type: 'text' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Inox, Black', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Bosch Built-in Oven 71L',
    },
  },
  {
    name: 'Built-in Hobs',
    slug: 'built-in-hobs',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'stoves-ovens',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'hob_type', label: 'Hob Type', options: ['Induction', 'Ceramic', 'Gas', 'Mixed'], type: 'select' },
        { key: 'burners', label: 'Number of Burners/Zones', placeholder: '4', type: 'number' },
        { key: 'width', label: 'Width (cm)', placeholder: 'e.g. 60, 90', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Black, Inox', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Induction Hob 60cm 4-Zone',
    },
  },
  {
    name: 'Built-in Oven & Hob Sets',
    slug: 'built-in-sets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'stoves-ovens',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged / For Parts'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'hob_type', label: 'Hob Type', options: ['Induction', 'Ceramic', 'Gas', 'Mixed'], type: 'select' },
        { key: 'oven_volume', label: 'Oven Volume (L)', placeholder: 'Liters', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Siemens Oven + Induction Hob Set',
    },
  },
  {
    name: 'Mini Stoves',
    slug: 'mini-stoves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'stoves-ovens',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'burners', label: 'Number of Burners', placeholder: '2', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Mini Gas Stove 2-Burner',
    },
  },
  {
    name: 'Stove / Oven Accessories',
    slug: 'stove-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'stoves-ovens',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Oven Tray / Grill Rack',
    },
  },
 
  // ─────────────────────────────────────────────
  // MICROWAVES
  // ─────────────────────────────────────────────
  {
    name: 'Microwaves',
    slug: 'microwaves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'microwave_type', label: 'Type', options: ['Freestanding', 'Built-in', 'Combination'], type: 'select' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Inox, Black', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Samsung Microwave 23L 800W',
    },
  },
  {
    name: 'Freestanding Microwaves',
    slug: 'freestanding-microwaves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'microwaves',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'has_grill', label: 'Grill Function', options: ['Yes', 'No'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Black, Inox', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. LG Microwave 25L 900W',
    },
  },
  {
    name: 'Built-in Microwaves',
    slug: 'built-in-microwaves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'microwaves',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'has_grill', label: 'Grill Function', options: ['Yes', 'No'], type: 'select' },
        { key: 'width', label: 'Width (cm)', placeholder: 'cm', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Bosch Built-in Microwave 21L',
    },
  },
 
  // ─────────────────────────────────────────────
  // HOODS
  // ─────────────────────────────────────────────
  {
    name: 'Hoods',
    slug: 'hoods',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'hood_type', label: 'Type', options: ['Built-in', 'Wall-mounted', 'Island', 'Ceiling', 'Downdraft'], type: 'select' },
        { key: 'width', label: 'Width (cm)', placeholder: 'e.g. 60, 90', type: 'number' },
        { key: 'suction_m3h', label: 'Suction Power (m³/h)', placeholder: 'm³/h', type: 'number' },
        { key: 'noise_level_db', label: 'Noise Level (dB)', placeholder: 'dB', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Inox, White, Black', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Inox Hood 60cm 650m³/h',
    },
  },
  {
    name: 'Built-in Hoods',
    slug: 'built-in-hoods',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hoods',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'width', label: 'Width (cm)', placeholder: 'e.g. 60, 90', type: 'number' },
        { key: 'suction_m3h', label: 'Suction Power (m³/h)', placeholder: 'm³/h', type: 'number' },
        { key: 'noise_level_db', label: 'Noise Level (dB)', placeholder: 'dB', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Elica Built-in Hood 60cm',
    },
  },
  {
    name: 'Standard Hoods',
    slug: 'standard-hoods',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hoods',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'width', label: 'Width (cm)', placeholder: 'e.g. 60, 90', type: 'number' },
        { key: 'suction_m3h', label: 'Suction Power (m³/h)', placeholder: 'm³/h', type: 'number' },
        { key: 'noise_level_db', label: 'Noise Level (dB)', placeholder: 'dB', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Inox, White', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Pyramida Hood 60cm 650m³/h',
    },
  },
 
  // ─────────────────────────────────────────────
  // WATER HEATERS
  // ─────────────────────────────────────────────
  {
    name: 'Water Heaters',
    slug: 'water-heaters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'fuel_type', label: 'Fuel Type', options: ['Electric', 'Gas', 'Solar', 'Heat Pump'], type: 'select' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'power_kw', label: 'Power (kW)', placeholder: 'kW', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Electric Water Heater 80L',
    },
  },
  {
    name: 'Standard Water Heaters',
    slug: 'standard-water-heaters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'water-heaters',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'fuel_type', label: 'Fuel Type', options: ['Electric', 'Gas', 'Solar', 'Heat Pump'], type: 'select' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'power_kw', label: 'Power (kW)', placeholder: 'kW', type: 'number' },
        { key: 'mounting', label: 'Mounting', options: ['Wall', 'Floor'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2020', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Ariston 80L Electric Wall Heater',
    },
  },
  {
    name: 'Instant Water Heaters',
    slug: 'instant-water-heaters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'water-heaters',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'fuel_type', label: 'Fuel Type', options: ['Electric', 'Gas'], type: 'select' },
        { key: 'power_kw', label: 'Power (kW)', placeholder: 'kW', type: 'number' },
        { key: 'flow_rate', label: 'Flow Rate (L/min)', placeholder: 'L/min', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Vaillant Instant Heater 21kW',
    },
  },
  {
    name: 'Combined Water Heaters',
    slug: 'combined-water-heaters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'water-heaters',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'power_kw', label: 'Power (kW)', placeholder: 'kW', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Combined Water Heater 100L',
    },
  },
 
  // ─────────────────────────────────────────────
  // HEATERS
  // ─────────────────────────────────────────────
  {
    name: 'Heaters',
    slug: 'heaters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'heater_type', label: 'Type', options: ['Oil Radiator', 'Fan Heater', 'Panel Heater', 'Convector', 'Fireplace', 'Stove', 'Infrared'], type: 'select' },
        { key: 'fuel_type', label: 'Fuel Type', options: ['Electric', 'Gas', 'Wood', 'Pellet', 'Oil'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Oil Radiator 2500W',
    },
  },
  {
    name: 'Radiators',
    slug: 'radiators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heaters',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'radiator_type', label: 'Type', options: ['Oil', 'Electric Panel', 'Water/Central Heating'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'sections', label: 'Number of Sections', placeholder: 'e.g. 9', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Oil Radiator 9-Section 2000W',
    },
  },
  {
    name: 'Space Heaters',
    slug: 'space-heaters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heaters',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'heater_type', label: 'Type', options: ['Fan Heater', 'Convector', 'Infrared', 'Ceramic', 'Halogen'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Ceramic Fan Heater 2000W',
    },
  },
  {
    name: 'Fireplaces & Stoves',
    slug: 'fireplaces-stoves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heaters',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'fuel_type', label: 'Fuel Type', options: ['Wood', 'Pellet', 'Gas', 'Electric', 'Ethanol'], type: 'select' },
        { key: 'power_kw', label: 'Heating Power (kW)', placeholder: 'kW', type: 'number' },
        { key: 'room_size_m2', label: 'Suitable Room Size (m²)', placeholder: 'm²', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Wood Fireplace Insert 10kW',
    },
  },
  {
    name: 'Solid Fuel Stoves',
    slug: 'solid-fuel-stoves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heaters',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'fuel_type', label: 'Fuel Type', options: ['Wood', 'Coal', 'Pellet', 'Combined'], type: 'select' },
        { key: 'power_kw', label: 'Heating Power (kW)', placeholder: 'kW', type: 'number' },
        { key: 'room_size_m2', label: 'Suitable Room Size (m²)', placeholder: 'm²', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Pellet Stove 12kW',
    },
  },
 
  // ─────────────────────────────────────────────
  // COOLING & WINE DISPLAYS
  // ─────────────────────────────────────────────
  {
    name: 'Cooling & Wine Displays',
    slug: 'cooling-displays',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Wine Cooler 12 Bottles',
    },
  },
  {
    name: 'Wine Coolers',
    slug: 'wine-coolers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cooling-displays',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'capacity_bottles', label: 'Capacity (Bottles)', placeholder: 'e.g. 12, 24', type: 'number' },
        { key: 'zones', label: 'Temperature Zones', options: ['1 Zone', '2 Zones', '3 Zones'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Black, Inox', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Wine Cooler 24 Bottles 2-Zone',
    },
  },
 
  // ─────────────────────────────────────────────
  // AIR PURIFIERS
  // ─────────────────────────────────────────────
  {
    name: 'Air Purifiers',
    slug: 'air-purifiers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'room_size_m2', label: 'Suitable Room Size (m²)', placeholder: 'm²', type: 'number' },
        { key: 'filter_type', label: 'Filter Type', options: ['HEPA', 'Carbon', 'HEPA + Carbon', 'UV', 'Ionizer'], type: 'select' },
        { key: 'cadr', label: 'CADR (m³/h)', placeholder: 'm³/h', type: 'number' },
        { key: 'noise_level_db', label: 'Noise Level (dB)', placeholder: 'dB', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Xiaomi Air Purifier 4 Pro',
    },
  },
 
  // ─────────────────────────────────────────────
  // ★ NEW: SMALL KITCHEN APPLIANCES
  // ─────────────────────────────────────────────
  {
    name: 'Small Kitchen Appliances',
    slug: 'small-kitchen-appliances',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Small Kitchen Appliance',
    },
  },
  {
    name: 'Kettles',
    slug: 'kettles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'small-kitchen-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'e.g. 1.7', type: 'number' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'kettle_type', label: 'Type', options: ['Standard', 'Temperature Control', 'Glass', 'Travel'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Black, Chrome', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Philips Kettle 1.7L 2400W',
    },
  },
  {
    name: 'Toasters',
    slug: 'toasters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'small-kitchen-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'slots', label: 'Number of Slots', options: ['2', '4'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Black', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Tefal 4-Slot Toaster 1500W',
    },
  },
  {
    name: 'Blenders & Mixers',
    slug: 'blenders-mixers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'small-kitchen-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'appliance_type', label: 'Type', options: ['Jug Blender', 'Hand Blender', 'Stand Mixer', 'Hand Mixer', 'Smoothie Maker'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'speed_settings', label: 'Speed Settings', placeholder: 'e.g. 5', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. White, Black', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Bosch Hand Blender 700W',
    },
  },
  {
    name: 'Food Processors',
    slug: 'food-processors',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'small-kitchen-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'bowl_capacity_liters', label: 'Bowl Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'description', label: 'Description', placeholder: 'Included attachments, functions...', type: 'textarea' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Kenwood Food Processor 1000W',
    },
  },
  {
    name: 'Juicers',
    slug: 'juicers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'small-kitchen-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'juicer_type', label: 'Type', options: ['Centrifugal', 'Slow / Masticating', 'Citrus Press', 'Cold Press'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Hurom Slow Juicer',
    },
  },
  {
    name: 'Air Fryers',
    slug: 'air-fryers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'small-kitchen-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'has_rotisserie', label: 'Rotisserie', options: ['Yes', 'No'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Black, White', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Tefal Air Fryer 4.2L 1500W',
    },
  },
  {
    name: 'Sandwich Makers & Grills',
    slug: 'sandwich-makers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'small-kitchen-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'appliance_type', label: 'Type', options: ['Sandwich Maker', 'Contact Grill', 'Waffle Maker', 'Panini Press'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Tefal Contact Grill 2000W',
    },
  },
  {
    name: 'Rice & Multi Cookers',
    slug: 'rice-multi-cookers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'small-kitchen-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'appliance_type', label: 'Type', options: ['Rice Cooker', 'Multi Cooker', 'Pressure Cooker', 'Slow Cooker'], type: 'select' },
        { key: 'capacity_liters', label: 'Capacity (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Instant Pot Multi Cooker 6L',
    },
  },
 
  // ─────────────────────────────────────────────
  // ★ NEW: COFFEE MACHINES
  // ─────────────────────────────────────────────
  {
    name: 'Coffee Machines',
    slug: 'coffee-machines',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'coffee_type', label: 'Type', options: ['Espresso Manual', 'Espresso Semi-Auto', 'Bean-to-Cup', 'Capsule / Pod', 'Filter / Drip', 'French Press', 'Moka Pot'], type: 'select' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Coffee Machine',
    },
  },
  {
    name: 'Espresso Machines',
    slug: 'espresso-machines',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'coffee-machines',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. DeLonghi, Breville, Sage', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'machine_type', label: 'Type', options: ['Manual', 'Semi-Automatic', 'Automatic'], type: 'select' },
        { key: 'pump_bar', label: 'Pump Pressure (bar)', placeholder: 'e.g. 15', type: 'number' },
        { key: 'boiler_type', label: 'Boiler', options: ['Single', 'Dual', 'Heat Exchange', 'Thermoblock'], type: 'select' },
        { key: 'has_grinder', label: 'Built-in Grinder', options: ['Yes', 'No'], type: 'select' },
        { key: 'tank_capacity_liters', label: 'Water Tank (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Black, Chrome, White', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2022', type: 'number' },
      ],
      titlePlaceholder: 'e.g. DeLonghi La Specialista',
    },
  },
  {
    name: 'Bean-to-Cup Machines',
    slug: 'bean-to-cup',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'coffee-machines',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. DeLonghi, Philips, Jura', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'drinks', label: 'One-Touch Drinks', placeholder: 'e.g. Espresso, Latte, Cappuccino', type: 'text' },
        { key: 'pump_bar', label: 'Pump Pressure (bar)', placeholder: 'e.g. 15', type: 'number' },
        { key: 'tank_capacity_liters', label: 'Water Tank (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Black, Silver', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2023', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Philips 3200 Bean-to-Cup',
    },
  },
  {
    name: 'Capsule / Pod Machines',
    slug: 'capsule-machines',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'coffee-machines',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Nespresso, Dolce Gusto', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'capsule_system', label: 'Capsule System', options: ['Nespresso Original', 'Nespresso Vertuo', 'Dolce Gusto', 'Tassimo', 'Lavazza', 'Other'], type: 'select' },
        { key: 'tank_capacity_liters', label: 'Water Tank (Liters)', placeholder: 'Liters', type: 'number' },
        { key: 'has_milk_frother', label: 'Milk Frother', options: ['Built-in', 'Separate', 'None'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Black, Red, White', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Nespresso Vertuo Pop',
    },
  },
  {
    name: 'Filter Coffee Machines',
    slug: 'filter-coffee',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'coffee-machines',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'capacity_cups', label: 'Capacity (Cups)', placeholder: 'e.g. 12', type: 'number' },
        { key: 'has_grinder', label: 'Built-in Grinder', options: ['Yes', 'No'], type: 'select' },
        { key: 'has_thermal_carafe', label: 'Thermal Carafe', options: ['Yes', 'No'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Black, Silver', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Moccamaster Filter Coffee 12 Cup',
    },
  },
 
  // ─────────────────────────────────────────────
  // ★ NEW: FLOOR CARE
  // ─────────────────────────────────────────────
  {
    name: 'Floor Care',
    slug: 'floor-care',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Vacuum Cleaner',
    },
  },
  {
    name: 'Upright & Canister Vacuums',
    slug: 'vacuums',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'floor-care',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Dyson, Bosch, Philips', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'vacuum_type', label: 'Type', options: ['Canister', 'Upright', 'Stick', 'Handheld', 'Wet & Dry'], type: 'select' },
        { key: 'suction_w', label: 'Suction Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'filtration', label: 'Filtration', options: ['HEPA', 'Bagless', 'Bagged', 'Water Filter'], type: 'select' },
        { key: 'noise_level_db', label: 'Noise Level (dB)', placeholder: 'dB', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Red, Black', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Dyson V15 Detect Stick Vacuum',
    },
  },
  {
    name: 'Robot Vacuums',
    slug: 'robot-vacuums',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'floor-care',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Roborock, iRobot, Xiaomi', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'suction_pa', label: 'Suction (Pa)', placeholder: 'e.g. 3000', type: 'number' },
        { key: 'has_mop', label: 'Mop Function', options: ['Yes', 'No'], type: 'select' },
        { key: 'has_auto_empty', label: 'Auto Empty Base', options: ['Yes', 'No'], type: 'select' },
        { key: 'battery_minutes', label: 'Battery Life (min)', placeholder: 'minutes', type: 'number' },
        { key: 'mapping', label: 'Mapping', options: ['Laser (LiDAR)', 'Camera', 'Gyroscope', 'None'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
        { key: 'year', label: 'Year', placeholder: 'e.g. 2023', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Roborock S7 MaxV Ultra',
    },
  },
  {
    name: 'Steam Mops & Carpet Cleaners',
    slug: 'steam-mops',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'floor-care',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'appliance_type', label: 'Type', options: ['Steam Mop', 'Steam Cleaner', 'Carpet Cleaner', 'Wet & Dry Vacuum'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'tank_capacity_ml', label: 'Water Tank (ml)', placeholder: 'ml', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Kärcher SC 3 Steam Cleaner',
    },
  },
 
  // ─────────────────────────────────────────────
  // ★ NEW: PERSONAL CARE APPLIANCES
  // ─────────────────────────────────────────────
  {
    name: 'Personal Care Appliances',
    slug: 'personal-care',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Hair Dryer',
    },
  },
  {
    name: 'Hair Dryers',
    slug: 'hair-dryers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'personal-care',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Dyson, Rowenta, Remington', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'speed_settings', label: 'Speed Settings', placeholder: 'e.g. 2', type: 'number' },
        { key: 'has_diffuser', label: 'Diffuser Included', options: ['Yes', 'No'], type: 'select' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Black, Rose Gold', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Dyson Supersonic Hair Dryer',
    },
  },
  {
    name: 'Hair Straighteners & Curlers',
    slug: 'hair-styling',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'personal-care',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. GHD, Dyson, Babyliss', type: 'text' },
        { key: 'appliance_type', label: 'Type', options: ['Straightener', 'Curling Iron', 'Curling Wand', 'Multistyler', 'Hot Brush'], type: 'select' },
        { key: 'plate_material', label: 'Plate / Barrel Material', options: ['Ceramic', 'Titanium', 'Tourmaline', 'Gold'], type: 'select' },
        { key: 'max_temp', label: 'Max Temperature (°C)', placeholder: '°C', type: 'number' },
        { key: 'color', label: 'Color', placeholder: 'e.g. Black, Rose Gold', type: 'text' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. GHD Platinum+ Straightener',
    },
  },
  {
    name: 'Shavers & Trimmers',
    slug: 'shavers-trimmers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'personal-care',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Philips, Braun, Panasonic', type: 'text' },
        { key: 'appliance_type', label: 'Type', options: ['Electric Shaver', 'Beard Trimmer', 'Body Groomer', 'Hair Clipper', 'Nose / Ear Trimmer'], type: 'select' },
        { key: 'for_gender', label: 'For', options: ['Men', 'Women', 'Unisex'], type: 'select' },
        { key: 'is_waterproof', label: 'Waterproof', options: ['Yes', 'No'], type: 'select' },
        { key: 'battery_type', label: 'Battery', options: ['Rechargeable', 'AA/AAA', 'Corded Only'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Philips Series 9000 Shaver',
    },
  },
  {
    name: 'Epilators',
    slug: 'epilators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'personal-care',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Braun, Philips, Panasonic', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'is_waterproof', label: 'Waterproof', options: ['Yes', 'No'], type: 'select' },
        { key: 'has_shaver_head', label: 'Shaver Head', options: ['Yes', 'No'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Braun Silk-épil 9 Epilator',
    },
  },
 
  // ─────────────────────────────────────────────
  // ★ NEW: IRONS & GARMENT CARE
  // ─────────────────────────────────────────────
  {
    name: 'Irons & Garment Care',
    slug: 'irons-garment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Steam Iron',
    },
  },
  {
    name: 'Steam Irons',
    slug: 'steam-irons',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'irons-garment',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Rowenta, Philips, Tefal', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'steam_g_min', label: 'Steam Output (g/min)', placeholder: 'g/min', type: 'number' },
        { key: 'soleplate', label: 'Soleplate', options: ['Stainless Steel', 'Ceramic', 'Titanium', 'Anodized'], type: 'select' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Rowenta Steam Iron 2800W',
    },
  },
  {
    name: 'Steam Stations',
    slug: 'steam-stations',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'irons-garment',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Philips, Tefal, Rowenta', type: 'text' },
        { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'steam_bar', label: 'Steam Pressure (bar)', placeholder: 'bar', type: 'number' },
        { key: 'tank_capacity_ml', label: 'Tank Capacity (ml)', placeholder: 'ml', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Philips PerfectCare Steam Station',
    },
  },
  {
    name: 'Garment Steamers',
    slug: 'garment-steamers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'irons-garment',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'steamer_type', label: 'Type', options: ['Handheld', 'Standing'], type: 'select' },
        { key: 'power_w', label: 'Power (W)', placeholder: 'Watts', type: 'number' },
        { key: 'tank_capacity_ml', label: 'Tank Capacity (ml)', placeholder: 'ml', type: 'number' },
        { key: 'warranty', label: 'Warranty (Months)', placeholder: 'Months', type: 'number' },
      ],
      titlePlaceholder: 'e.g. Conair Handheld Garment Steamer',
    },
  },
 
  // ─────────────────────────────────────────────
  // ACCESSORIES (all sub-accessory categories)
  // ─────────────────────────────────────────────
  {
    name: 'Accessories',
    slug: 'appliances-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Appliance Accessory',
    },
  },
  {
    name: 'Fridge / Freezer Accessories',
    slug: 'acc-fridge',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'appliances-accessories',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Fridge Shelf / Ice Tray',
    },
  },
  {
    name: 'Washer / Dryer Accessories',
    slug: 'acc-washing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'appliances-accessories',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Washing Machine Drain Hose',
    },
  },
  {
    name: 'AC / Hood Accessories',
    slug: 'acc-ac-hood',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'appliances-accessories',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. AC Remote / Hood Filter',
    },
  },
  {
    name: 'Air Purifier Filters',
    slug: 'acc-filters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'appliances-accessories',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. HEPA Replacement Filter',
    },
  },
  {
    name: 'Spare Parts',
    slug: 'acc-spare-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'appliances-accessories',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Washing Machine Door Seal',
    },
  },
 
  // ─────────────────────────────────────────────
  // CLEANING & PROTECTION
  // ─────────────────────────────────────────────
  {
    name: 'Cleaning & Protection',
    slug: 'cleaning-protection',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-appliances',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Appliance Cleaner',
    },
  },
  {
    name: 'Cleaning Wipes',
    slug: 'cleaning-wipes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cleaning-protection',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Stainless Steel Cleaning Wipes',
    },
  },
  {
    name: 'Cleaning Liquid',
    slug: 'cleaning-liquid',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cleaning-protection',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Oven Cleaning Spray',
    },
  },
  {
    name: 'Cleaning Tablets',
    slug: 'cleaning-tablets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cleaning-protection',
    template: {
      fields: [
        { key: 'condition', label: 'Condition', options: ['New', 'Damaged'], type: 'select' },
        { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' },
        { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' },
      ],
      titlePlaceholder: 'e.g. Descaling Tablets',
    },
  },
  {
    name: 'Home and Garden',
    slug: 'home-and-garden',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Home and Garden',
    },
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Furniture',
    },
  },
  {
    name: 'Garden and Terrace',
    slug: 'garden-terrace',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Garden and Terrace',
    },
  },
  {
    name: 'Kitchen and Dining',
    slug: 'kitchen-dining',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Kitchen and Dining',
    },
  },
  {
    name: 'Bedding, Pillows and Covers',
    slug: 'bedding',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bedding, Pillows and Covers',
    },
  },
  {
    name: 'Lighting',
    slug: 'lighting',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Lighting',
    },
  },
  {
    name: 'Decoration',
    slug: 'decoration',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Decoration',
    },
  },
  {
    name: 'Bathroom Equipment',
    slug: 'bathroom-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bathroom Equipment',
    },
  },
  {
    name: 'Wine and Brandy Preparation',
    slug: 'wine-brandy-production',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wine and Brandy Preparation',
    },
  },
  {
    name: 'Smart Home',
    slug: 'smart-home',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Smart Home',
    },
  },
  {
    name: 'New Year Decoration',
    slug: 'new-year-decoration',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. New Year Decoration',
    },
  },
  {
    name: 'Carpentry',
    slug: 'carpentry',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Carpentry',
    },
  },
  {
    name: 'Solar Elements',
    slug: 'solar-elements',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'home-and-garden',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Solar Elements',
    },
  },
  {
    name: 'Living Room',
    slug: 'living-room',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'furniture',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Living Room',
    },
  },
  {
    name: 'Bedroom',
    slug: 'bedroom',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'furniture',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bedroom',
    },
  },
  {
    name: "Children's Room",
    slug: 'childrens-room',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'furniture',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: "e.g. Children's Room",
    },
  },
  {
    name: 'Dining Room',
    slug: 'dining-room',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'furniture',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Dining Room',
    },
  },
  {
    name: 'Kitchen',
    slug: 'kitchen-furniture',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'furniture',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Kitchen',
    },
  },
  {
    name: 'Hallway / Entryway',
    slug: 'entryway',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'furniture',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Hallway / Entryway',
    },
  },
  {
    name: 'Office Furniture',
    slug: 'office-furniture',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'furniture',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Office Furniture',
    },
  },
  {
    name: 'Wardrobe Elements',
    slug: 'wardrobe-elements',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'furniture',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wardrobe Elements',
    },
  },
  {
    name: 'Garden Furniture',
    slug: 'garden-furniture',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-terrace',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Garden Furniture',
    },
  },
  {
    name: 'Pools',
    slug: 'pools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-terrace',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Pools',
    },
  },
  {
    name: 'Solar Showers',
    slug: 'solar-showers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-terrace',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Solar Showers',
    },
  },
  {
    name: 'BBQ and Equipment',
    slug: 'bbq-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-terrace',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. BBQ and Equipment',
    },
  },
  {
    name: 'Fences and Equipment',
    slug: 'fences-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-terrace',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Fences and Equipment',
    },
  },
  {
    name: 'Flower Pots / Planters',
    slug: 'flower-pots',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-terrace',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Flower Pots / Planters',
    },
  },
  {
    name: 'Garden Decoration',
    slug: 'garden-decoration',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-terrace',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Garden Decoration',
    },
  },
  {
    name: 'Fountains',
    slug: 'fountains',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-terrace',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Fountains',
    },
  },
  {
    name: 'Terrace Flooring',
    slug: 'terrace-flooring',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-terrace',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Terrace Flooring',
    },
  },
  {
    name: 'Cooking and Baking Cookware',
    slug: 'cookware-baking',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'kitchen-dining',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cooking and Baking Cookware',
    },
  },
  {
    name: 'Serving Food and Drinks',
    slug: 'serving-food-drinks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'kitchen-dining',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Serving Food and Drinks',
    },
  },
  {
    name: 'Kitchen Textiles',
    slug: 'kitchen-textiles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'kitchen-dining',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Kitchen Textiles',
    },
  },
  {
    name: 'Food Storage Containers',
    slug: 'food-storage',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'kitchen-dining',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Food Storage Containers',
    },
  },
  {
    name: 'Shopping Carts',
    slug: 'shopping-carts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'kitchen-dining',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Shopping Carts',
    },
  },
  {
    name: 'Pillows',
    slug: 'pillows',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bedding',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Pillows',
    },
  },
  {
    name: 'Bedding Sets',
    slug: 'bedding-sets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bedding',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bedding Sets',
    },
  },
  {
    name: 'Duvets',
    slug: 'duvets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bedding',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Duvets',
    },
  },
  {
    name: 'Blankets',
    slug: 'blankets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bedding',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Blankets',
    },
  },
  {
    name: 'Bedspreads / Covers',
    slug: 'bedspreads',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bedding',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bedspreads / Covers',
    },
  },
  {
    name: 'Chandeliers',
    slug: 'chandeliers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Chandeliers',
    },
  },
  {
    name: 'Ceiling Lights',
    slug: 'ceiling-lights',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Ceiling Lights',
    },
  },
  {
    name: 'Lamps',
    slug: 'lamps',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Lamps',
    },
  },
  {
    name: "Children's Room Lighting",
    slug: 'childrens-lighting',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: "e.g. Children's Room Lighting",
    },
  },
  {
    name: 'Garden Lighting',
    slug: 'garden-lighting',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Garden Lighting',
    },
  },
  {
    name: 'Light Bulbs',
    slug: 'light-bulbs',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Light Bulbs',
    },
  },
  {
    name: 'LED Strips',
    slug: 'led-strips',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. LED Strips',
    },
  },
  {
    name: 'Track Lighting',
    slug: 'track-lighting',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Track Lighting',
    },
  },
  {
    name: 'Recessed Lighting',
    slug: 'recessed-lighting',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Recessed Lighting',
    },
  },
  {
    name: 'Decorative Lighting',
    slug: 'decorative-lighting',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Decorative Lighting',
    },
  },
  {
    name: 'Other Lighting',
    slug: 'other-lighting',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'lighting',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Lighting',
    },
  },
  {
    name: 'Home Textiles',
    slug: 'home-textiles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Home Textiles',
    },
  },
  {
    name: 'Paintings / Pictures',
    slug: 'paintings-pictures',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Paintings / Pictures',
    },
  },
  {
    name: 'Clocks',
    slug: 'clocks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Clocks',
    },
  },
  {
    name: 'Artificial Flowers and Pots',
    slug: 'artificial-flowers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Artificial Flowers and Pots',
    },
  },
  {
    name: 'Wall Decoration',
    slug: 'wall-decoration',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wall Decoration',
    },
  },
  {
    name: 'Decorative Items',
    slug: 'decorative-items',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Decorative Items',
    },
  },
  {
    name: 'Candles and Candlesticks',
    slug: 'candles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Candles and Candlesticks',
    },
  },
  {
    name: 'Picture Frames',
    slug: 'picture-frames',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Picture Frames',
    },
  },
  {
    name: 'Vases',
    slug: 'vases',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Vases',
    },
  },
  {
    name: 'Carpets, Rugs and Mats',
    slug: 'carpets-rugs',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Carpets, Rugs and Mats',
    },
  },
  {
    name: 'Easter Decoration',
    slug: 'easter-decoration',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Easter Decoration',
    },
  },
  {
    name: 'Holiday Decoration',
    slug: 'holiday-decoration',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Holiday Decoration',
    },
  },
  {
    name: 'Other Decoration',
    slug: 'other-decoration',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Decoration',
    },
  },
  {
    name: 'Bathroom Furniture and Sanitary Ware',
    slug: 'bathroom-furniture',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bathroom-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bathroom Furniture and Sanitary Ware',
    },
  },
  {
    name: 'Bathroom Sets',
    slug: 'bathroom-sets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bathroom-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bathroom Sets',
    },
  },
  {
    name: 'Towels',
    slug: 'towels',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bathroom-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Towels',
    },
  },
  {
    name: 'Bathroom Mats and Rugs',
    slug: 'bathroom-mats',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bathroom-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bathroom Mats and Rugs',
    },
  },
  {
    name: 'Shower Curtains',
    slug: 'shower-curtains',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bathroom-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Shower Curtains',
    },
  },
  {
    name: 'Bath and Shower Mats (Rubber)',
    slug: 'bath-rubber-mats',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bathroom-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bath and Shower Mats (Rubber)',
    },
  },
  {
    name: 'Sanitary Equipment',
    slug: 'sanitary-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bathroom-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Sanitary Equipment',
    },
  },
  {
    name: 'Faucets and Accessories',
    slug: 'faucets-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'bathroom-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Faucets and Accessories',
    },
  },
  {
    name: 'Wine and Brandy Storage Vessels',
    slug: 'wine-storage',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'wine-brandy-production',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wine and Brandy Storage Vessels',
    },
  },
  {
    name: 'Preparation Equipment',
    slug: 'preparation-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'wine-brandy-production',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Preparation Equipment',
    },
  },
  {
    name: 'Additional Equipment',
    slug: 'additional-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'wine-brandy-production',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Additional Equipment',
    },
  },
  {
    name: 'Smart Home Elements',
    slug: 'smart-home-elements',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'smart-home',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Smart Home Elements',
    },
  },
  {
    name: 'Security Equipment',
    slug: 'security-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'smart-home',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Security Equipment',
    },
  },
  {
    name: 'Christmas Trees',
    slug: 'christmas-trees',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'new-year-decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Christmas Trees',
    },
  },
  {
    name: 'Tree Ornaments',
    slug: 'tree-ornaments',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'new-year-decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tree Ornaments',
    },
  },
  {
    name: 'Christmas Lights',
    slug: 'christmas-lights',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'new-year-decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Christmas Lights',
    },
  },
  {
    name: 'Garlands, Wreaths and Branches',
    slug: 'garlands-wreaths',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'new-year-decoration',
    template: {
      fields: [
        {
          key: 'adType',
          label: 'Тип на оглас',
          options: [
            'Се продава',
            'Се купува',
            'Се изнајмува',
            'Се бара изнајмување',
          ],
          type: 'select',
        },
        {
          key: 'isTradePossible',
          label: 'Може замена',
          options: ['Да', 'Не'],
          type: 'select',
        },
        {
          key: 'm2',
          label: 'Area (m2)',
          placeholder: 'm2',
          type: 'number',
        },
        {
          key: 'electricity',
          label: 'Electricity',
          options: ['Yes', 'No', 'Nearby'],
          type: 'select',
        },
        {
          key: 'water',
          label: 'Water',
          options: ['Yes', 'No', 'Nearby'],
          type: 'select',
        },
        {
          key: 'road',
          label: 'Road Access',
          options: ['Asphalt', 'Dirt Road', 'None'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Construction Plot',
    },
  },
  {
    name: 'Decorative Christmas Ornaments',
    slug: 'decorative-ornaments',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'new-year-decoration',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Decorative Christmas Ornaments',
    },
  },
  {
    name: 'Solar Panels',
    slug: 'solar-panels',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'solar-elements',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Solar Panels',
    },
  },
  {
    name: 'Charge Controllers and Inverters',
    slug: 'charge-controllers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'solar-elements',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Charge Controllers and Inverters',
    },
  },
  {
    name: 'Solar Batteries',
    slug: 'solar-batteries',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'solar-elements',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Solar Batteries',
    },
  },
  {
    name: 'Mobile Phones and Accessories',
    slug: 'mobile-phones-accessories',
    description: 'Smartphones, tablets, wearables, accessories and hardware spare parts.',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged / For Parts'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Mobile Phones and Accessories',
    },
  },
  {
    name: 'Mobile Phones',
    slug: 'mobile-phones',
    description: 'Smartphones and cell phones from all major brands.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: [
            'New (Sealed)',
            'New (Open Box)',
            'Used (As New)',
            'Used (Normal)',
            'Used (Visible Scratches)',
            'For Parts / Damaged',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Apple',
            'Samsung',
            'Xiaomi',
            'Huawei',
            'Google Pixel',
            'OnePlus',
            'Realme',
            'OPPO',
            'Vivo',
            'Motorola',
            'Nokia',
            'Sony',
            'Nothing',
            'Honor',
            'Asus',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'model',
          label: 'Model Name',
          placeholder: 'e.g. iPhone 15 Pro, Galaxy S24 Ultra',
          type: 'text',
        },
        {
          key: 'storage_gb',
          label: 'Internal Storage (GB)',
          options: ['16', '32', '64', '128', '256', '512', '1024', 'Over 1TB'],
          type: 'select',
        },
        {
          key: 'ram_gb',
          label: 'RAM (GB)',
          options: ['2', '3', '4', '6', '8', '12', '16', '24'],
          type: 'select',
        },
        {
          key: 'sim_type',
          label: 'SIM Slot',
          options: ['Single SIM', 'Dual SIM', 'Dual SIM (Nano + eSIM)', 'eSIM Only'],
          type: 'select',
        },
        {
          key: 'battery_health',
          label: 'Battery Health (%)',
          placeholder: 'e.g. 98%',
          type: 'text',
        },
        {
          key: 'network',
          label: 'Network Generation',
          options: ['3G / 4G (LTE)', '5G'],
          type: 'select',
        },
        {
          key: 'color',
          label: 'Color',
          type: 'text',
        },
        {
          key: 'warranty',
          label: 'Warranty Status',
          options: [
            'No Warranty',
            'Local Warranty (Active)',
            'International Warranty',
            'Store Warranty',
          ],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. iPhone 15 Pro 256GB Titanium Blue',
    },
  },
  {
    name: 'Accessories for Mobile Phones',
    slug: 'mobile-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Accessories for Mobile Phones',
    },
  },
  {
    name: 'Tablets',
    slug: 'tablets',
    description: 'iPads, Android tablets and professional tablets.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair', 'For Parts'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Apple (iPad)',
            'Samsung (Galaxy Tab)',
            'Lenovo',
            'Huawei',
            'Xiaomi',
            'Microsoft Surface',
            'Amazon (Kindle/Fire)',
            'Google',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'model',
          label: 'Model Name / Generation',
          placeholder: 'e.g. iPad Pro 12.9 (M2), Tab S9 Ultra',
          type: 'text',
        },
        {
          key: 'storage_gb',
          label: 'Storage (GB)',
          options: ['16', '32', '64', '128', '256', '512', '1024', '2048'],
          type: 'select',
        },
        {
          key: 'connectivity',
          label: 'Connectivity',
          options: ['Wi-Fi Only', 'Wi-Fi + 4G / LTE', 'Wi-Fi + 5G'],
          type: 'select',
        },
        {
          key: 'screen_size_inch',
          label: 'Screen Size (inch)',
          placeholder: 'e.g. 10.9',
          type: 'number',
        },
        {
          key: 'color',
          label: 'Color',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. iPad Air 5 64GB Space Grey',
    },
  },
  {
    name: 'Smartwatches & Wearables',
    slug: 'smartwatches',
    description: 'Apple Watch, Samsung Gear, fitness trackers and others.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New (Sealed)', 'New (Open Box)', 'Used', 'Refurbished'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Apple',
            'Samsung',
            'Garmin',
            'Huawei',
            'Xiaomi',
            'Amazfit',
            'Fitbit',
            'Polar',
            'Suunto',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'model',
          label: 'Model',
          type: 'text',
        },
        {
          key: 'case_size_mm',
          label: 'Case Size (mm)',
          placeholder: 'e.g. 40mm, 44mm, 49mm',
          type: 'text',
        },
        {
          key: 'compatibility',
          label: 'Compatibility',
          options: ['iOS Only', 'Android Only', 'Universal (Both)'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Apple Watch Ultra 2 Titanium',
    },
  },
  {
    name: 'Mobile Accessories',
    slug: 'mobile-accessories',
    description: 'Consumer accessories for phones and tablets.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: { fields: [] },
  },
  {
    name: 'Cases, Covers & Screen Protectors',
    slug: 'mobile-cases-protectors',
    description: 'Protective gear for devices.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Type',
          options: ['Silicone Case', 'Leather Case', 'Hard Case', 'Wallet Cover', 'Screen Protector (Glass)', 'Screen Protector (Foil)', 'Full Body Skin'],
          type: 'select',
        },
        {
          key: 'compatibility_model',
          label: 'Compatible Model',
          placeholder: 'e.g. iPhone 15 Pro Max',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'Power, Chargers & Power Banks',
    slug: 'mobile-power',
    description: 'Charging solutions and portable energy.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Type',
          options: ['Wall Charger', 'Car Charger', 'Power Bank', 'Wireless Charger', 'Charging Cable', 'Docking Station'],
          type: 'select',
        },
        {
          key: 'connector_type',
          label: 'Connector',
          options: ['USB-C', 'Lightning (Apple)', 'Micro-USB', 'Wireless (Qi)', 'MagSafe'],
          type: 'select',
        },
        {
          key: 'capacity_mah',
          label: 'Capacity (mAh)',
          placeholder: 'e.g. 10000',
          type: 'number',
        },
      ],
    },
  },
  {
    name: 'Audio & Bluetooth',
    slug: 'mobile-audio',
    description: 'Headphones, earbuds and bluetooth speakers.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Refurbished'],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Type',
          options: ['Wireless Earbuds (TWS)', 'Over-Ear Headphones', 'Bluetooth Speaker', 'Wired Earphones', 'Bluetooth Headset (Mono)'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'e.g. Apple (AirPods), Sony, JBL, Marshall',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'Spare Parts & Repair (Hardware)',
    slug: 'mobile-spare-parts',
    description: 'Internal components and professional repair equipment.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: { fields: [] },
  },
  {
    name: 'Screens, LCD & Digitizers',
    slug: 'mobile-screens',
    description: 'Display replacements and touch panels.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-spare-parts',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used (Pulled)'],
          type: 'select',
        },
        {
          key: 'part_quality',
          label: 'Part Quality',
          options: ['Original (Service Pack)', 'Original (Pulled/Used)', 'OEM High Quality', 'Aftermarket (Standard)', 'Incell / TFT'],
          type: 'select',
        },
        {
          key: 'compatibility',
          label: 'Compatible Model',
          placeholder: 'e.g. Samsung S23 Ultra, iPhone 14',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'Internal Batteries',
    slug: 'mobile-internal-batteries',
    description: 'Replacement batteries for smartphones and tablets.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-spare-parts',
    template: {
      fields: [
        {
          key: 'part_quality',
          label: 'Battery Quality',
          options: ['Original', 'High Capacity / Gold', 'Standard Replacement', 'Used (Good Health)'],
          type: 'select',
        },
        {
          key: 'compatibility',
          label: 'Compatible Model',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'Internal Components & Boards',
    slug: 'mobile-internal-parts',
    description: 'Cameras, charging ports, logic boards and flex cables.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-spare-parts',
    template: {
      fields: [
        {
          key: 'component_type',
          label: 'Component Type',
          options: [
            'Main Board / Motherboard',
            'Front Camera Module',
            'Rear Camera Module',
            'Charging Port / Dock Connector',
            'Speaker / Earpiece',
            'Vibration Motor',
            'Flex Cable (Home/Volume/Power)',
            'IC Chips / Hardware Components',
            'Face ID / Touch ID Parts',
          ],
          type: 'select',
        },
        {
          key: 'compatibility',
          label: 'Compatible Model',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'Housing, Back Glass & Frames',
    slug: 'mobile-housing',
    description: 'Exterior shells and structural parts.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-spare-parts',
    template: {
      fields: [
        {
          key: 'part_type',
          label: 'Part Type',
          options: ['Full Housing Chassis', 'Back Glass Only', 'Middle Frame / Bezel', 'Sim Tray', 'Button Set'],
          type: 'select',
        },
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used (Grade A)', 'Used (Normal)'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Repair Tools & Equipment',
    slug: 'mobile-repair-tools',
    description: 'Professional tools for phone repair shops.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-spare-parts',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'tool_category',
          label: 'Equipment Category',
          options: [
            'Screwdriver Sets & Bits',
            'Opening & Prying Tools',
            'Soldering & Rework Stations',
            'Microscopes & Optics',
            'DC Power Supply',
            'Programmers (TrueTone/Battery/FaceID)',
            'Testing Equipment',
            'Consumables (Solder/Flux/Glue)',
          ],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'VIP & Gold Phone Numbers',
    slug: 'mobile-numbers',
    description: 'Exclusive and easy-to-remember mobile numbers.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: {
      fields: [
        {
          key: 'operator',
          label: 'Network Operator',
          options: ['A1', 'Telekom', 'LycaMobile', 'MTEL', 'Other'],
          type: 'select',
        },
        {
          key: 'number_pattern',
          label: 'Pattern Type',
          options: ['Platinum (XXXXX)', 'Gold (XY XY XY)', 'Silver / Nice Number', 'Triple (XXX)', 'Consecutive Numbers'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. 07X 777 777 VIP Gold Number',
    },
  },
  {
    name: 'Modems, Routers & Mobile Internet',
    slug: 'mobile-internet',
    description: '4G/5G pocket modems and mobile Wi-Fi routers.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'e.g. Huawei, ZTE, TP-Link',
          type: 'text',
        },
        {
          key: 'generation',
          label: 'Network Support',
          options: ['4G / LTE', '5G'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Landlines & Office Phones',
    slug: 'landlines',
    description: 'Cordless phones and desktop office systems.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Phone Type',
          options: ['Wireless (DECT)', 'Wired / Corded Desktop', 'IP / VoIP / SIP Phone', 'Hotel Phones'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Old & Antique Phones',
    slug: 'old-phones',
    description: 'Vintage collection items and retro phones.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: {
      fields: [
        {
          key: 'brand',
          label: 'Brand / Model',
          placeholder: 'e.g. Nokia 3310, Ericsson T28, Motorola StarTAC',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'Other Mobile & Miscellaneous',
    slug: 'mobile-other',
    description: 'Everything else related to mobile technology.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: { fields: [] },
  },
  {
    name: 'Faxes',
    slug: 'faxes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'mobile-phones-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Faxes',
    },
  },
  {
    name: 'Computers & Hardware',
    slug: 'computers',
    description: 'Laptops, desktops, gaming rigs, hardware components and peripherals.',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Refurbished', 'For Parts / Damaged'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Computers & Hardware',
    },
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    description: 'Portable computers for home, office and gaming.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New (Sealed)', 'New (Open Box)', 'Used (As New)', 'Used (Normal)', 'For Parts'],
          type: 'select',
        },
        {
          key: 'category',
          label: 'Laptop Category',
          options: ['Ultrabook / Business', 'Gaming Laptop', 'Student / Home', '2-in-1 / Touchscreen', 'Workstation (Pro)', 'Other'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: ['Apple (MacBook)', 'Lenovo', 'HP', 'Dell', 'ASUS', 'Acer', 'MSI', 'Razer', 'Samsung', 'Microsoft Surface', 'Gigabyte', 'Other'],
          type: 'select',
        },
        {
          key: 'processor',
          label: 'Processor Family',
          options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'Intel Ultra', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1 / M2 / M3', 'Other'],
          type: 'select',
        },
        {
          key: 'ram_gb',
          label: 'RAM (GB)',
          options: ['2', '4', '8', '16', '32', '64', 'Over 64', 'Other'],
          type: 'select',
        },
        {
          key: 'storage_gb',
          label: 'Storage (GB)',
          options: ['128', '256', '512', '1TB (1024)', '2TB', 'Over 2TB', 'Other'],
          type: 'select',
        },
        {
          key: 'screen_size_inch',
          label: 'Screen Size (inch)',
          placeholder: 'e.g. 13.3", 15.6", 17.3"',
          type: 'text',
        },
        {
          key: 'gpu',
          label: 'Dedicated Graphics',
          options: ['Integrated', 'NVIDIA RTX Series', 'NVIDIA GTX Series', 'AMD Radeon RX Series', 'Workstation (Quadro/A-Series)', 'Other'],
          type: 'select',
        },
        {
          key: 'battery_cycles',
          label: 'Battery Health / Cycles',
          placeholder: 'e.g. 95% / 120 cycles',
          type: 'text',
        },
        {
          key: 'warranty',
          label: 'Warranty Status',
          options: ['No Warranty', 'International Warranty', 'Local Warranty (Active)'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. ASUS ROG Strix Scar 16 i9 RTX 4080',
    },
  },
  {
    name: 'Desktop Computers',
    slug: 'desktop-computers',
    description: 'PC builds, office desktops and custom gaming rigs.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used (Like New)', 'Used (Normal)', 'For Repair'],
          type: 'select',
        },
        {
          key: 'pc_type',
          label: 'Form Factor',
          options: ['Full Tower / Tower', 'Gaming Build (Custom)', 'Mini PC / ITX', 'All-in-One (AiO)', 'Mac Studio / Mac Mini', 'Workstation', 'Other'],
          type: 'select',
        },
        {
          key: 'processor',
          label: 'Processor (CPU)',
          placeholder: 'e.g. i7-14700K, Ryzen 7 7800X3D',
          type: 'text',
        },
        {
          key: 'gpu',
          label: 'Graphics (GPU)',
          placeholder: 'e.g. RTX 4070 Ti, Radeon RX 7900 XT',
          type: 'text',
        },
        {
          key: 'ram_gb',
          label: 'RAM (GB)',
          options: ['4', '8', '16', '32', '64', '128', 'Over 128', 'Other'],
          type: 'select',
        },
        {
          key: 'storage',
          label: 'Storage Configuration',
          placeholder: 'e.g. 1TB NVMe + 2TB HDD',
          type: 'text',
        },
        {
          key: 'os',
          label: 'Operating System',
          options: ['Windows 11', 'Windows 10', 'macOS', 'Linux', 'No OS (FreeDOS)', 'Other'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Gaming PC RTX 4090 i9-14900K 64GB DDR5',
    },
  },
  {
    name: 'Monitors & Displays',
    slug: 'monitors',
    description: 'Professional, gaming and daily use screens.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Dead Pixel(s)'],
          type: 'select',
        },
        {
          key: 'screen_size_inch',
          label: 'Size (inch)',
          placeholder: 'e.g. 24", 27", 32", 49"',
          type: 'text',
        },
        {
          key: 'resolution',
          label: 'Resolution',
          options: ['FHD (1920x1080)', 'QHD / 2K (2560x1440)', '4K / UHD (3840x2160)', 'Ultrawide (21:9/32:9)', 'Apple Studio / Pro Display', 'Other'],
          type: 'select',
        },
        {
          key: 'refresh_rate_hz',
          label: 'Refresh Rate (Hz)',
          options: ['60', '75', '144', '165', '240', '360', '500+', 'Other'],
          type: 'select',
        },
        {
          key: 'panel_type',
          label: 'Panel Type',
          options: ['IPS', 'OLED / QD-OLED', 'VA', 'TN', 'Mini-LED', 'Other'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. LG UltraGear 27" 1440p 240Hz OLED',
    },
  },
  {
    name: 'PC Parts & Internal Components',
    slug: 'pc-parts-root',
    description: 'Core components for building or upgrading a PC.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: { fields: [] },
  },
  {
    name: 'Graphics Cards (GPU)',
    slug: 'pc-gpu',
    description: 'Gaming and workstation graphics cards.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'pc-parts-root',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used (Never Mined)', 'Used (Mining History)', 'Refurbished'],
          type: 'select',
        },
        {
          key: 'chipset',
          label: 'GPU Chipset',
          options: [
            'NVIDIA RTX 4090',
            'NVIDIA RTX 4080',
            'NVIDIA RTX 4070',
            'NVIDIA RTX 30 Series',
            'NVIDIA RTX 20 Series',
            'NVIDIA GTX Series',
            'AMD RX 7000 Series',
            'AMD RX 6000 Series',
            'AMD RX 5000 Series',
            'Intel Arc',
            'Quadro / RTX Pro',
            'Legacy / Other',
          ],
          type: 'select',
        },
        {
          key: 'vram_gb',
          label: 'VRAM (GB)',
          options: ['2', '4', '6', '8', '10', '12', '16', '20', '24', 'Over 24', 'Other'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Manufacturer',
          placeholder: 'e.g. ASUS ROG, MSI, Gigabyte, EVGA, Palit',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'Processors (CPU)',
    slug: 'pc-cpu',
    description: 'Central processing units for desktops.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'pc-parts-root',
    template: {
      fields: [
        {
          key: 'brand',
          label: 'Brand',
          options: ['Intel', 'AMD', 'Other'],
          type: 'select',
        },
        {
          key: 'socket',
          label: 'Socket Type',
          options: [
            'Intel LGA 1700',
            'Intel LGA 1200',
            'Intel LGA 1151',
            'AMD AM5',
            'AMD AM4',
            'AMD AM3 / AM3+',
            'Threadripper / Workstation',
            'Other / Legacy',
          ],
          type: 'select',
        },
        {
          key: 'model_name',
          label: 'Model Name',
          placeholder: 'e.g. i9-14900K, Ryzen 9 7950X',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'Motherboards',
    slug: 'pc-motherboards',
    description: 'Foundational circuit boards for PC builds.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'pc-parts-root',
    template: {
      fields: [
        {
          key: 'chipset',
          label: 'Chipset',
          placeholder: 'e.g. Z790, B650, X670E',
          type: 'text',
        },
        {
          key: 'form_factor',
          label: 'Form Factor',
          options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'],
          type: 'select',
        },
        {
          key: 'ram_slots',
          label: 'RAM Type',
          options: ['DDR5', 'DDR4'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'RAM (Memory)',
    slug: 'pc-ram',
    description: 'System memory modules.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'pc-parts-root',
    template: {
      fields: [
        {
          key: 'type',
          label: 'Type',
          options: ['DDR5', 'DDR4', 'DDR3', 'DDR2 / Legacy', 'Laptop (SO-DIMM)', 'Other'],
          type: 'select',
        },
        {
          key: 'capacity_gb',
          label: 'Total Capacity',
          options: ['4GB', '8GB', '16GB', '32GB', '64GB+', 'Single Stick', 'Other'],
          type: 'select',
        },
        {
          key: 'speed_mhz',
          label: 'Speed (MHz)',
          placeholder: 'e.g. 6000MHz, 3600MHz',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'SSD, HDD & Storage',
    slug: 'pc-storage',
    description: 'Solid state drives and hard disks.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'pc-parts-root',
    template: {
      fields: [
        {
          key: 'type',
          label: 'Drive Type',
          options: ['NVMe M.2 SSD', 'SATA SSD (2.5")', 'HDD (3.5" Desktop)', 'HDD (2.5" Laptop)', 'External Drive'],
          type: 'select',
        },
        {
          key: 'capacity',
          label: 'Capacity',
          options: ['256GB', '512GB', '1TB', '2TB', '4TB', '8TB+', 'Other'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Power Supplies (PSU)',
    slug: 'pc-psu',
    description: 'PC power delivery units.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'pc-parts-root',
    template: {
      fields: [
        {
          key: 'wattage',
          label: 'Wattage',
          placeholder: 'e.g. 750W, 850W, 1000W',
          type: 'text',
        },
        {
          key: 'rating',
          label: 'Efficiency Rating',
          options: ['80+ Bronze', '80+ Gold', '80+ Platinum / Titanium', 'Standard'],
          type: 'select',
        },
        {
          key: 'modularity',
          label: 'Modularity',
          options: ['Full Modular', 'Semi Modular', 'Non-Modular'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Cases, Cooling & Fans',
    slug: 'pc-cooling-cases',
    description: 'PC enclosures and thermal management.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'pc-parts-root',
    template: {
      fields: [
        {
          key: 'category',
          label: 'Item Category',
          options: ['PC Case', 'AIO Liquid Cooler', 'Air Cooler', 'Fans (RGB/Standard)', 'Custom Loop Parts'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Peripherals & Accessories',
    slug: 'pc-peripherals',
    description: 'Keyboards, mice, webcams and external gear.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: {
      fields: [
        {
          key: 'type',
          label: 'Peripheral Type',
          options: [
            'Keyboard (Mechanical)',
            'Keyboard (Standard)',
            'Gaming Mouse',
            'Wireless Mouse / Trackpad',
            'Headset / Headphones',
            'Speakers',
            'Webcam',
            'Microphone (Streaming)',
            'Controller / Joystick',
            'Graphics Tablet',
          ],
          type: 'select',
        },
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Printers, Scanners & Office',
    slug: 'pc-office-printers',
    description: 'Printing solutions and office hardware.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: {
      fields: [
        {
          key: 'type',
          label: 'Equipment Type',
          options: ['Laser Printer', 'Inkjet / Tank Printer', '3D Printer', 'Scanner', 'Multi-function (All-in-One)', 'Consumables (Ink/Toner)'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Networking Equipment',
    slug: 'networking',
    description: 'Routers, switches and enterprise networking.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: {
      fields: [
        {
          key: 'category',
          label: 'Category',
          options: ['Wi-Fi 6/7 Routers', 'Pocket / 4G Routers', 'Network Switches', 'Access Points / Mesh', 'NAS (Network Storage)', 'Server Rack Gear'],
          type: 'select',
        },
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Software, Games & Licenses',
    slug: 'pc-software',
    description: 'Operating systems, office suites and video games.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: {
      fields: [
        {
          key: 'type',
          label: 'Software Type',
          options: ['PC Games (Physical/Keys)', 'Operating Systems', 'Office & Productivity', 'Antivirus & Security', 'Professional Design / Engineering'],
          type: 'select',
        },
        {
          key: 'format',
          label: 'Product Format',
          options: ['Digital Key / License', 'Physical Box / Disc', 'Subscription Account'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Servers & Workstations',
    slug: 'pc-servers',
    description: 'Enterprise hardware and professional workstations.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: {
      fields: [
        {
          key: 'type',
          label: 'Type',
          options: ['Rack Server', 'Tower Server', 'Precision Workstation', 'Server Components (Xeon/EPYC)'],
          type: 'select',
        },
      ],
    },
  },
  {
    name: 'Vintage & Retro Computing',
    slug: 'pc-vintage',
    description: 'Collector items, old PC hardware and retro consoles.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: {
      fields: [
        {
          key: 'era',
          label: 'Era / Brand',
          placeholder: 'e.g. Commodore 64, Amiga, IBM PC 5150, Windows 95/98 Era',
          type: 'text',
        },
      ],
    },
  },
  {
    name: 'Other Computer Equipment',
    slug: 'other-computers',
    description: 'Miscellaneous electronics and niche PC gear.',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'computers',
    template: { fields: [] },
  },
  {
    name: 'TV, Audio and Video',
    slug: 'tv-audio-video',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. TV, Audio and Video',
    },
  },
  {
    name: 'TV',
    slug: 'tv',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv-audio-video',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. TV',
    },
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv-audio-video',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Audio',
    },
  },
  {
    name: 'Video and Projectors',
    slug: 'video-projectors',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv-audio-video',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Video and Projectors',
    },
  },
  {
    name: 'Other Audio/Video',
    slug: 'other-tv-audio-video',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv-audio-video',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Audio/Video',
    },
  },
  {
    name: 'Televisions',
    slug: 'televisions',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'e.g. Samsung, LG, Sony',
          type: 'text',
        },
        {
          key: 'screen_size_inch',
          label: 'Screen Size (inch)',
          placeholder: 'Inches',
          type: 'number',
        },
        {
          key: 'resolution',
          label: 'Resolution',
          options: ['HD Ready', 'Full HD', '4K Ultra HD', '8K'],
          type: 'select',
        },
        {
          key: 'screen_type',
          label: 'Screen Type',
          options: ['LED', 'OLED', 'QLED', 'LCD'],
          type: 'select',
        },
        {
          key: 'smart_tv',
          label: 'Smart TV',
          options: ['Yes', 'No'],
          type: 'select',
        },
      ],
      titlePlaceholder: "e.g. Samsung 55' 4K Smart TV",
    },
  },
  {
    name: 'TV-AV Cables',
    slug: 'tv-av-cables',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. TV-AV Cables',
    },
  },
  {
    name: 'TV Antennas and Receivers',
    slug: 'tv-antennas-receivers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. TV Antennas and Receivers',
    },
  },
  {
    name: 'TV Adapters',
    slug: 'tv-adapters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. TV Adapters',
    },
  },
  {
    name: 'Screen Cleaning',
    slug: 'screen-cleaning',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Screen Cleaning',
    },
  },
  {
    name: 'TV Accessories',
    slug: 'tv-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. TV Accessories',
    },
  },
  {
    name: 'TV Mounts',
    slug: 'tv-mounts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. TV Mounts',
    },
  },
  {
    name: 'Remote Controls',
    slug: 'remote-controls',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tv',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Remote Controls',
    },
  },
  {
    name: 'Soundbars',
    slug: 'soundbars',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Samsung',
            'LG',
            'Sony',
            'Bose',
            'JBL',
            'Sonos',
            'Yamaha',
            'Denon',
            'Polk',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'channels',
          label: 'Channels',
          options: [
            '2.0',
            '2.1',
            '3.0',
            '3.1',
            '5.1',
            '7.1',
            'Dolby Atmos (e.g. 3.1.2)',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'power_watts',
          label: 'Power (W)',
          placeholder: 'Watts',
          type: 'number',
        },
        {
          key: 'bluetooth',
          label: 'Bluetooth',
          options: ['Yes', 'No'],
          type: 'select',
        },
        {
          key: 'dolby_atmos',
          label: 'Dolby Atmos',
          options: ['Yes', 'No'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Samsung Q70B 3.1.2ch Soundbar',
    },
  },
  {
    name: 'Headphones and Equipment',
    slug: 'headphones-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Sony',
            'Bose',
            'Sennheiser',
            'Audio-Technica',
            'Jabra',
            'JBL',
            'Apple AirPods',
            'Samsung',
            'Beyerdynamic',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Type',
          options: [
            'Over-Ear',
            'On-Ear',
            'In-Ear (Earbuds)',
            'True Wireless (TWS)',
          ],
          type: 'select',
        },
        {
          key: 'wireless',
          label: 'Wireless',
          options: ['Yes', 'No'],
          type: 'select',
        },
        {
          key: 'noise_cancelling',
          label: 'Active Noise Cancelling',
          options: ['Yes', 'No'],
          type: 'select',
        },
        {
          key: 'color',
          label: 'Color',
          placeholder: 'Color',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Sony WH-1000XM5 Wireless Headphones',
    },
  },
  {
    name: 'Radio Clocks and Thermometers',
    slug: 'radio-clocks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Radio Clocks and Thermometers',
    },
  },
  {
    name: 'Radios',
    slug: 'radios',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Radios',
    },
  },
  {
    name: 'Hi-Fi Systems',
    slug: 'hifi-systems',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Hi-Fi Systems',
    },
  },
  {
    name: 'MP3 Players',
    slug: 'mp3-players',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. MP3 Players',
    },
  },
  {
    name: 'Microphones and Equipment',
    slug: 'microphones',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Microphones and Equipment',
    },
  },
  {
    name: 'Converters',
    slug: 'converters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Converters',
    },
  },
  {
    name: 'Audio Systems',
    slug: 'audio-systems',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Audio Systems',
    },
  },
  {
    name: 'Turntables',
    slug: 'turntables',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Turntables',
    },
  },
  {
    name: 'Dictaphones',
    slug: 'dictaphones',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Dictaphones',
    },
  },
  {
    name: 'CD Players',
    slug: 'cd-players',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. CD Players',
    },
  },
  {
    name: 'Wireless Speakers',
    slug: 'wireless-speakers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wireless Speakers',
    },
  },
  {
    name: 'Speakers and Equipment',
    slug: 'speakers-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Speakers and Equipment',
    },
  },
  {
    name: 'Other Audio Equipment',
    slug: 'other-audio',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'audio',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Audio Equipment',
    },
  },
  {
    name: 'Projectors',
    slug: 'projectors',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'video-projectors',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Projectors',
    },
  },
  {
    name: 'Projector Screens',
    slug: 'projector-screens',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'video-projectors',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Projector Screens',
    },
  },
  {
    name: 'DVD Players',
    slug: 'dvd-players',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'video-projectors',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. DVD Players',
    },
  },
  {
    name: 'Interactive Graphic Tablets',
    slug: 'graphic-tablets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'video-projectors',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Interactive Graphic Tablets',
    },
  },
  {
    name: 'Projector Accessories',
    slug: 'projector-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'video-projectors',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Projector Accessories',
    },
  },
  {
    name: 'Other Video Equipment',
    slug: 'other-video',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'video-projectors',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Video Equipment',
    },
  },
  {
    name: 'Watches and Jewelry',
    slug: 'watches-jewelry',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Watches and Jewelry',
    },
  },
  {
    name: "Men's Watches",
    slug: 'mens-watches',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'watches-jewelry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Rolex',
            'Casio',
            'Seiko',
            'Fossil',
            'Citizen',
            'Tissot',
            'Omega',
            'Tag Heuer',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'movement',
          label: 'Movement',
          options: ['Automatic', 'Quartz', 'Manual', 'Smartwatch'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Casio G-Shock',
    },
  },
  {
    name: "Women's Watches",
    slug: 'womens-watches',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'watches-jewelry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Michael Kors',
            'Casio',
            'Fossil',
            'Swarovski',
            'Guess',
            'DKNY',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'movement',
          label: 'Movement',
          options: ['Automatic', 'Quartz', 'Manual', 'Smartwatch'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Michael Kors Rose Gold Watch',
    },
  },
  {
    name: 'Jewelry',
    slug: 'jewelry',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'watches-jewelry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Rings',
            'Necklaces & Pendants',
            'Earrings',
            'Bracelets',
            'Brooches',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'material',
          label: 'Material',
          options: [
            'Gold',
            'Silver',
            'Platinum',
            'Steel',
            'Costume / Fashion',
            'Other',
          ],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. 14k Gold Necklace',
    },
  },
  {
    name: 'Smartwatches',
    slug: 'smartwatches-jewelry',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'watches-jewelry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Apple',
            'Samsung',
            'Garmin',
            'Xiaomi',
            'Fitbit',
            'Huawei',
            'Amazfit',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'compatibility',
          label: 'Compatibility',
          options: ['iOS', 'Android', 'Both'],
          type: 'select',
        },
        {
          key: 'color',
          label: 'Color',
          placeholder: 'Color',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Apple Watch Series 9 45mm',
    },
  },
  {
    name: 'Other Watch/Jewelry',
    slug: 'other-watches-jewelry',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'watches-jewelry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Watch/Jewelry',
    },
  },
  {
    name: 'Health, Beauty and Equipment',
    slug: 'health-beauty',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Health, Beauty and Equipment',
    },
  },
  {
    name: 'Makeup & Cosmetics',
    slug: 'makeup-cosmetics',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'health-beauty',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New (Sealed)', 'New (Open Box)'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Face',
            'Eyes',
            'Lips',
            'Nails',
            'Sets & Palettes',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. MAC Lipstick Red',
    },
  },
  {
    name: 'Perfumes & Fragrances',
    slug: 'perfumes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'health-beauty',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New (Sealed)', 'New (Open Box)', 'Used'],
          type: 'select',
        },
        {
          key: 'gender',
          label: 'Gender',
          options: ['Women', 'Men', 'Unisex'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'volume_ml',
          label: 'Volume (ml)',
          placeholder: 'ml',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. Chanel No.5 100ml',
    },
  },
  {
    name: 'Hair Care',
    slug: 'hair-care',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'health-beauty',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Shampoo & Conditioner',
            'Treatments & Masks',
            'Styling Products',
            'Hair Dye',
            'Hair Extensions & Wigs',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Kerastase Hair Mask',
    },
  },
  {
    name: 'Skincare',
    slug: 'skincare',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'health-beauty',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Face Cream',
            'Serums & Oils',
            'Cleansers & Toners',
            'Masks',
            'Body Care',
            'Sunscreen',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. La Roche-Posay Sunscreen',
    },
  },
  {
    name: 'Beauty Appliances',
    slug: 'beauty-appliances',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'health-beauty',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Hair Dryers',
            'Straighteners & Curlers',
            'Epilators',
            'Trimmers & Clippers',
            'Facial Tool',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Dyson Airwrap',
    },
  },
  {
    name: 'Medical & Massage Equipment',
    slug: 'medical-massage',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'health-beauty',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Massage Chairs',
            'Handheld Massagers',
            'Blood Pressure Monitors',
            'Thermometers',
            'Mobility Aids',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Omron Blood Pressure Monitor',
    },
  },
  {
    name: 'Other Health/Beauty',
    slug: 'other-health-beauty',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'health-beauty',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Health/Beauty',
    },
  },
  {
    name: 'Books and Literature',
    slug: 'books-literature',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Books and Literature',
    },
  },
  {
    name: 'Fiction',
    slug: 'fiction-books',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'books-literature',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Acceptable'],
          type: 'select',
        },
        {
          key: 'genre',
          label: 'Genre',
          options: [
            'Romance',
            'Thriller & Mystery',
            'Sci-Fi & Fantasy',
            'Historical Fiction',
            'Literature',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'language',
          label: 'Language',
          options: ['Macedonian', 'English', 'Albanian', 'Serbian', 'Other'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Harry Potter by J.K. Rowling',
    },
  },
  {
    name: 'Non-Fiction',
    slug: 'non-fiction-books',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'books-literature',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Acceptable'],
          type: 'select',
        },
        {
          key: 'topic',
          label: 'Topic',
          options: [
            'Biography & Autobiography',
            'History',
            'Self-Help & Psychology',
            'Business & Economics',
            'Cooking',
            'Art & Photography',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'language',
          label: 'Language',
          options: ['Macedonian', 'English', 'Albanian', 'Serbian', 'Other'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Atomic Habits by James Clear',
    },
  },
  {
    name: 'Educational & Textbooks',
    slug: 'textbooks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'books-literature',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Acceptable'],
          type: 'select',
        },
        {
          key: 'level',
          label: 'Education Level',
          options: [
            'Primary School',
            'High School',
            'University',
            'Language Learning',
            'Professional Certification',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'subject',
          label: 'Subject',
          placeholder: 'e.g. Math, Programming, Medical',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. High School Math Textbook',
    },
  },
  {
    name: "Children's Books",
    slug: 'childrens-books',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'books-literature',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Acceptable'],
          type: 'select',
        },
        {
          key: 'age_group',
          label: 'Age Group',
          options: [
            '0-3 Years',
            '3-5 Years',
            '6-8 Years',
            '9-12 Years',
            'Teens',
          ],
          type: 'select',
        },
        {
          key: 'language',
          label: 'Language',
          options: ['Macedonian', 'English', 'Albanian', 'Serbian', 'Other'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Peppa Pig Storybook',
    },
  },
  {
    name: 'Magazines & Comics',
    slug: 'magazines-comics',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'books-literature',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Acceptable'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Comics / Manga',
            'Magazines',
            'Journals',
            'Newspapers',
            'Other',
          ],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Spider-Man Comic 1999',
    },
  },
  {
    name: 'Other Books/Literature',
    slug: 'other-books-literature',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'books-literature',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Books/Literature',
    },
  },
  {
    name: 'Office and School Supplies',
    slug: 'office-school-supplies',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Office and School Supplies',
    },
  },
  {
    name: 'Office Supplies',
    slug: 'office-supplies-cat',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'office-school-supplies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Paper & Notebooks',
            'Archiving & Folders',
            'Desk Accessories',
            'Markers & Pens',
            'Envelopes & Shipping',
            'Other',
          ],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. A4 Printer Paper 500 sheets',
    },
  },
  {
    name: 'School Supplies',
    slug: 'school-supplies',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'office-school-supplies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Backpacks & Bags',
            'Pencil Cases',
            'Notebooks & Diaries',
            'Drawing & Art Supplies',
            'Geometry Sets',
            'Other',
          ],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Anatomical School Backpack',
    },
  },
  {
    name: 'Printers, Ink & Toner',
    slug: 'printers-ink',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'office-school-supplies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Printers',
            'Scanners',
            'Ink Cartridges',
            'Toner Cartridges',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'HP',
            'Canon',
            'Epson',
            'Brother',
            'Samsung',
            'Lexmark',
            'Other',
          ],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. HP LaserJet Pro M15w',
    },
  },
  {
    name: 'Calculators & Electronics',
    slug: 'office-electronics',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'office-school-supplies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Scientific Calculators',
            'Basic Calculators',
            'Laminators',
            'Paper Shredders',
            'Binding Machines',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Casio Scientific Calculator',
    },
  },
  {
    name: 'Other Office/School',
    slug: 'other-office-school',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'office-school-supplies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Office/School',
    },
  },
  {
    name: 'Do It Yourself',
    slug: 'do-it-yourself',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Do It Yourself (DIY)',
    },
  },
  {
    name: 'Cordless Tools',
    slug: 'cordless-tools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Tools',
    },
  },
  {
    name: 'Garden Tools',
    slug: 'garden-tools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Garden Tools',
    },
  },
  {
    name: 'Electric Tools',
    slug: 'electric-tools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Electric Tools',
    },
  },
  {
    name: 'Hand Tools',
    slug: 'hand-tools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Hand Tools',
    },
  },
  {
    name: 'Painting & Ceramics',
    slug: 'painting-ceramics',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Painting & Ceramics',
    },
  },
  {
    name: 'Paints & Varnishes',
    slug: 'paints-varnishes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Paints & Varnishes',
    },
  },
  {
    name: 'Protective Equipment (PPE)',
    slug: 'protective-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Protective Equipment (PPE)',
    },
  },
  {
    name: 'Technical Chemistry',
    slug: 'technical-chemistry',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Technical Chemistry',
    },
  },
  {
    name: 'Tool Accessories',
    slug: 'tool-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tool Accessories',
    },
  },
  {
    name: 'Machines & Pneumatics',
    slug: 'machines-pneumatics',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Machines & Pneumatics',
    },
  },
  {
    name: 'Measuring Tools',
    slug: 'measuring-tools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Measuring Tools',
    },
  },
  {
    name: 'Tapes & Ropes',
    slug: 'tapes-ropes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tapes & Ropes',
    },
  },
  {
    name: 'Metal Hardware',
    slug: 'metal-hardware',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Metal Hardware',
    },
  },
  {
    name: 'Electrical Materials',
    slug: 'electrical-materials',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Electrical Materials',
    },
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Plumbing',
    },
  },
  {
    name: 'Construction Materials',
    slug: 'construction-materials',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Construction Materials',
    },
  },
  {
    name: 'Tiling Program',
    slug: 'tiling-program',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tiling Program',
    },
  },
  {
    name: 'Agricultural Machines',
    slug: 'agricultural-machines',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'napravete-sami',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Agricultural Machines',
    },
  },
  {
    name: 'Cordless Drills & Drivers',
    slug: 'cordless-drills',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Drills & Drivers',
    },
  },
  {
    name: 'Cordless Rotary Hammers',
    slug: 'cordless-rotary-hammers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Rotary Hammers',
    },
  },
  {
    name: 'Cordless Grinders',
    slug: 'cordless-grinders',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Grinders',
    },
  },
  {
    name: 'Cordless Impact Drivers',
    slug: 'cordless-impact-drivers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Impact Drivers',
    },
  },
  {
    name: 'Cordless Saws',
    slug: 'cordless-saws',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Saws',
    },
  },
  {
    name: 'Cordless Routers & Planers',
    slug: 'cordless-routers-planers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Routers & Planers',
    },
  },
  {
    name: 'Cordless Renovators & Multitools',
    slug: 'cordless-multitools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Renovators & Multitools',
    },
  },
  {
    name: 'Cordless Industrial Vacuums',
    slug: 'cordless-vacuums',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Industrial Vacuums',
    },
  },
  {
    name: 'Cordless Tool Sets',
    slug: 'cordless-tool-sets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cordless Tool Sets',
    },
  },
  {
    name: 'Batteries & Chargers',
    slug: 'cordless-batteries-chargers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Batteries & Chargers',
    },
  },
  {
    name: 'Other Cordless Tools',
    slug: 'cordless-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'cordless-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Cordless Tools',
    },
  },
  {
    name: 'Lawn Mowers',
    slug: 'garden-mowers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Lawn Mowers',
    },
  },
  {
    name: 'Grass Trimmers',
    slug: 'garden-trimmers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Grass Trimmers',
    },
  },
  {
    name: 'Pressure Washers',
    slug: 'garden-pressure-washers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Pressure Washers',
    },
  },
  {
    name: 'Garden Hand Tools',
    slug: 'garden-hand-tools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Garden Hand Tools',
    },
  },
  {
    name: 'Watering & Irrigation',
    slug: 'garden-watering',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Watering & Irrigation',
    },
  },
  {
    name: 'Chainsaws',
    slug: 'garden-chainsaws',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Chainsaws',
    },
  },
  {
    name: 'Water Pumps',
    slug: 'garden-pumps',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Water Pumps',
    },
  },
  {
    name: 'Leaf Blowers & Vacuums',
    slug: 'garden-blowers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Leaf Blowers & Vacuums',
    },
  },
  {
    name: 'Earth Augers',
    slug: 'garden-augers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Earth Augers',
    },
  },
  {
    name: 'Planting & Care',
    slug: 'garden-planting',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Planting & Care',
    },
  },
  {
    name: 'Nets & Foils',
    slug: 'garden-nets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Nets & Foils',
    },
  },
  {
    name: 'Other Garden Tools',
    slug: 'garden-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'garden-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Garden Tools',
    },
  },
  {
    name: 'Electric Drills & Drivers',
    slug: 'electric-drills',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Electric Drills & Drivers',
    },
  },
  {
    name: 'Electric Rotary Hammers',
    slug: 'electric-rotary-hammers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Electric Rotary Hammers',
    },
  },
  {
    name: 'Electric Saws',
    slug: 'electric-saws',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Electric Saws',
    },
  },
  {
    name: 'Electric Grinders',
    slug: 'electric-grinders',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Electric Grinders',
    },
  },
  {
    name: 'Electric Planers & Routers',
    slug: 'electric-planers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Electric Planers & Routers',
    },
  },
  {
    name: 'Renovators - Multitools',
    slug: 'electric-multitools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Renovators - Multitools',
    },
  },
  {
    name: 'Industrial Vacuums',
    slug: 'electric-vacuums',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Industrial Vacuums',
    },
  },
  {
    name: 'Heat Guns',
    slug: 'electric-heat-guns',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Heat Guns',
    },
  },
  {
    name: 'Staplers & Nailers',
    slug: 'electric-staplers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Staplers & Nailers',
    },
  },
  {
    name: 'Wall Chasers',
    slug: 'electric-wall-chasers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wall Chasers',
    },
  },
  {
    name: 'Mixers for Construction Materials',
    slug: 'electric-mixers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Mixers for Construction Materials',
    },
  },
  {
    name: 'Sheet Metal Shears',
    slug: 'electric-shears',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Sheet Metal Shears',
    },
  },
  {
    name: 'Glue Guns',
    slug: 'electric-glue-guns',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Glue Guns',
    },
  },
  {
    name: 'Electric Tool Accessories',
    slug: 'electric-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Electric Tool Accessories',
    },
  },
  {
    name: 'Routers',
    slug: 'electric-routers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Routers',
    },
  },
  {
    name: 'Other Electric Tools',
    slug: 'electric-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electric-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Electric Tools',
    },
  },
  {
    name: 'Pliers',
    slug: 'hand-pliers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Pliers',
    },
  },
  {
    name: 'Wrenches & Spanners',
    slug: 'hand-wrenches',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wrenches & Spanners',
    },
  },
  {
    name: 'Screwdrivers',
    slug: 'hand-screwdrivers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Screwdrivers',
    },
  },
  {
    name: 'Tool Sets',
    slug: 'hand-tool-sets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tool Sets',
    },
  },
  {
    name: 'Cutters & Utility Knives',
    slug: 'hand-cutters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cutters & Utility Knives',
    },
  },
  {
    name: 'Tool Storage & Organization',
    slug: 'hand-storage',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tool Storage & Organization',
    },
  },
  {
    name: 'Saws & Hacksaws',
    slug: 'hand-saws',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Saws & Hacksaws',
    },
  },
  {
    name: 'Hammers & Mallets',
    slug: 'hand-hammers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Hammers & Mallets',
    },
  },
  {
    name: 'Wire Brushes & Files',
    slug: 'hand-brushes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wire Brushes & Files',
    },
  },
  {
    name: 'Clamps & Vices',
    slug: 'hand-clamps',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Clamps & Vices',
    },
  },
  {
    name: 'Chisels & Crowbars',
    slug: 'hand-chisels',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Chisels & Crowbars',
    },
  },
  {
    name: 'Marking Tools',
    slug: 'hand-marking',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Marking Tools',
    },
  },
  {
    name: 'Hand Staplers',
    slug: 'hand-staplers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Hand Staplers',
    },
  },
  {
    name: 'Automotive Tools',
    slug: 'hand-automotive',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Automotive Tools',
    },
  },
  {
    name: 'Shears & Bolt Cutters',
    slug: 'hand-shears',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Shears & Bolt Cutters',
    },
  },
  {
    name: 'Other Hand Tools',
    slug: 'hand-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'hand-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Hand Tools',
    },
  },
  {
    name: 'Paint Brushes',
    slug: 'painting-brushes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Paint Brushes',
    },
  },
  {
    name: 'Paint Rollers',
    slug: 'painting-rollers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Paint Rollers',
    },
  },
  {
    name: 'Foils & Protection',
    slug: 'painting-foil',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Foils & Protection',
    },
  },
  {
    name: 'Trowels',
    slug: 'painting-trowels',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Trowels',
    },
  },
  {
    name: 'Spatulas',
    slug: 'painting-spatulas',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Spatulas',
    },
  },
  {
    name: 'Ladles & Trowels',
    slug: 'painting-ladles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Ladles & Trowels',
    },
  },
  {
    name: 'Mixers',
    slug: 'painting-mixers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Mixers',
    },
  },
  {
    name: 'Silicone & Foam Guns',
    slug: 'painting-guns',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Silicone & Foam Guns',
    },
  },
  {
    name: 'Telescopic Poles',
    slug: 'painting-telescopic',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Telescopic Poles',
    },
  },
  {
    name: 'Ceramic Tools',
    slug: 'ceramics-tools',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Ceramic Tools',
    },
  },
  {
    name: 'Tile Cutters',
    slug: 'ceramics-cutters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tile Cutters',
    },
  },
  {
    name: 'Ladders, Scaffolding & Platforms',
    slug: 'painting-ladders',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Ladders, Scaffolding & Platforms',
    },
  },
  {
    name: 'Sanders & Abrasives',
    slug: 'painting-sanders',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Sanders & Abrasives',
    },
  },
  {
    name: 'Buckets & Trays',
    slug: 'painting-buckets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Buckets & Trays',
    },
  },
  {
    name: 'Cleaning Brushes',
    slug: 'painting-cleaning',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cleaning Brushes',
    },
  },
  {
    name: 'Silicone Guns',
    slug: 'painting-silicone-guns',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Silicone Guns',
    },
  },
  {
    name: 'Large Brushes',
    slug: 'painting-brushes-large',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Large Brushes',
    },
  },
  {
    name: 'Other Painting Tools',
    slug: 'painting-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'painting-ceramics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Painting Tools',
    },
  },
  {
    name: 'Wall Paints',
    slug: 'paints-wall',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'paints-varnishes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wall Paints',
    },
  },
  {
    name: 'Metal Paints',
    slug: 'paints-metal',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'paints-varnishes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Metal Paints',
    },
  },
  {
    name: 'Concrete & Stone Paints',
    slug: 'paints-concrete',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'paints-varnishes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Concrete & Stone Paints',
    },
  },
  {
    name: 'Wood Varnishes',
    slug: 'paints-wood',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'paints-varnishes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Wood Varnishes',
    },
  },
  {
    name: 'Spray Paints',
    slug: 'paints-sprays',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'paints-varnishes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Spray Paints',
    },
  },
  {
    name: 'Safety Shoes',
    slug: 'protective-shoes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Safety Shoes',
    },
  },
  {
    name: 'Protective Clothing',
    slug: 'protective-clothing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Protective Clothing',
    },
  },
  {
    name: 'Protective Gloves',
    slug: 'protective-gloves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Protective Gloves',
    },
  },
  {
    name: 'Protective Masks',
    slug: 'protective-masks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Protective Masks',
    },
  },
  {
    name: 'Safety Glasses',
    slug: 'protective-glasses',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Safety Glasses',
    },
  },
  {
    name: 'Helmets & Visors',
    slug: 'protective-helmets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Helmets & Visors',
    },
  },
  {
    name: 'Hearing Protection',
    slug: 'protective-hearing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Hearing Protection',
    },
  },
  {
    name: 'Welding Masks',
    slug: 'protective-welding',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Welding Masks',
    },
  },
  {
    name: 'Knee Pads',
    slug: 'protective-knee',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Knee Pads',
    },
  },
  {
    name: 'Other PPE',
    slug: 'protective-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'protective-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other PPE',
    },
  },
  {
    name: 'Construction Silicone',
    slug: 'chem-silicone',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'technical-chemistry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Construction Silicone',
    },
  },
  {
    name: 'PU Foam',
    slug: 'chem-foam',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'technical-chemistry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. PU Foam',
    },
  },
  {
    name: 'Adhesives & Putty',
    slug: 'chem-adhesives',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'technical-chemistry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Adhesives & Putty',
    },
  },
  {
    name: 'Technical Sprays',
    slug: 'chem-sprays',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'technical-chemistry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Technical Sprays',
    },
  },
  {
    name: 'Thermo & Fluoro Sprays',
    slug: 'chem-thermo-sprays',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'technical-chemistry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Thermo & Fluoro Sprays',
    },
  },
  {
    name: 'Other Technical Chemistry',
    slug: 'chem-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'technical-chemistry',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Technical Chemistry',
    },
  },
  {
    name: 'Bits & Bit Holders',
    slug: 'acc-bits',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Bits & Bit Holders',
    },
  },
  {
    name: 'Grinding & Cutting Accessories',
    slug: 'acc-grinding',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Grinding & Cutting Accessories',
    },
  },
  {
    name: 'Drills, Chisels & Points',
    slug: 'acc-drills',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Drills, Chisels & Points',
    },
  },
  {
    name: 'Saw Blades',
    slug: 'acc-blades',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Saw Blades',
    },
  },
  {
    name: 'Milling & Grooving',
    slug: 'acc-milling',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Milling & Grooving',
    },
  },
  {
    name: 'Hole Saws & Adapters',
    slug: 'acc-crowns',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Hole Saws & Adapters',
    },
  },
  {
    name: 'Staples & Nails',
    slug: 'acc-staples',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Staples & Nails',
    },
  },
  {
    name: 'Chucks & Accessories',
    slug: 'acc-chucks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Chucks & Accessories',
    },
  },
  {
    name: 'Grinder Accessories',
    slug: 'acc-grinder-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Grinder Accessories',
    },
  },
  {
    name: 'Heat Gun Accessories',
    slug: 'acc-heat-gun-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Heat Gun Accessories',
    },
  },
  {
    name: 'Planer Accessories',
    slug: 'acc-planer-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Planer Accessories',
    },
  },
  {
    name: 'Pressure Washer Accessories',
    slug: 'acc-washer-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Pressure Washer Accessories',
    },
  },
  {
    name: 'Multitool Accessories',
    slug: 'acc-multitool-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Multitool Accessories',
    },
  },
  {
    name: 'Welding & Soldering Accessories',
    slug: 'acc-welding',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Welding & Soldering Accessories',
    },
  },
  {
    name: 'Misc Tools & storage',
    slug: 'acc-misc',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Misc Tools & storage',
    },
  },
  {
    name: 'Other Machine Accessories',
    slug: 'acc-machine-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tool-accessories',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Machine Accessories',
    },
  },
  {
    name: 'Log Splitters',
    slug: 'mach-splitters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Log Splitters',
    },
  },
  {
    name: 'Air Compressors',
    slug: 'mach-compressors',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Air Compressors',
    },
  },
  {
    name: 'Power Generators',
    slug: 'mach-generators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Power Generators',
    },
  },
  {
    name: 'Welding Machines',
    slug: 'mach-welders',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Welding Machines',
    },
  },
  {
    name: 'Hoists & Winches',
    slug: 'mach-lifts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Hoists & Winches',
    },
  },
  {
    name: 'Hydraulic Presses',
    slug: 'mach-presses',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Hydraulic Presses',
    },
  },
  {
    name: 'Soldering Irons',
    slug: 'mach-soldering',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Soldering Irons',
    },
  },
  {
    name: 'Trolleys & Carts',
    slug: 'mach-trolleys',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Trolleys & Carts',
    },
  },
  {
    name: 'Pneumatic Tools',
    slug: 'mach-pneumatic',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Pneumatic Tools',
    },
  },
  {
    name: 'Floor Cleaning Machines',
    slug: 'mach-cleaning',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Floor Cleaning Machines',
    },
  },
  {
    name: 'Pipe Welders',
    slug: 'mach-pipe-welders',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Pipe Welders',
    },
  },
  {
    name: 'Forklifts & Pallet Jacks',
    slug: 'mach-forklifts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Forklifts & Pallet Jacks',
    },
  },
  {
    name: 'Pneumatic Guns',
    slug: 'mach-pneumatic-guns',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Pneumatic Guns',
    },
  },
  {
    name: 'Other Machines',
    slug: 'mach-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'machines-pneumatics',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Machines',
    },
  },
  {
    name: 'Construction Lasers',
    slug: 'meas-lasers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Construction Lasers',
    },
  },
  {
    name: 'Detectors',
    slug: 'meas-detectors',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Detectors',
    },
  },
  {
    name: 'Measuring Tapes',
    slug: 'meas-tapes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Measuring Tapes',
    },
  },
  {
    name: 'Levels',
    slug: 'meas-levels',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Levels',
    },
  },
  {
    name: 'Rulers & Squares',
    slug: 'meas-rulers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Rulers & Squares',
    },
  },
  {
    name: 'Protractors & Compasses',
    slug: 'meas-protractors',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Protractors & Compasses',
    },
  },
  {
    name: 'Micrometers',
    slug: 'meas-micrometers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Micrometers',
    },
  },
  {
    name: 'Multimeters & Testers',
    slug: 'meas-multimeters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Multimeters & Testers',
    },
  },
  {
    name: 'Calipers',
    slug: 'meas-calipers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Calipers',
    },
  },
  {
    name: 'Thermal & Inspection Cameras',
    slug: 'meas-cameras',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Thermal & Inspection Cameras',
    },
  },
  {
    name: 'Tripods & Accessories',
    slug: 'meas-tripods',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tripods & Accessories',
    },
  },
  {
    name: 'Other Measuring Tools',
    slug: 'meas-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'measuring-tools',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Measuring Tools',
    },
  },
  {
    name: 'Masking Tape',
    slug: 'tape-crepe',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tapes-ropes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Masking Tape',
    },
  },
  {
    name: 'Insulation Tape',
    slug: 'tape-insulation',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tapes-ropes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Insulation Tape',
    },
  },
  {
    name: 'Scotch Tape',
    slug: 'tape-scoth',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tapes-ropes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Scotch Tape',
    },
  },
  {
    name: 'Double-sided Tape',
    slug: 'tape-double',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tapes-ropes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Double-sided Tape',
    },
  },
  {
    name: 'Sealing Tape',
    slug: 'tape-sealing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tapes-ropes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Sealing Tape',
    },
  },
  {
    name: 'Banding Tape',
    slug: 'tape-banding',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tapes-ropes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Banding Tape',
    },
  },
  {
    name: 'Ropes',
    slug: 'tape-ropes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tapes-ropes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Ropes',
    },
  },
  {
    name: 'Other Tapes & Ropes',
    slug: 'tape-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tapes-ropes',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Tapes & Ropes',
    },
  },
  {
    name: 'Screws & Bolts',
    slug: 'metal-screws',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Screws & Bolts',
    },
  },
  {
    name: 'Nails',
    slug: 'metal-nails',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Nails',
    },
  },
  {
    name: 'Dowels',
    slug: 'metal-dowels',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Dowels',
    },
  },
  {
    name: 'Small Hardware',
    slug: 'metal-small',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Small Hardware',
    },
  },
  {
    name: 'Chains & Cables',
    slug: 'metal-chains',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Chains & Cables',
    },
  },
  {
    name: 'Locks & Handles',
    slug: 'metal-locks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Locks & Handles',
    },
  },
  {
    name: 'Metal Cabinets & Safes',
    slug: 'metal-safes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Metal Cabinets & Safes',
    },
  },
  {
    name: 'Padlocks',
    slug: 'metal-padlocks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Padlocks',
    },
  },
  {
    name: 'Furniture Hardware',
    slug: 'metal-furniture',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Furniture Hardware',
    },
  },
  {
    name: 'Shelf Brackets',
    slug: 'metal-brackets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Shelf Brackets',
    },
  },
  {
    name: 'Other Metal Hardware',
    slug: 'metal-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'metal-hardware',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Metal Hardware',
    },
  },
  {
    name: 'Extension Cords & Splitters',
    slug: 'elec-cables',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Extension Cords & Splitters',
    },
  },
  {
    name: 'Batteries & Chargers',
    slug: 'elec-batteries',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Batteries & Chargers',
    },
  },
  {
    name: 'Switches',
    slug: 'elec-switches',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Switches',
    },
  },
  {
    name: 'Sockets',
    slug: 'elec-sockets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Sockets',
    },
  },
  {
    name: 'Plugs',
    slug: 'elec-plugs',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Plugs',
    },
  },
  {
    name: 'Modular Hardware',
    slug: 'elec-modular',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Modular Hardware',
    },
  },
  {
    name: 'Junction Boxes',
    slug: 'elec-boxes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Junction Boxes',
    },
  },
  {
    name: 'Distribution Panels',
    slug: 'elec-panels',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Distribution Panels',
    },
  },
  {
    name: 'Circuit Breakers',
    slug: 'elec-breakers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Circuit Breakers',
    },
  },
  {
    name: 'Cable Carriers',
    slug: 'elec-carriers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cable Carriers',
    },
  },
  {
    name: 'Other Cables',
    slug: 'elec-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'electrical-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Cables',
    },
  },
  {
    name: 'Valves & Regulators',
    slug: 'plumbing-valves',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'plumbing',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Valves & Regulators',
    },
  },
  {
    name: 'Siphons & Drains',
    slug: 'plumbing-drains',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'plumbing',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Siphons & Drains',
    },
  },
  {
    name: 'Parts & Accessories',
    slug: 'plumbing-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'plumbing',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Parts & Accessories',
    },
  },
  {
    name: 'Building Materials',
    slug: 'const-building',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'construction-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Building Materials',
    },
  },
  {
    name: 'Flooring & Wall Coverings',
    slug: 'const-flooring',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'construction-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Flooring & Wall Coverings',
    },
  },
  {
    name: 'Insulation',
    slug: 'const-insulation',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'construction-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Insulation',
    },
  },
  {
    name: 'Drainage',
    slug: 'const-drainage',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'construction-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Drainage',
    },
  },
  {
    name: 'Construction Equipment',
    slug: 'const-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'construction-materials',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Construction Equipment',
    },
  },
  {
    name: 'Tile Spacers',
    slug: 'tiling-spacers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'tiling-program',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tile Spacers',
    },
  },
  {
    name: 'Cultivators & Tillers',
    slug: 'agri-cultivators',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-machines',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Cultivators & Tillers',
    },
  },
  {
    name: 'Storage & Transport Equipment',
    slug: 'agri-storage',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-machines',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Storage & Transport Equipment',
    },
  },
  {
    name: 'Other Agricultural Machines',
    slug: 'agri-other',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-machines',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Agricultural Machines',
    },
  },
  {
    name: 'Fashion & Clothing',
    slug: 'fashion-clothing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: [
            'New with Tags',
            'New without Tags',
            'Like New',
            'Good',
            'Used',
          ],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Fashion Item',
    },
  },
  {
    name: "Women's Clothing",
    slug: 'womens-clothing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'fashion-clothing',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: [
            'New with Tags',
            'New without Tags',
            'Like New',
            'Good',
            'Used',
          ],
          type: 'select',
        },
        {
          key: 'clothing_type',
          label: 'Type',
          options: [
            'Dress',
            'Blouse',
            'Skirt',
            'Pants',
            'Jeans',
            'Jacket',
            'Coat',
            'Sweater',
            'T-Shirt',
            'Lingerie',
            'Swimwear',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'size',
          label: 'Size',
          options: [
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL',
            'XXXL',
            '34',
            '36',
            '38',
            '40',
            '42',
            '44',
            '46',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'color',
          label: 'Color',
          placeholder: 'Color',
          type: 'text',
        },
        {
          key: 'material',
          label: 'Material',
          placeholder: 'e.g. Cotton, Polyester',
          type: 'text',
        },
      ],
      titlePlaceholder: "e.g. Women's Summer Dress Size M",
    },
  },
  {
    name: "Men's Clothing",
    slug: 'mens-clothing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'fashion-clothing',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: [
            'New with Tags',
            'New without Tags',
            'Like New',
            'Good',
            'Used',
          ],
          type: 'select',
        },
        {
          key: 'clothing_type',
          label: 'Type',
          options: [
            'Shirt',
            'T-Shirt',
            'Pants',
            'Jeans',
            'Jacket',
            'Coat',
            'Suit',
            'Sweater',
            'Shorts',
            'Sportswear',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'size',
          label: 'Size',
          options: [
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL',
            'XXXL',
            '44',
            '46',
            '48',
            '50',
            '52',
            '54',
            '56',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'color',
          label: 'Color',
          placeholder: 'Color',
          type: 'text',
        },
      ],
      titlePlaceholder: "e.g. Men's Levi's Jeans Size 32",
    },
  },
  {
    name: "Children's Clothing",
    slug: 'childrens-clothing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'fashion-clothing',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: [
            'New with Tags',
            'New without Tags',
            'Like New',
            'Good',
            'Used',
          ],
          type: 'select',
        },
        {
          key: 'age_range',
          label: 'Age Range',
          options: [
            '0-3 months',
            '3-6 months',
            '6-12 months',
            '1-2 years',
            '2-3 years',
            '3-4 years',
            '4-5 years',
            '5-6 years',
            '6-8 years',
            '8-10 years',
            '10-12 years',
            '12-14 years',
            '14-16 years',
          ],
          type: 'select',
        },
        {
          key: 'gender',
          label: 'Gender',
          options: ['Boy', 'Girl', 'Unisex'],
          type: 'select',
        },
        {
          key: 'clothing_type',
          label: 'Type',
          options: [
            'Set',
            'Top',
            'Pants',
            'Dress',
            'Jacket',
            'Pajamas',
            'Shoes',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Baby Winter Set 0-3 months',
    },
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'fashion-clothing',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Used'],
          type: 'select',
        },
        {
          key: 'shoe_type',
          label: 'Type',
          options: [
            'Sneakers',
            'Boots',
            'Heels',
            'Sandals',
            'Loafers',
            'Sports',
            'Formal',
            'Slippers',
            'Kids',
          ],
          type: 'select',
        },
        {
          key: 'gender',
          label: 'For',
          options: ['Men', 'Women', 'Unisex', 'Kids'],
          type: 'select',
        },
        {
          key: 'size_eu',
          label: 'EU Size',
          placeholder: 'EU Size',
          type: 'number',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'color',
          label: 'Color',
          placeholder: 'Color',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Nike Air Max Size 42',
    },
  },
  {
    name: 'Bags & Accessories',
    slug: 'bags-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'fashion-clothing',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Handbag',
            'Backpack',
            'Wallet',
            'Belt',
            'Scarf',
            'Hat',
            'Sunglasses',
            'Jewelry',
            'Watch',
            'Luggage',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'color',
          label: 'Color',
          placeholder: 'Color',
          type: 'text',
        },
        {
          key: 'material',
          label: 'Material',
          options: [
            'Leather',
            'Faux Leather',
            'Fabric',
            'Canvas',
            'Nylon',
            'Other',
          ],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Leather Handbag Black',
    },
  },
  {
    name: 'Sports & Hobbies',
    slug: 'sports-hobbies',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Used'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Sports Item',
    },
  },
  {
    name: 'Bicycles',
    slug: 'bicycles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'sports-hobbies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Used'],
          type: 'select',
        },
        {
          key: 'bike_type',
          label: 'Type',
          options: [
            'Mountain Bike',
            'Road Bike',
            'City Bike',
            'E-Bike',
            'BMX',
            'Kids Bike',
            'Folding Bike',
            'Gravel Bike',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Trek',
            'Giant',
            'Specialized',
            'Cannondale',
            'Scott',
            'Cube',
            'Merida',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'wheel_size_inch',
          label: 'Wheel Size (inch)',
          options: ['12', '14', '16', '20', '24', '26', '27.5', '29'],
          type: 'select',
        },
        {
          key: 'frame_size_cm',
          label: 'Frame Size (cm)',
          placeholder: 'cm',
          type: 'number',
        },
        {
          key: 'gears',
          label: 'Number of Gears',
          placeholder: 'Gears',
          type: 'number',
        },
        {
          key: 'color',
          label: 'Color',
          placeholder: 'Color',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Trek Mountain Bike 29"',
    },
  },
  {
    name: 'Fitness Equipment',
    slug: 'fitness-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'sports-hobbies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Used'],
          type: 'select',
        },
        {
          key: 'equipment_type',
          label: 'Type',
          options: [
            'Treadmill',
            'Exercise Bike',
            'Rowing Machine',
            'Elliptical',
            'Home Gym',
            'Weights/Dumbbells',
            'Barbell Set',
            'Pull-up Bar',
            'Yoga Mat',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'max_user_weight_kg',
          label: 'Max User Weight (kg)',
          placeholder: 'kg',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. Home Treadmill 150kg Max',
    },
  },
  {
    name: 'Fishing',
    slug: 'fishing',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'sports-hobbies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Fishing Rod',
            'Reel',
            'Complete Set',
            'Bait & Lures',
            'Fishing Clothing',
            'Tackle Box',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'e.g. Shimano, Daiwa, Penn',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Shimano Spinning Rod + Reel Set',
    },
  },
  {
    name: 'Winter Sports',
    slug: 'winter-sports',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'sports-hobbies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Skis + Bindings',
            'Ski Boots',
            'Ski Helmet',
            'Ski Clothing',
            'Snowboard',
            'Snowboard Boots',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'size',
          label: 'Size / Length',
          placeholder: 'Size or cm',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Atomic Ski Set 160cm Adult',
    },
  },
  {
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'sports-hobbies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Good', 'Used', 'Needs Repair'],
          type: 'select',
        },
        {
          key: 'instrument_type',
          label: 'Instrument',
          options: [
            'Guitar (Acoustic)',
            'Guitar (Electric)',
            'Bass Guitar',
            'Piano / Keyboard',
            'Drums',
            'Violin',
            'Saxophone',
            'Trumpet',
            'Flute',
            'DJ Equipment',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Yamaha Acoustic Guitar',
    },
  },
  {
    name: 'Collecting & Antiques',
    slug: 'collecting-antiques',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'sports-hobbies',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['Mint', 'Excellent', 'Good', 'Fair', 'Poor'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Coins',
            'Stamps',
            'Banknotes',
            'Cards',
            'Miniatures',
            'Toys',
            'Antique Furniture',
            'Art',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'era',
          label: 'Era / Period',
          placeholder: 'e.g. 1950s, Ottoman, WWI',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Yugoslav Dinar Coin Collection',
    },
  },
  {
    name: 'Animals & Pets',
    slug: 'animals-pets',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Animal or Pet Item',
    },
  },
  {
    name: 'Dogs',
    slug: 'dogs',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'animals-pets',
    template: {
      fields: [
        {
          key: 'ad_type',
          label: 'Ad Type',
          options: [
            'For Sale',
            'Free to Good Home',
            'Looking for Dog',
            'Stud Service',
          ],
          type: 'select',
        },
        {
          key: 'breed',
          label: 'Breed',
          placeholder: 'e.g. German Shepherd, Labrador',
          type: 'text',
        },
        {
          key: 'age',
          label: 'Age',
          options: [
            'Puppy (under 1 year)',
            '1-3 years',
            '3-7 years',
            '7+ years',
          ],
          type: 'select',
        },
        {
          key: 'gender',
          label: 'Gender',
          options: ['Male', 'Female'],
          type: 'select',
        },
        {
          key: 'vaccinated',
          label: 'Vaccinated',
          options: ['Yes', 'No', 'Partially'],
          type: 'select',
        },
        {
          key: 'microchipped',
          label: 'Microchipped',
          options: ['Yes', 'No'],
          type: 'select',
        },
        {
          key: 'pedigree',
          label: 'Pedigree',
          options: ['Yes (with papers)', 'No'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. German Shepherd Puppy 2 months',
    },
  },
  {
    name: 'Cats',
    slug: 'cats',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'animals-pets',
    template: {
      fields: [
        {
          key: 'ad_type',
          label: 'Ad Type',
          options: ['For Sale', 'Free to Good Home', 'Looking for Cat'],
          type: 'select',
        },
        {
          key: 'breed',
          label: 'Breed',
          placeholder: 'e.g. Persian, Maine Coon, Domestic',
          type: 'text',
        },
        {
          key: 'age',
          label: 'Age',
          options: [
            'Kitten (under 6 months)',
            '6-12 months',
            '1-3 years',
            '3+ years',
          ],
          type: 'select',
        },
        {
          key: 'gender',
          label: 'Gender',
          options: ['Male', 'Female'],
          type: 'select',
        },
        {
          key: 'vaccinated',
          label: 'Vaccinated',
          options: ['Yes', 'No', 'Partially'],
          type: 'select',
        },
        {
          key: 'pedigree',
          label: 'Pedigree',
          options: ['Yes (with papers)', 'No'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Maine Coon Kitten 3 months',
    },
  },
  {
    name: 'Birds',
    slug: 'birds',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'animals-pets',
    template: {
      fields: [
        {
          key: 'ad_type',
          label: 'Ad Type',
          options: ['For Sale', 'Free', 'Wanted'],
          type: 'select',
        },
        {
          key: 'species',
          label: 'Species',
          options: [
            'Parrot',
            'Canary',
            'Budgerigar',
            'Cockatiel',
            'Lovebird',
            'Pigeon',
            'Chicken',
            'Duck',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'age',
          label: 'Age',
          placeholder: 'Months or years',
          type: 'text',
        },
        {
          key: 'gender',
          label: 'Gender',
          options: ['Male', 'Female', 'Unknown'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Pair of Budgerigars',
    },
  },
  {
    name: 'Pet Accessories',
    slug: 'pet-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'animals-pets',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Cage / Kennel',
            'Bed',
            'Leash / Collar',
            'Clothing',
            'Toys',
            'Food Bowl',
            'Carrier',
            'Aquarium',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'for_pet',
          label: 'For',
          options: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Other'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Dog Kennel Large',
    },
  },
  {
    name: 'Other Animals',
    slug: 'other-animals',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'animals-pets',
    template: {
      fields: [
        {
          key: 'ad_type',
          label: 'Ad Type',
          options: ['For Sale', 'Free', 'Wanted'],
          type: 'select',
        },
        {
          key: 'species',
          label: 'Species',
          placeholder: 'e.g. Rabbit, Hamster, Turtle',
          type: 'text',
        },
        {
          key: 'quantity',
          label: 'Quantity',
          placeholder: 'How many',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. Dwarf Rabbits – Pair',
    },
  },
  {
    name: 'Jobs & Services',
    slug: 'jobs-services',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Job Offer or Service',
    },
  },
  {
    name: 'Jobs',
    slug: 'jobs',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'jobs-services',
    template: {
      fields: [
        {
          key: 'job_type',
          label: 'Type',
          options: [
            'Full-Time',
            'Part-Time',
            'Contract',
            'Freelance',
            'Internship',
            'Seasonal',
          ],
          type: 'select',
        },
        {
          key: 'sector',
          label: 'Sector',
          options: [
            'IT / Technology',
            'Construction',
            'Transport / Logistics',
            'Hospitality',
            'Retail / Sales',
            'Finance',
            'Healthcare',
            'Education',
            'Manufacturing',
            'Agriculture',
            'Security',
            'Cleaning',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'location_type',
          label: 'Location Type',
          options: ['On-site', 'Remote', 'Hybrid'],
          type: 'select',
        },
        {
          key: 'experience',
          label: 'Experience Required',
          options: ['None / Entry Level', '1-2 years', '2-5 years', '5+ years'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. IT Developer – Full-Time Position',
    },
  },
  {
    name: 'Services',
    slug: 'services',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'jobs-services',
    template: {
      fields: [
        {
          key: 'service_type',
          label: 'Service Type',
          options: [
            'Home Repair / Renovation',
            'Cleaning',
            'Plumbing',
            'Electrical',
            'Painting',
            'Moving',
            'Tutoring / Education',
            'IT Support',
            'Photography',
            'Beauty / Wellness',
            'Legal / Accounting',
            'Pet Care',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'availability',
          label: 'Availability',
          options: ['Weekdays', 'Weekends', 'Any Time'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Professional House Painter',
    },
  },
  {
    name: 'Freelance / Remote Work',
    slug: 'freelance-remote',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'jobs-services',
    template: {
      fields: [
        {
          key: 'field',
          label: 'Field',
          options: [
            'Web Development',
            'Graphic Design',
            'Content Writing',
            'Marketing',
            'Video Editing',
            'Translation',
            'Data Entry',
            'Virtual Assistant',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'experience',
          label: 'Experience',
          options: ['Beginner', 'Intermediate', 'Expert'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Freelance Web Developer – React/Next.js',
    },
  },
  {
    name: 'Food & Agriculture',
    slug: 'food-agriculture',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Agricultural Product',
    },
  },
  {
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'food-agriculture',
    template: {
      fields: [
        {
          key: 'product_type',
          label: 'Type',
          options: ['Vegetables', 'Fruits', 'Herbs', 'Mushrooms', 'Other'],
          type: 'select',
        },
        {
          key: 'quantity_kg',
          label: 'Quantity (kg)',
          placeholder: 'kg',
          type: 'number',
        },
        {
          key: 'organic',
          label: 'Organic',
          options: ['Yes', 'No'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Organic Tomatoes 10kg',
    },
  },
  {
    name: 'Seeds & Seedlings',
    slug: 'seeds-seedlings',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'food-agriculture',
    template: {
      fields: [
        {
          key: 'plant_type',
          label: 'Type',
          options: [
            'Vegetable Seeds',
            'Flower Seeds',
            'Fruit Seedlings',
            'Grape Vine',
            'Tree Seedlings',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'quantity',
          label: 'Quantity',
          placeholder: 'Pieces or grams',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Tomato Seedlings 50-pack',
    },
  },
  {
    name: 'Livestock',
    slug: 'livestock',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'food-agriculture',
    template: {
      fields: [
        {
          key: 'livestock_type',
          label: 'Type',
          options: [
            'Cattle',
            'Sheep',
            'Goats',
            'Pigs',
            'Horses',
            'Donkeys',
            'Poultry',
            'Bees / Beehives',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'quantity',
          label: 'Quantity (head)',
          placeholder: 'Number',
          type: 'number',
        },
        {
          key: 'vaccinated',
          label: 'Vaccinated',
          options: ['Yes', 'No', 'Partially'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. 3 Merino Sheep',
    },
  },
  {
    name: 'Farm Land for Sale/Rent',
    slug: 'farm-land-sale',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'food-agriculture',
    template: {
      fields: [
        {
          key: 'adType',
          label: 'Ad Type',
          options: ['For Sale', 'For Rent', 'Wanted'],
          type: 'select',
        },
        {
          key: 'm2',
          label: 'Area (m2)',
          placeholder: 'm2',
          type: 'number',
        },
        {
          key: 'land_type',
          label: 'Land Type',
          options: [
            'Arable',
            'Pasture',
            'Orchard',
            'Vineyard',
            'Forest',
            'Meadow',
            'Mixed',
          ],
          type: 'select',
        },
        {
          key: 'water',
          label: 'Irrigation/Water',
          options: ['Yes', 'No', 'Nearby'],
          type: 'select',
        },
        {
          key: 'road',
          label: 'Road Access',
          options: ['Asphalt', 'Dirt Road', 'None'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Arable Land 5000m2 near Veles',
    },
  },
  {
    name: 'Business Equipment',
    slug: 'business-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Refurbished'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Business Equipment',
    },
  },
  {
    name: 'Office Furniture',
    slug: 'business-office-furniture',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'business-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Desk',
            'Office Chair',
            'Cabinet / Shelf',
            'Meeting Table',
            'Reception Desk',
            'Partition / Room Divider',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'quantity',
          label: 'Quantity',
          placeholder: 'Pieces',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. Set of 10 Office Chairs',
    },
  },
  {
    name: 'Catering Equipment',
    slug: 'catering-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'business-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Refurbished'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'Commercial Oven',
            'Grill / Fryer',
            'Commercial Fridge',
            'Bar Equipment',
            'Coffee Machine',
            'Dishwasher (Commercial)',
            'Tables & Chairs',
            'Food Display',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Commercial Pizza Oven',
    },
  },
  {
    name: 'POS & Retail Systems',
    slug: 'pos-retail-systems',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'business-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'item_type',
          label: 'Type',
          options: [
            'POS Terminal',
            'Cash Register',
            'Barcode Scanner',
            'Receipt Printer',
            'Label Printer',
            'POS Software',
            'Card Reader',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. POS System with Receipt Printer',
    },
  },
  {
    name: 'Industrial Machinery',
    slug: 'industrial-machinery',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'business-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'For Parts'],
          type: 'select',
        },
        {
          key: 'machinery_type',
          label: 'Type',
          options: [
            'CNC Machine',
            'Lathe',
            'Welding Machine',
            'Woodworking Machine',
            'Packaging Machine',
            'Printing Machine',
            'Textile Machine',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'power_kw',
          label: 'Power (kW)',
          placeholder: 'kW',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. CNC Milling Machine 5-axis',
    },
  },
  {
    name: "Baby and Children's Products",
    slug: 'baby-children',
    description: '',
    image: '',
    isActive: true,
    isFeatured: true,
    parentSlug: null,
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Baby Item',
    },
  },
  {
    name: 'Toys & Games',
    slug: 'toys-games',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'baby-children',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'age_group',
          label: 'Age Group',
          options: [
            '0-12 Months',
            '1-3 Years',
            '3-5 Years',
            '6-9 Years',
            '10+ Years',
          ],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Type',
          options: [
            'Educational',
            'Building Blocks / LEGO',
            'Dolls & Action Figures',
            'Cars & RC Toys',
            'Board Games & Puzzles',
            'Plush Toys',
            'Outdoor Toys',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand (e.g. LEGO, Fisher-Price)',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. LEGO City Fire Station',
    },
  },
  {
    name: 'Strollers & Carriers',
    slug: 'strollers-carriers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'baby-children',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Type',
          options: [
            'Standard Stroller',
            'Travel System (2-in-1 / 3-in-1)',
            'Umbrella Stroller',
            'Twin/Double Stroller',
            'Baby Carrier / Wrap',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Stokke',
            'Cybex',
            'Chicco',
            'Maclaren',
            'Maxi-Cosi',
            'Peg Perego',
            'Graco',
            'Other',
          ],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Cybex Priam 3-in-1 Stroller',
    },
  },
  {
    name: 'Nursery Furniture & Room',
    slug: 'nursery-furniture',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'baby-children',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Type',
          options: [
            'Cribs & Beds',
            'Dressers & Changing Tables',
            'Mattresses',
            'High Chairs',
            'Playpens',
            'Bouncers & Swings',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Wooden Baby Crib with Mattress',
    },
  },
  {
    name: 'Baby Feeding',
    slug: 'baby-feeding',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'baby-children',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Type',
          options: [
            'Breast Pumps',
            'Bottles & Sterilizers',
            'Food Processors / Warmers',
            'Cups & Utensils',
            'Bibs',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand (e.g. Philips Avent, Medela)',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Philips Avent Steam Sterilizer',
    },
  },
  {
    name: 'Baby Care & Safety',
    slug: 'baby-care-safety',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'baby-children',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Like New', 'Used'],
          type: 'select',
        },
        {
          key: 'type',
          label: 'Type',
          options: [
            'Baby Monitors',
            'Bath Tubs & Accessories',
            'Thermometers & Health',
            'Safety Gates',
            'Car Seats',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'car_seat_group',
          label: 'Car Seat Group',
          options: [
            '0+ (0-13kg)',
            '1 (9-18kg)',
            '2/3 (15-36kg)',
            'All-in-One',
            'N/A',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
      ],
      titlePlaceholder: 'e.g. Maxi-Cosi CabrioFix Car Seat',
    },
  },
  {
    name: 'Other Baby/Children',
    slug: 'other-baby-children',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'baby-children',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other Baby/Children',
    },
  },
  {
    name: 'Electric Scooters',
    slug: 'electric-scooters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'adType',
          label: 'Ad Type',
          options: ['For Sale', 'Wanted', 'For Rent', 'Rent Wanted'],
          type: 'select',
        },
        {
          key: 'isTradePossible',
          label: 'Trade Possible',
          options: ['Yes', 'No'],
          type: 'select',
        },
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'mileage',
          label: 'Mileage (km)',
          placeholder: 'km',
          type: 'number',
        },
        {
          key: 'range_km',
          label: 'Range per Charge (km)',
          placeholder: 'km',
          type: 'number',
        },
        {
          key: 'power',
          label: 'Power (W)',
          placeholder: 'W',
          type: 'number',
        },
        {
          key: 'color',
          label: 'Color',
          type: 'color-picker',
        },
      ],
      titlePlaceholder: 'e.g. Xiaomi Pro 2 Electric Scooter',
    },
  },
  {
    name: 'Buses',
    slug: 'buses',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'adType',
          label: 'Ad Type',
          options: ['For Sale', 'Wanted', 'For Rent', 'Rent Wanted'],
          type: 'select',
        },
        {
          key: 'isTradePossible',
          label: 'Trade Possible',
          options: ['Yes', 'No'],
          type: 'select',
        },
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'e.g. Mercedes, MAN, Iveco',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'mileage',
          label: 'Mileage (km)',
          placeholder: 'km',
          type: 'number',
        },
        {
          key: 'fuel',
          label: 'Fuel',
          options: ['Diesel', 'Petrol', 'Electric', 'CNG'],
          type: 'select',
        },
        {
          key: 'transmission',
          label: 'Transmission',
          options: ['Manual', 'Automatic'],
          type: 'select',
        },
        {
          key: 'seats',
          label: 'Number of Seats',
          placeholder: 'Seats',
          type: 'number',
        },
        {
          key: 'power',
          label: 'Power (KW)',
          placeholder: 'KW',
          type: 'number',
        },
        {
          key: 'registration',
          label: 'Registration',
          options: ['Registered', 'Not registered', 'Foreign plates'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Mercedes Sprinter',
    },
  },
  {
    name: 'Vans',
    slug: 'vans',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'adType',
          label: 'Ad Type',
          options: ['For Sale', 'Wanted', 'For Rent', 'Rent Wanted'],
          type: 'select',
        },
        {
          key: 'isTradePossible',
          label: 'Trade Possible',
          options: ['Yes', 'No'],
          type: 'select',
        },
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'e.g. Mercedes, MAN, Iveco',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'mileage',
          label: 'Mileage (km)',
          placeholder: 'km',
          type: 'number',
        },
        {
          key: 'fuel',
          label: 'Fuel',
          options: ['Diesel', 'Petrol', 'Electric', 'CNG'],
          type: 'select',
        },
        {
          key: 'transmission',
          label: 'Transmission',
          options: ['Manual', 'Automatic'],
          type: 'select',
        },
        {
          key: 'seats',
          label: 'Number of Seats',
          placeholder: 'Seats',
          type: 'number',
        },
        {
          key: 'power',
          label: 'Power (KW)',
          placeholder: 'KW',
          type: 'number',
        },
        {
          key: 'registration',
          label: 'Registration',
          options: ['Registered', 'Not registered', 'Foreign plates'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Mercedes Sprinter',
    },
  },
  {
    name: 'Trucks',
    slug: 'trucks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'adType',
          label: 'Ad Type',
          options: ['For Sale', 'Wanted', 'For Rent', 'Rent Wanted'],
          type: 'select',
        },
        {
          key: 'isTradePossible',
          label: 'Trade Possible',
          options: ['Yes', 'No'],
          type: 'select',
        },
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'e.g. MAN, Volvo, Scania, Mercedes',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'mileage',
          label: 'Mileage (km)',
          placeholder: 'km',
          type: 'number',
        },
        {
          key: 'payload',
          label: 'Payload (tons)',
          placeholder: 'tons',
          type: 'number',
        },
        {
          key: 'fuel',
          label: 'Fuel',
          options: ['Diesel', 'Electric', 'LNG'],
          type: 'select',
        },
        {
          key: 'transmission',
          label: 'Transmission',
          options: ['Manual', 'Automatic'],
          type: 'select',
        },
        {
          key: 'power',
          label: 'Power (KW)',
          placeholder: 'KW',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. MAN TGX 18.440',
    },
  },
  {
    name: 'Trailers',
    slug: 'trailers',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'trailer_type',
          label: 'Trailer Type',
          options: [
            'Flatbed',
            'Curtainsider',
            'Box',
            'Tanker',
            'Refrigerated',
            'Tipper',
            'Car Transporter',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'e.g. Schmitz, Krone, Wielton',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'length_m',
          label: 'Length (m)',
          placeholder: 'm',
          type: 'number',
        },
        {
          key: 'axles',
          label: 'Number of Axles',
          placeholder: 'Axles',
          type: 'number',
        },
        {
          key: 'load_capacity_tons',
          label: 'Load Capacity (tons)',
          placeholder: 'tons',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. Schmitz Curtainsider 13.6m',
    },
  },
  {
    name: 'Damaged Vehicles / For Spare Parts',
    slug: 'damaged-vehicles-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'vehicle_type',
          label: 'Vehicle Type',
          options: ['Car', 'Motorcycle', 'Van', 'Truck', 'Bus', 'Other'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Audi',
            'BMW',
            'Citroen',
            'Dacia',
            'Fiat',
            'Ford',
            'Honda',
            'Hyundai',
            'Kia',
            'Mazda',
            'Mercedes-Benz',
            'Mitsubishi',
            'Nissan',
            'Opel',
            'Peugeot',
            'Renault',
            'Seat',
            'Skoda',
            'Toyota',
            'Volkswagen',
            'Volvo',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'model',
          label: 'Model',
          placeholder: 'Model',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'damage_type',
          label: 'Damage Type',
          options: [
            'Front Damage',
            'Rear Damage',
            'Side Damage',
            'Flood',
            'Fire',
            'Engine Failure',
            'Transmission',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'engine_cc',
          label: 'Engine (cc)',
          placeholder: 'cc',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. BMW 320d 2015 Damaged – For Parts',
    },
  },
  {
    name: 'Camping Vehicles',
    slug: 'camping-vehicles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'camping_type',
          label: 'Type',
          options: [
            'Motorhome',
            'Camper Van',
            'Caravan',
            'Folding Caravan',
            'Camper Pickup',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'e.g. Fiat, Mercedes, Knaus',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'berths',
          label: 'Sleeping Places (Berths)',
          placeholder: 'Berths',
          type: 'number',
        },
        {
          key: 'length_m',
          label: 'Length (m)',
          placeholder: 'm',
          type: 'number',
        },
        {
          key: 'fuel',
          label: 'Fuel',
          options: ['Diesel', 'Petrol', 'Electric'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. Fiat Ducato Motorhome 2018',
    },
  },
  {
    name: 'Agricultural Vehicles',
    slug: 'agricultural-vehicles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Agricultural Vehicles',
    },
  },
  {
    name: 'Heavy Duty / Construction / Forklifts',
    slug: 'heavy-duty-construction',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Heavy Duty / Construction / Forklifts',
    },
  },
  {
    name: 'Boats / Yachts / Jet Skis',
    slug: 'boats-yachts-jetskis',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Boats / Yachts / Jet Skis',
    },
  },
  {
    name: 'Auto Parts and Equipment',
    slug: 'auto-parts-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Auto Parts and Equipment',
    },
  },
  {
    name: 'Motorcycle Parts and Equipment',
    slug: 'motorcycle-parts-equipment',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Motorcycle Parts and Equipment',
    },
  },
  {
    name: 'Towing Service',
    slug: 'towing-service',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'service_area',
          label: 'Service Area',
          placeholder: 'City or region',
          type: 'text',
        },
        {
          key: 'availability',
          label: 'Availability',
          options: [
            '24/7',
            'Daytime Only',
            'Weekdays',
            'Weekends',
            'By Appointment',
          ],
          type: 'select',
        },
        {
          key: 'vehicle_types',
          label: 'Vehicles Accepted',
          options: ['Cars', 'Motorcycles', 'Trucks', 'Vans', 'All Types'],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details about the service...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. 24/7 Towing Service – Skopje Region',
    },
  },
  {
    name: 'Car/Vehicle Buying Service',
    slug: 'vehicle-buying',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'vehicle_type',
          label: 'Vehicle Type',
          options: [
            'Cars',
            'Motorcycles',
            'Vans',
            'Trucks',
            'Agricultural',
            'Any',
          ],
          type: 'select',
        },
        {
          key: 'condition_preference',
          label: 'Condition Preference',
          options: [
            'Any Condition',
            'Damaged OK',
            'Non-running OK',
            'Running Only',
          ],
          type: 'select',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details about vehicles you buy...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. We Buy All Cars – Cash Payment',
    },
  },
  {
    name: 'Other',
    slug: 'other-vehicles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motor-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other',
    },
  },
  {
    name: 'All Agricultural Vehicles',
    slug: 'all-agricultural-vehicles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. All Agricultural Vehicles',
    },
  },
  {
    name: 'Tractors',
    slug: 'tractors',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'John Deere',
            'Massey Ferguson',
            'New Holland',
            'Fendt',
            'Deutz-Fahr',
            'Case IH',
            'Claas',
            'Kubota',
            'Same',
            'Landini',
            'IMT',
            'TAFE',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'model',
          label: 'Model',
          placeholder: 'Model',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'hp',
          label: 'Horsepower (HP)',
          placeholder: 'HP',
          type: 'number',
        },
        {
          key: 'hours_worked',
          label: 'Hours Worked',
          placeholder: 'h',
          type: 'number',
        },
        {
          key: 'drive_type',
          label: 'Drive',
          options: ['2WD', '4WD'],
          type: 'select',
        },
      ],
      titlePlaceholder: 'e.g. John Deere 6100M 4WD',
    },
  },
  {
    name: 'Attachment Machines',
    slug: 'attachment-machines',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Attachment Machines',
    },
  },
  {
    name: 'Harvesters',
    slug: 'harvesters',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'John Deere',
            'Claas',
            'New Holland',
            'Case IH',
            'Fendt',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'harvester_type',
          label: 'Type',
          options: [
            'Grain',
            'Corn',
            'Sunflower',
            'Grape',
            'Sugar Beet',
            'Universal',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'hp',
          label: 'HP',
          placeholder: 'HP',
          type: 'number',
        },
        {
          key: 'hours_worked',
          label: 'Hours Worked',
          placeholder: 'h',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. John Deere S560 Combine Harvester',
    },
  },
  {
    name: 'Forestry Machines',
    slug: 'forestry-machines',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Forestry Machines',
    },
  },
  {
    name: 'Spare Parts',
    slug: 'spare-parts-agri',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Spare Parts',
    },
  },
  {
    name: 'Other',
    slug: 'other-agri',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'agricultural-vehicles',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other',
    },
  },
  {
    name: 'All Heavy Vehicles',
    slug: 'all-heavy-vehicles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heavy-duty-construction',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. All Heavy Vehicles',
    },
  },
  {
    name: 'Freight and Towing Vehicles',
    slug: 'freight-towing-vehicles',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heavy-duty-construction',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Freight and Towing Vehicles',
    },
  },
  {
    name: 'Construction Machines',
    slug: 'construction-machines',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heavy-duty-construction',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'machine_type',
          label: 'Machine Type',
          options: [
            'Excavator',
            'Bulldozer',
            'Wheel Loader',
            'Crane',
            'Compactor/Roller',
            'Motor Grader',
            'Skid Steer',
            'Backhoe Loader',
            'Paver',
            'Scraper',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'CAT',
            'Komatsu',
            'Volvo',
            'Liebherr',
            'JCB',
            'Doosan',
            'Hitachi',
            'Hyundai',
            'New Holland',
            'Terex',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'hours_operated',
          label: 'Hours Operated',
          placeholder: 'h',
          type: 'number',
        },
        {
          key: 'weight_tons',
          label: 'Operating Weight (tons)',
          placeholder: 'tons',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. CAT 320 Excavator 2018',
    },
  },
  {
    name: 'Forklifts and Cargo Handling',
    slug: 'forklifts-handling',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heavy-duty-construction',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'forklift_type',
          label: 'Type',
          options: [
            'Counterbalance',
            'Reach Truck',
            'Pallet Stacker',
            'Order Picker',
            'Telehandler',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'fuel',
          label: 'Fuel',
          options: ['Electric', 'LPG', 'Diesel', 'Petrol'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          options: [
            'Toyota',
            'Linde',
            'Jungheinrich',
            'Still',
            'Crown',
            'Hyster',
            'Yale',
            'Manitou',
            'Other',
          ],
          type: 'select',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'lift_capacity_tons',
          label: 'Lift Capacity (tons)',
          placeholder: 'tons',
          type: 'number',
        },
        {
          key: 'mast_height_m',
          label: 'Mast Height (m)',
          placeholder: 'm',
          type: 'number',
        },
        {
          key: 'hours_operated',
          label: 'Hours Operated',
          placeholder: 'h',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. Toyota 3-ton Electric Forklift',
    },
  },
  {
    name: 'Spare Parts',
    slug: 'spare-parts-heavy',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heavy-duty-construction',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Spare Parts',
    },
  },
  {
    name: 'Other',
    slug: 'other-heavy',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'heavy-duty-construction',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other',
    },
  },
  {
    name: 'All Boats',
    slug: 'all-boats',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'boats-yachts-jetskis',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. All Boats',
    },
  },
  {
    name: 'Motor Boats',
    slug: 'motor-boats',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'boats-yachts-jetskis',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'year',
          label: 'Year',
          placeholder: 'Year',
          type: 'number',
        },
        {
          key: 'length_m',
          label: 'Length (m)',
          placeholder: 'm',
          type: 'number',
        },
        {
          key: 'fuel',
          label: 'Fuel',
          options: ['Petrol', 'Diesel', 'Electric'],
          type: 'select',
        },
        {
          key: 'motor_brand',
          label: 'Motor Brand',
          placeholder: 'e.g. Yamaha, Mercury, Suzuki',
          type: 'text',
        },
        {
          key: 'motor_hp',
          label: 'Motor HP',
          placeholder: 'HP',
          type: 'number',
        },
        {
          key: 'berths',
          label: 'Sleeping Berths',
          placeholder: 'Berths',
          type: 'number',
        },
      ],
      titlePlaceholder: 'e.g. Yamaha 200HP Motor Boat 7m',
    },
  },
  {
    name: 'Rowing Boats',
    slug: 'rowing-boats',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'boats-yachts-jetskis',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Rowing Boats',
    },
  },
  {
    name: 'Rubber Boats',
    slug: 'rubber-boats',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'boats-yachts-jetskis',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Rubber Boats',
    },
  },
  {
    name: 'Parts and Accessories',
    slug: 'parts-accessories-boats',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'boats-yachts-jetskis',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Parts and Accessories',
    },
  },
  {
    name: 'Other',
    slug: 'other-boats',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'boats-yachts-jetskis',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other',
    },
  },
  {
    name: 'All Auto Parts',
    slug: 'all-auto-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. All Auto Parts',
    },
  },

  {
    name: 'Auto Hi-Fi and Navigation',
    slug: 'auto-hifi-navigation',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Auto Hi-Fi and Navigation',
    },
  },
  {
    name: 'Spare Parts',
    slug: 'spare-parts-cars',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Spare Parts',
    },
  },
  {
    name: 'Tuning',
    slug: 'tuning-cars',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tuning',
    },
  },
  {
    name: 'Styling and Sports Equipment',
    slug: 'styling-sports-cars',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Styling and Sports Equipment',
    },
  },
  {
    name: 'Motor Oil and Additives',
    slug: 'oil-additives-cars',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Motor Oil and Additives',
    },
  },
  {
    name: 'Car Care',
    slug: 'car-care',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Car Care',
    },
  },
  {
    name: 'Car Accessories',
    slug: 'car-accessories',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Car Accessories',
    },
  },
  {
    name: 'Roof Racks',
    slug: 'roof-racks',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Roof Racks',
    },
  },
  {
    name: 'Tools',
    slug: 'tools-cars',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tools',
    },
  },
  {
    name: 'Repair Instructions, Books',
    slug: 'manuals-books-cars',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Repair Instructions, Books',
    },
  },
  {
    name: 'Other',
    slug: 'other-auto-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'auto-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Other',
    },
  },
  {
    name: 'All Motorcycle Parts',
    slug: 'all-motorcycle-parts',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. All Motorcycle Parts',
    },
  },
  {
    name: 'Tires and Rims',
    slug: 'tires-rims-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tires and Rims',
    },
  },
  {
    name: 'Spare Parts',
    slug: 'spare-parts-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Spare Parts',
    },
  },
  {
    name: 'Clothing/Protection',
    slug: 'clothing-protection-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Clothing/Protection',
    },
  },
  {
    name: 'Tuning',
    slug: 'tuning-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tuning',
    },
  },
  {
    name: 'Styling and Sports Equipment',
    slug: 'styling-sports-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Styling and Sports Equipment',
    },
  },
  {
    name: 'Motor Oil and Additives',
    slug: 'oil-additives-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Motor Oil and Additives',
    },
  },
  {
    name: 'Motorcycle Accessories',
    slug: 'accessories-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Motorcycle Accessories',
    },
  },
  {
    name: 'Tools',
    slug: 'tools-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Tools',
    },
  },
  {
    name: 'Motorcycle Care',
    slug: 'care-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Motorcycle Care',
    },
  },
  {
    name: 'Repair Instructions/Books',
    slug: 'manuals-books-moto',
    description: '',
    image: '',
    isActive: true,
    isFeatured: false,
    parentSlug: 'motorcycle-parts-equipment',
    template: {
      fields: [
        {
          key: 'condition',
          label: 'Condition',
          options: ['New', 'Used', 'Damaged'],
          type: 'select',
        },
        {
          key: 'brand',
          label: 'Brand',
          placeholder: 'Brand',
          type: 'text',
        },
        {
          key: 'description',
          label: 'Description',
          placeholder: 'Details...',
          type: 'textarea',
        },
      ],
      titlePlaceholder: 'e.g. Repair Instructions/Books',
    },
  },
];

export const seedCategories = internalMutation({
  args: {},
  handler: async (ctx) => {
    // 1. Build a map of slug to _id for inserted categories
    const slugToId = new Map<string, string>();

    // 2. Separate into roots and children (with original index for positioning)
    const categoriesWithIndex = categoriesData.map((c, index) => ({ ...c, originalIndex: index }));
    const roots = categoriesWithIndex.filter((c) => !c.parentSlug);
    const children = categoriesWithIndex.filter((c) => c.parentSlug);

    // 3. Helper to insert and handle existing
    const insertOrUpdate = async (
      catData: any,
      parentId: string | undefined = undefined,
    ) => {
      const existing = await ctx.db
        .query('categories')
        .withIndex('by_slug', (q) => q.eq('slug', catData.slug))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          name: catData.name,
          template: catData.template,
          isFeatured: catData.isFeatured,
          isActive: catData.isActive,
          parentId: parentId as any,
          position: catData.originalIndex,
          description: catData.description,
        });
        slugToId.set(catData.slug, existing._id);
      } else {
        const id = await ctx.db.insert('categories', {
          name: catData.name,
          slug: catData.slug,
          description: catData.description,
          image: catData.image,
          isActive: catData.isActive,
          isFeatured: catData.isFeatured,
          parentId: parentId as any,
          position: catData.originalIndex,
          template: catData.template,
          createdAt: Date.now(),
        });
        slugToId.set(catData.slug, id);
      }
    };

    // 4. Insert roots
    for (const root of roots) {
      await insertOrUpdate(root);
    }

    // 5. Insert children (needs to handle arbitrary depth, so we loop until all are placed)
    let remaining = [...children];
    let loops = 0;
    while (remaining.length > 0 && loops < 20) {
      const nextRemaining = [];
      for (const child of remaining) {
        const parentId = slugToId.get(child.parentSlug!);
        if (parentId) {
          await insertOrUpdate(child, parentId);
        } else {
          nextRemaining.push(child);
        }
      }
      if (nextRemaining.length === remaining.length) {
        console.error(
          'Circular dependency or missing parent detected among categories.',
        );
        break;
      }
      remaining = nextRemaining;
      loops++;
    }

    // 6. Prune deprecated categories that no longer exist in seed.ts
    const validSlugs = new Set(categoriesData.map((c) => c.slug));
    const allCategoriesInDb = await ctx.db.query('categories').collect();
    let deletedCount = 0;

    for (const dbCat of allCategoriesInDb) {
      if (!validSlugs.has(dbCat.slug)) {
        await ctx.db.delete(dbCat._id);
        deletedCount++;
      }
    }

    return {
      success: true,
      count: categoriesData.length,
      deleted: deletedCount,
    };
  },
});
