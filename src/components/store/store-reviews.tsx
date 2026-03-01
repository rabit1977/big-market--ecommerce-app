'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function StoreReviews({ sellerId }: { sellerId: string }) {
  const reviews = useQuery(api.reviews.getSellerReviews, { sellerId });
  const t = useTranslations('StoreReviews');

  if (reviews === undefined) {
    return (
      <div className="space-y-4 py-8">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{t('title')}</h2>
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-32 bg-muted rounded-xl w-full" />
          <div className="h-32 bg-muted rounded-xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-12">
      <div className="flex items-center justify-between border-b pb-4">
         <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{t('title')}</h2>
         <span className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs px-3 py-1 rounded-full">{t('reviews_count', { count: reviews.length })}</span>
      </div>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="p-5 md:p-6 rounded-2xl border bg-card/50 shadow-sm flex flex-col gap-4 transition-colors hover:bg-card">
              {/* Header: User Info & Stars */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={review.reviewerImage || ''} alt={review.reviewerName || 'User'} />
                    <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs uppercase">
                      {review.reviewerName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm text-foreground">{review.reviewerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-0.5 shrink-0 bg-yellow-400/10 px-2 py-1 rounded-full">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-1.5 flex-1">
                {review.title && <h4 className="font-bold text-foreground text-sm leading-snug">{review.title}</h4>}
                <p className="text-sm text-muted-foreground leading-relaxed">"{review.comment}"</p>
              </div>

              {/* Context */}
              <div className="mt-2 pt-4 border-t border-dashed text-xs text-muted-foreground/70 font-medium">
                 {t('reviewed_item')} <span className="text-muted-foreground line-clamp-1 mt-0.5 italic">{review.listingTitle}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/40 rounded-3xl border border-dashed border-border/60">
           <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
           <h3 className="text-base font-bold text-foreground mb-1 uppercase tracking-tight">{t('no_reviews_title')}</h3>
           <p className="text-sm text-muted-foreground">{t('no_reviews_desc')}</p>
        </div>
      )}
    </div>
  );
}
