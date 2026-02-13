'use client';

import { approveListingAction, deleteListingAction, rejectListingAction } from '@/actions/listing-actions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { AlertCircle, Check, CheckCircle, Clock, Eye, Trash2, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface AdminListingsTableProps {
  listings: any[];
}

export function AdminListingsTable({ listings }: AdminListingsTableProps) {
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

  const handleDelete = (id: string) => {
    startTransition(async () => {
        try {
            const res = await deleteListingAction(id);
            if (res.success) {
                toast.success('Listing deleted');
                router.refresh();
            } else {
                toast.error(res.error || 'Failed to delete');
            }
        } catch (e) {
            toast.error('Failed to delete');
        }
    });
  };

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl border border-dashed">
        <p className="text-muted-foreground font-medium">No listings found</p>
        <p className="text-sm text-muted-foreground/70">Listings matching your filter will appear here</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
      switch (status) {
          case 'ACTIVE':
              return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 gap-1"><Check className="w-3 h-3" /> Active</Badge>;
          case 'PENDING_APPROVAL':
              return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
          case 'REJECTED':
              return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
          default:
              return <Badge variant="outline">{status}</Badge>;
      }
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead className="min-w-[200px]">Listing Info</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Added Date</TableHead>
            <TableHead className="text-right">Management</TableHead>
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
                    <Link href={`/listings/${listing._id}`} className="font-bold hover:text-primary transition-colors line-clamp-1" target="_blank">
                        {listing.title}
                    </Link>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">ID: {listing._id.slice(-8)}</span>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(listing.status)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium text-[10px] uppercase tracking-wider">{listing.category}</Badge>
              </TableCell>
              <TableCell className="font-bold text-sm">{formatCurrency(listing.price)}</TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(listing._creationTime).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {/* View Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                    asChild
                    title="View Listing"
                  >
                    <Link href={`/listings/${listing._id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Actions for Pending */}
                  {listing.status === 'PENDING_APPROVAL' && (
                    <>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            disabled={isPending}
                            onClick={() => handleApprove(listing._id)}
                            title="Approve"
                        >
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                            disabled={isPending}
                            onClick={() => handleReject(listing._id)}
                            title="Reject"
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </>
                  )}

                  {/* Delete with Confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            disabled={isPending}
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-destructive font-black uppercase tracking-tight">
                                <AlertCircle className="w-5 h-5" /> 
                                Delete permanently?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="font-medium">
                                This will permanently remove &quot;{listing.title}&quot; from the platform. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-full font-bold">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => handleDelete(listing._id)} 
                                className="bg-destructive hover:bg-destructive/90 rounded-full font-bold"
                            >
                                Delete Listing
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
