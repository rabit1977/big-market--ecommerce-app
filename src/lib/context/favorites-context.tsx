'use client';

import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useSession } from 'next-auth/react';
import { createContext, useCallback, useContext, useEffect, useOptimistic, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: Set<string>;
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listingId: string) => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ 
  children, 
  initialFavorites = [] 
}: { 
  children: React.ReactNode; 
  initialFavorites?: string[];
}) {
  const { data: session } = useSession();
  const [favoritesState, setFavoritesState] = useState<string[]>(initialFavorites);
  const [isPending, startTransition] = useTransition();

  // Fetch updated favorites from Convex if user is logged in
  // We use "skip" if no user, but since we have initialFavorites, we might want to respect that first.
  // However, initialFavorites come from server component which fetched it.
  // The useQuery will update it in real-time.
  const convexFavorites = useQuery(api.favorites.get, session?.user?.id ? { userId: session.user.id } : "skip");

  // Sync state with convex result
  useEffect(() => {
    if (convexFavorites) {
      setFavoritesState(convexFavorites.map(f => f.listingId));
    }
  }, [convexFavorites]);

  // Use optimistic updates for instant feedback
  const [optimisticFavorites, setOptimisticFavorites] = useOptimistic(
    favoritesState,
    (state, { id, isWished }: { id: string; isWished: boolean }) => {
      if (isWished) {
        return [...state, id];
      } else {
        return state.filter(fid => fid !== id);
      }
    }
  );

  const isFavorite = useCallback((listingId: string) => {
    return optimisticFavorites.includes(listingId);
  }, [optimisticFavorites]);

  const toggleFavorite = useCallback(async (listingId: string) => {
    if (!session?.user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    const currentlyFavorite = isFavorite(listingId);
    
    // Optimistic update
    startTransition(async () => {
      setOptimisticFavorites({ id: listingId, isWished: !currentlyFavorite });
      
      try {
        const result = await toggleWishlistAction(listingId);
        if (!result.success) {
          // Revert if failed (by re-toggling effectively, but optimistic state is tricky to revert exactly without unique ID for update)
          // Since we rely on server action result, we can just update local state with result.isWished
          // But here we just show error. The next useQuery update will fix the state.
          toast.error(result.error || "Failed to update favorites");
           // Force update state to revert optimistic change if needed?
           // Actually, optimistic state automatically resets when the transition finishes if we don't update the underlying state.
           // But here we rely on convexFavorites to update the underlying state eventually.
           // Or we update local state manually if we want immediate revert.
        } else {
             // Success - the query will update automatically via Convex, 
             // but we can also update local state to ensure it persists until next fetch
             if (result.isWished !== undefined) {
                 setFavoritesState(prev => {
                     if (result.isWished) return [...prev, listingId];
                     return prev.filter(id => id !== listingId);
                 });
             }
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  }, [session, isFavorite, setOptimisticFavorites]);

  const value = {
    favorites: new Set(optimisticFavorites),
    isFavorite,
    toggleFavorite,
    isLoading: !convexFavorites && session?.user !== undefined
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
