'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const routeMap: Record<string, string> = {
  sell: 'Post Listing',
  account: 'My Account',
  edit: 'Edit Profile',
  verification: 'Account Verification',
  password: 'Change Password',
  delete: 'Delete Account',
  addresses: 'My Addresses',
  notifications: 'Notifications',
  wallet: 'My Wallet',
  'top-up': 'Top Up',
  'my-listings': 'My Listings',
  stats: 'Statistics',
  favorites: 'Favorites',
  messages: 'Messages',
  listings: 'Listings',
  pricing: 'Pricing Plans',
  premium: 'Premium Plans',
  success: 'Success',
  admin: 'Admin Panel',
  dashboard: 'Dashboard',
  'motor-vehicles': 'Motor Vehicles',
  'cars': 'Cars',
  'real-estate': 'Real Estate',
  'home-and-garden': 'Home & Garden',
  'fashion-clothing-shoes': 'Fashion & Clothing',
  'mobile-phones-accessories': 'Mobile Phones',
};

interface AppBreadcrumbsProps {
  className?: string;
  customLabel?: string;
}

export function AppBreadcrumbs({ className, customLabel }: AppBreadcrumbsProps) {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on the home page
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);
  
  return (
    <Breadcrumb className={cn("mb-6 bg-card w-fit px-4 py-2 rounded-full border border-border/60 shadow-sm", className)}>
      <BreadcrumbList className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex-nowrap overflow-x-auto no-scrollbar">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          
          let label = routeMap[segment] || segment.replace(/-/g, ' ');
          
          if (segment.length > 20 && !routeMap[segment]) {
              label = segment.slice(0, 15) + '...';
          }
           
          // If we have a custom label for the last item, use it
          if (isLast && customLabel) {
              label = customLabel;
          }

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator className="opacity-50 shrink-0" />
              <BreadcrumbItem className="shrink-0 whitespace-nowrap">
                {isLast ? (
                  <BreadcrumbPage className="font-black text-foreground line-clamp-1 max-w-[150px] sm:max-w-[300px] truncate">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-2">
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
