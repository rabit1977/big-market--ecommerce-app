'use client';

import { ListingCard } from '@/components/listing/listing-card';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, History as HistoryIcon, Loader2, Search, Trash2 } from 'lucide-react';
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
      return (
        <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      );
  }

  if (status === 'unauthenticated') {
     return (
         <div className="min-h-screen pt-16 md:pt-20 flex flex-col items-center justify-center gap-3 px-4">
             <h1 className="text-lg font-bold text-foreground">Please Sign In</h1>
             <p className="text-xs text-muted-foreground">You need to be logged in to view favorites.</p>
             <Link href="/auth"><Button size="sm" className="rounded-lg font-bold text-xs">Sign In</Button></Link>
         </div>
     );
  }

  return (
    <div className='min-h-screen pt-16 md:pt-20 pb-8 bg-muted/10'>
      <div className='container-wide mx-auto px-3 md:px-4'>
        <AppBreadcrumbs />
        
        {/* Compact Header */}
        <div className="flex items-center gap-2.5 mb-4 md:mb-5">
            <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg md:rounded-xl">
                <Heart className="h-4 w-4 md:h-5 md:w-5 text-primary fill-primary/20" />
            </div>
            <div>
                <h1 className="text-base md:text-xl font-black tracking-tight text-foreground">Saved Items</h1>
                <p className="text-[10px] md:text-xs text-muted-foreground font-medium">
                    Your favorites, searches, and history
                </p>
            </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as any)} 
          className="w-full"
        >
            <TabsList className="w-full grid grid-cols-3 mb-4 md:mb-6 h-9 md:h-10 bg-muted p-0.5 rounded-lg md:rounded-xl">
                <TabsTrigger value="listings" className="rounded-md text-[10px] md:text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    Favorites ({listingFavorites?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="searches" className="rounded-md text-[10px] md:text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    Searches ({savedSearches?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="visited" className="rounded-md text-[10px] md:text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    History
                </TabsTrigger>
            </TabsList>
            
            {/* Favorite Listings Tab */}
            <TabsContent value="listings">
                {!listingFavorites ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : listingFavorites.length === 0 ? (
                    <EmptyState 
                        icon={<Heart className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/40" />}
                        title="No favorites yet"
                        description="Save listings you like to view them later."
                        action={{ label: 'Browse Listings', href: '/listings' }}
                    />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
                        {listingFavorites.map((listing) => (
                            listing && <ListingCard key={listing._id} listing={listing as any} />
                        ))}
                    </div>
                )}
            </TabsContent>

            {/* Saved Searches Tab */}
            <TabsContent value="searches">
                {!savedSearches ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : savedSearches.length === 0 ? (
                    <EmptyState 
                        icon={<Search className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/40" />}
                        title="No saved searches"
                        description="Save your search queries to get notified of new results."
                        action={{ label: 'Start Searching', href: '/listings' }}
                    />
                ) : (
                    <div className="flex flex-col gap-2">
                        {savedSearches.map((search) => (
                            <div key={search._id} className="group flex items-center gap-2.5 md:gap-3 bg-card p-2.5 md:p-3 rounded-xl border border-border/50 hover:border-border hover:shadow-sm transition-all">
                                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                    <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
                                </div>
                                
                                <Link href={search.url} className="flex-1 min-w-0">
                                    <h3 className="font-bold text-xs md:text-sm truncate text-foreground group-hover:text-primary transition-colors">
                                        {search.name || search.query}
                                    </h3>
                                    <p className="text-[9px] md:text-[10px] text-muted-foreground truncate font-medium">
                                        Saved {formatDistanceToNow(search._creationTime)} ago
                                    </p>
                                </Link>

                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteSearch(search._id);
                                    }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </TabsContent>

            {/* Visited History Tab */}
            <TabsContent value="visited">
                {!visitedHistory ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : visitedHistory.length === 0 ? (
                    <EmptyState 
                        icon={<HistoryIcon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/40" />}
                        title="No recently visited ads"
                        description="Ads you view will appear here."
                        action={{ label: 'Browse Listings', href: '/listings' }}
                    />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
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

/* Reusable Empty State */
function EmptyState({ 
    icon, title, description, action 
}: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    action: { label: string; href: string } 
}) {
    return (
        <div className="text-center py-12 md:py-16 px-4 bg-card border border-dashed border-border rounded-2xl">
            <div className="mx-auto mb-3">{icon}</div>
            <h3 className="text-sm md:text-base font-bold text-foreground mb-1">{title}</h3>
            <p className="text-[11px] md:text-xs text-muted-foreground mb-4 max-w-xs mx-auto">{description}</p>
            <Link href={action.href}>
                <Button size="sm" className="rounded-lg font-bold text-xs md:text-sm h-8 md:h-9 px-4">
                    {action.label}
                </Button>
            </Link>
        </div>
    );
}
