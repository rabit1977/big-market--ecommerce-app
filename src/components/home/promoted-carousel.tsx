'use client';

import { useQuery } from "convex/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { ListingCard } from "../listing/listing-card";

export function PromotedCarousel() {
  const promotedListings = useQuery(api.listings.list, { isPromoted: true });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (promotedListings) {
      setIsLoaded(true);
    }
  }, [promotedListings]);

  if (!promotedListings || promotedListings.length === 0) {
    return null;
  }

  // Double the array for seamless infinite scroll
  const scrollingItems = [...promotedListings, ...promotedListings, ...promotedListings];

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50/50 to-background overflow-hidden">
      <div className="container px-4 mx-auto mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Promoted Listings</h2>
            <p className="text-sm text-muted-foreground">Premium listings from our Elite partners</p>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Shadow Overlays for Fade Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee whitespace-nowrap px-4 py-4">
          {scrollingItems.map((listing, idx) => (
            <div 
              key={`${listing._id}-${idx}`} 
              className="w-[300px] shrink-0 hover:scale-[1.02] transition-transform duration-300"
            >
              <ListingCard listing={listing as any} viewMode="grid" />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>Section
    </section>
  );
}
