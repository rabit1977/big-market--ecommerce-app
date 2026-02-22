'use client';

import { cn } from '@/lib/utils';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { memo } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose';
  className?: string;
}

const colorVariants = {
  violet: {
    iconBg: 'bg-primary/10 dark:bg-primary/20',
    iconColor: 'text-primary',
    gradient: 'from-primary/10 to-transparent',
  },
  emerald: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500/10 to-transparent',
  },
  blue: {
    iconBg: 'bg-blue-100 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500/10 to-transparent',
  },
  amber: {
    iconBg: 'bg-amber-100 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500/10 to-transparent',
  },
  rose: {
    iconBg: 'bg-rose-100 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-500/10 to-transparent',
  },
};

/**
 * Mobile-optimized Dashboard stat card component
 * Features gradient decorations, smooth hover effects, and trend indicators
 */
export const DashboardCard = memo(({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'violet',
  className,
}: DashboardCardProps) => {
  const colors = colorVariants[color];

  return (
    <div 
      className={cn(
        'stat-card group relative overflow-hidden',
        'p-4 sm:p-6', // Smaller padding on mobile
        className
      )}
    >
      {/* Gradient Decoration */}
      <div 
        className={cn(
          'absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-radial rounded-full blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100',
          colors.gradient
        )} 
      />

      {/* Content */}
      <div className='relative z-10'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <p className='text-xs sm:text-sm font-medium text-muted-foreground'>
            {title}
          </p>
          {Icon && (
            <div className={cn(
              'w-8 h-8 sm:w-10 sm:h-10 rounded-full sm:rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 -m-1.5',
              colors.iconBg
            )}>
              <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', colors.iconColor)} />
            </div>
          )}
        </div>

        {/* Value */}
        <div className='mt-2 sm:mt-4 flex items-end justify-between'>
          <div className='flex flex-col'>
            <p className='text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight'>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            
            {/* Description */}
            {description && (
              <p className='text-[10px] sm:text-xs text-muted-foreground line-clamp-1 mt-1 font-medium'>
                {description}
              </p>
            )}
          </div>

          {/* Trend Indicator */}
          {trend && trend.value > 0 && (
            <div className='flex flex-col items-end gap-1'>
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold',
                  trend.isPositive
                    ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50'
                    : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/50'
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className='h-3 w-3 sm:h-3.5 sm:w-3.5' />
                ) : (
                  <TrendingDown className='h-3 w-3 sm:h-3.5 sm:w-3.5' />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </span>
              <span className='text-[9px] text-muted-foreground hidden sm:inline-block font-medium'>
                vs last month
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className='absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-primary/20' />
    </div>
  );
});

DashboardCard.displayName = 'DashboardCard';