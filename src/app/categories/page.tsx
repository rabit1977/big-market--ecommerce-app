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
  Zap,
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
  'real-estate': 'https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg',
  'flats-apartments': 'https://cdn.pixabay.com/photo/2014/08/11/21/40/bedroom-416062_1280.jpg',
  'houses-villas': 'https://cdn.pixabay.com/photo/2017/04/10/22/28/residence-2219972_1280.jpg',
  land: 'https://cdn.pixabay.com/photo/2015/03/26/09/41/tielet-690084_1280.jpg',
  'commercial-property': 'https://cdn.pixabay.com/photo/2014/11/11/22/50/architecture-527633_1280.jpg',

  // 2. Vehicles
  vehicles: 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg',
  cars: 'https://cdn.pixabay.com/photo/2014/09/07/22/34/car-race-438467_1280.jpg',
  motorcycles: 'https://cdn.pixabay.com/photo/2016/04/07/06/53/bmw-1313343_1280.jpg',
  'trucks-vans': 'https://cdn.pixabay.com/photo/2015/09/25/11/12/truck-957173_1280.jpg',
  boats: 'https://cdn.pixabay.com/photo/2016/11/23/18/28/boat-1854271_1280.jpg',

  // 3. Electronics
  electronics: 'https://cdn.pixabay.com/photo/2015/01/08/18/25/desk-593327_1280.jpg',
  'mobile-phones': 'https://cdn.pixabay.com/photo/2014/08/05/10/27/iphone-410311_1280.jpg',
  'computers-laptops': 'https://cdn.pixabay.com/photo/2015/05/31/10/55/man-791049_1280.jpg',
  tablets: 'https://cdn.pixabay.com/photo/2014/08/05/10/27/iphone-410311_1280.jpg',
  'tvs-audio': 'https://cdn.pixabay.com/photo/2017/04/24/09/35/sound-2255760_1280.jpg',
  cameras: 'https://cdn.pixabay.com/photo/2014/08/29/14/53/camera-431119_1280.jpg',

  // 4. Jobs  
  jobs: 'https://cdn.pixabay.com/photo/2018/02/16/10/52/industry-3157431_1280.jpg',
  'full-time': 'https://cdn.pixabay.com/photo/2018/02/16/10/52/industry-3157431_1280.jpg',
  'part-time': 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
  freelance: 'https://cdn.pixabay.com/photo/2015/01/08/18/25/desk-593327_1280.jpg',
  internships: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',

  // 5. Services
  services: 'https://cdn.pixabay.com/photo/2015/12/08/10/37/hands-1082596_1280.jpg',
  'home-services': 'https://cdn.pixabay.com/photo/2016/08/26/15/06/home-1622401_1280.jpg',
  'business-services': 'https://cdn.pixabay.com/photo/2018/02/16/10/52/industry-3157431_1280.jpg',
  'personal-services': 'https://cdn.pixabay.com/photo/2014/12/16/22/25/youth-570881_1280.jpg',

  // 6. Fashion
  fashion: 'https://cdn.pixabay.com/photo/2016/11/22/19/08/hangers-1850082_1280.jpg',
  'mens-clothing': 'https://cdn.pixabay.com/photo/2015/09/02/13/24/man-919045_1280.jpg',
  'womens-clothing': 'https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg',
  shoes: 'https://cdn.pixabay.com/photo/2014/10/22/16/23/shoes-489958_1280.jpg',
  accessories: 'https://cdn.pixabay.com/photo/2015/08/25/11/58/sunglasses-906532_1280.jpg',

  // 7. Home & Garden
  'home-garden': 'https://cdn.pixabay.com/photo/2016/08/26/15/06/home-1622401_1280.jpg',
  furniture: 'https://cdn.pixabay.com/photo/2017/08/27/10/16/interior-2685521_1280.jpg',
  appliances: 'https://cdn.pixabay.com/photo/2014/07/10/17/17/washing-machine-389273_1280.jpg',
  'home-decor': 'https://cdn.pixabay.com/photo/2015/04/10/17/03/pots-716579_1280.jpg',
  'garden-outdoor': 'https://cdn.pixabay.com/photo/2017/05/19/22/41/gardening-2327666_1280.jpg',

  // 8. Sports & Leisure
  'sports-leisure': 'https://cdn.pixabay.com/photo/2015/01/26/22/40/child-613199_1280.jpg',
  'sports-equipment': 'https://cdn.pixabay.com/photo/2014/04/17/23/26/tennis-326523_1280.jpg',
  bicycles: 'https://cdn.pixabay.com/photo/2016/11/18/12/46/bicycle-1834265_1280.jpg',
  'gym-fitness': 'https://cdn.pixabay.com/photo/2016/11/22/22/25/abs-1850926_1280.jpg',

  // 9. Pets
  pets: 'https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_1280.jpg',
  dogs: 'https://cdn.pixabay.com/photo/2016/02/19/15/46/labrador-retriever-1210559_1280.jpg',
  cats: 'https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_1280.jpg',
  'pet-accessories': 'https://cdn.pixabay.com/photo/2016/10/15/12/01/dog-1742295_1280.jpg',

  // 10. Education
  education: 'https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_1280.jpg',
  tutoring: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
  courses: 'https://cdn.pixabay.com/photo/2015/07/19/10/00/school-work-851328_1280.jpg',
};

