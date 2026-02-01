'use client';

import { ListingContactPanel } from '@/components/listing/listing-contact-panel';
import { ListingWithRelations } from '@/lib/types/listing';

export interface ListingContactManagerProps {
  listing: ListingWithRelations;
  initialIsWished: boolean;
}

export function ListingContactManager({
  listing,
  initialIsWished,
}: ListingContactManagerProps) {
  return (
    <ListingContactPanel
      listing={listing}
      initialIsWished={initialIsWished}
    />
  );
}
