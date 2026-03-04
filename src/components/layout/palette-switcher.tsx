'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Check, Palette } from 'lucide-react';
import { useEffect, useState } from 'react';

const PALETTE_KEY = 'app-palette';

const PALETTES = [
  { id: 'default',   name: 'Original',   color: '#ff0000' },
  { id: 'twitter',   name: 'Ocean',       color: '#1da1f2' },
  { id: 'instagram', name: 'Light Rose',  color: '#e1306c' },
  { id: 'tiktok',    name: 'Rose',        color: '#ff0050' },
  { id: 'emerald',   name: 'Emerald',     color: '#10b981' },
  { id: 'royal',     name: 'Gold',        color: '#f59e0b' },
];

function applyPalette(id: string) {
  document.documentElement.setAttribute('data-palette', id);
  localStorage.setItem(PALETTE_KEY, id);
}

export function PaletteSwitcher() {
  const [currentPalette, setCurrentPalette] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem(PALETTE_KEY) ?? 'default';
    setCurrentPalette(saved);
    document.documentElement.setAttribute('data-palette', saved);
  }, []);

  const handlePaletteChange = (id: string) => {
    setCurrentPalette(id);
    applyPalette(id);
  };

  const currentSettings = PALETTES.find(p => p.id === currentPalette) || PALETTES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 flex rounded-full text-muted-foreground bm-interactive transition-all"
          aria-label="Theme Color Palette"
        >
          <Palette className="h-4 w-4" />
          <span 
            className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-background border border-border"
            style={{ backgroundColor: currentSettings.color }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px] z-[70]">
        {PALETTES.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => handlePaletteChange(p.id)}
            className={cn(
               "flex items-center gap-2",
               currentPalette === p.id ? "bg-primary/10 font-bold" : ""
            )}
          >
            <div
              className="w-4 h-4 rounded-full border border-border shadow-inner shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span className="flex-1">{p.name}</span>
            {currentPalette === p.id && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}