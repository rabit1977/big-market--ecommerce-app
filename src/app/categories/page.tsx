import { api, convex } from '@/lib/convex-server';
import {
    Bike,
    Briefcase,
    Car,
    Globe,
    Home,
    Music,
    ShoppingBag,
    Smartphone,
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
const CATEGORY_IMAGES: Record<string, string> = {
  'motor-vehicles': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
  'real-estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
  'home-appliances': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=800',
  'home-and-garden': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
  'fashion-clothing-shoes': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  'mobile-phones-accessories': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
  'computers': 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800',
  'tv-audio-video': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
  'musical-instruments-equipment': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
  'watches-jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
  'baby-children-products': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800',
  'sports-activities': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
  'health-beauty': 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
  'books-literature': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
  'office-school-supplies': 'https://images.unsplash.com/photo-1576402120038-f80e9803bba8?auto=format&fit=crop&q=80&w=800',
  'hobby-animals': 'https://images.unsplash.com/photo-1579308018265-288252251fd4?auto=format&fit=crop&q=80&w=800',
  'antiques-art': 'https://images.unsplash.com/photo-1555580436-07978253a633?auto=format&fit=crop&q=80&w=800',
  'business-machines-tools': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
  'food-cooking': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
  'shops-trade': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
  'services-repairs': 'https://images.unsplash.com/photo-1581093458891-2f3a693246a4?auto=format&fit=crop&q=80&w=800',
  'employment': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
  'events-nightlife': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
  'vacation-tourism': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
  'personal-contacts': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
  'napravete-sami': 'https://images.unsplash.com/photo-1503387837-b65c3f356390?auto=format&fit=crop&q=80&w=800',
};

// Fallback lookup by name if slug missing or different
const NAME_TO_ICON: Record<string, any> = {
  'Vehicles': Car,
  'Real Estate': Home,
  'Electronics': Smartphone,
  'Jobs': Briefcase,
  'Home & Garden': Zap,
  'Services': Wrench,
  'Sport': Bike,
  'Shopping': ShoppingBag,
  'Music': Music,
};

// Fetch categories with counts - cached to avoid excessive requests
const getCategories = cache(async () => {
    // 1. Fetch all active categories (flat list)
    // We use the new getWithCounts query which returns counting per slug
    const categoriesWithRawCounts = await convex.query(api.categories.getWithCounts);

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
  const categories = await getCategories();

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='bg-muted/30 border-b relative overflow-hidden'>
         <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
         <div className='container-wide py-12 sm:py-20 relative'>
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

      <div className='container-wide py-8 sm:py-12'>
        {/* Categories Grid - Mobile: 2 cols, Desktop: Adaptive */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6'>
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
             <div className="text-center py-20 text-muted-foreground">
                 <p>No categories found.</p>
             </div>
        )}

      </div>
    </div>
  );
}
