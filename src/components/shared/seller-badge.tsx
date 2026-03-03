'use client';

import { cn } from '@/lib/utils';
import { BadgeCheck } from 'lucide-react';

interface SellerBadgeProps {
  seller?: {
    isVerified?: boolean;
    accountStatus?: string;
    membershipTier?: string;
    accountType?: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function SellerBadge({ seller, className, size = 'md', showLabel = false }: SellerBadgeProps) {
  if (!seller) return null;

  // Logic: User is "Verified" if explicitly verified OR if they are ACTIVE (approved by admin)
  const isVerified = seller.isVerified || seller.accountStatus === 'ACTIVE';
  const isBusiness = seller.membershipTier === 'BUSINESS' || seller.accountType === 'COMPANY';

  if (!isVerified) return null;

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  const containerSizes = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (isBusiness) {
    return (
      <div className="flex items-center gap-1.5">
        <div 
          className={cn(
            "flex items-center justify-center rounded-full bg-amber-400/10 backdrop-blur-xs shadow-[0_0_8px_rgba(251,191,36,0.1)] transition-all duration-300", 
            containerSizes[size],
            className
          )} 
          title="Verified Store"
        >
          <BadgeCheck className={cn("text-amber-500 fill-amber-500/20", iconSizes[size])} />
        </div>
        {showLabel && (
          <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tighter">Store</span>
        )}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full bg-blue-400/10 backdrop-blur-xs shadow-[0_0_8px_rgba(59,130,246,0.1)] transition-all duration-300", 
        containerSizes[size],
        className
      )} 
      title="Verified User"
    >
      <BadgeCheck className={cn("text-blue-500 fill-blue-500/20", iconSizes[size])} />
    </div>
  );
}
