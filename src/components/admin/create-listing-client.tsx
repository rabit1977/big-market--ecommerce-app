'use client';

import { ListingForm } from '@/components/sell/listing-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Box } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CreateListingClientProps {
    categories: any[];
}

export function CreateListingClient({ categories }: CreateListingClientProps) {
  const router = useRouter();

  const handleSuccess = () => {
       toast.success('Listing created!');
       router.push('/admin/listings');
       router.refresh();
  };

  return (
    <div className='max-w-4xl mx-auto pb-20'>
      <div className='mb-8 animate-in fade-in slide-in-from-top-4 duration-500'>
        <Button
          variant='ghost'
          onClick={() => router.push('/admin/listings')}
          className='hover:bg-secondary rounded-lg mb-6 -ml-3'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Listings
        </Button>
        <div className='flex items-center gap-4'>
            <div className='h-12 w-12 rounded-lg bg-secondary flex items-center justify-center border border-border shadow-none'>
              <Box className='h-6 w-6 text-primary' />
            </div>
           <div>
              <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground'>
                Add New Listing
              </h1>
              <p className='text-lg text-muted-foreground font-medium mt-1'>
                Create a new listing in your platform
              </p>
           </div>
        </div>
      </div>

      <div className='bg-card rounded-lg p-8 sm:p-10 shadow-none border border-border animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100'>
        <ListingForm 
            categories={categories}
            onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
