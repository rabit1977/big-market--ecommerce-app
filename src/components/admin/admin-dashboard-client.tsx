'use client';

import { AdminFilterToolbar, getSinceFromRange, TimeRange } from '@/components/admin/admin-filter-toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import {
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    Clock,
    CreditCard,
    Plus,
    ShieldCheck,
    Tag,
    Users
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { DashboardCard } from './dashboard-card';

export function AdminDashboardClient() {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const since = getSinceFromRange(timeRange);
  const t = useTranslations('AdminControls');

  const stats = useQuery(api.admin.getStats);
  const dailyDeltas = useQuery(api.admin.getDailyDeltas);
  const recentLogs = useQuery(api.activityLogs.list, { limit: 8 });
  const pendingListings = useQuery(api.listings.getPendingListings);
  const revenue = useQuery(api.transactions.getRevenueStats, { since });

  const isLoading = !stats || !dailyDeltas;

  const timeRangeLabel = (r: TimeRange) => {
    switch (r) {
      case 'today':  return t('today');
      case 'week':   return t('seven_days');
      case 'month':  return t('thirty_days');
      case 'year':   return t('year');
      default:       return t('all_time');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8 pb-20'>
      {/* Header with quick actions */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col space-y-1'>
          <h1 className='text-3xl sm:text-5xl font-black tracking-tighter text-foreground flex items-center gap-4 uppercase'>
            {t('dashboard_title')}
            <span className='inline-flex items-center justify-center px-2 py-1 rounded-xl bg-primary/10 text-primary text-[10px] font-black border border-primary/20 uppercase tracking-widest'>
              {t('live')}
            </span>
          </h1>
          <p className='text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60'>
            {t('welcome_back')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <AdminFilterToolbar
               timeRange={timeRange}
               onTimeRangeChange={setTimeRange}
               showSearch={false}
           />
           <Button variant="outline" size="sm" asChild className="hidden sm:flex rounded-xl font-black uppercase tracking-widest px-6 h-10 border-1 border-card-foreground/20 bm-interactive shadow-none transition-all">
              <Link href="/admin/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('view_reports')}
              </Link>
           </Button>
           <Button size="sm" asChild className="rounded-xl font-black uppercase tracking-widest px-6 h-10 shadow-none border border-primary transition-all active:scale-95">
              <Link href="/admin/users/create">
                <Plus className="w-4 h-4 mr-2" />
                {t('create_user')}
              </Link>
           </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard
          title={t('total_users')}
          value={stats?.users ?? 0}
          icon={Users}
          color="blue"
          trend={{ value: dailyDeltas?.newUsers ?? 0, isPositive: (dailyDeltas?.newUsers ?? 0) > 0 }}
          description={t('joined_today', { count: dailyDeltas?.newUsers ?? 0 })}
        />
        <DashboardCard
          title={t('active_listings')}
          value={stats?.activeListings ?? 0}
          icon={Tag}
          color="emerald"
          trend={{ value: dailyDeltas?.newListings ?? 0, isPositive: (dailyDeltas?.newListings ?? 0) > 0 }}
          description={t('posted_today', { count: dailyDeltas?.newListings ?? 0, total: stats?.listings ?? 0 })}
        />
        <DashboardCard
          title={`${t('revenue')} (${timeRangeLabel(timeRange)})`}
          value={revenue ? `${revenue.totalRevenue?.toFixed(0) ?? '0'} MKD` : `${(stats?.totalRevenue ?? 0).toLocaleString()} MKD`}
          icon={CreditCard}
          color="violet"
          trend={{ value: dailyDeltas?.revenueToday ?? 0, isPositive: (dailyDeltas?.revenueToday ?? 0) > 0 }}
          description={t('since_today')}
        />
      </div>

      {/* Secondary Row: Pending & Activity */}
      <div className='grid gap-6 lg:grid-cols-3'>
        
        {/* Pending Approvals */}
        <Card className="lg:col-span-2 rounded-2xl md:rounded-2xl overflow-hidden bm-interactive shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5 px-6 bg-muted/30 border-b border-card-foreground/10">
            <div className="space-y-1">
              <CardTitle className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {t('pending_approvals')}
              </CardTitle>
            </div>
            <Link href="/admin/listings?status=PENDING_APPROVAL" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1.5">
              {t('view_all')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {!pendingListings || pendingListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 border border-border">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-bold">{t('all_caught_up')}</h3>
                <p className="text-sm text-muted-foreground">{t('no_pending')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingListings.slice(0, 5).map((listing: any) => (
                  <div key={listing._id} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border-1 border-card-foreground/10 group-hover:bg-background transition-all duration-300">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-xl bg-card border-1 border-card-foreground/10 flex items-center justify-center text-foreground font-black text-xl uppercase tracking-tighter shadow-sm overflow-hidden">
                          {listing.images?.[0] ? <img src={listing.images[0]} className="w-full h-full object-cover" /> : listing.title[0]}
                       </div>
                       <div>
                          <p className="font-black text-xs sm:text-sm uppercase tracking-tight text-foreground line-clamp-1">{listing.title}</p>
                          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1">{listing.city}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <p className="text-sm sm:text-lg font-black tracking-tighter uppercase whitespace-nowrap">{listing.price} MKD</p>
                       <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-xl bm-interactive" asChild>
                          <Link href={`/admin/listings`}>
                            <ArrowUpRight className="w-5 h-5" />
                          </Link>
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-lg border-border shadow-none overflow-hidden bg-card transition-colors hover:bg-secondary/40">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {t('recent_activity')}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              {t('platform_logs')}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ActivityLogs logs={recentLogs || []} noActivityLabel={t('no_activity')} />
          </CardContent>
        </Card>

      </div>

      {/* Verification Summary */}
      <Card className="rounded-2xl md:rounded-3xl p-10 sm:p-14 relative overflow-hidden group bm-interactive shadow-none bg-primary/5 border-primary/20">
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-40 h-40 text-primary" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-5">
               <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl">
                  {t('action_required')}
               </Badge>
               <h2 className="text-3xl sm:text-6xl font-black tracking-tighter text-foreground uppercase leading-tight">
                  {t('pending_verifications', { count: stats?.pendingVerifications ?? 0 })}
               </h2>
               <p className="text-muted-foreground font-black text-xs sm:text-sm uppercase tracking-widest opacity-60 max-w-lg">
                  {t('verifications_desc')}
               </p>
            </div>
            <Button size="lg" asChild className="rounded-xl px-12 font-black uppercase tracking-widest h-16 shadow-none border border-primary active:scale-95 transition-all">
               <Link href="/admin/users?tab=verifications">
                  {t('go_to_verifications')}
                  <ArrowRight className="ml-3 w-6 h-6 text-white" />
               </Link>
            </Button>
         </div>
      </Card>
    </div>
  );
}

function ActivityLogs({ logs, noActivityLabel }: { logs: any[]; noActivityLabel: string }) {
  if (logs.length === 0) return <p className="text-center py-4 text-muted-foreground text-sm">{noActivityLabel}</p>;
  
  return (
    <div className="space-y-4">
      {logs.map((log, i) => (
        <div key={log._id} className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 border border-border">
             <ActivityIcon action={log.action} />
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-sm font-medium line-clamp-1">{log.details || log.action}</p>
             <p className="text-[10px] text-muted-foreground mt-0.5">
                {new Date(log.createdAt ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityIcon({ action }: { action: string }) {
  if (action.includes('USER')) return <Users className="w-4 h-4 text-primary" />;
  if (action.includes('LISTING')) return <Tag className="w-4 h-4 text-primary" />;
  if (action.includes('REVENUE')) return <CreditCard className="w-4 h-4 text-primary" />;
  return <Clock className="w-4 h-4 text-primary" />;
}
