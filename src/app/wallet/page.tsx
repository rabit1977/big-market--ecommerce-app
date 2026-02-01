'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowDownLeft,
    ArrowUpRight,
    CreditCard,
    History,
    Loader2,
    Wallet
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';

export default function WalletPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || '';
    
    const user = useQuery(api.users.getByExternalId, { externalId: userId });
    const transactions = useQuery(api.wallet.getTransactions, { userId });
    const topUp = useMutation(api.wallet.topUp);

    const [isToppingUp, setIsToppingUp] = useState(false);

    const handleTopUp = async (amount: number) => {
        setIsToppingUp(true);
        try {
            await topUp({
                userId,
                amount,
                description: `Manual Top-up via UI`
            });
            toast.success(`Successfully added ${formatPrice(amount)} to your wallet`);
        } catch (err) {
            toast.error("Failed to add credits");
        } finally {
            setIsToppingUp(false);
        }
    };

    if (!user) return <div className="p-20 text-center">Loading Wallet...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-muted/10">
            <div className="container max-w-5xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <Wallet className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900">Wallet & Credits</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Balance & Top up */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20 rounded-3xl overflow-hidden relative">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                            <CardHeader>
                                <CardTitle className="text-white/80 font-medium">Available Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl font-black">{formatPrice(user.credits || 0)}</div>
                                <p className="text-white/60 text-sm mt-2">Use credits to promote your ads</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg">Top Up Balance</CardTitle>
                                <CardDescription>Select an amount to add to your credits</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3">
                                {[10, 20, 50, 100].map((amount) => (
                                    <Button 
                                        key={amount} 
                                        variant="outline" 
                                        className="h-16 rounded-2xl font-bold text-lg hover:border-primary hover:text-primary transition-all"
                                        onClick={() => handleTopUp(amount)}
                                        disabled={isToppingUp}
                                    >
                                        +{formatPrice(amount)}
                                    </Button>
                                ))}
                                <Button className="col-span-2 h-14 rounded-2xl mt-2 font-bold" variant="secondary">
                                    Custom Amount
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Transaction History */}
                    <div className="lg:col-span-2">
                        <Card className="h-full rounded-3xl border-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <History className="w-5 h-5 text-primary" />
                                        Transaction History
                                    </CardTitle>
                                    <CardDescription>Recent activity in your wallet</CardDescription>
                                </div>
                                <Badge variant="secondary">{transactions?.length || 0} Total</Badge>
                            </CardHeader>
                            <CardContent>
                                {!transactions ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                                    </div>
                                ) : transactions.length === 0 ? (
                                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
                                        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">No transactions yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {transactions.map((tx) => (
                                            <div key={tx._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                                        tx.type === 'TOPUP' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                                    )}>
                                                        {tx.type === 'TOPUP' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{tx.description}</p>
                                                        <p className="text-xs text-slate-500">{formatDistanceToNow(tx.createdAt, { addSuffix: true })}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={cn(
                                                        "font-black text-lg",
                                                        tx.type === 'TOPUP' ? "text-green-600" : "text-slate-900"
                                                    )}>
                                                        {tx.type === 'TOPUP' ? '+' : ''}{formatPrice(Math.abs(tx.amount))}
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] h-5 uppercase">
                                                        {tx.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
