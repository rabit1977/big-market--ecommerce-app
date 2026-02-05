'use client';

import { Card } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Baby as BabyIcon,
  Book,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  Car,
  ChevronRight,
  CircleEllipsis,
  Computer,
  Disc,
  Dumbbell,
  Shirt as Fashion,
  Guitar,
  Heart,
  Home,
  LucideIcon,
  Palette,
  Plane,
  ShoppingBag,
  Smartphone,
  Sofa,
  Users,
  Utensils,
  Watch,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isFeatured: boolean;
  parentId?: string;
  _creationTime: number;
}

interface CategoryGridProps {
  categories: Category[];
}

// Icon mapping for categories (matching actual DB slugs)
const categoryIcons: Record<string, LucideIcon> = {
  'motor-vehicles': Car,
  'real-estate': Home,
  'home-appliances': ShoppingBag, // Or a better icon if available
  'home-and-garden': Sofa,
  'fashion-clothing-shoes': Fashion,
  'mobile-phones-accessories': Smartphone,
  'computers': Computer,
  'tv-audio-video': Camera,
  'musical-instruments-equipment': Guitar,
  'watches-jewelry': Watch,
  'baby-children-products': BabyIcon,
  'health-beauty': Heart,
  'multimedia-movies': Disc,
  'books-literature': Book,
  'office-school-supplies': Briefcase,
  'hobby-animals': Palette,
  'sports-activities': Dumbbell,
  'antiques-art': Palette,
  'business-machines-tools': Building2,
  'food-cooking': Utensils,
  'shops-trade': ShoppingBag,
  'services-repairs': Wrench,
  'employment': Briefcase,
  'events-nightlife': Calendar,
  'vacation-tourism': Plane,
  'personal-contacts': Users,
  'napravete-sami': Wrench, // DIY
  'other': CircleEllipsis,
};

