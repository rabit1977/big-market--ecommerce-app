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
  violet: { iconColor: 'text-primary'    },
  emerald: { iconColor: 'text-emerald-500' },
  blue:    { iconColor: 'text-blue-500'    },
  amber:   { iconColor: 'text-amber-500'   },
  rose:    { iconColor: 'text-rose-500'    },
};

/**
 * Mobile-optimized Dashboard stat card component
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
        'stat-card group relative overflow-hidden border border-border rounded-lg bg-card',
        'p-4 sm:p-6', // Smaller padding on mobile
        className
      )}
    >
      {/* Content */}
      <div className='relative z-10'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <p className='text-xs sm:text-sm font-medium text-muted-foreground'>
            {title}
          </p>
          {Icon && (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center bg-secondary border border-border transition-colors group-hover:bg-muted">
              <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', colors.iconColor)} />
            </div>
          )}
        </div>

        {/* Value */}
        <div className='mt-2 sm:mt-4 flex items-end justify-between'>
          <div className='flex flex-col'>
            <p className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight'>
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
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold leading-none',
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
    </div>
  );
});

DashboardCard.displayName = 'DashboardCard';