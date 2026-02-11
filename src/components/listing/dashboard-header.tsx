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
      <div className="w-full h-32 md:h-40 bg-muted/50 animate-pulse rounded-[2rem] mb-6 md:mb-8" />
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
    <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
      {/* 1. Header Card: Identity & Wallet */}
      <div className="bg-card rounded-[2rem] p-4 md:p-6 shadow-xl shadow-foreground/5 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 relative overflow-hidden group hover:border-primary/20 transition-all">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl -z-0 opacity-50 translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="flex items-center gap-4 md:gap-5 relative z-10 w-full md:w-auto">
             <div className="relative">
                 <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl border-4 border-background shadow-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                     {user.image ? (
                         <img src={user.image} alt={displayName || 'User'} className="w-full h-full object-cover" />
                     ) : (
                         <span className="text-sm md:text-lg font-black text-muted-foreground">
                             {(displayName || 'U').slice(0, 2).toUpperCase()}
                         </span>
                     )}
                 </div>
                 {user.isVerified && (
                     <TooltipProvider>
                         <Tooltip>
                             <TooltipTrigger asChild>
                                 <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-4 border-background shadow-sm cursor-help">
                                     <CheckCircle2 className="w-3 h-3" />
                                 </div>
                             </TooltipTrigger>
                             <TooltipContent>Verified Account</TooltipContent>
                         </Tooltip>
                     </TooltipProvider>
                 )}
             </div>
             <div className="min-w-0">
                 <h1 className="text-lg md:text-xl font-black text-foreground flex items-center gap-2 truncate uppercase tracking-tight leading-none mb-1">
                     {displayName}
                     {user.membershipStatus === 'ACTIVE' && (
                         <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] md:text-[10px] font-black uppercase tracking-wider border border-amber-500/20 flex items-center gap-1 shrink-0">
                             <Crown className="w-3 h-3 icon-glow-amber" />
                             {user.membershipTier}
                         </span>
                     )}
                 </h1>
                 <p className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-wide">
                     {isCompany ? 'Verified Business Account' : 'Personal Account'}
                 </p>
                 
                 {user.membershipExpiresAt && (
                     <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-500 font-bold uppercase tracking-wider bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full">
                         <Activity className="w-3 h-3" />
                         <span>Active until {format(new Date(user.membershipExpiresAt), 'MMM dd, yyyy')}</span>
                     </div>
                 )}
             </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto bg-muted/50 p-3 md:p-4 rounded-3xl border border-border/50 hover:bg-muted transition-colors">
              <div className="text-right flex-1 md:flex-none">
                  <div className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Balance</div>
                  <div className="text-lg md:text-2xl font-black text-foreground leading-none">{user.credits.toFixed(2)} <span className="text-[10px] md:text-xs font-bold text-muted-foreground ml-0.5">MKD</span></div>
              </div>
              <Button asChild size="sm" className="rounded-2xl font-black shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-10 md:h-11 text-xs px-5 md:px-6 uppercase tracking-wider transition-all hover:scale-105">
                  <Link href="/wallet/top-up">
                      <Plus className="w-4 h-4 mr-1.5 stroke-[3]" />
                      Top Up
                  </Link>
              </Button>
          </div>
      </div>

      {/* 2. Scrollable Stats Section */}
      <div className="flex overflow-x-auto pb-4 gap-3 md:gap-4 snap-x md:grid md:grid-cols-4 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          {/* Money Spent Today */}
          <Card className="min-w-[200px] md:min-w-0 snap-center rounded-[1.5rem] border-border shadow-sm hover:shadow-md hover:border-rose-500/30 transition-all bg-card group cursor-default">
              <CardContent className="p-4 md:p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                          <DollarSign className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">Today</span>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Spent</p>
                      <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight group-hover:text-rose-500 transition-colors">{stats.spendToday.toFixed(2)} <span className="text-[10px] font-bold text-muted-foreground">MKD</span></h3>
                  </div>
              </CardContent>
          </Card>

          {/* Renewal Stats */}
          <Card className="min-w-[280px] md:min-w-0 snap-center rounded-[1.5rem] border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all md:col-span-2 bg-card group cursor-default">
              <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <RefreshCw className="w-5 h-5" />
                      </div>
                      <div>
                          <h3 className="font-black text-foreground text-sm uppercase tracking-tight">Renewals</h3>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Recent Activity</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-3">
                      <div>
                          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">Daily</p>
                          <p className="text-lg md:text-xl font-black text-foreground group-hover:text-primary transition-colors">{renewalStats.daily}</p>
                      </div>
                      <div className="border-l-2 border-border/50 pl-4">
                          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">Weekly</p>
                          <p className="text-lg md:text-xl font-black text-foreground">{renewalStats.weekly}</p>
                      </div>
                      <div className="border-l-2 border-border/50 pl-4">
                          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">Monthly</p>
                          <p className="text-lg md:text-xl font-black text-foreground">{renewalStats.monthly}</p>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Advertising Stats */}
          <Card className="min-w-[200px] md:min-w-0 snap-center rounded-[1.5rem] border-border shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all bg-card group cursor-default">
              <CardContent className="p-4 md:p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <Megaphone className="w-5 h-5" />
                      </div>
                      <Link href="/my-listings/stats" className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-foreground hover:bg-primary hover:text-white transition-colors">
                          <ArrowRight className="w-4 h-4" />
                      </Link>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Views</p>
                    <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight group-hover:text-amber-500 transition-colors">{stats.totalViews.toLocaleString()}</h3>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
