'use client';

import {
  approveListingAction,
  deleteListingAction,
  rejectListingAction,
} from '@/actions/listing-actions';
import {
  AdminFilterToolbar,
  AdminPagination,
  getSinceFromRange,
  TimeRange,
} from '@/components/admin/admin-filter-toolbar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';
import { useQuery } from 'convex/react';
import {
  Ban,
  Check,
  Edit,
  Eye,
  Loader2,
  Package,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS_EN = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Price High→Low', value: 'price_desc' },
  { label: 'Price Low→High', value: 'price_asc' },
  { label: 'Title A–Z', value: 'title_asc' },
];

const SORT_OPTIONS_MK = [
  { label: 'Најнови прво', value: 'newest' },
  { label: 'Најстари прво', value: 'oldest' },
  { label: 'Цена (опаѓачка)', value: 'price_desc' },
  { label: 'Цена (растечка)', value: 'price_asc' },
  { label: 'Наслов (А-Ш)', value: 'title_asc' },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  PENDING_APPROVAL: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  REJECTED: 'bg-red-500/10 text-red-600 border-red-500/20',
  INACTIVE: 'bg-muted text-muted-foreground border-border',
};

export function AdminListingsHub() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [statusFilter, setStatus] = useState('ALL');
  const [promotedOnly, setPromoted] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const locale = useLocale();
  const isMk = locale === 'mk';

  // Fetch all listings (admin view)
  const listingsRaw = useQuery(api.admin.getListingsDetailed, {
    status: statusFilter,
  } as any);

  const since = getSinceFromRange(timeRange);

  const listings = useMemo(() => {
    if (!listingsRaw) return [];
    return listingsRaw.map((l: any) => ({ ...l, id: l._id as string }));
  }, [listingsRaw]);

  // Apply filters
  const filtered = useMemo(() => {
    let result = listings;

    if (since)
      result = result.filter(
        (l: any) => (l.createdAt || l._creationTime || 0) >= since,
      );
    if (promotedOnly)
      result = result.filter((l: any) => l.isPromoted || l.promotionTier);
    if (search.trim()) {
      const q = search.toLowerCase().replace(/^#/, ''); // strip leading # for listing number
      result = result.filter(
        (l: any) =>
          l.title?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q) ||
          l.city?.toLowerCase().includes(q) ||
          l.sellerName?.toLowerCase().includes(q) ||
          String(l.listingNumber || '').includes(q) || // e.g. #1234
          (l._id || '').toLowerCase().includes(q), // Convex internal ID
      );
    }

    // Sort
    result = [...result].sort((a: any, b: any) => {
      switch (sort) {
        case 'oldest':
          return (a.createdAt || 0) - (b.createdAt || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        case 'price_asc':
          return (a.price || 0) - (b.price || 0);
        case 'title_asc':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return (b.createdAt || 0) - (a.createdAt || 0);
      }
    });

    return result;
  }, [listings, since, promotedOnly, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeP = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safeP - 1) * ITEMS_PER_PAGE,
    safeP * ITEMS_PER_PAGE,
  );

  // Stats
  const total = listings.length;
  const active = listings.filter((l: any) => l.status === 'ACTIVE').length;
  const pending = listings.filter(
    (l: any) => l.status === 'PENDING_APPROVAL',
  ).length;
  const promo = listings.filter(
    (l: any) => l.isPromoted || l.promotionTier,
  ).length;

  // Bulk selection helpers
  const allSelected =
    paginated.length > 0 &&
    paginated.every((l: any) => selected.includes(l.id));
  const toggleAll = () =>
    setSelected(allSelected ? [] : paginated.map((l: any) => l.id));
  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleApprove = (id: string) =>
    startTransition(async () => {
      const r = await approveListingAction(id);
      r.success
        ? toast.success(isMk ? 'Огласот е одобрен' : 'Listing approved')
        : toast.error(r.error);
      router.refresh();
    });

  const handleReject = (id: string) =>
    startTransition(async () => {
      const r = await rejectListingAction(id);
      r.success
        ? toast.success(isMk ? 'Огласот е одбиен' : 'Listing rejected')
        : toast.error(r.error);
      router.refresh();
    });

  const handleDelete = (id: string) =>
    startTransition(async () => {
      const r = await deleteListingAction(id);
      r.success
        ? toast.success(
            isMk
              ? 'Огласот е преместен во корпа'
              : 'Listing moved to recycle bin',
          )
        : toast.error(r.error || 'Failed');
      setSelected((prev) => prev.filter((x) => x !== id));
      router.refresh();
    });

  const handleBulkDelete = () => {
    if (
      !confirm(
        isMk
          ? `Дали сте сигурни дека сакате да избришете ${selected.length} огласи? Можете да ги вратите подоцна.`
          : `Move ${selected.length} listings to the recycle bin? You can restore them later.`,
      )
    )
      return;
    startTransition(async () => {
      for (const id of selected) await deleteListingAction(id);
      toast.success(
        isMk
          ? `${selected.length} огласи беа преместени во корпата`
          : `${selected.length} listings moved to recycle bin`,
      );
      setSelected([]);
      router.refresh();
    });
  };

  const handleExport = () => {
    exportToPdf({
      title: isMk ? 'Извештај за Огласи' : 'Listings Report',
      subtitle: isMk
        ? `Извоз на администратор — Филтри: ${statusFilter !== 'ALL' ? statusFilter : 'Сите'}`
        : `Admin export — Filter: ${statusFilter !== 'ALL' ? statusFilter : 'All'}`,
      logo: '📋',
      orientation: 'landscape',
      footerNote: isMk
        ? 'Овој документ е генериран автоматски од администрацијата на платформата. Службен документ.'
        : 'This document was automatically generated by the platform admin panel. Official use only.',
      columns: [
        { label: 'Listing #', key: 'listingNumber', width: '70px' },
        { label: 'Title', key: 'title', width: '160px' },
        { label: 'Category', key: 'category', width: '100px' },
        { label: 'Subcategory', key: 'subCategory', width: '100px' },
        { label: 'City', key: 'city', width: '80px' },
        { label: 'Price (MKD)', key: 'price', width: '80px' },
        { label: 'Status', key: 'status', width: '90px' },
        { label: 'Promoted', key: 'promoted', width: '70px' },
        { label: 'Views', key: 'viewCount', width: '50px' },
        { label: 'Seller', key: 'creatorName', width: '120px' },
        { label: 'Phone', key: 'creatorPhone', width: '100px' },
        { label: 'Created', key: 'createdFormatted', width: '90px' },
      ],
      rows: filtered.map((l: any) => ({
        ...l,
        promoted: l.isPromoted || l.promotionTier ? 'YES' : 'NO',
        createdFormatted: new Date(
          l.createdAt || l._creationTime || 0,
        ).toLocaleDateString(),
        creatorName: l.creatorName || l.sellerName || '',
        creatorPhone: l.creatorPhone || '',
      })),
    });
  };

  if (listingsRaw === undefined) {
    return (
      <div className='flex items-center justify-center p-20'>
        <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='space-y-6 pb-20'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <h1 className='text-2xl sm:text-4xl font-black tracking-tighter flex items-center gap-3 uppercase'>
            {promotedOnly
              ? isMk
                ? 'Промовирани'
                : 'Promoted'
              : isMk
                ? 'Огласи'
                : 'Listings'}
          </h1>
          <p className='text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-widest opacity-60'>
            {promotedOnly
              ? isMk
                ? 'Надгледувајте промовирани огласи.'
                : 'Monitor promoted listings.'
              : isMk
                ? 'Управувајте со сите огласи.'
                : 'Manage all platform listings.'}
          </p>
        </div>
        <Button
          asChild
          size='sm'
          className='rounded-xl font-black uppercase tracking-widest shadow-none h-10 px-5 border border-primary'
        >
          <Link href='/admin/listings/new'>
            <Plus className='h-4 w-4 mr-2' />
            {isMk ? 'Додај' : 'Add'}
          </Link>
        </Button>
      </div>

      <div className='flex flex-wrap gap-2'>
        {[
          {
            label: isMk ? 'Вкупно' : 'Total',
            value: total,
            color: 'text-foreground',
          },
          {
            label: isMk ? 'Активни' : 'Active',
            value: active,
            color: 'text-emerald-500',
          },
          {
            label: isMk ? 'На Чекање' : 'Pending',
            value: pending,
            color: 'text-amber-500',
          },
          {
            label: isMk ? 'Промовирани' : 'Promo',
            value: promo,
            color: 'text-blue-500',
          },
        ].map((s) => (
          <div
            key={s.label}
            className='bg-card border border-border rounded-xl px-4 py-2.5 flex flex-col min-w-[100px] flex-1'
          >
            <p className='text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-muted-foreground opacity-70 mb-0.5'>
              {s.label}
            </p>
            <p
              className={cn(
                'text-base sm:text-lg font-black tracking-tighter',
                s.color,
              )}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className='bg-card rounded-xl p-5 bm-interactive space-y-4 shadow-none'>
        {/* Row 1 */}
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
          searchPlaceholder={
            isMk
              ? 'Пребарајте наслов, категорија, ИД...'
              : 'Search title, category, #ID, seller...'
          }
          showSort
          sortValue={sort}
          onSortChange={(s) => {
            setSort(s);
            setPage(1);
          }}
          sortOptions={isMk ? SORT_OPTIONS_MK : SORT_OPTIONS_EN}
          showExport
          onExport={handleExport}
        />

        {/* Row 2: Secondary Filters */}
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
              <SelectItem value='ALL'>
                {isMk ? 'Сите Статуси' : 'All Statuses'}
              </SelectItem>
              <SelectItem value='ACTIVE'>
                {isMk ? 'Активни' : 'Active'}
              </SelectItem>
              <SelectItem value='PENDING_APPROVAL'>
                {isMk ? 'За Одобрување' : 'Pending'}
              </SelectItem>
              <SelectItem value='REJECTED'>
                {isMk ? 'Одбиени' : 'Rejected'}
              </SelectItem>
              <SelectItem value='INACTIVE'>
                {isMk ? 'Неактивни' : 'Inactive'}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={promotedOnly ? 'promoted' : 'all'}
            onValueChange={(v) => {
              setPromoted(v === 'promoted');
              setPage(1);
            }}
          >
            <SelectTrigger className='h-9 flex-1 sm:flex-none sm:min-w-[140px] text-[10px] font-black uppercase tracking-widest bg-muted/40 border-border rounded-xl shadow-none'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='rounded-xl border-border'>
              <SelectItem value='all'>
                {isMk ? 'Сите огласи' : 'All Listings'}
              </SelectItem>
              <SelectItem value='promoted'>
                ⭐ {isMk ? 'Само Промовирани' : 'Promoted Only'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selected.length > 0 && (
          <div className='flex items-center gap-4 p-3 bg-secondary border-1 border-card-foreground/10 rounded-xl animate-in fade-in zoom-in-95 duration-300'>
            <span className='text-[10px] font-black uppercase tracking-widest text-foreground'>
              {selected.length} {isMk ? 'Избрани' : 'Selected'}
            </span>
            <Button
              variant='destructive'
              size='sm'
              onClick={handleBulkDelete}
              disabled={isPending}
              className='h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-none'
            >
              <Trash2 className='w-3.5 h-3.5 mr-1.5' />
              {isMk ? 'Избриши' : 'Delete'}
            </Button>
            <button
              onClick={() => setSelected([])}
              className='text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground ml-auto transition-colors'
            >
              {isMk ? 'Исчисти' : 'Clear'}
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className='bg-card rounded-lg overflow-hidden border border-border shadow-none'>
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500'>
            <div className='w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 border border-border/50'>
              <Package className='w-8 h-8 text-muted-foreground/30' />
            </div>
            <h3 className='font-black uppercase tracking-tight text-foreground text-lg'>
              {isMk ? 'Нема пронајдени огласи' : 'No listings found'}
            </h3>
            <p className='text-xs text-muted-foreground mt-2 max-w-[250px] font-medium leading-relaxed'>
              {isMk
                ? `Пребарувањето не пронајде огласи за избраниот период. Вкупно постојат ${total} огласи на платформата.`
                : `No listings found for the selected filters. There are ${total} total listings on the platform.`}
            </p>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setTimeRange('all');
                setSearch('');
                setStatus('ALL');
                setPromoted(false);
              }}
              className='mt-6 rounded-xl font-black uppercase tracking-widest text-[10px] h-9 border-primary/20 text-primary hover:bg-primary/5'
            >
              <RotateCcw className='w-3.5 h-3.5 mr-2' />
              {isMk ? 'Исчисти филтри' : 'Reset all filters'}
            </Button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold'>
                <tr>
                  <th className='px-4 py-3 w-8'>
                    <input
                      type='checkbox'
                      checked={allSelected}
                      onChange={toggleAll}
                      className='rounded border-border cursor-pointer'
                    />
                  </th>
                  <th className='px-4 py-3 text-left'>
                    {isMk ? 'Оглас' : 'Listing'}
                  </th>
                  <th className='px-4 py-3 text-left'>
                    {isMk ? 'Статус' : 'Status'}
                  </th>
                  <th className='px-4 py-3 text-left'>
                    {isMk ? 'Цена' : 'Price'}
                  </th>
                  <th className='px-4 py-3 text-left hidden md:table-cell'>
                    {isMk ? 'Продавач' : 'Seller'}
                  </th>
                  <th className='px-4 py-3 text-left hidden lg:table-cell'>
                    {isMk ? 'Датум' : 'Date'}
                  </th>
                  <th className='px-4 py-3 text-right'>
                    {isMk ? 'Акции' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/40'>
                {paginated.map((listing: any) => (
                  <tr
                    key={listing.id}
                    className={cn(
                      'hover:bg-muted/30 transition-colors opacity-90 hover:opacity-100',
                      selected.includes(listing.id) && 'bg-secondary',
                    )}
                  >
                    <td className='px-4 py-3'>
                      <input
                        type='checkbox'
                        checked={selected.includes(listing.id)}
                        onChange={() => toggleOne(listing.id)}
                        className='rounded border-border cursor-pointer'
                      />
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='relative h-10 w-10 rounded-lg overflow-hidden border border-border bg-muted shrink-0 shadow-none'>
                          {listing.thumbnail ? (
                            <Image
                              src={listing.thumbnail}
                              alt={listing.title || ''}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <Package className='h-4 w-4 text-muted-foreground/40' />
                            </div>
                          )}
                          {(listing.isPromoted || listing.promotionTier) && (
                            <div className='absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-md flex items-center justify-center'>
                              <Sparkles className='w-2 h-2 text-white' />
                            </div>
                          )}
                        </div>
                        <div className='min-w-0'>
                          <Link
                            href={`/listings/${listing.id}`}
                            className='font-semibold text-xs text-foreground hover:text-primary transition-colors line-clamp-1'
                          >
                            {listing.title}
                          </Link>
                          <p className='text-[10px] text-muted-foreground mt-0.5'>
                            {listing.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border',
                          STATUS_COLORS[listing.status] ||
                            STATUS_COLORS.INACTIVE,
                        )}
                      >
                        {listing.status === 'PENDING_APPROVAL'
                          ? isMk
                            ? 'На Чекање'
                            : 'Pending'
                          : listing.status === 'ACTIVE'
                            ? isMk
                              ? 'Активен'
                              : 'Active'
                            : listing.status === 'REJECTED'
                              ? isMk
                                ? 'Одбиен'
                                : 'Rejected'
                              : listing.status === 'INACTIVE'
                                ? isMk
                                  ? 'Неактивен'
                                  : 'Inactive'
                                : listing.status || 'Unknown'}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <span className='font-bold text-xs text-foreground'>
                        {formatCurrency(
                          listing.price ?? 0,
                          listing.currency || 'MKD',
                        )}
                      </span>
                    </td>
                    <td className='px-4 py-3 hidden md:table-cell'>
                      <span className='text-xs text-muted-foreground'>
                        {listing.sellerName || '—'}
                      </span>
                    </td>
                    <td className='px-4 py-3 hidden lg:table-cell'>
                      <span className='text-xs text-muted-foreground'>
                        {new Date(
                          listing.createdAt || listing._creationTime || 0,
                        ).toLocaleDateString()}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-1'>
                        {(listing.status === 'PENDING_APPROVAL' ||
                          listing.status === 'REJECTED') && (
                          <>
                            <button
                              onClick={() => handleApprove(listing.id)}
                              disabled={isPending}
                              className='h-7 w-7 rounded-md flex items-center justify-center bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all active:scale-95'
                              title={
                                isMk
                                  ? listing.status === 'REJECTED'
                                    ? 'Врати/Одобри'
                                    : 'Одобри'
                                  : listing.status === 'REJECTED'
                                    ? 'Restore/Approve'
                                    : 'Approve'
                              }
                            >
                              <Check className='h-3.5 w-3.5' />
                            </button>
                            {listing.status === 'PENDING_APPROVAL' && (
                              <button
                                onClick={() => handleReject(listing.id)}
                                disabled={isPending}
                                className='h-7 w-7 rounded-md flex items-center justify-center bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all active:scale-95'
                                title={isMk ? 'Одбиј' : 'Reject'}
                              >
                                <X className='h-3.5 w-3.5' />
                              </button>
                            )}
                          </>
                        )}
                        {listing.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleReject(listing.id)}
                            disabled={isPending}
                            className='h-7 w-7 rounded-md flex items-center justify-center bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-all active:scale-95'
                            title={isMk ? 'Суспендирај' : 'Suspend'}
                          >
                            <Ban className='h-3.5 w-3.5' />
                          </button>
                        )}
                        <Link
                          href={`/admin/listings/${listing.id}/edit`}
                          className='h-7 w-7 rounded-md flex items-center justify-center bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
                          title={isMk ? 'Уреди' : 'Edit'}
                        >
                          <Edit className='h-3.5 w-3.5' />
                        </Link>
                        <Link
                          href={`/listings/${listing.id}`}
                          className='h-7 w-7 rounded-md flex items-center justify-center bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
                          title={isMk ? 'Прегледај' : 'View'}
                        >
                          <Eye className='h-3.5 w-3.5' />
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              disabled={isPending}
                              className='h-7 w-7 rounded-md flex items-center justify-center bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all active:scale-95'
                              title={isMk ? 'Избриши' : 'Delete'}
                            >
                              <Trash2 className='h-3.5 w-3.5' />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className='rounded-2xl border border-border shadow-none'>
                            <AlertDialogHeader>
                              <AlertDialogTitle className='flex items-center gap-2 font-bold uppercase tracking-tight text-destructive'>
                                <Trash2 className='w-5 h-5' />
                                {isMk
                                  ? 'Премести во корпа?'
                                  : 'Move to Recycle Bin?'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                <span className='block mb-2 font-medium text-foreground'>
                                  "{listing.title}"
                                </span>
                                {isMk
                                  ? 'Овој оглас ќе биде преместен во корпа. Можете да го вратите подоцна.'
                                  : 'This listing will be moved to the recycle bin. You can restore it later if needed.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className='rounded-lg font-medium uppercase text-xs h-10 border border-border'>
                                {isMk ? 'Откажи' : 'Cancel'}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(listing.id)}
                                className='bg-destructive hover:bg-destructive/90 text-white rounded-lg font-medium tracking-wider uppercase text-xs h-10 shadow-none'
                              >
                                {isMk ? 'Избриши' : 'Move to Bin'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AdminPagination
          page={safeP}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
