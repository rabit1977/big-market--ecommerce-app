'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function FollowersPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const followers = useQuery(api.followedSellers.getStoreFollowers, {
    sellerId: userId,
  });
  const t = useTranslations('Admin');

  return (
    <div className='p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-xl md:text-2xl lg:text-3xl font-black text-foreground tracking-tight'>
            Followers
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage users who are following your store.
          </p>
        </div>
      </div>

      <div className='bg-card border border-border/50 rounded-2xl md:rounded-[2rem] shadow-sm overflow-hidden'>
        <div className='p-4 md:p-6 border-b border-border/50 bg-muted/20'>
          <h2 className='text-sm md:text-base font-bold text-foreground flex items-center gap-2 uppercase tracking-wide'>
            <Users className='w-4 h-4 md:w-5 md:h-5 text-primary' />
            All Followers
            {followers && (
              <span className='ml-2 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-black'>
                {followers.length}
              </span>
            )}
          </h2>
        </div>

        <div className='divide-y divide-border/50'>
          {followers === undefined ? (
            <div className='p-12 flex justify-center'>
              <Loader2 className='w-8 h-8 md:w-10 md:h-10 text-primary animate-spin' />
            </div>
          ) : followers.length === 0 ? (
            <div className='p-12 text-center text-muted-foreground'>
              <Users className='w-12 h-12 mx-auto mb-4 opacity-20' />
              <p className='font-medium text-sm md:text-base'>
                No followers yet.
              </p>
              <p className='text-xs mt-1 text-muted-foreground/70'>
                When users follow your store, they will appear here.
              </p>
            </div>
          ) : (
            followers.map((follower) => {
              if (!follower) return null;
              return (
                <div
                  key={follower._id}
                  className='p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors'
                >
                  <div className='flex items-center gap-4'>
                    <Avatar className='w-10 h-10 md:w-12 md:h-12 border-2 border-background shadow-sm'>
                      <AvatarImage src={follower.image || ''} />
                      <AvatarFallback className='bg-muted text-foreground font-black uppercase'>
                        {follower.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className='font-bold text-foreground text-sm md:text-base tracking-tight leading-tight'>
                        {follower.name}
                      </h3>
                      <p className='text-[10px] md:text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5'>
                        Followed{' '}
                        {formatDistanceToNow(follower.followedAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
