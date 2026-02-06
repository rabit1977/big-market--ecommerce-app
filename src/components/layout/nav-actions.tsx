'use client';

import { getUnreadCountAction } from '@/actions/notification-actions';
import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  BarChart,
  CreditCard,
  Heart,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquare,
  Package,
  Pencil,
  Settings,
  ShieldCheck,
  Star,
  Store,
  Trash,
  User,
  Wallet
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface NavActionsProps {
  initialWishlistCount: number;
}

export const NavActions = ({ initialWishlistCount }: NavActionsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const [wishlistCount, setWishlistCount] = useState(initialWishlistCount);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastSeenAlertCount, setLastSeenAlertCount] = useState(0);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setWishlistCount(initialWishlistCount);
  }, [initialWishlistCount]);

  // Poll for unread notifications
  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadCountAction();
        setNotificationCount(count);
      } catch (error) {
        // Silently fail
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Handle logout
  const handleLogout = useCallback(() => {
    signOut();
  }, []);

  const alertCount = notificationCount; // User Badge only tracks notifications now

  // Handle menu open change
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsDropdownOpen(open);
      if (open) {
        setLastSeenAlertCount(alertCount);
      }
    },
    [alertCount]
  );

  // Render a skeleton loader until the component has mounted on the client
  if (!hasMounted) {
    return (
      <div className='flex items-center gap-1 sm:gap-2'>
        <Skeleton className='h-10 w-10 rounded-full' />
      </div>
    );
  }

  return (
    <div className='flex items-center gap-1 sm:gap-2'>
      {/* Wishlist Heart Icon (Visible on all screens via NavActions) */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
                asChild
                variant='ghost'
                size='icon'
                className='relative hidden md:flex h-9 w-9 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10'
            >
                <Link href="/favorites">
                    <Heart className="h-5 w-5" />
                    <AnimatePresence>
                        {wishlistCount > 0 && (
                            <motion.span
                                key='wishlist-badge'
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-background'
                            >
                                {wishlistCount > 9 ? '9+' : wishlistCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Favorites</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Messages Icon (Visible on md+ screens) */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
                asChild
                variant='ghost'
                size='icon'
                className='relative hidden md:flex h-9 w-9 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10'
            >
                <Link href="/messages">
                    <MessageSquare className={cn("h-5 w-5", notificationCount > 0 && "text-blue-500")} />
                    <AnimatePresence>
                        {notificationCount > 0 && (
                            <motion.span
                                key='messages-badge'
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-background'
                            >
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Messages</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* User Menu */}
      {user ? (
        <DropdownMenu open={isDropdownOpen} onOpenChange={handleOpenChange} modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='relative h-10 w-10 rounded-full hover:bg-muted/50 data-[state=open]:bg-muted/50 ml-1 p-0'
            >
              <UserAvatar
                user={user}
                className='h-9 w-9 border-2 border-background shadow-sm'
              />
              {/* Alert Badge (Notifications only) */}
              <AnimatePresence>
                {alertCount > 0 &&
                  alertCount > lastSeenAlertCount &&
                  !isDropdownOpen && (
                    <motion.span
                      key='user-badge'
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-background'
                    >
                      {alertCount > 9 ? '9+' : alertCount}
                    </motion.span>
                  )}
              </AnimatePresence>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-80 p-0 rounded-xl shadow-xl flex flex-col'
            align='end'
            sideOffset={8}
          >
            <div className='p-4 border-b bg-card'>
               <div className='flex items-start gap-3'>
                  <UserAvatar user={user} className='h-12 w-12 border border-border' />
                  <div className='flex-1 overflow-hidden'>
                     <div className='flex items-center gap-1'>
                        <span className='font-bold text-lg truncate'>
                            {(user as any).accountType === 'COMPANY' && (user as any).companyName 
                                ? (user as any).companyName 
                                : user.name}
                        </span>
                        <BadgeCheck className='w-4 h-4 text-blue-500 fill-blue-500/10' />
                     </div>
                     <div className='text-xs text-muted-foreground truncate'>{user.email}</div>
                  </div>
               </div>
            </div>

            {/* Main Actions */}
            <div className='p-2 grid gap-2'>
               <Button asChild variant="outline" className='justify-between border-blue-200 text-blue-600 hover:bg-blue-50 h-10'>
                  <Link href="/sell">
                     <span className='flex items-center gap-2'><Pencil className='w-4 h-4' /> Post New Listing</span>
                     <span className='text-xs font-normal'>Free</span>
                  </Link>
               </Button>
               <Button asChild variant="outline" className='justify-between border-orange-200 text-orange-600 hover:bg-orange-50 h-10'>
                  <Link href="/premium">
                     <span className='flex items-center gap-2'><Star className='w-4 h-4' /> Become Premium</span>
                  </Link>
               </Button>
            </div>

            <DropdownMenuSeparator />

            {/* Scrollable area for all menu items */}
            <div className='flex-1 overflow-y-auto max-h-[60vh] p-1 overscroll-contain'>
               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5 md:hidden'>
                  <Link href="/" className='flex items-center gap-3'>
                     <Home className='w-4 h-4 text-muted-foreground' />
                     <span className='flex-1'>Home</span>
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5 md:hidden'>
                  <Link href="/listings" className='flex items-center gap-3'>
                     <Store className='w-4 h-4 text-muted-foreground' />
                     <span className='flex-1'>Browse Listings</span>
                  </Link>
               </DropdownMenuItem>
               
               {/* Prominent Messages and Favorites - Hidden on desktop as they are in the header */}
               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5 bg-blue-50/50 my-1 md:hidden'>
                  <Link href="/messages" className='flex items-center gap-3 font-bold text-blue-900'>
                     <MessageSquare className='w-4 h-4 text-blue-600' />
                     <span className='flex-1'>My Messages</span>
                     {notificationCount > 0 && <Badge className='h-5 bg-blue-500 hover:bg-blue-600'>{notificationCount}</Badge>}
                  </Link>
               </DropdownMenuItem>

               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5 bg-rose-50/50 my-1 md:hidden'>
                  <Link href="/favorites" className='flex items-center gap-3 font-bold text-rose-900'>
                     <Heart className='w-4 h-4 text-rose-600' />
                     <span className='flex-1'>Favorites</span>
                  </Link>
               </DropdownMenuItem>

               <DropdownMenuSeparator className="my-1" />

               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5'>
                  <Link href="/account/verification" className='flex items-center gap-3'>
                     <ShieldCheck className='w-4 h-4 text-muted-foreground' />
                     <span className='flex-1'>Verification</span>
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5'>
                  <Link href="/wallet/top-up" className='flex items-center gap-3'>
                     <Wallet className='w-4 h-4 text-muted-foreground' />
                     <span className='flex-1'>Top up account</span>
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5'>
                  <Link href="/wallet" className='flex items-center gap-3'>
                     <CreditCard className='w-4 h-4 text-muted-foreground' />
                     <span className='flex-1'>Account overview</span>
                  </Link>
               </DropdownMenuItem>

               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5 my-1 bg-amber-50/50 border border-amber-100'>
                  <Link href="/my-listings" className='flex items-center gap-3 font-bold text-amber-900'>
                     <Package className='w-4 h-4 text-amber-600' />
                     <span className='flex-1'>My Listings</span>
                  </Link>
               </DropdownMenuItem>
               
               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5'>
                  <Link href="/my-listings/stats" className='flex items-center gap-3'>
                     <BarChart className='w-4 h-4 text-muted-foreground' />
                     <span className='flex-1'>Ad Statistics</span>
                  </Link>
               </DropdownMenuItem>

               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5'>
                  <Link href="/account" className='flex items-center gap-3'>
                     <Settings className='w-4 h-4 text-muted-foreground' />
                     <span className='flex-1'>Edit Profile</span>
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5'>
                  <Link href="/account/password" className='flex items-center gap-3'>
                     <Lock className='w-4 h-4 text-muted-foreground' />
                     <span className='flex-1'>Change Password</span>
                  </Link>
               </DropdownMenuItem>
               
               {user.role === 'ADMIN' && (
                 <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5 text-blue-600'>
                    <Link href="/admin/dashboard" className='flex items-center gap-3 font-bold'>
                       <LayoutDashboard className='w-4 h-4' />
                       <span className='flex-1'>Admin Panel</span>
                    </Link>
                 </DropdownMenuItem>
               )}

               <DropdownMenuItem asChild className='rounded-md focus:bg-muted py-2.5 text-muted-foreground hover:text-destructive'>
                  <Link href="/account/delete" className='flex items-center gap-3'>
                     <Trash className='w-4 h-4' />
                     <span className='flex-1'>Delete Account</span>
                  </Link>
               </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            {/* Footer */}
            <div className='p-2'>
               <Button 
                 onClick={handleLogout}
                 variant="outline" 
                 className='w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
               >
                 <LogOut className='w-4 h-4 mr-2' />
                 Log out
               </Button>
            </div>

          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='h-10 px-4 rounded-full font-bold hover:bg-muted ml-2'
        >
          <Link href='/auth'>
            <User className='h-4 w-4 mr-2' />
            Login
          </Link>
        </Button>
      )}
    </div>
  );
};
