'use client';

import { Badge } from '@/components/ui/badge';
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
      <div className="w-full h-32 md:h-40 bg-muted/50 animate-pulse rounded-lg mb-6 md:mb-8" />
  );

  const { user, stats } = dashboardData;
  const isCompany = user.accountType === 'COMPANY';
  const displayName = isCompany && user.companyName ? user.companyName : user.name;
  
  // Quota Limits (User specific or defaults)
  const renewalsLimit = 15; 
  const renewalsUsed = user.monthlyRenewalsUsed || 0;
  const listingsLimit = user.listingLimit || 50;
  const listingsUsed = user.listingsPostedCount || 0;

  return (
    <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
      {/* 1. Header Card: Identity & Wallet */}
      <div className="bg-card rounded-2xl p-4 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-all bm-interactive shadow-none">

          
          <div className="flex items-center gap-4 md:gap-5 relative z-10 w-full md:w-auto">
             <div className="relative">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-1 border-card-foreground/10 overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:border-card-foreground/20">
                     {user.image ? (
                         <img src={user.image} alt={displayName || 'User'} className="w-full h-full object-cover" />
                     ) : (
                         <span className="text-xl md:text-2xl font-black text-muted-foreground uppercase opacity-40">
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
             <div className="min-w-0 space-y-2">
                 <h1 className="text-xl md:text-3xl font-black text-foreground flex items-center gap-3 truncate uppercase tracking-tighter leading-none">
                     {displayName}
                     {user.membershipStatus === 'ACTIVE' && (
                         <Badge variant="secondary" className="font-black px-2.5 py-1 rounded-xl text-[10px] uppercase tracking-[0.15em] shrink-0 border border-primary/20 bg-primary/10 text-primary">
                             <Crown className="w-3.5 h-3.5 mr-1.5" />
                             {user.membershipTier}
                         </Badge>
                     )}
                 </h1>
                 <p className="text-muted-foreground text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-60">
                     {isCompany ? 'Verified Business' : 'Personal Account'}
                 </p>
                 
                 {user.membershipExpiresAt && (
                     <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-secondary w-fit px-2 py-1 rounded-lg border border-border">
                         <Activity className="w-3 h-3" />
                         <span>Active until {format(new Date(user.membershipExpiresAt), 'MMM dd, yyyy')}</span>
                     </div>
                 )}
             </div>
          </div>

          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto bg-muted/30 p-5 md:p-6 rounded-2xl border-1 border-card-foreground/10 transition-all hover:bg-muted/50">
              <div className="text-right flex-1 md:flex-none">
                  <div className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1.5 opacity-60">Balance</div>
                  <div className="text-2xl md:text-4xl font-black text-foreground leading-none tracking-tighter uppercase">{Math.round(user.credits)} <span className="text-xs md:text-sm font-black text-muted-foreground ml-1">MKD</span></div>
              </div>
              <Button asChild size="lg" className="rounded-xl font-black uppercase tracking-widest h-12 px-6 md:px-10 transition-all active:scale-95 shadow-none border border-card-foreground/5">
                  <Link href="/wallet/top-up">
                      <Plus className="w-4 h-4 mr-2" />
                      Top Up
                  </Link>
              </Button>
          </div>
      </div>

      {/* 2. Scrollable Stats Section */}
      <div className="flex overflow-x-auto pb-4 gap-3 md:gap-4 snap-x md:grid md:grid-cols-4 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          {/* Money Spent Total */}
          <Card className="min-w-[200px] md:min-w-0 snap-center rounded-lg border-border shadow-none hover:bg-secondary/30 transition-all bg-card group cursor-default">
              <CardContent className="p-4 md:p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-foreground transition-colors">
                          <DollarSign className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold text-foreground bg-secondary px-2 py-1 rounded-lg uppercase tracking-widest">Lifetime</span>
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Spent</p>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight group-hover:text-foreground transition-colors">
                          {/* @ts-ignore - totalSpend added in backend but types might flag */}
                          {Math.round(stats.totalSpend || 0)} <span className="text-[10px] font-bold text-muted-foreground">MKD</span>
                      </h3>
                  </div>
              </CardContent>
          </Card>

          {/* Renewal & Listing Quotas */}
          <Card className="min-w-[280px] md:min-w-0 snap-center rounded-lg border-border shadow-none hover:bg-secondary/30 transition-all md:col-span-2 bg-card group cursor-default">
              <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-foreground transition-colors">
                          <RefreshCw className="w-5 h-5" />
                      </div>
                      <div>
                          <h3 className="font-bold text-foreground text-sm uppercase tracking-tight">Account Limits</h3>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Quota Usage</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-3">
                      <div>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Renewals</p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">{renewalsUsed}</p>
                            <span className="text-xs font-bold text-muted-foreground">/ {renewalsLimit}</span>
                          </div>
                      </div>
                      <div className="border-l-2 border-border/50 pl-4">
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Listings Posted</p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-lg md:text-xl font-bold text-foreground">{listingsUsed}</p>
                            <span className="text-xs font-bold text-muted-foreground">/ {listingsLimit}</span>
                          </div>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Advertising Stats */}
          <Card className="min-w-[200px] md:min-w-0 snap-center rounded-lg border-border shadow-none hover:bg-secondary/30 transition-all bg-card group cursor-default">
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
                    <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight group-hover:text-amber-500 transition-colors">{(stats?.totalViews ?? 0).toLocaleString()}</h3>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
