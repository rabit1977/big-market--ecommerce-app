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
    iconColor: 'text-primary',
    bgGradient: 'from-primary/5 to-transparent',
    borderColor: 'border-primary/10',
  },
  emerald: {
    iconColor: 'text-emerald-500',
    bgGradient: 'from-emerald-500/5 to-transparent',
    borderColor: 'border-emerald-500/10',
  },
  blue: {
    iconColor: 'text-blue-500',
    bgGradient: 'from-blue-500/5 to-transparent',
    borderColor: 'border-blue-500/10',
  },
  amber: {
    iconColor: 'text-amber-500',
    bgGradient: 'from-amber-500/5 to-transparent',
    borderColor: 'border-amber-500/10',
  },
  rose: {
    iconColor: 'text-rose-500',
    bgGradient: 'from-rose-500/5 to-transparent',
    borderColor: 'border-rose-500/10',
  },
};

/**
 * Mobile-optimized Dashboard stat card component
 */
export const DashboardCard = memo(
  ({
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
          'group relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5',
          'p-4 sm:p-5',
          className,
        )}
      >
        {/* Background Texture/Gradient */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity group-hover:opacity-60',
            colors.bgGradient,
          )}
        />
        <div className='absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 transition-transform group-hover:scale-125' />

        <div className='relative z-10 flex items-center justify-between'>
          {/* Left: Icon & Info */}
          <div className='flex items-center gap-3'>
            {Icon && (
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center bg-background border transition-all duration-300 shadow-sm',
                  colors.borderColor,
                  'group-hover:scale-105',
                )}
              >
                <Icon className={cn('h-5 w-5', colors.iconColor)} />
              </div>
            )}
            <div className='flex flex-col'>
              <p className='text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 group-hover:text-muted-foreground transition-colors'>
                {title}
              </p>
              <h2 className='text-lg sm:text-xl font-black tracking-tighter text-foreground mt-0.5'>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </h2>
            </div>
          </div>

          {/* Right: Trend Indicator */}
          {trend && trend.value > 0 && (
            <div
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black tracking-wider border shadow-sm transition-transform group-hover:scale-105',
                trend.isPositive
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-500/20 dark:bg-emerald-500/10'
                  : 'text-rose-600 bg-rose-50 border-rose-500/20 dark:bg-rose-500/10',
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className='h-3 w-3' />
              ) : (
                <TrendingDown className='h-3 w-3' />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

DashboardCard.displayName = 'DashboardCard';
