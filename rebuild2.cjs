const fs = require('fs');
const vm = require('vm');

const content = fs.readFileSync('convex/seed.ts', 'utf8');

const startStr = 'const categoriesData = [';
const startIndex = content.indexOf(startStr);
const endStr = '];\n\nexport const seedCategories';
const endIndex = content.indexOf(endStr);
const arrayContent = content.substring(startIndex + startStr.length - 1, endIndex + 1);

let categoriesData;
try {
  categoriesData = vm.runInNewContext('(' + arrayContent + ')');
} catch (e) {
  console.log("Error evaluating arrayContent:");
  // console.log(arrayContent.substring(arrayContent.length - 200));
  console.log(e);
  process.exit(1);
}

const motorSlug = 'motor-vehicles';
const oldMotorSlugs = new Set();
let added = true;
oldMotorSlugs.add(motorSlug);
while(added) {
  added = false;
  for (let c of categoriesData) {
    if (!oldMotorSlugs.has(c.slug) && (c.parentSlug === motorSlug || oldMotorSlugs.has(c.parentSlug))) {
        oldMotorSlugs.add(c.slug);
        added = true;
    }
  }
}

const filteredData = categoriesData.filter(c => !oldMotorSlugs.has(c.slug));

const newMotorVehicles = [
  // ROOT
  { name: 'Motor Vehicles', slug: motorSlug, description: '', image: '', isActive: true, isFeatured: true, parentSlug: null, template: { fields: [], titlePlaceholder: 'e.g. Motor Vehicles' } },
  
  // L1: Cars
  { name: 'Cars', slug: 'cars', description: '', image: '', isActive: true, isFeatured: false, parentSlug: motorSlug, template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Nissan', 'Ford', 'Peugeot', 'Renault', 'Fiat', 'Opel', 'Hyundai', 'Kia', 'Skoda', 'Seat', 'Mazda', 'Honda', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'e.g. Golf, 320d, A4', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'mileage_km', label: 'Mileage (km)', placeholder: 'km', type: 'number' },
    { key: 'fuel_type', label: 'Fuel Type', options: ['Diesel', 'Petrol', 'Hybrid', 'Electric', 'LPG/Gas'], type: 'select' },
    { key: 'transmission', label: 'Transmission', options: ['Manual', 'Automatic', 'Semi-Auto'], type: 'select' },
    { key: 'body_type', label: 'Body Type', options: ['Sedan', 'Hatchback', 'SUV / Off-Road', 'Station Wagon', 'Coupe', 'Convertible', 'Minivan / MPV'], type: 'select' },
    { key: 'engine_capacity_ccm', label: 'Engine Capacity (ccm)', placeholder: 'ccm', type: 'number' },
    { key: 'engine_power_kw', label: 'Engine Power (kW)', placeholder: 'kW', type: 'number' },
    { key: 'doors', label: 'Doors', options: ['2/3', '4/5', '6/7'], type: 'select' },
    { key: 'color', label: 'Color', placeholder: 'Color', type: 'text' },
    { key: 'registration', label: 'Registration', options: ['Macedonian', 'Foreign', 'Unregistered'], type: 'select' },
    { key: 'drive_type', label: 'Drive Type', options: ['Front Wheel', 'Rear Wheel', 'All Wheel / 4x4'], type: 'select' },
    { key: 'emission_class', label: 'Emission Class', options: ['Euro 1', 'Euro 2', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6'], type: 'select' }
  ], titlePlaceholder: 'e.g. VW Golf 2.0 TDI 2018' } },

  // L1: Motorcycles & Scooters
  { name: 'Motorcycles & Scooters', slug: 'motorcycles-scooters', description: '', image: '', isActive: true, isFeatured: false, parentSlug: motorSlug, template: { fields: [], titlePlaceholder: 'e.g. Motorcycles' } },
  // L2 under Motorcycles
  { name: 'Motorcycles (Above 50cc)', slug: 'motorcycles-above-50cc', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'motorcycles-scooters', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'BMW', 'Ducati', 'KTM', 'Aprilia', 'Harley-Davidson', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'mileage_km', label: 'Mileage (km)', placeholder: 'km', type: 'number' },
    { key: 'engine_capacity_ccm', label: 'Engine Capacity (ccm)', placeholder: 'ccm', type: 'number' },
    { key: 'engine_power_kw', label: 'Engine Power (kW)', placeholder: 'kW', type: 'number' },
    { key: 'motorcycle_type', label: 'Type', options: ['Sport', 'Naked', 'Cruiser/Chopper', 'Touring', 'Enduro/Motocross', 'Custom', 'Other'], type: 'select' },
    { key: 'cooling_system', label: 'Cooling System', options: ['Air', 'Water', 'Oil'], type: 'select' },
    { key: 'registration', label: 'Registration', options: ['Macedonian', 'Foreign', 'Unregistered'], type: 'select' }
  ], titlePlaceholder: 'e.g. Yamaha R6 2015' } },
  { name: 'Mopeds & Scooters (Under 50cc)', slug: 'mopeds-under-50cc', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'motorcycles-scooters', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Vespa', 'Piaggio', 'Aprilia', 'Peugeot', 'Yamaha', 'Honda', 'KYMCO', 'SYM', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'mileage_km', label: 'Mileage (km)', placeholder: 'km', type: 'number' },
    { key: 'engine_capacity_ccm', label: 'Engine Capacity (ccm)', placeholder: 'ccm', type: 'number' }
  ], titlePlaceholder: 'e.g. Vespa Primavera 50' } },
  { name: 'Electric Scooters & Bikes', slug: 'electric-scooters-bikes', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'motorcycles-scooters', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used', 'Damaged'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Xiaomi', 'Ninebot/Segway', 'Dualtron', 'Kugoo', 'MS Energy', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'max_speed_kmh', label: 'Max Speed (km/h)', placeholder: 'km/h', type: 'number' },
    { key: 'range_km', label: 'Range (km)', placeholder: 'km', type: 'number' },
    { key: 'motor_power_w', label: 'Motor Power (W)', placeholder: 'W', type: 'number' }
  ], titlePlaceholder: 'e.g. Xiaomi Pro 2' } },
  { name: 'Quads & ATVs', slug: 'quads-atvs', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'motorcycles-scooters', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Yamaha', 'Polaris', 'Can-Am', 'Honda', 'Suzuki', 'CFMoto', 'Odes', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'engine_capacity_ccm', label: 'Engine Capacity (ccm)', placeholder: 'ccm', type: 'number' },
    { key: 'drive_type', label: 'Drive Type', options: ['2WD', '4WD / 4x4'], type: 'select' }
  ], titlePlaceholder: 'e.g. CFMoto CForce 450' } },

  // L1: Commercial & Transport
  { name: 'Commercial & Transport Vehicles', slug: 'commercial-transport-vehicles', description: '', image: '', isActive: true, isFeatured: false, parentSlug: motorSlug, template: { fields: [], titlePlaceholder: 'e.g. Transport' } },
  // L2 under Transport
  { name: 'Vans & Minibuses', slug: 'vans-minibuses', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'commercial-transport-vehicles', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Mercedes-Benz', 'VW', 'Ford', 'Renault', 'Fiat', 'Peugeot', 'Citroen', 'Iveco', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'mileage_km', label: 'Mileage (km)', placeholder: 'km', type: 'number' },
    { key: 'fuel_type', label: 'Fuel Type', options: ['Diesel', 'Petrol', 'Electric', 'Gas'], type: 'select' },
    { key: 'transmission', label: 'Transmission', options: ['Manual', 'Automatic'], type: 'select' },
    { key: 'seats', label: 'Number of Seats', placeholder: 'e.g. 3, 9', type: 'number' },
    { key: 'payload_capacity_kg', label: 'Payload Capacity (kg)', placeholder: 'kg', type: 'number' }
  ], titlePlaceholder: 'e.g. Mercedes Sprinter 316 CDI' } },
  { name: 'Trucks (Up to 7.5t)', slug: 'trucks-light', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'commercial-transport-vehicles', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Iveco', 'Mercedes-Benz', 'MAN', 'Renault', 'Fuso', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'mileage_km', label: 'Mileage (km)', placeholder: 'km', type: 'number' },
    { key: 'gross_weight_kg', label: 'Gross Weight (kg)', placeholder: 'Max 7500 kg', type: 'number' }
  ], titlePlaceholder: 'e.g. Iveco Daily 35C15' } },
  { name: 'Heavy Trucks (Over 7.5t)', slug: 'trucks-heavy', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'commercial-transport-vehicles', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
    { key: 'make', label: 'Make', options: ['MAN', 'Mercedes-Benz', 'Volvo', 'Scania', 'DAF', 'Renault', 'Iveco', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'mileage_km', label: 'Mileage (km)', placeholder: 'km', type: 'number' },
    { key: 'axles', label: 'Axles', options: ['2', '3', '4', '5+'], type: 'select' },
    { key: 'emission_class', label: 'Emission Class', options: ['Euro 3', 'Euro 4', 'Euro 5', 'Euro 6'], type: 'select' },
    { key: 'truck_type', label: 'Type', options: ['Tipper', 'Box', 'Curtainsider', 'Refrigerated', 'Tractor Unit', 'Chassis Cab', 'Other'], type: 'select' }
  ], titlePlaceholder: 'e.g. Scania R450' } },
  { name: 'Buses & Coaches', slug: 'buses-coaches', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'commercial-transport-vehicles', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Mercedes-Benz', 'Setra', 'MAN', 'Neoplan', 'Volvo', 'Scania', 'Iveco', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'seats', label: 'Seats', placeholder: 'e.g. 50', type: 'number' }
  ], titlePlaceholder: 'e.g. Setra S 415 HD' } },
  { name: 'Trailers & Semi-Trailers', slug: 'trailers-semitrailers', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'commercial-transport-vehicles', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Schmitz Cargobull', 'Krone', 'Kögel', 'Schwarzmüller', 'Other'], type: 'select' },
    { key: 'type', label: 'Type', options: ['Curtainsider', 'Refrigerated', 'Tipper', 'Low Loader', 'Car Transporter', 'Light Car Trailer', 'Other'], type: 'select' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' }
  ], titlePlaceholder: 'e.g. Schmitz Cargobull Curtainsider' } },

  // L1: Agricultural & Heavy
  { name: 'Agricultural & Heavy Machinery', slug: 'agri-heavy-machinery', description: '', image: '', isActive: true, isFeatured: false, parentSlug: motorSlug, template: { fields: [], titlePlaceholder: 'e.g. Tractors' } },
  // L2 under Agri
  { name: 'Tractors', slug: 'tractors-agri', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'agri-heavy-machinery', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', options: ['John Deere', 'Massey Ferguson', 'New Holland', 'IMT', 'Fendt', 'Deutz-Fahr', 'Case IH', 'Zetor', 'Belarus', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'working_hours', label: 'Working Hours', placeholder: 'Hours', type: 'number' },
    { key: 'engine_power_kw', label: 'Engine Power (kW)', placeholder: 'kW', type: 'number' },
    { key: 'drive_type', label: 'Drive Type', options: ['2WD', '4WD / 4x4'], type: 'select' }
  ], titlePlaceholder: 'e.g. John Deere 6120M' } },
  { name: 'Harvesters & Combines', slug: 'harvesters-combines', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'agri-heavy-machinery', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', options: ['CLAAS', 'John Deere', 'New Holland', 'Zmaj', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'working_hours', label: 'Working Hours', placeholder: 'Hours', type: 'number' }
  ], titlePlaceholder: 'e.g. CLAAS Lexion 600' } },
  { name: 'Construction Machinery', slug: 'construction-machinery', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'agri-heavy-machinery', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Caterpillar', 'JCB', 'Komatsu', 'Volvo', 'Liebherr', 'Bobcat', 'Hitachi', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'machinery_type', label: 'Type', options: ['Excavator', 'Mini Excavator', 'Backhoe Loader', 'Wheel Loader', 'Bulldozer', 'Grader', 'Roller', 'Other'], type: 'select' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'working_hours', label: 'Working Hours', placeholder: 'Hours', type: 'number' }
  ], titlePlaceholder: 'e.g. JCB 4CX Backhoe Loader' } },
  { name: 'Forklifts & Handling', slug: 'forklifts-handling-machinery', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'agri-heavy-machinery', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Linde', 'Toyota', 'Jungheinrich', 'Hyster', 'Still', 'Clark', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'fuel_type', label: 'Power Source', options: ['Diesel', 'Electric', 'LPG/Gas'], type: 'select' },
    { key: 'lifting_capacity_kg', label: 'Lifting Capacity (kg)', placeholder: 'kg', type: 'number' },
    { key: 'lifting_height_m', label: 'Lifting Height (m)', placeholder: 'm', type: 'number' }
  ], titlePlaceholder: 'e.g. Linde H25D' } },
  { name: 'Forestry Machinery', slug: 'forestry-machinery', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'agri-heavy-machinery', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', placeholder: 'Make', type: 'text' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' }
  ], titlePlaceholder: 'e.g. Timberjack 460' } },
  { name: 'Attachment Machines / Implements', slug: 'attachment-implements', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'agri-heavy-machinery', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'implement_type', label: 'Type', options: ['Plough', 'Seeder', 'Sprayer', 'Baler', 'Mower', 'Loader Bucket', 'Hydraulic Hammer', 'Other'], type: 'select' }
  ], titlePlaceholder: 'e.g. 3-Furrow Reversible Plough' } },

  // L1: Boats & Watercraft
  { name: 'Boats & Watercraft', slug: 'boats-watercraft', description: '', image: '', isActive: true, isFeatured: false, parentSlug: motorSlug, template: { fields: [], titlePlaceholder: 'e.g. Boats' } },
  // L2 under Boats
  { name: 'Motor Boats & Yachts', slug: 'motor-boats-yachts', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'boats-watercraft', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', placeholder: 'Make', type: 'text' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'length_meters', label: 'Length (m)', placeholder: 'm', type: 'number' },
    { key: 'engine_power_hp', label: 'Engine Power (HP)', placeholder: 'HP', type: 'number' },
    { key: 'engine_type', label: 'Engine Type', options: ['Outboard', 'Inboard', 'Inboard/Outboard', 'None'], type: 'select' }
  ], titlePlaceholder: 'e.g. Bayliner 175' } },
  { name: 'Sailing Boats', slug: 'sailing-boats', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'boats-watercraft', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', placeholder: 'Make', type: 'text' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'length_meters', label: 'Length (m)', placeholder: 'm', type: 'number' }
  ], titlePlaceholder: 'e.g. Bavaria 38 Cruiser' } },
  { name: 'Jet Skis', slug: 'jet-skis', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'boats-watercraft', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', options: ['Sea-Doo', 'Yamaha', 'Kawasaki', 'Other'], type: 'select' },
    { key: 'model', label: 'Model', placeholder: 'Model', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'engine_power_hp', label: 'Engine Power (HP)', placeholder: 'HP', type: 'number' }
  ], titlePlaceholder: 'e.g. Sea-Doo Spark' } },
  { name: 'Rowing & Rubber Boats', slug: 'rowing-rubber-boats', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'boats-watercraft', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'type', label: 'Type', options: ['Rubber/Inflatable', 'Kayak/Canoe', 'Rowing Boat', 'Other'], type: 'select' }
  ], titlePlaceholder: 'e.g. Zodiac Inflatable Boat' } },
  { name: 'Marine Parts & Accessories', slug: 'marine-parts-accessories', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'boats-watercraft', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' }
  ], titlePlaceholder: 'e.g. Outboard Motor Yamaha 15HP' } },

  // L1: Auto Parts, Tires & Accessories
  { name: 'Auto Parts, Tires & Accessories', slug: 'auto-parts-accessories-root', description: '', image: '', isActive: true, isFeatured: false, parentSlug: motorSlug, template: { fields: [], titlePlaceholder: 'e.g. Car Parts' } },
  // L2 under Parts
  { name: 'Car Tires & Rims', slug: 'car-tires-rims', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'auto-parts-accessories-root', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'type', label: 'Type', options: ['Tires Only', 'Rims/Alloys Only', 'Tires + Rims Set'], type: 'select' },
    { key: 'tire_season', label: 'Tire Season', options: ['Summer', 'Winter', 'All-Season'], type: 'select' },
    { key: 'size', label: 'Size', placeholder: 'e.g. 205/55 R16', type: 'text' },
    { key: 'rim_bolt_pattern', label: 'Bolt Pattern', placeholder: 'e.g. 5x112', type: 'text' }
  ], titlePlaceholder: 'e.g. 4x Michelin 205/55 R16 Winter' } },
  { name: 'Motorcycle Tires & Rims', slug: 'moto-tires-rims', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'auto-parts-accessories-root', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'size', label: 'Size', placeholder: 'e.g. 180/55 ZR17', type: 'text' }
  ], titlePlaceholder: 'e.g. Pirelli Diablo Rosso III 180/55 ZR17' } },
  { name: 'Car Spare Parts', slug: 'car-spare-parts-main', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'auto-parts-accessories-root', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'part_category', label: 'Category', options: ['Engine', 'Body / Exterior', 'Interior', 'Electrical & Lighting', 'Suspension & Steering', 'Brakes', 'Exhaust', 'Transmission / Drivetrain', 'Cooling / Heating', 'Other'], type: 'select' },
    { key: 'compatible_make', label: 'Compatible Make', placeholder: 'e.g. VW', type: 'text' },
    { key: 'compatible_model', label: 'Compatible Model', placeholder: 'e.g. Golf 5', type: 'text' }
  ], titlePlaceholder: 'e.g. VW Golf 5 Front Bumper' } },
  { name: 'Motorcycle Spare Parts', slug: 'moto-spare-parts-main', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'auto-parts-accessories-root', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'part_category', label: 'Category', options: ['Engine', 'Fairings / Bodywork', 'Electrical', 'Brakes', 'Exhaust', 'Suspension', 'Other'], type: 'select' },
    { key: 'compatible_make', label: 'Compatible Make', placeholder: 'e.g. Yamaha', type: 'text' }
  ], titlePlaceholder: 'e.g. Yamaha R6 Full System Exhaust' } },
  { name: 'Machinery & Transport Spare Parts', slug: 'machinery-transport-parts-main', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'auto-parts-accessories-root', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'type', label: 'Part For', options: ['Trucks', 'Buses', 'Tractors', 'Construction Machinery', 'Other'], type: 'select' }
  ], titlePlaceholder: 'e.g. Scania R450 Headlight' } },
  { name: 'Car Audio & Navigation', slug: 'car-audio-navigation', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'auto-parts-accessories-root', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'type', label: 'Type', options: ['Car Radio/Multimedia', 'Speakers', 'Amplifiers', 'Subwoofers', 'GPS Navigation', 'Accessories'], type: 'select' }
  ], titlePlaceholder: 'e.g. Pioneer Double DIN Multimedia' } },
  { name: 'Car Care & Cosmetics', slug: 'car-care-cosmetics', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'auto-parts-accessories-root', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New (Sealed)' ], type: 'select' }
  ], titlePlaceholder: 'e.g. Sonax Car Polish' } },
  { name: 'Motorcycle Clothing & Helmets', slug: 'moto-clothing-helmets', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'auto-parts-accessories-root', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'type', label: 'Type', options: ['Helmets', 'Jackets', 'Pants', 'Suits', 'Gloves', 'Boots', 'Other Protective Gear'], type: 'select' },
    { key: 'size', label: 'Size', placeholder: 'e.g. M, L, XL', type: 'text' }
  ], titlePlaceholder: 'e.g. Shoei NXR 2 Helmet Size L' } },
  { name: 'Automotive Tools & Diagnostics', slug: 'automotive-tools-diag', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'auto-parts-accessories-root', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'type', label: 'Type', options: ['OBD2 Diagnostics', 'Hand Tools Sets', 'Lifting Equipment', 'Specialized Auto Tools', 'Other'], type: 'select' }
  ], titlePlaceholder: 'e.g. VCDS Diagnostic Cable' } },

  // L1: Camping & Caravans
  { name: 'Camping & Caravans', slug: 'camping-caravans', description: '', image: '', isActive: true, isFeatured: false, parentSlug: motorSlug, template: { fields: [], titlePlaceholder: 'e.g. Campers' } },
  // L2 under Camping
  { name: 'Motorhomes / Campers', slug: 'motorhomes', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'camping-caravans', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used', 'Damaged'], type: 'select' },
    { key: 'make', label: 'Make', placeholder: 'Make', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'mileage_km', label: 'Mileage (km)', placeholder: 'km', type: 'number' },
    { key: 'sleeping_capacity', label: 'Sleeping Capacity', options: ['1', '2', '3', '4', '5', '6+'], type: 'select' }
  ], titlePlaceholder: 'e.g. Fiat Ducato Adria Camper' } },
  { name: 'Caravans / Towable Campers', slug: 'towable-caravans', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'camping-caravans', template: { fields: [
    { key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' },
    { key: 'make', label: 'Make', placeholder: 'Make', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'YYYY', type: 'number' },
    { key: 'length_meters', label: 'Length (m)', placeholder: 'm', type: 'number' },
    { key: 'sleeping_capacity', label: 'Sleeping Capacity', options: ['1', '2', '3', '4', '5', '6+'], type: 'select' }
  ], titlePlaceholder: 'e.g. Hobby Premium 560' } },

  // L1: Vehicle Services
  { name: 'Vehicle Services', slug: 'vehicle-services', description: '', image: '', isActive: true, isFeatured: false, parentSlug: motorSlug, template: { fields: [
    { key: 'service_type', label: 'Service Type', options: ['Towing & Recovery', 'Mechanic / Garage', 'Auto Body & Paint', 'Detailing & Wash', 'Diagnostic Services', 'Vehicle Buying (Scrap/Used)', 'Other'], type: 'select' }
  ], titlePlaceholder: 'e.g. 24/7 Towing Service' } }
];

const finalCategories = [...newMotorVehicles, ...filteredData];
const updatedArrayString = JSON.stringify(finalCategories, null, 2);
const finalContent = content.substring(0, startIndex + startStr.length) + '\n' + updatedArrayString.substring(1, updatedArrayString.length - 1) + '\n' + content.substring(endIndex);

fs.writeFileSync('convex/seed.ts', finalContent);
console.log('Successfully rebuilt Motor Vehicles category tree. Removed ' + oldMotorSlugs.size + ' old categories.');
