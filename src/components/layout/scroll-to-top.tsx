'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Scrolls the window to the top whenever the pathname changes (page navigation).
 * Renders nothing — purely behavioural.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
