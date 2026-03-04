'use client';

import { ListingForm } from '@/components/sell/listing-form';
import { ListingWithRelations } from '@/lib/types/listing';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface EditListingFormProps {
  listing: ListingWithRelations;
  categories: Category[];
}

export function EditListingForm({ listing, categories }: EditListingFormProps) {
  const router = useRouter();

  // NOTE: ListingForm already fires toast.success('toast_updated') before calling onSuccess.
  // Do NOT add another toast here — it would show two success notifications.
  const handleSuccess = () => {
      router.push('/admin/listings');
      router.refresh();
  };

  return (
    <div className='w-full'>
        <ListingForm 
            categories={categories}
            initialData={listing}
            onSuccess={handleSuccess}
            isAdmin={true}
        />
    </div>
  );
}
