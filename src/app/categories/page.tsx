import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { api, convex } from '@/lib/convex-server';
import {
  Anchor,
  Bike,
  Briefcase,
  Car,
  Globe,
  GraduationCap,
  Hammer,
  Home,
  PawPrint,
  Shirt,
  Smartphone,
  Tractor,
  Truck,
  Wrench,
  Zap
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cache } from 'react';

export const metadata: Metadata = {
  title: 'Categories | Big Market',
  description: 'Browse listings by category',
};

// Map category names to high-quality images (Unsplash)
// Keys must match the 'slug' field in the database
const CATEGORY_IMAGES: Record<string, string> = {
  // 1. Motor Vehicles
  'motor-vehicles': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
  'cars': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
  'motorcycles-above-50cc': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
  'mopeds-under-50cc': 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=800',
  'electric-scooters': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800', // Reusing motorcycle image for now or find better
  'buses': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
  'vans': 'https://images.unsplash.com/photo-1565043589221-1a6fd4970404?auto=format&fit=crop&q=80&w=800', // Generic van/truck
  'trucks': 'https://images.unsplash.com/photo-1586191582110-37d4554b51cc?auto=format&fit=crop&q=80&w=800', // Truck
  'trailers': 'https://images.unsplash.com/photo-1586191582110-37d4554b51cc?auto=format&fit=crop&q=80&w=800', // Reusing truck
  'damaged-vehicles-parts': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800', // Mechanical parts
  'camping-vehicles': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800',
  'agricultural-vehicles': 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=800',

  // 2. Real Estate (Assuming standard slugs if not seen in top list, but good to have defaults)
  'real-estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
  'apartments': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
  'houses': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
  'land': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
  'commercial': 'https://images.unsplash.com/photo-1486406140926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',

  // 3. Heavy Duty
  'heavy-duty-construction': 'https://images.unsplash.com/photo-1581093588401-fbb073d74026?auto=format&fit=crop&q=80&w=800', // Construction
  
  // 4. Boats
  'boats-yachts-jetskis': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800',

  // 5. Electronics (Standard)
  'electronics': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
  'computers': 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800', 
  'mobile-phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',

  // 6. Home & Garden
  'home-garden': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
  'furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
  'garden': 'https://images.unsplash.com/photo-1585320806207-196c8131b254?auto=format&fit=crop&q=80&w=800',
  
  // 7. Fashion
  'fashion': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  'clothing': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',

  // 8. Sports
  'sports-leisure': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',

  // 9. Jobs
  'jobs': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',

  // 10. Services
  'services': 'https://images.unsplash.com/photo-1581093458891-2f3a693246a4?auto=format&fit=crop&q=80&w=800',
};

// Fallback lookup by name if slug missing or different
const NAME_TO_ICON: Record<string, any> = {
  'Motor Vehicles': Car,
  'Cars': Car,
  'Motorcycles': Bike,
  'Real Estate': Home,
  'Heavy Duty / Construction / Forklifts': Tractor,
  'Boats / Yachts / Jet Skis': Anchor,
  'Electronics': Smartphone,
  'Jobs': Briefcase,
  'Home & Garden': Zap,
  'Services': Wrench,
  'Sports & Leisure': Bike,
  'Fashion': Shirt,
  'Pets': PawPrint,
  'Education': GraduationCap,
  'Tools': Hammer,
  'Buses': Truck,
  'Trucks': Truck,
};

