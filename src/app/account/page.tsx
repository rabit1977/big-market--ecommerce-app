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
      <div className='min-h-screen bg-muted/30 pb-20 pt-24'>
        <div className='container-wide space-y-8'>
          {/* Breadcrumbs */}
          <div className="px-1">
            <AppBreadcrumbs />
          </div>

          {/* Profile Header Card */}
          <header className='bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm'>
             <div className='flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 text-center sm:text-left'>
               {/* Avatar */}
               <div className='relative shrink-0'>
                 <Avatar className='w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-sm ring-4 ring-background'>
                   <AvatarFallback className='text-3xl sm:text-4xl font-bold bg-muted text-foreground uppercase'>
                     {userInitials}
                   </AvatarFallback>
                 </Avatar>
                 <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-[3px] border-card' />
               </div>

               {/* User Info */}
               <div className='flex-1 space-y-4'>
                 <div className="space-y-1">
                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                     <h1 className='text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tighter'>
                        {user?.name || 'My Account'}
                     </h1>
                     <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold px-2.5 py-0.5 rounded-md">
                        {user?.role || 'User'}
                     </Badge>
                   </div>
                   <p className="text-base font-medium text-muted-foreground">
                     {user?.email}
                   </p>
                 </div>

                 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                   <div className='flex items-center gap-2'>
                     <Calendar className='h-4 w-4 text-primary' />
                     <span>Joined {memberSince}</span>
                   </div>
                   {stats.totalListings > 0 && (
                     <div className='flex items-center gap-2'>
                       <Package className='h-4 w-4 text-primary' />
                       <span>{stats.totalListings} Listings</span>
                     </div>
                   )}
                 </div>
               </div>

               {/* Action Button */}
               <div className='w-full sm:w-auto mt-4 sm:mt-0'>
                 <Link href='/account/edit'>
                   <Button
                     size="lg"
                     className='w-full sm:w-auto px-8 rounded-xl font-bold shadow-lg shadow-primary/20'
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
              <div className='bg-card border border-border rounded-3xl overflow-hidden shadow-sm'>
                  <div className='px-6 py-5 border-b border-border/50 bg-muted/50'>
                    <h2 className='text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2'>
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
                        <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                          {item.label}
                        </p>
                        <p className={`text-base font-semibold text-foreground ${item.capitalize ? 'capitalize' : ''}`}>
                          {item.value || item.default}
                        </p>
                      </div>
                    ))}
                  </div>
              </div>

              {/* Security & Settings Quick Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                 <Link href="/account/password" className="group">
                    <div className="bg-card border border-border p-6 rounded-3xl group-hover:border-primary/50 transition-all flex items-center gap-4 hover:shadow-md">
                       <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                          <ShieldCheck className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="font-bold text-foreground text-sm">Security & Password</p>
                          <p className="text-xs text-muted-foreground">Manage your password</p>
                       </div>
                    </div>
                 </Link>
                 <Link href="/account/verification" className="group">
                    <div className="bg-card border border-border p-6 rounded-3xl group-hover:border-primary/50 transition-all flex items-center gap-4 hover:shadow-md">
                       <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                          <BadgeCheck className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="font-bold text-foreground text-sm">Account Verification</p>
                          <p className="text-xs text-muted-foreground">Get verified status</p>
                       </div>
                    </div>
                 </Link>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className='lg:col-span-4 space-y-6 sm:space-y-8'>
              {/* Quick Navigation Card */}
              <div className='bg-card border border-border rounded-3xl overflow-hidden shadow-sm'>
                  <div className='px-6 py-5 border-b border-border/50 bg-muted/50'>
                    <h3 className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>Quick Links</h3>
                  </div>
                  <nav className='p-2' aria-label='Quick navigation'>
                    {[
                      { href: '/my-listings', icon: Package, label: 'Manage Listings' },
                      { href: '/favorites', icon: Heart, label: 'Saved Favorites' },
                      { href: '/messages', icon: MessageSquare, label: 'Messages Center' },
                      { href: '/sell', icon: Plus, label: 'Create New Ad' },
                    ].map((item, idx) => (
                      <Link href={item.href} key={idx} className='block group'>
                        <div className='flex items-center justify-between p-3 rounded-2xl hover:bg-muted transition-colors'>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                 <item.icon className="h-5 w-5" />
                              </div>
                              <span className='font-bold text-foreground text-sm'>{item.label}</span>
                           </div>
                           <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </nav>
              </div>

              {/* Wallet/Credits Preview */}
              <div className='bg-primary/5 border border-primary/10 rounded-3xl p-8 relative overflow-hidden group'>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                     <Wallet className="w-32 h-32 text-primary" />
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 pointer-events-none">Account Balance</p>
                  <p className="text-4xl font-black mb-8 text-foreground">0.00 MKD</p>
                  <Button asChild className="w-full font-bold rounded-xl h-12 shadow-lg shadow-primary/20">
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
