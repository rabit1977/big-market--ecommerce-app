'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

const palettes = [
  { id: 'default', name: 'Original', color: '#ff0000' },
  { id: 'twitter', name: 'Ocean', color: '#1da1f2' },
  { id: 'instagram', name: 'Light Rose', color: '#e1306c' },
  { id: 'tiktok', name: 'Rose', color: '#ff0050' },
  { id: 'emerald', name: 'Emerald', color: '#10b981' },
  { id: 'royal', name: 'Gold', color: '#f59e0b' },
];

export function PaletteSwitcher() {
  const [currentPalette, setCurrentPalette] = useState('default');

  useEffect(() => {
    // Load initial palette from localStorage
    const saved = localStorage.getItem('app-palette') || 'default';
    setCurrentPalette(saved);
    document.documentElement.setAttribute('data-palette', saved);
  }, []);

  const handlePaletteChange = (id: string) => {
    setCurrentPalette(id);
    localStorage.setItem('app-palette', id);
    document.documentElement.setAttribute('data-palette', id);
    
    // Optional: Add a subtle haptic feedback or sound if desired
  };

  return (
    <div className="space-y-3 px-1">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {palettes.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePaletteChange(p.id)}
            className={cn(
              "relative flex flex-col items-center gap-1 p-1 rounded-xl transition-all hover:bg-muted group w-[48px]",
              currentPalette === p.id ? "bg-muted shadow-sm" : "opacity-70 hover:opacity-100"
            )}
            title={p.name}
          >
            <div 
              className="w-7 h-7 rounded-full border-2 border-background shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
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
