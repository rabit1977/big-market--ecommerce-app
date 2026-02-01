'use client';

import { DashboardCard } from '@/components/admin/dashboard-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    Calendar,
    Layers,
    Package,
    Sparkles,
    Star,
    Tag,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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

type DashboardUser = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date; // Keep as Date if passed as Date, or string if serialized. Usually Date in client comp if not serialized? 
                   // Wait, server keys are Dates, but crossing boundary makes them strings if not carefully handled.
                   // Next.js passes dates as Dates only in SC -> Client if using specific tricks or they are strings.
                   // Assuming strings or Dates. Let's assume passed as serialized JSON or Dates.
                   // If passing from Page (SC) to Client, they must be serializable. Dates convert to strings in JSON.
                   // I should treat them as strings or parse them.
};

type DashboardListing = {
  id: string;
  title: string;
  category: string;
  status: string; // ACTIVE, SOLD
  price: number;
  createdAt: Date | string;
};

type DashboardContentProps = {
  listings: DashboardListing[];
  users: DashboardUser[];
};

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

export default function DashboardClient({
  listings,
  users,
}: DashboardContentProps) {
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50); 
    setCurrentTime(new Date());
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const parseDate = (d: Date | string) => new Date(d);

    const recentListings = listings.filter(l => parseDate(l.createdAt) >= thirtyDaysAgo);
    const previousListings = listings.filter(l => {
        const d = parseDate(l.createdAt);
        return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    });

    const recentUsers = users.filter(u => parseDate(u.createdAt) >= thirtyDaysAgo);
    const previousUsers = users.filter(u => {
        const d = parseDate(u.createdAt);
        return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    });

    const activeListings = listings.filter(l => l.status === 'ACTIVE').length;
    const soldListings = listings.filter(l => l.status === 'SOLD').length;

    const listingTrend = calculateTrend(recentListings.length, previousListings.length);
    const userTrend = calculateTrend(recentUsers.length, previousUsers.length);

    return {
        totalListings: listings.length,
        activeListings,
        soldListings,
        totalUsers: users.length,
        recentListingsCount: recentListings.length,
        listingTrend,
        userTrend,
        recentListingsData: recentListings.slice(0, 5)
    };
  }, [listings, users]);

  if (!isReady) return <DashboardSkeleton />;

  const greeting = currentTime 
    ? currentTime.getHours() < 12 
      ? 'Good morning' 
      : currentTime.getHours() < 18 
        ? 'Good afternoon' 
        : 'Good evening'
    : 'Welcome';

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
            title: 'Sold Items',
            value: stats.soldListings,
            icon: Tag,
            description: 'Completed deals',
            // trend: {}, 
            color: 'emerald' as const,
            href: '/admin/listings?status=SOLD',
          },
          {
            title: 'Activity',
            value: 'View',
            icon: Activity,
            description: 'Audit logs',
            // trend: {},
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
                {stats.recentListingsData.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className='flex items-center justify-between py-3 px-4 -mx-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group'
                  >
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                        <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                            <Package className='h-4 w-4 text-primary' />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='font-medium text-sm truncate group-hover:text-primary transition-colors'>
                                {listing.title}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                                {listing.category}
                            </p>
                        </div>
                    </div>
                    <div className='text-right ml-4'>
                        <Badge variant='outline'>{listing.status}</Badge>
                        <p className='text-xs font-bold mt-1'>${listing.price}</p>
                    </div>
                  </motion.div>
                ))}
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
          { label: 'Categories', href: '/admin/categories', icon: Layers, color: 'bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400' },
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