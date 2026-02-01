'use client';

import { ListingForm } from '@/components/sell/listing-form';
import { ListingWithRelations } from '@/lib/types/listing';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface UserEditListingFormProps {
  listing: ListingWithRelations;
  categories: Category[];
}

export function UserEditListingForm({ listing, categories }: UserEditListingFormProps) {
  const router = useRouter();

  const handleSuccess = () => {
      toast.success('Listing updated successfully');
      router.push('/my-listings');
      router.refresh();
  };

  return (
    <div className='bg-card rounded-3xl p-6 sm:p-10 shadow-sm border border-border/60'>
        <ListingForm 
            categories={categories}
            initialData={listing}
            onSuccess={handleSuccess}
        />
    </div>
  );
}
