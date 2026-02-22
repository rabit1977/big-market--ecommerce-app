'use client';

import { deleteListingAction } from '@/actions/listing-actions';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface DeleteListingButtonProps {
  listingId: string;
  listingTitle: string;
}

export function DeleteListingButton({ listingId, listingTitle }: DeleteListingButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
      if (!confirm(`Move "${listingTitle}" to the recycle bin? You can restore it later.`)) return;

      startTransition(async () => {
          const result = await deleteListingAction(listingId);
          if (result.success) {
              toast.success('Listing moved to recycle bin');
          } else {
              toast.error(result.error || 'Failed to delete');
          }
      });
  };

  return (
    <Button
      variant='destructive'
      size='sm'
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 w-8 p-0"
    >
      <Trash2 className='h-4 w-4' />
      <span className="sr-only">Delete</span>
    </Button>
  );
}
