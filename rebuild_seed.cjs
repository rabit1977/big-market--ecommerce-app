const fs = require('fs');

const content = fs.readFileSync('convex/seed.ts', 'utf8');

// The array starts at `const categoriesData = [`
const startStr = 'const categoriesData = [';
const startIndex = content.indexOf(startStr);
if (startIndex === -1) throw new Error('Array start not found');

// Find the end of the array which is followed by `export const seedCategories`
const endStr = '];\n\nexport const seedCategories';
const endIndex = content.indexOf(endStr);
if (endIndex === -1) throw new Error('Array end not found');

const arrayContent = content.substring(startIndex + startStr.length - 1, endIndex + 1);

// We need to evaluate the array
// It's a standard JS array but might contain trailing commas which eval handles fine.
// Put it inside a function to return it.
let categoriesData;
try {
  categoriesData = eval(`(${arrayContent})`);
} catch (e) {
  console.error("Syntax Error during eval:", e);
  process.exit(1);
}

// Ensure "Other" categories logic is correct
// User also requested new subcategories for:
// - Watches and Jewelry
// - Health, Beauty and Equipment
// - Books and Literature
// - Office and School Supplies
// - Baby and Children's Products (Brand new root category)
// Also I accidentally deleted Computers children earlier (Laptops, Desktop Computers, Monitors)

