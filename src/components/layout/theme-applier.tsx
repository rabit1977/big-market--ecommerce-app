'use client';

import { useEffect } from 'react';

const PALETTE_KEY = 'app-palette';

/**
 * Re-applies the saved color palette from localStorage after hydration.
 * This compensates for next-themes potentially overwriting the data-palette
 * attribute that was set by the inline blocking <script> in layout.tsx.
 */
export function ThemeApplier() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PALETTE_KEY);
      if (saved) {
        document.documentElement.setAttribute('data-palette', saved);
      }
    } catch {
      // localStorage not available (e.g. private browsing with restrictions)
    }
  }, []);

  return null;
}
