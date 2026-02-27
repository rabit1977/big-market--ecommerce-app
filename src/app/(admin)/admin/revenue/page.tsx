'use client';

import { AdminFilterToolbar, getSinceFromRange, TimeRange } from '@/components/admin/admin-filter-toolbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAction, useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import {
    Crown,
    DollarSign,
    Eye,
    Loader2,
    RefreshCw,
    Star,
    Trash2,
    TrendingUp,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../../convex/_generated/api';

export default function RevenuePage() {
  const [filter, setFilter] = useState<TimeRange>('today');
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [prevStats, setPrevStats] = useState<any>(null);

  const since = getSinceFromRange(filter);
  const statsQuery = useQuery(api.transactions.getRevenueStats, { since });
  const { results: recentTransactions, status: paginationStatus, loadMore } = usePaginatedQuery(
      api.transactions.getPaginatedTransactions,
      { since },
      { initialNumItems: 10 }
  );
  const syncTransactions = useAction(api.stripeActions.syncTransactions);

  if (statsQuery !== undefined && statsQuery !== prevStats) {
      setPrevStats(statsQuery);
  }
  
  const stats = statsQuery ?? prevStats;
  const isTransitioning = statsQuery === undefined && prevStats !== null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('mk-MK', {
      style: 'currency',
      currency: 'MKD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSync = async () => {
      setSyncing(true);
      try {
          const syncSince = since ? Math.floor(since / 1000) : undefined;
          
          const result = await syncTransactions({ 
              limit: 100, 
              since: syncSince 
          });

          if (result.success) {
              toast.success(`Synced ${result.count} transactions from Stripe`);
          }
      } catch (error) {
          toast.error("Failed to sync transactions");
          console.error(error);
      } finally {
          setSyncing(false);
      }
  };

  const clearData = useMutation(api.transactions.clear);
  const handleReset = async () => {
    if (confirm("Are you sure? This will delete all revenue data. You can re-sync from Stripe afterwards.")) {
        try {
            await clearData();
            toast.success("All revenue data cleared");
        } catch (e) {
            toast.error("Failed to clear data");
        }
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className='space-y-6 pb-20 max-w-7xl'>
        <div className='flex flex-col gap-4 sm:flex-col justify-between animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-1'>
           <h1 className='text-xl md:text-3xl width-full font-black tracking-tight flex items-center gap-3 justify-start'>
             Revenue Intelligence
             <span className='inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-secondary text-primary text-[10px] font-bold border border-border uppercase tracking-widest'>
                Live
             </span>
             {isTransitioning && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin ml-2" />}
           </h1>
           <p className='text-sm text-muted-foreground font-medium'>
               {filter === 'today' ? "Analyzing financial performance for today." : 
                filter === 'week' ? "Financial breakdown for the last 7 days." : 
                filter === 'month' ? "Financial breakdown for the last 30 days." :
                filter === 'year' ? "Full-year financial overview." :
                "Comprehensive all-time financial overview."}
           </p>
        </div>

        <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 w-full'>
            <AdminFilterToolbar
                timeRange={filter}
                onTimeRangeChange={(r) => setFilter(r)}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search name, email, description, Stripe ID..."
                showExport
                onExport={() => {
                    const rows = recentTransactions.map((t: any) =>
                        `"${t.userName}","${t.userEmail}","${t.description}","${t.type}",${t.amount},"${new Date(t.createdAt).toLocaleDateString()}"`
                    );
                    const csv = 'Name,Email,Description,Type,Amount,Date\n' + rows.join('\n');
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                    a.download = `revenue-${filter}-${Date.now()}.csv`;
                    a.click();
                }}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleReset}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 rounded-md text-[11px] uppercase tracking-wider font-bold text-destructive"
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Reset
                        </Button>
                        <Button
                            onClick={handleSync}
                            disabled={syncing}
                            className="h-8 px-4 rounded-lg text-[11px] uppercase tracking-wider font-bold"
                            variant="default"
                        >
                            {syncing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
                            Sync Stripe
                        </Button>
                    </div>
                }
            />
        </div>
      </div>

      <div className={cn("transition-opacity duration-300", isTransitioning ? "opacity-60" : "opacity-100")}>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
            
            <div className="md:col-span-1 lg:col-span-4 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-3">
                    <CompactStat 
                        title="Gross Revenue" 
                        value={formatCurrency(stats.totalRevenue)} 
                        icon={DollarSign}
                        className="col-span-1 bg-card border-border shadow-none"
                        valueClassName="text-3xl text-primary"
                    />
                    <CompactStat 
                        title="Net Revenue" 
                        value={formatCurrency(stats.netRevenue)} 
                        icon={TrendingUp}
                        className="bg-card col-span-1 border-border shadow-none"
                    />
                    <CompactStat 
                        title="VAT (18%)" 
                        value={formatCurrency(stats.vatRevenue)} 
                        icon={TrendingUp}
                        className="bg-card col-span-2 border-border shadow-none"
                    />
                </div>

                <Card className="rounded-lg border-border shadow-none bg-card flex flex-col flex-1">
                    <div className="p-4 border-b border-border bg-secondary/50">
                        <h2 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            Revenue Vectors
                        </h2>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-3">
                        <CategoryRow title="Top Positioning" amount={stats.revenueByTier.TOP_POSITIONING} color="amber" icon={Star} />
                        <CategoryRow title="Premium Sector" amount={stats.revenueByTier.PREMIUM_SECTOR} color="blue" icon={Crown} />
                        <CategoryRow title="Daily Refresh" amount={stats.revenueByTier.AUTO_DAILY_REFRESH} color="purple" icon={RefreshCw} />
                        <CategoryRow title="Highlight" amount={stats.revenueByTier.LISTING_HIGHLIGHT} color="emerald" icon={Eye} />
                    </div>
                </Card>
            </div>

            <div className="lg:col-span-4 flex flex-col">
                <Card className="rounded-lg border-border shadow-none bg-card flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between">
                        <h2 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            Recent Transactions Ledger
                        </h2>
                    </div>
                    
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-muted/30 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Purchase Details</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                    <th className="px-4 py-3 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {recentTransactions.length === 0 && paginationStatus !== "LoadingFirstPage" ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                                    <DollarSign className="w-6 h-6 text-muted-foreground/50" />
                                                </div>
                                                <p className="font-bold text-foreground">No transactions</p>
                                                <p className="text-muted-foreground text-sm mt-1">Check your Stripe dashboard or adjust the date filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    recentTransactions
                                    .filter((t: any) => !search ||
                                        t.userName?.toLowerCase().includes(search.toLowerCase()) ||
                                        t.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
                                        t.description?.toLowerCase().includes(search.toLowerCase()) ||
                                        (t.stripeId || '').toLowerCase().includes(search.toLowerCase()) || // Stripe session ID
                                        (t._id || '').toLowerCase().includes(search.toLowerCase())         // Convex ID
                                    )
                                    .map((t: any) => {
                                        const isUnknown = !t.userName || t.userName === 'Unknown Customer';
                                        const initials = t.userName ? t.userName.charAt(0).toUpperCase() : '?';
                                        const { label: detailLabel, sub: detailSub } = getPurchaseDetails(t);
                                        return (
                                        <tr key={t._id} className="hover:bg-muted/40 transition-colors group">
                                            {/* Customer */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isUnknown ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                                                        {initials}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={`text-xs font-bold truncate ${isUnknown ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                                                            {t.userName || 'Unknown'}
                                                        </span>
                                                        {t.userEmail && (
                                                            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{t.userEmail}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Purchase Details */}
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-bold text-foreground leading-tight">{detailLabel}</span>
                                                    {detailSub && <span className="text-[10px] text-muted-foreground leading-tight">{detailSub}</span>}
                                                    <BadgeType type={t.type} />
                                                </div>
                                            </td>
                                            {/* Amount */}
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-black tabular-nums text-sm text-foreground">
                                                    {formatCurrency(t.amount)}
                                                </span>
                                            </td>
                                            {/* Date */}
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <span className="text-xs font-semibold text-foreground">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {paginationStatus === "CanLoadMore" && (
                        <div className="p-4 border-t border-border/40 bg-muted/5 flex justify-center">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => loadMore(10)}
                                className="text-xs uppercase tracking-wider font-bold"
                            >
                                Load More Transactions
                            </Button>
                        </div>
                    )}
                    {paginationStatus === "LoadingMore" && (
                        <div className="p-4 border-t border-border/40 bg-muted/5 flex justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    )}
                </Card>
            </div>
          </div>
      </div>
    </div>
  );
}

function CompactStat({ title, value, icon: Icon, className, valueClassName }: any) {
    return (
        <Card className={cn("overflow-hidden rounded-lg bg-card border border-border transition-colors hover:bg-secondary/30", className)}>
            <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">{title}</p>
                    <Icon className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                </div>
                <p className={cn("text-[17px] sm:text-xl font-black tracking-tight", valueClassName)}>{value}</p>
            </CardContent>
        </Card>
    );
}

function CategoryRow({ title, amount, color, icon: Icon }: any) {
    const colors: Record<string, string> = {
        amber: "text-amber-500",
        blue: "text-blue-500",
        purple: "text-purple-500",
        emerald: "text-emerald-500",
    };
    
    const style = colors[color] || colors.blue;

    return (
        <div className={cn("flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-1 min-[380px]:gap-3 p-3 rounded-lg border bg-card hover:bg-secondary/30 transition-colors", style)}>
            <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 bg-background shadow-sm rounded-lg border border-border/50 shrink-0">
                    <Icon className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-foreground/90 truncate">{title}</span>
            </div>
            <div className="flex min-[380px]:justify-end pl-[42px] min-[380px]:pl-0">
                <span className="font-mono font-bold text-foreground whitespace-nowrap shrink-0">
                    {new Intl.NumberFormat('mk-MK', { style: 'currency', currency: 'MKD', minimumFractionDigits: 0 }).format(amount)}
                </span>
            </div>
        </div>
    );
}

function getPurchaseDetails(t: any): { label: string; sub?: string } {
    const desc = t.description || '';
    if (t.type === 'SUBSCRIPTION') {
        // e.g. "BASIC Subscription (monthly)" or "PRO Membership"
        const parts = desc.split('(');
        const label = parts[0].trim() || 'Subscription Plan';
        const sub = parts[1] ? parts[1].replace(')', '').trim() : undefined;
        return { label, sub };
    }
    if (t.type === 'PROMOTION' || t.type === 'LISTING_PROMOTION') {
        // e.g. "Listing Promotion: TOP_POSITIONING (Listing #abc123)"
        const match = desc.match(/^(.+?)(?:\s*\((.+)\))?$/);
        return { label: match?.[1]?.trim() || 'Listing Promotion', sub: match?.[2]?.trim() };
    }
    if (t.type === 'TOPUP') {
        return { label: 'Wallet Top-Up', sub: `+${t.amount} MKD credits` };
    }
    // Fallback: use description as-is, split at ":"
    const [before, after] = desc.split(':');
    return { label: before?.trim() || desc, sub: after?.trim() };
}

function BadgeType({ type }: { type: string }) {
    const base = "inline-flex items-center px-1.5 py-0.5 mt-0.5 rounded-md text-[9px] font-bold border w-fit transition-colors";
    
    if (type === 'SUBSCRIPTION') {
        return <span className={cn(base, "bg-secondary text-primary border-border hover:bg-muted")}>Subscription</span>;
    }
    if (type === 'PROMOTION' || type === 'LISTING_PROMOTION') {
        return <span className={cn(base, "bg-secondary text-foreground border-border hover:bg-muted")}>Promotion</span>;
    }
    if (type === 'TOPUP') {
        return <span className={cn(base, "bg-secondary text-emerald-500 border-border hover:bg-muted")}>Top-Up</span>;
    }
    return <span className={cn(base, "bg-secondary text-muted-foreground border-border hover:bg-muted")}>{type}</span>;
}
