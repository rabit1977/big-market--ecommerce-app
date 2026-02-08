'use client';


import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/lib/utils/formatters';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Loader2,
    Wallet
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '../../../convex/_generated/api';

export default function WalletPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || '';
    
    const user = useQuery(api.users.getByExternalId, { externalId: userId });
    const transactions = useQuery(api.wallet.getTransactions, { userId });
    
    // Derived stats from transactions (mock logic for now as we might need backend aggregation)
    const stats = {
        payments: user?.credits || 0, // In wallet currently
        spent: 0, // Placeholder
        bonuses: 0 // Placeholder
    };

    if (!user) return <div className="p-20 text-center">Loading Wallet...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-muted/30">
            <div className="container max-w-3xl mx-auto px-4">
                <AppBreadcrumbs />
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                     <div className="p-2 bg-primary/10 rounded-xl">
                        <Wallet className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                         <h1 className="text-3xl font-black tracking-tighter text-foreground">My Wallet</h1>
                         <p className="text-muted-foreground text-sm font-medium">User ID: {user.externalId.slice(-6).toUpperCase()}</p>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="payments" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-muted p-1 rounded-xl">
                        <TabsTrigger value="payments" className="rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Payments</TabsTrigger>
                        <TabsTrigger value="expenses" className="rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Expenses</TabsTrigger>
                    </TabsList>

                    <div className="mb-6 flex justify-end">
                        <Select defaultValue="current">
                          <SelectTrigger className="w-[180px] bg-card border-border">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current">Current Month</SelectItem>
                            <SelectItem value="last">Last Month</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8 bg-card rounded-2xl border border-border/50 shadow-sm p-6 text-center">
                        <div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Balance</div>
                            <div className="font-black text-2xl text-foreground">{formatPrice(stats.payments)}</div>
                        </div>
                        <div className="border-l border-border/50 relative">
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Spent</div>
                            <div className="font-black text-2xl text-foreground">{formatPrice(stats.spent)}</div>
                        </div>
                        <div className="border-l border-border/50">
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Bonuses</div>
                            <div className="font-black text-2xl text-foreground">{formatPrice(stats.bonuses)}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button 
                            className="w-full font-bold h-12 rounded-xl text-lg shadow-lg shadow-primary/20"
                            size="lg"
                            asChild
                        >
                            <Link href="/wallet/top-up">
                                Top Up Account
                            </Link>
                        </Button>
                    </div>

                    {/* Content Area */}
                    <div className="mt-10 min-h-[300px]">
                        <h3 className="font-bold text-foreground mb-4 text-lg">Recent Transactions</h3>
                        {!transactions ? (
                             <div className="flex justify-center p-10"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                                <span className="text-muted-foreground text-sm font-medium">No transactions found</span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {transactions.map((tx) => (
                                    <div key={tx._id} className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-xl hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'TOPUP' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {tx.type === 'TOPUP' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-foreground">{tx.description}</div>
                                                <div className="text-xs text-muted-foreground font-medium">{formatDistanceToNow(tx.createdAt, { addSuffix: true })}</div>
                                            </div>
                                        </div>
                                        <div className={`font-black text-lg ${tx.type === 'TOPUP' ? 'text-emerald-600' : 'text-foreground'}`}>
                                            {tx.type === 'TOPUP' ? '+' : ''}{formatPrice(Math.abs(tx.amount))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
