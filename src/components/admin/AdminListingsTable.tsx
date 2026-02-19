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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatCurrency } from '@/lib/utils';
import { AlertCircle, Check, CheckCircle, Clock, Eye, MoreHorizontal, Pencil, Trash2, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface AdminListingsTableProps {
  listings: any[];
  isPromotedView?: boolean;
}

export function AdminListingsTable({ listings, isPromotedView }: AdminListingsTableProps) {
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
      <div className="rounded-xl border bg-card flex flex-col h-[calc(100vh-220px)] overflow-hidden relative shadow-sm">
        <div className="overflow-auto flex-1 w-full touch-pan-x touch-pan-y overscroll-contain">
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-card shadow-sm after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border pointer-events-auto">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[80px] bg-card font-bold text-xs uppercase tracking-wider text-primary">Image</TableHead>
                <TableHead className="min-w-[200px] bg-card font-bold text-xs uppercase tracking-wider text-primary">Listing Info</TableHead>
                <TableHead className="bg-card font-bold text-xs uppercase tracking-wider text-primary">Status</TableHead>
                <TableHead className="bg-card font-bold text-xs uppercase tracking-wider text-primary">Category</TableHead>
                <TableHead className="bg-card font-bold text-xs uppercase tracking-wider text-primary">Price</TableHead>
                {isPromotedView && (
                    <>
                        <TableHead className="bg-card font-bold text-xs uppercase tracking-wider text-primary">Tier</TableHead>
                        <TableHead className="bg-card font-bold text-xs uppercase tracking-wider text-primary">Expires</TableHead>
                    </>
                )}
                <TableHead className="bg-card font-bold text-xs uppercase tracking-wider text-primary">Added Date</TableHead>
                <TableHead className="text-right bg-card font-bold text-xs uppercase tracking-wider text-primary sticky right-0 z-30 shadow-l-sm">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => {
                // Calculate expiry status if promoted
                const isExpired = isPromotedView && listing.promotionExpiresAt && listing.promotionExpiresAt < Date.now();
                const daysLeft = isPromotedView && listing.promotionExpiresAt 
                    ? Math.ceil((listing.promotionExpiresAt - Date.now()) / (1000 * 60 * 60 * 24)) 
                    : 0;

                return (
                <TableRow key={listing._id} className={cn(
                    "group hover:bg-muted/30 transition-colors",
                    isExpired && "bg-destructive/5 opacity-70"
                )}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted border border-border shadow-sm group-hover:shadow-md transition-all">
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
                    <div className="flex flex-col gap-0.5">
                        <Link href={`/listings/${listing._id}`} className="font-bold hover:text-primary transition-colors line-clamp-1" target="_blank">
                            {listing.title}
                        </Link>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter opacity-70">ID: {listing._id.slice(-8)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(listing.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-wider bg-muted text-muted-foreground border-border/50">{listing.category}</Badge>
                  </TableCell>
                  <TableCell className="font-black text-sm tracking-tight">{formatCurrency(listing.price, (listing as any).currency)}</TableCell>
                  
                  {isPromotedView && (
                    <>
                        <TableCell>
                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">
                                {(listing.promotionTier || 'Standard').replace(/_/g, ' ')}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                             {listing.promotionExpiresAt ? (
                                <div className={cn("flex flex-col", isExpired ? "text-destructive font-bold" : "text-emerald-600 font-bold")}>
                                    <span>{new Date(listing.promotionExpiresAt).toLocaleDateString()}</span>
                                    <span className="text-[10px] opacity-80 font-normal">
                                        {isExpired ? 'Expired' : `${daysLeft} days left`}
                                    </span>
                                </div>
                             ) : (
                                <span className="text-muted-foreground">-</span>
                             )}
                        </TableCell>
                    </>
                  )}

                  <TableCell className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {new Date(listing._creationTime).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                    <span className="block text-[10px] opacity-70">
                        {new Date(listing._creationTime).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-card/95 backdrop-blur-sm group-hover:bg-muted/90 transition-colors z-10 border-l border-border/50">
                    <div className="flex justify-end gap-1">
                      {/* Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                            disabled={isPending}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-border/50">
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/listings/${listing._id}`} target="_blank" className="flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              View Listing
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild className="cursor-pointer text-blue-600 focus:text-blue-700">
                            <Link href={`/my-listings/${listing._id}/edit`} className="flex items-center">
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Listing
                            </Link>
                          </DropdownMenuItem>
                          
                          {listing.status === 'PENDING_APPROVAL' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-emerald-600 focus:text-emerald-700 cursor-pointer"
                                onClick={() => handleApprove(listing._id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Listing
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-amber-600 focus:text-amber-700 cursor-pointer"
                                onClick={() => handleReject(listing._id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Listing
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Listing
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl border-destructive/20 shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-destructive font-black uppercase tracking-tight">
                                  <AlertCircle className="w-5 h-5" /> 
                                  Delete permanently?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-medium text-foreground/80">
                                  This will permanently remove <span className="font-bold text-foreground">"{listing.title}"</span> from the platform. 
                                  <br/><span className="text-xs text-muted-foreground mt-2 block">This action cannot be undone.</span>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-2 sm:gap-0">
                                <AlertDialogCancel className="rounded-xl font-bold border-border/50 bg-muted/50 hover:bg-muted">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(listing._id)} 
                                  className="bg-destructive hover:bg-destructive/90 text-white rounded-xl font-bold shadow-lg shadow-destructive/20"
                                >
                                  Yes, Delete Listing
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Footer / Status Bar within the fixed container */}
        <div className="bg-muted/40 border-t p-2 px-4 text-[10px] font-bold text-muted-foreground flex justify-between items-center shrink-0">
            <span>Showing {listings.length} listings</span>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500/50"></span> Active
                <span className="w-2 h-2 rounded-full bg-amber-500/50 ml-2"></span> Pending
            </div>
        </div>
      </div>
);
}
