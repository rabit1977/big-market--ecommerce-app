'use client';

import { approveListingAction, deleteListingAction, rejectListingAction } from '@/actions/listing-actions';
import { AdminFilterToolbar, AdminPagination, getSinceFromRange, TimeRange } from '@/components/admin/admin-filter-toolbar';
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
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import {
    Ban,
    Check,
    Edit,
    Eye,
    Loader2,
    Package,
    Sparkles,
    Trash2,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
    { label: 'Newest First',    value: 'newest' },
    { label: 'Oldest First',    value: 'oldest' },
    { label: 'Price High→Low',  value: 'price_desc' },
    { label: 'Price Low→High',  value: 'price_asc' },
    { label: 'Title A–Z',       value: 'title_asc' },
];

const STATUS_COLORS: Record<string, string> = {
    ACTIVE:           'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    PENDING_APPROVAL: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    REJECTED:         'bg-red-500/10 text-red-600 border-red-500/20',
    INACTIVE:         'bg-muted text-muted-foreground border-border',
};

export function AdminListingsHub() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [timeRange, setTimeRange]     = useState<TimeRange>('all');
    const [search, setSearch]           = useState('');
    const [sort, setSort]               = useState('newest');
    const [statusFilter, setStatus]     = useState('ALL');
    const [promotedOnly, setPromoted]   = useState(false);
    const [page, setPage]               = useState(1);
    const [selected, setSelected]       = useState<string[]>([]);

    // Fetch all listings (admin view)
    const listingsRaw = useQuery(api.admin.getListingsDetailed, { status: statusFilter } as any);

    const since = getSinceFromRange(timeRange);

    const listings = useMemo(() => {
        if (!listingsRaw) return [];
        return listingsRaw.map((l: any) => ({ ...l, id: l._id as string }));
    }, [listingsRaw]);

    // Apply filters
    const filtered = useMemo(() => {
        let result = listings;

        if (since) result = result.filter((l: any) => (l.createdAt || l._creationTime || 0) >= since);
        if (promotedOnly) result = result.filter((l: any) => l.isPromoted || l.promotionTier);
        if (search.trim()) {
            const q = search.toLowerCase().replace(/^#/, ''); // strip leading # for listing number
            result = result.filter((l: any) =>
                l.title?.toLowerCase().includes(q) ||
                l.category?.toLowerCase().includes(q) ||
                l.city?.toLowerCase().includes(q) ||
                l.sellerName?.toLowerCase().includes(q) ||
                String(l.listingNumber || '').includes(q) || // e.g. #1234
                (l._id || '').toLowerCase().includes(q)     // Convex internal ID
            );
        }

        // Sort
        result = [...result].sort((a: any, b: any) => {
            switch (sort) {
                case 'oldest':     return (a.createdAt || 0) - (b.createdAt || 0);
                case 'price_desc': return (b.price || 0) - (a.price || 0);
                case 'price_asc':  return (a.price || 0) - (b.price || 0);
                case 'title_asc':  return (a.title || '').localeCompare(b.title || '');
                default:           return (b.createdAt || 0) - (a.createdAt || 0);
            }
        });

        return result;
    }, [listings, since, promotedOnly, search, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safeP = Math.min(page, totalPages);
    const paginated = filtered.slice((safeP - 1) * ITEMS_PER_PAGE, safeP * ITEMS_PER_PAGE);

    // Stats
    const total   = listings.length;
    const active  = listings.filter((l: any) => l.status === 'ACTIVE').length;
    const pending = listings.filter((l: any) => l.status === 'PENDING_APPROVAL').length;
    const promo   = listings.filter((l: any) => l.isPromoted || l.promotionTier).length;

    // Bulk selection helpers
    const allSelected = paginated.length > 0 && paginated.every((l: any) => selected.includes(l.id));
    const toggleAll = () => setSelected(allSelected ? [] : paginated.map((l: any) => l.id));
    const toggleOne = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleApprove = (id: string) => startTransition(async () => {
        const r = await approveListingAction(id);
        r.success ? toast.success('Listing approved') : toast.error(r.error);
        router.refresh();
    });

    const handleReject = (id: string) => startTransition(async () => {
        const r = await rejectListingAction(id);
        r.success ? toast.success('Listing rejected') : toast.error(r.error);
        router.refresh();
    });

    const handleDelete = (id: string) => startTransition(async () => {
        const r = await deleteListingAction(id);
        r.success ? toast.success('Listing moved to recycle bin') : toast.error(r.error || 'Failed');
        setSelected(prev => prev.filter(x => x !== id));
        router.refresh();
    });

    const handleBulkDelete = () => {
        if (!confirm(`Move ${selected.length} listings to the recycle bin? You can restore them later.`)) return;
        startTransition(async () => {
            for (const id of selected) await deleteListingAction(id);
            toast.success(`${selected.length} listings moved to recycle bin`);
            setSelected([]);
            router.refresh();
        });
    };

    const handleExport = () => {
        const header = 'Title,Category,City,Price,Status,Promoted,Seller,Date\n';
        const rows = filtered.map((l: any) =>
            `"${l.title || ''}","${l.category || ''}","${l.city || ''}",${l.price || 0},"${l.status || ''}",${!!(l.isPromoted || l.promotionTier)},"${l.sellerName || ''}","${new Date(l.createdAt || l._creationTime || 0).toLocaleDateString()}"`
        ).join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([header + rows], { type: 'text/csv' }));
        a.download = `listings-${Date.now()}.csv`;
        a.click();
    };

    if (listingsRaw === undefined) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                        {promotedOnly ? 'Promoted Listings' : 'All Listings'}
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">
                            {filtered.length}
                        </span>
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        {promotedOnly ? 'Monitor featured and boosted listings.' : 'Review, approve, reject and manage all listings.'}
                    </p>
                </div>
                <Button asChild className="rounded-full font-bold shadow-lg shadow-primary/20 shrink-0">
                    <Link href="/admin/listings/create">
                        <Package className="h-4 w-4 mr-2" />
                        Add Listing
                    </Link>
                </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {[
                    { label: 'Total',    value: total,   color: 'border-blue-500/20 bg-blue-500/5',   text: 'text-blue-600' },
                    { label: 'Active',   value: active,  color: 'border-emerald-500/20 bg-emerald-500/5', text: 'text-emerald-600' },
                    { label: 'Pending',  value: pending, color: 'border-amber-500/20 bg-amber-500/5',  text: 'text-amber-600' },
                    { label: 'Promoted', value: promo,   color: 'border-purple-500/20 bg-purple-500/5', text: 'text-purple-600' },
                ].map(s => (
                    <div key={s.label} className={`glass-card rounded-2xl p-4 border ${s.color} flex items-center justify-between`}>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                            <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass-card rounded-2xl p-4 border border-border/60 space-y-3">
                {/* Row 1 */}
                <AdminFilterToolbar
                    timeRange={timeRange}
                    onTimeRangeChange={(r) => { setTimeRange(r); setPage(1); }}
                    searchValue={search}
                    onSearchChange={(q) => { setSearch(q); setPage(1); }}
                    searchPlaceholder="Search title, category, #ID, seller..."
                    showSort
                    sortValue={sort}
                    onSortChange={(s) => { setSort(s); setPage(1); }}
                    sortOptions={SORT_OPTIONS}
                    showExport
                    onExport={handleExport}
                />

                {/* Row 2 */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/30">
                    {/* Status dropdown */}
                    <div className="relative flex items-center shrink-0">
                        <select
                            value={statusFilter}
                            onChange={e => { setStatus(e.target.value); setPage(1); }}
                            className="h-8 pl-3 pr-7 text-xs bg-muted/40 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 font-bold appearance-none cursor-pointer text-foreground"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PENDING_APPROVAL">Pending</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Promoted dropdown */}
                    <div className="relative flex items-center shrink-0">
                        <select
                            value={promotedOnly ? 'promoted' : 'all'}
                            onChange={e => { setPromoted(e.target.value === 'promoted'); setPage(1); }}
                            className="h-8 pl-3 pr-7 text-xs bg-muted/40 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 font-bold appearance-none cursor-pointer text-foreground"
                        >
                            <option value="all">All Listings</option>
                            <option value="promoted">⭐ Promoted Only</option>
                        </select>
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    <span className="ml-auto text-xs text-muted-foreground shrink-0">
                        <span className="font-bold text-foreground">{filtered.length}</span> of <span className="font-bold text-foreground">{total}</span> listings
                    </span>
                </div>

                {/* Bulk action bar */}
                {selected.length > 0 && (
                    <div className="flex items-center gap-3 p-2.5 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in duration-200">
                        <span className="text-xs font-bold text-primary">{selected.length} selected</span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleBulkDelete}
                            disabled={isPending}
                            className="h-7 px-3 text-xs"
                        >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete Selected
                        </Button>
                        <button onClick={() => setSelected([])} className="text-xs text-muted-foreground hover:text-foreground ml-auto">
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="glass-card rounded-[2rem] overflow-hidden border border-border/60 shadow-xl shadow-black/5">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                        <p className="font-bold text-foreground">No listings found</p>
                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-4 py-3 w-8">
                                        <input type="checkbox" checked={allSelected} onChange={toggleAll}
                                            className="rounded border-border cursor-pointer" />
                                    </th>
                                    <th className="px-4 py-3 text-left">Listing</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Price</th>
                                    <th className="px-4 py-3 text-left hidden md:table-cell">Seller</th>
                                    <th className="px-4 py-3 text-left hidden lg:table-cell">Date</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {paginated.map((listing: any) => (
                                    <tr key={listing.id} className={cn(
                                        "hover:bg-muted/30 transition-colors",
                                        selected.includes(listing.id) && "bg-primary/5"
                                    )}>
                                        <td className="px-4 py-3">
                                            <input type="checkbox"
                                                checked={selected.includes(listing.id)}
                                                onChange={() => toggleOne(listing.id)}
                                                className="rounded border-border cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                                                    {listing.thumbnail ? (
                                                        <Image src={listing.thumbnail} alt={listing.title || ''} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="h-4 w-4 text-muted-foreground/40" />
                                                        </div>
                                                    )}
                                                    {(listing.isPromoted || listing.promotionTier) && (
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                                            <Sparkles className="w-2 h-2 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <Link href={`/listings/${listing.id}`} target="_blank"
                                                        className="font-semibold text-xs text-foreground hover:text-primary transition-colors line-clamp-1">
                                                        {listing.title}
                                                    </Link>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">{listing.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border',
                                                STATUS_COLORS[listing.status] || STATUS_COLORS.INACTIVE
                                            )}>
                                                {listing.status === 'PENDING_APPROVAL' ? 'Pending' :
                                                 listing.status === 'ACTIVE' ? 'Active' :
                                                 listing.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-bold text-xs text-foreground">
                                                {listing.price?.toLocaleString('mk-MK')} MKD
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="text-xs text-muted-foreground">{listing.sellerName || '—'}</span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(listing.createdAt || listing._creationTime || 0).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                {listing.status === 'PENDING_APPROVAL' && (
                                                    <>
                                                        <button onClick={() => handleApprove(listing.id)} disabled={isPending}
                                                            className="h-7 w-7 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                                                            title="Approve">
                                                            <Check className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button onClick={() => handleReject(listing.id)} disabled={isPending}
                                                            className="h-7 w-7 rounded-lg flex items-center justify-center bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                                            title="Reject">
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </>
                                                )}
                                                {listing.status === 'ACTIVE' && (
                                                    <button onClick={() => handleReject(listing.id)} disabled={isPending}
                                                        className="h-7 w-7 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                                                        title="Suspend">
                                                        <Ban className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                                <Link href={`/admin/listings/${listing.id}/edit`}
                                                    className="h-7 w-7 rounded-lg flex items-center justify-center bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                    title="Edit">
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Link>
                                                <Link href={`/listings/${listing.id}`} target="_blank"
                                                    className="h-7 w-7 rounded-lg flex items-center justify-center bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                    title="View">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button disabled={isPending}
                                                            className="h-7 w-7 rounded-lg flex items-center justify-center bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                                            title="Delete">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-2xl">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="flex items-center gap-2 font-black uppercase tracking-tight text-destructive">
                                                                <Trash2 className="w-5 h-5" />
                                                                Move to Recycle Bin?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                <span className="block mb-2 font-medium text-foreground">"{listing.title}"</span>
                                                                This listing will be moved to the recycle bin. You can restore it later if needed.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-xl font-bold uppercase text-xs h-10">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleDelete(listing.id)} 
                                                                className="bg-destructive hover:bg-destructive/90 text-white rounded-xl font-bold tracking-wider uppercase text-xs h-10 shadow-lg shadow-destructive/20"
                                                            >
                                                                Move to Bin
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
                <AdminPagination page={safeP} totalPages={totalPages} onPageChange={setPage} />
            </div>
        </div>
    );
}
