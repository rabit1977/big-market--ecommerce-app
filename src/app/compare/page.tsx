'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCompareStore } from '@/lib/store/compare-store';
import { ListingWithRelations } from '@/lib/types/listing';
import { formatCurrency } from '@/lib/utils/formatters';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ComparePage() {
  const { items, removeItem, clearItems } = useCompareStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-4 md:pt-6 pb-20 bg-muted/10">
        <div className="container-wide mx-auto px-4"><AppBreadcrumbs /></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-4 md:pt-6 pb-20 bg-muted/10">
        <div className="container-wide mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
             <ArrowLeft className="w-8 h-8 text-muted-foreground/50 hidden" />
             <div className="grid grid-cols-2 gap-1 w-8 h-8 opacity-50">
                 <div className="border-2 border-muted-foreground rounded-sm" />
                 <div className="border-2 border-muted-foreground rounded-sm" />
             </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">No listings to compare</h1>
          <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm mb-6">
            Go back and select up to 3 listings using the compare icon on the listing cards to see them side-by-side.
          </p>
          <Button asChild className="btn-premium btn-glow rounded-xl font-bold">
            <Link href="/listings">Browse Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Extract all unique specification keys across selected items
  const allSpecKeys: string[] = Array.from(
    new Set(
      items.flatMap((item: ListingWithRelations) => 
        item.specifications ? Object.keys(item.specifications) : []
      )
    )
  ).sort();

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-32 bg-muted/10">
      <div className="container-wide mx-auto px-3 md:px-4">
        <div className="mb-4 md:mb-6 flex items-center justify-between">
            <AppBreadcrumbs />
            <Button variant="ghost" size="sm" onClick={clearItems} className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs h-8">
               <Trash2 className="w-3.5 h-3.5 mr-1.5" />
               Clear All
            </Button>
        </div>

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Compare Listings
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Side-by-side comparison of {items.length} selected items
          </p>
        </div>

        <div className="glass-panel overflow-hidden rounded-2xl border border-border/50 bg-card">
          <ScrollArea className="w-full relative">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 sm:p-6 min-w-[150px] w-[200px] border-r border-border/30 bg-muted/30 align-bottom">
                     <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Features</span>
                  </th>
                  {items.map((item: ListingWithRelations) => (
                    <th key={item._id} className="p-4 sm:p-6 w-[250px] sm:w-[300px] xl:w-[350px] border-r border-border/30 align-top relative group group-hover:bg-muted/10 transition-colors">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 scale-75 sm:scale-100"
                        onClick={() => removeItem(item._id)}
                      >
                         <Trash2 className="w-3 h-3" />
                      </Button>
                      
                      <Link href={`/listings/${item._id}`} className="block group/link">
                          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative mb-4 border border-border shadow-sm group-hover/link:shadow-md transition-shadow">
                             {item.thumbnail || item.images[0] ? (
                               <Image
                                 src={item.thumbnail || ((item.images[0] as any)?.url ?? item.images[0] as any)}
                                 alt={item.title}
                                 fill
                                 className="object-cover transition-transform duration-500 group-hover/link:scale-105"
                               />
                             ) : (
                               <div className="w-full h-full bg-muted flex items-center justify-center">No Image</div>
                             )}
                          </div>
                          <h3 className="font-bold text-sm sm:text-base line-clamp-2 leading-tight group-hover/link:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <div className="font-black text-lg sm:text-2xl text-primary mt-2 flex items-baseline gap-2 flex-wrap">
                            {item.previousPrice && (
                                <span className="text-xs sm:text-sm text-muted-foreground line-through font-medium">
                                    {formatCurrency(item.previousPrice, (item as any).currency)}
                                </span>
                            )}
                            {formatCurrency(item.price, (item as any).currency)}
                          </div>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Info Rows */}
                <tr className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-muted-foreground border-r border-border/30 bg-muted/10 shrink-0">Status</td>
                  {items.map((item: ListingWithRelations) => (
                    <td key={item._id} className="p-4 sm:p-5 text-sm font-medium border-r border-border/30">
                      <span className={item.status === 'ACTIVE' ? 'text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md' : 'text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md'}>
                         {item.status}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-muted-foreground border-r border-border/30 bg-muted/10 shrink-0">Category</td>
                  {items.map((item: ListingWithRelations) => (
                    <td key={item._id} className="p-4 sm:p-5 text-sm border-r border-border/30 font-medium capitalize">
                      {item.category} {item.subCategory ? ` > ${item.subCategory}` : ''}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-muted-foreground border-r border-border/30 bg-muted/10 shrink-0">Location</td>
                  {items.map((item: ListingWithRelations) => (
                    <td key={item._id} className="p-4 sm:p-5 text-sm border-r border-border/30 font-medium">
                      {item.city} {(item as any).region ? `, ${(item as any).region}` : ''}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 text-sm font-semibold text-muted-foreground border-r border-border/30 bg-muted/10 shrink-0">Condition</td>
                  {items.map((item: ListingWithRelations) => (
                    <td key={item._id} className="p-4 sm:p-5 text-sm border-r border-border/30 font-medium">
                      {item.condition ? (
                         <span className={item.condition === 'NEW' ? 'text-blue-500' : 'text-muted-foreground'}>{item.condition}</span>
                      ) : '-'}
                    </td>
                  ))}
                </tr>

                {/* Dynamic Spec Rows */}
                {allSpecKeys.length > 0 && (
                   <>
                      <tr>
                        <td colSpan={items.length + 1} className="p-4 sm:p-6 bg-muted/30 border-y border-border/50">
                           <h4 className="font-bold text-sm tracking-widest text-foreground uppercase">Specifications</h4>
                        </td>
                      </tr>
                      {allSpecKeys.map((key: string) => (
                         <tr key={key} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="p-3 sm:p-4 text-sm font-semibold text-muted-foreground border-r border-border/30 bg-muted/10 capitalize shrink-0">
                               {key.replace(/_/g, ' ')}
                            </td>
                            {items.map((item: ListingWithRelations) => (
                               <td key={`${item._id}-${key}`} className="p-3 sm:p-4 text-sm border-r border-border/30 font-medium">
                                  {item.specifications && item.specifications[key] !== undefined && item.specifications[key] !== '' 
                                     ? String(item.specifications[key]) 
                                     : <span className="text-muted-foreground/30">—</span>}
                               </td>
                            ))}
                         </tr>
                      ))}
                   </>
                )}
              </tbody>
            </table>
            <ScrollBar orientation="horizontal" className="h-2.5 hover:h-3 transition-all cursor-grab active:cursor-grabbing" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
