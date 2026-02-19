'use client';

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
    MessageSquare,
    Plus,
    ShieldCheck,
    Tag,
    Users
} from 'lucide-react';
import Link from 'next/link';

// I will create this one to handle Convex data
import { DashboardCard } from './dashboard-card';

export function AdminDashboardClient() {
  const stats = useQuery(api.admin.getStats);
  const dailyDeltas = useQuery(api.admin.getDailyDeltas);
  const recentLogs = useQuery(api.activityLogs.list, { limit: 8 });
  const pendingListings = useQuery(api.listings.getPendingListings);

  const isLoading = !stats || !dailyDeltas;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8 pb-20'>
      {/* Header with quick actions */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-3'>
            Dashboard
            <span className='inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold ring-1 ring-inset ring-primary/20 uppercase tracking-widest'>
              Live
            </span>
          </h1>
          <p className='text-lg text-muted-foreground font-medium'>
            Welcome back! Here's what's happening on your platform today.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" asChild className="hidden sm:flex rounded-full">
              <Link href="/admin/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Link>
           </Button>
           <Button size="sm" asChild className="rounded-full shadow-lg shadow-primary/25">
              <Link href="/admin/users/create">
                <Plus className="w-4 h-4 mr-2" />
                Create User
              </Link>
           </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="blue"
          trend={{ value: dailyDeltas.newUsers, isPositive: dailyDeltas.newUsers > 0 }}
          description={`${dailyDeltas.newUsers} joined today`}
        />
        <DashboardCard
          title="Active Listings"
          value={stats.activeListings}
          icon={Tag}
          color="emerald"
          trend={{ value: dailyDeltas.newListings, isPositive: dailyDeltas.newListings > 0 }}
          description={`${dailyDeltas.newListings} posted today (Total: ${stats.listings})`}
        />
        <DashboardCard
          title="Total Revenue"
          value={stats.totalRevenue.toLocaleString() + ' MKD'}
          icon={CreditCard}
          color="violet"
          trend={{ value: dailyDeltas.revenueToday, isPositive: dailyDeltas.revenueToday > 0 }}
          description={`Today: +${dailyDeltas.revenueToday.toLocaleString()} MKD`}
        />
        <DashboardCard
          title="Support Tickets"
          value={stats.newInquiries}
          icon={MessageSquare}
          color="rose"
          description={`${stats.newInquiries} unread inquiries`}
        />
      </div>

      {/* Secondary Row: Pending & Activity */}
      <div className='grid gap-6 lg:grid-cols-3'>
        
        {/* Pending Approvals */}
        <Card className="lg:col-span-2 rounded-[2rem] border-border/50 shadow-xl overflow-hidden bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                Pending Approvals
              </CardTitle>
              <CardDescription>
                Review listings waiting for moderator approval
              </CardDescription>
            </div>
            <Link href="/admin/listings?status=PENDING_APPROVAL" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {!pendingListings || pendingListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="font-bold">All caught up!</h3>
                <p className="text-sm text-muted-foreground">No pending listings to review right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingListings.slice(0, 5).map((listing: any) => (
                  <div key={listing._id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold">
                          {listing.title[0]}
                       </div>
                       <div>
                          <p className="font-bold text-sm line-clamp-1">{listing.title}</p>
                          <p className="text-xs text-muted-foreground">{listing.city}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <p className="text-sm font-black tabular-nums">{listing.price} MKD</p>
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full" asChild>
                          <Link href={`/admin/listings`}>
                            <ArrowUpRight className="w-4 h-4" />
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
        <Card className="rounded-[2rem] border-border/50 shadow-xl overflow-hidden bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Platform activity logs
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ActivityLogs logs={recentLogs || []} />
          </CardContent>
        </Card>

      </div>

      {/* Verification Summary */}
      <Card className="rounded-[2.5rem] border-border/50 shadow-xl p-8 sm:p-10 bg-gradient-to-br from-indigo-500 to-violet-600 text-white relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
               <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                  Action Required
               </Badge>
               <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                  {stats.pendingVerifications} Pending ID Verifications
               </h2>
               <p className="text-indigo-100 font-medium max-w-lg">
                  There are users waiting for their identity verification. Verifying users boosts platform trust and safety.
               </p>
            </div>
            <Button size="lg" variant="secondary" asChild className="rounded-full px-8 bg-white text-indigo-600 hover:bg-indigo-50 font-bold h-14">
               <Link href="/admin/users?tab=verifications">
                  Go to Verifications
                  <ArrowRight className="ml-2 w-5 h-5" />
               </Link>
            </Button>
         </div>
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
         <ShieldCheck className="absolute bottom-0 right-0 w-48 h-48 text-white/5 -mb-12 -mr-12" />
      </Card>
    </div>
  );
}

function ActivityLogs({ logs }: { logs: any[] }) {
  if (logs.length === 0) return <p className="text-center py-4 text-muted-foreground text-sm">No recent activity.</p>;
  
  return (
    <div className="space-y-4">
      {logs.map((log, i) => (
        <div key={log._id} className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
             <ActivityIcon action={log.action} />
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-sm font-medium line-clamp-1">{log.details || log.action}</p>
             <p className="text-[10px] text-muted-foreground mt-0.5">
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityIcon({ action }: { action: string }) {
  if (action.includes('USER')) return <Users className="w-4 h-4 text-blue-500" />;
  if (action.includes('LISTING')) return <Tag className="w-4 h-4 text-emerald-500" />;
  if (action.includes('REVENUE')) return <CreditCard className="w-4 h-4 text-violet-500" />;
  return <Clock className="w-4 h-4 text-slate-500" />;
}
