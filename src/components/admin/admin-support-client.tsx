'use client';

import { AdminFilterToolbar, AdminPagination, getSinceFromRange, TimeRange } from '@/components/admin/admin-filter-toolbar';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { CheckCircle, Clock, Headset, Loader2, Mail, Phone, User } from 'lucide-react';
import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 10;

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
    NEW:       { label: 'New',      classes: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    READ:      { label: 'Read',     classes: 'bg-muted text-muted-foreground border-border' },
    RESOLVED:  { label: 'Resolved', classes: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
};

export function AdminSupportClient() {
    const inquiriesRaw = useQuery(api.contact.list, {});

    const [timeRange, setTimeRange] = useState<TimeRange>('all');
    const [search, setSearch]       = useState('');
    const [statusF, setStatusF]     = useState('ALL');
    const [page, setPage]           = useState(1);

    const since = getSinceFromRange(timeRange);

    const inquiries = useMemo(() => {
        if (!inquiriesRaw) return [];
        let list: any[] = inquiriesRaw;

        if (since) list = list.filter((i: any) => (i.createdAt || i._creationTime || 0) >= since);
        if (statusF !== 'ALL') list = list.filter((i: any) => i.status === statusF);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((i: any) =>
                i.name?.toLowerCase().includes(q) ||
                i.email?.toLowerCase().includes(q) ||
                i.subject?.toLowerCase().includes(q) ||
                i.message?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [inquiriesRaw, since, statusF, search]);

    const totalPages = Math.max(1, Math.ceil(inquiries.length / ITEMS_PER_PAGE));
    const safeP = Math.min(page, totalPages);
    const paginated = inquiries.slice((safeP - 1) * ITEMS_PER_PAGE, safeP * ITEMS_PER_PAGE);

    const newCount  = (inquiriesRaw || []).filter((i: any) => i.status === 'NEW').length;
    const totalCount = (inquiriesRaw || []).length;

    if (inquiriesRaw === undefined) {
        return <div className="flex items-center justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                        Support &amp; Inquiries
                        {newCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold ring-1 ring-inset ring-blue-500/20">
                                {newCount} new
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Contact form messages and support requests from users.
                    </p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Total',    value: totalCount, color: 'border-blue-500/20',    text: 'text-blue-600' },
                    { label: 'New',      value: newCount,   color: 'border-amber-500/20',   text: 'text-amber-600' },
                    { label: 'Resolved', value: (inquiriesRaw || []).filter((i: any) => i.status === 'RESOLVED').length,
                      color: 'border-emerald-500/20', text: 'text-emerald-600' },
                ].map(s => (
                    <div key={s.label} className={`glass-card rounded-2xl p-4 border ${s.color}`}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                        <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter toolbar */}
            <div className="glass-card rounded-2xl p-4 border border-border/60 space-y-3">
                <AdminFilterToolbar
                    timeRange={timeRange}
                    onTimeRangeChange={(r) => { setTimeRange(r); setPage(1); }}
                    searchValue={search}
                    onSearchChange={(q) => { setSearch(q); setPage(1); }}
                    searchPlaceholder="Search name, email, subject..."
                />
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/30">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status:</span>
                    {['ALL', 'NEW', 'READ', 'RESOLVED'].map(s => (
                        <button key={s}
                            onClick={() => { setStatusF(s); setPage(1); }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                                statusF === s
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'border-border/50 text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {s === 'ALL' ? 'All' : STATUS_MAP[s]?.label || s}
                        </button>
                    ))}
                    <span className="ml-auto text-xs text-muted-foreground">
                        <span className="font-bold text-foreground">{inquiries.length}</span> of <span className="font-bold text-foreground">{totalCount}</span> inquiries
                    </span>
                </div>
            </div>

            {/* List */}
            {paginated.length === 0 ? (
                <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Headset className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-bold">No inquiries found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {paginated.map((inquiry: any) => {
                        const st = STATUS_MAP[inquiry.status] || STATUS_MAP.READ;
                        return (
                            <Card key={inquiry._id} className="border-border/50 hover:border-primary/20 transition-all hover:shadow-md glass-card">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.classes}`}>
                                                    {inquiry.status === 'NEW' ? <Clock className="w-2.5 h-2.5 mr-1" /> :
                                                     inquiry.status === 'RESOLVED' ? <CheckCircle className="w-2.5 h-2.5 mr-1" /> : null}
                                                    {st.label}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(inquiry.createdAt || inquiry._creationTime || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-sm text-foreground">{inquiry.subject}</h3>
                                        </div>
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded-xl border border-border/40">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">{inquiry.message}</p>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-3 border-t border-border/40 pt-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <User className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="font-semibold text-xs text-foreground">{inquiry.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                                <Mail className="h-3 w-3 text-blue-500" />
                                            </div>
                                            <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline text-xs truncate">
                                                {inquiry.email}
                                            </a>
                                        </div>
                                        {inquiry.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                    <Phone className="h-3 w-3 text-emerald-500" />
                                                </div>
                                                <span className="text-xs">{inquiry.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick reply */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <a href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject || '')}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                                            <Mail className="w-3 h-3" /> Reply via Email
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <AdminPagination page={safeP} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
