'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
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
import { useMemo } from 'react';

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
  'home-appliances': 'from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border-blue-500/20',
  'home-and-garden': 'from-orange-500/10 to-orange-600/5 hover:from-orange-500/20 hover:to-orange-600/10 border-orange-500/20',
  'fashion-clothing-shoes': 'from-pink-500/10 to-pink-600/5 hover:from-pink-500/20 hover:to-pink-600/10 border-pink-500/20',
  'mobile-phones-accessories': 'from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-primary/20',
  'computers': 'from-cyan-500/10 to-cyan-600/5 hover:from-cyan-500/20 hover:to-cyan-600/10 border-cyan-500/20',
  'tv-audio-video': 'from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-primary/20',
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
  'services-repairs': 'from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-primary/20',
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
  const { open, setActiveCategory } = useSidebar();

  // Filter to show only main categories (no parentId)
  const mainCategories = useMemo(() => 
    categories
    .filter(cat => !cat.parentId)
    .sort((a, b) => b._creationTime - a._creationTime)
    .slice(0, 30) // Show all main categories
  , [categories]);

  return (
    <div className="container-wide py-6 sm:py-8 md:py-12">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-1 sm:mb-2">
          Browse by Category
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl mx-auto">
          Find exactly what you're looking for
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-2 sm:gap-3 md:gap-4"
      >
        {mainCategories.map((category, index) => {
          const Icon = categoryIcons[category.slug] || categoryIcons['other'] || Smartphone;
          const colorClass = categoryColors[category.slug] || categoryColors['other'];
          
          return (
            <motion.div 
              key={category._id} 
              variants={itemVariants}
            >
              <Link 
                  href={`/listings?category=${category.slug}`}
                  className="block h-full"
              >
                <Card className={`
                  group relative overflow-hidden border bg-gradient-to-br ${colorClass}
                  hover:shadow-md transition-all duration-300 cursor-pointer
                  h-full min-h-[80px] sm:min-h-[90px] md:min-h-[110px] flex flex-col items-center justify-center
                `}>
                  <div className="p-1.5 sm:p-2 md:p-3 flex flex-col items-center text-center space-y-1 sm:space-y-1.5 md:space-y-2">
                    {/* Icon Container */}
                    <div className="relative">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-background/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm border border-white/10">
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5.5 md:h-5.5 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Category Name */}
                    <div className="z-10 relative">
                      <h3 className="font-semibold text-[10px] sm:text-xs md:text-sm text-foreground/90 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Categories Link */}
      <div className="text-center mt-8 md:mt-12">
        <Link 
          href="/categories" 
          className="inline-flex items-center text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-all"
        >
          View All Categories
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
