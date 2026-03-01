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
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

const AccountPage = async () => {
  const session = await auth();
  const user = session?.user;
  const t = await getTranslations('Account');

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

  const quickNavItems = [
    { href: '/my-listings', icon: Package, label: t('manage_listings') },
    { href: '/favorites',   icon: Heart,   label: t('saved_favorites') },
    { href: '/sell',        icon: Plus,    label: t('create_new_ad') },
  ];

  const detailFields = [
    { label: t('full_name'),    value: user?.name,      default: t('not_set') },
    { label: t('email'),        value: user?.email,     default: t('not_set') },
    { label: t('role'),         value: user?.role,      default: t('standard_user'), capitalize: true },
    { label: t('member_since'), value: memberSince },
  ];

  return (
    <AuthGuard>
      <div className='min-h-screen bg-muted/20 pb-12 pt-4 md:pt-6'>
        <div className='container-wide space-y-5 md:space-y-8'>
          {/* Breadcrumbs */}
          <div className="px-1">
            <AppBreadcrumbs />
          </div>

          {/* Profile Header Card */}
          <header className='bg-card rounded-2xl p-4 sm:p-6 md:p-8 bm-interactive shadow-none'>
             <div className='flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 text-center sm:text-left'>
               {/* Avatar */}
               <div className='relative shrink-0'>
                 <Avatar className='w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl shadow-sm ring-2 md:ring-4 ring-background'>
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
                        {user?.name || t('manage_listings')}
                     </h1>
                     <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold px-2 py-0.5 rounded-xl text-[10px]">
                        {user?.role || t('standard_user')}
                     </Badge>
                   </div>
                   <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                     {user?.email}
                   </p>
                 </div>

                 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                   <div className='flex items-center gap-1.5'>
                     <Calendar className='h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary' />
                     <span>{t('joined')} {memberSince}</span>
                   </div>
                   {stats.totalListings > 0 && (
                     <div className='flex items-center gap-1.5'>
                       <Package className='h-3 w-3 sm:h-3.5 w-3.5 text-primary' />
                       <span>{stats.totalListings} {t('listings')}</span>
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
                     {t('edit_profile')}
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
              <div className='bg-card border border-border/60 rounded-2xl md:rounded-2xl overflow-hidden shadow-sm'>
                  <div className='px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50 bg-muted/50'>
                    <h2 className='text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2'>
                        <ShieldCheck className="h-3.5 w-3.5 text-primary"/>
                        {t('personal_details')}
                    </h2>
                  </div>
                  <div className='p-6 sm:p-8 grid grid-cols-2 gap-6 sm:gap-8'>
                    {detailFields.map((item, i) => (
                      <div key={i} className='space-y-1 sm:space-y-2'>
                        <p className='text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest'>
                          {item.label}
                        </p>
                        <p className={`text-base sm:text-lg font-black text-foreground truncate ${item.capitalize ? 'capitalize' : ''}`}>
                          {item.value || item.default}
                        </p>
                      </div>
                    ))}
                  </div>
              </div>

              {/* Security & Settings Quick Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Link href="/account/password" className="group">
                    <div className="bg-card p-5 sm:p-6 rounded-2xl transition-all flex items-center gap-4 bm-interactive shadow-none">
                       <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10 transition-colors group-hover:bg-primary/20">
                          <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                       </div>
                       <div className='min-w-0'>
                          <p className="font-black text-foreground text-xs sm:text-sm uppercase tracking-widest truncate">{t('security')}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground font-bold truncate">{t('update_password')}</p>
                       </div>
                    </div>
                 </Link>
                 <Link href="/account/verification" className="group">
                    <div className="bg-card p-5 sm:p-6 rounded-2xl transition-all flex items-center gap-4 bm-interactive shadow-none">
                       <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10 transition-colors group-hover:bg-primary/20">
                          <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                       </div>
                       <div className='min-w-0'>
                          <p className="font-black text-foreground text-xs sm:text-sm uppercase tracking-widest truncate">{t('verification')}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground font-bold truncate">{t('identity_check')}</p>
                       </div>
                    </div>
                 </Link>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className='lg:col-span-4 space-y-4 sm:space-y-6'>
              {/* Quick Navigation Card */}
               <div className='bg-card rounded-2xl md:rounded-2xl overflow-hidden bm-interactive shadow-none'>
                  <div className='px-4 sm:px-6 py-4 border-b border-border/50 bg-muted/30'>
                    <h3 className='text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground'>{t('quick_navigation')}</h3>
                  </div>
                  <nav className='p-2' aria-label='Quick navigation'>
                    {quickNavItems.map((item, idx) => (
                      <Link href={item.href} key={idx} className='block group'>
                        <div className='flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all duration-200'>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors border border-border/10">
                                 <item.icon className="h-5 w-5" />
                              </div>
                              <span className='font-black text-foreground text-xs sm:text-sm uppercase tracking-widest'>{item.label}</span>
                           </div>
                           <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </nav>
              </div>

              {/* Wallet/Credits Preview */}
              <div className='bg-primary/5 border border-primary/10 rounded-2xl md:rounded-2xl p-5 sm:p-6 relative overflow-hidden group'>
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                     <Wallet className="w-20 h-20 sm:w-24 sm:h-24 text-primary" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 pointer-events-none">{t('account_balance')}</p>
                  <p className="text-2xl sm:text-3xl font-black mb-5 sm:mb-6 text-foreground">0.00 MKD</p>
                  <Button asChild className="w-full font-bold rounded-xl h-10 sm:h-11 shadow-sm text-sm">
                     <Link href="/wallet/top-up">
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        {t('top_up_balance')}
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
