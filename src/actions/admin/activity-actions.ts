'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';

export async function getActivityLogs(limit = 50) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const logs = await convex.query(api.activityLogs.list, { limit });
    
    // Enrich logs with user data (Mocking or fetching from users table)
    const enrichedLogs = await Promise.all(logs.map(async (log) => {
        const user = await convex.query(api.users.getByExternalId, { externalId: log.userId });
        return {
            ...log,
            id: log._id,
            description: log.details || `${log.action} by ${user?.name || 'Unknown User'}`,
            user: {
                name: user?.name || 'Unknown User',
                image: user?.image || null,
                email: user?.email || '',
            },
            createdAt: new Date(log.createdAt || log._creationTime)
        };
    }));

    return { success: true, data: enrichedLogs };
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return { success: false, error: 'Failed to fetch activity logs' };
  }
}
