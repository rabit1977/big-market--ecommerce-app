'use client';

import { ListingCard } from '@/components/listing/listing-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, History as HistoryIcon, Search, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'searches' ? 'searches' : 'listings';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const listingFavorites = useQuery(api.favorites.getPopulated, { 
      userId: session?.user?.id || '' 
  });
  
  const savedSearches = useQuery(api.searches.getSavedSearches, { 
      userId: session?.user?.id || '' 
  });
  
  const deleteSearch = useMutation(api.searches.deleteSavedSearch);

  const visitedHistory = useQuery(api.history.getMyHistory, {
      userId: session?.user?.id || ''
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'searches' || tab === 'listings') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleDeleteSearch = async (id: string) => {
      try {
          await deleteSearch({ id: id as any });
          toast.success("Search removed");
      } catch (err) {
          toast.error("Failed to remove search");
      }
  };

  if (status === 'loading') {
      return <div className="min-h-screen pt-24 text-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
     return (
         <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
             <h1 className="text-2xl font-bold">Please Sign In</h1>
             <p className="text-muted-foreground">You need to be logged in to view favorites.</p>
             <Link href="/auth"><Button>Sign In</Button></Link>
         </div>
     );
  }

  return (
    <div className='min-h-screen pt-24 pb-12 bg-muted/10'>
      <div className='container-wide mx-auto px-4'>
        <AppBreadcrumbs />
        <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-primary fill-primary/10" />
            <h1 className="text-3xl font-black tracking-tight">Saved Items</h1>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as any)} 
          className="w-full"
        >
            <TabsList className="w-full sm:w-auto grid grid-cols-3 mb-8">
                <TabsTrigger value="listings">Favorite Listings ({listingFavorites?.length || 0})</TabsTrigger>
                <TabsTrigger value="searches">Saved Searches ({savedSearches?.length || 0})</TabsTrigger>
                <TabsTrigger value="visited">Visited Ads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings" className="space-y-6">
                {!listingFavorites ? (
                    <div className="text-center py-20">Loading favorites...</div>
                ) : listingFavorites.length === 0 ? (
                    <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
                        <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
                        <p className="text-muted-foreground mb-6">Save listings you like to view them later.</p>
                        <Link href="/listings"><Button>Browse Listings</Button></Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {listingFavorites.map((listing) => (
                            listing && <ListingCard key={listing._id} listing={listing as any} />
                        ))}
                    </div>
                )}
            </TabsContent>

            <TabsContent value="searches" className="space-y-6">
                {!savedSearches ? (
                    <div className="text-center py-20">Loading searches...</div>
                ) : savedSearches.length === 0 ? (
                    <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
                        <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No saved searches</h3>
                        <p className="text-muted-foreground mb-6">Save your search queries to get notified of new results.</p>
                        <Link href="/listings"><Button>Start Searching</Button></Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {savedSearches.map((search) => (
                            <div key={search._id} className="group flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-border/40 hover:shadow-md transition-all">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <Search className="w-5 h-5 text-gray-500" />
                                </div>
                                
                                <Link href={search.url} className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base truncate text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {search.name || search.query}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate opacity-70">
                                        Saved {formatDistanceToNow(search._creationTime)} ago
                                    </p>
                                </Link>

                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-400 shrink-0" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteSearch(search._id);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </TabsContent>

            <TabsContent value="visited" className="space-y-6">
                {!visitedHistory ? (
                    <div className="text-center py-20">Loading history...</div>
                ) : visitedHistory.length === 0 ? (
                    <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
                        <HistoryIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No recently visited ads</h3>
                        <p className="text-muted-foreground mb-6">Ads you view will appear here.</p>
                        <Link href="/listings"><Button>Browse Listings</Button></Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {visitedHistory.map((listing) => (
                           listing && <ListingCard key={listing._id} listing={listing as any} />
                        ))}
                    </div>
                )}
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
