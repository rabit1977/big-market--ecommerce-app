'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Bell, BellOff, ExternalLink, Loader2, Search, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function SavedSearchesClient() {
  const { data: session } = useSession();
  const searches = useQuery(api.savedSearches.list, session?.user?.id ? { userId: session.user.id } : 'skip');
  const removeSearch = useMutation(api.savedSearches.remove);
  const toggleAlerts = useMutation(api.savedSearches.toggleAlerts);
  const [isPending, startTransition] = useTransition();

  if (searches === undefined) {
    return (
      <div className="flex h-64 items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (searches.length === 0) {
    return (
      <div className='text-center py-16 md:py-24 bg-card rounded-[2rem] border-2 border-dashed border-border/60 shadow-sm'>
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className='text-xl md:text-2xl font-black text-foreground uppercase tracking-tight mb-2'>No Saved Searches</h3>
          <p className='text-muted-foreground max-w-sm mx-auto mb-8 text-xs md:text-sm font-bold'>
              You haven't saved any searches yet. Save a search from the listings page to get alerts.
          </p>
          <Button asChild size="lg" className="rounded-full font-black text-sm uppercase tracking-wider shadow-xl shadow-primary/20 h-12 px-8">
              <Link href="/listings">Browse Listings</Link>
          </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
       {searches.map(search => (
         <Card key={search._id} className="rounded-[1.5rem] border-border shadow-sm flex flex-col justify-between overflow-hidden group">
            <CardContent className="p-5 flex-1 flex flex-col">
               <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                     <Search className="w-5 h-5" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2 -mt-2"
                    onClick={() => {
                       startTransition(async () => {
                           try {
                              await removeSearch({ id: search._id, userId: session?.user?.id! });
                              toast.success('Search removed');
                           } catch (e) {
                              toast.error('Could not remove search');
                           }
                       });
                    }}
                    disabled={isPending}
                  >
                     <Trash2 className="w-4 h-4" />
                  </Button>
               </div>
               
               <h3 className="text-xl font-black text-foreground uppercase tracking-tight leading-tight mb-2 line-clamp-2">
                  {search.name || 'All Listings'}
               </h3>
               
               <div className="mt-auto pt-4 space-y-4">
                  <div className="flex items-center justify-between border-t border-border/50 pt-4">
                     <div className="flex items-center gap-2">
                        {search.isEmailAlert ? <Bell className="w-4 h-4 text-emerald-500" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Alerts</span>
                     </div>
                     <Switch 
                       checked={search.isEmailAlert} 
                       onCheckedChange={(checked) => {
                          toggleAlerts({ id: search._id, userId: session?.user?.id!, isEmailAlert: checked });
                       }}
                       disabled={isPending}
                     />
                  </div>
                  
                  <Button asChild className="w-full rounded-xl bg-muted hover:bg-primary hover:text-white text-foreground font-black uppercase tracking-wider transition-colors" variant="secondary">
                     <Link href={search.url}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Results
                     </Link>
                  </Button>
               </div>
            </CardContent>
         </Card>
       ))}
    </div>
  );
}
