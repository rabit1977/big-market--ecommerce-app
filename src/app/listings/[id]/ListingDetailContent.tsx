'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { UserAvatar } from '@/components/shared/user-avatar';
import { Button } from '@/components/ui/button';
import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
   BadgeCheck,
   ChevronLeft,
   Heart,
   Mail,
   MapPin,
   MessageCircle,
   MessageSquare,
   MoreVertical,
   Phone,
   Share2,
   ShieldAlert
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

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
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();
  
  const recordVisit = useMutation(api.history.recordVisit);

  // Fetch seller details using External ID (UUID) since listing.userId stores the auth provider ID
  const seller = useConvexQuery(api.users.getByExternalId, { externalId: listing.userId });

  useEffect(() => {
    if (session?.user?.id && listing._id) {
       recordVisit({ 
          listingId: listing._id as Id<"listings">, 
          userId: session.user.id 
       });
    }
  }, [session?.user?.id, listing._id, recordVisit]);

  const images = listing.images || [];
  const mainImage = images[selectedImage] || listing.thumbnail || '/placeholder-listing.jpg';
  
  const date = listing.createdAt ? new Date(listing.createdAt) : new Date();
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const publishDate = date.toLocaleDateString('mk-MK', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Use actual condition if available
  const condition = listing.specifications?.condition; 
  // Use actual contact phone from listing or fallback to seller's phone if available (though listing.contactPhone is preferred for the item)
  const contactPhone = listing.contactPhone || (seller as any)?.phone;
  // Use actual contact email from listing or fallback to seller's email
  const contactEmail = listing.contactEmail || (seller as any)?.email;

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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Mobile Header (Big Market Style) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between shadow-sm md:hidden">
         <div className="flex items-center gap-3">
             <button 
                onClick={() => router.back()} 
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
             >
                <ChevronLeft className="w-6 h-6 text-slate-700" />
             </button>
             <div className="flex flex-col">
                 <span className="text-sm font-black tracking-tight leading-none text-slate-900 uppercase">AD ID: {listing._id.slice(-7)}</span>
                 <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{publishDate}</span>
             </div>
         </div>
         <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
             </Button>
             <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600">
                <MoreVertical className="w-5 h-5" />
             </Button>
         </div>
      </div>

      <div className="container-wide max-w-6xl mx-auto px-0 md:px-4 md:py-8">
        <AppBreadcrumbs 
          className="px-4 md:px-0 mb-4 md:mb-6" 
          customLabel={listing.title}
        />
        
        {/* Desktop Actions Header */}
        <div className="hidden md:flex items-center justify-end mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
             <button 
               onClick={handleShare}
               className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
             >
                <Share2 className="w-4 h-4" />
                Share
             </button>
             <button 
               onClick={() => setIsFavorite(!isFavorite)}
               className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-all shadow-sm ${
                 isFavorite 
                 ? 'bg-red-50 border-red-200 text-red-600' 
                 : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
               }`}
             >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved' : 'Save Ad'}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8">
          {/* Left Column: Images, Specs, Description (lg:col-span-8) */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4 md:space-y-6">
            
            {/* Image Section - Edge-to-edge on mobile */}
            <div className="relative group bg-slate-900 overflow-hidden md:rounded-2xl shadow-xl">
                <div className="relative aspect-[4/3] md:aspect-video w-full">
                    <Image
                      src={mainImage}
                      alt={listing.title}
                      fill
                      className="object-contain"
                      priority
                    />
                </div>
                
                {/* Image Navigation Overlays (Desktop Only) */}
                {images.length > 1 && (
                  <div className="absolute inset-0 hidden md:flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     <button 
                       onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                       className="p-3 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all pointer-events-auto"
                     >
                        <ChevronLeft className="w-6 h-6" />
                     </button>
                     <button 
                       onClick={() => setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                       className="p-3 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all pointer-events-auto"
                     >
                        <ChevronLeft className="w-6 h-6 rotate-180" />
                     </button>
                  </div>
                )}

                {/* Counter & Status */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                   <div className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                      {selectedImage + 1} / {Math.max(images.length, 1)} PHOTOS
                   </div>
                </div>

                {listing.status === 'SOLD' && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-red-600 text-white text-3xl font-black px-12 py-4 rounded-xl shadow-2xl skew-x-[-12deg] border-4 border-white/20">
                       SOLD OUT
                    </div>
                  </div>
                )}
            </div>

            {/* Thumbnail Grid - Optimized Scrollable */}
            {images.length > 1 && (
               <div className="flex gap-2 overflow-x-auto px-4 md:px-0 py-2 no-scrollbar snap-x">
                 {images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImage(idx)} 
                      className={`
                        relative flex-shrink-0 aspect-square w-16 md:w-24 rounded-lg overflow-hidden snap-start transition-all duration-300
                        ${selectedImage === idx ? 'ring-2 ring-primary scale-105 shadow-lg' : 'opacity-70 hover:opacity-100 grayscale hover:grayscale-0'}
                      `}
                    >
                       <Image src={img} alt="" fill className="object-cover" />
                    </button>
                 ))}
               </div>
            )}

            {/* Mobile-Only Info Grouping */}
            <div className="md:hidden space-y-4 px-4 bg-white border-b py-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-2 py-0.5 rounded tracking-tighter">Verified Ad</span>
                       {condition && (
                         <span className="text-[10px] font-bold uppercase text-slate-500 border border-slate-200 px-2 py-0.5 rounded tracking-tighter">
                            Condition: {String(condition)}
                         </span>
                       )}
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 leading-tight">
                        {listing.title}
                    </h1>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-blue-700">
                            {listing.price > 0 ? `${listing.price.toLocaleString()} €` : 'Price on request'}
                        </span>
                        {listing.price > 0 && <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Fixed</span>}
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <UserAvatar user={seller} className="w-10 h-10 border-2 border-slate-100" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-sm text-slate-900">{seller?.name || 'Seller'}</span>
                            <BadgeCheck className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Member since 2024</p>
                    </div>
                    <button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-2.5 rounded-full transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}
                    >
                        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                </div>
                
                {/* Mobile Contact Shortcuts */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                    <Link 
                      href={`/messages?listing=${listing._id}`}
                      className="flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-tight shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Send Message
                    </Link>
                    {contactPhone && (
                        <a 
                          href={`tel:${contactPhone}`}
                          className="flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-white rounded-xl font-black text-sm uppercase tracking-tight shadow-lg shadow-emerald-200 active:scale-95 transition-all"
                        >
                            <Phone className="w-4 h-4" />
                            Call Now
                        </a>
                    )}
                </div>
                
                {contactEmail && (
                    <div className="mt-3 flex items-center justify-center p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 border border-slate-100 gap-2">
                        <Mail className="w-4 h-4" />
                        <span>Email: {contactEmail}</span>
                    </div>
                )}
            </div>

            {/* Specifications Section */}
            {listing.specifications && Object.keys(listing.specifications).length > 0 && (
               <div className="bg-white md:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Technical Specifications</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                     <div className="divide-y divide-slate-100">
                        {Object.entries(listing.specifications)
                          .filter(([key]) => key !== 'condition' && !key.startsWith('_'))
                          .slice(0, Math.ceil(Object.entries(listing.specifications).filter(([key]) => key !== 'condition' && !key.startsWith('_')).length / 2))
                          .map(([key, value]) => (
                           <div key={key} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="font-bold text-slate-900 text-sm">{String(value)}</span>
                           </div>
                        ))}
                     </div>
                     <div className="divide-y divide-slate-100">
                        {Object.entries(listing.specifications)
                          .filter(([key]) => key !== 'condition' && !key.startsWith('_'))
                          .slice(Math.ceil(Object.entries(listing.specifications).filter(([key]) => key !== 'condition' && !key.startsWith('_')).length / 2))
                          .map(([key, value]) => (
                           <div key={key} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="font-bold text-slate-900 text-sm">{String(value)}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {/* Description Section */}
            <div className="bg-white md:rounded-2xl border border-slate-200 shadow-sm px-6 py-8 space-y-6">
               <div className="space-y-1">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">Product Description</h3>
                  <div className="h-1 w-8 bg-primary rounded-full" />
               </div>
               <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-base">
                  {listing.description}
               </p>
            </div>
          </div>

          {/* Right Column (lg:col-span-4) - Hidden/Transformed on Mobile */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4 space-y-6">
             {/* Sticky Actions Container */}
             <div className="top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 no-scrollbar">
                {/* Price & Primary Details */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 space-y-6">
                   <div className="space-y-2">
                       <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase group-hover:text-primary transition-colors">
                          {listing.title}
                       </h1>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {listing.city}, {listing.region || 'Skopje'}
                       </div>
                   </div>
                   
                   <div className="p-6 bg-slate-50 rounded-2xl flex flex-col gap-1 border border-slate-200/60">
                       <div className="text-4xl font-black text-primary tracking-tighter">
                          {listing.price > 0 ? `${listing.price.toLocaleString()} €` : 'Call for Price'}
                       </div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Secured Transaction • Fixed Price
                       </div>
                   </div>

                   <div className="space-y-3 pt-2">
                      <Button asChild className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg uppercase tracking-tight shadow-xl shadow-blue-200 group">
                         <Link href={`/messages?listing=${listing._id}`}>
                            <MessageSquare className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                            Send Message
                         </Link>
                      </Button>
                      
                       {/* Phone Number Display */}
                       <div className="flex gap-2">
                           {contactPhone && (
                                <Button asChild variant="outline" className="flex-1 h-14 rounded-2xl border-2 border-slate-100 font-black text-lg text-slate-900 hover:bg-slate-50 group">
                                    <a href={`tel:${contactPhone}`}>
                                        <Phone className="mr-2 h-5 w-5 text-emerald-500" />
                                        {contactPhone}
                                    </a>
                                </Button>
                           )}

                           <Button asChild variant="outline" className="w-14 h-14 px-0 rounded-2xl border-2 border-slate-100 text-slate-600 hover:bg-slate-50">
                                <a href={`sms:${contactPhone || ''}`}>
                                    <MessageCircle className="h-6 w-6" />
                                </a>
                           </Button>
                       </div>
                   </div>

                   {/* Email Display */}
                   {contactEmail && (
                       <div className="flex items-center justify-center p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 border border-slate-100 gap-2">
                           <span>Email: {contactEmail}</span>
                       </div>
                   )}

                       <div className="flex items-center justify-center pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-4">
                           <span>ID: {listing._id.slice(-7)}</span>
                           <span>•</span>
                           <span>Posted: {publishDate}</span>
                       </div>
                   </div>
                </div>

                {/* Seller Profile Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4">
                        <BadgeCheck className="w-8 h-8 text-blue-500 fill-blue-50 opacity-20" />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative">
                       <UserAvatar 
                          user={seller} 
                          className="w-16 h-16 border-4 border-slate-50 shadow-md" 
                       />
                       <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                             <h4 className="font-black text-slate-900 text-lg">{seller?.name || 'Loading...'}</h4> 
                             <BadgeCheck className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Seller since 2024</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                           <div className="text-lg font-black text-slate-900">12</div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Active Ads</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                           <div className="text-lg font-black text-slate-900">4.9</div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Seller Rating</p>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm aspect-[1.5/1] relative group">
                    <iframe 
                       width="100%" 
                       height="100%" 
                       frameBorder="0" 
                       src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.city + (listing.region ? `, ${listing.region}` : ''))}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                       className="filter grayscale-[0.3] contrast-[1.1] opacity-90 group-hover:opacity-100 transition-opacity"
                    ></iframe>
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                        <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black shadow-xl border border-slate-100 flex items-center gap-2 w-fit text-slate-900 uppercase tracking-tight">
                           <MapPin className="w-4 h-4 text-red-500" />
                           {listing.city} • {listing.region || 'CENTAR'}
                        </div>
                    </div>
                </div>

                {/* Safety Tips */}
                <div className="space-y-2 px-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Safety & Trust</p>
                   <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-red-100 transition-all">
                       <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-red-50 transition-colors">
                              <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                           </div>
                           <span className="text-xs font-bold text-slate-700">Report suspicious activity</span>
                       </div>
                       <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Mobile-Only Map & Safety */}
        <div className="md:hidden px-4 py-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm aspect-[4/3] relative">
                <iframe 
                    width="100%" height="100%" frameBorder="0" 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    className="filter contrast-[1.1]"
                ></iframe>
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black shadow-lg">
                    {listing.city}
                </div>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                <div className="flex items-center gap-2 text-amber-900">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="font-black text-xs uppercase tracking-tighter">Safety First</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Do not pay in advance. Meet the seller in a public place. Always inspect the item before buying.
                </p>
            </div>
        </div>
      </div>
);
}
