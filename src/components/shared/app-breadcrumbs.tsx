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
  categories: 'Explore Categories',
  favorites: 'Favorites',
  messages: 'Messages',
  'trade-in': 'Trade In',
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

interface BreadcrumbItemType {
    label: string;
    href?: string;
}

interface AppBreadcrumbsProps {
  className?: string;
  customLabel?: string;
  items?: BreadcrumbItemType[];
}

export function AppBreadcrumbs({ className, customLabel, items }: AppBreadcrumbsProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  
  // Custom items override
  if (items) {
      return (
        <Breadcrumb className={cn("mb-6 bg-card w-fit max-w-full overflow-hidden px-4 py-2 rounded-full border border-border mix-blend-mode-screen:normal shadow-sm", className)}>
            <BreadcrumbList className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex-nowrap overflow-x-auto no-scrollbar">
                <BreadcrumbItem className="shrink-0">
                    <BreadcrumbLink asChild>
                        <Link href={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Home className="h-3.5 w-3.5" />
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {items.map((item, index) => (
                    <React.Fragment key={`${item.href || ''}-${index}`}>
                        <BreadcrumbSeparator className="opacity-50 shrink-0" />
                        <BreadcrumbItem className="shrink-0 whitespace-nowrap">
                            {!item.href ? (
                                <BreadcrumbPage className="font-black text-foreground line-clamp-1 max-w-fit sm:max-w-fit truncate">
                                    {item.label}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href} className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-2">
                                        {item.label}
                                    </Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
      );
  }

  // Don't show breadcrumbs on the home page
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);
  
  return (
    <Breadcrumb className={cn("mb-6 bg-card w-fit max-w-full overflow-hidden px-4 py-2 rounded-full border border-border mix-blend-mode-screen:normal shadow-sm", className)}>
      <BreadcrumbList className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex-nowrap overflow-x-auto no-scrollbar">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink asChild>
            <Link href={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathSegments.map((segment, index) => {
          let href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          
          // Original href before mapping, used to check if we should skip rendering
          const originalHref = `/${pathSegments.slice(0, index + 1).join('/')}`;
          
          // Special case for admin root to avoid 404
          if (segment === 'admin') href = '/admin/dashboard';
          
          const isLast = index === pathSegments.length - 1;
          
          // If we are at /admin and current segment is admin, and it's last, show it.
          // If we are at /admin/dashboard, and current segment is 'admin', it will point to /admin/dashboard.
          // The next segment 'dashboard' will also point to /admin/dashboard.
          // To avoid visual duplication when both point to same place:
          if (segment === 'admin' && pathname === '/admin/dashboard' && !isLast) {
              return null;
          }

          let label = routeMap[segment] || segment.replace(/-/g, ' ');
          
          if (segment.length > 20 && !routeMap[segment]) {
              label = segment.slice(0, 15) + '...';
          }
           
          // If we have a custom label for the last item, use it
          if (isLast && customLabel) {
              label = customLabel;
          }

          return (
            <React.Fragment key={`${originalHref}-${index}`}>
              <BreadcrumbSeparator className="opacity-50 shrink-0" />
              <BreadcrumbItem className="shrink-0 whitespace-nowrap">
                {isLast ? (
                  <BreadcrumbPage className="font-black text-foreground line-clamp-1 max-w-fit sm:max-w-fit truncate">
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
