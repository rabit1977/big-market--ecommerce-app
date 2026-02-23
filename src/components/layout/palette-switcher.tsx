'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
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
  // Initialize with stable default to match server
  const [currentPalette, setCurrentPalette] = useState('default');

  // Load palette and apply effects on mount only
  useEffect(() => {
    const saved = localStorage.getItem(PALETTE_KEY) ?? 'default';
    setCurrentPalette(saved);
    document.documentElement.setAttribute('data-palette', saved);
  }, []);

  const handlePaletteChange = (id: string) => {
    setCurrentPalette(id);
    applyPalette(id);
  };

  return (
    <div className="space-y-3 px-1">
      <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide no-scrollbar md:justify-center">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePaletteChange(p.id)}
            aria-label={`Switch to ${p.name} palette`}
            aria-pressed={currentPalette === p.id}
            className={cn(
              'relative flex flex-col items-center gap-1 p-1 rounded-xl transition-all hover:bg-muted group shrink-0 min-w-[44px]',
              currentPalette === p.id ? 'bg-muted shadow-sm' : 'opacity-70 hover:opacity-100'
            )}
          >
            <div
              className="w-7 h-7 rounded-full border-2 border-background shadow-inner flex items-center justify-center transition-transform group-hover:scale-110 shrink-0"
              style={{ backgroundColor: p.color }}
            >
              {currentPalette === p.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Check className="w-3.5 h-3.5 text-white drop-shadow-md" strokeWidth={3} />
                </motion.div>
              )}
            </div>
            <span className="text-[8px] font-bold uppercase tracking-tight truncate w-full text-center leading-tight">
              {p.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}