const newCategories = [
  // --- Computers ---
  { name: 'Laptops', slug: 'laptops', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'computers', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used', 'For Parts'], type: 'select' }, { key: 'brand', label: 'Brand', options: ['Apple', 'Lenovo', 'HP', 'Dell', 'ASUS', 'Acer', 'MSI', 'Samsung', 'Toshiba', 'Other'], type: 'select' }, { key: 'processor', label: 'Processor', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3', 'Other'], type: 'select' }, { key: 'ram_gb', label: 'RAM (GB)', options: ['4', '8', '16', '32', '64'], type: 'select' }, { key: 'storage_gb', label: 'Storage (GB)', options: ['128', '256', '512', '1024', '2048'], type: 'select' }, { key: 'storage_type', label: 'Storage Type', options: ['SSD', 'HDD', 'SSD + HDD'], type: 'select' }, { key: 'screen_size_inch', label: 'Screen Size (inch)', placeholder: 'Inch', type: 'number' }, { key: 'gpu', label: 'GPU', options: ['Integrated', 'NVIDIA GTX', 'NVIDIA RTX', 'AMD Radeon', 'Other'], type: 'select' }, { key: 'color', label: 'Color', placeholder: 'Color', type: 'text' }], titlePlaceholder: 'e.g. Lenovo ThinkPad i7 16GB 512GB SSD' } },
  { name: 'Desktop Computers', slug: 'desktop-computers', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'computers', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used', 'For Parts'], type: 'select' }, { key: 'brand', label: 'Brand', options: ['HP', 'Dell', 'Lenovo', 'ASUS', 'Acer', 'Custom Built', 'Other'], type: 'select' }, { key: 'processor', label: 'Processor', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Other'], type: 'select' }, { key: 'ram_gb', label: 'RAM (GB)', options: ['4', '8', '16', '32', '64', '128'], type: 'select' }, { key: 'storage_gb', label: 'Storage (GB)', options: ['128', '256', '512', '1024', '2048'], type: 'select' }, { key: 'storage_type', label: 'Storage Type', options: ['SSD', 'HDD', 'SSD + HDD'], type: 'select' }, { key: 'gpu', label: 'GPU', options: ['Integrated', 'NVIDIA GTX 1060', 'NVIDIA GTX 1660', 'NVIDIA RTX 3060', 'NVIDIA RTX 3080', 'NVIDIA RTX 4090', 'AMD Radeon RX 580', 'AMD Radeon RX 6700', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. Custom PC i7 32GB RTX 3070' } },
  { name: 'Monitors', slug: 'monitors', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'computers', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used', 'Damaged'], type: 'select' }, { key: 'brand', label: 'Brand', options: ['Samsung', 'LG', 'Dell', 'ASUS', 'BenQ', 'Acer', 'AOC', 'ViewSonic', 'Other'], type: 'select' }, { key: 'screen_size_inch', label: 'Screen Size (inch)', placeholder: 'Inch', type: 'number' }, { key: 'resolution', label: 'Resolution', options: ['1080p Full HD', '1440p 2K QHD', '4K Ultra HD', '5K', '8K'], type: 'select' }, { key: 'panel_type', label: 'Panel Type', options: ['IPS', 'VA', 'TN', 'OLED'], type: 'select' }, { key: 'refresh_rate_hz', label: 'Refresh Rate (Hz)', options: ['60', '75', '100', '120', '144', '165', '240', '360'], type: 'select' }, { key: 'curved', label: 'Curved', options: ['Yes', 'No'], type: 'select' }], titlePlaceholder: 'e.g. Samsung 27" 4K 144Hz IPS Monitor' } },
  { name: 'Computer Parts & Accessories', slug: 'computer-parts', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'computers', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Keyboard', 'Mouse', 'Motherboard', 'RAM', 'CPU', 'Graphics Card', 'Power Supply', 'Case', 'Cooling', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. Logitech MX Master 3 Mouse' } },
  { name: 'Networking Equipment', slug: 'networking', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'computers', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Routers', 'Switches', 'Modems', 'Cables', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. TP-Link Archer AX50' } },

  // --- Watches and Jewelry ---
  { name: "Men's Watches", slug: 'mens-watches', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'watches-jewelry', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'brand', label: 'Brand', options: ['Rolex', 'Casio', 'Seiko', 'Fossil', 'Citizen', 'Tissot', 'Omega', 'Tag Heuer', 'Other'], type: 'select' }, { key: 'movement', label: 'Movement', options: ['Automatic', 'Quartz', 'Manual', 'Smartwatch'], type: 'select' }], titlePlaceholder: 'e.g. Casio G-Shock' } },
  { name: "Women's Watches", slug: 'womens-watches', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'watches-jewelry', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'brand', label: 'Brand', options: ['Michael Kors', 'Casio', 'Fossil', 'Swarovski', 'Guess', 'DKNY', 'Other'], type: 'select' }, { key: 'movement', label: 'Movement', options: ['Automatic', 'Quartz', 'Manual', 'Smartwatch'], type: 'select' }], titlePlaceholder: 'e.g. Michael Kors Rose Gold Watch' } },
  { name: 'Jewelry', slug: 'jewelry', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'watches-jewelry', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Rings', 'Necklaces & Pendants', 'Earrings', 'Bracelets', 'Brooches', 'Other'], type: 'select' }, { key: 'material', label: 'Material', options: ['Gold', 'Silver', 'Platinum', 'Steel', 'Costume / Fashion', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. 14k Gold Necklace' } },
  { name: 'Smartwatches', slug: 'smartwatches-jewelry', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'watches-jewelry', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used', 'Damaged'], type: 'select' }, { key: 'brand', label: 'Brand', options: ['Apple', 'Samsung', 'Garmin', 'Xiaomi', 'Fitbit', 'Huawei', 'Amazfit', 'Other'], type: 'select' }, { key: 'compatibility', label: 'Compatibility', options: ['iOS', 'Android', 'Both'], type: 'select' }, { key: 'color', label: 'Color', placeholder: 'Color', type: 'text' }], titlePlaceholder: 'e.g. Apple Watch Series 9 45mm' } },

  // --- Health, Beauty and Equipment ---
  { name: 'Makeup & Cosmetics', slug: 'makeup-cosmetics', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'health-beauty', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New (Sealed)', 'New (Open Box)'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Face', 'Eyes', 'Lips', 'Nails', 'Sets & Palettes', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. MAC Lipstick Red' } },
  { name: 'Perfumes & Fragrances', slug: 'perfumes', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'health-beauty', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New (Sealed)', 'New (Open Box)', 'Used'], type: 'select' }, { key: 'gender', label: 'Gender', options: ['Women', 'Men', 'Unisex'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }, { key: 'volume_ml', label: 'Volume (ml)', placeholder: 'ml', type: 'number' }], titlePlaceholder: 'e.g. Chanel No.5 100ml' } },
  { name: 'Hair Care', slug: 'hair-care', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'health-beauty', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Shampoo & Conditioner', 'Treatments & Masks', 'Styling Products', 'Hair Dye', 'Hair Extensions & Wigs', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. Kerastase Hair Mask' } },
  { name: 'Skincare', slug: 'skincare', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'health-beauty', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Face Cream', 'Serums & Oils', 'Cleansers & Toners', 'Masks', 'Body Care', 'Sunscreen', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. La Roche-Posay Sunscreen' } },
  { name: 'Beauty Appliances', slug: 'beauty-appliances', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'health-beauty', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Hair Dryers', 'Straighteners & Curlers', 'Epilators', 'Trimmers & Clippers', 'Facial Tool', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. Dyson Airwrap' } },
  { name: 'Medical & Massage Equipment', slug: 'medical-massage', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'health-beauty', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Massage Chairs', 'Handheld Massagers', 'Blood Pressure Monitors', 'Thermometers', 'Mobility Aids', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. Omron Blood Pressure Monitor' } },

  // --- Books and Literature ---
  { name: 'Fiction', slug: 'fiction-books', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'books-literature', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Good', 'Acceptable'], type: 'select' }, { key: 'genre', label: 'Genre', options: ['Romance', 'Thriller & Mystery', 'Sci-Fi & Fantasy', 'Historical Fiction', 'Literature', 'Other'], type: 'select' }, { key: 'language', label: 'Language', options: ['Macedonian', 'English', 'Albanian', 'Serbian', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. Harry Potter by J.K. Rowling' } },
  { name: 'Non-Fiction', slug: 'non-fiction-books', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'books-literature', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Good', 'Acceptable'], type: 'select' }, { key: 'topic', label: 'Topic', options: ['Biography & Autobiography', 'History', 'Self-Help & Psychology', 'Business & Economics', 'Cooking', 'Art & Photography', 'Other'], type: 'select' }, { key: 'language', label: 'Language', options: ['Macedonian', 'English', 'Albanian', 'Serbian', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. Atomic Habits by James Clear' } },
  { name: 'Educational & Textbooks', slug: 'textbooks', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'books-literature', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Good', 'Acceptable'], type: 'select' }, { key: 'level', label: 'Education Level', options: ['Primary School', 'High School', 'University', 'Language Learning', 'Professional Certification', 'Other'], type: 'select' }, { key: 'subject', label: 'Subject', placeholder: 'e.g. Math, Programming, Medical', type: 'text' }], titlePlaceholder: 'e.g. High School Math Textbook' } },
  { name: "Children's Books", slug: 'childrens-books', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'books-literature', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Good', 'Acceptable'], type: 'select' }, { key: 'age_group', label: 'Age Group', options: ['0-3 Years', '3-5 Years', '6-8 Years', '9-12 Years', 'Teens'], type: 'select' }, { key: 'language', label: 'Language', options: ['Macedonian', 'English', 'Albanian', 'Serbian', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. Peppa Pig Storybook' } },
  { name: 'Magazines & Comics', slug: 'magazines-comics', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'books-literature', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Good', 'Acceptable'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Comics / Manga', 'Magazines', 'Journals', 'Newspapers', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. Spider-Man Comic 1999' } },

  // --- Office and School Supplies ---
  { name: 'Office Supplies', slug: 'office-supplies-cat', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'office-school-supplies', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Paper & Notebooks', 'Archiving & Folders', 'Desk Accessories', 'Markers & Pens', 'Envelopes & Shipping', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. A4 Printer Paper 500 sheets' } },
  { name: 'School Supplies', slug: 'school-supplies', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'office-school-supplies', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Backpacks & Bags', 'Pencil Cases', 'Notebooks & Diaries', 'Drawing & Art Supplies', 'Geometry Sets', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. Anatomical School Backpack' } },
  { name: 'Printers, Ink & Toner', slug: 'printers-ink', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'office-school-supplies', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Printers', 'Scanners', 'Ink Cartridges', 'Toner Cartridges', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', options: ['HP', 'Canon', 'Epson', 'Brother', 'Samsung', 'Lexmark', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. HP LaserJet Pro M15w' } },
  { name: 'Calculators & Electronics', slug: 'office-electronics', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'office-school-supplies', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' }, { key: 'item_type', label: 'Type', options: ['Scientific Calculators', 'Basic Calculators', 'Laminators', 'Paper Shredders', 'Binding Machines', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. Casio Scientific Calculator' } },

  // --- Baby and Children's Products (NEW ROOT) ---
  { name: "Baby and Children's Products", slug: 'baby-children', description: '', image: '', isActive: true, isFeatured: true, parentSlug: null, template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' }, { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' }], titlePlaceholder: 'e.g. Baby Item' } },
  { name: 'Toys & Games', slug: 'toys-games', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'baby-children', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'age_group', label: 'Age Group', options: ['0-12 Months', '1-3 Years', '3-5 Years', '6-9 Years', '10+ Years'], type: 'select' }, { key: 'type', label: 'Type', options: ['Educational', 'Building Blocks / LEGO', 'Dolls & Action Figures', 'Cars & RC Toys', 'Board Games & Puzzles', 'Plush Toys', 'Outdoor Toys', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand (e.g. LEGO, Fisher-Price)', type: 'text' }], titlePlaceholder: 'e.g. LEGO City Fire Station' } },
  { name: 'Strollers & Carriers', slug: 'strollers-carriers', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'baby-children', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'type', label: 'Type', options: ['Standard Stroller', 'Travel System (2-in-1 / 3-in-1)', 'Umbrella Stroller', 'Twin/Double Stroller', 'Baby Carrier / Wrap', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', options: ['Stokke', 'Cybex', 'Chicco', 'Maclaren', 'Maxi-Cosi', 'Peg Perego', 'Graco', 'Other'], type: 'select' }], titlePlaceholder: 'e.g. Cybex Priam 3-in-1 Stroller' } },
  { name: 'Nursery Furniture & Room', slug: 'nursery-furniture', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'baby-children', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'type', label: 'Type', options: ['Cribs & Beds', 'Dressers & Changing Tables', 'Mattresses', 'High Chairs', 'Playpens', 'Bouncers & Swings', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. Wooden Baby Crib with Mattress' } },
  { name: 'Baby Feeding', slug: 'baby-feeding', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'baby-children', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'type', label: 'Type', options: ['Breast Pumps', 'Bottles & Sterilizers', 'Food Processors / Warmers', 'Cups & Utensils', 'Bibs', 'Other'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand (e.g. Philips Avent, Medela)', type: 'text' }], titlePlaceholder: 'e.g. Philips Avent Steam Sterilizer' } },
  { name: 'Baby Care & Safety', slug: 'baby-care-safety', description: '', image: '', isActive: true, isFeatured: false, parentSlug: 'baby-children', template: { fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Like New', 'Used'], type: 'select' }, { key: 'type', label: 'Type', options: ['Baby Monitors', 'Bath Tubs & Accessories', 'Thermometers & Health', 'Safety Gates', 'Car Seats', 'Other'], type: 'select' }, { key: 'car_seat_group', label: 'Car Seat Group', options: ['0+ (0-13kg)', '1 (9-18kg)', '2/3 (15-36kg)', 'All-in-One', 'N/A'], type: 'select' }, { key: 'brand', label: 'Brand', placeholder: 'Brand', type: 'text' }], titlePlaceholder: 'e.g. Maxi-Cosi CabrioFix Car Seat' } },
];

for (const c of newCategories) {
  // Prevent duplicate insertion
  if (!categoriesData.find(x => x.slug === c.slug)) {
    categoriesData.push(c);
  }
}

// Add generic "Other x" category for each of these roots if they don't exist
const extraRoots = [
  { name: 'Other Audio/Video', slug: 'other-tv-audio-video', parentSlug: 'tv-audio-video'},
  { name: 'Other Watch/Jewelry', slug: 'other-watches-jewelry', parentSlug: 'watches-jewelry'},
  { name: 'Other Health/Beauty', slug: 'other-health-beauty', parentSlug: 'health-beauty'},
  { name: 'Other Books/Literature', slug: 'other-books-literature', parentSlug: 'books-literature'},
  { name: 'Other Office/School', slug: 'other-office-school', parentSlug: 'office-school-supplies'},
  { name: 'Other Baby/Children', slug: 'other-baby-children', parentSlug: 'baby-children'},
  { name: 'Other Computers', slug: 'other-computers', parentSlug: 'computers'},
];

for (const e of extraRoots) {
  if (!categoriesData.find(x => x.slug === e.slug)) {
    categoriesData.push({
      name: e.name,
      slug: e.slug,
      description: '',
      image: '',
      isActive: true,
      isFeatured: false,
      parentSlug: e.parentSlug,
      template: {
        fields: [{ key: 'condition', label: 'Condition', options: ['New', 'Used'], type: 'select' }, { key: 'description', label: 'Description', placeholder: 'Details...', type: 'textarea' }],
        titlePlaceholder: 'e.g. ' + e.name
      }
    });
  }
}

// NOW WE SORT
// For sorting:
// - Roots should remain in their original order, maybe at the top.
// - Children should be grouped by their parent.
// - Within each children group, categories with name starting with "Other" or slug containing 'other' should be at the BOTTOM.

// Group by parent
const byParent = {};
for (const cat of categoriesData) {
  const p = cat.parentSlug || 'root';
  if (!byParent[p]) byParent[p] = [];
  byParent[p].push(cat);
}

// Sort each group
for (const parentSlug of Object.keys(byParent)) {
  if (parentSlug === 'root') continue; // keep roots in order
  byParent[parentSlug].sort((a, b) => {
    const aIsOther = a.name.startsWith('Other') || a.name === 'Other' || a.slug.includes('-other') || a.slug.startsWith('other-');
    const bIsOther = b.name.startsWith('Other') || b.name === 'Other' || b.slug.includes('-other') || b.slug.startsWith('other-');
    
    // Sort "Other" to the bottom
    if (aIsOther && !bIsOther) return 1;
    if (!aIsOther && bIsOther) return -1;
    
    // Otherwise alphabetical (optional) or original order (stable sort in V8 anyway, but let's leave it mostly)
    return 0; // preserve original order if both same type
  });
}

// Flatten back
const newCategoriesData = [];
// Put roots first
newCategoriesData.push(...byParent['root']);
// Check all roots from the array instead of object keys, to maintain hierarchy grouped visually
// Wait, putting roots first, then all children sequentially makes JSON huge but easy to read. 
// A better visual grouping is: Root immediately followed by its children.
const finalCategoriesData = [];
for (const root of byParent['root']) {
  finalCategoriesData.push(root);
  if (byParent[root.slug]) {
    finalCategoriesData.push(...byParent[root.slug]);
    
    // Check for grandchildren
    for (const child of byParent[root.slug]) {
      if (byParent[child.slug]) {
        // Grandchildren also sort by other
        byParent[child.slug].sort((a, b) => {
          const aIsOther = a.name.startsWith('Other') || a.slug.includes('other');
          const bIsOther = b.name.startsWith('Other') || b.slug.includes('other');
          if (aIsOther && !bIsOther) return 1;
          if (!aIsOther && bIsOther) return -1;
          return 0;
        });
        finalCategoriesData.push(...byParent[child.slug]);
      }
    }
  }
}

// Construct string manually to keep format beautiful like JS object literal (or JSON)
// JSON stringify is preferred and totally valid TS.
const updatedArrayString = JSON.stringify(finalCategoriesData, null, 2);

// Reconstruct the file content
const finalContent = content.substring(0, startIndex + startStr.length) + '\n' + updatedArrayString.substring(1, updatedArrayString.length - 1) + '\n' + content.substring(endIndex);

fs.writeFileSync('convex/seed.ts', finalContent);
console.log('Successfully updated convex/seed.ts');
