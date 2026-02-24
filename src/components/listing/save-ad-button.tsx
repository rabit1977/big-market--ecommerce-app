'use client';

import type { Id } from '@/convex/_generated/dataModel';
import { useFavorites } from '@/lib/context/favorites-context';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface SaveAdButtonProps {
  listingId: Id<'listings'> | string;
  className?: string;
  iconClassName?: string;
  buttonClassName?: string;
  showText?: boolean;
}

export function SaveAdButton({ 
  listingId, 
  className,
  iconClassName,
  buttonClassName,
  showText = true
}: SaveAdButtonProps) {
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const isFavorite = checkFavorite(listingId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(listingId);
      }}
      className={cn(
        "flex items-center justify-center transition-all",
        showText ? "gap-2 px-4 py-2 border rounded-full text-sm font-bold shadow-sm" : "p-2.5 rounded-full",
        isFavorite
          ? (showText ? "bg-primary/5 border-primary/20 text-primary" : "bg-primary/10 text-primary")
          : (showText ? "bg-card border-border text-foreground hover:bg-accent" : "bg-muted text-muted-foreground hover:bg-muted/80"),
        className,
        buttonClassName
      )}
    >
      <Heart className={cn(showText ? "w-4 h-4" : "w-6 h-6", isFavorite && "fill-current", iconClassName)} />
      {showText && (isFavorite ? "Saved" : "Save Ad")}
    </button>
  );
}
