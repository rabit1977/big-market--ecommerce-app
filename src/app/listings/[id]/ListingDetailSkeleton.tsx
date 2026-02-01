import { Skeleton } from '@/components/ui/skeleton';

export const ListingDetailSkeleton = () => {
  return (
    <div className='bg-background min-h-screen'>
      <div className='container-wide py-12'>
        {/* Breadcrumb Skeleton */}
        <Skeleton className='h-10 w-40 mb-6' />
        
        {/* Listing Main Content Skeleton */}
        <div className='grid gap-8 md:grid-cols-2 md:gap-12'>
          {/* Image Gallery Skeleton */}
          <div className='space-y-4'>
            <Skeleton className='aspect-square w-full rounded-2xl' />
            <div className='grid grid-cols-4 gap-4'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='aspect-square rounded-xl' />
              ))}
            </div>
          </div>
          
          {/* Listing Info Skeleton */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-12 w-3/4' />
              <div className='flex items-center gap-4'>
                 <Skeleton className='h-8 w-32' />
                 <Skeleton className='h-6 w-24' />
              </div>
            </div>
            
            <Skeleton className='h-32 w-full rounded-xl' />

            <div className='space-y-4 pt-4 border-t border-border'>
               <div className='grid grid-cols-2 gap-4'>
                  <Skeleton className='h-14 w-full rounded-xl' />
                  <Skeleton className='h-14 w-full rounded-xl' />
               </div>
            </div>

            {/* Seller Info Skeleton */}
            <div className='p-4 border rounded-xl space-y-3'>
                 <Skeleton className='h-5 w-32' />
                 <Skeleton className='h-4 w-48' />
            </div>
          </div>
        </div>

        {/* Separator Skeleton */}
        <Skeleton className='h-px w-full my-16' />

        {/* Content Skeleton */}
        <div className='space-y-8'>
           <Skeleton className='h-8 w-48' />
           <Skeleton className='h-40 w-full rounded-xl' />
        </div>
      </div>
    </div>
  );
};