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
import { BarChart2, CheckCircle, Clock, Edit, ExternalLink, Mail, RefreshCw, Trash2 } from 'lucide-react';
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
        className="group relative flex flex-row bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/20 rounded-[1.5rem] overflow-hidden transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative w-28 sm:w-40 md:w-56 aspect-[4/3] sm:aspect-square md:aspect-video bg-muted shrink-0 overflow-hidden">
          <Image
            src={activeImage}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge Overlay */}
          <div className="absolute top-2 left-2 z-10">
             {listing.status === 'ACTIVE' && (
                 <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-wider font-bold h-6 px-2 rounded-lg">
                    <CheckCircle className="w-3 h-3 mr-1" /> Active
                 </Badge>
             )}
             {listing.status === 'SOLD' && (
                 <Badge variant="secondary" className="bg-foreground text-background border-0 text-[10px] uppercase tracking-wider font-bold h-6 px-2 rounded-lg">
                    Sold Out
                 </Badge>
             )}
             {listing.status === 'PENDING_APPROVAL' && (
                 <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg shadow-amber-500/20 text-[10px] uppercase tracking-wider font-bold h-6 px-2 rounded-lg">
                    <Clock className="w-3 h-3 mr-1" /> Pending Approval
                 </Badge>
             )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-5 min-w-0">
            <div className="flex justify-between items-start gap-3 mb-2">
                <Link href={`/listings/${listing.id}`} className="block min-w-0 group/link">
                   <h3 className="font-bold text-sm sm:text-lg md:text-xl leading-tight group-hover/link:text-primary transition-colors line-clamp-1 mb-1 text-foreground">
                      {listing.title}
                   </h3>
                   <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider">
                     <span>ID: {listing.id!.slice(-6)}</span>
                     <span>•</span>
                     <span>{formatDistanceToNow(new Date(listing.createdAt!), { addSuffix: true })}</span>
                   </div>
                </Link>
                
                <Link href={`/listings/${listing.id}`} target="_blank" className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden sm:flex">
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>

            <div className="mb-3 sm:mb-4">
                <div className="text-lg sm:text-2xl font-black text-primary tracking-tight">
                    {formatPrice(listing.price)}
                </div>
                
                {/* Specs Summary */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {listing.condition && (
                        <span className="bg-muted px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border/50">
                            {listing.condition}
                        </span>
                    )}
                    {listing.specifications?.year && (
                        <span className="bg-muted px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border/50">
                            {listing.specifications.year}
                        </span>
                    )}
                </div>
            </div>

            {/* Main Action Button */}
            <div className="flex flex-row gap-2 mt-auto mb-3">
                <Button 
                    className="flex-1 bg-foreground text-background hover:bg-primary hover:text-white font-black h-8 sm:h-9 shadow-sm text-[10px] sm:text-xs uppercase tracking-wide rounded-xl transition-all"
                    size="sm"
                    onClick={handleRenew}
                    disabled={isPending}
                >
                    <RefreshCw className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5", isPending && "animate-spin")} />
                    Renew Ad
                </Button>
            </div>

            {/* Icon Actions Row */}
            <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-1 sm:px-2">
                <div className="flex gap-4 sm:gap-8 w-full justify-between sm:justify-start">
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="flex items-center gap-1.5 group/btn hover:text-destructive transition-colors text-muted-foreground">
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Delete</span>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="font-black uppercase tracking-tight">Delete Listing?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently remove &quot;{listing.title}&quot; from your listings.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-full font-bold">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Link href={`/my-listings/stats/${listing.id}`} className="flex items-center gap-1.5 group/btn hover:text-emerald-500 transition-colors text-muted-foreground">
                        <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Stats</span>
                    </Link>

                    <Link href={`/my-listings/${listing.id}/edit`} className="flex items-center gap-1.5 group/btn hover:text-amber-500 transition-colors text-muted-foreground">
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Edit</span>
                    </Link>

                    <Link href={`/messages?listingId=${listing.id}`} className="flex items-center gap-1.5 group/btn hover:text-primary transition-colors text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Messages</span>
                    </Link>

                </div>
            </div>
        </div>
      </motion.div>
    );
};
