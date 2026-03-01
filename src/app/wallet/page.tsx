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
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { api } from '../../../convex/_generated/api';

export default function WalletPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || '';
    const t = useTranslations('Wallet');
    
    const user = useQuery(api.users.getByExternalId, { externalId: userId });
    const transactions = useQuery(api.wallet.getTransactions, { userId });
    
    const stats = {
        payments: user?.credits || 0,
        spent: 0,
        bonuses: 0
    };

    if (!user) return <div className="p-20 text-center text-muted-foreground">{t('loading')}</div>;

    return (
        <div className="min-h-screen pt-4 md:pt-6 pb-8 bg-muted/20">
            <div className="container max-w-3xl mx-auto px-3 md:px-4">
                <AppBreadcrumbs />
                
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-5 md:mb-8">
                     <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg md:rounded-xl">
                        <Wallet className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                    </div>
                    <div className="min-w-0">
                         <h1 className="text-lg md:text-2xl font-black tracking-tighter text-foreground">{t('title')}</h1>
                         <p className="text-muted-foreground text-[10px] md:text-sm font-medium">ID: {user.externalId.slice(-6).toUpperCase()}</p>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="payments" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6 h-10 md:h-11 bg-muted p-0.5 md:p-1 rounded-lg md:rounded-xl">
                        <TabsTrigger value="payments" className="rounded-md md:rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">{t('payments_tab')}</TabsTrigger>
                        <TabsTrigger value="expenses" className="rounded-md md:rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">{t('expenses_tab')}</TabsTrigger>
                    </TabsList>

                    <div className="mb-4 md:mb-6 flex justify-end">
                        <Select defaultValue="current">
                          <SelectTrigger className="w-[150px] md:w-[180px] bg-card border-border text-xs md:text-sm h-9">
                            <SelectValue placeholder={t('select_month')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current">{t('current_month')}</SelectItem>
                            <SelectItem value="last">{t('last_month')}</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-5 md:mb-8 bg-card rounded-xl md:rounded-2xl border border-border/50 shadow-sm p-3 md:p-5 text-center">
                        <div>
                            <div className="text-[9px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t('balance')}</div>
                            <div className="font-black text-base md:text-xl text-foreground">{formatPrice(stats.payments)}</div>
                        </div>
                        <div className="border-l border-border/50 relative">
                            <div className="text-[9px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t('spent')}</div>
                            <div className="font-black text-base md:text-xl text-foreground">{formatPrice(stats.spent)}</div>
                        </div>
                        <div className="border-l border-border/50">
                            <div className="text-[9px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t('bonuses')}</div>
                            <div className="font-black text-base md:text-xl text-foreground">{formatPrice(stats.bonuses)}</div>
                        </div>
                    </div>

                    <Button 
                        className="w-full font-bold h-10 md:h-11 rounded-xl text-sm md:text-base shadow-sm"
                        size="lg"
                        asChild
                    >
                        <Link href="/wallet/top-up">
                            {t('top_up_btn')}
                        </Link>
                    </Button>

                    {/* Content Area */}
                    <div className="mt-6 md:mt-8 min-h-[200px]">
                        <h3 className="font-bold text-foreground mb-3 text-sm md:text-base">{t('recent_transactions')}</h3>
                        {!transactions ? (
                             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground w-6 h-6" /></div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                                <span className="text-muted-foreground text-xs font-medium">{t('no_transactions')}</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {transactions.map((tx) => (
                                    <div key={tx._id} className="flex items-center justify-between p-3 md:p-4 bg-card border border-border/50 rounded-xl hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'TOPUP' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {tx.type === 'TOPUP' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-xs md:text-sm text-foreground truncate">{tx.description}</div>
                                                <div className="text-[10px] md:text-xs text-muted-foreground font-medium">{formatDistanceToNow(tx.createdAt, { addSuffix: true })}</div>
                                            </div>
                                        </div>
                                        <div className={`font-black text-sm md:text-base shrink-0 ml-2 ${tx.type === 'TOPUP' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
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
