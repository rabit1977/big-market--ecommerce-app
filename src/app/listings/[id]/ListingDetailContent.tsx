'use client';

import { Badge } from '@/components/ui/badge';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
    BadgeCheck,
    ChevronLeft,
    Heart,
    MapPin,
    MessageCircle,
    MessageSquare,
    MoreVertical,
    Phone,
    Share2,
    ShieldAlert,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';

interface ListingDetailContentProps {
  listing: {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    thumbnail?: string;
    category: string;
    city: string;
    region?: string;
    createdAt: number;
    viewCount?: number;
    userId: string;
    contactPhone?: string;
    contactEmail?: string;
    specifications?: Record<string, any>;
    status: string;
  };
}

export function ListingDetailContent({ listing }: ListingDetailContentProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Fetch seller details using External ID (UUID) since listing.userId stores the auth provider ID
  const seller = useQuery(api.users.getByExternalId, { externalId: listing.userId });

  const images = listing.images || [];
  const mainImage = images[selectedImage] || listing.thumbnail || '/placeholder-listing.jpg';
  
  const date = listing.createdAt ? new Date(listing.createdAt) : new Date();
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const publishDate = date.toLocaleDateString('mk-MK', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Use actual condition if available
  const condition = listing.specifications?.condition; 
  // Use actual contact phone from listing or fallback to seller's phone if available (though listing.contactPhone is preferred for the item)
  const contactPhone = listing.contactPhone || (seller as any)?.phone;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header (Big Market Style) */}
      <div className="sticky top-0 z-30 bg-background border-b px-4 py-2 flex items-center justify-between shadow-sm md:hidden">
         <div className="flex items-center gap-3">
             <Link href="/listings">
                <ChevronLeft className="w-6 h-6 text-foreground" />
             </Link>
             <div className="flex flex-col">
                 <span className="text-sm font-bold leading-none">Listing ID: {listing._id.slice(-7).toUpperCase()}</span>
                 <span className="text-[10px] text-muted-foreground mt-0.5">Published: {publishDate}</span>
             </div>
         </div>
         <div className="flex items-center gap-4">
             <Share2 className="w-5 h-5 text-foreground" onClick={handleShare} />
             <MoreVertical className="w-5 h-5 text-foreground" />
             <Link href="/listings">
               <X className="w-6 h-6 text-foreground" />
             </Link>
         </div>
      </div>

      <div className="container-wide max-w-5xl mx-auto md:py-8">
        
        {/* Desktop Breadcrumb (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/listings" className="hover:text-foreground">Listings</Link>
          <span>/</span>
          <span className="text-foreground">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-0 text-foreground md:space-y-6">
            
            {/* Image Section */}
            <div className="relative aspect-[4/3] md:aspect-video bg-black/5 md:rounded-xl overflow-hidden">
                <Image
                  src={mainImage}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                   {selectedImage + 1}/{Math.max(images.length, 1)}
                </div>

                {listing.status === 'SOLD' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge className="bg-red-600 text-white text-2xl px-8 py-3">SOLD</Badge>
                  </div>
                )}
            </div>

            {/* Thumbnail Grid (Scrollable on Mobile, Grid on Desktop) */}
            {images.length > 1 && (
               <div className="flex overflow-x-auto pb-2 gap-2 md:grid md:grid-cols-6 md:pb-0 snap-x">
                 {images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImage(idx)} 
                      className={`
                        relative flex-shrink-0 aspect-square w-20 md:w-auto rounded-md overflow-hidden ring-2 snap-start
                        ${selectedImage === idx ? 'ring-primary' : 'ring-transparent'}
                      `}
                    >
                       <Image src={img} alt="" fill className="object-cover" />
                    </button>
                 ))}
               </div>
            )}

            {/* Title & Price Info */}
            <div className="px-4 py-4 md:p-6 md:bg-card md:border md:rounded-xl md:shadow-sm space-y-3">
               <h1 className="text-xl md:text-2xl font-bold text-foreground leading-snug">
                  {listing.title}
               </h1>
               
               <div className="flex justify-between items-start">
                  <div>
                      <div className="text-3xl font-extrabold text-blue-700">
                         {listing.price > 0 ? `${listing.price} €` : 'Price on request'}
                      </div>
                      {listing.price > 0 && (
                         <div className="text-xs text-muted-foreground mt-1">Fixed Price</div>
                      )}
                  </div>
                  <button onClick={() => setIsFavorite(!isFavorite)}>
                     <Heart className={`w-7 h-7 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                  </button>
               </div>

               {/* Condition Pill - Only show if data exists */}
               {condition && (
                   <div className="flex items-center gap-2 pt-2">
                      <span className="text-sm text-foreground/80">Item Condition:</span>
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-normal px-3 py-0.5 rounded-full capitalize">
                         {String(condition)}
                      </Badge>
                   </div>
               )}
            </div>

            {/* Specifications Table (Clean Grid) */}
            {listing.specifications && Object.keys(listing.specifications).length > 0 && (
               <div className="border-t border-b md:border md:rounded-xl bg-card">
                  {Object.entries(listing.specifications).map(([key, value], index) => {
                     // Filter out internal keys often found in JSON
                     if (key === 'condition' || key.startsWith('_')) return null;
                     
                     return (
                         <div key={key} className={`flex justify-between items-center p-4 ${index !== 0 ? 'border-t' : ''}`}>
                            <span className="text-muted-foreground capitalize text-sm md:text-base">
                               {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-bold text-foreground text-sm md:text-base">{String(value)}</span>
                         </div>
                     );
                  })}
               </div>
            )}

            {/* Description */}
            <div className="px-4 py-6 md:p-6 md:bg-card md:border md:rounded-xl space-y-4">
               <h3 className="font-bold text-lg">Description</h3>
               <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                  {listing.description}
               </p>
            </div>
          </div>

          {/* Right Column (Seller & Actions) */}
          <div className="lg:col-span-1 space-y-6 px-4 md:px-0 pb-10">
             {/* Big Market Style */}
             <div className="bg-card border rounded-xl p-5 shadow-sm">
                <div className="text-sm text-muted-foreground mb-4">Listed by:</div>
                
                <div className="flex items-center gap-3 mb-6">
                   {seller?.image ? (
                       <div className="w-12 h-12 rounded-full overflow-hidden relative border border-border">
                           <Image src={seller.image} alt={seller.name || 'User'} fill className="object-cover" />
                       </div>
                   ) : (
                       <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                          {(seller?.name || listing.userId || 'U')[0]?.toUpperCase()}
                       </div>
                   )}
                   
                   <div className="flex items-center gap-1">
                      <span className="font-bold text-lg">{seller?.name || 'Loading...'}</span> 
                      <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-100" />
                   </div>
                </div>

                {/* Phone Button */}
                {contactPhone && (
                   <div className="flex items-center gap-3 mb-6 p-2 border rounded-lg bg-green-50/50 border-green-100">
                       <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                           <Phone className="w-6 h-6 text-white" />
                       </div>
                       <div className="flex flex-col">
                           <span className="text-xl font-bold text-foreground">{contactPhone}</span>
                           <span className="text-xs text-green-600 font-bold uppercase">Call Now</span>
                       </div>
                   </div>
                )}
                
                {/* Action Buttons Row */}
                <div className="flex items-center justify-around gap-4 mb-6">
                    <Link href={`/messages?listing=${listing._id}`} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-full border-2 border-blue-100 bg-blue-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                             <MessageSquare className="w-7 h-7 text-blue-500" />
                        </div>
                        <span className="text-xs font-bold text-blue-600">Chat</span>
                    </Link>
                    {contactPhone && (
                        <button className="flex flex-col items-center gap-2 group" onClick={() => window.open(`sms:${contactPhone}`)}>
                            <div className="w-14 h-14 rounded-full border-2 border-orange-100 bg-orange-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <MessageCircle className="w-7 h-7 text-orange-500" />
                            </div>
                            <span className="text-xs font-bold text-orange-600">SMS</span>
                        </button>
                    )}
                </div>
             </div>

             {/* Location Map (Google Embed) */}
             <div className="bg-card border rounded-xl overflow-hidden aspect-[4/3] relative">
                 <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.city + (listing.region ? `, ${listing.region}` : ''))}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    className="filter grayscale-[0.2] contrast-[1.1] opacity-90 hover:opacity-100 transition-opacity"
                 ></iframe>
                 <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
                     <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 w-fit">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {listing.city} {listing.region ? `> ${listing.region}` : ''}
                     </span>
                 </div>
             </div>

             {/* Footer Links */}
             <div className="space-y-2 pt-4">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                       <X className="w-4 h-4 text-gray-400" />
                    </div>
                    Report Abuse
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                       <ShieldAlert className="w-4 h-4 text-gray-400" />
                    </div>
                    Avoid Scams
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
