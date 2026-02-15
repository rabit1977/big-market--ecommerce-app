'use client';

import { DashboardCard } from '@/components/admin/dashboard-card';
import { PromotionIcon } from '@/components/listing/promotion-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { cn, formatCurrency } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  Eye,
  Layers,
  Package,
  Sparkles,
  Star,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../convex/_generated/api';

export function DashboardSkeleton() {
  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='space-y-2'>
        <Skeleton className='h-10 w-56 skeleton-enhanced' />
        <Skeleton className='h-5 w-80 skeleton-enhanced' />
      </div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className='h-32 w-full rounded-2xl skeleton-enhanced' />
          </div>
        ))}
      </div>
      
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Skeleton className='h-96 rounded-2xl skeleton-enhanced' />
        <Skeleton className='h-96 rounded-2xl skeleton-enhanced' />
      </div>
    </div>
  );
}

function calculateTrend(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? { value: 100, isPositive: true } : { value: 0, isPositive: true };
  }
  const percentChange = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(percentChange)),
    isPositive: percentChange >= 0,
  };
}

export default function DashboardClient() {
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Fetch real-time data
  const listingsData = useQuery(api.listings.list, { status: "ALL" });
  const usersData = useQuery(api.users.list, {});
  
  const isLoading = listingsData === undefined || usersData === undefined;

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100); 
    setCurrentTime(new Date());
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    if (!listingsData || !usersData) return null;

    const listings = listingsData.map(l => ({
        ...l,
        id: l._id,
        createdAt: new Date(l._creationTime)
    }));

    const users = usersData.map(u => ({
        ...u,
        id: u._id,
        createdAt: new Date(u._creationTime)
    }));

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentListings = listings.filter(l => l.createdAt >= thirtyDaysAgo);
    const previousListings = listings.filter(l => {
        return l.createdAt >= sixtyDaysAgo && l.createdAt < thirtyDaysAgo;
    });

    const recentUsers = users.filter(u => u.createdAt >= thirtyDaysAgo);
    const previousUsers = users.filter(u => {
        return u.createdAt >= sixtyDaysAgo && u.createdAt < thirtyDaysAgo;
    });

    const activeListings = listings.filter(l => l.status === 'ACTIVE').length;

    const listingTrend = calculateTrend(recentListings.length, previousListings.length);
    const userTrend = calculateTrend(recentUsers.length, previousUsers.length);

    return {
        totalListings: listings.length,
        activeListings,
        totalUsers: users.length,
        recentListingsCount: recentListings.length,
        listingTrend,
        userTrend,
        recentListingsData: recentListings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)
    };
  }, [listingsData, usersData]);

  const greeting = currentTime 
    ? currentTime.getHours() < 12 
      ? 'Good morning' 
      : currentTime.getHours() < 18 
        ? 'Good afternoon' 
        : 'Good evening'
    : 'Welcome';

  if (!isReady || isLoading || !stats) return <DashboardSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className='space-y-8 pb-20'
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
      >
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <h1 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight'>
              {greeting}! <Sparkles className='inline h-5 w-5 text-amber-500' />
            </h1>
          </div>
          <p className='text-muted-foreground text-xs sm:text-sm'>
            Here&apos;s what&apos;s happening with your classifieds platform
          </p>
        </div>
        <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
          <Calendar className='h-4 w-4' />
          <span>{currentTime?.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </motion.div>

      {/* Quick Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/15 p-6 border border-primary/10'
      >
        <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
        <div className='relative flex flex-wrap gap-6 sm:gap-12 justify-between'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground font-medium'>New Listings (30d)</p>
            <p className='text-xl sm:text-2xl md:text-3xl font-bold'>{stats.recentListingsCount}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground font-medium'>Active Listings</p>
            <p className='text-xl sm:text-2xl md:text-3xl font-bold'>{stats.activeListings}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground font-medium'>Users</p>
            <p className='text-xl sm:text-2xl md:text-3xl font-bold'>{stats.totalUsers}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='grid xs:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-6'
      >
        {([
          {
            title: 'Total Listings',
            value: stats.totalListings,
            icon: Package,
            description: 'All listings posted',
            trend: stats.listingTrend,
            color: 'blue' as const,
            href: '/admin/listings',
          },
          {
            title: 'Users',
            value: stats.totalUsers,
            icon: Users,
            description: 'Registered accounts',
            trend: stats.userTrend,
            color: 'violet' as const, 
            href: '/admin/users',
          },
          {
            title: 'Promoted',
            value: listingsData?.filter(l => (l as any).isPromoted).length || 0,
            icon: Sparkles,
            description: 'Active promotions',
            color: 'emerald' as const,
            href: '/admin/listings?promoted=true',
          },
          {
            title: 'Activity',
            value: 'View',
            icon: Activity,
            description: 'Audit logs',
            color: 'amber' as const,
            href: '/admin/activity',
          },
        ]).map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Link href={card.href} className='block'>
              <DashboardCard {...card} />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Listings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='grid grid-cols-1 xl:grid-cols-2 gap-6'
      >
        <Card className='card-premium'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold'>Recent Listings</CardTitle>
              <Link 
                href='/admin/listings' 
                className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-1'>
              <AnimatePresence mode='popLayout'>
                {stats.recentListingsData.map((listing, index) => {
                  const isPromoted = (listing as any).isPromoted;
                  const promoConfig = isPromoted ? getPromotionConfig((listing as any).promotionTier) : null;
                  
                  return (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className='flex items-center justify-between py-3 px-4 -mx-4 rounded-xl hover:bg-muted/50 transition-colors group'
                    >
                      <div className='flex items-center gap-3 flex-1 min-w-0'>
                        <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                            promoConfig ? promoConfig.badgeColor : 'bg-primary/10'
                        )}>
                            {promoConfig ? (
                                <PromotionIcon iconName={promoConfig.icon} className="h-4 w-4 text-white fill-current" />
                            ) : (
                                <Package className='h-4 w-4 text-primary' />
                            )}
                        </div>
                        <div className='flex-1 min-w-0'>
                            <Link href={`/admin/listings/${listing.id}`} className='font-bold text-sm truncate group-hover:text-primary transition-colors block'>
                                {listing.title}
                            </Link>
                            <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5'>
                                {listing.category}
                                {isPromoted && (
                                    <span className="text-[9px] text-primary/80 font-black flex items-center gap-0.5">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        PROMOTED
                                    </span>
                                )}
                            </p>
                        </div>
                      </div>
                      
                      <div className='flex items-center gap-3 ml-4'>
                          <div className='text-right hidden sm:block'>
                              <Badge 
                                  variant="outline"
                                  className={cn(
                                      "text-[10px] uppercase tracking-tighter",
                                      listing.status === 'ACTIVE' && "bg-emerald-500/10 text-emerald-600 border-emerald-500/10",
                                      listing.status === 'PENDING_APPROVAL' && "bg-amber-500/10 text-amber-600 border-amber-500/10"
                                  )}
                              >
                                  {listing.status === 'PENDING_APPROVAL' ? 'Pending' : listing.status}
                              </Badge>
                              <p className='text-xs font-black mt-0.5'>{formatCurrency(listing.price, (listing as any).currency)}</p>
                          </div>

                          {/* Quick Action Mini-Menu */}
                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                              <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                                  asChild
                              >
                                  <Link href={`/listings/${listing.id}`} target="_blank">
                                      <Eye className="h-4 w-4" />
                                  </Link>
                              </Button>
                          </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {stats.recentListingsData.length === 0 && (
                <div className='text-center py-12'>
                  <p className='text-sm text-muted-foreground'>No listings yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className='grid grid-cols-2 sm:grid-cols-4 gap-4'
      >
        {[
          { label: 'Add Listing', href: '/admin/listings/new', icon: Package, color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' },
          { label: 'Manage Users', href: '/admin/users', icon: Users, color: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' },
          { label: 'Categories', href: '/admin/categories', icon: Layers, color: 'bg-primary/10 text-primary' },
          { label: 'Reviews', href: '/admin/reviews', icon: Star, color: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' },
        ].map((action, _index) => (
          <Link
            key={action.label}
            href={action.href}
            className='group stat-card flex flex-col items-center justify-center py-6 gap-3 hover:border-primary/30'
          >
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className='h-5 w-5' />
            </div>
            <span className='text-sm font-medium group-hover:text-primary transition-colors'>
              {action.label}
            </span>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}
