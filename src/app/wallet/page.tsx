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
    Loader2
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
        <div className="min-h-screen pt-24 pb-12 bg-gray-50/50">
            <div className="container max-w-3xl mx-auto px-4">
                <AppBreadcrumbs />
                
                {/* Header matches Image 2 Header Style */}
                <div className="flex items-center justify-between mb-6">
                     <h1 className="text-xl font-bold">User ID: {user.externalId.slice(-6)}</h1>
                     {/* Close button usually there on modal, here we just show as page title */}
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="payments" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="payments" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md">Payments</TabsTrigger>
                        <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md">Expenses</TabsTrigger>
                    </TabsList>

                    <div className="mb-6">
                        <div className="text-xs text-muted-foreground mb-1 ml-1">Select month</div>
                        <Select defaultValue="current">
                          <SelectTrigger className="w-full bg-white border-gray-200">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current">Current Month</SelectItem>
                            <SelectItem value="last">Last Month</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Payments:</div>
                            <div className="font-bold text-lg">{formatPrice(stats.payments)}</div>
                        </div>
                        <div className="border-l border-r border-gray-100">
                            <div className="text-xs text-muted-foreground mb-1">Spent:</div>
                            <div className="font-bold text-lg">{formatPrice(stats.spent)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Bonuses:</div>
                            <div className="font-bold text-lg">{formatPrice(stats.bonuses)}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button 
                            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold h-12 rounded-xl"
                            asChild
                        >
                            <Link href="/wallet/top-up">
                                Top Up Account
                            </Link>
                        </Button>
                    </div>

                    {/* Content Area */}
                    <div className="mt-8 min-h-[300px]">
                        {!transactions ? (
                             <div className="flex justify-center p-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-20">
                                <span className="text-muted-foreground text-sm">No transactions found</span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {transactions.map((tx) => (
                                    <div key={tx._id} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                                {tx.type === 'TOPUP' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{tx.description}</div>
                                                <div className="text-xs text-muted-foreground">{formatDistanceToNow(tx.createdAt, { addSuffix: true })}</div>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${tx.type === 'TOPUP' ? 'text-green-600' : 'text-slate-900'}`}>
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
