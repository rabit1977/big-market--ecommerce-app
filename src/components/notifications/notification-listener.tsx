'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export function NotificationListener() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // We fetch last 5 notifications to check for new ones
  const data = useQuery(
    api.notifications.list,
    userId ? { userId, unreadOnly: true, limit: 5, skip: 0 } : 'skip'
  );

  const lastNotificationIdRef = useRef<string | null>(null);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (!data?.notifications || data.notifications.length === 0) {
      if (data) isFirstLoadRef.current = false;
      return;
    }

    const latest = data.notifications[0];
    const latestId = latest._id;

    // Skip first load to avoid toasting old notifications
    if (isFirstLoadRef.current) {
      lastNotificationIdRef.current = latestId;
      isFirstLoadRef.current = false;
      return;
    }

    if (latestId !== lastNotificationIdRef.current) {
      lastNotificationIdRef.current = latestId;

      // New notification!
      toast(latest.title, {
        description: latest.message,
        icon: <Bell className="w-4 h-4 text-primary" />,
        action: latest.link ? {
          label: 'View',
          onClick: () => {
             // Link handling is usually done via router, but sonner action handles onClick
             window.location.href = latest.link!;
          }
        } : undefined,
        duration: 5000,
      });
    }
  }, [data]);

  return null;
}
