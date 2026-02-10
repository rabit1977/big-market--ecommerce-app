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
  listings: 'Browse Listings',
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
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const label = (isLast && customLabel) ? customLabel : (routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '));

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-bold text-foreground line-clamp-1">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="hover:text-primary transition-colors capitalize">
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
