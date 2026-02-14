// app/admin/users/[id]/page.tsx

import { getUserByIdAction } from '@/actions/user-actions';
import { auth } from '@/auth';
import { PromotionIcon } from '@/components/listing/promotion-icon';
import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getPromotionConfig } from '@/lib/constants/promotions';
import { cn } from '@/lib/utils';
import { formatDateTime, formatPrice } from '@/lib/utils/formatters';
import {
    ArrowLeft,
    BadgeCheck,
    Calendar,
    CheckCircle2,
    CreditCard,
    Edit,
    Eye,
    FileText,
    ListChecks,
    Mail,
    MapPin,
    Megaphone,
    Phone,
    Shield,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface UserDetailsPageProps {
  params: Promise<{ id: string }>;
}

/**
 * User Details Page - Server Component
 * Displays comprehensive user information for admin review (classifieds platform)
 */
export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { id } = await params;
  const result = await getUserByIdAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;

  // Calculate classifieds-relevant statistics
  const listings = user.listings || [];
  const transactions = user.transactions || [];
  
  const totalListings = listings.length;
  const activeListings = listings.filter((l: any) => l.status === 'ACTIVE').length;
  const pendingListings = listings.filter((l: any) => l.status === 'PENDING_APPROVAL').length;
  const promotedListings = listings.filter((l: any) => 
    l.isPromoted && l.promotionExpiresAt && l.promotionExpiresAt > Date.now()
  ).length;
  
  const totalSpent = transactions
    .filter((t: any) => t.status === 'COMPLETED')
    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

  const totalViews = listings.reduce((sum: number, l: any) => sum + (l.viewCount || 0), 0);

  // Membership/verification status helpers
  const isVerified = user.isVerified === true;
  const membershipActive = user.membershipStatus === 'ACTIVE';
  const membershipExpiresAt = user.membershipExpiresAt;
  const accountStatus = user.accountStatus || 'ACTIVE';

  const getAccountStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">Active</Badge>;
      case 'PENDING_APPROVAL': return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Pending Approval</Badge>;
      case 'SUSPENDED': return <Badge variant="destructive">Suspended</Badge>;
      case 'BANNED': return <Badge variant="destructive">Banned</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMembershipBadge = () => {
    if (!membershipActive) {
      return <Badge variant="outline" className="text-muted-foreground">No Subscription</Badge>;
    }
    const tierLabel = user.membershipTier === 'BUSINESS' ? 'Business Premium' : 'Verified User';
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20">
        <BadgeCheck className="w-3 h-3 mr-1" />
        {tierLabel}
      </Badge>
    );
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link href='/admin/users'>
                <ArrowLeft className='h-5 w-5' />
              </Link>
            </Button>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>
                User Details
              </h1>
              <p className='text-muted-foreground mt-1'>
                Account overview and activity
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/admin/users/${user.id}/edit`}>
              <Edit className='h-4 w-4 mr-2' />
              Edit User
            </Link>
          </Button>
        </div>

        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <div className='flex items-start gap-4'>
                  <UserAvatar 
                    user={user} 
                    className='h-20 w-20' 
                    fallbackClassName="text-2xl"
                  />
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='text-2xl flex items-center gap-2'>
                          {user.name || 'No name'}
                          {isVerified && (
                            <BadgeCheck className="w-5 h-5 text-primary" />
                          )}
                        </CardTitle>
                        <CardDescription className='flex items-center gap-2 mt-1'>
                          <Mail className='h-4 w-4' />
                          {user.email}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          user.role === 'ADMIN' ? 'destructive' : 'secondary'
                        }
                        className='text-sm'
                      >
                        <Shield className='h-3 w-3 mr-1' />
                        {user.role}
                      </Badge>
                    </div>
                    <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        <span>Joined {formatDateTime(user.createdAt)}</span>
                      </div>
                      {user.city && (
                        <div className='flex items-center gap-1'>
                          <MapPin className='h-4 w-4' />
                          <span>{user.city}{user.municipality ? `, ${user.municipality}` : ''}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className='flex items-center gap-1'>
                          <Phone className='h-4 w-4' />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Separator />

                {/* Status Badges Row */}
                <div className="flex flex-wrap gap-2">
                  {getAccountStatusBadge(accountStatus)}
                  {getMembershipBadge()}
                  {isVerified ? (
                    <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/20">
                      <XCircle className="w-3 h-3 mr-1" />
                      Not Verified
                    </Badge>
                  )}
                </div>

                {/* Account Details Grid */}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      User ID
                    </p>
                    <p className='text-sm font-mono mt-1 break-all'>
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Account Type
                    </p>
                    <p className='text-sm mt-1 capitalize'>
                      {user.accountType === 'COMPANY' ? 'Company' : 'Individual'}
                    </p>
                  </div>
                  {user.companyName && (
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Company Name
                      </p>
                      <p className='text-sm mt-1'>{user.companyName}</p>
                    </div>
                  )}
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Registration Complete
                    </p>
                    <p className='text-sm mt-1'>
                      {user.registrationComplete ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">Yes</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">No</span>
                      )}
                    </p>
                  </div>
                  {membershipActive && membershipExpiresAt && (
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Subscription Expires
                      </p>
                      <p className='text-sm mt-1'>
                        {new Date(membershipExpiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Listing Limit
                    </p>
                    <p className='text-sm mt-1'>
                      {user.listingsPostedCount || 0} / {user.listingLimit || 50}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <>
                    <Separator />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground mb-2'>
                        Biography
                      </p>
                      <p className='text-sm leading-relaxed'>{user.bio}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Listings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Listings
                </CardTitle>
                <CardDescription>
                  {totalListings} total listing{totalListings !== 1 ? 's' : ''} • {activeListings} active • {promotedListings} promoted
                </CardDescription>
              </CardHeader>
              <CardContent>
                {listings.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No listings yet</p>
                ) : (
                  <div className='space-y-3'>
                    {listings.slice(0, 10).map((listing: any) => {
                      const isCurrentlyPromoted = listing.isPromoted && listing.promotionExpiresAt && listing.promotionExpiresAt > Date.now();
                      const promoConfig = isCurrentlyPromoted ? getPromotionConfig(listing.promotionTier) : null;
                      
                      return (
                        <div
                          key={listing._id}
                          className='flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors'
                        >
                          <div className='flex items-center gap-3 min-w-0'>
                            {listing.thumbnail ? (
                              <img 
                                src={listing.thumbnail} 
                                alt="" 
                                className="w-12 h-12 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className='min-w-0'>
                              <p className='text-sm font-medium truncate'>
                                {listing.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className='text-xs text-muted-foreground'>
                                  {formatPrice(listing.price)} • {listing.category}
                                </p>
                                {isCurrentlyPromoted && promoConfig && (
                                  <Badge variant="outline" className={cn("text-[10px] h-5 gap-1", promoConfig.color)}>
                                    <PromotionIcon iconName={promoConfig.icon} className="w-3 h-3" />
                                    {promoConfig.title}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className='text-right shrink-0 ml-2'>
                            <Badge variant={
                              listing.status === 'ACTIVE' ? 'default' : 
                              listing.status === 'PENDING_APPROVAL' ? 'secondary' : 'destructive'
                            } className='text-xs'>
                              {listing.status === 'ACTIVE' ? 'Active' : 
                               listing.status === 'PENDING_APPROVAL' ? 'Pending' : listing.status}
                            </Badge>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              <Eye className="w-3 h-3 inline mr-1" />
                              {listing.viewCount || 0} views
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {listings.length > 10 && (
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        + {listings.length - 10} more listings
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transactions
                </CardTitle>
                <CardDescription>
                  {transactions.length} total transaction{transactions.length !== 1 ? 's' : ''} • {totalSpent.toFixed(0)} MKD total spent
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No transactions yet</p>
                ) : (
                  <div className='space-y-3'>
                    {transactions
                      .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
                      .slice(0, 10)
                      .map((tx: any) => (
                      <div
                        key={tx._id}
                        className='flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors'
                      >
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>
                            {tx.description}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Unknown date'}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-bold'>
                            {tx.amount?.toFixed(0) || 0} MKD
                          </p>
                          <Badge variant={tx.status === 'COMPLETED' ? 'default' : 'secondary'} className='text-xs'>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {transactions.length > 10 && (
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        + {transactions.length - 10} more transactions
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Listings & spending summary</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <ListChecks className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                      <span className='text-sm font-medium'>Total Listings</span>
                    </div>
                    <span className='text-lg font-bold'>{totalListings}</span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400' />
                      <span className='text-sm font-medium'>Active</span>
                    </div>
                    <span className='text-lg font-bold'>{activeListings}</span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <Megaphone className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                      <span className='text-sm font-medium'>Promoted</span>
                    </div>
                    <span className='text-lg font-bold'>{promotedListings}</span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <Eye className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                      <span className='text-sm font-medium'>Total Views</span>
                    </div>
                    <span className='text-lg font-bold'>{totalViews.toLocaleString()}</span>
                  </div>

                  <Separator />

                  <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                      <span className='text-sm font-medium'>Money Spent</span>
                    </div>
                    <span className='text-lg font-bold'>
                      {totalSpent.toFixed(0)} MKD
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Button
                  asChild
                  variant='outline'
                  className='w-full justify-start'
                >
                  <Link href={`/admin/users/${user.id}/edit`}>
                    <Edit className='h-4 w-4 mr-2' />
                    Edit User
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='w-full justify-start'
                >
                  <Link href={`/admin/listings?userId=${user.externalId || user.id}`}>
                    <FileText className='h-4 w-4 mr-2' />
                    View All Listings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
