'use client';

import { AdminFilterToolbar, AdminPagination } from '@/components/admin/admin-filter-toolbar';
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
import { useMutation, useQuery } from 'convex/react';
import {
    AlertTriangle,
    Clock,
    Loader2,
    Package,
    Trash2,
    Undo2
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 15;

export function AdminRecycleBinClient() {
    const deletedRaw = useQuery(api.recycleBin.listDeleted, {});

    const restore    = useMutation(api.recycleBin.restore);
    const purge      = useMutation(api.recycleBin.purge);
    const purgeOld   = useMutation(api.recycleBin.purgeOld);

    const [search, setSearch]   = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage]       = useState(1);
    const [purging, setPurging] = useState(false);
    const [confirming, setConfirming] = useState<null | 'purge_all' | 'purge_old'>(null);

    const items = useMemo(() => {
        if (!deletedRaw) return [];
        let list: any[] = deletedRaw;
        if (search.trim()) {
            const q = search.toLowerCase().replace(/^#/, '');
            list = list.filter((l: any) =>
                l.title?.toLowerCase().includes(q) ||
                l.category?.toLowerCase().includes(q) ||
                l.deletedByName?.toLowerCase().includes(q) ||
                String(l.listingNumber || '').includes(q) || // listing #ID
                (l._id || '').toLowerCase().includes(q)      // Convex ID
            );
        }
        return [...list].sort((a, b) => (b.deletedAt ?? 0) - (a.deletedAt ?? 0));
    }, [deletedRaw, search]);

    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
    const safeP      = Math.min(page, totalPages);
    const paginated  = items.slice((safeP - 1) * ITEMS_PER_PAGE, safeP * ITEMS_PER_PAGE);

    const allSelected = paginated.length > 0 && paginated.every((l: any) => selected.includes(l._id));
    const toggleAll   = () => setSelected(allSelected ? [] : paginated.map((l: any) => l._id));
    const toggleOne   = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleRestore = async (id: string, title: string) => {
        try {
            await restore({ listingId: id as any });
            toast.success(`"${title}" restored to Active`);
            setSelected(prev => prev.filter(x => x !== id));
        } catch (e: any) {
            toast.error(e.message || 'Failed to restore');
        }
    };

    const handlePurge = async (id: string, title: string) => {
        try {
            await purge({ listingId: id as any });
            toast.success(`"${title}" permanently deleted`);
            setSelected(prev => prev.filter(x => x !== id));
        } catch (e: any) {
            toast.error(e.message || 'Failed to delete');
        }
    };

    const handlePurgeOld = async () => {
        setPurging(true);
        try {
            const result = await purgeOld({ olderThanDays: 30 });
            toast.success(`Purged ${(result as any).purged} items older than 30 days`);
        } catch (e: any) {
            toast.error(e.message || 'Failed');
        } finally {
            setPurging(false);
            setConfirming(null);
        }
    };

    const handleBulkRestore = async () => {
        for (const id of selected) {
            const item = items.find(i => i._id === id);
            await restore({ listingId: id as any }).catch(() => {});
            toast.success(`Restored ${selected.length} listings`);
        }
        setSelected([]);
    };

    const handleBulkPurge = async () => {
        for (const id of selected) {
            await purge({ listingId: id as any }).catch(() => {});
        }
        toast.success(`${selected.length} listings permanently deleted`);
        setSelected([]);
    };

    if (deletedRaw === undefined) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Days until auto-purge per item  
    const daysSince = (ts: number) => Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24));
    const daysLeft  = (ts: number) => Math.max(0, 30 - daysSince(ts));

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                        Recycle Bin
                        {items.length > 0 && (
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-bold ring-1 ring-inset ring-red-500/20">
                                {items.length}
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Soft-deleted listings. Items are auto-purged after <strong>30 days</strong>.
                    </p>
                </div>

                {(deletedRaw?.length ?? 0) > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={purging}
                                className="shrink-0 rounded-full font-bold"
                            >
                                {purging
                                    ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                    : <Trash2 className="w-3.5 h-3.5 mr-2" />
                                }
                                Purge &gt;30 Day Old
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 font-black uppercase tracking-tight text-destructive">
                                    <Trash2 className="w-5 h-5" />
                                    Purge Old Listings?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete ALL listings in the recycle bin that have been deleted for more than 30 days. This action CANNOT be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold uppercase text-xs h-10">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handlePurgeOld}
                                    className="bg-destructive hover:bg-destructive/90 text-white rounded-xl font-bold tracking-wider uppercase text-xs h-10 shadow-lg shadow-destructive/20"
                                >
                                    Yes, Purge Old
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {/* Warning banner */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                    <strong>Auto-cleanup:</strong> Items in the recycle bin are automatically and permanently deleted after 30 days.
                    You can restore any item within that window. Permanently deleted items <em>cannot</em> be recovered.
                </div>
            </div>

            {/* Filter toolbar */}
            <div className="glass-card rounded-2xl p-4 border border-border/60 space-y-3">
                <AdminFilterToolbar
                    searchValue={search}
                    onSearchChange={(q) => { setSearch(q); setPage(1); }}
                    searchPlaceholder="Search by title, #ID, or Convex ID..."
                    showTimeRange={false}
                />

                {/* Bulk actions */}
                {selected.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/30 animate-in fade-in duration-200">
                        <span className="text-xs font-bold text-foreground">{selected.length} selected</span>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" 
                                    className="h-7 px-3 text-xs font-bold gap-1.5 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10">
                                    <Undo2 className="w-3 h-3" /> Restore All
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2 font-black uppercase tracking-tight text-emerald-600">
                                        <Undo2 className="w-5 h-5" />
                                        Restore {selected.length} Listings?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        These {selected.length} selected listings will be fully restored and made active again across the platform.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl font-bold uppercase text-xs h-10">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleBulkRestore}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold tracking-wider uppercase text-xs h-10 shadow-lg shadow-emerald-600/20"
                                    >
                                        Yes, Restore
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" 
                                    className="h-7 px-3 text-xs font-bold gap-1.5">
                                    <Trash2 className="w-3 h-3" /> Delete Permanently
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2 font-black uppercase tracking-tight text-destructive">
                                        <Trash2 className="w-5 h-5" />
                                        Permanently Delete {selected.length} Listings?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        These {selected.length} listings will be completely wiped from the database. <br /><strong>This CANNOT be undone.</strong>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl font-bold uppercase text-xs h-10">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleBulkPurge}
                                        className="bg-destructive hover:bg-destructive/90 text-white rounded-xl font-bold tracking-wider uppercase text-xs h-10 shadow-lg shadow-destructive/20"
                                    >
                                        Permanently Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <button onClick={() => setSelected([])} className="text-xs text-muted-foreground hover:text-foreground ml-auto">
                            Clear selection
                        </button>
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{items.length}</span> item{items.length !== 1 ? 's' : ''} in recycle bin
                </p>
            </div>

            {/* Table */}
            {items.length === 0 ? (
                <div className="glass-card rounded-[2rem] p-20 flex flex-col items-center justify-center text-center border border-border/60">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                        <Trash2 className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Recycle bin is empty</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Deleted listings will appear here and can be restored within 30 days.
                    </p>
                </div>
            ) : (
                <div className="glass-card rounded-[2rem] overflow-hidden border border-border/60 shadow-xl shadow-black/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-4 py-3 w-8">
                                        <input type="checkbox" checked={allSelected} onChange={toggleAll}
                                            className="rounded border-border cursor-pointer" />
                                    </th>
                                    <th className="px-4 py-3 text-left">Listing</th>
                                    <th className="px-4 py-3 text-left hidden md:table-cell">Deleted By</th>
                                    <th className="px-4 py-3 text-left hidden md:table-cell">Deleted</th>
                                    <th className="px-4 py-3 text-left">Auto-purge</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {paginated.map((listing: any) => {
                                    const dLeft = listing.deletedAt ? daysLeft(listing.deletedAt) : 30;
                                    const urgency = dLeft <= 3 ? 'text-red-600' : dLeft <= 7 ? 'text-amber-600' : 'text-muted-foreground';
                                    return (
                                        <tr key={listing._id} className={cn(
                                            'hover:bg-muted/30 transition-colors opacity-80 hover:opacity-100',
                                            selected.includes(listing._id) && 'bg-primary/5 opacity-100'
                                        )}>
                                            <td className="px-4 py-3">
                                                <input type="checkbox" checked={selected.includes(listing._id)}
                                                    onChange={() => toggleOne(listing._id)}
                                                    className="rounded border-border cursor-pointer" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-border bg-muted shrink-0 grayscale">
                                                        {listing.thumbnail ? (
                                                            <Image src={listing.thumbnail} alt={listing.title || ''} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="h-4 w-4 text-muted-foreground/40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-xs text-foreground/70 line-clamp-1">{listing.title}</p>
                                                        <p className="text-[10px] text-muted-foreground">{listing.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <span className="text-xs text-muted-foreground">{listing.deletedByName || 'Admin'}</span>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    {listing.deletedAt
                                                        ? new Date(listing.deletedAt).toLocaleDateString()
                                                        : '—'
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn('text-xs font-bold flex items-center gap-1', urgency)}>
                                                    {dLeft === 0 ? '⚠ Purging today' : `${dLeft}d left`}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                className="h-7 w-7 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                                                                title="Restore listing"
                                                            >
                                                                <Undo2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="rounded-2xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="flex items-center gap-2 font-black uppercase tracking-tight text-emerald-600">
                                                                    <Undo2 className="w-5 h-5" />
                                                                    Restore Listing?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    <span className="block mb-2 font-medium text-foreground">"{listing.title}"</span>
                                                                    This listing will be fully restored and made active again across the platform.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="rounded-xl font-bold uppercase text-xs h-10">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction 
                                                                    onClick={() => handleRestore(listing._id, listing.title)}
                                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold tracking-wider uppercase text-xs h-10 shadow-lg shadow-emerald-600/20"
                                                                >
                                                                    Restore
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                    
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                className="h-7 w-7 rounded-lg flex items-center justify-center bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                                                title="Delete permanently"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="rounded-2xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="flex items-center gap-2 font-black uppercase tracking-tight text-destructive">
                                                                    <Trash2 className="w-5 h-5" />
                                                                    Permanently Delete?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    <span className="block mb-2 font-medium text-foreground">"{listing.title}"</span>
                                                                    This listing will be completely wiped from the database. <br /><strong>This CANNOT be undone.</strong>
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="rounded-xl font-bold uppercase text-xs h-10">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction 
                                                                    onClick={() => handlePurge(listing._id, listing.title)}
                                                                    className="bg-destructive hover:bg-destructive/90 text-white rounded-xl font-bold tracking-wider uppercase text-xs h-10 shadow-lg shadow-destructive/20"
                                                                >
                                                                    Permanently Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <AdminPagination page={safeP} totalPages={totalPages} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}
