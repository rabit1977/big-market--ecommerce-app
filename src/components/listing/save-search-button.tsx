'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Heart, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function SaveSearchButton({ className }: { className?: string }) {
  const { data: session } = useSession();
  const t = useTranslations('ListingGrid');
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
                icon: '❤️',
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

  return (
    <Button
      variant={isSaved ? "secondary" : "outline"}
      size="sm"
      className={cn(
        "gap-2 rounded-xl font-bold transition-all min-w-[40px]",
        isSaved 
          ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' 
          : 'bg-background border-border hover:bg-muted/50',
        className
      )}
      onClick={handleToggleSave}
      disabled={isPending || savedState === undefined}
    >
      {isPending ? (
         <Loader2 className="w-4.5 h-4.5 animate-spin" />
      ) : isSaved ? (
         <Heart className="w-4.5 h-4.5 fill-current text-primary" />
      ) : (
         <Heart className="w-4.5 h-4.5 text-muted-foreground/60" />
      )}
      <span className="hidden sm:inline">{isSaved ? t('alerts_label') : t('save_label')}</span>
    </Button>
  );
}
