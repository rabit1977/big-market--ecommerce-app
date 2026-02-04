'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export const ListingDetailSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='bg-slate-50/50 min-h-screen'
    >
      {/* Mobile Header Skeleton */}
      <div className='md:hidden sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <div className='space-y-1'>
                  <Skeleton className='h-3 w-24' />
                  <Skeleton className='h-2 w-32' />
              </div>
          </div>
          <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-8 w-8 rounded-full' />
          </div>
      </div>

      <div className='container-wide max-w-6xl mx-auto md:px-4 md:py-8'>
        {/* Breadcrumb Skeleton */}
        <Skeleton className='h-5 w-48 mb-8 hidden md:block' />
        
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8'>
          {/* Main Column */}
          <div className='lg:col-span-8 space-y-6'>
            {/* Image Skeleton */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Skeleton className='aspect-[4/3] md:aspect-video w-full md:rounded-2xl shadow-sm' />
            </motion.div>
            
            {/* Thumbnails Skeleton */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='flex gap-2 overflow-hidden px-4 md:px-0'
            >
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='h-16 w-16 md:h-24 md:w-24 rounded-lg flex-shrink-0' />
                ))}
            </motion.div>

            {/* Mobile-Only Info Skeleton */}
            <div className='md:hidden space-y-4 px-4 bg-white border-b py-6'>
                <div className='space-y-2'>
                    <Skeleton className='h-3 w-20' />
                    <Skeleton className='h-8 w-full' />
                    <Skeleton className='h-10 w-32' />
                </div>
                <div className='flex items-center gap-3 pt-4 border-t'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='flex-1 space-y-1'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-2 w-24' />
                    </div>
                    <Skeleton className='h-10 w-10 rounded-full' />
                </div>
                <div className='grid grid-cols-2 gap-3 pt-4'>
                    <Skeleton className='h-14 w-full rounded-xl' />
                    <Skeleton className='h-14 w-full rounded-xl' />
                </div>
            </div>

            {/* Specs Skeleton */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='bg-white md:rounded-2xl border border-slate-200 overflow-hidden'
            >
                <div className='p-4 border-b bg-slate-50'>
                    <Skeleton className='h-4 w-40' />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2'>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className='p-4 border-b flex justify-between'>
                            <Skeleton className='h-3 w-20' />
                            <Skeleton className='h-3 w-24' />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Description Skeleton */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='bg-white md:rounded-2xl border border-slate-200 p-6 space-y-4'
            >
                <Skeleton className='h-5 w-32' />
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                </div>
            </motion.div>
          </div>

          {/* Sidebar Skeleton (Desktop Only) */}
          <div className='hidden lg:block lg:col-span-4 space-y-6'>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className='bg-white border-2 border-slate-100 rounded-3xl p-8 space-y-6 shadow-sm'
              >
                  <div className='space-y-2'>
                      <Skeleton className='h-8 w-full' />
                      <Skeleton className='h-4 w-32' />
                  </div>
                  <Skeleton className='h-24 w-full rounded-2xl' />
                  <div className='space-y-3 pt-2'>
                      <Skeleton className='h-14 w-full rounded-2xl' />
                      <Skeleton className='h-14 w-full rounded-2xl' />
                  </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className='bg-white border rounded-3xl p-6 shadow-sm'
              >
                  <div className='flex items-center gap-4 mb-6'>
                      <Skeleton className='h-16 w-16 rounded-full' />
                      <div className='space-y-2 flex-1'>
                          <Skeleton className='h-5 w-32' />
                          <Skeleton className='h-3 w-48' />
                      </div>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                      <Skeleton className='h-12 w-full rounded-xl' />
                      <Skeleton className='h-12 w-full rounded-xl' />
                  </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Skeleton className='aspect-[1.5/1] w-full rounded-3xl' />
              </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};