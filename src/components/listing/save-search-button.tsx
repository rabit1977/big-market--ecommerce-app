'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Bell, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function SaveSearchButton() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Reconstruct the current URL with searchParams
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const saveSearch = useMutation(api.savedSearches.save);
  const removeSearch = useMutation(api.savedSearches.remove);

  const savedState = useQuery(
    api.savedSearches.checkIsSaved,
    session?.user?.id ? { userId: session.user.id, url: currentUrl } : 'skip'
  );

  const isSaved = savedState?.isSaved ?? false;
  const savedId = savedState?.id;

  const handleToggleSave = () => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to save searches.');
      return;
    }

    startTransition(async () => {
      try {
        if (isSaved && savedId) {
          const res = await removeSearch({ id: savedId as any, userId: session.user.id });
          if (res.success) {
             toast.success('Search removed from saved alerts.');
          } else {
             toast.error(res.message || 'Could not remove search.');
          }
        } else {
          // Parse searchParams to a plain object for "filters"
          const paramsObj: Record<string, string> = {};
          searchParams.forEach((val, key) => {
             paramsObj[key] = val;
          });

          // Create a readable name from params (e.g. "BMW in Skopje")
          let nameParts = [];
          if (paramsObj.search) nameParts.push(`"${paramsObj.search}"`);
          if (paramsObj.category && paramsObj.category !== 'all') nameParts.push(paramsObj.category);
          if (paramsObj.city && paramsObj.city !== 'all') nameParts.push(`in ${paramsObj.city}`);
          const name = nameParts.length > 0 ? nameParts.join(' ') : 'All Listings';

          const res = await saveSearch({
             userId: session.user.id,
             query: paramsObj.search || '',
             url: currentUrl,
             name,
             filters: paramsObj,
             isEmailAlert: true,
             frequency: 'daily',
          });

          if (res.success) {
             toast.success('Search saved! You will be alerted of new listings.', {
                icon: '🔔',
             });
          } else {
             toast.error((res as any).message || 'Could not save search.');
          }
        }
      } catch (e) {
        toast.error('An unexpected error occurred.');
        console.error(e);
      }
    });
  };

  // Only show button if there are actual active filters or searches
  if (!searchParams.toString()) return null;

  return (
    <Button
      variant={isSaved ? "secondary" : "outline"}
      size="sm"
      className={cn(
        "gap-2 rounded-xl font-bold transition-all h-10",
        isSaved 
          ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' 
          : 'bg-background border-border hover:bg-muted/50'
      )}
      onClick={handleToggleSave}
      disabled={isPending || savedState === undefined}
    >
      {isPending ? (
         <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSaved ? (
         <Bell className="w-4 h-4 fill-current" />
      ) : (
         <Bell className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">{isSaved ? 'Alerts' : 'Save'}</span>
    </Button>
  );
}
