'use client';

import { approveListingAction, rejectListingAction } from '@/actions/listing-actions';
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
import { CheckCircle, Eye, Pencil, XCircle } from 'lucide-react';
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
            const res = await approveListingAction(id);
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
            const res = await rejectListingAction(id);
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
      <div className="flex flex-col items-center justify-center py-12 text-center bg-secondary/20 rounded-lg border border-border border-dashed">
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 border border-border">
          <CheckCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-foreground font-bold text-sm">No Pending Listings</p>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight mt-1">New listings will appear here for your review</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-none">
        <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[80px] text-[10px] font-bold uppercase tracking-widest">Image</TableHead>
            <TableHead className="min-w-[200px] text-[10px] font-bold uppercase tracking-widest">Title</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Category</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Price</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Date</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing._id} className="group border-border hover:bg-secondary/30 transition-colors">
              <TableCell>
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-secondary border border-border">
                    {listing.thumbnail || (listing.images && listing.images[0]) ? (
                         <Image 
                            src={listing.thumbnail || listing.images[0]} 
                            alt={listing.title} 
                            fill 
                            className="object-cover" 
                        />
                    ) : (
                        <div className="flex bg-muted h-full w-full items-center justify-center text-[10px] text-muted-foreground font-bold">MISSING</div>
                    )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                    <Link href={`/listings/${listing._id}`} className="text-foreground font-bold hover:text-primary transition-colors line-clamp-1">
                        {listing.title}
                    </Link>
                    <span className="text-[10px] text-muted-foreground font-medium line-clamp-1">{listing.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="inline-flex items-center px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-secondary text-foreground border border-border uppercase tracking-tight">
                  {listing.category}
                </div>
              </TableCell>
              <TableCell className="font-bold text-sm">{formatCurrency(listing.price)}</TableCell>
              <TableCell className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight whitespace-nowrap">
                {new Date(listing._creationTime).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg hover:bg-secondary"
                    asChild
                  >
                    <Link href={`/listings/${listing._id}`}>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 rounded-lg"
                    asChild
                  >
                    <Link href={`/admin/listings/${listing._id}/edit`}>
                        <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => handleApprove(listing._id)}
                    disabled={isPending}
                    className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-none"
                    title="Approve"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleReject(listing._id)}
                    disabled={isPending}
                    className="h-8 w-8 rounded-lg shadow-none"
                    title="Reject"
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
