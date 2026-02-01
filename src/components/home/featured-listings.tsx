'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  thumbnail?: string;
  city: string;
  status: string;
  createdAt: number;
  viewCount?: number;
  _creationTime: number;
}

interface FeaturedListingsProps {
  listings: Listing[];
}

export function FeaturedListings({ listings }: FeaturedListingsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const featuredListings = listings.slice(0, 10);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (featuredListings.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-blue-50/30 to-background border-t">
      <div className="container-wide py-12 md:py-16">
        <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
               <h2 className="text-xl md:text-2xl font-black tracking-tight">
                  Hot Deals
               </h2>
            </div>
            <p className="text-muted-foreground font-medium text-xs">
              Premium community picks hand-selected for you
            </p>
          </div>
          
          <div className="flex items-center gap-2">
             <button 
               onClick={() => scroll('left')}
               className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
             >
                <ChevronLeft className="w-6 h-6" />
             </button>
             <button 
               onClick={() => scroll('right')}
               className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white border shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
             >
                <ChevronRight className="w-6 h-6" />
             </button>
             <Link 
               href="/listings?featured=true" 
               className="ml-2 inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all"
             >
               View All
             </Link>
          </div>
        </div>

        <div className="relative group">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-8 px-4 sm:px-0 scroll-smooth snap-x snap-mandatory"
          >
            {featuredListings.map((listing) => {
              const imageUrl = listing.thumbnail || listing.images[0] || '/placeholder-listing.jpg';
              const timeAgo = formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true });

              return (
                <div 
                  key={listing._id} 
                  className="min-w-[220px] sm:min-w-[320px] md:min-w-[340px] snap-start"
                >
                  <Link href={`/listings/${listing._id}`}>
                    <Card className="group h-full overflow-hidden border-border/40 hover:border-blue-500/50 hover:shadow-[0_20px_50px_rgba(8,112,184,0.12)] transition-all duration-500 rounded-2xl md:rounded-3xl bg-white/60 backdrop-blur-sm">
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
                          <Badge className="bg-orange-500/90 backdrop-blur-md hover:bg-orange-600 text-white border-0 shadow-lg px-2 py-1 md:px-3 md:py-1.5 font-bold uppercase tracking-tighter text-[9px] md:text-[10px]">
                            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1 md:mr-1.5 fill-current" />
                            Featured
                          </Badge>
                        </div>

                        <Image
                          src={imageUrl}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 640px) 220px, 340px"
                        />
                        
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex items-center justify-between">
                           <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30">
                              Quick View
                           </span>
                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-xl">
                              <Star className="w-4 h-4 fill-primary" />
                           </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 md:p-5 space-y-3 md:space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm md:text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors h-[2.5rem] md:h-[3.5rem]">
                            {listing.title}
                          </h3>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-lg md:text-2xl font-black text-slate-900 leading-none">
                            €{listing.price.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] md:text-[11px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full uppercase w-fit">
                            <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            {timeAgo.replace('about ', '')}
                          </div>
                        </div>

                        <div className="pt-2 md:pt-3 border-t flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-medium">
                           <div className="bg-blue-50 p-1 md:p-1.5 rounded-lg">
                              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                           </div>
                           <span className="truncate">{listing.city}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
