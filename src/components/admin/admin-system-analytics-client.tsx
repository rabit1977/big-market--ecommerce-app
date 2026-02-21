'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { BarChart3, Clock, CreditCard, Loader2, MessageSquare, ShieldCheck, Users } from 'lucide-react';

export function AdminSystemAnalyticsClient() {
  const stats = useQuery(api.admin.getStats, {});

  if (stats === undefined) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statItems = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', description: 'Registered platform users' },
    { label: 'Total Listings', value: stats.listings, icon: BarChart3, color: 'text-emerald-500', description: 'Active and inactive listings' },
    { label: 'Promoted Listings', value: stats.promotedListings, icon: CreditCard, color: 'text-amber-500', description: 'Listings with active promotions' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: ShieldCheck, color: 'text-purple-500', description: 'Users awaiting ID verification' },
    { label: 'Support Inquiries', value: stats.newInquiries, icon: MessageSquare, color: 'text-rose-500', description: 'New contact form submissions' },
  ];

  return (
    <div className='space-y-6 pb-20'>
      <div className='space-y-1'>
        <h1 className='text-3xl font-black tracking-tight'>Systems Analytics</h1>
        <p className='text-muted-foreground'>Real-time platform statistics and activity metrics.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {statItems.map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Quick Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border/40 italic">
            Visual charts and historical trends for {new Date().getFullYear()} will be available in the next update as more data is collected.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
