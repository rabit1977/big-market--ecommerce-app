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

  // Calculate start timestamps
  const getSince = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    if (filter === 'today') return startOfToday;
    if (filter === 'week') {
        // Stabilize: 7 days ago, but start of THAT day
        const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();
        return sevenDaysAgo;
    }
    return undefined; // All time
  };

  const since = getSince();
  const stats = useQuery(api.transactions.getRevenueStats, { since });
  const syncTransactions = useAction(api.stripeActions.syncTransactions);

  // Helper to format currency
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
          // Convert to seconds for Stripe API
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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-black tracking-tight">Revenue Dashboard</h1>
           <p className="text-muted-foreground text-sm">
               {filter === 'today' ? "Showing earnings for today" : 
                filter === 'week' ? "Showing earnings for the last 7 days" : 
                "Showing all-time earnings"}
           </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
            {/* Filter Group */}
            <div className="flex items-center bg-muted/30 p-1 rounded-lg border border-border/50 mr-2">
                <Button 
                    variant={filter === 'today' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setFilter('today')}
                    className="h-8 text-xs font-bold"
                >
                    Today
                </Button>
                <Button 
                    variant={filter === 'week' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setFilter('week')}
                    className="h-8 text-xs font-bold"
                >
                    Last 7 Days
                </Button>
                <Button 
                    variant={filter === 'all' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setFilter('all')}
                    className="h-8 text-xs font-bold"
                >
                    All Time
                </Button>
            </div>

            <Button 
                onClick={handleReset} 
                variant="ghost"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hidden sm:flex"
            >
                <Trash2 className="w-4 h-4" />
                Reset
            </Button>
            <Button 
                onClick={handleSync} 
                disabled={syncing}
                variant="outline"
                size="sm"
                className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary h-9 px-4"
            >
                {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Sync Stripe
            </Button>
        </div>
      </div>

      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
            title="Total Revenue (Gross)" 
            value={formatCurrency(stats.totalRevenue)} 
            icon={DollarSign}
            className="bg-primary/5 border-primary/20"
            iconClassName="text-primary bg-primary/10"
        />
        <StatsCard 
            title="VAT (18%)" 
            value={formatCurrency(stats.vatRevenue)} 
            icon={TrendingUp}
            className="bg-emerald-500/5 border-emerald-500/20"
            iconClassName="text-emerald-600 bg-emerald-500/10"
        />
         <StatsCard 
            title="Net Revenue" 
            value={formatCurrency(stats.netRevenue)} 
            icon={TrendingUp}
            className="bg-blue-500/5 border-blue-500/20"
            iconClassName="text-blue-600 bg-blue-500/10"
        />
        {/* <StatsCard 
            title="Verification" 
            value={formatCurrency(stats.verificationRevenue)} 
            icon={Crown}
            className="bg-blue-500/5 border-blue-500/20"
            iconClassName="text-blue-600 bg-blue-500/10"
        /> */}
        <StatsCard 
            title="Promotions" 
            value={formatCurrency(stats.promotionRevenue)} 
            icon={Zap}
            className="bg-purple-500/5 border-purple-500/20"
            iconClassName="text-purple-600 bg-purple-500/10"
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold tracking-tight">Recent Transactions</h2>
              <div className="border rounded-xl bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {stats.recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                stats.recentTransactions.map((t) => (
                                    <tr key={t._id} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-4 py-3 font-medium">
                                            <div className="flex flex-col">
                                                <span>{t.userName}</span>
                                                <span className="text-[10px] text-muted-foreground font-normal">{t.userEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {t.description}
                                        </td>
                                        <td className="px-4 py-3">
                                            <BadgeType type={t.type} />
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold tabular-nums">
                                            {formatCurrency(t.amount)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-muted-foreground tabular-nums text-xs">
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                  </div>
              </div>
          </div>

          {/* Promotion Breakdown */}
          <div className="space-y-4">
               <h2 className="text-lg font-bold tracking-tight">Promotion Breakdown</h2>
               <div className="grid gap-3">
                  <CategoryCard 
                     title="Top Positioning" 
                     amount={stats.revenueByTier.TOP_POSITIONING} 
                     color="amber"
                     icon={Star}
                  />
                  <CategoryCard 
                     title="Premium Sector" 
                     amount={stats.revenueByTier.PREMIUM_SECTOR} 
                     color="blue"
                     icon={Crown}
                  />
                  <CategoryCard 
                     title="Auto Daily Refresh" 
                     amount={stats.revenueByTier.AUTO_DAILY_REFRESH} 
                     color="purple"
                     icon={RefreshCw}
                  />
                  <CategoryCard 
                     title="Listing Highlight" 
                     amount={stats.revenueByTier.LISTING_HIGHLIGHT} 
                     color="emerald"
                     icon={Eye}
                  />
               </div>
          </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, className, iconClassName }: any) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-2xl font-black tracking-tight">{value}</p>
                </div>
                <div className={cn("p-2 rounded-lg", iconClassName)}>
                    <Icon className="w-5 h-5" />
                </div>
            </CardContent>
        </Card>
    );
}

function CategoryCard({ title, amount, color, icon: Icon }: any) {
    const colors = {
        amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    };
    
    // safe fallback or simple map
    const style = (colors as any)[color] || colors.blue;

    return (
        <div className={cn("flex items-center justify-between p-4 rounded-xl border bg-card/50", style)}>
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-background/50 rounded-md shadow-sm">
                    <Icon className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-foreground/80">{title}</span>
            </div>
            <span className="font-mono font-bold text-foreground">
                {new Intl.NumberFormat('mk-MK', { style: 'currency', currency: 'MKD', minimumFractionDigits: 0 }).format(amount)}
            </span>
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
