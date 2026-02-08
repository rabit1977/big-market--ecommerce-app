'use client';

import { deleteListingAction, markAsSoldAction, renewListingAction } from '@/actions/listing-actions';
import { PromoteModal } from '@/components/listing/promote-modal';
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
import { BarChart2, CheckCircle, Edit, Mail, RefreshCw, Star, Trash2 } from 'lucide-react';
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
    const isPromoted = listing.isPromoted; // Assuming this field exists or similar logic

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group relative flex flex-row bg-card border border-border/60 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative w-32 sm:w-48 aspect-square bg-white shrink-0">
          <Image
            src={activeImage}
            alt={listing.title}
            fill
            className="object-cover"
          />
          {/* Status Badge Overlay */}
          <div className="absolute top-2 left-2">
             {listing.status === 'ACTIVE' && (
                 <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm">
                    <CheckCircle className="w-3 h-3 mr-1" /> Active
                 </Badge>
             )}
             {listing.status === 'SOLD' && (
                 <Badge variant="secondary" className="bg-gray-500 text-white border-0">
                    Sold
                 </Badge>
             )}
          </div>
        </div>

        {/* Content Section */}
        {/* Content Section */}
        <div className="flex-1 flex flex-col p-3 sm:p-4">
            <div className="flex justify-between items-start gap-2 mb-2">
                <Link href={`/listings/${listing.id}`} className="block">
                   <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {listing.title}
                   </h3>
                </Link>
                <div className="flex flex-col items-end shrink-0">
                    {listing.createdAt && (
                        <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-2 sm:mb-4">
                <div className="text-lg sm:text-xl font-black text-blue-600">
                    {formatPrice(listing.price)}
                </div>
                
                {/* Specs Summary */}
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                    {listing.condition && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium border border-slate-200">
                            {listing.condition}
                        </span>
                    )}
                    {listing.specifications && (
                        <>
                             {listing.specifications.year && (
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                                    {listing.specifications.year}
                                </span>
                             )}
                             {listing.specifications.mileage && (
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                                    {listing.specifications.mileage} km
                                </span>
                             )}
                             {listing.specifications.fuel && (
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                                    {listing.specifications.fuel}
                                </span>
                             )}
                        </>
                    )}
                </div>
            </div>

            {/* Main Action Buttons (Promote / Renew) */}
            {/* Main Action Buttons (Promote / Renew) */}
            {/* Main Action Buttons (Promote / Renew) */}
            <div className="flex flex-row gap-2 mt-auto mb-2 sm:mb-4">
                <PromoteModal listingId={listing.id!}>
                    <Button 
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold h-7 sm:h-9 bg-gradient-to-r from-amber-400 to-amber-600 border-0 shadow-md hover:shadow-lg transition-all text-[10px] sm:text-sm px-1"
                        size="sm"
                    >
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 fill-current" />
                        Promote
                    </Button>
                </PromoteModal>
                
                <Button 
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold h-7 sm:h-9 shadow-md hover:shadow-lg transition-all text-[10px] sm:text-sm px-1"
                    size="sm"
                    onClick={handleRenew}
                    disabled={isPending}
                >
                    <RefreshCw className={cn("w-3 h-3 sm:w-4 h-4 mr-1 sm:mr-2", isPending && "animate-spin")} />
                    Renew
                </Button>
            </div>

            {/* Icon Actions Row */}
            <div className="flex items-center justify-between border-t pt-3 mt-1">
                <div className="flex gap-4 sm:gap-6 w-full justify-around ">
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="flex flex-col items-center gap-1 group/btn">
                                <div className="p-2 rounded-full bg-red-50 text-red-500 group-hover/btn:bg-red-100 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium">Delete</span>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently remove "{listing.title}" from your listings.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Link href={`/my-listings/stats/${listing.id}`} className="flex flex-col items-center gap-1 group/btn">
                        <div className="p-2 rounded-full bg-emerald-50 text-emerald-600 group-hover/btn:bg-emerald-100 transition-colors">
                            <BarChart2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Stats</span>
                    </Link>

                    <Link href={`/my-listings/${listing.id}/edit`} className="flex flex-col items-center gap-1 group/btn">
                        <div className="p-2 rounded-full bg-amber-50 text-amber-600 group-hover/btn:bg-amber-100 transition-colors">
                            <Edit className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Edit</span>
                    </Link>

                    <Link href={`/messages?listingId=${listing.id}`} className="flex flex-col items-center gap-1 group/btn">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-600 group-hover/btn:bg-blue-100 transition-colors">
                            <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Messages</span>
                    </Link>

                </div>
            </div>
        </div>
      </motion.div>
    );
};
