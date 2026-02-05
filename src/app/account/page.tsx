import { getMyListingsAction } from '@/actions/listing-actions';
import { getMyMessagesAction } from '@/actions/message-actions';
import { getWishlistAction } from '@/actions/wishlist-actions';
import { auth } from '@/auth';
import { AccountStats } from '@/components/account/AccountStats';
import AuthGuard from '@/components/auth/auth-guard';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BadgeCheck,
  Calendar,
  ChevronRight,
  Heart,
  MessageSquare,
  Package,
  Plus,
  Settings,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import Link from 'next/link';

const AccountPage = async () => {
  const session = await auth();
  const user = session?.user;

  // Fetch real user data from Convex
  const [wishlistResult, listingsResult, messagesResult] = await Promise.all([
      getWishlistAction(),
      getMyListingsAction(),
      getMyMessagesAction()
  ]);
  
  const wishlist = wishlistResult.wishlist ?? [];
  const userListings = listingsResult.listings ?? [];
  const messages = messagesResult.messages ?? [];

  // Calculate statistics for classifieds
  const stats = {
    totalListings: userListings.length,
    activeListings: userListings.filter((l: any) => l.status === 'ACTIVE').length,
    wishlistItemsCount: wishlist.length,
    messagesCount: messages.length,
  };

  // Format member since date
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  // Get user initials for avatar
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <AuthGuard>
      <div className='min-h-screen bg-slate-50 dark:bg-slate-950 pb-20'>
        {/* Simple Top Banner */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-primary/10 via-violet-500/5 to-primary/10 border-b border-primary/5" />

        <div className='container-wide -mt-16 sm:-mt-24 relative z-10 space-y-6 sm:space-y-8'>
          {/* Breadcrumbs - Simplified */}
          <div className="px-2">
            <AppBreadcrumbs />
          </div>

          {/* Profile Header Card */}
          <header className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm'>
             <div className='flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 text-center sm:text-left'>
               {/* Avatar */}
               <div className='relative shrink-0'>
                 <Avatar className='w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-lg ring-4 ring-white dark:ring-slate-900'>
                   <AvatarFallback className='text-3xl sm:text-4xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase'>
                     {userInitials}
                   </AvatarFallback>
                 </Avatar>
                 <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-[3px] border-white dark:border-slate-900' />
               </div>

               {/* User Info */}
               <div className='flex-1 space-y-4'>
                 <div className="space-y-1">
                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                     <h1 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight'>
                        {user?.name || 'My Account'}
                     </h1>
                     <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-2 py-0">
                        {user?.role || 'User'}
                     </Badge>
                   </div>
                   <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                     {user?.email}
                   </p>
                 </div>

                 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                   <div className='flex items-center gap-1.5'>
                     <Calendar className='h-3.5 w-3.5' />
                     <span>Joined {memberSince}</span>
                   </div>
                   {stats.totalListings > 0 && (
                     <div className='flex items-center gap-1.5'>
                       <Package className='h-3.5 w-3.5' />
                       <span>{stats.totalListings} Listings</span>
                     </div>
                   )}
                 </div>
               </div>

               {/* Action Button */}
               <div className='w-full sm:w-auto mt-4 sm:mt-0'>
                 <Link href='/account/edit'>
                   <Button
                     className='w-full sm:w-auto h-11 px-8 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all'
                   >
                     <Settings className='h-4 w-4 mr-2' />
                     Edit Profile
                   </Button>
                 </Link>
               </div>
             </div>
          </header>

          {/* Quick Stats Grid */}
          <AccountStats
             totalListings={stats.totalListings}
             activeListings={stats.activeListings}
             wishlistItems={stats.wishlistItemsCount}
             messagesCount={stats.messagesCount}
          />

          {/* Business & Account Sections */}
          <div className='grid lg:grid-cols-12 gap-6 sm:gap-8 items-start'>
            {/* Left Main Content */}
            <div className='lg:col-span-8 space-y-6 sm:space-y-8'>
              
              {/* Account Information Card */}
              <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden'>
                  <div className='px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50'>
                    <h2 className='text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 flex items-center gap-2'>
                        <ShieldCheck className="h-4 w-4 text-primary"/>
                        Personal Details
                    </h2>
                  </div>
                  <div className='p-6 sm:p-8 grid sm:grid-cols-2 gap-6 sm:gap-8'>
                    {[
                      { label: 'Full Name', value: user?.name, default: 'Not set' },
                      { label: 'Email Address', value: user?.email, default: 'Not set' },
                      { label: 'Account Identity', value: user?.role, default: 'Standard User', capitalize: true },
                      { label: 'Member Since', value: memberSince },
                    ].map((item, i) => (
                      <div key={i} className='space-y-1.5'>
                        <p className='text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest'>
                          {item.label}
                        </p>
                        <p className={`text-base font-semibold text-slate-900 dark:text-white ${item.capitalize ? 'capitalize' : ''}`}>
                          {item.value || item.default}
                        </p>
                      </div>
                    ))}
                  </div>
              </div>

              {/* Security & Settings Quick Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                 <Link href="/account/password" className="group">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl group-hover:border-primary/50 transition-colors flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">Security & Password</p>
                          <p className="text-xs text-slate-500">Manage your password and access</p>
                       </div>
                    </div>
                 </Link>
                 <Link href="/account/verification" className="group">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl group-hover:border-primary/50 transition-colors flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
                          <BadgeCheck className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">Account Verification</p>
                          <p className="text-xs text-slate-500">Get your blue badge verification</p>
                       </div>
                    </div>
                 </Link>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className='lg:col-span-4 space-y-6 sm:space-y-8'>
              {/* Quick Navigation Card */}
              <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden'>
                  <div className='px-6 py-5 border-b border-slate-100 dark:border-slate-800'>
                    <h3 className='text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400'>Quick Links</h3>
                  </div>
                  <nav className='p-2' aria-label='Quick navigation'>
                    {[
                      { href: '/my-listings', icon: Package, label: 'Manage Listings' },
                      { href: '/favorites', icon: Heart, label: 'Saved Favorites' },
                      { href: '/messages', icon: MessageSquare, label: 'Messages Center' },
                      { href: '/sell', icon: Plus, label: 'Create New Ad' },
                    ].map((item, idx) => (
                      <Link href={item.href} key={idx} className='block group'>
                        <div className='flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'>
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">
                                 <item.icon className="h-4 w-4" />
                              </div>
                              <span className='font-bold text-slate-700 dark:text-slate-300 text-sm'>{item.label}</span>
                           </div>
                           <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                        </div>
                      </Link>
                    ))}
                  </nav>
              </div>

              {/* Wallet/Credits Preview */}
              <div className='bg-slate-900 dark:bg-primary rounded-3xl p-8 text-white relative overflow-hidden group'>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                     <Wallet className="w-24 h-24" />
                  </div>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1 pointer-events-none">Account Balance</p>
                  <p className="text-3xl font-black mb-6">0.00 MKD</p>
                  <Button asChild className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl h-11 border-none">
                     <Link href="/wallet/top-up">
                        <Plus className="w-4 h-4 mr-2" />
                        Top up balance
                     </Link>
                  </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AccountPage;
