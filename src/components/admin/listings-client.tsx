'use client';

import { deleteMultipleListingsAction } from '@/actions/listing-actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Listing } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Edit, MapPin, Package, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { DeleteListingButton } from './delete-listing-button';

// Helper for date serialization
type SerializedListing = Omit<Listing, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

interface ListingsClientProps {
  listings: SerializedListing[];
}

export function ListingsClient({ listings }: ListingsClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(listings.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    startTransition(async () => {
      const result = await deleteMultipleListingsAction(selectedIds);
      if (result.success) {
        toast.success(result.message);
        setSelectedIds([]);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const isAllSelected = listings.length > 0 && selectedIds.length === listings.length;

  return (
    <div className='space-y-4'>
      {/* Header Actions */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='flex items-center gap-3'>
            <div className="flex items-center gap-2">
                <Checkbox
                    id='select-all'
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    disabled={listings.length === 0}
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">Select All ({listings.length})</label>
            </div>
        </div>

        {selectedIds.length > 0 && (
          <Button
            variant='destructive'
            size='sm'
            onClick={handleDeleteSelected}
            disabled={isPending}
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Delete ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Listings List */}
      <div className='space-y-2'>
        {listings.map((listing) => (
          <div
            key={listing.id}
            className={cn(
              'group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4',
              'bg-card border border-border/50 rounded-xl',
              'hover:bg-muted/30 hover:border-primary/20 transition-all duration-200',
              selectedIds.includes(listing.id) && 'bg-primary/5 border-primary/30 '
            )}
          >
            <div className='flex items-center gap-3 sm:gap-4 flex-1'>
              <Checkbox
                checked={selectedIds.includes(listing.id)}
                onCheckedChange={(checked) => handleSelectRow(listing.id, !!checked)}
              />
              
              {/* Image Thumbnail */}
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                   {listing.thumbnail ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={listing.thumbnail} alt={listing.title} className="object-cover w-full h-full" />
                   ) : (
                       <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package className="h-6 w-6" /></div>
                   )}
                   {listing.status !== 'ACTIVE' && (
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                           <span className="text-[10px] font-bold text-white uppercase">{listing.status}</span>
                       </div>
                   )}
              </div>

              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-sm sm:text-base truncate'>{listing.title}</h3>
                <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1'>
                    <span className="font-medium text-foreground">${listing.price}</span>
                    <span>•</span>
                    <span>{listing.category}</span>
                    {listing.city && (
                        <>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {listing.city}</span>
                        </>
                    )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2 mt-2 sm:mt-0 sm:ml-auto'>
               <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                   <Link href={`/admin/listings/${listing.id}/edit`}>
                       <Edit className="h-4 w-4" />
                       <span className="sr-only">Edit</span>
                   </Link>
               </Button>
               <DeleteListingButton 
                 listingId={listing.id} 
                 listingTitle={listing.title} 
               />
            </div>
          </div>
        ))}
      </div>

       {listings.length === 0 && (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-muted-foreground'>No listings found</p>
        </div>
      )}
    </div>
  );
}
