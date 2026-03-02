'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Set cookie to persist locale choice
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Soft server-side refresh — re-fetches RSC without a hard page reload
    // No scroll reset, no flash, no full navigation
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 flex rounded-full text-muted-foreground bm-interactive transition-all"
          aria-label={`Language: ${locale === 'mk' ? 'Macedonian' : 'English'}`}
        >
          <Globe className="h-4 w-4" />
          <span className="absolute -bottom-1 -right-1 flex h-[14px] items-center justify-center rounded bg-primary px-1 text-[8px] font-bold text-white uppercase ring-1 ring-background leading-none">
            {locale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('mk')}
          className={locale === 'mk' ? 'bg-primary/10 text-primary font-bold' : ''}
        >
          🇲🇰 Македонски
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className={locale === 'en' ? 'bg-primary/10 text-primary font-bold' : ''}
        >
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
