'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';

export async function trackEventAction(data: {
  eventType: string;
  sessionId: string;
  page?: string;
  referrer?: string;
  data?: any;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    await convex.mutation(api.analytics.trackEvent, {
      ...data,
      userId,
    });

    return { success: true };
  } catch (error) {
    // Analytics failures shouldn't crash the app
    console.error('Analytics tracking error:', error);
    return { success: false, error: 'Failed to track event' };
  }
}
