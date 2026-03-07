'use client';

import type { Id } from '@/convex/_generated/dataModel';
import { useFavorites } from '@/lib/context/favorites-context';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  showText = true,
}: SaveAdButtonProps) {
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const isFavorite = checkFavorite(listingId);
  const t = useTranslations('Common');

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(listingId);
      }}
      className={cn(
        'flex items-center justify-center transition-all duration-200 group/heart active:scale-95',
        showText
          ? 'gap-2 px-4 py-2 border rounded-full text-sm font-bold shadow-sm'
          : 'p-1.5 rounded-full shadow-lg backdrop-blur-md border border-white/20',
        isFavorite
          ? showText
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-red-500/20 text-red-500 shadow-md shadow-red-500/5'
          : showText
            ? 'bg-card border-border text-foreground hover:bg-accent'
            : 'bg-white/80 hover:bg-white/100 dark:bg-black/50 dark:hover:bg-black/70 text-slate-900 dark:text-white',
        className,
        buttonClassName,
      )}
    >
      <Heart
        className={cn(
          showText ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]',
          'transition-transform duration-200 group-hover/heart:scale-110',
          isFavorite && 'fill-current',
          iconClassName,
        )}
      />
      {showText && (isFavorite ? t('saved') : t('save_ad'))}
    </button>
  );
}
