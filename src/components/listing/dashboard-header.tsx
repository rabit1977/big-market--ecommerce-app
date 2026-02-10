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
    RefreshCw
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
      <div className="w-full h-28 md:h-36 bg-muted animate-pulse rounded-xl md:rounded-2xl mb-4 md:mb-6" />
  );

  const { user, stats } = dashboardData;
  const isCompany = user.accountType === 'COMPANY';
  const displayName = isCompany && user.companyName ? user.companyName : user.name;
  
  const renewalStats = {
      daily: stats.renewedToday || 0,
      weekly: 12,
      monthly: 45
  };

  return (
    <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
      {/* 1. Header Card: Identity & Wallet */}
      <div className="bg-card rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl -z-0 opacity-50 translate-x-10 -translate-y-10" />
          
          <div className="flex items-center gap-3 md:gap-4 relative z-10 w-full md:w-auto">
             <div className="relative">
                 <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-background shadow-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                     {user.image ? (
                         <img src={user.image} alt={displayName || 'User'} className="w-full h-full object-cover" />
                     ) : (
                         <span className="text-sm md:text-base font-bold text-muted-foreground">
                             {(displayName || 'U').slice(0, 2).toUpperCase()}
                         </span>
                     )}
                 </div>
                 {user.isVerified && (
                     <TooltipProvider>
                         <Tooltip>
                             <TooltipTrigger asChild>
                                 <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white p-0.5 rounded-full border-2 border-background shadow-sm cursor-help">
                                     <CheckCircle2 className="w-2.5 h-2.5" />
                                 </div>
                             </TooltipTrigger>
                             <TooltipContent>Verified Account</TooltipContent>
                         </Tooltip>
                     </TooltipProvider>
                 )}
             </div>
             <div className="min-w-0">
                 <h1 className="text-sm md:text-lg font-black text-foreground flex items-center gap-1.5 truncate">
                     {displayName}
                     {user.membershipStatus === 'ACTIVE' && (
                         <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[8px] md:text-[9px] font-bold uppercase tracking-wider border border-amber-500/20 flex items-center gap-0.5 shrink-0">
                             <Crown className="w-2.5 h-2.5" />
                             {user.membershipTier}
                         </span>
                     )}
                 </h1>
                 <p className="text-muted-foreground text-[10px] md:text-xs font-medium">
                     {isCompany ? 'Verified Business Account' : 'Personal Account'}
                 </p>
                 
                 {user.membershipExpiresAt && (
                     <div className="flex items-center gap-1.5 mt-1 text-[9px] md:text-[10px] text-muted-foreground">
                         <Activity className="w-2.5 h-2.5 text-emerald-500" />
                         <span>Active until {format(new Date(user.membershipExpiresAt), 'MMM dd, yyyy')}</span>
                     </div>
                 )}
             </div>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto bg-muted/50 p-2.5 md:p-3 rounded-lg md:rounded-xl border border-border/50">
              <div className="text-right flex-1 md:flex-none">
                  <div className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Balance</div>
                  <div className="text-base md:text-lg font-black text-foreground">{user.credits.toFixed(2)} <span className="text-[10px] md:text-xs font-bold text-muted-foreground">MKD</span></div>
              </div>
              <Button asChild size="sm" className="rounded-lg font-bold shadow-sm bg-primary hover:bg-primary/90 h-8 md:h-9 text-xs px-3">
                  <Link href="/wallet/top-up">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add
                  </Link>
              </Button>
          </div>
      </div>

      {/* 2. Scrollable Stats Section */}
      <div className="flex overflow-x-auto pb-2 gap-2 md:gap-3 snap-x md:grid md:grid-cols-4 md:overflow-visible md:pb-0 -mx-3 px-3 md:mx-0 md:px-0 scrollbar-none">
          {/* Money Spent Today */}
          <Card className="min-w-[180px] md:min-w-0 snap-center border-border shadow-sm hover:shadow-md transition-all bg-card">
              <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                          <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      <span className="text-[8px] md:text-[9px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Today</span>
                  </div>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Spent</p>
                  <h3 className="text-base md:text-lg font-black text-foreground">{stats.spendToday.toFixed(2)} <span className="text-[9px] font-bold text-muted-foreground">MKD</span></h3>
              </CardContent>
          </Card>

          {/* Renewal Stats */}
          <Card className="min-w-[220px] md:min-w-0 snap-center border-border shadow-sm hover:shadow-md transition-all md:col-span-2 bg-card">
              <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      <div>
                          <h3 className="font-bold text-foreground text-xs md:text-sm">Renewals</h3>
                          <p className="text-[8px] md:text-[9px] text-muted-foreground font-medium">Recently renewed</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-3 border-t border-border/50 pt-2">
                      <div>
                          <p className="text-[8px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Daily</p>
                          <p className="text-sm md:text-base font-black text-foreground">{renewalStats.daily}</p>
                      </div>
                      <div className="border-l border-border/50 pl-2 md:pl-3">
                          <p className="text-[8px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Weekly</p>
                          <p className="text-sm md:text-base font-black text-foreground">{renewalStats.weekly}</p>
                      </div>
                      <div className="border-l border-border/50 pl-2 md:pl-3">
                          <p className="text-[8px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Monthly</p>
                          <p className="text-sm md:text-base font-black text-foreground">{renewalStats.monthly}</p>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Advertising Stats */}
          <Card className="min-w-[180px] md:min-w-0 snap-center border-border shadow-sm hover:shadow-md transition-all bg-card">
              <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Megaphone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      <Link href="/my-listings/stats" className="text-[8px] md:text-[9px] font-bold text-primary hover:underline flex items-center uppercase tracking-wider">
                          Details <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                      </Link>
                  </div>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Total Views</p>
                  <h3 className="text-base md:text-lg font-black text-foreground">{stats.totalViews.toLocaleString()}</h3>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
