'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { useFavorites } from '@/lib/context/favorites-context';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { Heart, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export function WishlistDropdown({ listingId }: { listingId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isWished = isFavorite(listingId);
  const { data: session } = useSession();
  const [newListName, setNewListName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const lists = useQuery(
    api.favorites.getUserLists,
    session?.user?.id ? { userId: session.user.id } : 'skip'
  );

  const handleToggle = async (listName?: string) => {
    await toggleFavorite(listingId, listName);
    setIsOpen(false);
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    await toggleFavorite(listingId, newListName.trim());
    setNewListName('');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          variant='outline'
          className={cn(
            'h-12 w-12 rounded-full border transition-all shrink-0',
            isWished
              ? 'bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:border-red-800 dark:hover:bg-red-900/50'
              : 'border-border/60 hover:bg-secondary/50 hover:border-primary/30'
          )}
        >
          <Heart
            className={cn('h-5 w-5 transition-all duration-300', {
              'fill-red-500 text-red-500 scale-110': isWished,
              'text-muted-foreground': !isWished,
            })}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-panel rounded-xl">
        <DropdownMenuLabel>Save to Wishlist</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {lists?.map((listName) => (
          <DropdownMenuItem 
            key={listName} 
            onClick={() => handleToggle(listName)}
            className="cursor-pointer font-medium"
          >
            {listName}
          </DropdownMenuItem>
        ))}
        
        {(!lists || lists.length === 0) && (
            <DropdownMenuItem 
                onClick={() => handleToggle('Default')}
                className="cursor-pointer font-medium"
            >
                Default
            </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        
        <div className="p-2">
            <form onSubmit={handleCreateAndAdd} className="flex gap-2">
                <Input 
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="New list..." 
                    className="h-8 text-sm placeholder:text-muted-foreground"
                />
                <Button type="submit" size="icon" className="h-8 w-8 shrink-0 rounded-md">
                    <Plus className="h-4 w-4" />
                </Button>
            </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
