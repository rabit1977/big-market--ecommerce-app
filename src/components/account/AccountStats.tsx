'use client';

import { Heart, MessageCircle, Package, Zap } from 'lucide-react';
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
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
        path: '/my-listings'
    },
    {
        label: 'Messages',
        value: messagesCount,
        icon: MessageCircle,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        path: '/messages'
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
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
      {statItems.map((item, i) => (
          <button
            key={i}
            onClick={() => handleNavigate(item.path)}
            className='glass-card p-6 border-border/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-left group relative overflow-hidden'
          >
            <div className='flex flex-col gap-4'>
              <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-inset ring-white/10`}>
                <item.icon className='h-6 w-6' />
              </div>
              <div>
                <p className='text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1'>
                  {item.label}
                </p>
                <p className='text-2xl sm:text-3xl font-black tracking-tight text-foreground'>
                  {item.value}
                </p>
              </div>
            </div>
          </button>
      ))}
    </div>
  );
}