// Fallback icon lookup by category name (for cases where image fails to load)
const NAME_TO_ICON: Record<string, any> = {
  'Real Estate': Home,
  'Flats / Apartments': Home,
  'Houses / Villas': Home,
  Land: Home,
  'Commercial Property': Home,
  Vehicles: Car,
  Cars: Car,
  Motorcycles: Bike,
  'Trucks & Vans': Truck,
  Boats: Anchor,
  Electronics: Smartphone,
  'Mobile Phones': Smartphone,
  'Computers & Laptops': Smartphone,
  Tablets: Smartphone,
  'TVs & Audio': Smartphone,
  Cameras: Smartphone,
  Jobs: Briefcase,
  'Full Time': Briefcase,
  'Part Time': Briefcase,
  Freelance: Briefcase,
  Internships: Briefcase,
  Services: Wrench,
  'Home Services': Wrench,
  'Business Services': Wrench,
  'Personal Services': Wrench,
  Fashion: Shirt,
  "Men's Clothing": Shirt,
  "Women's Clothing": Shirt,
  Shoes: Shirt,
  Accessories: Shirt,
  'Home & Garden': Zap,
  Furniture: Zap,
  Appliances: Zap,
  'Home Decor': Zap,
  'Garden & Outdoor': Zap,
  'Sports & Leisure': Bike,
  'Sports Equipment': Bike,
  Bicycles: Bike,
  'Gym & Fitness': Bike,
  Pets: PawPrint,
  Dogs: PawPrint,
  Cats: PawPrint,
  'Pet Accessories': PawPrint,
  Education: GraduationCap,
  Tutoring: GraduationCap,
  Courses: GraduationCap,
};

// Fetch categories with counts - cached to avoid excessive requests
const getCategories = cache(async () => {
  // 1. Fetch all active categories (flat list)
  // We use the new getWithCounts query which returns counting per slug
  let categoriesWithRawCounts;
  try {
    categoriesWithRawCounts = await convex.query(api.categories.getWithCounts);
  } catch (e) {
    console.error('Error fetching categories:', e);
    return [];
  }

  if (!categoriesWithRawCounts || !Array.isArray(categoriesWithRawCounts))
    return [];

  // 2. Build Hierarchy & Aggregate Counts
  const categoryMap = new Map<string, any>();
  const roots: any[] = [];

  // First pass: Index all
  categoriesWithRawCounts.forEach((cat: any) => {
    categoryMap.set(cat._id, {
      ...cat,
      children: [],
      totalCount: cat.count || 0,
    });
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

  roots.forEach((root) => calculateTotalCount(root));

  // Sort roots by position or abundance
  return roots.sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0));
});

export default async function CategoriesPage() {
  let categories: any[] = [];
  const t = await getTranslations('Categories');
  try {
    categories = await getCategories();
  } catch (err) {
    console.error('Failed to load categories:', err);
  }

  return (
    <div className='min-h-screen bg-background dark:bg-background'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]' />
        <div className='container-wide pt-3 sm:pt-5 relative'>
          <div className='max-w-7xl mx-auto'></div>
        </div>
      </div>

      <div className='container-wide'>
        {/* Categories Grid - Mobile: 2 cols, Desktop: Adaptive */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6'>
          {categories.map((category, index) => {
            const Icon = NAME_TO_ICON[category.name] || Globe;
            const imageUrl = category.image || CATEGORY_IMAGES[category.slug];

            return (
              <Link
                key={category._id}
                href={`/listings?category=${encodeURIComponent(category.slug)}`}
                className='group relative flex flex-col rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300 aspect-square sm:aspect-[4/3] bg-muted shadow-sm border border-border/30'
              >
                {/* Full-Cover Background Image Area */}
                <div className='absolute inset-0 z-0'>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:scale-110'
                      sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw'
                    />
                  ) : (
                    <div className='absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center group-hover:bg-primary/5 transition-colors'>
                      <Icon className='w-12 h-12 text-muted-foreground/30 group-hover:text-primary/50 transition-colors mb-4' />
                    </div>
                  )}

                  {/* Gradient Overlay for Top/Bottom Contrast -> full spread for centering */}
                  <div className='absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors' />
                </div>

                {/* Content Overlay (Centered) */}
                <div className='relative z-10 flex flex-col items-center justify-center p-4 w-full h-full text-center'>
                  <h3 className='font-bold text-[18px] sm:text-xl leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-110 duration-500'>
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className='text-center py-24 bg-card border border-border/50 rounded-3xl max-w-lg mx-auto'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6'>
              <Globe className='w-8 h-8 text-muted-foreground/30' />
            </div>
            <h2 className='text-xl font-bold mb-2'>{t('no_categories')}</h2>
            <p className='text-muted-foreground mb-8 text-sm px-8'>
              {t('no_categories_desc')}
            </p>
            <div className='flex flex-col gap-2 px-12'>
              <Link
                href='/'
                className='text-primary font-bold text-sm hover:underline'
              >
                {t('return_home')}
              </Link>
              <p className='text-[10px] text-muted-foreground mt-4'>
                Admin: Run `npx convex run seed:seedCategories` to populate
                data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
