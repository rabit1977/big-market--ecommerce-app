'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface FollowSellerButtonProps {
  sellerId: string;
  sellerName?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showCount?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export function FollowSellerButton({
  sellerId,
  sellerName,
  className,
  size = 'default',
  showCount = false,
  variant = 'outline',
}: FollowSellerButtonProps) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('ListingDetail');

  const followerId = session?.user?.id ?? '';

  const isFollowingRaw = useQuery(
    api.followedSellers.isFollowing,
    followerId && sellerId ? { followerId, sellerId } : 'skip'
  );

  const isFollowing = isFollowingRaw ?? false;

  const followerCount = useQuery(
    api.followedSellers.getFollowerCount,
    sellerId ? { sellerId } : 'skip'
  );

  const follow = useMutation(api.followedSellers.follow);
  const unfollow = useMutation(api.followedSellers.unfollow);

  const handleToggle = () => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    startTransition(async () => {
      try {
        if (isFollowing) {
          await unfollow({ sellerId, followerId: session.user.id });
          toast.success(
            sellerName ? t('unfollowed_name', { name: sellerName }) : t('store_unfollowed')
          );
        } else {
          await follow({ sellerId, followerId: session.user.id });
          toast.success(
            sellerName
              ? t('following_name', { name: sellerName })
              : t('store_followed')
          );
        }
      } catch {
        toast.error('Something went wrong. Please try again.');
      }
    });
  };

  const isLoading = sessionStatus === 'loading' || isPending || (Boolean(followerId && sellerId) && isFollowingRaw === undefined);

  return (
    <Button
      variant={isFollowing ? 'secondary' : variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2 font-semibold transition-all',
        isFollowing && 'text-primary border-primary/30',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <BellOff className="h-4 w-4" />
      ) : (
        <Bell className="h-4 w-4" />
      )}
      {isFollowing ? t('following') : t('follow')}
      {showCount && followerCount !== undefined && followerCount > 0 && (
        <span className="ml-1 text-xs font-bold opacity-60">
          {followerCount}
        </span>
      )}
    </Button>
  );
}
