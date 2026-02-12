'use client';

import { approveListing, rejectListing } from '@/actions/listing-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface PendingListingsTableProps {
  listings: any[];
}

export function PendingListingsTable({ listings }: PendingListingsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => {
        try {
            const res = await approveListing(id);
            if (res.success) {
                toast.success('Listing approved');
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to approve');
            }
        } catch (e) {
            toast.error('Failed to approve');
        }
    });
  };

  const handleReject = (id: string) => {
    startTransition(async () => {
        try {
            const res = await rejectListing(id);
            if (res.success) {
                toast.success('Listing rejected');
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to reject');
            }
        } catch (e) {
            toast.error('Failed to reject');
        }
    });
  };

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl border border-dashed">
        <p className="text-muted-foreground font-medium">No pending listings found</p>
        <p className="text-sm text-muted-foreground/70">New listings will appear here for approval</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing._id} className="group">
              <TableCell>
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted border border-border">
                    {listing.thumbnail || (listing.images && listing.images[0]) ? (
                         <Image 
                            src={listing.thumbnail || listing.images[0]} 
                            alt={listing.title} 
                            fill 
                            className="object-cover" 
                        />
                    ) : (
                        <div className="flex bg-muted h-full w-full items-center justify-center text-[10px] text-muted-foreground">No Img</div>
                    )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                    <Link href={`/listings/${listing._id}`} className="hover:text-primary transition-colors line-clamp-1" target="_blank">
                        {listing.title}
                    </Link>
                    <span className="text-xs text-muted-foreground line-clamp-1">{listing.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal text-xs">{listing.category}</Badge>
              </TableCell>
              <TableCell className="font-medium">{formatCurrency(listing.price)}</TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(listing._creationTime).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    asChild
                  >
                    <Link href={`/listings/${listing._id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isPending}
                    onClick={() => handleApprove(listing._id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    disabled={isPending}
                    onClick={() => handleReject(listing._id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
