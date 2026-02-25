'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowDownLeft,
    ArrowUpRight,
    BadgeCheck,
    BarChart3,
    Bell,
    Bookmark,
    CalendarClock,
    Clock,
    CreditCard,
    Crown,
    Eye,
    Heart,
    History,
    ListChecks,
    MessageCircleQuestion,
    Package,
    Plus,
    RefreshCw,
    Search,
    Shield,
    Sparkles,
    Star,
    TrendingUp,
    User,
    Wallet
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../../convex/_generated/api';

interface UserDashboardClientProps {
    userId: string;
}

type SpendingPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'allTime';

const SPENDING_LABELS: Record<SpendingPeriod, string> = {
    daily: 'Today',
    weekly: 'This Week',
    monthly: 'This Month',
    yearly: 'This Year',
    allTime: 'All Time',
};

export function UserDashboardClient({ userId }: UserDashboardClientProps) {
    const { data: session } = useSession();
    const stats = useQuery(api.users.getUserDashboardStats, { externalId: userId });
    const [spendingPeriod, setSpendingPeriod] = useState<SpendingPeriod>('monthly');

    if (!stats) {
        return <DashboardSkeleton />;
    }

    const spendingAmount = stats.spending[spendingPeriod];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header */}
            <div className="bg-muted/30 border-b">
                <div className="container-wide max-w-7xl py-6 sm:py-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-lg shadow-primary/20 shrink-0">
                                {stats.profile.name?.slice(0, 2).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                        {stats.profile.name || 'User'}
                                    </h1>
                                    {stats.verification.isVerified && (
                                        <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-primary/30 text-primary">
                                        {stats.verification.membershipTier}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider",
                                            stats.verification.accountStatus === 'ACTIVE' ? 'border-emerald-500/30 text-emerald-600' : 'border-amber-500/30 text-amber-600'
                                        )}
                                    >
                                        {stats.verification.accountStatus}
                                    </Badge>
                                    {stats.profile.city && (
                                        <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                                            📍 {stats.profile.city}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/sell">
                                <Button className="gap-2 rounded-xl font-bold shadow-sm">
                                    <Plus className="w-4 h-4" />
                                    New Listing
                                </Button>
                            </Link>
                            <Link href="/account/edit">
                                <Button variant="outline" className="gap-2 rounded-xl font-bold">
                                    <User className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-wide max-w-7xl py-6 sm:py-10 space-y-6 sm:space-y-8">
                {/* ═══════════════════════ TOP STATS GRID ═══════════════════════ */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    <StatCard icon={Package} label="Total Listings" value={stats.listings.total} color="blue" />
                    <StatCard icon={ListChecks} label="Active" value={stats.listings.active} color="green" />
                    <StatCard icon={Eye} label="Total Views" value={(stats?.listings?.totalViews ?? 0).toLocaleString()} color="purple" />
                    <StatCard icon={Sparkles} label="Promoted" value={stats.listings.promoted} color="amber" />
                    <StatCard icon={Heart} label="Favorites" value={stats.social.favoritesCount} color="rose" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    <StatCard icon={Bookmark} label="Saved Searches" value={stats.savedSearches.count} color="blue" />
                    <StatCard icon={History} label="Recently Viewed" value={stats.recentlyViewed.totalViewed} color="purple" />
                    <StatCard
                        icon={Bell}
                        label="Notifications"
                        value={stats.notifications.total}
                        color="amber"
                        badge={stats.notifications.unread > 0 ? stats.notifications.unread : undefined}
                    />
                    <StatCard icon={Star} label="Reviews Written" value={stats.activity.reviewsWritten} color="green" />
                </div>

                {/* ═══════════════════════ MAIN CONTENT ═══════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* ─── Spending Overview ─── */}
                        <Card className="p-5 sm:p-6 rounded-2xl border-border/50">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <Wallet className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h2 className="font-black text-lg tracking-tight">Money Spent</h2>
                                </div>
                                <Tabs value={spendingPeriod} onValueChange={(v) => setSpendingPeriod(v as SpendingPeriod)}>
                                    <TabsList className="h-8 bg-muted/50 rounded-lg p-0.5">
                                        {(['daily', 'weekly', 'monthly', 'yearly', 'allTime'] as SpendingPeriod[]).map((p) => (
                                            <TabsTrigger key={p} value={p} className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 h-7 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                                {SPENDING_LABELS[p]}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-muted/30 rounded-2xl p-4 text-center border border-border/30">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        {SPENDING_LABELS[spendingPeriod]}
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-black text-foreground">
                                        {formatPrice(spendingAmount)}
                                    </p>
                                </div>
                                <div className="bg-muted/30 rounded-2xl p-4 text-center border border-border/30">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Promotions (Monthly)</p>
                                    <p className="text-2xl sm:text-3xl font-black text-primary">
                                        {formatPrice(stats.spending.promotionMonthly)}
                                    </p>
                                </div>
                                <div className="bg-muted/30 rounded-2xl p-4 text-center border border-border/30">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Promotions (All Time)</p>
                                    <p className="text-2xl sm:text-3xl font-black text-amber-600">
                                        {formatPrice(stats.spending.promotionAllTime)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* ─── Renewals & Listings Quota ─── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Renewal Stats */}
                            <Card className="p-5 rounded-2xl border-border/50">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <RefreshCw className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-sm">Renewals</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-bold text-muted-foreground">Monthly Usage</span>
                                            <span className="font-black">{stats.renewals.usedThisMonth} / {stats.renewals.limitMonthly}</span>
                                        </div>
                                        <Progress value={(stats.renewals.usedThisMonth / stats.renewals.limitMonthly) * 100} className="h-2" />
                                    </div>
                                    <div className="flex items-center justify-between bg-muted/30 rounded-xl p-3 border border-border/30">
                                        <span className="text-xs font-bold text-muted-foreground">24h Cooldown</span>
                                        {stats.renewals.canRenewNow ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">Ready</Badge>
                                        ) : (
                                            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">
                                                <Clock className="w-3 h-3 mr-1" /> {stats.renewals.hoursUntilRenew}h left
                                            </Badge>
                                        )}
                                    </div>
                                    {stats.renewals.lastRenewalAt && (
                                        <p className="text-[10px] text-muted-foreground font-medium px-1">
                                            Last renewed: {formatDistanceToNow(stats.renewals.lastRenewalAt, { addSuffix: true })}
                                        </p>
                                    )}
                                </div>
                            </Card>

                            {/* Listing Quota */}
                            <Card className="p-5 rounded-2xl border-border/50">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <h3 className="font-bold text-sm">Listing Quota</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-bold text-muted-foreground">Total Posted</span>
                                            <span className="font-black">{stats.listings.posted} / {stats.listings.limit}</span>
                                        </div>
                                        <Progress value={(stats.listings.posted / stats.listings.limit) * 100} className="h-2" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-muted/30 rounded-xl p-3 text-center border border-border/30">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Active</p>
                                            <p className="text-lg font-black text-emerald-600">{stats.listings.active}</p>
                                        </div>
                                        <div className="bg-muted/30 rounded-xl p-3 text-center border border-border/30">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Pending</p>
                                            <p className="text-lg font-black text-amber-600">{stats.listings.pending}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* ─── Active Promotions ─── */}
                        {stats.listings.promotedDetails.length > 0 && (
                            <Card className="p-5 sm:p-6 rounded-2xl border-border/50">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <h2 className="font-black text-lg tracking-tight">Active Promotions</h2>
                                    <Badge variant="outline" className="ml-auto text-[10px] font-bold">{stats.listings.promotedDetails.length} active</Badge>
                                </div>
                                <div className="space-y-2">
                                    {stats.listings.promotedDetails.map((promo) => {
                                        const config = getPromotionConfig(promo.promotionTier);
                                        return (
                                            <div key={promo._id} className="flex items-center justify-between bg-muted/30 rounded-xl p-3 border border-border/30 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config?.bgColor || 'bg-primary/10')}>
                                                        <Crown className={cn("w-4 h-4", config?.color || 'text-primary')} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm truncate">{promo.title}</p>
                                                        <p className="text-[10px] text-muted-foreground font-medium">
                                                            {config?.title || promo.promotionTier}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className={cn("shrink-0 text-[10px] font-bold", config?.bgColor || 'bg-primary/10', config?.color || 'text-primary', 'border-0')}>
                                                    {promo.daysLeft} days left
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        )}

                        {/* ─── Recent Transactions ─── */}
                        <Card className="p-5 sm:p-6 rounded-2xl border-border/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h2 className="font-black text-lg tracking-tight">Recent Transactions</h2>
                                </div>
                                <Link href="/wallet">
                                    <Button variant="ghost" size="sm" className="text-xs font-bold">
                                        View All →
                                    </Button>
                                </Link>
                            </div>
                            {stats.recentTransactions.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-xl">
                                    <CreditCard className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground font-medium">No transactions yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {stats.recentTransactions.map((tx) => (
                                        <div key={tx._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/30 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", tx.type === 'TOPUP' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')}>
                                                    {tx.type === 'TOPUP' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-xs sm:text-sm truncate">{tx.description}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">
                                                        {formatDistanceToNow(tx.createdAt, { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={cn("font-black text-sm shrink-0 ml-2", tx.type === 'TOPUP' ? 'text-emerald-600' : 'text-foreground')}>
                                                {tx.type === 'TOPUP' ? '+' : ''}{formatPrice(Math.abs(tx.amount))}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* ─── Recently Viewed Listings ─── */}
                        <Card className="p-5 sm:p-6 rounded-2xl border-border/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <History className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h2 className="font-black text-lg tracking-tight">Recently Viewed</h2>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold">{stats.recentlyViewed.totalViewed} total</Badge>
                            </div>
                            {stats.recentlyViewed.items.length === 0 ? (
                                <div className="text-center py-6 border-2 border-dashed border-border/50 rounded-xl">
                                    <History className="w-7 h-7 text-muted-foreground/30 mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground font-medium">No browsing history yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {stats.recentlyViewed.items.map((item: any) => (
                                        <Link key={item._id} href={`/listings/${item.listingId}`}>
                                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors group">
                                                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                                                    {item.thumbnail ? (
                                                        <Image src={item.thumbnail} alt={item.title} fill className="object-cover" sizes="48px" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Eye className="w-4 h-4 text-muted-foreground/40" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-xs truncate group-hover:text-primary transition-colors">{item.title}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">
                                                        {formatDistanceToNow(item.viewedAt, { addSuffix: true })}
                                                    </p>
                                                </div>
                                                <span className="text-xs font-black shrink-0">{formatPrice(item.price)}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* ─── My Favorites ─── */}
                        <Card className="p-5 sm:p-6 rounded-2xl border-border/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-rose-600" />
                                    </div>
                                    <h2 className="font-black text-lg tracking-tight">My Favorites</h2>
                                </div>
                                <Link href="/favorites">
                                    <Button variant="ghost" size="sm" className="text-xs font-bold">View All →</Button>
                                </Link>
                            </div>
                            {stats.favoritesDetails.length === 0 ? (
                                <div className="text-center py-6 border-2 border-dashed border-border/50 rounded-xl">
                                    <Heart className="w-7 h-7 text-muted-foreground/30 mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground font-medium">No favorites yet</p>
                                    <Link href="/listings" className="mt-2 inline-block">
                                        <Button variant="outline" size="sm" className="text-xs rounded-xl">Browse Listings</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {stats.favoritesDetails.map((fav: any) => (
                                        <Link key={fav._id} href={`/listings/${fav.listingId}`}>
                                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors group">
                                                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                                                    {fav.thumbnail ? (
                                                        <Image src={fav.thumbnail} alt={fav.title} fill className="object-cover" sizes="48px" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Heart className="w-4 h-4 text-rose-400/40" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-xs truncate group-hover:text-primary transition-colors">{fav.title}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">{fav.city}</p>
                                                </div>
                                                <span className="text-xs font-black shrink-0">{formatPrice(fav.price)}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (1/3) — Sidebar */}
                    <div className="space-y-4">
                        {/* ─── Verification Status ─── */}
                        <Card className="p-5 rounded-2xl border-border/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-sm">Account & Verification</h3>
                            </div>
                            <div className="space-y-3">
                                <InfoRow label="Verification" value={
                                    stats.verification.isVerified ? (
                                        <Badge className="bg-blue-500 text-white text-[10px]"><BadgeCheck className="w-3 h-3 mr-1" />Verified</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">
                                            {stats.verification.verificationStatus === 'pending_approval' ? 'Pending Approval' : 'Unverified'}
                                        </Badge>
                                    )
                                } />
                                <InfoRow label="Membership" value={
                                    <Badge variant="outline" className={cn("text-[10px] font-bold", stats.verification.membershipStatus === 'ACTIVE' ? 'text-emerald-600 border-emerald-500/30' : 'text-muted-foreground')}>
                                        {stats.verification.membershipTier} • {stats.verification.membershipStatus}
                                    </Badge>
                                } />
                                {stats.verification.membershipExpiresAt && (
                                    <InfoRow label="Expires" value={
                                        <span className="text-xs font-bold">
                                            {new Date(stats.verification.membershipExpiresAt).toLocaleDateString()}
                                        </span>
                                    } />
                                )}
                                <InfoRow label="Account Type" value={
                                    <span className="text-xs font-bold capitalize">{stats.profile.accountType || 'Individual'}</span>
                                } />
                                {stats.profile.companyName && (
                                    <InfoRow label="Company" value={
                                        <span className="text-xs font-bold">{stats.profile.companyName}</span>
                                    } />
                                )}
                            </div>
                            {!stats.verification.isVerified && (
                                <Link href="/account/verification" className="block mt-4">
                                    <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold gap-2">
                                        <BadgeCheck className="w-3.5 h-3.5" />
                                        Get Verified
                                    </Button>
                                </Link>
                            )}
                        </Card>


                        {/* ─── Saved Searches ─── */}
                        <Card className="p-5 rounded-2xl border-border/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Bookmark className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-sm">Saved Searches</h3>
                                <Badge variant="outline" className="ml-auto text-[10px] font-bold">{stats.savedSearches.count}</Badge>
                            </div>
                            {stats.savedSearches.items.length === 0 ? (
                                <div className="text-center py-4 border-2 border-dashed border-border/50 rounded-xl">
                                    <Search className="w-5 h-5 text-muted-foreground/30 mx-auto mb-1" />
                                    <p className="text-[10px] text-muted-foreground font-medium">No saved searches</p>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {stats.savedSearches.items.slice(0, 5).map((s: any) => (
                                        <Link key={s._id} href={s.url}>
                                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                                    <span className="text-xs font-bold truncate group-hover:text-primary transition-colors">{s.name}</span>
                                                </div>
                                                {s.isEmailAlert && (
                                                    <Badge className="bg-blue-500/10 text-blue-600 border-0 text-[8px] px-1.5 shrink-0">Alert</Badge>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* ─── Notifications ─── */}
                        <Card className="p-5 rounded-2xl border-border/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                    <Bell className="w-4 h-4 text-amber-600" />
                                </div>
                                <h3 className="font-bold text-sm">Notifications</h3>
                                {stats.notifications.unread > 0 && (
                                    <Badge className="bg-destructive text-white text-[10px] ml-auto">{stats.notifications.unread} new</Badge>
                                )}
                            </div>
                            {stats.notifications.recent.length === 0 ? (
                                <div className="text-center py-4 border-2 border-dashed border-border/50 rounded-xl">
                                    <Bell className="w-5 h-5 text-muted-foreground/30 mx-auto mb-1" />
                                    <p className="text-[10px] text-muted-foreground font-medium">No notifications</p>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {stats.notifications.recent.map((n: any) => (
                                        <div key={n._id} className={cn("p-2.5 rounded-xl border transition-colors", n.isRead ? 'bg-muted/20 border-border/20' : 'bg-primary/5 border-primary/20')}>
                                            <div className="flex items-start gap-2">
                                                {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
                                                <div className="min-w-0">
                                                    <p className={cn("text-xs truncate", n.isRead ? 'font-medium' : 'font-bold')}>{n.title}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate">{n.message}</p>
                                                    <p className="text-[9px] text-muted-foreground/70 mt-0.5">
                                                        {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* ─── Activity Summary ─── */}
                        <Card className="p-5 rounded-2xl border-border/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <MessageCircleQuestion className="w-4 h-4 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-sm">Activity</h3>
                            </div>
                            <div className="space-y-3">
                                <InfoRow label="Reviews Written" value={<span className="text-xs font-black">{stats.activity.reviewsWritten}</span>} />
                                {stats.activity.reviewsWritten > 0 && (
                                    <InfoRow label="Avg. Rating Given" value={
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-black">{stats.activity.averageRatingGiven}</span>
                                        </div>
                                    } />
                                )}
                                <InfoRow label="Questions Asked" value={<span className="text-xs font-black">{stats.activity.questionsAsked}</span>} />
                            </div>
                        </Card>

                        {/* ─── Quick Actions ─── */}
                        <Card className="p-5 rounded-2xl border-border/50">
                            <h3 className="font-bold text-sm mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                <QuickAction href="/my-listings" icon={Package} label="My Listings" />
                                <QuickAction href="/favorites" icon={Heart} label="My Favorites" />
                                <QuickAction href="/wallet" icon={Wallet} label="Wallet" />
                                <QuickAction href="/premium" icon={Crown} label="Promotions" />
                                <QuickAction href="/my-listings/stats" icon={TrendingUp} label="Listing Stats" />
                                <QuickAction href="/account/edit" icon={User} label="Edit Profile" />
                            </div>
                        </Card>

                        {/* ─── Member Since ─── */}
                        <Card className="p-5 rounded-2xl border-border/50 bg-muted/20">
                            <div className="flex items-center gap-3">
                                <CalendarClock className="w-5 h-5 text-muted-foreground/50" />
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Member Since</p>
                                    <p className="text-sm font-bold">
                                        {stats?.profile?.createdAt
                                            ? new Date(stats.profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                            : 'Recently joined'
                                        }
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════

function StatCard({ icon: Icon, label, value, color, badge }: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
    badge?: number;
}) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-500/10 text-blue-600',
        green: 'bg-emerald-500/10 text-emerald-600',
        purple: 'bg-purple-500/10 text-purple-600',
        amber: 'bg-amber-500/10 text-amber-600',
        rose: 'bg-rose-500/10 text-rose-600',
        orange: 'bg-orange-500/10 text-orange-600',
    };
    return (
        <Card className="p-4 rounded-2xl border-border/50 hover:shadow-md transition-shadow relative">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", colors[color])}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black mb-0.5">{value}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
            {badge !== undefined && badge > 0 && (
                <Badge className="absolute top-3 right-3 bg-destructive text-white text-[10px] h-5 px-1.5">{badge}</Badge>
            )}
        </Card>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
            {value}
        </div>
    );
}

function QuickAction({ href, icon: Icon, label, badge }: { href: string; icon: any; label: string; badge?: number }) {
    return (
        <Link href={href}>
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold group-hover:text-primary transition-colors">{label}</span>
                </div>
                {badge !== undefined && badge > 0 && (
                    <Badge className="bg-destructive text-white text-[10px] h-5 px-1.5">{badge}</Badge>
                )}
            </div>
        </Link>
    );
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="bg-muted/30 border-b">
                <div className="container-wide max-w-7xl py-6 sm:py-10">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-wide max-w-7xl py-8 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-52 rounded-2xl" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-44 rounded-2xl" />
                            <Skeleton className="h-44 rounded-2xl" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-56 rounded-2xl" />
                        <Skeleton className="h-40 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
