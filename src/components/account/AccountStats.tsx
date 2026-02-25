'use client';

import { Heart, Package, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AccountStatsProps {
  totalListings: number;
  activeListings: number;
  messagesCount: number;
  wishlistItems: number;
}

export function AccountStats({
  totalListings,
  activeListings,
  messagesCount,
  wishlistItems,
}: AccountStatsProps) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const statItems = [
    {
        label: 'Total Listings',
        value: totalListings,
        icon: Package,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        path: '/my-listings'
    },
    {
        label: 'Active Ads',
        value: activeListings,
        icon: Zap,
        color: 'text-primary',
        bg: 'bg-primary/10',
        path: '/my-listings'
    },
    {
        label: 'Favorites',
        value: wishlistItems,
        icon: Heart,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
        path: '/favorites'
    }
  ];

  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4'>
      {statItems.map((item, i) => (
          <button
            key={i}
            onClick={() => handleNavigate(item.path)}
            className='relative group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-left'
          >
            <div className='flex items-center gap-4'>
              <div className={`w-10 h-10 shrink-0 ${item.bg} ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon className='h-5 w-5' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate'>
                  {item.label}
                </p>
                <p className='text-xl font-bold tracking-tight text-foreground'>
                  {item.value}
                </p>
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          </button>
      ))}
    </div>
  );
}
