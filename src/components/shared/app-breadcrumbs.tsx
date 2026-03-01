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
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

// Map URL segment → translation key in "Breadcrumbs" namespace
const segmentToKey: Record<string, string> = {
  sell:                      'sell',
  account:                   'account',
  edit:                      'edit',
  verification:              'verification',
  password:                  'password',
  delete:                    'delete',
  addresses:                 'addresses',
  notifications:             'notifications',
  wallet:                    'wallet',
  'top-up':                  'top_up',
  'my-listings':             'my_listings',
  stats:                     'stats',
  categories:                'categories',
  favorites:                 'favorites',
  messages:                  'messages',
  listings:                  'listings',
  pricing:                   'pricing',
  premium:                   'premium',
  success:                   'success',
  admin:                     'admin',
  dashboard:                 'dashboard',
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
  const t = useTranslations('Breadcrumbs');
  const isAdmin = pathname.startsWith('/admin');

  // Custom items override (passed in directly — labels are already translated by the caller)
  if (items) {
      return (
        <Breadcrumb className={cn("-mt-1 mb-6 bg-background w-fit max-w-full overflow-hidden", className)}>
            <BreadcrumbList className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex-nowrap overflow-x-auto no-scrollbar">
                <BreadcrumbItem className="shrink-0">
                    <BreadcrumbLink asChild>
                        <Link href={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center gap-1 hover:text-foreground transition-colors">
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
                                    <Link href={item.href} className="hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2">
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
    <Breadcrumb className={cn("mb-6 bg-card px-2 rounded-2xl w-fit max-w-full overflow-hidden py-2 bm-interactive", className)}>
      <BreadcrumbList className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex-nowrap overflow-x-auto no-scrollbar">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink asChild>
            <Link href={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathSegments.map((segment, index) => {
          let href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const originalHref = `/${pathSegments.slice(0, index + 1).join('/')}`;
          
          if (segment === 'admin') href = '/admin/dashboard';
          
          const isLast = index === pathSegments.length - 1;
          
          if (segment === 'admin' && pathname === '/admin/dashboard' && !isLast) {
              return null;
          }

          // Translate the segment if we have a key, else humanize it
          const key = segmentToKey[segment];
          let label: string;
          if (key) {
            // safely try the translation key — fallback to humanized slug
            try {
              label = t(key as any);
            } catch {
              label = segment.replace(/-/g, ' ');
            }
          } else if (segment.length > 20) {
            label = segment.slice(0, 15) + '...';
          } else {
            // Humanize unknown segments (e.g. dynamic IDs, category slugs)
            label = segment.replace(/-/g, ' ');
          }
           
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
