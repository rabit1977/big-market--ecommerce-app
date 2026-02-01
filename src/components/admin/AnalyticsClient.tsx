'use client';

import { formatPrice } from '@/lib/utils/formatters';
import { BarChart3, DollarSign, Eye, Monitor, MousePointerClick, Package, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AnalyticsData {
  revenue: number;
  orders: number;
  users: number;
  products: number;
  totalViews: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  chartData: { name: string; total: number }[];
  categoryData: { name: string; value: number }[];
  deviceStats: Record<string, number>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];

export default function AnalyticsClient({ initialData }: { initialData: AnalyticsData }) {
  
  // Custom Tooltip for Charts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-xl border border-border/50 shadow-lg !bg-background/90 backdrop-blur-md">
          <p className="font-bold text-sm mb-1">{label}</p>
          <p className="text-primary font-bold text-sm">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-1'>
          <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-3'>
            Analytics
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-bold ring-1 ring-inset ring-violet-500/20">
               Pro
            </span>
          </h1>
          <p className='text-lg text-muted-foreground font-medium'>
             Performance metrics and revenue reports
          </p>
        </div>
      </div>

       {/* Stats Cards */}
       <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
        {[
            { label: 'Total Revenue', value: formatPrice(initialData.revenue), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Total Orders', value: initialData.orders, icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { label: 'Total Customers', value: initialData.users, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { label: 'Products', value: initialData.products, icon: Package, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
        ].map((stat, i) => (
             <div key={i} className={`glass-card p-6 rounded-3xl flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border ${stat.border}`}>
                <div className='flex justify-between items-start mb-2'>
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                       <stat.icon className='h-6 w-6' />
                    </div>
                </div>
                <div>
                   <h3 className='text-3xl font-black mt-2 tracking-tight text-foreground'>{stat.value}</h3>
                   <p className='text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1'>{stat.label}</p>
                </div>
             </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        
        {/* Revenue Chart */}
        <div className='glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-black/5 border border-border/60'>
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <TrendingUp className="h-5 w-5" />
                </div>
                <h2 className='text-xl font-bold'>Revenue Overview</h2>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={initialData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '5 5', opacity: 0.2 }} />
                        <Line 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#10b981" 
                            strokeWidth={4} 
                            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Category Distribution */}
        <div className='glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-black/5 border border-border/60'>
             <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500">
                    <Package className="h-5 w-5" />
                </div>
                <h2 className='text-xl font-bold'>Products by Category</h2>
            </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={initialData.categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {initialData.categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>
      
      {/* Web Analytics Section */}
      <h2 className='text-2xl font-bold tracking-tight mt-12 mb-6'>Web Traffic Insights</h2>
      
      {/* Web Stats Cards */}
      <div className='grid gap-5 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300'>
        {[
            { label: 'Total Page Views', value: initialData.totalViews || 0, icon: Eye, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
            { label: 'Unique Visitors', value: initialData.uniqueVisitors || 0, icon: MousePointerClick, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
            { label: 'Desktop Users', value: initialData.deviceStats?.desktop || 0, icon: Monitor, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        ].map((stat, i) => (
             <div key={i} className={`glass-card p-6 rounded-3xl flex items-center justify-between border ${stat.border}`}>
                <div>
                   <p className='text-sm font-bold text-muted-foreground uppercase tracking-wider'>{stat.label}</p>
                   <h3 className='text-3xl font-black mt-1 tracking-tight text-foreground'>{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                   <stat.icon className='h-6 w-6' />
                </div>
             </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
         {/* Top Pages */}
         <div className='glass-card rounded-[2rem] p-8 shadow-xl border border-border/60'>
            <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Most Visited Pages
            </h3>
            <div className="space-y-4">
                {initialData.topPages?.map((page, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <span className="font-mono text-sm truncate max-w-[70%]">{page.path}</span>
                        <span className="font-bold text-primary">{page.count} views</span>
                    </div>
                ))}
                {(!initialData.topPages || initialData.topPages.length === 0) && (
                    <p className="text-muted-foreground text-sm italic">No page view data yet.</p>
                )}
            </div>
         </div>

         {/* Device Stats */}
         <div className='glass-card rounded-[2rem] p-8 shadow-xl border border-border/60'>
            <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                <Monitor className="h-5 w-5 text-indigo-500" />
                Device Breakdown
            </h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(initialData.deviceStats || {}).map(([name, value]) => ({ name, value }))}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                        <Tooltip 
                            cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="glass-card p-3 rounded-xl border border-border/50 text-sm font-bold shadow-xl">
                                    <p className="capitalize text-muted-foreground">{label}</p>
                                    <p className="text-xl">{payload[0].value}</p>
                                    </div>
                                );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                            {Object.entries(initialData.deviceStats || {}).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
}
