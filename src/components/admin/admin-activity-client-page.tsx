'use client';

import { ActivityLogs } from '@/components/admin/activity-logs';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';

export function AdminActivityClientPage() {
  const logsRaw = useQuery(api.activityLogs.list, { limit: 100 });

  if (logsRaw === undefined) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Format the logs to match what ActivityLogs expects
  const formattedLogs = logsRaw.map(log => ({
      ...log,
      id: log._id,
      description: log.details || `${log.action} by ${log.user?.name || 'Unknown User'}`,
      createdAt: new Date(log.createdAt || log._creationTime)
  }));

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex flex-col space-y-1 mb-6'>
        <h2 className='text-3xl font-bold tracking-tight text-foreground'>Activity Logs</h2>
        <p className='text-sm text-muted-foreground font-medium'>
            Recent platform actions and system events happening in real-time.
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-1'>
          <div className="rounded-lg border bg-card text-card-foreground p-6">
             <ActivityLogs logs={formattedLogs as any} />
          </div>
      </div>
    </div>
  );
}
