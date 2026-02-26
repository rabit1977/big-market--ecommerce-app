import { getMyListingsAction } from '@/actions/listing-actions';
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

  const [wishlistResult, listingsResult] = await Promise.all([
      getWishlistAction(),
      getMyListingsAction(),
  ]);
  
  const wishlist = wishlistResult.wishlist ?? [];
  const userListings = listingsResult.listings ?? [];

  const stats = {
    totalListings: userListings.length,
    activeListings: userListings.filter((l: any) => l.status === 'ACTIVE').length,
    wishlistItemsCount: wishlist.length,
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <AuthGuard>
      <div className='min-h-screen bg-muted/20 pb-12 pt-4 md:pt-6'>
        <div className='container-wide space-y-5 md:space-y-8'>
          {/* Breadcrumbs */}
          <div className="px-1">
            <AppBreadcrumbs />
          </div>

          {/* Profile Header Card */}
          <header className='bg-card border border-border rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm'>
             <div className='flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 text-center sm:text-left'>
               {/* Avatar */}
               <div className='relative shrink-0'>
                 <Avatar className='w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl md:rounded-2xl shadow-sm ring-2 md:ring-4 ring-background'>
                   <AvatarFallback className='text-xl sm:text-3xl font-bold bg-muted text-foreground uppercase'>
                     {userInitials}
                   </AvatarFallback>
                 </Avatar>
                 <div className='absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border-2 sm:border-[3px] border-card' />
               </div>

               {/* User Info */}
               <div className='flex-1 space-y-2 sm:space-y-3 min-w-0'>
                 <div className="space-y-0.5">
                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                     <h1 className='text-xl sm:text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter truncate'>
                        {user?.name || 'My Account'}
                     </h1>
                     <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        {user?.role || 'User'}
                     </Badge>
                   </div>
                   <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                     {user?.email}
                   </p>
                 </div>

                 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                   <div className='flex items-center gap-1.5'>
                     <Calendar className='h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary' />
                     <span>Joined {memberSince}</span>
                   </div>
                   {stats.totalListings > 0 && (
                     <div className='flex items-center gap-1.5'>
                       <Package className='h-3 w-3 sm:h-3.5 w-3.5 text-primary' />
                       <span>{stats.totalListings} Listings</span>
                     </div>
                   )}
                 </div>
               </div>

               {/* Action Button */}
               <div className='w-full sm:w-auto'>
                 <Link href='/account/edit'>
                   <Button
                     size="default"
                     className='w-full sm:w-auto px-5 md:px-8 rounded-xl font-bold shadow-sm'
                   >
                     <Settings className='h-3.5 w-3.5 mr-1.5' />
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
          />

          {/* Business & Account Sections */}
          <div className='grid lg:grid-cols-12 gap-4 sm:gap-6 items-start'>
            {/* Left Main Content */}
            <div className='lg:col-span-8 space-y-4 sm:space-y-6'>
              
              {/* Account Information Card */}
              <div className='bg-card border border-border rounded-2xl md:rounded-3xl overflow-hidden shadow-sm'>
                  <div className='px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50 bg-muted/50'>
                    <h2 className='text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2'>
                        <ShieldCheck className="h-3.5 w-3.5 text-primary"/>
                        Personal Details
                    </h2>
                  </div>
                  <div className='p-4 sm:p-6 grid grid-cols-2 gap-4 sm:gap-6'>
                    {[
                      { label: 'Full Name', value: user?.name, default: 'Not set' },
                      { label: 'Email', value: user?.email, default: 'Not set' },
                      { label: 'Role', value: user?.role, default: 'Standard User', capitalize: true },
                      { label: 'Member Since', value: memberSince },
                    ].map((item, i) => (
                      <div key={i} className='space-y-0.5 sm:space-y-1'>
                        <p className='text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                          {item.label}
                        </p>
                        <p className={`text-sm sm:text-base font-semibold text-foreground truncate ${item.capitalize ? 'capitalize' : ''}`}>
                          {item.value || item.default}
                        </p>
                      </div>
                    ))}
                  </div>
              </div>

              {/* Security & Settings Quick Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                 <Link href="/account/password" className="group">
                    <div className="bg-card border border-border p-4 sm:p-5 rounded-2xl group-hover:border-primary/50 transition-all flex items-center gap-3 hover:shadow-sm">
                       <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                       </div>
                       <div className='min-w-0'>
                          <p className="font-bold text-foreground text-xs sm:text-sm truncate">Security</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Password</p>
                       </div>
                    </div>
                 </Link>
                 <Link href="/account/verification" className="group">
                    <div className="bg-card border border-border p-4 sm:p-5 rounded-2xl group-hover:border-primary/50 transition-all flex items-center gap-3 hover:shadow-sm">
                       <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                       </div>
                       <div className='min-w-0'>
                          <p className="font-bold text-foreground text-xs sm:text-sm truncate">Verification</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Get verified</p>
                       </div>
                    </div>
                 </Link>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className='lg:col-span-4 space-y-4 sm:space-y-6'>
              {/* Quick Navigation Card */}
              <div className='bg-card border border-border rounded-2xl md:rounded-3xl overflow-hidden shadow-sm'>
                  <div className='px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50 bg-muted/50'>
                    <h3 className='text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground'>Quick Links</h3>
                  </div>
                  <nav className='p-1.5' aria-label='Quick navigation'>
                    {[
                      { href: '/my-listings', icon: Package, label: 'Manage Listings' },
                      { href: '/favorites', icon: Heart, label: 'Saved Favorites' },
                      { href: '/sell', icon: Plus, label: 'Create New Ad' },
                    ].map((item, idx) => (
                      <Link href={item.href} key={idx} className='block group'>
                        <div className='flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-muted transition-colors'>
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                 <item.icon className="h-4 w-4" />
                              </div>
                              <span className='font-semibold text-foreground text-xs sm:text-sm'>{item.label}</span>
                           </div>
                           <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </nav>
              </div>

              {/* Wallet/Credits Preview */}
              <div className='bg-primary/5 border border-primary/10 rounded-2xl md:rounded-3xl p-5 sm:p-6 relative overflow-hidden group'>
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                     <Wallet className="w-20 h-20 sm:w-24 sm:h-24 text-primary" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 pointer-events-none">Account Balance</p>
                  <p className="text-2xl sm:text-3xl font-black mb-5 sm:mb-6 text-foreground">0.00 MKD</p>
                  <Button asChild className="w-full font-bold rounded-xl h-10 sm:h-11 shadow-sm text-sm">
                     <Link href="/wallet/top-up">
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
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
