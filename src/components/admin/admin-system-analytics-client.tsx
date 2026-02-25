'use client';

import { AdminFilterToolbar, getSinceFromRange, TimeRange } from '@/components/admin/admin-filter-toolbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { BarChart3, Clock, CreditCard, Loader2, ShieldCheck, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

export function AdminSystemAnalyticsClient() {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const since = getSinceFromRange(timeRange);

  const stats    = useQuery(api.admin.getStats, {});
  const deltas   = useQuery(api.admin.getDailyDeltas);
  const revenue  = useQuery(api.transactions.getRevenueStats, { since });

  if (stats === undefined) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Users', value: stats.users, icon: Users, color: 'text-primary',
      bg: 'bg-primary/10', border: 'border-primary/20',
      delta: deltas?.newUsers,
      description: 'Registered platform users',
    },
    {
      label: 'Total Listings', value: stats.listings, icon: BarChart3, color: 'text-primary',
      bg: 'bg-primary/10', border: 'border-primary/20',
      delta: deltas?.newListings,
      description: 'All active and inactive listings',
    },
    {
      label: 'Promoted Listings', value: stats.promotedListings, icon: CreditCard, color: 'text-primary',
      bg: 'bg-primary/10', border: 'border-primary/20',
      delta: undefined,
      description: 'Listings with active promotions',
    },
    {
      label: 'Pending Verifications', value: stats.pendingVerifications, icon: ShieldCheck, color: 'text-primary',
      bg: 'bg-primary/10', border: 'border-primary/20',
      delta: undefined,
      description: 'Users awaiting ID verification',
    },
  ];

  const revenueItems = revenue ? [
    { label: 'Gross Revenue',       value: `${revenue.totalRevenue?.toFixed(0) ?? '0'} MKD` },
    { label: 'Net Revenue (ex VAT)', value: `${revenue.netRevenue?.toFixed(0) ?? '0'} MKD` },
    { label: 'Promotion Revenue',   value: `${revenue.promotionRevenue?.toFixed(0) ?? '0'} MKD` },
    { label: 'Subscription Revenue', value: `${revenue.verificationRevenue?.toFixed(0) ?? '0'} MKD` },
  ] : [];


  return (
    <div className='space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-2'>
           <h1 className='text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3'>
             System Analytics
             <span className='inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold ring-1 ring-inset ring-primary/20 uppercase tracking-widest'>
                Live
             </span>
           </h1>
           <p className='text-muted-foreground font-medium text-sm'>
               Real-time platform statistics and activity metrics.
           </p>
        </div>
        {/* Time filter for revenue section */}
        <AdminFilterToolbar
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            showSearch={false}
            className="sm:w-auto"
        />
      </div>

      {/* Revenue Overview (time-filtered) */}
      {revenue && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Revenue — <span className="text-primary capitalize">{timeRange === 'all' ? 'All Time' : timeRange}</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueItems.map(r => (
              <div key={r.label} className="glass-card rounded-2xl p-5 border border-border/60 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{r.label}</p>
                <p className="text-xl font-black text-foreground mt-1">{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Stats (all-time) */}
      <div className='space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Users className="w-4 h-4" /> Platform Stats — All Time
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
          {statItems.map((stat, idx) => (
            <div
              key={stat.label}
              className={`glass-card rounded-3xl p-6 border ${stat.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between ${
                idx < 2 ? 'xl:col-span-1' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {stat.delta !== undefined && (
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
                    stat.delta > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                  }`}>
                    {stat.delta > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    +{stat.delta} today
                  </div>
                )}
              </div>
              <div>
                <div className="text-3xl font-black tracking-tight mb-1 text-foreground">{stat.value}</div>
                <h3 className="text-sm font-bold text-foreground/90">{stat.label}</h3>
                <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for future charts */}
      <Card className="rounded-[2rem] border-border/50 shadow-xl overflow-hidden bg-card/60 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <CardHeader className="p-6 md:p-8 border-b border-border/40 bg-muted/20">
          <CardTitle className="text-xl font-bold flex items-center gap-3 tracking-tight">
            <Clock className="h-5 w-5 text-primary" />
            Historical Trends
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Activity charts and trajectory analysis over time.</p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl border border-dashed border-border/60">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-primary/60" />
             </div>
             <h3 className="font-bold text-lg text-foreground mb-2">Charts Coming Soon</h3>
             <p className="text-sm text-muted-foreground max-w-md mx-auto">
               Visual charts for users, listings, revenue, and traffic over time are being compiled. More data points collect every day.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
