
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
    
    // Fetch real stats
    const statsData = useQuery(api.analytics.getListingStats, { 
        listingId: id as Id<"listings">,
        days: 30 // Could be dynamic based on dateRange difference
    });
    
    // Format data for chart
    const data = statsData?.map((d: { date: string, views: number, clicks: number }) => ({
        ...d,
        formattedDate: format(new Date(d.date), 'dd.MM.yyyy'),
        total: d.views + d.clicks
    })) || [];

    const totalViews = data.reduce((acc: number, curr: { views: number }) => acc + curr.views, 0);
    const totalClicks = data.reduce((acc: number, curr: { clicks: number }) => acc + curr.clicks, 0);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50/50">
            <div className="container max-w-4xl mx-auto px-4">
                
                {/* Header */}
                <div className="mb-8">
                    <Link href="/my-listings" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground mb-4">
                        <ChevronLeft className="w-4 h-4" /> Back to My Listings
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Statistics Overview</h1>
                    <p className="text-muted-foreground">Performance for listing #{id}</p>
                </div>

                {/* Date Filter Card */}
                <Card className="mb-6 border-slate-200">
                    <CardContent className="p-4 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h3 className="font-bold text-slate-900">Review of the ad</h3>
                            <p className="text-sm text-muted-foreground">
                                {format(dateRange.from, 'dd.MM.yyyy')} - {format(dateRange.to, 'dd.MM.yyyy')}
                            </p>
                        </div>
                        
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                                {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange as any}
                                    onSelect={(val: any) => setDateRange(val || { from: new Date(), to: new Date() })}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </CardContent>
                </Card>

                {/* Chart Section */}
                <Card className="mb-6 border-slate-200 shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                        <div className="h-[300px] w-full">
                            {!statsData ? (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">Loading chart...</div>
                            ) : data.length === 0 ? (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">No data available for this period.</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis 
                                            dataKey="formattedDate" 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(val, index) => index % 3 === 0 ? val.split('.')[0] : ''} 
                                        />
                                        <YAxis 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickCount={5}
                                            allowDecimals={false}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: 'transparent' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const d = payload[0].payload;
                                                    return (
                                                        <div className="bg-slate-800 text-white text-xs rounded-lg p-2 shadow-xl">
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
                                        <Bar dataKey="views" fill="#FB923C" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                        <Bar dataKey="clicks" fill="#60A5FA" radius={[4, 4, 0, 0]} maxBarSize={40} /> 
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-orange-400 rounded-full"></div>
                                <span className="text-sm font-medium text-slate-700">Views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-blue-400 rounded-full"></div>
                                <span className="text-sm font-medium text-slate-700">Clicks</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="border-l-4 border-l-orange-400 shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-black text-slate-900">{totalViews}</div>
                                <div className="text-sm text-muted-foreground">Total Views</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-black text-slate-900">{totalClicks}</div>
                                <div className="text-sm text-muted-foreground">Total Clicks</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <MousePointerClick className="w-5 h-5 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card className="overflow-hidden shadow-sm border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium text-right">Views</th>
                                    <th className="px-6 py-3 font-medium text-right">Clicks</th>
                                    <th className="px-6 py-3 font-medium text-right">Total Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice().reverse().map((row, i) => (
                                    <tr key={i} className="bg-white border-b hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">{row.formattedDate}</td>
                                        <td className="px-6 py-4 text-right">{row.views}</td>
                                        <td className="px-6 py-4 text-right">{row.clicks}</td>
                                        <td className="px-6 py-4 text-right font-bold">{row.total}</td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-muted-foreground">
                                           No activity recorded in this period.
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
