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
        'group relative overflow-hidden rounded-xl bg-card transition-all duration-300 bm-interactive shadow-none',
        'p-5 sm:p-7',
        className
      )}
    >
      {/* Content */}
      <div className='relative z-10'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <p className='text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground'>
            {title}
          </p>
          {Icon && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-muted/40 border-1 border-card-foreground/10 transition-all duration-300 group-hover:bg-background group-hover:border-card-foreground/20">
              <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', colors.iconColor)} />
            </div>
          )}
        </div>

        {/* Value */}
        <div className='mt-2 sm:mt-4 flex items-end justify-between'>
          <div className='flex flex-col min-w-0'>
            <p className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
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
            <div className='flex flex-col items-end gap-1 shrink-0'>
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider border',
                  trend.isPositive
                    ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-red-600 bg-red-500/10 border-red-500/20'
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
                vs period
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

DashboardCard.displayName = 'DashboardCard';