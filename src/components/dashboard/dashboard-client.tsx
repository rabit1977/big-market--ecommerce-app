'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import {
    CheckCircle2,
    Clock,
    Edit,
    Eye,
    Heart,
    MessageSquare,
    MoreVertical,
    Package,
    Plus,
    Settings,
    Trash2,
    TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Listing {
  _id: string;
  title: string;
  price: number;
  images: string[];
  thumbnail?: string;
  status: string;
  createdAt: number;
  viewCount?: number;
  city: string;
  category: string;
}

interface DashboardClientProps {
  userListings: Listing[];
  favorites: Listing[];
  stats: {
    totalListings: number;
    activeListings: number;
    totalViews: number;
    messages: number;
  };
}

export function DashboardClient({
  userListings,
  favorites,
  stats,
}: DashboardClientProps) {
  const activeListings = userListings.filter((l) => l.status === 'ACTIVE');
  const soldListings = userListings.filter((l) => l.status === 'SOLD');
  const expiredListings = userListings.filter((l) => l.status === 'EXPIRED');

  const handleEdit = (id: string) => {
    window.location.href = `/listings/${id}/edit`;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      // TODO: Implement delete mutation
      console.log('Deleting listing:', id);
    }
  };

  const handleMarkAsSold = async (id: string) => {
    // TODO: Implement update mutation
    console.log('Marking as sold:', id);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-wide max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your listings and account
            </p>
          </div>
          <Link href="/sell">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Post New Listing
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalListings}</p>
            <p className="text-sm text-muted-foreground">Total Listings</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.activeListings}</p>
            <p className="text-sm text-muted-foreground">Active Listings</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">
              {stats.totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              {stats.messages > 0 && (
                <Badge variant="destructive">{stats.messages}</Badge>
              )}
            </div>
            <p className="text-3xl font-bold mb-1">{stats.messages}</p>
            <p className="text-sm text-muted-foreground">Messages</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="active" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Active ({activeListings.length})
            </TabsTrigger>
            <TabsTrigger value="sold" className="gap-2">
              <Package className="w-4 h-4" />
              Sold ({soldListings.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="w-4 h-4" />
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Active Listings */}
          <TabsContent value="active" className="space-y-4">
            {activeListings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {activeListings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMarkAsSold={handleMarkAsSold}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="No active listings"
                description="You don't have any active listings yet"
                action={
                  <Link href="/sell">
                    <Button>Post Your First Listing</Button>
                  </Link>
                }
              />
            )}
          </TabsContent>

          {/* Sold Listings */}
          <TabsContent value="sold" className="space-y-4">
            {soldListings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {soldListings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isSold
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="No sold listings"
                description="Items you've marked as sold will appear here"
              />
            )}
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites" className="space-y-4">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((listing) => (
                  <FavoriteCard key={listing._id} listing={listing} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Heart}
                title="No favorites yet"
                description="Start browsing and save your favorite listings"
                action={
                  <Link href="/listings">
                    <Button>Browse Listings</Button>
                  </Link>
                }
              />
            )}
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Notification Preferences
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Listing Card Component
function ListingCard({
  listing,
  onEdit,
  onDelete,
  onMarkAsSold,
  isSold = false,
}: {
  listing: Listing;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAsSold?: (id: string) => void;
  isSold?: boolean;
}) {
  const imageUrl = listing.thumbnail || listing.images[0] || '/placeholder-listing.jpg';
  const timeAgo = formatDistanceToNow(new Date(listing.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <Link href={`/listings/${listing._id}`} className="shrink-0">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
            />
            {isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge className="bg-green-600">SOLD</Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <Link href={`/listings/${listing._id}`}>
                <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
                  {listing.title}
                </h3>
              </Link>
              <p className="text-2xl font-bold text-primary mt-1">
                €{listing.price.toLocaleString()}
              </p>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(listing._id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/listings/${listing._id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                {!isSold && onMarkAsSold && (
                  <DropdownMenuItem onClick={() => onMarkAsSold(listing._id)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Sold
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(listing._id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{listing.viewCount || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{timeAgo}</span>
            </div>
            <Badge variant="secondary" className="capitalize">
              {listing.category}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Favorite Card Component
function FavoriteCard({ listing }: { listing: Listing }) {
  const imageUrl = listing.thumbnail || listing.images[0] || '/placeholder-listing.jpg';

  return (
    <Link href={`/listings/${listing._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all group">
        <div className="relative aspect-video bg-muted">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <p className="text-xl font-bold text-primary">
            €{listing.price.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1 capitalize">
            {listing.city}
          </p>
        </div>
      </Card>
    </Link>
  );
}

// Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {action}
    </Card>
  );
}
