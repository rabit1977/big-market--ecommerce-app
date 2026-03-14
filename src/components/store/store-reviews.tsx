'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function StoreReviews({ sellerId }: { sellerId: string }) {
  const reviews = useQuery(api.reviews.getSellerReviews, { sellerId });
  const t = useTranslations('StoreReviews');
  const [showAll, setShowAll] = useState(false);

  if (reviews === undefined) {
    return (
      <div className='space-y-4 py-8'>
        <h2 className='text-xl md:text-2xl font-bold uppercase tracking-tight'>
          {t('title')}
        </h2>
        <div className='animate-pulse flex flex-col gap-4'>
          <div className='h-32 bg-muted rounded-xl w-full' />
          <div className='h-32 bg-muted rounded-xl w-full' />
        </div>
      </div>
    );
  }

  return (
    <div id='reviews' className='space-y-4 pt-8 md:pt-12 scroll-mt-24 pb-10'>
      <div className='bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300'>
        <button
          onClick={() => setShowAll(!showAll)}
          className='w-full flex items-center gap-2.5 p-4 md:p-5 hover:bg-secondary/50 transition-colors text-left group'
        >
          <div className='p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-white transition-colors'>
            <Star className='w-4 h-4' />
          </div>
          <div className='flex-1'>
            <h2 className='text-sm md:text-base font-black uppercase tracking-tight text-foreground flex items-center gap-2'>
              {t('title')}
              <span className='bg-primary/10 text-primary font-black text-[10px] px-2.5 py-1 rounded-full border border-primary/20'>
                {reviews.length}
              </span>
            </h2>
            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 opacity-60'>
              {showAll ? 'Click to show fewer reviews' : 'Click to read all store reviews'}
            </p>
          </div>
          {showAll ? (
            <ChevronUp className='w-4 h-4 text-muted-foreground' />
          ) : (
            <ChevronDown className='w-4 h-4 text-muted-foreground' />
          )}
        </button>

        {reviews.length > 0 && (
          <div className='px-4 pb-5 md:px-5 md:pb-6 border-t border-dashed border-border/50 pt-4'>
            <div className='space-y-4 md:space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6'>
                {(showAll ? reviews : reviews.slice(0, 1)).map((review) => (
                  <div
                    key={review._id}
                    className='p-4 md:p-6 rounded-2xl border bg-card/50 shadow-sm flex flex-col gap-3 transition-colors hover:bg-card'
                  >
                    {/* Header: User Info & Stars */}
                    <div className='flex justify-between items-start gap-3'>
                      <div className='flex items-center gap-2.5'>
                        <Avatar className='h-8 w-8 md:h-10 md:w-10 border border-border shadow-sm'>
                          <AvatarImage
                            src={review.reviewerImage || ''}
                            alt={review.reviewerName || 'User'}
                          />
                          <AvatarFallback className='bg-muted text-muted-foreground font-bold text-[10px] md:text-xs uppercase'>
                            {review.reviewerName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className='space-y-0.5'>
                          <p className='font-bold text-xs md:text-sm text-foreground leading-none'>
                            {review.reviewerName}
                          </p>
                          <p className='text-[10px] md:text-xs text-muted-foreground'>
                            {formatDistanceToNow(review.createdAt, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-0.5 shrink-0 bg-yellow-400/5 md:bg-yellow-400/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 md:w-3.5 md:h-3.5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className='space-y-1 flex-1'>
                      {review.title && (
                        <h4 className='font-bold text-foreground text-xs md:text-sm leading-tight'>
                          {review.title}
                        </h4>
                      )}
                      <p className='text-[13px] md:text-sm text-muted-foreground leading-relaxed italic'>
                        "{review.comment}"
                      </p>
                    </div>

                    {/* Context */}
                    <div className='mt-1 pt-3 border-t border-dashed border-border/50 text-[10px] md:text-xs text-muted-foreground/60 font-medium'>
                      {t('reviewed_item')}{' '}
                      <span className='text-muted-foreground line-clamp-1 mt-0.5 font-bold uppercase tracking-tight'>
                        {review.listingTitle}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {reviews.length === 0 && (
          <div className='text-center py-10 bg-muted/20 border-t border-dashed border-border/50'>
             <Star className='w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30' />
             <p className='text-xs font-bold text-muted-foreground uppercase tracking-widest'>{t('no_reviews_title')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
