'use client';

import { deleteListingAction, markAsSoldAction, renewListingAction } from '@/actions/listing-actions';
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
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { BarChart2, CheckCircle, Edit, Mail, RefreshCw, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface MyListingListItemProps {
  listing: ListingWithRelations;
}

export const MyListingListItem = ({ listing }: MyListingListItemProps) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
             const res = await deleteListingAction(listing.id!);
             if(res.success) {
                 toast.success('Listing deleted');
             } else {
                 toast.error(res.error || 'Failed to delete');
             }
        });
    };

    const handleMarkSold = async () => {
        startTransition(async () => {
             const res = await markAsSoldAction(listing.id!);
             if(res.success) {
                 toast.success('Marked as sold');
             } else {
                 toast.error(res.error || 'Failed to update');
             }
        });
    };

    const handleRenew = async () => {
        startTransition(async () => {
             const res = await renewListingAction(listing.id!);
             if(res.success) {
                 toast.success('Listing renewed');
             } else {
                 toast.error(res.error || 'Failed');
             }
        });
    };

    const activeImage = listing.images?.[0]?.url || listing.thumbnail || '/placeholder.png';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group relative flex flex-row bg-card border border-border/60 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative w-24 sm:w-36 md:w-44 aspect-square bg-muted shrink-0">
          <Image
            src={activeImage}
            alt={listing.title}
            fill
            className="object-cover"
          />
          {/* Status Badge Overlay */}
          <div className="absolute top-1.5 left-1.5">
             {listing.status === 'ACTIVE' && (
                 <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm text-[9px] px-1.5 py-0 h-5">
                    <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> Active
                 </Badge>
             )}
             {listing.status === 'SOLD' && (
                 <Badge variant="secondary" className="bg-muted-foreground text-white border-0 text-[9px] px-1.5 py-0 h-5">
                    Sold
                 </Badge>
             )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-2.5 sm:p-3 min-w-0">
            <div className="flex justify-between items-start gap-1.5 mb-1">
                <Link href={`/listings/${listing.id}`} className="block min-w-0">
                   <h3 className="font-bold text-xs sm:text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                      {listing.title}
                   </h3>
                </Link>
                <div className="flex flex-col items-end shrink-0">
                    {listing.createdAt && (
                        <span className="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                            {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-1.5 sm:mb-2">
                <div className="text-sm sm:text-base font-black text-primary">
                    {formatPrice(listing.price)}
                </div>
                
                {/* Specs Summary */}
                <div className="flex flex-wrap gap-1 mt-1 text-[9px] md:text-[10px]">
                    {listing.condition && (
                        <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium border border-border/50">
                            {listing.condition}
                        </span>
                    )}
                    {listing.specifications && (
                        <>
                             {listing.specifications.year && (
                                <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border/50">
                                    {listing.specifications.year}
                                </span>
                             )}
                             {listing.specifications.mileage && (
                                <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border/50">
                                    {listing.specifications.mileage} km
                                </span>
                             )}
                             {listing.specifications.fuel && (
                                <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border/50">
                                    {listing.specifications.fuel}
                                </span>
                             )}
                        </>
                    )}
                </div>
            </div>

            {/* Main Action Button */}
            <div className="flex flex-row gap-1.5 mt-auto mb-1.5 sm:mb-2">
                <Button 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-6 sm:h-7 shadow-sm text-[9px] sm:text-[10px] px-2 rounded-lg"
                    size="sm"
                    onClick={handleRenew}
                    disabled={isPending}
                >
                    <RefreshCw className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1", isPending && "animate-spin")} />
                    Renew
                </Button>
            </div>

            {/* Icon Actions Row */}
            <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-0.5">
                <div className="flex gap-3 sm:gap-5 w-full justify-around">
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="flex flex-col items-center gap-0.5 group/btn">
                                <div className="p-1.5 rounded-full bg-destructive/10 text-destructive group-hover/btn:bg-destructive/20 transition-colors">
                                    <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                </div>
                                <span className="text-[8px] md:text-[9px] text-muted-foreground font-bold">Delete</span>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently remove &quot;{listing.title}&quot; from your listings.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Link href={`/my-listings/stats/${listing.id}`} className="flex flex-col items-center gap-0.5 group/btn">
                        <div className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover/btn:bg-emerald-500/20 transition-colors">
                            <BarChart2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        </div>
                        <span className="text-[8px] md:text-[9px] text-muted-foreground font-bold">Stats</span>
                    </Link>

                    <Link href={`/my-listings/${listing.id}/edit`} className="flex flex-col items-center gap-0.5 group/btn">
                        <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover/btn:bg-amber-500/20 transition-colors">
                            <Edit className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        </div>
                        <span className="text-[8px] md:text-[9px] text-muted-foreground font-bold">Edit</span>
                    </Link>

                    <Link href={`/messages?listingId=${listing.id}`} className="flex flex-col items-center gap-0.5 group/btn">
                        <div className="p-1.5 rounded-full bg-primary/10 text-primary group-hover/btn:bg-primary/20 transition-colors">
                            <Mail className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        </div>
                        <span className="text-[8px] md:text-[9px] text-muted-foreground font-bold">Messages</span>
                    </Link>

                </div>
            </div>
        </div>
      </motion.div>
    );
};
