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
        'flex items-center justify-center transition-all duration-300 group/heart active:scale-90',
        showText
          ? 'gap-2 px-4 py-2 border rounded-full text-sm font-bold shadow-sm'
          : 'p-2 rounded-full shadow-sm hover:shadow-md backdrop-blur-md border border-border/50',
        isFavorite
          ? showText
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-white dark:bg-zinc-900 text-red-500 border-red-500/20'
          : showText
            ? 'bg-white border-border text-foreground hover:bg-accent'
            : 'bg-white dark:bg-black/20 text-muted-foreground/60 hover:text-primary hover:border-primary/30 transition-all',
        className,
        buttonClassName,
      )}
    >
      <Heart
        className={cn(
          showText ? 'w-5 h-5' : 'w-[16px] h-[16px] sm:w-[24px] sm:h-[24px]',
          'transition-transform duration-200 group-hover/heart:scale-110',
          isFavorite && 'fill-current',
          iconClassName,
        )}
      />
      {showText && (isFavorite ? t('saved') : t('save_ad'))}
    </button>
  );
}
