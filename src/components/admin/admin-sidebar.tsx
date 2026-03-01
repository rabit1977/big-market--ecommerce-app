'use client';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
    BarChart3,
    CreditCard,
    Home,
    Layers,
    LayoutDashboard,
    LogOut,
    Menu,
    Sparkles,
    Tag,
    Trash2,
    Users
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { AdminNotifications } from './admin-notifications';

interface NavItem {
    href: string;
    label: string;
    icon: any;
    count?: number;
    children?: NavItem[];
}

export const AdminSidebar = () => {
  const pathname = usePathname();
  const t = useTranslations('Admin');
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems: NavItem[] = [
    { href: '/admin/dashboard',          label: t('overview'),           icon: LayoutDashboard },
    { href: '/admin/analytics',          label: t('analytics'),          icon: BarChart3 },
    { href: '/admin/revenue',            label: t('revenue'),            icon: CreditCard },
    { href: '/admin/listings',           label: t('all_listings'),       icon: Tag },
    { href: '/admin/listings/promoted',  label: t('promoted_listings'),  icon: Sparkles },
    { href: '/admin/categories',         label: t('categories'),         icon: Layers },
    { href: '/admin/users',              label: t('users'),              icon: Users },
    { href: '/admin/recycle-bin',        label: t('recycle_bin'),        icon: Trash2 },
  ];

  const bottomNavItems = [
    { href: '/admin/dashboard',   icon: LayoutDashboard, label: t('home_label') },
    { href: '/admin/listings',    icon: Tag,             label: t('listings_label') },
    { href: '/admin/users',       icon: Users,           label: t('users') },
    { href: '/admin/recycle-bin', icon: Trash2,          label: t('bin_label') },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border'>
        <div className='flex items-center h-16 px-6 border-b border-border justify-between'>
            <Link href='/admin/dashboard' className='flex items-center gap-2.5 font-extrabold text-xl tracking-tighter text-foreground transition-all hover:opacity-90'>
                <div className='w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center border border-primary/20'>
                    <LayoutDashboard className='w-5 h-5' />
                </div>
                <span>Admin</span>
            </Link>
            <Button variant="ghost" size="icon" asChild title={t('store')}>
                <Link href="/">
                    <Home className="w-5 h-5" />
                </Link>
            </Button>
        </div>

        <ScrollArea className='flex-1 py-4'>
            <div className='px-4 space-y-1'>
                {navItems.map((item) => {
                    const isActive = item.href === '/admin/listings'
                        ? pathname === '/admin/listings'
                        : pathname === item.href || pathname.startsWith(item.href + '/');
                    return <NavItemLink key={item.href} item={item} isActive={isActive} />;
                })}
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
                        {t('store')}
                    </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })} className='w-full justify-start text-xs h-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30'>
                    <LogOut className='w-3.5 h-3.5 mr-2' />
                    {t('logout')}
                </Button>
            </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className='lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4'>
            <div className='flex items-center gap-2'>
                <Link href='/admin/dashboard' className='font-bold text-lg flex items-center gap-2'>
                    <div className='w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center border border-primary/10'>
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
                        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary fill-primary/10" : "text-muted-foreground")} />
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", isActive ? "text-primary" : "text-muted-foreground")}>{item.label}</span>
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
                    <span className="text-[10px] font-medium">{t('menu')}</span>
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className='h-[85vh] rounded-t-lg p-0 flex flex-col border-t border-border shadow-none'>
                 <div className="p-4 border-b flex items-center justify-between">
                     <SheetTitle>{t('admin_menu')}</SheetTitle>
                 </div>
                 <ScrollArea className="flex-1 p-4">
                     <div className="grid grid-cols-3 gap-4 mb-8">
                         {navItems.map((item) => (
                              <Link
                                 key={item.href}
                                 href={item.href}
                                 onClick={() => setIsMobileMenuOpen(false)}
                                 className={cn(
                                     "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                                     (pathname === item.href || pathname.startsWith(item.href + '/')) 
                                         ? "bg-secondary border-border text-foreground" 
                                         : "bg-card border-border text-muted-foreground"
                                 )}
                              >
                                  <item.icon className={cn("w-5 h-5", (pathname === item.href || pathname.startsWith(item.href + '/')) ? "text-primary" : "text-muted-foreground")} />
                                  <span className="text-[10px] text-center font-bold line-clamp-1 uppercase tracking-widest">{item.label}</span>
                              </Link>
                         ))}
                     </div>
                     
                     <div className="rounded-xl border border-border bg-muted/30 p-4">
                         <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-primary font-bold">
                                 {session?.user?.name?.[0] || 'A'}
                             </div>
                             <div className="overflow-hidden">
                                 <p className="font-bold truncate">{session?.user?.name || 'Admin User'}</p>
                                 <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                             </div>
                         </div>
                         <Button variant="destructive" className='w-full' onClick={() => signOut({ callbackUrl: '/' })}>
                             <LogOut className='w-4 h-4 mr-2' />
                             {t('sign_out')}
                         </Button>
                     </div>
                 </ScrollArea>
            </SheetContent>
        </Sheet>
      </nav>
    </>
  );
};

export const AdminBottomNav = () => null;
export const AdminMobileHeader = () => null;

function NavItemLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
    return (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-200 uppercase tracking-widest',
                isActive 
                    ? 'bg-secondary text-foreground border border-border shadow-none' 
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
            )}
        >
            <item.icon className={cn('w-4.5 h-4.5 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground/40')} />
            {item.label}
            {isActive && <div className="ml-auto w-1 h-4 rounded-full bg-primary" />}
        </Link>
    );
}
