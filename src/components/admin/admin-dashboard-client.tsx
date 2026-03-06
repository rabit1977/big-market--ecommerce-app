'use client';

import {
  AdminFilterToolbar,
  getSinceFromRange,
  TimeRange,
} from '@/components/admin/admin-filter-toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { formatCurrency } from '@/lib/utils/formatters';
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
  Users,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { DashboardCard } from './dashboard-card';

export function AdminDashboardClient() {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const since = getSinceFromRange(timeRange);
  const t = useTranslations('AdminControls');

  const stats = useQuery(api.admin.getStats);
  const dailyDeltas = useQuery(api.admin.getDailyDeltas);
  const recentLogs = useQuery(api.activityLogs.list, { limit: 5 });
  const pendingListings = useQuery(api.listings.getPendingListings);
  const revenue = useQuery(api.transactions.getRevenueStats, { since });

  const isLoading = !stats || !dailyDeltas;

  const timeRangeLabel = (r: TimeRange) => {
    switch (r) {
      case 'today':
        return t('today');
      case 'week':
        return t('seven_days');
      case 'month':
        return t('thirty_days');
      case 'year':
        return t('year');
      default:
        return t('all_time');
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-8 min-h-[60vh] flex flex-col items-center justify-center text-center'>
        <div className='relative'>
          <div className='w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-8 h-8 bg-primary/10 rounded-full animate-pulse' />
          </div>
        </div>
        <div className='space-y-2'>
          <h3 className='text-xl font-black uppercase tracking-widest animate-pulse'>
            Initializing Dashboard
          </h3>
          <p className='text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60'>
            Gathering platform intelligence...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8 pb-20'>
      {/* Header with quick actions */}
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-2'>
        <div className='flex flex-col'>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl sm:text-4xl font-black tracking-tighter text-foreground flex items-center gap-3 uppercase'>
              {t('dashboard_title')}
              <span className='inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black border border-primary/20 uppercase tracking-widest'>
                {t('live')}
              </span>
            </h1>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto mb-6'>
          <div className='flex-1 sm:flex-none'>
            <AdminFilterToolbar
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              showSearch={false}
            />
          </div>
          <div className='grid grid-cols-1 xs:grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto'>
            <Button
              size='sm'
              asChild
              className='rounded-xl font-black uppercase tracking-widest px-4 h-11 shadow-md shadow-primary/10 border border-primary transition-all active:scale-95 text-[10px] sm:text-xs'
            >
              <Link
                href='/admin/users/create'
                className='flex items-center justify-center'
              >
                <Plus className='w-3.5 h-3.5 mr-2' />
                {t('create_user')}
              </Link>
            </Button>
            <Button
              variant='outline'
              size='sm'
              asChild
              className='rounded-xl font-black uppercase tracking-widest px-4 h-11 border-border bg-card/50 transition-all text-[10px] sm:text-xs overflow-hidden'
            >
              <Link
                href='/admin/analytics'
                className='flex items-center justify-center'
              >
                <BarChart3 className='w-3.5 h-3.5 mr-2 shrink-0' />
                <span className='truncate whitespace-nowrap'>
                  {t('view_reports')}
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard
          title={t('total_users')}
          value={stats?.users ?? 0}
          icon={Users}
          color='blue'
          trend={{
            value: dailyDeltas?.newUsers ?? 0,
            isPositive: (dailyDeltas?.newUsers ?? 0) > 0,
          }}
        />
        <DashboardCard
          title={t('active_listings')}
          value={stats?.activeListings ?? 0}
          icon={Tag}
          color='emerald'
          trend={{
            value: dailyDeltas?.newListings ?? 0,
            isPositive: (dailyDeltas?.newListings ?? 0) > 0,
          }}
        />
        <DashboardCard
          title={`${t('revenue')} (${timeRangeLabel(timeRange)})`}
          value={
            revenue
              ? `${revenue.totalRevenue?.toFixed(0) ?? '0'} MKD`
              : `${(stats?.totalRevenue ?? 0).toLocaleString()} MKD`
          }
          icon={CreditCard}
          color='violet'
          trend={{
            value: dailyDeltas?.revenueToday ?? 0,
            isPositive: (dailyDeltas?.revenueToday ?? 0) > 0,
          }}
        />
      </div>

      {/* Secondary Row: Pending & Activity */}
      <div className='grid gap-4 lg:grid-cols-3'>
        {/* Pending Approvals */}
        <Card className='lg:col-span-2 rounded-2xl md:rounded-2xl overflow-hidden bm-interactive shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 py-5 px-4 bg-muted/30 border-b border-card-foreground/10'>
            <div className='space-y-1'>
              <CardTitle className='text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-2'>
                <ShieldCheck className='w-4 h-4 text-primary' />
                {t('pending_approvals')}
              </CardTitle>
            </div>
            <Link
              href='/admin/listings?status=PENDING_APPROVAL'
              className='text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1.5'
            >
              {t('view_all')} <ArrowRight className='w-3.5 h-3.5' />
            </Link>
          </CardHeader>
          <CardContent>
            {!pendingListings || pendingListings.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 border border-border'>
                  <Plus className='w-6 h-6 text-muted-foreground' />
                </div>
                <h3 className='font-bold'>{t('all_caught_up')}</h3>
                <p className='text-sm text-muted-foreground'>
                  {t('no_pending')}
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {pendingListings.slice(0, 5).map((listing: any) => (
                  <div
                    key={listing._id}
                    className='flex items-center justify-between p-4 rounded-xl bg-muted/40 border-1 border-card-foreground/10 group-hover:bg-background transition-all duration-300'
                  >
                    <div className='flex items-center gap-5'>
                      <div className='w-14 h-14 rounded-xl bg-card border-1 border-card-foreground/10 flex items-center justify-center text-foreground font-black text-xl uppercase tracking-tighter shadow-sm overflow-hidden'>
                        {listing.images?.[0] ? (
                          <img
                            src={listing.images[0]}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          listing.title[0]
                        )}
                      </div>
                      <div>
                        <p className='font-black text-xs sm:text-sm uppercase tracking-tight text-foreground line-clamp-1'>
                          {listing.title}
                        </p>
                        <p className='text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1'>
                          {listing.city}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-4'>
                      <p className='text-sm sm:text-lg font-black tracking-tighter uppercase whitespace-nowrap'>
                        {formatCurrency(
                          listing.price,
                          listing.currency || 'MKD',
                        )}
                      </p>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-10 w-10 p-0 rounded-xl bm-interactive'
                        asChild
                      >
                        <Link href={`/admin/listings`}>
                          <ArrowUpRight className='w-5 h-5' />
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
        <Card className='rounded-xl border-border shadow-none overflow-hidden bg-card transition-colors hover:bg-secondary/40'>
          <CardHeader className='bg-muted/10 border-b border-border/50 flex flex-row items-center justify-between py-3 px-4 space-y-0'>
            <div className='flex items-center gap-2 min-w-0'>
              <Clock className='w-4 h-4 text-primary shrink-0' />
              <div className='flex flex-col min-w-0'>
                <CardTitle className='text-sm sm:text-base font-black uppercase tracking-wider truncate'>
                  {t('recent_activity')}
                </CardTitle>
                <span className='text-[10px] text-muted-foreground font-medium uppercase tracking-wider opacity-60 truncate'>
                  {t('platform_logs')}
                </span>
              </div>
            </div>
            <Link
              href='/admin/activity'
              className='text-[9px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 shrink-0 ml-2'
            >
              {t('view_all')} <ArrowRight className='w-3 h-3' />
            </Link>
          </CardHeader>
          <CardContent className='p-0'>
            <ActivityLogs
              logs={recentLogs || []}
              noActivityLabel={t('no_activity')}
            />
          </CardContent>
        </Card>
      </div>

      {/* Verification Summary */}
      <Card className='rounded-2xl md:rounded-3xl p-10 sm:p-14 relative overflow-hidden group bm-interactive shadow-none bg-primary/5 border-primary/20'>
        <div className='absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform'>
          <ShieldCheck className='w-40 h-40 text-primary' />
        </div>
        <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10'>
          <div className='space-y-5'>
            <Badge className='bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl'>
              {t('action_required')}
            </Badge>
            <h2 className='text-xl sm:text-3xl font-black tracking-tighter text-foreground uppercase leading-tight'>
              {t('pending_verifications', {
                count: stats?.pendingVerifications ?? 0,
              })}
            </h2>
            <p className='text-muted-foreground font-black text-xs sm:text-sm tracking-widest opacity-60 max-w-lg'>
              {t('verifications_desc')}
            </p>
          </div>
          <Button
            size='lg'
            asChild
            className='rounded-xl px-4 font-black uppercase text-xs sm:text-base tracking-wide h-16 shadow-none border border-primary active:scale-95 transition-all'
          >
            <Link href='/admin/users?tab=verifications'>
              {t('go_to_verifications')}
              <ArrowRight className='ml-3 w-6 h-6 text-white' />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

function ActivityLogs({
  logs,
  noActivityLabel,
}: {
  logs: any[];
  noActivityLabel: string;
}) {
  const locale = useLocale();
  const isMk = locale === 'mk';

  if (logs.length === 0)
    return (
      <p className='text-center py-4 text-muted-foreground text-sm'>
        {noActivityLabel}
      </p>
    );

  const translateAction = (text: string) => {
    if (!isMk) return text;
    const dict: Record<string, string> = {
      APPROVE_LISTING: 'Одобрен оглас',
      REJECT_LISTING: 'Одбиен оглас',
      DELETE_LISTING: 'Избришан оглас',
      CREATE_USER: 'Креиран корисник',
      UPDATE_USER: 'Ажуриран корисник',
      DELETE_USER: 'Избришан корисник',
    };
    return dict[text] || text;
  };

  return (
    <div className='divide-y divide-border/30'>
      {logs.map((log, i) => (
        <div
          key={log._id}
          className='flex items-center gap-3 p-2.5 hover:bg-muted/30 transition-colors'
        >
          <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border/50'>
            <ActivityIcon action={log.action} />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-[11px] font-bold text-foreground line-clamp-1 tracking-tight uppercase'>
              {translateAction(log.details || log.action)}
            </p>
            <p className='text-[9px] text-muted-foreground font-medium'>
              {new Date(log.createdAt ?? Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityIcon({ action }: { action: string }) {
  if (action.includes('USER'))
    return <Users className='w-4 h-4 text-primary' />;
  if (action.includes('LISTING'))
    return <Tag className='w-4 h-4 text-primary' />;
  if (action.includes('REVENUE'))
    return <CreditCard className='w-4 h-4 text-primary' />;
  return <Clock className='w-4 h-4 text-primary' />;
}
