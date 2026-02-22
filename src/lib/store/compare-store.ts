import { ListingWithRelations } from '@/lib/types/listing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  items: ListingWithRelations[];
  addItem: (listing: ListingWithRelations) => void;
  removeItem: (listingId: string) => void;
  clearItems: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (listing: ListingWithRelations) => {
        const currentItems = get().items;
        if (currentItems.find((item: ListingWithRelations) => item._id === listing._id)) return;
        if (currentItems.length >= 3) {
           // Replace the oldest item or just prevent adding
           // Let's prevent and maybe UI will show a toast
           return;
        }
        set({ items: [...currentItems, listing] });
      },
      removeItem: (listingId: string) => {
        set({ items: get().items.filter((item: ListingWithRelations) => item._id !== listingId) });
      },
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'compare-storage',
    }
  )
);
