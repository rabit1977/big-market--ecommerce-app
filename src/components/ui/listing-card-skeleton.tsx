// components/ui/listing-card-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

const ListingCardSkeleton = () => {
  return (
    <div className='w-full h-full'>
      <div className='group relative w-full h-full flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300'>
        {/* Image Skeleton */}
        <div className='relative aspect-[4/3] w-full overflow-hidden'>
            <Skeleton className='h-full w-full rounded-none' />
        </div>

        {/* Buttons Skeleton */}
        <div className='absolute right-2 top-2 flex flex-col gap-2'>
          <Skeleton className='h-8 w-8 rounded-full bg-white/50 backdrop-blur-sm' />
        </div>

        <div className='p-4 flex flex-col flex-1'>
          {/* Brand Skeleton */}
          <Skeleton className='h-3 w-1/3 mb-2 rounded-full' />
          
          {/* Title Skeleton */}
          <Skeleton className='h-5 w-3/4 mb-3 rounded-md' />
          
          <div className='mt-auto pt-2 flex items-center justify-between border-t border-border/50'>
            {/* Price Skeleton */}
            <Skeleton className='h-6 w-1/3 rounded-md' />
            
            {/* Rating and Reviews Skeleton */}
            <div className='flex items-center gap-1'>
              <Skeleton className='h-4 w-12 rounded-full' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ListingCardSkeleton };
