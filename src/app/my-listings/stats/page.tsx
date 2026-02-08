
'use client';


import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { api } from '@/lib/convex-server';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, Eye, MousePointerClick } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// MOCK_DATA removed

export default function ListingStatsPage() {
    const { data: session } = useSession();
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date()
    });

    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));

    const stats = useQuery(api.analytics.getUserStats, 
        session?.user?.id ? { 
            userId: session.user.id, 
            days: days > 0 ? days : 30 
        } : "skip"
    );

    const chartData = stats?.map(s => ({
        ...s,
        formattedDate: format(new Date(s.date), 'dd.MM.yyyy'),
        total: (s.views || 0) + (s.clicks || 0)
    })) || [];

    const totalViews = chartData.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalClicks = chartData.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-12 bg-gray-50/50">
            <div className="container max-w-4xl mx-auto px-2 md:px-4">
                
                {/* Header */}
                <div className="mb-6 md:mb-8 px-2 md:px-0">
                    <Link href="/my-listings" className="text-xs md:text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground mb-4">
                        <ChevronLeft className="w-4 h-4" /> Back to My Listings
                    </Link>
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Statistics Overview</h1>
                    <p className="text-xs md:text-sm text-muted-foreground">Performance of all your listings</p>
                </div>

                {/* Date Filter Card */}
                <Card className="mb-4 md:mb-6 border-slate-200 overflow-hidden shadow-sm">
                    <CardContent className="p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Review Period</h3>
                            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                {format(dateRange.from, 'dd MMM yyyy')} - {format(dateRange.to, 'dd MMM yyyy')}
                            </p>
                        </div>
                        
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full sm:w-[260px] justify-start text-left font-bold text-xs h-11 border-2 border-slate-100 rounded-xl",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
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
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent 
                                className="w-[320px] sm:w-auto p-0" 
                                align="center" 
                                sideOffset={8}
                            >
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
                                    className="rounded-xl border shadow-2xl bg-white"
                                />
                            </PopoverContent>
                        </Popover>
                    </CardContent>
                </Card>

                {/* Chart Section */}
                <Card className="mb-4 md:mb-6 border-slate-200 shadow-sm overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                        <div className="h-[200px] md:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="date" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tickFormatter={(val) => format(new Date(val), 'dd.MM')}
                                        minTickGap={20}
                                    />
                                    <YAxis 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tickCount={5}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-slate-800 text-white text-[10px] rounded-lg p-2 shadow-xl border border-white/10">
                                                        <div className="font-bold mb-1">{format(new Date(data.date), 'dd MMMM yyyy')}</div>
                                                        <div className="flex justify-between gap-4">
                                                            <span>Views:</span>
                                                            <span className="font-bold text-orange-400">{data.views}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span>Inquiries:</span>
                                                            <span className="font-bold text-blue-400">{data.clicks}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="views" fill="#FB923C" radius={[2, 2, 0, 0]} maxBarSize={20} />
                                    <Bar dataKey="clicks" fill="#3B82F6" radius={[2, 2, 0, 0]} maxBarSize={20} /> 
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inquiries</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                    <Card className="border-l-4 border-l-orange-400 shadow-sm overflow-hidden">
                        <CardContent className="p-3 md:p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xl md:text-3xl font-black text-slate-900 leading-none mb-1">{totalViews}</div>
                                <div className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">Views</div>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                <Eye className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
                        <CardContent className="p-3 md:p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xl md:text-3xl font-black text-slate-900 leading-none mb-1">{totalClicks}</div>
                                <div className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">Inquiries</div>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <MousePointerClick className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card className="overflow-hidden shadow-sm border-slate-200 rounded-xl">
                    <div className="bg-slate-50 px-4 py-3 border-b">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Daily Breakdown</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs md:text-sm text-left">
                            <thead className="text-[10px] md:text-xs text-muted-foreground uppercase bg-slate-50/50 border-b">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 font-bold tracking-wider">Date</th>
                                    <th className="px-4 md:px-6 py-3 font-bold tracking-wider text-right">Views</th>
                                    <th className="px-4 md:px-6 py-3 font-bold tracking-wider text-right">Inq.</th>
                                    <th className="px-4 md:px-6 py-3 font-bold tracking-wider text-right">Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {chartData.slice().reverse().map((row, i) => (
                                    <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                                        <td className="px-4 md:px-6 py-3 font-bold text-slate-900">{format(new Date(row.date), 'dd.MM')}</td>
                                        <td className="px-4 md:px-6 py-3 text-right font-medium">{row.views}</td>
                                        <td className="px-4 md:px-6 py-3 text-right font-medium">{row.clicks}</td>
                                        <td className="px-4 md:px-6 py-3 text-right">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-full font-black text-slate-700">
                                                {row.total}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {chartData.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                            No data available for this range
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
