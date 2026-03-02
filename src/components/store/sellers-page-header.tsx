'use client';

import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SellersPageHeader() {
  const t = useTranslations('Sellers');
  return (
    <div className="flex items-center gap-2.5 mb-6 md:mb-8">
      <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg md:rounded-xl">
        <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-primary" />
      </div>
      <div>
        <h1 className="text-base md:text-xl font-black tracking-tight text-foreground">
          {t('page_title')}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground font-medium">
          {t('page_subtitle')}
        </p>
      </div>
    </div>
  );
}
