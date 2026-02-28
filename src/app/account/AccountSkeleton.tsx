'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export const AccountSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen bg-popover dark:bg-slate-950/50'
    >
      <div className='container-wide py-10 sm:py-16'>
        {/* Profile Header Skeleton */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className='mb-10 sm:mb-16 rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-border bg-card'
        >
           <div className='flex flex-col sm:flex-row items-center sm:items-start gap-8'>
             {/* Avatar */}
             <Skeleton className='w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex-shrink-0' />
             
             {/* User Info */}
             <div className='flex-1 text-center sm:text-left space-y-4 w-full'>
               <div className='space-y-3'>
                 <Skeleton className='h-10 sm:h-12 w-64 mx-auto sm:mx-0 rounded-xl' />
                 <div className='flex flex-wrap items-center justify-center sm:justify-start gap-3'>
                   <Skeleton className='h-8 w-48 rounded-full' />
                   <Skeleton className='h-8 w-40 rounded-full' />
                 </div>
               </div>
               
               <div className='flex justify-center sm:justify-start gap-3 pt-2'>
                  <Skeleton className='h-8 w-24 rounded-full' />
                  <Skeleton className='h-8 w-32 rounded-full' />
               </div>
             </div>
             
             {/* Edit Button */}
             <div className='hidden sm:block shrink-0'>
                <Skeleton className='h-12 w-32 rounded-xl' />
             </div>
           </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Column */}
          <div className='lg:col-span-8 space-y-8'>
            {/* Account Stats Skeleton */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='grid grid-cols-2 sm:grid-cols-4 gap-4 p-1'
            >
               {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className='h-24 w-full rounded-2xl' />
               ))}
            </motion.div>

            {/* Account Info Card Skeleton */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='bg-card border border-border rounded-3xl p-8 space-y-8'
            >
               <Skeleton className='h-8 w-56' />
               <div className='grid sm:grid-cols-2 gap-x-12 gap-y-8'>
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className='space-y-2'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-12 w-full rounded-2xl' />
                     </div>
                  ))}
               </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className='lg:col-span-4 space-y-8'>
             {/* Quick Actions Skeleton */}
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className='bg-card border border-border rounded-3xl p-6 space-y-6'
             >
                <Skeleton className='h-7 w-40' />
                <div className='space-y-3'>
                   {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className='h-16 w-full rounded-2xl' />
                   ))}
                </div>
             </motion.div>

             {/* Summary Card Skeleton */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
             >
               <Skeleton className='h-64 w-full rounded-3xl' />
             </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
