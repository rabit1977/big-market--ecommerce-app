'use client';

import { addOrUpdateReviewAction } from '@/actions/review-actions';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function LeaveReviewModal({ 
  listingId,
  sellerId,
}: { 
  listingId: string;
  sellerId: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = session?.user?.id === sellerId;

  if (!session?.user) {
    return null; // Must be logged in
  }

  if (isOwner) {
    return null; // Cannot review own listings
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }

    if (comment.trim().length < 5) {
      toast.error('Comment must be at least 5 characters.');
      return; 
    }

    setIsSubmitting(true);
    try {
      const res = await addOrUpdateReviewAction(listingId, {
        rating,
        title,
        comment,
      });

      if (res.success) {
        toast.success('Your review has been submitted for approval!');
        setOpen(false);
        // Reset form
        setRating(0);
        setTitle('');
        setComment('');
        router.refresh(); // Refresh nextjs cache
      } else {
        toast.error(res.error || 'Failed to submit review.');
      }
    } catch (e) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         <Button variant="outline" className="w-full font-bold">
           Leave a Review
         </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
             Share your experience with this seller to help the community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
             <Label className="text-sm font-medium">Select a Rating</Label>
             <div className="flex items-center gap-1">
               {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer transition-colors ${
                       (hoverRating || rating) >= star 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground/30'
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
               ))}
             </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="title">Review Title (Optional)</Label>
             <Input 
                id="title" 
                placeholder="e.g. Great seller, fast shipping" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
             />
          </div>

          <div className="space-y-2">
             <Label htmlFor="comment">Your Comment</Label>
             <Textarea 
                id="comment" 
                placeholder="Write your detailed experience here..."
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                maxLength={500}
             />
             <p className="text-xs text-muted-foreground text-right">{comment.length}/500</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>
               Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || rating === 0 || comment.length < 5}>
               {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
