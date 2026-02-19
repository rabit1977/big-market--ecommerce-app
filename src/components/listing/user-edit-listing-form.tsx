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

export function UserEditListingForm({ listing, categories, isAdmin }: UserEditListingFormProps & { isAdmin?: boolean }) {
  const router = useRouter();

  const handleSuccess = () => {
      toast.success('Listing updated successfully');
      router.push(isAdmin ? '/admin/listings' : '/my-listings');
      router.refresh();
  };

  return (
    <div className='w-full'>
        <ListingForm 
            categories={categories}
            initialData={listing}
            onSuccess={handleSuccess}
            isAdmin={isAdmin}
        />
    </div>
  );
}
