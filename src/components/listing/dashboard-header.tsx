'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { useQuery } from 'convex/react';
import { format } from 'date-fns';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Crown,
    DollarSign,
    Megaphone,
    Plus,
    RefreshCw,
    TrendingUp
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '../../../convex/_generated/api';

interface MyListingsDashboardProps {
  children?: React.ReactNode;
}

export function MyListingsDashboardHeader() {
  const { data: session } = useSession();
  const dashboardData = useQuery(api.users.getMyDashboardStats, { 
      externalId: session?.user?.id || '' 
  });

  if (!dashboardData) return (
      <div className="w-full h-48 bg-gray-100 animate-pulse rounded-3xl mb-8" />
  );

  const { user, stats } = dashboardData;
  const isCompany = user.accountType === 'COMPANY';
  const displayName = isCompany && user.companyName ? user.companyName : user.name;
  
  // Mock data for Renewal Stats until we have real logs
  const renewalStats = {
      daily: stats.renewedToday || 0,
      weekly: 12, // Mock
      monthly: 45 // Mock
  };

  return (
    <div className="space-y-6 mb-10">
      {/* 1. Header Card: Identity & Wallet */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -z-0 opacity-50 translate-x-12 -translate-y-12" />
          
          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
             <div className="relative">
                 <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 flex items-center justify-center">
                     {user.image ? (
                         <img src={user.image} alt={displayName || 'User'} className="w-full h-full object-cover" />
                     ) : (
                         <span className="text-2xl font-bold text-slate-400">
                             {(displayName || 'U').slice(0, 2).toUpperCase()}
                         </span>
                     )}
                 </div>
                 {user.isVerified && (
                     <TooltipProvider>
                         <Tooltip>
                             <TooltipTrigger asChild>
                                 <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm cursor-help">
                                     <CheckCircle2 className="w-4 h-4" />
                                 </div>
                             </TooltipTrigger>
                             <TooltipContent>Verified Account</TooltipContent>
                         </Tooltip>
                     </TooltipProvider>
                 )}
             </div>
             <div>
                 <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                     {displayName}
                     {user.membershipStatus === 'ACTIVE' && (
                         <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200 flex items-center gap-1">
                             <Crown className="w-3 h-3" />
                             {user.membershipTier}
                         </span>
                     )}
                 </h1>
                 <p className="text-muted-foreground text-sm font-medium">
                     {isCompany ? 'Verified Business Account' : 'Personal Account'}
                 </p>
                 
                 {user.membershipExpiresAt && (
                     <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                         <Activity className="w-3 h-3 text-emerald-500" />
                         <span>Subscription active until {format(new Date(user.membershipExpiresAt), 'MMM dd, yyyy')}</span>
                     </div>
                 )}
             </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-right flex-1 md:flex-none">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Your Balance</div>
                  <div className="text-2xl font-black text-slate-900">{user.credits.toFixed(2)} MKD</div>
              </div>
              <Button asChild size="lg" className="rounded-xl font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">
                  <Link href="/wallet/top-up">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Money
                  </Link>
              </Button>
          </div>
      </div>

      {/* 2. Scrollable Stats Section */}
      <div className="flex overflow-x-auto pb-4 gap-4 snap-x md:grid md:grid-cols-4 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          {/* Money Spent Today */}
          <Card className="min-w-[260px] snap-center md:min-w-0 border-slate-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-white to-slate-50/50">
              <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                          <DollarSign className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full">Today</span>
                  </div>
                  <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Spent Today</p>
                      <h3 className="text-2xl font-black text-slate-900">{stats.spendToday.toFixed(2)} <span className="text-sm font-bold text-slate-400">MKD</span></h3>
                  </div>
              </CardContent>
          </Card>

          {/* Renewal Stats */}
          <Card className="min-w-[300px] snap-center md:min-w-0 border-slate-200 shadow-sm hover:shadow-md transition-all md:col-span-2 bg-white">
              <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <RefreshCw className="w-5 h-5" />
                      </div>
                      <div>
                          <h3 className="font-bold text-slate-900">Renewal Activity</h3>
                          <p className="text-xs text-muted-foreground">Listings renewed recently</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t pt-4">
                      <div>
                          <p className="text-xs text-muted-foreground mb-1">Daily</p>
                          <p className="text-xl font-black text-slate-900">{renewalStats.daily}</p>
                      </div>
                      <div className="border-l pl-4">
                          <p className="text-xs text-muted-foreground mb-1">Weekly</p>
                          <p className="text-xl font-black text-slate-900">{renewalStats.weekly}</p>
                      </div>
                      <div className="border-l pl-4">
                          <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                          <p className="text-xl font-black text-slate-900">{renewalStats.monthly}</p>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Advertising Stats */}
          <Card className="min-w-[260px] snap-center md:min-w-0 border-slate-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <Megaphone className="w-5 h-5" />
                      </div>
                      <Link href="/my-listings/stats" className="text-xs font-bold text-blue-600 hover:underline flex items-center">
                          Details <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                  </div>
                  <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                      <h3 className="text-2xl font-black text-slate-900">{stats.totalViews.toLocaleString()}</h3>
                      <p className="text-xs text-emerald-600 font-bold flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          + Active Promos: {stats.promotedCount}
                      </p>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
