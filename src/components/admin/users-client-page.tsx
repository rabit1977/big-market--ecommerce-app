'use client';

import {
  AdminFilterToolbar,
  AdminPagination,
  getSinceFromRange,
  TimeRange,
} from '@/components/admin/admin-filter-toolbar';
import { UsersDataTable } from '@/components/admin/users-data-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import { exportToPdf } from '@/lib/export-pdf';
import { useQuery } from 'convex/react';
import {
  Loader2,
  Shield,
  User as UserIcon,
  UserPlus,
  Users,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

const ITEMS_PER_PAGE = 15;

export function UsersClientPage() {
  const usersRaw = useQuery(api.users.list);
  const t = useTranslations('AdminControls');
  const locale = useLocale();
  const isMk = locale === 'mk';

  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [statusFilter, setStatus] = useState<string>('ALL');
  const [roleFilter, setRole] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  const SORT_OPTIONS = isMk
    ? [
        { label: 'Најнови прво', value: 'newest' },
        { label: 'Најстари прво', value: 'oldest' },
        { label: 'Име А-Ш', value: 'name_asc' },
        { label: 'Име Ш-А', value: 'name_desc' },
        { label: 'Админи прво', value: 'role' },
        { label: 'Статус', value: 'status' },
      ]
    : [
        {
          label: t('users_title').includes('Admin')
            ? 'Newest First'
            : 'Newest First',
          value: 'newest',
        },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'Name A–Z', value: 'name_asc' },
        { label: 'Name Z–A', value: 'name_desc' },
        { label: 'Admins First', value: 'role' },
        { label: 'Status', value: 'status' },
      ];

  if (usersRaw === undefined) {
    return (
      <div className='flex items-center justify-center p-20'>
        <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  const since = getSinceFromRange(timeRange);

  const users = (usersRaw || []).map((u) => ({
    ...u,
    id: u._id,
    _id: u._id,
    role: (u.role as 'USER' | 'ADMIN') || 'USER',
    createdAt: new Date(u._creationTime || (u as any).createdAt || Date.now()),
    updatedAt: new Date(u._creationTime || (u as any).createdAt || Date.now()),
    accountStatus: u.accountStatus,
    membershipStatus: u.membershipStatus,
  }));

  // Filter by time range
  const rangeFiltered = since
    ? users.filter((u) => u.createdAt.getTime() >= since)
    : users;

  // Filter by status
  const statusFiltered =
    statusFilter === 'ALL'
      ? rangeFiltered
      : rangeFiltered.filter((u) => u.accountStatus === statusFilter);

  // Filter by role
  const roleFiltered =
    roleFilter === 'ALL'
      ? statusFiltered
      : statusFiltered.filter((u) => u.role === roleFilter);

  // Search
  const searchFiltered =
    search.trim() === ''
      ? roleFiltered
      : roleFiltered.filter(
          (u: any) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.externalId?.toLowerCase().includes(search.toLowerCase()) || // Clerk ID
            (u._id || '').toLowerCase().includes(search.toLowerCase()), // Convex ID
        );

  // Sort
  const sorted = [...searchFiltered].sort((a, b) => {
    switch (sort) {
      case 'oldest':
        return a.createdAt.getTime() - b.createdAt.getTime();
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name_desc':
        return (b.name || '').localeCompare(a.name || '');
      case 'role':
        return a.role === 'ADMIN' ? -1 : 1;
      case 'status':
        return (a.accountStatus || '').localeCompare(b.accountStatus || '');
      default:
        return b.createdAt.getTime() - a.createdAt.getTime(); // newest
    }
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const safeP = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (safeP - 1) * ITEMS_PER_PAGE,
    safeP * ITEMS_PER_PAGE,
  );

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const userCount = users.filter((u) => u.role === 'USER').length;

  // CSV export
  const handleExport = () => {
    exportToPdf({
      title: isMk ? 'Извештај за Корисници' : 'Users Report',
      subtitle: isMk
        ? `Администраторски извоз — Статус: ${statusFilter !== 'ALL' ? statusFilter : 'Сите'} | Улога: ${roleFilter !== 'ALL' ? roleFilter : 'Сите'}`
        : `Admin export — Status: ${statusFilter !== 'ALL' ? statusFilter : 'All'} | Role: ${roleFilter !== 'ALL' ? roleFilter : 'All'}`,
      logo: '👤',
      orientation: 'landscape',
      footerNote: isMk
        ? 'Овој документ е генериран автоматски од администрацијата. Поверливен документ. Содржата е заштитена со основниот на जदपर.'
        : 'This document was automatically generated by the platform admin panel. Confidential. Contains personal data protected under GDPR.',
      columns: [
        { label: 'Name', key: 'name', width: '130px' },
        { label: 'Email', key: 'email', width: '170px' },
        { label: 'Phone', key: 'phone', width: '100px' },
        { label: 'Role', key: 'role', width: '65px' },
        { label: 'Status', key: 'accountStatus', width: '100px' },
        { label: 'Account Type', key: 'accountType', width: '90px' },
        { label: 'Company', key: 'companyName', width: '110px' },
        { label: 'City', key: 'city', width: '80px' },
        { label: 'Verified', key: 'isVerified', width: '65px' },
        { label: 'Membership', key: 'membershipStatus', width: '90px' },
        { label: 'Tier', key: 'membershipTier', width: '70px' },
        { label: 'Credits (MKD)', key: 'credits', width: '80px' },
        { label: 'WhatsApp', key: 'hasWhatsapp', width: '70px' },
        { label: 'Viber', key: 'hasViber', width: '55px' },
        { label: 'Joined', key: 'joinedFormatted', width: '80px' },
      ],
      rows: sorted.map((u: any) => ({
        ...u,
        joinedFormatted: u.createdAt
          ? new Date(
              typeof u.createdAt === 'number' ? u.createdAt : u.createdAt,
            ).toLocaleDateString()
          : '—',
        isVerified: u.isVerified ? 'YES' : 'NO',
        hasWhatsapp: u.hasWhatsapp ? 'YES' : 'NO',
        hasViber: u.hasViber ? 'YES' : 'NO',
        membershipStatus: u.membershipStatus || 'INACTIVE',
        membershipTier: u.membershipTier || 'FREE',
        accountType: u.accountType || 'PERSONAL',
        credits: u.credits || 0,
      })),
    });
  };

  return (
    <div className='space-y-6 pb-20'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <h1 className='text-2xl sm:text-4xl font-black tracking-tighter text-foreground flex items-center gap-3 uppercase'>
            {t('users_title')}
          </h1>
          <p className='text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-widest opacity-60'>
            {t('users_desc')}
          </p>
        </div>
        <Button
          asChild
          size='sm'
          className='rounded-xl font-black uppercase tracking-widest shadow-none h-10 px-5 border border-primary'
        >
          <Link href='/admin/users/create'>
            <UserPlus className='h-4 w-4 mr-2' />
            {isMk ? 'Додај' : 'Add'}
          </Link>
        </Button>
      </div>

      {/* Minimalist Inline Stats */}
      <div className='flex flex-wrap items-center gap-x-6 gap-y-2 bg-card border border-border rounded-xl p-3 px-5'>
        <div className='flex items-center gap-2'>
          <Users className='w-4 h-4 text-primary' />
          <span className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
            {isMk ? 'Корисници:' : 'Users:'}
          </span>
          <span className='text-sm font-black tracking-tight'>
            {users.length}
          </span>
        </div>

        <div className='hidden sm:block w-px h-4 bg-border/40' />

        <div className='flex items-center gap-2'>
          <Shield className='w-4 h-4 text-primary' />
          <span className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
            {isMk ? 'Админи:' : 'Admins:'}
          </span>
          <span className='text-sm font-black tracking-tight text-primary'>
            {adminCount}
          </span>
        </div>

        <div className='hidden sm:block w-px h-4 bg-border/40' />

        <div className='flex items-center gap-2'>
          <UserIcon className='w-4 h-4 text-emerald-500' />
          <span className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
            {isMk ? 'Редовни:' : 'Regular:'}
          </span>
          <span className='text-sm font-black tracking-tight text-emerald-500'>
            {userCount}
          </span>
        </div>
      </div>

      {/* Filter Section */}
      <div className='bg-card rounded-xl p-5 bm-interactive space-y-4 shadow-none'>
        <AdminFilterToolbar
          timeRange={timeRange}
          onTimeRangeChange={(r) => {
            setTimeRange(r);
            setPage(1);
          }}
          searchValue={search}
          onSearchChange={(q) => {
            setSearch(q);
            setPage(1);
          }}
          searchPlaceholder={isMk ? 'Пребарај...' : 'Search...'}
          showSort
          sortValue={sort}
          onSortChange={(s) => {
            setSort(s);
            setPage(1);
          }}
          sortOptions={SORT_OPTIONS}
          showExport
          onExport={handleExport}
        />

        {/* Row 2: status + role */}
        <div className='flex flex-wrap items-center gap-2 pt-4 border-t border-border/30'>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className='h-9 flex-1 sm:flex-none sm:min-w-[140px] text-[10px] font-black uppercase tracking-widest bg-muted/40 border-border rounded-xl shadow-none'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='rounded-xl border-border'>
              <SelectItem value='ALL'>{t('all_statuses')}</SelectItem>
              <SelectItem value='ACTIVE'>{t('status_active')}</SelectItem>
              <SelectItem value='PENDING_APPROVAL'>
                {t('status_pending')}
              </SelectItem>
              <SelectItem value='SUSPENDED'>{t('suspended')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={roleFilter}
            onValueChange={(v) => {
              setRole(v);
              setPage(1);
            }}
          >
            <SelectTrigger className='h-9 flex-1 sm:flex-none sm:min-w-[140px] text-[10px] font-black uppercase tracking-widest bg-muted/40 border-border rounded-xl shadow-none'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='rounded-xl border-border'>
              <SelectItem value='ALL'>{t('all_roles')}</SelectItem>
              <SelectItem value='ADMIN'>{t('admins_only')}</SelectItem>
              <SelectItem value='USER'>{t('users_only')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-card rounded-lg overflow-hidden border border-border mt-6 shadow-none'>
        <div className='p-4 border-b border-border/50 bg-muted/10'>
          <h2 className='text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-foreground/80'>
            <Users className='h-4 w-4 text-primary' />
            {t('users_found', { count: sorted.length })}
          </h2>
        </div>
        <div className='p-3 pt-0'>
          {paginated.length > 0 ? (
            <div className='mt-6'>
              <UsersDataTable users={paginated as any} />
              <AdminPagination
                page={safeP}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          ) : (
            <div className='text-center py-20 text-muted-foreground'>
              <div className='w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6'>
                <Users className='h-10 w-10 text-muted-foreground/50' />
              </div>
              <h3 className='text-xl font-bold text-foreground'>
                {t('no_users_found')}
              </h3>
              <p className='mt-2'>{t('try_adjusting')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
