'use client';

/**
 * Refactored with:
 * - React 19: use(), useOptimistic, useTransition, memo
 * - Next.js 15: searchParams as Promise (unwrapped via use()), Suspense streaming
 * - Performance: removed useEffect for tab sync, optimistic deletes, no redundant state
 */

import { ListingCard } from '@/components/shared/listing/listing-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
  Heart,
  History as HistoryIcon,
  Loader2,
  Search,
  Store,
  Trash2,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { memo, use, useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { FollowSellerButton } from '@/components/shared/follow-seller-button';

// ─── Types ────────────────────────────────────────────────────────────────────

type PageProps = {
  // Next.js 15: searchParams is now a Promise
  searchParams: Promise<{ tab?: string }>;
};

// ─── Page (Server Shell) ──────────────────────────────────────────────────────

/**
 * Keep this file as a Client Component because Convex hooks require it.
 * If you were using pure Server Actions / RSC fetching you could make the
 * outer shell a Server Component and only island-ize the interactive bits.
 */
export default function FavoritesPage({ searchParams }: PageProps) {
  // React 19 / Next.js 15: unwrap the Promise synchronously inside a Client
  // Component via the `use()` hook — no useEffect needed.
  const { tab } = use(searchParams);
  const t = useTranslations('Favorites');
  const activeTab =
    tab === 'searches' ||
    tab === 'listings' ||
    tab === 'visited' ||
    tab === 'stores'
      ? tab
      : 'listings';

  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className='min-h-screen pt-4 md:pt-6 flex items-center justify-center'>
        <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className='min-h-screen pt-4 md:pt-6 flex flex-col items-center justify-center gap-3 px-4'>
        <h1 className='text-lg font-bold text-foreground'>
          {t('please_sign_in')}
        </h1>
        <p className='text-xs text-muted-foreground'>{t('sign_in_to_view')}</p>
        <Link href='/auth'>
          <Button size='sm' className='rounded-lg font-bold text-xs'>
            {t('sign_in')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-4 md:pt-6 pb-8 bg-muted/10'>
      <div className='container-wide mx-auto px-3 md:px-4'>
        {/* Header */}
        <div className='flex items-center gap-2.5 mb-4 md:mb-5'>
          <div className='p-1.5 md:p-2 bg-primary/10 rounded-lg md:rounded-xl'>
            <Heart className='h-4 w-4 md:h-5 md:w-5 text-primary fill-primary/20' />
          </div>
          <div>
            <h1 className='text-base md:text-xl font-black tracking-tight text-foreground'>
              {t('saved_items')}
            </h1>
            <p className='text-xs md:text-sm text-muted-foreground font-medium'>
              {t('favorites_searches_history')}
            </p>
          </div>
        </div>

        {/* Pass userId down — avoids re-reading session in every child */}
        <FavoritesTabs
          userId={session?.user?.id ?? ''}
          defaultTab={activeTab}
        />
      </div>
    </div>
  );
}

// ─── Tabs Container ───────────────────────────────────────────────────────────

function FavoritesTabs({
  userId,
  defaultTab,
}: {
  userId: string;
  defaultTab: string;
}) {
  const t = useTranslations('Favorites');
  const listingFavorites = useQuery(api.favorites.getPopulated, { userId });
  const savedSearches = useQuery(api.searches.getSavedSearches, { userId });
  const visitedHistory = useQuery(api.history.getMyHistory, { userId });
  const followedStores = useQuery(api.followedSellers.getFollowedSellers, {
    followerId: userId,
  });

  const deleteSearchMutation = useMutation(api.searches.deleteSavedSearch);

  // React 19: useOptimistic for instant search removal without waiting for server
  const [optimisticSearches, removeOptimisticSearch] = useOptimistic(
    savedSearches ?? [],
    (state, idToRemove: string) => state.filter((s) => s._id !== idToRemove),
  );

  // React 19: useTransition keeps UI responsive during async delete
  const [isPending, startTransition] = useTransition();

  const handleDeleteSearch = (id: string) => {
    startTransition(async () => {
      // Optimistic: remove immediately in UI
      removeOptimisticSearch(id);
      try {
        await deleteSearchMutation({ id: id as any });
        toast.success(t('search_removed'));
      } catch {
        // Revert is automatic — useOptimistic rolls back on error
        toast.error(t('failed_to_remove'));
      }
    });
  };

  const groupedFavorites = (listingFavorites || []).reduce(
    (acc: Record<string, any[]>, item: any) => {
      if (!item) return acc;
      const listName = item.listName || 'Default';
      if (!acc[listName]) acc[listName] = [];
      acc[listName].push(item);
      return acc;
    },
    {},
  );

  const listNames = Object.keys(groupedFavorites).sort((a, b) => {
    if (a === 'Default') return -1;
    if (b === 'Default') return 1;
    return a.localeCompare(b);
  });

  return (
    <Tabs defaultValue={defaultTab} className='w-full'>
      <TabsList className='w-full grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2 mb-6 md:mb-8 p-1.5 h-auto bg-card/40 border border-card-foreground/10 backdrop-blur-sm rounded-2xl bm-interactive shadow-none'>
        <TabsTrigger
          value='listings'
          className='text-[10px] md:text-[11px] lg:text-xs px-2 h-10 md:h-11 font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap truncate data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
        >
          {t('favorites_tab', { count: listingFavorites?.length ?? 0 })}
        </TabsTrigger>
        <TabsTrigger
          value='searches'
          className='text-[10px] md:text-[11px] lg:text-xs px-2 h-10 md:h-11 font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap truncate data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
        >
          {t('searches_tab', { count: optimisticSearches.length })}
        </TabsTrigger>
        <TabsTrigger
          value='stores'
          className='text-[10px] md:text-[11px] lg:text-xs px-2 h-10 md:h-11 font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap truncate data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
        >
          {t('stores_tab', { count: (followedStores?.length ?? 0) })}
        </TabsTrigger>
        <TabsTrigger
          value='visited'
          className='text-[10px] md:text-[11px] lg:text-xs px-2 h-10 md:h-11 font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap truncate data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
        >
          {t('history_tab')}
        </TabsTrigger>
      </TabsList>

      {/* ── Favorites ── */}
      <TabsContent value='listings'>
        {!listingFavorites ? (
          <CenteredSpinner />
        ) : listingFavorites.length === 0 ? (
          <EmptyState
            icon={
              <Heart className='w-8 h-8 md:w-10 md:h-10 text-muted-foreground/40' />
            }
            title={t('no_favorites')}
            description={t('no_favorites_desc')}
            action={{ label: t('browse_listings'), href: '/listings' }}
          />
        ) : (
          <div className='space-y-8'>
            {listNames.map((folder) => (
              <div key={folder} className='space-y-3'>
                <div className='flex items-center justify-between border-b border-border/50 pb-2'>
                  <h3 className='font-bold text-lg md:text-xl text-foreground'>
                    {folder}{' '}
                    <span className='text-muted-foreground text-sm font-normal'>
                      ({groupedFavorites[folder].length})
                    </span>
                  </h3>
                </div>
                <div className='grid lg:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4'>
                  {groupedFavorites[folder].map(
                    (listing: any) =>
                      listing && (
                        <ListingCard key={listing._id} listing={listing} />
                      ),
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* ── Saved Searches ── */}
      <TabsContent value='searches'>
        {!savedSearches ? (
          <CenteredSpinner />
        ) : optimisticSearches.length === 0 ? (
          <EmptyState
            icon={
              <Search className='w-8 h-8 md:w-10 md:h-10 text-muted-foreground/40' />
            }
            title={t('no_saved_searches')}
            description={t('no_saved_searches_desc')}
            action={{ label: t('start_searching'), href: '/listings' }}
          />
        ) : (
          <div className='flex flex-col gap-2'>
            {optimisticSearches.map((search) => (
              <SavedSearchRow
                key={search._id}
                search={search}
                onDelete={handleDeleteSearch}
                isPending={isPending}
              />
            ))}
          </div>
        )}
      </TabsContent>

      {/* ── Stores & Followers ── */}
      <TabsContent value='stores' className='space-y-6'>
        {/* Section 1: Stores I Follow */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between border-b border-border/50 pb-2'>
            <h3 className='font-bold text-lg md:text-xl text-foreground flex items-center gap-2'>
              <Store className='w-5 h-5 text-primary' />
              {t('followed_stores', { count: followedStores?.length ?? 0 })}
            </h3>
          </div>

          {!followedStores ? (
            <CenteredSpinner />
          ) : followedStores.length === 0 ? (
            <div className='py-8 text-center bg-card/30 border border-dashed border-border rounded-2xl'>
               <p className='text-xs text-muted-foreground font-medium'>{t('no_followed_stores')}</p>
               <Link href='/listings' className='text-xs font-bold text-primary hover:underline mt-2 inline-block'>
                 {t('discover_stores')}
               </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
              {followedStores.map(
                (store) =>
                  store && (
                    <div
                      key={store._id}
                      className='group relative flex flex-col gap-3 bg-card p-4 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all text-center items-center justify-center'
                    >
                      <Link href={`/store/${store.externalId}`} className='flex flex-col items-center gap-3 w-full'>
                        <Avatar className='h-16 w-16 md:h-20 md:w-20 rounded-xl mb-1 shadow-sm border border-border group-hover:scale-105 transition-transform shrink-0'>
                          <AvatarImage
                            src={store.image || ''}
                            alt={store.name || 'Store'}
                            className='object-cover'
                          />
                          <AvatarFallback className='text-xl bg-muted text-muted-foreground font-bold'>
                            {store.name?.charAt(0).toUpperCase() || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className='w-full'>
                          <h3 className='font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors mb-0.5 line-clamp-1 px-2'>
                            {store.accountType === 'COMPANY' && store.companyName
                              ? store.companyName
                              : store.name}
                          </h3>
                          <p className='text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider'>
                            Followed {formatDistanceToNow(store.followedAt)} ago
                          </p>
                        </div>
                      </Link>
                      
                      <div className='mt-1 w-full'>
                         <FollowSellerButton 
                           sellerId={store.externalId} 
                           sellerName={store.name} 
                           size='sm' 
                           variant='ghost'
                           className='h-8 w-full text-[10px] font-bold uppercase tracking-wider'
                         />
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>

        {/* Section 2: My Store Followers (Only for Premium Users) */}
        <StoreFollowersSection userId={userId} />
      </TabsContent>

      {/* ── History ── */}
      <TabsContent value='visited'>
        {!visitedHistory ? (
          <CenteredSpinner />
        ) : visitedHistory.length === 0 ? (
          <EmptyState
            icon={
              <HistoryIcon className='w-8 h-8 md:w-10 md:h-10 text-muted-foreground/40' />
            }
            title={t('no_history')}
            description={t('no_history_desc')}
            action={{ label: t('browse_listings'), href: '/listings' }}
          />
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4'>
            {visitedHistory.map(
              (listing) =>
                listing && (
                  <ListingCard key={listing._id} listing={listing as any} />
                ),
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

// ─── Saved Search Row (memoized to avoid re-renders on unrelated state) ───────

type SavedSearch = {
  _id: string;
  _creationTime: number;
  name?: string;
  query: string;
  url: string;
};

const SavedSearchRow = memo(function SavedSearchRow({
  search,
  onDelete,
  isPending,
}: {
  search: SavedSearch;
  onDelete: (id: string) => void;
  isPending: boolean;
}) {
  const t = useTranslations('Favorites');
  return (
    <div className='group flex items-center gap-2.5 md:gap-3 bg-card p-2.5 md:p-3 rounded-xl border border-border/50 hover:border-border hover:shadow-sm transition-all'>
      <div className='w-8 h-8 md:w-9 md:h-9 rounded-lg bg-muted flex items-center justify-center shrink-0'>
        <Search className='w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground' />
      </div>

      <Link href={search.url} className='flex-1 min-w-0'>
        <h3 className='font-bold text-xs md:text-sm truncate text-foreground group-hover:text-primary transition-colors'>
          {search.name || search.query}
        </h3>
        <p className='text-[9px] md:text-[10px] text-muted-foreground truncate font-medium'>
          {t('saved_ago', { time: formatDistanceToNow(search._creationTime) })}
        </p>
      </Link>

      <Button
        variant='ghost'
        size='icon'
        disabled={isPending}
        className='h-7 w-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 disabled:opacity-50'
        onClick={(e) => {
          e.preventDefault();
          onDelete(search._id);
        }}
      >
        <Trash2 className='w-3.5 h-3.5' />
      </Button>
    </div>
  );
});

// ─── Shared UI Atoms ──────────────────────────────────────────────────────────

// memo: EmptyState is purely presentational — no need to re-render
const EmptyState = memo(function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: { label: string; href: string };
}) {
  return (
    <div className='text-center py-12 md:py-16 px-4 bg-card border border-dashed border-border rounded-2xl'>
      <div className='mx-auto mb-3'>{icon}</div>
      <h3 className='text-sm md:text-base font-bold text-foreground mb-1'>
        {title}
      </h3>
      <p className='text-[11px] md:text-xs text-muted-foreground mb-4 max-w-xs mx-auto'>
        {description}
      </p>
      <Link href={action.href}>
        <Button
          size='sm'
          className='rounded-lg font-bold text-xs md:text-sm h-8 md:h-9 px-4'
        >
          {action.label}
        </Button>
      </Link>
    </div>
  );
});

function StoreFollowersSection({ userId }: { userId: string }) {
  const user = useQuery(api.users.getByExternalId, { externalId: userId });
  const followers = useQuery(api.followedSellers.getStoreFollowers, { sellerId: userId });
  const t = useTranslations('Favorites');

  // More robust premium check (Business/Premium/Pro tiers or Admin role)
  const isPremium = user?.role === 'ADMIN' || (user?.membershipTier && user.membershipTier !== 'FREE');

  if (!isPremium) return null;

  return (
    <div className='space-y-4 pt-4 border-t border-border/10'>
      <div className='flex items-center justify-between border-b border-border/50 pb-2'>
        <h3 className='font-bold text-lg md:text-xl text-foreground flex items-center gap-2'>
          <Users className='w-5 h-5 text-primary' />
          {t('my_followers')} ({followers?.length ?? 0})
        </h3>
      </div>

      {!followers ? (
        <CenteredSpinner />
      ) : followers.length === 0 ? (
        <div className='py-12 text-center bg-card/10 border border-dashed border-border rounded-xl'>
           <p className='text-xs text-muted-foreground font-medium'>{t('no_followers')}</p>
           <p className='text-[10px] text-muted-foreground/60 mt-1 max-w-xs mx-auto'>{t('followers_desc')}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
          {followers.map((follower) => {
            if (!follower) return null;
            return (
              <div key={follower._id} className='flex items-center gap-3 bg-card p-3 rounded-2xl border border-border/50 hover:border-primary/20 transition-all'>
                  <Avatar className='h-10 w-10 md:h-12 md:w-12 rounded-xl border border-border shrink-0'>
                    <AvatarImage src={follower.image || ''} className='object-cover' />
                    <AvatarFallback className='bg-muted text-muted-foreground font-bold text-sm'>
                      {follower.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <p className='font-bold text-sm truncate text-foreground'>{follower.name}</p>
                    <p className='text-[10px] text-muted-foreground font-medium uppercase tracking-tight'>
                        Followed {formatDistanceToNow(follower.followedAt)} ago
                    </p>
                  </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CenteredSpinner() {
  return (
    <div className='flex justify-center py-12'>
      <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
    </div>
  );
}
