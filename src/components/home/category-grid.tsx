'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Car,
    Dumbbell,
    GraduationCap,
    Home,
    LucideIcon,
    PawPrint,
    Shirt,
    Smartphone,
    Sofa,
    Wrench
} from 'lucide-react';
import Link from 'next/link';

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

// Icon mapping for categories
const categoryIcons: Record<string, LucideIcon> = {
  'vehicles': Car,
  'real-estate': Home,
  'electronics': Smartphone,
  'fashion': Shirt,
  'jobs': Briefcase,
  'services': Wrench,
  'sports-leisure': Dumbbell,
  'pets': PawPrint,
  'education': GraduationCap,
  'home-garden': Sofa,
};

// Color mapping for categories
const categoryColors: Record<string, string> = {
  'vehicles': 'from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border-blue-500/20',
  'real-estate': 'from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10 border-green-500/20',
  'electronics': 'from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10 border-purple-500/20',
  'fashion': 'from-pink-500/10 to-pink-600/5 hover:from-pink-500/20 hover:to-pink-600/10 border-pink-500/20',
  'jobs': 'from-orange-500/10 to-orange-600/5 hover:from-orange-500/20 hover:to-orange-600/10 border-orange-500/20',
  'services': 'from-teal-500/10 to-teal-600/5 hover:from-teal-500/20 hover:to-teal-600/10 border-teal-500/20',
  'sports-leisure': 'from-red-500/10 to-red-600/5 hover:from-red-500/20 hover:to-red-600/10 border-red-500/20',
  'pets': 'from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/10 border-amber-500/20',
  'education': 'from-indigo-500/10 to-indigo-600/5 hover:from-indigo-500/20 hover:to-indigo-600/10 border-indigo-500/20',
  'home-garden': 'from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/20 hover:to-emerald-600/10 border-emerald-500/20',
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

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Filter to show only main categories (no parentId)
  const mainCategories = categories
    .filter(cat => !cat.parentId)
    .sort((a, b) => b._creationTime - a._creationTime) // Newest first
    .slice(0, 20); // Show top 20

  return (
    <div className="container-wide py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
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
        {mainCategories.map((category) => {
          const Icon = categoryIcons[category.slug] || Smartphone;
          const colorClass = categoryColors[category.slug] || 'from-gray-500/10 to-gray-600/5 hover:from-gray-500/20 hover:to-gray-600/10 border-gray-500/20';

          return (
            <motion.div key={category._id} variants={itemVariants}>
              <Link href={`/listings?category=${category.slug}`}>
                <Card className={`
                  group relative overflow-hidden border-2 bg-gradient-to-br ${colorClass}
                  hover:shadow-lg transition-all duration-300 cursor-pointer
                  h-full
                `}>
                  <div className="p-3 md:p-6 flex flex-col items-center text-center space-y-2 md:space-y-3">
                    {/* Icon Container */}
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-background/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-foreground" />
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Category Name */}
                    <div>
                      <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors line-clamp-1">
                        {category.name}
                      </h3>
                      {/* Hidden on mobile to save space if needed, or clamped */}
                      {category.description && (
                        <p className="hidden md:block text-xs text-muted-foreground mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Categories Link */}
      <div className="text-center mt-10">
        <Link 
          href="/categories" 
          className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors group"
        >
          View All Categories
          <svg 
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
