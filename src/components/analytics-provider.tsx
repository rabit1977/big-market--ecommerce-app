'use client';

import { trackEventAction } from '@/actions/admin/analytics-actions';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Client-side component to track page views automatically
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    // 1. Initialize Session ID
    let sid = sessionStorage.getItem('analytics_session_id');
    if (!sid) {
      sid = uuidv4();
      sessionStorage.setItem('analytics_session_id', sid);
    }
    sessionIdRef.current = sid;

    // 2. Track Initial Page Load
    trackPageView(pathname);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]); // Re-run on route change

  const trackPageView = async (path: string) => {
      // Small delay to ensure any title updates happen (optional)
      await trackEventAction({
          eventType: 'page_view',
          sessionId: sessionIdRef.current,
          page: path,
          referrer: document.referrer,
      });
  };

  return null; // Headless component
}
