'use client';

import { deleteListingAction, renewListingAction } from '@/actions/listing-actions';
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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ListingWithRelations } from '@/lib/types/listing';
import { formatPrice } from '@/lib/utils/formatters';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, Edit, MoreVertical, RefreshCw, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface MyListingCardProps {
  listing: ListingWithRelations;
}

export const MyListingCard = ({ listing }: MyListingCardProps) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
             const res = await deleteListingAction(listing.id!);
             if(res.success) {
                 toast.success('Listing moved to recycle bin');
             } else {
                 toast.error(res.error || 'Failed to delete');
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group relative flex flex-col h-full rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-300 overflow-hidden"
      >
        <div className="relative aspect-[4/3] bg-white overflow-hidden">
          <Image
            src={activeImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute top-3 left-3 flex gap-2 z-10">
             <Badge variant={listing.status === 'ACTIVE' ? 'default' : 'secondary'} className="uppercase text-[10px] font-bold tracking-wider">
                {listing.status}
             </Badge>
          </div>

          <div className="absolute top-2 right-2 z-20">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white">
                          <MoreVertical className="h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                          <Link href={`/my-listings/${listing.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Listing
                          </Link>
                      </DropdownMenuItem>
                      


                      {listing.status !== 'ACTIVE' && (
                          <DropdownMenuItem onClick={handleRenew}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Relist / Renew
                          </DropdownMenuItem>
                      )}

                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete
                              </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Move to Recycle Bin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      &quot;{listing.title}&quot; will be moved to the recycle bin. You can restore it from the admin panel within 30 days.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                      Move to Bin
                                  </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col flex-1 p-4 space-y-3">
           <Link href={`/listings/${listing.id}`} className="block">
               <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {listing.title}
               </h3>
           </Link>

           <div className="flex items-center justify-between text-xs text-muted-foreground">
               <div className="font-medium text-foreground text-sm">
                   {formatPrice(listing.price)}
               </div>
               <div className="flex items-center gap-1.5">
                   <Clock className="h-3.5 w-3.5" />
                   <span>{listing.createdAt ? formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true }) : 'Just now'}</span>
               </div>
           </div>
           
           <div className="pt-3 mt-auto flex gap-2">
               <Button asChild variant="outline" size="sm" className="flex-1">
                   <Link href={`/my-listings/${listing.id}/edit`}>
                       Edit
                   </Link>
               </Button>
               <Button asChild variant="ghost" size="sm" className="flex-1">
                   <Link href={`/listings/${listing.id}`}>
                       View
                   </Link>
               </Button>
           </div>
        </div>
      </motion.div>
    );
};
