'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAction, useMutation, useQuery } from 'convex/react';
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
  const [filter, setFilter] = useState<'today' | 'week' | 'all'>('today');
  const [syncing, setSyncing] = useState(false);
  const [prevStats, setPrevStats] = useState<any>(null);

  const getSince = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    if (filter === 'today') return startOfToday;
    if (filter === 'week') {
        const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();
        return sevenDaysAgo;
    }
    return undefined;
  };

  const since = getSince();
  const statsQuery = useQuery(api.transactions.getRevenueStats, { since });
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
    <div className='space-y-6 pb-20 max-w-7xl mx-auto'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end justify-between animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-1'>
           <h1 className='text-3xl font-black tracking-tight flex items-center gap-3'>
             Revenue Intelligence
             <span className='inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold ring-1 ring-inset ring-emerald-500/20 uppercase tracking-widest'>
                Live
             </span>
             {isTransitioning && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin ml-2" />}
           </h1>
           <p className='text-sm text-muted-foreground font-medium'>
               {filter === 'today' ? "Analyzing financial performance for today." : 
                filter === 'week' ? "Financial breakdown for the last 7 days." : 
                "Comprehensive all-time financial overview."}
           </p>
        </div>
        
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto'>
            <div className='flex items-center p-1 bg-muted/40 rounded-lg border border-border/50'>
                {[
                    { id: 'today', label: 'Today' },
                    { id: 'week', label: '7 Days' },
                    { id: 'all', label: 'All Time' }
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={cn(
                            'flex-1 sm:flex-none px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold rounded-md transition-all duration-300',
                            filter === f.id 
                                ? 'bg-background text-foreground shadow-sm ring-1 ring-border shadow-black/5' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <Button 
                    onClick={handleReset} 
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-lg text-[11px] uppercase tracking-wider font-bold text-destructive hover:bg-destructive/10 hidden lg:flex"
                >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Reset Data
                </Button>
                <Button 
                    onClick={handleSync} 
                    disabled={syncing}
                    className="h-8 px-4 rounded-lg text-[11px] uppercase tracking-wider font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all flex-1 sm:flex-none"
                    variant="default"
                >
                    {syncing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
                    Sync Stripe
                </Button>
            </div>
        </div>
      </div>

      <div className={cn("transition-opacity duration-300", isTransitioning ? "opacity-60" : "opacity-100")}>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
            
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-3">
                    <CompactStat 
                        title="Gross Revenue" 
                        value={formatCurrency(stats.totalRevenue)} 
                        icon={DollarSign}
                        className="col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-card border-primary/20 shadow-primary/5"
                        valueClassName="text-3xl text-primary"
                    />
                    <CompactStat 
                        title="Net Revenue" 
                        value={formatCurrency(stats.netRevenue)} 
                        icon={TrendingUp}
                        className="bg-blue-500/5 border-blue-500/20"
                    />
                    <CompactStat 
                        title="VAT (18%)" 
                        value={formatCurrency(stats.vatRevenue)} 
                        icon={TrendingUp}
                        className="bg-emerald-500/5 border-emerald-500/20"
                    />
                </div>

                <Card className="rounded-2xl border-border/50 shadow-md bg-card flex flex-col flex-1">
                    <div className="p-4 border-b border-border/40 bg-muted/10">
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

            <div className="lg:col-span-8 flex flex-col">
                <Card className="rounded-2xl border-border/50 shadow-md bg-card flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-border/40 bg-muted/10 flex items-center justify-between">
                        <h2 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            Recent Transactions Ledger
                        </h2>
                    </div>
                    
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-muted/30 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Purchase Details</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {stats.recentTransactions.length === 0 ? (
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
                                    stats.recentTransactions.map((t: any) => (
                                        <tr key={t._id} className="hover:bg-muted/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                                        {t.userName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="flex flex-col min-w-[120px]">
                                                        <span className="font-bold text-foreground truncate">{t.userName}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium truncate">{t.userEmail}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-muted-foreground text-sm max-w-[250px] truncate" title={t.description}>
                                                    {t.description}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <BadgeType type={t.type} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-black tabular-nums text-foreground bg-muted/50 px-2 py-1 rounded-md">
                                                    {formatCurrency(t.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-semibold text-foreground">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
          </div>
      </div>
    </div>
  );
}

function CompactStat({ title, value, icon: Icon, className, valueClassName }: any) {
    return (
        <Card className={cn("overflow-hidden rounded-xl bg-card border border-border/50", className)}>
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
    const colors = {
        amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-500/5",
        blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-blue-500/5",
        purple: "bg-purple-500/10 text-purple-600 border-purple-500/20 shadow-purple-500/5",
        emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-emerald-500/5",
    };
    
    const style = (colors as any)[color] || colors.blue;

    return (
        <div className={cn("flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-1 min-[380px]:gap-3 p-3 rounded-xl border bg-card/40 hover:bg-card transition-colors", style)}>
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

function BadgeType({ type }: { type: string }) {
    if (type === 'SUBSCRIPTION') {
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Subscription</span>;
    }
    if (type === 'PROMOTION' || type === 'LISTING_PROMOTION') {
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">Promotion</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">{type}</span>;
}
