
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

