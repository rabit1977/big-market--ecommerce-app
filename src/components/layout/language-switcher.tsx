'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 hidden sm:flex rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-border/40">
          <Globe className="h-4.5 w-4.5" />
          <span className="absolute -bottom-1 -right-1 flex h-[14px] items-center justify-center rounded bg-primary px-1 text-[8px] font-bold text-white uppercase ring-1 ring-background">
            {locale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[120px]">
        <DropdownMenuItem 
           onClick={() => handleLanguageChange('mk')}
           className={locale === 'mk' ? 'bg-primary/10 text-primary font-bold' : ''}
        >
          🇲🇰 Macedonian
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
