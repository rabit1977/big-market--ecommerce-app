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
import { CalendarIcon, ChevronDown, Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import { use, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ListingStatsPage({ params }: PageProps) {
    const { id } = use(params);
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date()
    });
    
    // Fetch stats
    const statsData = useQuery(api.analytics.getListingStats, { 
        listingId: id as Id<"listings">,
        days: 30
    });
    
    // Process data
    const data = statsData?.map((d: { date: string, views: number, clicks: number }) => ({
        ...d,
        formattedDate: format(new Date(d.date), 'dd MMM'),
        total: d.views + d.clicks
    })) || [];

    const totalViews = data.reduce((acc: number, curr: { views: number }) => acc + curr.views, 0);
    const totalClicks = data.reduce((acc: number, curr: { clicks: number }) => acc + curr.clicks, 0);
    const engagementRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

    return (
        <div className="min-h-screen pt-4 md:pt-8 pb-20 bg-background">
            <div className="container max-w-5xl mx-auto px-4">
                
                <AppBreadcrumbs className="mb-6" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight leading-none mb-2">
                            Performance Analytics
                        </h1>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                            Listing ID: #{id.slice(-6)}
                        </p>
                    </div>

                    {/* Date Picker - Styled like "Share" button */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full md:w-auto h-12 rounded-full border border-border bg-card px-6 py-2 text-left font-bold shadow-sm hover:bg-accent hover:text-accent-foreground transition-all group",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <span className="uppercase tracking-tight text-xs md:text-sm font-bold">
                                            {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                                        </span>
                                    ) : (
                                        format(dateRange.from, "MMM dd, yyyy")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-xl" align="end">
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
                                className="rounded-2xl border shadow-none bg-card"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
                    {/* Views Card */}
                    <Card className="rounded-2xl md:rounded-3xl border border-border shadow-sm bg-card overflow-hidden group hover:border-orange-500/30 transition-all cursor-default">
                        <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full relative">
                             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Eye className="w-16 h-16 text-orange-500" />
                             </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-sm">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                                    Total
                                </span>
                            </div>
                            <div className="relative z-10">
                                <div className="text-3xl md:text-4xl font-black text-foreground tracking-tighter mb-1 group-hover:text-orange-500 transition-colors">
                                    {totalViews}
                                </div>
                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    Listing Views
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Clicks Card */}
                    <Card className="rounded-2xl md:rounded-3xl border border-border shadow-sm bg-card overflow-hidden group hover:border-blue-500/30 transition-all cursor-default">
                        <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full relative">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MousePointerClick className="w-16 h-16 text-blue-500" />
                            </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-sm">
                                    <MousePointerClick className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                                    Total
                                </span>
                            </div>
                            <div className="relative z-10">
                                <div className="text-3xl md:text-4xl font-black text-foreground tracking-tighter mb-1 group-hover:text-blue-500 transition-colors">
                                    {totalClicks}
                                </div>
                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    Contact Clicks
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ratio Card */}
                    <Card className="rounded-2xl md:rounded-3xl border border-border shadow-sm bg-card overflow-hidden group hover:border-green-500/30 transition-all cursor-default">
                        <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full relative">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp className="w-16 h-16 text-green-500" />
                            </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="p-2.5 rounded-2xl bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors shadow-sm">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                                    Ratio
                                </span>
                            </div>
                            <div className="relative z-10">
                                <div className="text-3xl md:text-4xl font-black text-foreground tracking-tighter mb-1 group-hover:text-green-500 transition-colors">
                                    {engagementRate}%
                                </div>
                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    Engagement Rate
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Visuals Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Chart Section */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-3xl border border-border shadow-sm bg-card overflow-hidden h-full flex flex-col">
                             <div className="px-6 py-5 border-b border-border bg-muted/30 flex items-center justify-between">
                                <h3 className="font-black text-foreground uppercase tracking-tight text-sm md:text-base">
                                    Activity Trends
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Clicks</span>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-4 md:p-6 flex-1 min-h-[300px]">
                                <div className="h-full w-full min-h-[250px] md:min-h-[300px]">
                                    {!statsData ? (
                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-bold">Loading chart data...</div>
                                    ) : data.length === 0 ? (
                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-bold">No activity recorded for this period.</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                                                <XAxis 
                                                    dataKey="formattedDate" 
                                                    fontSize={10}
                                                    fontWeight={700}
                                                    tickLine={false} 
                                                    axisLine={false}
                                                    minTickGap={30}
                                                    tickMargin={10}
                                                    className="fill-muted-foreground/80 font-mono"
                                                />
                                                <YAxis 
                                                    fontSize={10}
                                                    fontWeight={700}
                                                    tickLine={false} 
                                                    axisLine={false}
                                                    tickCount={5}
                                                    allowDecimals={false}
                                                    className="fill-muted-foreground/80 font-mono"
                                                />
                                                <Tooltip 
                                                    cursor={{ fill: 'transparent' }}
                                                    content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                            const d = payload[0].payload;
                                                            return (
                                                                <div className="bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs rounded-xl p-3 shadow-xl border border-border">
                                                                    <div className="font-black mb-2 uppercase tracking-wide text-foreground">{d.formattedDate}</div>
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex justify-between items-center gap-8">
                                                                            <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Views</span>
                                                                            <span className="font-black text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">{d.views}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center gap-8">
                                                                            <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Clicks</span>
                                                                            <span className="font-black text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">{d.clicks}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Bar dataKey="views" fill="#FB923C" radius={[4, 4, 0, 0]} maxBarSize={32} />
                                                <Bar dataKey="clicks" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={32} /> 
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Breakdown List */}
                    <div className="lg:col-span-1">
                        <Card className="rounded-3xl border border-border shadow-sm bg-card overflow-hidden h-full flex flex-col max-h-[500px] lg:max-h-full">
                            <div className="px-5 py-5 border-b border-border bg-muted/30">
                                <h3 className="font-black text-foreground uppercase tracking-tight text-sm md:text-base">
                                    Recent Activity
                                </h3>
                            </div>
                            <div className="overflow-y-auto hover:pr-1 transition-all custom-scrollbar flex-1 p-2">
                                {data.slice().reverse().map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-3.5 mb-1 hover:bg-muted/50 rounded-2xl transition-all group border border-transparent hover:border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-[10px] font-black uppercase text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                {row.formattedDate.split(' ')[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{row.formattedDate}</span>
                                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                                                    {new Date(row.date).getFullYear()}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-black text-foreground">{row.views + row.clicks}</span>
                                                <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">Events</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {data.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-2">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 opacity-20" />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest">No activity yet</p>
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
