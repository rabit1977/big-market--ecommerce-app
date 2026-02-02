'use client';

import { ProductCardSkeleton } from '@/components/ui/product-card-skeleton';
import { motion } from 'framer-motion';

export default function ListingsLoading() {
  return (
    <div className='bg-background min-h-screen pb-20'>
        {/* Header Skeleton */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border-b border-border/50 py-6 mb-8"
        >
            <div className="container-wide space-y-3">
                <div className='h-8 w-48 skeleton-enhanced rounded-lg' />
                <div className='h-5 w-32 skeleton-enhanced rounded' />
            </div>
        </motion.div>

      <div className='container-wide'>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                >
                   <ProductCardSkeleton />
                </motion.div>
              ))}
            </div>
      </div>
    </div>
  );
}
