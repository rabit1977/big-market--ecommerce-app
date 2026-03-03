'use client';

import { ListingForm } from '@/components/sell/listing-form';
import { ListingWithRelations } from '@/lib/types/listing';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Sell');
  const router = useRouter();

  const handleSuccess = () => {
      toast.success(t('toast_updated'));
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
