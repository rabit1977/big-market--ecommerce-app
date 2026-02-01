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

interface EditListingFormProps {
  listing: ListingWithRelations;
  categories: Category[];
}

export function EditListingForm({ listing, categories }: EditListingFormProps) {
  const router = useRouter();

  const handleSuccess = () => {
      toast.success('Listing updated');
      router.push('/admin/listings');
      router.refresh();
  };

  return (
    <div className='glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-black/5 border border-border/60'>
        <ListingForm 
            categories={categories}
            initialData={listing}
            onSuccess={handleSuccess}
        />
    </div>
  );
}
