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
        'group relative overflow-hidden border border-border rounded-lg bg-card shadow-none transition-colors hover:bg-secondary/40',
        'p-4 sm:p-6',
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-secondary border border-border transition-colors group-hover:bg-background">
              <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', colors.iconColor)} />
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
                  'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold border',
                  trend.isPositive
                    ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-red-500 bg-red-500/10 border-red-500/20'
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