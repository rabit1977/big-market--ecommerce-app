'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { BarChart3, Clock, CreditCard, Loader2, MessageSquare, ShieldCheck, Users } from 'lucide-react';

export function AdminSystemAnalyticsClient() {
  const stats = useQuery(api.admin.getStats, {});

  if (stats === undefined) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statItems = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', description: 'Registered platform users' },
    { label: 'Total Listings', value: stats.listings, icon: BarChart3, color: 'text-emerald-500', description: 'Active and inactive listings' },
    { label: 'Promoted Listings', value: stats.promotedListings, icon: CreditCard, color: 'text-amber-500', description: 'Listings with active promotions' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: ShieldCheck, color: 'text-purple-500', description: 'Users awaiting ID verification' },
    { label: 'Support Inquiries', value: stats.newInquiries, icon: MessageSquare, color: 'text-rose-500', description: 'New contact form submissions' },
  ];

  return (
    <div className='space-y-8 pb-20'>
      {/* Header Area */}
      <div className='flex flex-col gap-6 sm:flex-row sm:items-end justify-between animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-2'>
           <h1 className='text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3'>
             System Analytics
             <span className='inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold ring-1 ring-inset ring-blue-500/20 uppercase tracking-widest'>
                Active
             </span>
           </h1>
           <p className='text-muted-foreground font-medium'>
               Real-time platform statistics and activity metrics.
           </p>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
        {statItems.map((stat, idx) => (
          <Card 
            key={stat.label} 
            className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                idx === 0 || idx === 1 ? "col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2" : "col-span-1"
            }`}
          >
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                 <div className={`p-3 rounded-xl ${stat.color.replace('text-', 'bg-').replace('-500', '-500/10')} ring-1 ring-inset ${stat.color.replace('text-', 'ring-').replace('-500', '-500/20')} shadow-sm`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                 </div>
              </div>
              <div>
                 <div className="text-3xl font-black tracking-tight mb-1">{stat.value}</div>
                 <h3 className="text-sm font-bold text-foreground/90">{stat.label}</h3>
                 <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">
                   {stat.description}
                 </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2rem] border-border/50 shadow-xl overflow-hidden bg-card/60 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <CardHeader className="p-6 md:p-8 border-b border-border/40 bg-muted/20">
          <CardTitle className="text-xl font-bold flex items-center gap-3 tracking-tight">
            <Clock className="h-5 w-5 text-primary" />
            Insights Engine
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Historical trajectory and predictive modeling.</p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl border border-dashed border-border/60">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-primary/60" />
             </div>
             <h3 className="font-bold text-lg text-foreground mb-2">Advanced Charts Coming Soon</h3>
             <p className="text-sm text-muted-foreground max-w-md mx-auto">
               Visual charts and historical trends for {new Date().getFullYear()} are currently compiling. They will be available in the next system update as more data points are collected.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
