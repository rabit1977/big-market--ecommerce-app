'use client';

import { AdminFilterToolbar, AdminPagination, getSinceFromRange, TimeRange } from '@/components/admin/admin-filter-toolbar';
import { UsersDataTable } from '@/components/admin/users-data-table';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader2, Shield, User as UserIcon, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ITEMS_PER_PAGE = 15;

const SORT_OPTIONS = [
    { label: 'Newest First',  value: 'newest' },
    { label: 'Oldest First',  value: 'oldest' },
    { label: 'Name A–Z',      value: 'name_asc' },
    { label: 'Name Z–A',      value: 'name_desc' },
    { label: 'Admins First',  value: 'role' },
    { label: 'Status',        value: 'status' },
];

export function UsersClientPage() {
  const usersRaw = useQuery(api.users.list);

  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [search, setSearch]       = useState('');
  const [sort, setSort]           = useState('newest');
  const [statusFilter, setStatus] = useState<string>('ALL');
  const [roleFilter, setRole]     = useState<string>('ALL');
  const [page, setPage]           = useState(1);

  if (usersRaw === undefined) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const since = getSinceFromRange(timeRange);

  const users = (usersRaw || []).map(u => ({
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
  const rangeFiltered = since ? users.filter(u => u.createdAt.getTime() >= since) : users;

  // Filter by status
  const statusFiltered = statusFilter === 'ALL' ? rangeFiltered :
    rangeFiltered.filter(u => u.accountStatus === statusFilter);

  // Filter by role
  const roleFiltered = roleFilter === 'ALL' ? statusFiltered :
    statusFiltered.filter(u => u.role === roleFilter);

  // Search
  const searchFiltered = search.trim() === '' ? roleFiltered :
    roleFiltered.filter((u: any) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.externalId?.toLowerCase().includes(search.toLowerCase()) || // Clerk ID
      (u._id || '').toLowerCase().includes(search.toLowerCase())    // Convex ID
    );

  // Sort
  const sorted = [...searchFiltered].sort((a, b) => {
    switch (sort) {
      case 'oldest':    return a.createdAt.getTime() - b.createdAt.getTime();
      case 'name_asc':  return (a.name || '').localeCompare(b.name || '');
      case 'name_desc': return (b.name || '').localeCompare(a.name || '');
      case 'role':      return (a.role === 'ADMIN' ? -1 : 1);
      case 'status':    return (a.accountStatus || '').localeCompare(b.accountStatus || '');
      default:          return b.createdAt.getTime() - a.createdAt.getTime(); // newest
    }
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const safeP = Math.min(page, totalPages);
  const paginated = sorted.slice((safeP - 1) * ITEMS_PER_PAGE, safeP * ITEMS_PER_PAGE);

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const userCount  = users.filter(u => u.role === 'USER').length;

  // CSV export
  const handleExport = () => {
    const header = 'Name,Email,Role,Status,Joined\n';
    const rows = sorted.map(u =>
      `"${u.name || ''}","${u.email || ''}","${u.role}","${u.accountStatus || ''}","${u.createdAt.toLocaleDateString()}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `users-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='space-y-6 pb-20'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-1'>
          <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-3'>
            Admin &amp; Users
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">
               {users.length}
            </span>
          </h1>
          <p className='text-xs md:text-sm text-muted-foreground font-medium'>
            Manage your store users and their roles in real-time
          </p>
        </div>
        <Button asChild className="rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all btn-premium">
          <Link href='/admin/users/create'>
            <UserPlus className='h-5 w-5 mr-2' />
            Add New User
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-3 sm:gap-5 grid-cols-2 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
        {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { label: 'Administrators', value: adminCount, icon: Shield, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
            { label: 'Regular Customers', value: userCount, icon: UserIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map(stat => (
             <div key={stat.label} className={`glass-card p-3 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group gap-2 flex-row-reverse ${stat.border}`}>
                <div className='flex justify-between items-start mb-2'>
                    <div className={`p-2 sm:p-3 rounded-full sm:rounded-full ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                       <stat.icon className='h-4 w-4 sm:h-5 sm:w-5 ' />
                    </div>
                </div>
                <div className='flex flex-col items-start min-w-24'>
                   <h3 className='text-base sm:text-xl md:text-2xl font-black tracking-tight text-foreground'>{stat.value}</h3>
                   <p className='text-[8px] sm:text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-0.5 sm:mt-1'>{stat.label}</p>
                </div>
             </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className='glass-card rounded-2xl p-4 border border-border/60 space-y-3'>
        {/* Row 1: search + time + sort + export */}
        <AdminFilterToolbar
            timeRange={timeRange}
            onTimeRangeChange={(r) => { setTimeRange(r); setPage(1); }}
            searchValue={search}
            onSearchChange={(q) => { setSearch(q); setPage(1); }}
            searchPlaceholder="Search name, email, or user ID..."
            showSort
            sortValue={sort}
            onSortChange={(s) => { setSort(s); setPage(1); }}
            sortOptions={SORT_OPTIONS}
            showExport
            onExport={handleExport}
        />

        {/* Row 2: status + role + result count — always in its own wrapping row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/30">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">Filter by:</span>
          <select
              value={statusFilter}
              onChange={e => { setStatus(e.target.value); setPage(1); }}
              className="h-8 px-2 text-xs bg-muted/40 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium cursor-pointer"
          >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">Pending</option>
              <option value="SUSPENDED">Suspended</option>
          </select>
          <select
              value={roleFilter}
              onChange={e => { setRole(e.target.value); setPage(1); }}
              className="h-8 px-2 text-xs bg-muted/40 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium cursor-pointer"
          >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admins only</option>
              <option value="USER">Users only</option>
          </select>

          <span className="text-xs text-muted-foreground ml-auto shrink-0">
            <span className="font-bold text-foreground">{sorted.length}</span> of <span className="font-bold text-foreground">{users.length}</span> users
            {timeRange !== 'all' && <span className="text-primary ml-1">· {timeRange}</span>}
          </span>
        </div>
      </div>


      {/* Users Table */}
      <div className='glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
         <div className="p-6 border-b border-border/50 bg-secondary/5 backdrop-blur-sm flex items-center justify-between">
            <h2 className='text-xl font-bold flex items-center gap-3'>
              <Users className="h-5 w-5 text-primary" />
              {sorted.length > 0 ? `${sorted.length} User${sorted.length > 1 ? 's' : ''} Found` : 'No Users Found'}
            </h2>
         </div>
         <div className='p-3 pt-0'>
          {paginated.length > 0 ? (
            <div className="mt-6">
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
              <h3 className="text-xl font-bold text-foreground">No users found</h3>
              <p className="mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

