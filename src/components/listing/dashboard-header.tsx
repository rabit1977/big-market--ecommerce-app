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


export function MyListingsDashboardHeader() {
  const { data: session } = useSession();
  const dashboardData = useQuery(api.users.getMyDashboardStats, { 
      externalId: session?.user?.id || '' 
  });

  if (!dashboardData) return (
      <div className="w-full h-32 md:h-40 bg-muted/30 animate-pulse rounded-2xl mb-6 md:mb-8" />
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
    <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
      {/* 1. Header Card: Identity & Wallet */}
      <div className="bg-card/40 backdrop-blur-sm rounded-3xl p-5 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative overflow-hidden transition-all bm-interactive shadow-none">
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 relative z-10 w-full lg:w-auto">
             <div className="relative group/avatar">
                 <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-1 border-card-foreground/10 overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-sm transition-all group-hover/avatar:border-primary/30">
                     {user.image ? (
                         <img src={user.image} alt={displayName || 'User'} className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                     ) : (
                         <span className="text-2xl md:text-4xl font-black text-muted-foreground uppercase opacity-40">
                             {(displayName || 'U').slice(0, 2).toUpperCase()}
                         </span>
                     )}
                 </div>
                 {user.isVerified && (
                     <TooltipProvider>
                         <Tooltip>
                             <TooltipTrigger asChild>
                                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-background shadow-lg cursor-help transition-transform hover:scale-110">
                                      <CheckCircle2 className="w-4 h-4" />
                                  </div>
                             </TooltipTrigger>
                             <TooltipContent>Verified Account</TooltipContent>
                         </Tooltip>
                     </TooltipProvider>
                 )}
             </div>

             <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl md:text-5xl font-black text-foreground truncate uppercase tracking-tighter leading-none">
                          {displayName}
                      </h1>
                      <div className="flex items-center gap-2">
                        {user.isVerified && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-black px-3 py-1 rounded-xl text-[10px] uppercase tracking-[0.15em] shrink-0">
                                <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                Verified
                            </Badge>
                        )}
                        {user.membershipStatus === 'ACTIVE' && (
                            <Badge variant="secondary" className="font-black px-3 py-1 rounded-xl text-[10px] uppercase tracking-[0.15em] shrink-0 border border-primary/20 bg-primary/10 text-primary">
                                <Crown className="w-3.5 h-3.5 mr-1.5" />
                                {user.membershipTier}
                            </Badge>
                        )}
                      </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <p className="text-muted-foreground text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-60">
                          {isCompany ? 'Verified Business' : 'Personal Account'}
                      </p>
                      
                      {user.membershipExpiresAt && (
                          <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-black uppercase tracking-[0.15em] bg-emerald-500/10 w-fit px-3 py-1.5 rounded-xl border border-emerald-500/20">
                              <Activity className="w-3 h-3" />
                              <span>PRO Active until {format(new Date(user.membershipExpiresAt), 'MMM dd, yyyy')}</span>
                          </div>
                      )}
                  </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full lg:w-auto bg-muted/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border-1 border-card-foreground/10 transition-all hover:bg-muted/60 lg:min-w-[400px]">
              <div className="text-center sm:text-left flex-1">
                  <div className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-2 opacity-60">Available Balance</div>
                  <div className="text-3xl md:text-5xl font-black text-foreground leading-none tracking-tighter uppercase flex items-baseline gap-2">
                    {Math.round(user.credits)} 
                    <span className="text-xs md:text-sm font-black text-muted-foreground opacity-60">MKD</span>
                  </div>
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl font-black uppercase tracking-[0.2em] h-14 px-8 md:px-12 transition-all active:scale-95 shadow-lg shadow-primary/10 border border-primary/20 bg-primary hover:bg-primary/95 text-white">
                  <Link href="/wallet/top-up">
                      <Plus className="w-5 h-5 mr-2" />
                      Top Up
                  </Link>
              </Button>
          </div>
      </div>

      {/* 2. Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Money Spent Total */}
          <Card className="rounded-3xl border-1 border-card-foreground/10 shadow-none hover:bg-muted/40 transition-all bg-card/40 backdrop-blur-sm group cursor-default bm-interactive">
              <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground transition-transform group-hover:scale-110">
                          <DollarSign className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-foreground bg-muted px-3 py-1.5 rounded-xl uppercase tracking-[0.15em]">Lifetime</span>
                  </div>
                  <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Total Investment</p>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase group-hover:text-primary transition-colors">
                          {Math.round(stats.totalSpend || 0)} <span className="text-xs font-black text-muted-foreground">MKD</span>
                      </h3>
                  </div>
              </CardContent>
          </Card>

          {/* Renewal & Listing Quotas */}
          <Card className="rounded-3xl border-1 border-card-foreground/10 shadow-none hover:bg-muted/40 transition-all sm:col-span-2 bg-card/40 backdrop-blur-sm group cursor-default bm-interactive">
              <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground transition-transform group-hover:scale-110">
                          <RefreshCw className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="font-black text-foreground text-sm md:text-base uppercase tracking-widest">Account Quotas</h3>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Limit Tracking</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 border-t border-card-foreground/10 pt-6">
                      <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Monthly Renewals</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors">{renewalsUsed}</p>
                            <span className="text-xs font-black text-muted-foreground">/ {renewalsLimit}</span>
                          </div>
                      </div>
                      <div className="border-l border-card-foreground/10 pl-8 space-y-2">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Total Listings</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors">{listingsUsed}</p>
                            <span className="text-xs font-black text-muted-foreground">/ {listingsLimit}</span>
                          </div>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Advertising Stats */}
          <Card className="rounded-3xl border-1 border-card-foreground/10 shadow-none hover:bg-muted/40 transition-all bg-card/40 backdrop-blur-sm group cursor-default bm-interactive">
              <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                          <Megaphone className="w-6 h-6" />
                      </div>
                      <Link href="/my-listings/stats" className="w-10 h-10 flex items-center justify-center rounded-2xl bg-muted text-foreground hover:bg-primary hover:text-white transition-all transform hover:rotate-45">
                          <ArrowRight className="w-5 h-5" />
                      </Link>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Reach & Visibility</p>
                    <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase group-hover:text-amber-500 transition-colors">
                        {(stats?.totalViews ?? 0).toLocaleString()} <span className="text-xs font-black text-muted-foreground ml-1">Views</span>
                    </h3>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