// Fetch categories with counts - cached to avoid excessive requests
const getCategories = cache(async () => {
    // 1. Fetch all active categories (flat list)
    // We use the new getWithCounts query which returns counting per slug
    let categoriesWithRawCounts;
    try {
        categoriesWithRawCounts = await convex.query(api.categories.getWithCounts);
    } catch (e) {
        console.error("Error fetching categories:", e);
        return [];
    }
    
    if (!categoriesWithRawCounts || !Array.isArray(categoriesWithRawCounts)) return [];

    // 2. Build Hierarchy & Aggregate Counts
    const categoryMap = new Map<string, any>();
    const roots: any[] = [];

    // First pass: Index all
    categoriesWithRawCounts.forEach((cat: any) => {
        categoryMap.set(cat._id, { ...cat, children: [], totalCount: cat.count || 0 });
    });

    // Second pass: Build tree and aggregate
    // We iterate in reverse to likely hit leaves first if sorted by storage, 
    // but better to just iterate and link parents.
    // Actually, to sum correctly, we need to process children before parents.
    // Let's just build the tree first.
    
    categoriesWithRawCounts.forEach((cat: any) => {
        if (cat.parentId) {
            const parent = categoryMap.get(cat.parentId);
            if (parent) {
                parent.children.push(categoryMap.get(cat._id));
            }
        } else {
            roots.push(categoryMap.get(cat._id));
        }
    });

    // 3. Recursive Count Aggregation
    // 3. Recursive Count Aggregation
    const calculateTotalCount = (node: any): number => {
        let sum = node.count || 0;
        if (node.children && node.children.length > 0) {
            node.children.forEach((child: any) => {
                sum += calculateTotalCount(child);
            });
        }
        node.totalCount = sum;
        return sum;
    };

    roots.forEach(root => calculateTotalCount(root));

    // Sort roots by position or abundance
    return roots.sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0));
});

export default async function CategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await getCategories();
  } catch (err) {
    console.error("Failed to load categories:", err);
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='bg-muted/30 border-b relative overflow-hidden'>
         <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
         <div className='container-wide py-10 sm:py-16 relative'>
            <div className='max-w-7xl mx-auto'>
                <AppBreadcrumbs className="mb-8" />
                <div className='text-center max-w-2xl mx-auto'>
                    <h1 className='text-3xl sm:text-5xl font-black text-foreground mb-4 tracking-tight'>
                        Explore Categories
                    </h1>
                    <p className='text-lg text-muted-foreground font-medium'>
                        Discover thousands of unique items, services, and opportunities across our platform.
                    </p>
                </div>
            </div>
         </div>
      </div>

      <div className='container-wide py-8 sm:py-12'>
        {/* Categories Grid - Mobile: 3 cols, Desktop: Adaptive */}
        <div className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-6'>
          {categories.map((category, index) => {
            const Icon = NAME_TO_ICON[category.name] || Globe;
            const imageUrl = category.image || CATEGORY_IMAGES[category.slug];
            
            return (
              <Link
                key={category._id}
                href={`/listings?category=${encodeURIComponent(category.slug)}`}
                className='group relative flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300'
              >
                {/* Image Area */}
                <div className='relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted'>
                   {imageUrl ? (
                       <Image
                          src={imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                       />
                   ) : (
                       // Fallback Pattern if no image
                       <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                           <Icon className="w-12 h-12 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                       </div>
                   )}
                   
                   {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                   
                   {/* Count Badge (Top Right) */}
                   {category.totalCount > 0 && (
                       <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                           {category.totalCount}
                       </div>
                   )}
                </div>

                {/* Content Area */}
                <div className='p-3 sm:p-4 flex flex-col gap-0.5 relative bg-card'>
                   <h3 className='font-bold text-sm sm:text-base leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2'>
                     {category.name}
                   </h3>
                   <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                      {category.totalCount > 0 ? `${category.totalCount.toLocaleString()} items` : 'No items yet'}
                   </p>
                </div>
              </Link>
            );
          })}
        </div>
        
        {categories.length === 0 && (
             <div className="text-center py-24 bg-card border border-border/50 rounded-3xl max-w-lg mx-auto">
                 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-muted-foreground/30" />
                 </div>
                 <h2 className="text-xl font-bold mb-2">No categories found</h2>
                 <p className="text-muted-foreground mb-8 text-sm px-8">
                     We couldn't load any categories. If this is a new environment, you may need to seed the database.
                 </p>
                 <div className="flex flex-col gap-2 px-12">
                     <Link href="/" className="text-primary font-bold text-sm hover:underline">
                        Return Home
                     </Link>
                     <p className="text-[10px] text-muted-foreground mt-4">
                        Admin: Run `npx convex run seed:seedCategories` to populate data.
                     </p>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
}
