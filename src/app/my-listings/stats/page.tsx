'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, Eye, Heart, MousePointerClick, TrendingUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../../../../convex/_generated/api';

export default function ListingStatsPage() {
    const { data: session } = useSession();
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date()
    });
    
    // Fetch stats - wait for session to load
    const statsData = useQuery(api.analytics.getUserStats, 
        session?.user?.id ? { 
            userId: session.user.id,
            days: 30 
        } : "skip"
    );

    // Process data similar to dashboard
    const chartData = statsData?.dailyStats?.map((d: { date: string, views: number, clicks: number, favorites: number }) => ({
        ...d,
        formattedDate: format(new Date(d.date), 'dd MMM'),
        total: d.views + d.clicks + (d.favorites || 0)
    })) || [];

    const totalViews = chartData.reduce((acc: number, curr: any) => acc + curr.views, 0);
    const totalClicks = chartData.reduce((acc: number, curr: any) => acc + curr.clicks, 0);
    const totalFavorites = statsData?.totalFavorites || 0;
    
    const engagementRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

    return (
        <div className="min-h-screen pt-4 md:pt-8 pb-20 bg-background">
            <div className="container max-w-5xl mx-auto px-4">
                
                <AppBreadcrumbs className="mb-6" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight leading-none mb-2">
                            Overview Statistics
                        </h1>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                            Performance of all your listings
                        </p>
                    </div>

                    {/* Date Picker - Styled like "Share" button */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full md:w-auto h-12 rounded-full border border-border bg-card px-6 py-2 text-left font-black shadow-sm hover:bg-accent hover:text-accent-foreground transition-all group uppercase tracking-wide text-xs",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <span>
                                            {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                                        </span>
                                    ) : (
                                        format(dateRange.from, "MMM dd, yyyy")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-3xl border-none shadow-2xl" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange as any}
                                onSelect={(val: any) => {
                                    if (val?.from && val?.to) {
                                        setDateRange({ from: val.from, to: val.to });
                                    } else if (val?.from) {
                                        setDateRange({ from: val.from, to: val.from });
                                    }
                                }}
                                numberOfMonths={1}
                                className="rounded-3xl border shadow-none bg-card p-4"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-8">
                    {/* Views Card */}
                    <Card className="rounded-2xl md:rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden group hover:border-orange-500/30 transition-all cursor-default relative">
                         <div className="absolute top-0 right-0 p-2 md:p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Eye className="w-12 h-12 md:w-24 md:h-24 transform rotate-12" />
                         </div>
                        <CardContent className="p-3 md:p-6 flex flex-col justify-between h-full relative z-10 gap-2 md:gap-0">
                            <div className="flex items-center justify-between mb-1 md:mb-4">
                                <div className="p-1.5 md:p-3 rounded-xl md:rounded-2xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-sm">
                                    <Eye className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                </div>
                                <span className="text-[8px] md:text-[9px] absolute bottom-2.5 right-2.5 font-black uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md md:rounded-lg">
                                    Total
                                </span>
                            </div>
                            <div>
                                <div className="text-xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-0.5 group-hover:text-orange-500 transition-colors">
                                    {totalViews}
                                </div>
                                <div className="text-[9px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">
                                    Total Views
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Clicks (Leads) Card */}
                    <Card className="rounded-2xl md:rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden group hover:border-blue-500/30 transition-all cursor-default relative">
                        <div className="absolute top-0 right-0 p-2 md:p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <MousePointerClick className="w-12 h-12 md:w-24 md:h-24 transform -rotate-12" />
                        </div>
                        <CardContent className="p-3 md:p-6 flex flex-col justify-between h-full relative z-10 gap-2 md:gap-0">
                            <div className="flex items-center justify-between mb-1 md:mb-4">
                                <div className="p-1.5 md:p-3 rounded-xl md:rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-sm">
                                    <MousePointerClick className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                </div>
                                <span className="text-[8px] md:text-[9px] absolute bottom-2.5 right-2.5 font-black uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md md:rounded-lg">
                                    Total
                                </span>
                            </div>
                            <div>
                                <div className="text-xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-0.5 group-hover:text-blue-500 transition-colors">
                                    {totalClicks}
                                </div>
                                <div className="text-[9px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">
                                    Leads
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Favorites (Saved) Card */}
                    <Card className="rounded-2xl md:rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden group hover:border-rose-500/30 transition-all cursor-default relative">
                        <div className="absolute top-0 right-0 p-2 md:p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Heart className="w-12 h-12 md:w-24 md:h-24 transform rotate-12" />
                        </div>
                        <CardContent className="p-3 md:p-6 flex flex-col justify-between h-full relative z-10 gap-2 md:gap-0">
                            <div className="flex items-center justify-between mb-1 md:mb-4">
                                <div className="p-1.5 md:p-3 rounded-xl md:rounded-2xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors shadow-sm">
                                    <Heart className="w-3.5 h-3.5 md:w-5 md:h-5 fill-current" />
                                </div>
                                <span className="text-[8px] md:text-[9px] absolute bottom-2.5 right-2.5 font-black uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md md:rounded-lg">
                                    Total
                                </span>
                            </div>
                            <div>
                                <div className="text-xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-0.5 group-hover:text-rose-500 transition-colors">
                                    {totalFavorites}
                                </div>
                                <div className="text-[9px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">
                                    Favorites
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ratio Card */}
                    <Card className="rounded-2xl md:rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden group hover:border-emerald-500/30 transition-all cursor-default relative">
                        <div className="absolute top-0 right-0 p-2 md:p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <TrendingUp className="w-12 h-12 md:w-24 md:h-24 transform -rotate-6" />
                        </div>
                        <CardContent className="p-3 md:p-6 flex flex-col justify-between h-full relative z-10 gap-2 md:gap-0">
                            <div className="flex items-center justify-between mb-1 md:mb-4">
                                <div className="p-1.5 md:p-3 rounded-xl md:rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-sm">
                                    <TrendingUp className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                </div>
                                <span className="text-[8px] md:text-[9px] absolute bottom-2.5 right-2.5 font-black uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md md:rounded-lg">
                                    AVG
                                </span>
                            </div>
                            <div>
                                <div className="text-xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter mb-0.5 group-hover:text-emerald-500 transition-colors">
                                    {engagementRate}%
                                </div>
                                <div className="text-[9px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">
                                    Interest Rate
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Visuals Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Chart Section */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden h-full flex flex-col">
                             <div className="px-6 py-5 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-black text-foreground uppercase tracking-tight text-sm md:text-base">
                                        Performance Trends
                                    </h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Daily views vs actions</p>
                                </div>
                                <div className="flex items-center gap-4 bg-background/50 p-1.5 rounded-full border border-border/50 w-fit">
                                    <div className="flex items-center gap-2 px-3">
                                        <span className="w-2 h-2 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50"></span>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Views</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 border-l border-border/50">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Leads</span>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-4 md:p-6 flex-1 min-h-[350px]">
                                <div className="h-full w-full min-h-[300px]">
                                    {!statsData ? (
                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-bold uppercase tracking-wider animate-pulse">Loading analytics...</div>
                                    ) : chartData.length === 0 ? (
                                        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                                            <div className="p-4 rounded-full bg-muted">
                                                <TrendingUp className="w-8 h-8 opacity-20" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest">No activity recorded for this period.</span>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={2}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                                                <XAxis 
                                                    dataKey="formattedDate" 
                                                    fontSize={10}
                                                    fontWeight={700}
                                                    tickLine={false} 
                                                    axisLine={false}
                                                    minTickGap={30}
                                                    tickMargin={15}
                                                    className="fill-muted-foreground/70 font-mono uppercase tracking-tight"
                                                />
                                                <YAxis 
                                                    fontSize={10}
                                                    fontWeight={700}
                                                    tickLine={false} 
                                                    axisLine={false}
                                                    tickCount={6}
                                                    allowDecimals={false}
                                                    className="fill-muted-foreground/70 font-mono"
                                                />
                                                <Tooltip 
                                                    cursor={{ fill: 'var(--muted)', opacity: 0.2, radius: 8 }}
                                                    content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                            const d = payload[0].payload;
                                                            return (
                                                                <div className="bg-popover/90 backdrop-blur-md text-popover-foreground text-xs rounded-2xl p-4 shadow-xl border border-border/50 min-w-[150px]">
                                                                    <div className="font-black mb-3 uppercase tracking-wide text-foreground border-b border-border/50 pb-2">{d.formattedDate}</div>
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between items-center gap-8">
                                                                            <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Views
                                                                            </span>
                                                                            <span className="font-black text-foreground">{d.views}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center gap-8">
                                                                            <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Leads
                                                                            </span>
                                                                            <span className="font-black text-foreground">{d.clicks}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Bar 
                                                    dataKey="views" 
                                                    fill="url(#colorViews)" 
                                                    radius={[4, 4, 4, 4]} 
                                                    maxBarSize={24}
                                                    className="fill-orange-400"
                                                />
                                                <Bar 
                                                    dataKey="clicks" 
                                                    fill="url(#colorClicks)" 
                                                    radius={[4, 4, 4, 4]} 
                                                    maxBarSize={24} 
                                                    className="fill-blue-500"
                                                /> 
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Breakdown List */}
                    <div className="lg:col-span-1">
                        <Card className="rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden h-full flex flex-col max-h-[500px] lg:max-h-full">
                            <div className="px-5 py-5 border-b border-border/50 bg-muted/20">
                                <h3 className="font-black text-foreground uppercase tracking-tight text-sm md:text-base">
                                    Recent Activity
                                </h3>
                            </div>
                            <div className="overflow-y-auto custom-scrollbar flex-1 p-3 space-y-1">
                                {chartData.slice().reverse().filter(row => row.total > 0).map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-3.5 hover:bg-muted/50 rounded-2xl transition-all group border border-transparent hover:border-border/50 cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-[10px] font-black uppercase text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all shadow-sm">
                                                {row.formattedDate.split(' ')[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{row.formattedDate}</span>
                                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                                                    {new Date(row.date).getFullYear()}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-black text-foreground">{row.views + row.clicks}</span>
                                                <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">Act</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {chartData.every(d => d.total === 0) && (
                                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-3 opacity-60">
                                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                            <TrendingUp className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest leading-relaxed max-w-[150px]">
                                            No activity to display yet
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}
