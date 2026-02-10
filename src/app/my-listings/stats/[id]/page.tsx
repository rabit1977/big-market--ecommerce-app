
'use client';

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
import { CalendarIcon, ChevronLeft, Eye, MousePointerClick } from 'lucide-react';
import Link from 'next/link';
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
    
    const statsData = useQuery(api.analytics.getListingStats, { 
        listingId: id as Id<"listings">,
        days: 30
    });
    
    const data = statsData?.map((d: { date: string, views: number, clicks: number }) => ({
        ...d,
        formattedDate: format(new Date(d.date), 'dd.MM.yyyy'),
        total: d.views + d.clicks
    })) || [];

    const totalViews = data.reduce((acc: number, curr: { views: number }) => acc + curr.views, 0);
    const totalClicks = data.reduce((acc: number, curr: { clicks: number }) => acc + curr.clicks, 0);

    return (
        <div className="min-h-screen pt-4 md:pt-6 pb-8 bg-muted/20">
            <div className="container max-w-4xl mx-auto px-3 md:px-4">
                
                {/* Header */}
                <div className="mb-4 md:mb-6">
                    <Link href="/my-listings" className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground mb-2">
                        <ChevronLeft className="w-3.5 h-3.5" /> Back to My Listings
                    </Link>
                    <h1 className="text-lg md:text-2xl font-black text-foreground tracking-tight">Statistics Overview</h1>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Performance for listing #{id.slice(-6)}</p>
                </div>

                {/* Date Filter Card */}
                <Card className="mb-3 md:mb-5 border-border shadow-sm overflow-hidden">
                    <CardContent className="p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                            <h3 className="font-bold text-foreground uppercase tracking-tight text-xs">Review Period</h3>
                            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {format(dateRange.from, 'dd MMM yyyy')} - {format(dateRange.to, 'dd MMM yyyy')}
                            </p>
                        </div>
                        
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full sm:w-[220px] justify-start text-left font-bold text-xs h-8 md:h-9 border border-border rounded-lg",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "MMM dd, y")} -{" "}
                                                {format(dateRange.to, "MMM dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "MMM dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] sm:w-auto p-0" align="center" sideOffset={8}>
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
                                    className="rounded-xl border shadow-xl bg-background"
                                />
                            </PopoverContent>
                        </Popover>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-2.5 md:gap-4 mb-3 md:mb-5">
                    <Card className="border-l-3 md:border-l-4 border-l-orange-400 shadow-sm overflow-hidden">
                        <CardContent className="p-3 md:p-4 flex items-center justify-between">
                            <div>
                                <div className="text-lg md:text-2xl font-black text-foreground leading-none mb-0.5">{totalViews}</div>
                                <div className="text-[9px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Views</div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-3 md:border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
                        <CardContent className="p-3 md:p-4 flex items-center justify-between">
                            <div>
                                <div className="text-lg md:text-2xl font-black text-foreground leading-none mb-0.5">{totalClicks}</div>
                                <div className="text-[9px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Clicks</div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <MousePointerClick className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Section */}
                <Card className="mb-3 md:mb-5 border-border shadow-sm overflow-hidden">
                    <CardContent className="p-3 md:p-5">
                        <div className="h-[180px] md:h-[280px] w-full">
                            {!statsData ? (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">Loading chart...</div>
                            ) : data.length === 0 ? (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">No data available for this period.</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                                        <XAxis 
                                            dataKey="formattedDate" 
                                            fontSize={8} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(val) => val.split('.')[0]}
                                            minTickGap={20}
                                            className="fill-muted-foreground"
                                        />
                                        <YAxis 
                                            fontSize={8} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickCount={5}
                                            allowDecimals={false}
                                            className="fill-muted-foreground"
                                        />
                                        <Tooltip 
                                            cursor={{ fill: 'transparent' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const d = payload[0].payload;
                                                    return (
                                                        <div className="bg-popover text-popover-foreground text-[10px] rounded-lg p-2 shadow-xl border border-border">
                                                            <div className="font-bold mb-1">{d.formattedDate}</div>
                                                            <div className="flex justify-between gap-4">
                                                                <span>Views:</span>
                                                                <span className="font-bold text-orange-400">{d.views}</span>
                                                            </div>
                                                            <div className="flex justify-between gap-4">
                                                                <span>Clicks:</span>
                                                                <span className="font-bold text-blue-400">{d.clicks}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="views" fill="#FB923C" radius={[2, 2, 0, 0]} maxBarSize={16} />
                                        <Bar dataKey="clicks" fill="#3B82F6" radius={[2, 2, 0, 0]} maxBarSize={16} /> 
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        
                        <div className="flex justify-center gap-5 mt-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Views</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Clicks</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card className="overflow-hidden shadow-sm border-border rounded-xl">
                    <div className="bg-muted/50 px-3 md:px-4 py-2.5 border-b">
                        <h4 className="text-[10px] md:text-xs font-black text-foreground uppercase tracking-tight">Daily Breakdown</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="text-[9px] md:text-[10px] text-muted-foreground uppercase bg-muted/30 border-b">
                                <tr>
                                    <th className="px-3 md:px-5 py-2.5 font-bold tracking-wider">Date</th>
                                    <th className="px-3 md:px-5 py-2.5 font-bold tracking-wider text-right">Views</th>
                                    <th className="px-3 md:px-5 py-2.5 font-bold tracking-wider text-right">Clicks</th>
                                    <th className="px-3 md:px-5 py-2.5 font-bold tracking-wider text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {data.slice().reverse().map((row, i) => (
                                    <tr key={i} className="bg-card hover:bg-muted/30 transition-colors">
                                        <td className="px-3 md:px-5 py-2 font-bold text-foreground text-[11px]">{row.formattedDate}</td>
                                        <td className="px-3 md:px-5 py-2 text-right font-medium text-[11px]">{row.views}</td>
                                        <td className="px-3 md:px-5 py-2 text-right font-medium text-[11px]">{row.clicks}</td>
                                        <td className="px-3 md:px-5 py-2 text-right">
                                            <span className="bg-muted px-1.5 py-0.5 rounded-full font-black text-foreground text-[10px]">
                                                {row.total}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                                            No activity recorded
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </div>
    );
}
