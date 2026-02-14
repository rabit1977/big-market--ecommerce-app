'use client';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    BarChart3,
    CreditCard,
    Headset,
    Home,
    Layers,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageCircle,
    Sparkles,
    Tag,
    Users
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { AdminNotifications } from './admin-notifications';
import React from 'react';

interface NavItem {
    href: string;
    label: string;
    icon: any;
    count?: number;
    children?: NavItem[];
}

const navItems: NavItem[] = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/revenue', label: 'Revenue', icon: CreditCard },
    { href: '/admin/listings', label: 'All Listings', icon: Tag },
    { href: '/admin/listings?promoted=true', label: 'Promoted Listings', icon: Sparkles },
    { href: '/admin/categories', label: 'Categories', icon: Layers },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/support', label: 'Support Inquiries', icon: Headset },
    { href: '/admin/messages', label: 'Q&A', icon: MessageCircle },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Filter items for bottom nav (limit to 4) + Menu
  const bottomNavItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/admin/listings', icon: Tag, label: 'Listings' },
    { href: '/admin/categories', icon: Layers, label: 'Cats' },
    { href: '/admin/users', icon: Users, label: 'Users' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border'>
        <div className='flex items-center h-16 px-6 border-b border-border justify-between'>
            <Link href='/admin/dashboard' className='flex items-center gap-2 font-bold text-lg tracking-tight'>
                <div className='w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center'>
                    <LayoutDashboard className='w-5 h-5' />
                </div>
                <span>Admin</span>
            </Link>
            <Button variant="ghost" size="icon" asChild title="Go to Website">
                <Link href="/">
                    <Home className="w-5 h-5" />
                </Link>
            </Button>
        </div>

        <ScrollArea className='flex-1 py-4'>
            <div className='px-4 space-y-1'>
                {navItems.map((item) => (
                    <NavItem key={item.href} item={item} isActive={pathname === item.href || pathname.startsWith(item.href + '/')} />
                ))}
            </div>
        </ScrollArea>

        <div className='p-4 border-t border-border mt-auto'>
            <div className='flex items-center gap-3 p-2 rounded-lg bg-muted/50 mb-4'>
                <AdminNotifications user={session?.user} />
                <div className='flex-1 overflow-hidden'>
                    <p className='text-sm font-medium truncate'>{session?.user?.name || 'Admin'}</p>
                    <p className='text-xs text-muted-foreground truncate'>{session?.user?.email}</p>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <Button variant="outline" size="sm" asChild className='w-full justify-start text-xs h-8'>
                    <Link href="/">
                        <Home className='w-3.5 h-3.5 mr-2' />
                        Store
                    </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => signOut()} className='w-full justify-start text-xs h-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30'>
                    <LogOut className='w-3.5 h-3.5 mr-2' />
                    Logout
                </Button>
            </div>
        </div>
      </aside>

      {/* Mobile Top Header (Minimal) */}
      <header className='lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4'>
            <div className='flex items-center gap-2'>
                <Link href='/admin/dashboard' className='font-bold text-lg flex items-center gap-2'>
                    <div className='w-7 h-7 rounded bg-primary text-primary-foreground flex items-center justify-center'>
                         <LayoutDashboard className='w-4 h-4' />
                    </div>
                    <span className="text-sm">Admin</span>
                </Link>
            </div>
            <div className='flex items-center gap-2'>
                <AdminNotifications user={session?.user} />
                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 rounded-full">
                     <Link href="/">
                        <Home className="w-4 h-4" />
                     </Link>
                </Button>
            </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className='lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t border-border flex items-center justify-around px-2 pb-safe'>
        {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
            );
        })}
        
        {/* More / Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground transition-colors',
                        isMobileMenuOpen && 'text-primary'
                    )}
                >
                    <Menu className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className='h-[85vh] rounded-t-2xl p-0 flex flex-col'>
                 <div className="p-4 border-b flex items-center justify-between">
                     <SheetTitle>Admin Menu</SheetTitle>
                     {/* Close button is auto-added by SheetContent usually, but title is needed for a11y */}
                 </div>
                 <ScrollArea className="flex-1 p-4">
                     <div className="grid grid-cols-3 gap-4 mb-8">
                         {navItems.map((item) => (
                             <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border bg-card hover:bg-muted/50 transition-all",
                                    (pathname === item.href || pathname.startsWith(item.href + '/')) 
                                        ? "border-primary/50 bg-primary/5 text-primary" 
                                        : "border-border"
                                )}
                             >
                                 <item.icon className="w-6 h-6" />
                                 <span className="text-xs text-center font-medium line-clamp-1">{item.label}</span>
                             </Link>
                         ))}
                     </div>
                     
                     <div className="rounded-xl border border-border bg-muted/30 p-4">
                         <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                 {session?.user?.name?.[0] || 'A'}
                             </div>
                             <div className="overflow-hidden">
                                 <p className="font-bold truncate">{session?.user?.name || 'Admin User'}</p>
                                 <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                             </div>
                         </div>
                         <Button variant="destructive" className='w-full' onClick={() => signOut()}>
                             <LogOut className='w-4 h-4 mr-2' />
                             Sign Out
                         </Button>
                     </div>
                 </ScrollArea>
            </SheetContent>
        </Sheet>
      </nav>
    </>
  );
};

export const AdminBottomNav = () => null; // Removed in favor of pure Sidebar/Drawer approach for enterprise feel
export const AdminMobileHeader = () => null; // Integrated into main component

function NavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
    return (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
        >
            <item.icon className={cn('w-4 h-4', isActive && 'text-primary')} />
            {item.label}
            {isActive && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </Link>
    );
}
