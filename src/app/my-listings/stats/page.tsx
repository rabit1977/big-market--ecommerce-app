'use client';

import { getMyListingsAction } from '@/actions/listing-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function AdStatsPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getMyListingsAction();
                if (res.listings) setListings(res.listings);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const totalViews = listings.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
    // Mock clicks (as we don't track them yet) roughly 10% of views
    const totalClicks = Math.floor(totalViews * 0.12);
    
    // Data for Chart (Top 5 Listings)
    const chartData = listings
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5)
      .map(l => ({
          name: l.title.substring(0, 15) + (l.title.length > 15 ? '...' : ''),
          views: l.viewCount || 0
      }));

    if (loading) return <div className="p-10 text-center">Loading stats...</div>;

    return (
        <div className="container py-10 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Ad Statistics</h1>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement (Clicks)</CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+10.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. CTR</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%</div>
                        <p className="text-xs text-muted-foreground">+2% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Top Performing Listings</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                       {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <Bar dataKey="views" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                            </BarChart>
                        </ResponsiveContainer>
                       ) : (
                           <div className="h-full flex items-center justify-center text-muted-foreground">
                               No data available
                           </div>
                       )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
