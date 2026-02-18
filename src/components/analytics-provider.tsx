'use client';

import { trackEventAction } from '@/actions/admin/analytics-actions';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

// ─── Module-level session util (reuse across the app, drop uuid dependency) ───
// This is the single source of truth — import this in listing-detail-content.tsx
// too instead of duplicating the logic there.

export function getOrCreateSessionId(): string {
  let sid = sessionStorage.getItem('analytics_session_id');
  if (!sid) {
    // crypto.randomUUID() is available in all modern browsers + Node 18+
    sid = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sid);
  }
  return sid;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Stable ref — no re-render when session ID is set
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    // Assign once per mount; subsequent route changes reuse the same session
    if (!sessionIdRef.current) {
      sessionIdRef.current = getOrCreateSessionId();
    }

    // Capture referrer synchronously before any async gap
    const referrer = document.referrer;
    const sessionId = sessionIdRef.current;

    trackEventAction({
      eventType: 'page_view',
      sessionId,
      page: pathname,
      referrer,
    });
    // searchParams included so hash/query changes also trigger a view
  }, [pathname, searchParams]);

  return null;
}