import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { api, convex } from '@/lib/convex-server';
import {
    Anchor,
    Bike,
    Briefcase,
    Car,
    Globe,
    GraduationCap,
    Home,
    PawPrint,
    Shirt,
    Smartphone,
    Truck,
    Wrench,
    Zap
} from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { cache } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Categories');
  return {
    title: `${t('title')} | Biggest Market`,
    description: t('description'),
  };
}

// Map category slugs to high-quality images (Unsplash)
// Keys MUST match the exact 'slug' field from the seed data
const CATEGORY_IMAGES: Record<string, string> = {
  // 1. Real Estate
  'real-estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
  'flats-apartments': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
  'houses-villas': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
  'land': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
  'commercial-property': 'https://images.unsplash.com/photo-1486406140926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',

  // 2. Vehicles
  'vehicles': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
  'cars': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
  'motorcycles': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
  'trucks-vans': 'https://images.unsplash.com/photo-1586191582110-37d4554b51cc?auto=format&fit=crop&q=80&w=800',
  'boats': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800',

  // 3. Electronics
  'electronics': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
  'mobile-phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
  'computers-laptops': 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800',
  'tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
  'tvs-audio': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800',
  'cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',

  // 4. Jobs
  'jobs': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
  'full-time': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
  'part-time': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
  'freelance': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
  'internships': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',

  // 5. Services
  'services': 'https://images.unsplash.com/photo-1581093458791-9d15482442f6?auto=format&fit=crop&q=80&w=800',
  'home-services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  'business-services': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
  'personal-services': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800',

  // 6. Fashion
  'fashion': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  'mens-clothing': 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=800',
  'womens-clothing': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
  'shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  'accessories': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',

  // 7. Home & Garden
  'home-garden': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
  'furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
  'appliances': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
  'home-decor': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
  'garden-outdoor': 'https://images.unsplash.com/photo-1585320806207-196c8131b254?auto=format&fit=crop&q=80&w=800',

  // 8. Sports & Leisure
  'sports-leisure': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
  'sports-equipment': 'https://images.unsplash.com/photo-1461896836934-bd45ba680baa?auto=format&fit=crop&q=80&w=800',
  'bicycles': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
  'gym-fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',

  // 9. Pets
  'pets': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=800',
  'dogs': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800',
  'cats': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
  'pet-accessories': 'https://images.unsplash.com/photo-1583337130417-13104dec14c3?auto=format&fit=crop&q=80&w=800',

  // 10. Education
  'education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
  'tutoring': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
  'courses': 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
};

// Fallback icon lookup by category name (for cases where image fails to load)
const NAME_TO_ICON: Record<string, any> = {
  'Real Estate': Home,
  'Flats / Apartments': Home,
  'Houses / Villas': Home,
  'Land': Home,
  'Commercial Property': Home,
  'Vehicles': Car,
  'Cars': Car,
  'Motorcycles': Bike,
  'Trucks & Vans': Truck,
  'Boats': Anchor,
  'Electronics': Smartphone,
  'Mobile Phones': Smartphone,
  'Computers & Laptops': Smartphone,
  'Tablets': Smartphone,
  'TVs & Audio': Smartphone,
  'Cameras': Smartphone,
  'Jobs': Briefcase,
  'Full Time': Briefcase,
  'Part Time': Briefcase,
  'Freelance': Briefcase,
  'Internships': Briefcase,
  'Services': Wrench,
  'Home Services': Wrench,
  'Business Services': Wrench,
  'Personal Services': Wrench,
  'Fashion': Shirt,
  "Men's Clothing": Shirt,
  "Women's Clothing": Shirt,
  'Shoes': Shirt,
  'Accessories': Shirt,
  'Home & Garden': Zap,
  'Furniture': Zap,
  'Appliances': Zap,
  'Home Decor': Zap,
  'Garden & Outdoor': Zap,
  'Sports & Leisure': Bike,
  'Sports Equipment': Bike,
  'Bicycles': Bike,
  'Gym & Fitness': Bike,
  'Pets': PawPrint,
  'Dogs': PawPrint,
  'Cats': PawPrint,
  'Pet Accessories': PawPrint,
  'Education': GraduationCap,
  'Tutoring': GraduationCap,
  'Courses': GraduationCap,
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
  const t = await getTranslations('Categories');
  try {
    categories = await getCategories();
  } catch (err) {
    console.error("Failed to load categories:", err);
  }

  return (
    <div className='min-h-screen bg-background dark:bg-background'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
         <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
         <div className='container-wide py-1 sm:py-3 relative'>
            <div className='max-w-7xl mx-auto'>
                <AppBreadcrumbs className="mb-3" />
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
                      {category.totalCount > 0 ? t('items_count', { count: category.totalCount.toLocaleString() }) : t('no_items')}
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
                 <h2 className="text-xl font-bold mb-2">{t('no_categories')}</h2>
                 <p className="text-muted-foreground mb-8 text-sm px-8">
                     {t('no_categories_desc')}
                 </p>
                 <div className="flex flex-col gap-2 px-12">
                     <Link href="/" className="text-primary font-bold text-sm hover:underline">
                        {t('return_home')}
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
