'use client';

import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useSession } from 'next-auth/react';
import {
  createContext,
  useCallback,
  useContext,
  useOptimistic,
  useState,
  useTransition,
} from 'react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FavoritesContextType {
  favorites: Set<string>;
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listingId: string) => Promise<void>;
  isLoading: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function FavoritesProvider({
  children,
  initialFavorites = [],
}: {
  children: React.ReactNode;
  initialFavorites?: string[];
}) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  // Convex real-time source of truth — falls back to initialFavorites until loaded
  const convexFavorites = useQuery(
    api.favorites.get,
    session?.user?.id ? { userId: session.user.id } : 'skip'
  );

  // Derive the canonical list: prefer live Convex data, fall back to SSR initial value
  const canonicalFavorites: string[] = convexFavorites
    ? convexFavorites.map((f) => f.listingId)
    : initialFavorites;

  // useOptimistic on the canonical list — no separate favoritesState needed
  const [optimisticFavorites, setOptimisticFavorites] = useOptimistic(
    canonicalFavorites,
    (state, { id, add }: { id: string; add: boolean }) =>
      add ? [...state, id] : state.filter((fid) => fid !== id)
  );

  const isFavorite = useCallback(
    (listingId: string) => optimisticFavorites.includes(listingId),
    [optimisticFavorites]
  );

  const toggleFavorite = useCallback(
    async (listingId: string) => {
      if (!session?.user) {
        toast.error('Please sign in to save favorites');
        return;
      }

      const add = !optimisticFavorites.includes(listingId);

      startTransition(async () => {
        setOptimisticFavorites({ id: listingId, add });
        try {
          const result = await toggleWishlistAction(listingId);
          if (!result.success) {
            toast.error(result.error ?? 'Failed to update favorites');
            // Optimistic state auto-reverts when transition ends since
            // canonicalFavorites (from Convex) hasn't changed
          }
        } catch {
          toast.error('Something went wrong');
        }
      });
    },
    [session, optimisticFavorites, setOptimisticFavorites]
  );

  const value: FavoritesContextType = {
    favorites: new Set(optimisticFavorites),
    isFavorite,
    toggleFavorite,
    isLoading: !!session?.user && convexFavorites === undefined,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}