// Color mapping for categories
const categoryColors: Record<string, string> = {
  'motor-vehicles': 'from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border-blue-500/20',
  'real-estate': 'from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10 border-green-500/20',
  'home-appliances': 'from-indigo-500/10 to-indigo-600/5 hover:from-indigo-500/20 hover:to-indigo-600/10 border-indigo-500/20',
  'home-and-garden': 'from-orange-500/10 to-orange-600/5 hover:from-orange-500/20 hover:to-orange-600/10 border-orange-500/20',
  'fashion-clothing-shoes': 'from-pink-500/10 to-pink-600/5 hover:from-pink-500/20 hover:to-pink-600/10 border-pink-500/20',
  'mobile-phones-accessories': 'from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10 border-purple-500/20',
  'computers': 'from-cyan-500/10 to-cyan-600/5 hover:from-cyan-500/20 hover:to-cyan-600/10 border-cyan-500/20',
  'tv-audio-video': 'from-indigo-500/10 to-indigo-600/5 hover:from-indigo-500/20 hover:to-indigo-600/10 border-indigo-500/20',
  'musical-instruments-equipment': 'from-rose-500/10 to-rose-600/5 hover:from-rose-500/20 hover:to-rose-600/10 border-rose-500/20',
  'watches-jewelry': 'from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/10 border-amber-500/20',
  'baby-children-products': 'from-yellow-500/10 to-yellow-600/5 hover:from-yellow-500/20 hover:to-yellow-600/10 border-yellow-500/20',
  'health-beauty': 'from-red-500/10 to-red-600/5 hover:from-red-500/20 hover:to-red-600/10 border-red-500/20',
  'multimedia-movies': 'from-zinc-500/10 to-zinc-600/5 hover:from-zinc-500/20 hover:to-zinc-600/10 border-zinc-500/20',
  'books-literature': 'from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/20 hover:to-emerald-600/10 border-emerald-500/20',
  'office-school-supplies': 'from-slate-500/10 to-slate-600/5 hover:from-slate-500/20 hover:to-slate-600/10 border-slate-500/20',
  'hobby-animals': 'from-lime-500/10 to-lime-600/5 hover:from-lime-500/20 hover:to-lime-600/10 border-lime-500/20',
  'sports-activities': 'from-sky-500/10 to-sky-600/5 hover:from-sky-500/20 hover:to-sky-600/10 border-sky-500/20',
  'antiques-art': 'from-fuchsia-500/10 to-fuchsia-600/5 hover:from-fuchsia-500/20 hover:to-fuchsia-600/10 border-fuchsia-500/20',
  'business-machines-tools': 'from-stone-500/10 to-stone-600/5 hover:from-stone-500/20 hover:to-stone-600/10 border-stone-500/20',
  'food-cooking': 'from-orange-400/10 to-orange-500/5 hover:from-orange-400/20 hover:to-orange-500/10 border-orange-400/20',
  'shops-trade': 'from-teal-500/10 to-teal-600/5 hover:from-teal-500/20 hover:to-teal-600/10 border-teal-500/20',
  'services-repairs': 'from-violet-500/10 to-violet-600/5 hover:from-violet-500/20 hover:to-violet-600/10 border-violet-500/20',
  'employment': 'from-blue-400/10 to-blue-500/5 hover:from-blue-400/20 hover:to-blue-500/10 border-blue-400/20',
  'events-nightlife': 'from-pink-400/10 to-pink-500/5 hover:from-pink-400/20 hover:to-pink-500/10 border-pink-400/20',
  'vacation-tourism': 'from-cyan-400/10 to-cyan-500/5 hover:from-cyan-400/20 hover:to-cyan-500/10 border-cyan-400/20',
  'personal-contacts': 'from-rose-400/10 to-rose-500/5 hover:from-rose-400/20 hover:to-rose-500/10 border-rose-400/20',
  'napravete-sami': 'from-amber-600/10 to-amber-700/5 hover:from-amber-600/20 hover:to-amber-700/10 border-amber-600/20',
  'other': 'from-gray-400/10 to-gray-500/5 hover:from-gray-400/20 hover:to-gray-500/10 border-gray-400/20',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

import { useSidebar } from '@/lib/context/sidebar-context';

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const { open, setActiveCategory } = useSidebar();

  // Filter to show only main categories (no parentId)
  const mainCategories = useMemo(() => 
    categories
    .filter(cat => !cat.parentId)
    .sort((a, b) => b._creationTime - a._creationTime)
    .slice(0, 30) // Show all main categories
  , [categories]);

  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId).slice(0, 8);
  };

  const handleCategoryClick = (e: React.MouseEvent, categoryId: string, hasSubcats: boolean) => {
      // Check if screen is less than XL (1280px)
      if (window.innerWidth < 1280 && hasSubcats) {
          e.preventDefault();
          setActiveCategory(categoryId);
          open();
      }
  };

  return (
    <div className="container-wide py-8 md:py-12">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 md:mb-3">
          Browse by Category
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
          Find exactly what you're looking for in our organized categories
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6"
      >
        {mainCategories.map((category, index) => {
          const Icon = categoryIcons[category.slug] || categoryIcons['other'] || Smartphone;
          const colorClass = categoryColors[category.slug] || categoryColors['other'];
          const subcats = getSubcategories(category._id);
          const hasSubcats = subcats.length > 0;

          // Responsive hover logic:
          // In 5-col layout (lg), items 4 and 5 (index % 5 >= 3) should open LEFT.
          // In 3-col layout (sm), item 3 (index % 3 == 2) should open LEFT.
          // In 2-col layout (base), item 2 (index % 2 == 1) should open LEFT.
          // We can use generic className with group/peer or just logic here.
          // For simplicity/robustness, let's use a dynamic class based on 'lg' breakpoint primarily as requested.
          const isRightColumnPC = (index % 5) >= 3;
          const isRightColumnTablet = (index % 3) === 2;
          const isRightColumnMobile = (index % 2) === 1;

          return (
            <motion.div 
              key={category._id} 
              variants={itemVariants}
              className="relative" // removed z-index here to avoid stacking context issues if possible, but relative needed for absolute child
              onMouseEnter={() => setHoveredCategoryId(category._id)}
              onMouseLeave={() => setHoveredCategoryId(null)}
              style={{ zIndex: hoveredCategoryId === category._id ? 50 : 1 }}
            >
              <Link 
                  href={`/listings?category=${category.slug}`}
                  onClick={(e) => handleCategoryClick(e, category._id, hasSubcats)}
              >
                <Card className={`
                  group relative overflow-hidden border-2 bg-gradient-to-br ${colorClass}
                  hover:shadow-xl transition-all duration-300 cursor-pointer
                  h-full min-h-[120px] md:min-h-[160px]
                `}>
                  <div className="p-3 md:p-6 flex flex-col items-center text-center space-y-2 md:space-y-4">
                    {/* Icon Container */}
                    <div className="relative">
                      <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-background/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm border border-white/20">
                        <Icon className="w-6 h-6 md:w-10 md:h-10 text-foreground group-hover:text-primary transition-colors duration-300" />
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Category Name */}
                    <div className="z-10 relative">
                      <h3 className="font-bold text-sm md:text-lg text-foreground dark:text-zinc-100 group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="hidden md:block text-xs text-muted-foreground dark:text-zinc-400 mt-1 line-clamp-2 px-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {hasSubcats && (
                      <div className="mt-auto pt-2 hidden md:flex items-center text-[10px] font-bold text-primary/80 dark:text-primary group-hover:text-primary uppercase tracking-wider">
                        Explore subcategories <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    )}
                  </div>

                  {/* Hover overlay and glassmorphism elements */}
                  <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {hasSubcats && <ChevronRight className="w-4 h-4 text-primary" />}
                  </div>
                </Card>
              </Link>

              {/* Flyout Subcategories Menu */}
              <AnimatePresence>
                {hoveredCategoryId === category._id && hasSubcats && (
                  <motion.div
                    initial={{ opacity: 0, x: isRightColumnPC ? 10 : -10, y: 0, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: isRightColumnPC ? 10 : -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`
                      absolute top-4 w-60 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border border-primary/20 p-2 pointer-events-auto
                      /* Mobile/Base: Default left-align unless right column */
                      ${isRightColumnMobile ? 'right-[90%] left-auto' : 'left-[90%] right-auto'}
                      /* Tablet: Override based on 3-col grid */
                      sm:left-auto sm:right-auto
                      sm:${isRightColumnTablet ? 'right-[90%]' : 'left-[90%]'}
                      /* Desktop: Override based on 5-col grid */
                      lg:left-auto lg:right-auto
                      lg:${isRightColumnPC ? 'right-[90%]' : 'left-[90%]'}
                    `}
                    style={{ zIndex: 60 }}
                  >
                    <div className="bg-primary/5 rounded-xl p-3 mb-2">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Quick Browse</p>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{category.name}</h4>
                    </div>
                    <div className="grid gap-1">
                      {subcats.map((sub) => (
                        <Link 
                          key={sub._id} 
                          href={`/listings?category=${category.slug}&subcategory=${sub.slug}`}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group/sub"
                        >
                          <span className="text-sm font-medium line-clamp-1">{sub.name}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover/sub:opacity-100 translate-x-[-4px] group-hover/sub:translate-x-0 transition-all" />
                        </Link>
                      ))}
                      <Link 
                        href={`/listings?category=${category.slug}`}
                        className="mt-2 text-center text-xs font-semibold py-2 rounded-lg border border-dashed border-primary/20 text-primary hover:bg-primary/5 transition-colors"
                      >
                        View all in {category.name}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Categories Link */}
      <div className="text-center mt-12 md:mt-16">
        <Link 
          href="/categories" 
          className="inline-flex items-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1 group"
        >
          Explore All Categories
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
