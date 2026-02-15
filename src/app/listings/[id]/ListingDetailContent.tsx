'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { UserAvatar } from '@/components/shared/user-avatar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/lib/context/favorites-context';
import { cn } from '@/lib/utils';
import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import {
    BadgeCheck,
    ChevronLeft,
    Edit,
    Eye,
    Heart,
    History,
    Mail,
    MapPin,
    MessageSquare,
    MoreVertical,
    MousePointerClick,
    Phone,
    Share2,
    ShieldAlert,
    Trash2,
    TrendingUp
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
    previousPrice?: number;
  };
}

export function ListingDetailContent({ listing }: ListingDetailContentProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const { isFavorite: isFavCheck, toggleFavorite } = useFavorites();
  const isFavorite = isFavCheck(listing._id);
  const { data: session } = useSession();
  
  const recordVisit = useMutation(api.history.recordVisit);
  const trackEvent = useMutation(api.analytics.trackEvent);

  // Fetch seller details using External ID (UUID) since listing.userId stores the auth provider ID
  const seller = useConvexQuery(api.users.getByExternalId, { externalId: listing.userId });

  useEffect(() => {
    // Session id for analytics
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(7);
        sessionStorage.setItem('analytics_session_id', sessionId);
    }

    if (listing._id) {
       // Track view
       trackEvent({
           eventType: 'view_listing',
           sessionId: sessionId,
           userId: session?.user?.id,
           data: { listingId: listing._id }
       });
       
       if (session?.user?.id) {
          recordVisit({ 
             listingId: listing._id as Id<"listings">, 
             userId: session.user.id 
          });
       }
    }
  }, [session?.user?.id, listing._id, recordVisit, trackEvent]);

  const handleContactClick = (type: 'contact' | 'call' | 'email') => {
      let sessionId = sessionStorage.getItem('analytics_session_id');
      if (!sessionId) {
          sessionId = Math.random().toString(36).substring(7);
          sessionStorage.setItem('analytics_session_id', sessionId);
      }

      trackEvent({
          eventType: `click_${type}`,
          sessionId: sessionId,
          userId: session?.user?.id,
          data: { listingId: listing._id }
      });
  };

  const images = listing.images || [];
  const mainImage = images[selectedImage] || listing.thumbnail || '/placeholder-listing.jpg';
  
  const date = listing.createdAt ? new Date(listing.createdAt) : new Date();
  
  // Use state to handle hydration mismatch for date formatting
  const [publishDate, setPublishDate] = useState<string>('');
  
  useEffect(() => {
    setPublishDate(date.toLocaleDateString('mk-MK', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
  }, [listing.createdAt]);

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
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header (Big Market Style) */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md  px-4 py-3 flex items-center justify-between shadow-sm md:hidden">
         <div className="flex items-center gap-3">
             <button 
                onClick={() => router.back()} 
                className="p-1 hover:bg-accent rounded-full transition-colors"
             >
                <ChevronLeft className="w-6 h-6 text-foreground" />
             </button>
             <div className="flex flex-col">
                 <span className="text-sm font-black tracking-tight leading-none text-foreground uppercase">AD ID: {listing._id.slice(-7)}</span>
                 <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">{publishDate}</span>
             </div>
         </div>
         <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
             </Button>
             <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                <MoreVertical className="w-5 h-5" />
             </Button>
         </div>
      </div>

      <div className="container-wide max-w-6xl mx-auto md:px-4 md:py-8">
        <AppBreadcrumbs 
          className="mb-4 md:mb-6" 
          customLabel={listing.title}
        />
        
        {/* Desktop Actions Header */}
        <div className="hidden md:flex items-center justify-end mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
             <button 
               onClick={handleShare}
               className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-bold text-foreground hover:bg-accent transition-all shadow-sm"
             >
                <Share2 className="w-4 h-4" />
                Share
             </button>
             <button 
               onClick={() => toggleFavorite(listing._id)}
               className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-all shadow-sm ${
                 isFavorite 
                 ? 'bg-primary/5 border-primary/20 text-primary' 
                 : 'bg-card border-border text-foreground hover:bg-accent'
               }`}
             >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved' : 'Save Ad'}
             </button>

             {session?.user?.id === listing.userId && (
                <>
                  <Link 
                    href={`/my-listings/${listing._id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-bold text-primary hover:bg-primary/20 transition-all shadow-sm"
                  >
                     <Edit className="w-4 h-4" />
                     Edit Ad
                  </Link>
                  <DeleteListingButton listingId={listing._id} compact />
                </>
             )}
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
                      className="object-cover"
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
                        ${selectedImage === idx ? 'ring-2 ring-primary scale-105 shadow-lg opacity-100' : 'opacity-70 hover:opacity-100 grayscale hover:grayscale-0'}
                      `}
                    >
                       <Image src={img} alt="" fill className="object-cover" />
                    </button>
                 ))}
               </div>
            )}

            {/* Mobile-Only Info Grouping */}
            <div className="md:hidden space-y-4 px-4 bg-background border-b py-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                       {seller?.isVerified && (
                         <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded tracking-tighter">Verified Seller</span>
                       )}
                       {condition && (
                         <span className="text-[10px] font-bold uppercase text-muted-foreground border border-border px-2 py-0.5 rounded tracking-tighter">
                            Condition: {String(condition)}
                         </span>
                       )}
                       {listing.status !== 'ACTIVE' && (
                         <span className={cn(
                            "text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-tighter",
                            listing.status === 'PENDING_APPROVAL' ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-red-100 text-red-700 border border-red-200"
                         )}>
                            {listing.status === 'PENDING_APPROVAL' ? 'Pending Approval' : listing.status}
                         </span>
                       )}
                    </div>
                    <h1 className="text-xl font-bold text-foreground leading-tight">
                        {listing.title}
                    </h1>
                    <div className="flex flex-col">
                        {listing.previousPrice && listing.previousPrice > listing.price && (
                            <span className="text-xs font-bold text-muted-foreground/50 line-through mb-[-2px]">
                                {listing.previousPrice.toLocaleString()} €
                            </span>
                        )}
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-primary">
                                {listing.price > 0 ? `${listing.price.toLocaleString()} €` : 'Price on request'}
                            </span>
                            {listing.price > 0 && <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Fixed</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <UserAvatar user={seller} className="w-10 h-10 border-2 border-border" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-sm text-foreground">{seller?.name || 'Seller'}</span>
                            {seller?.isVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                          Member since {seller?.createdAt ? new Date(seller.createdAt).getFullYear() : 'N/A'}
                        </p>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(listing._id)}
                      className={`p-2.5 rounded-full transition-colors ${isFavorite ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                    >
                        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                </div>
                
                {session?.user?.id !== listing.userId && (
                    <>
                        {/* Mobile Contact Shortcuts */}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <Link 
                            href={`/messages?listingId=${listing._id}`}
                            onClick={() => handleContactClick('contact')}
                            className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-tight shadow-lg shadow-primary/20 active:scale-95 transition-all"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Send Message
                            </Link>
                            {contactPhone && (
                                <a 
                                href={`tel:${contactPhone}`}
                                onClick={() => handleContactClick('call')}
                                className="flex items-center justify-center gap-2 py-3.5 bg-green-500 text-white rounded-xl font-black text-sm uppercase tracking-tight shadow-lg shadow-green-200 active:scale-95 transition-all"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call Now
                                </a>
                            )}
                        </div>
                        
                        {contactEmail && (
                            <div className="mt-3 flex items-center justify-center p-3 bg-accent rounded-xl text-xs font-bold text-muted-foreground border border-border gap-2">
                                <Mail className="w-4 h-4" />
                                <span>Email: {contactEmail}</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Specifications Section */}
            {listing.specifications && Object.keys(listing.specifications).length > 0 && (
               <div className="bg-card md:rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-muted">
                      <h3 className="font-black text-foreground uppercase tracking-tight text-sm">Technical Specifications</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                     <div className="divide-y divide-border">
                        {Object.entries(listing.specifications)
                          .filter(([key]) => key !== 'condition' && !key.startsWith('_'))
                          .slice(0, Math.ceil(Object.entries(listing.specifications).filter(([key]) => key !== 'condition' && !key.startsWith('_')).length / 2))
                          .map(([key, value]) => (
                           <div key={key} className="flex justify-between items-center p-4 hover:bg-accent transition-colors">
                              <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="font-bold text-foreground text-sm">{String(value)}</span>
                           </div>
                        ))}
                     </div>
                     <div className="divide-y divide-border">
                        {Object.entries(listing.specifications)
                          .filter(([key]) => key !== 'condition' && !key.startsWith('_'))
                          .slice(Math.ceil(Object.entries(listing.specifications).filter(([key]) => key !== 'condition' && !key.startsWith('_')).length / 2))
                          .map(([key, value]) => (
                           <div key={key} className="flex justify-between items-center p-4 hover:bg-accent transition-colors">
                              <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="font-bold text-foreground text-sm">{String(value)}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {/* Description Section */}
            <div className="bg-card md:rounded-2xl border border-border shadow-sm px-6 py-8 space-y-6">
               <div className="space-y-1">
                  <h3 className="font-black text-foreground uppercase tracking-tight text-sm">Product Description</h3>
                  <div className="h-1 w-8 bg-primary rounded-full" />
               </div>
               <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-base">
                  {listing.description}
               </p>
            </div>

          </div>


          {/* Right Column (lg:col-span-4) - Hidden/Transformed on Mobile */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4 space-y-6">
             {/* Sticky Actions Container */}
             <div className="top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 no-scrollbar">
                {/* Price & Primary Details */}
                <div className="bg-card border-2 border-border rounded-3xl p-6 md:p-8 shadow-xl shadow-foreground/5 space-y-6">
                   <div className="space-y-2">
                       <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight uppercase group-hover:text-primary transition-colors">
                          {listing.title}
                       </h1>
                       <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {listing.city}, {listing.region || 'Skopje'}
                       </div>
                   </div>
                   
                   <div className="p-6 bg-muted rounded-2xl flex flex-col gap-1 border border-border relative overflow-hidden">
                       {listing.status !== 'ACTIVE' && (
                         <div className={cn(
                            "absolute top-3 left-4 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm z-10",
                            listing.status === 'PENDING_APPROVAL' ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-red-100 text-red-700 border-red-200"
                         )}>
                            {listing.status === 'PENDING_APPROVAL' ? 'Pending Approval' : listing.status}
                         </div>
                       )}
                       {listing.previousPrice && listing.previousPrice > listing.price && (
                           <div className="absolute top-3 right-4 flex items-center gap-1.5 opacity-60">
                               <History className="w-3 h-3" />
                               <span className="text-xs font-bold line-through">{listing.previousPrice.toLocaleString()} €</span>
                           </div>
                       )}
                       <div className="text-4xl font-black text-primary tracking-tighter">
                          {listing.price > 0 ? `${listing.price.toLocaleString()} €` : 'Call for Price'}
                       </div>
                       <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          Secured Transaction • Fixed Price
                       </div>
                   </div>

                   {session?.user?.id !== listing.userId && (
                     <>
                        <div className="space-y-3 pt-2">
                            <Button asChild className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg uppercase tracking-tight shadow-xl shadow-primary/20 group">
                                <Link href={`/messages?listingId=${listing._id}`} onClick={() => handleContactClick('contact')}>
                                    <MessageSquare className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                                    Send Message
                                </Link>
                            </Button>
                            
                            {/* Phone Number Display */}
                            <div className="flex w-full gap-2 overflow-hidden">
                                {contactPhone && (
                                        <Button asChild variant="outline" className="flex-1 min-w-0 h-14 rounded-2xl border-2 border-border font-black text-sm lg:text-base text-foreground hover:bg-accent group">
                                            <a href={`tel:${contactPhone}`} onClick={() => handleContactClick('call')} className="flex items-center justify-center truncate px-3">
                                                <Phone className="shrink-0 mr-2 h-5 w-5 text-green-500" />
                                                <span className="truncate">{contactPhone}</span>
                                            </a>
                                        </Button>
                                )}

                                <Button asChild variant="outline" className="w-14 h-14 px-0 rounded-2xl border-2 border-border text-muted-foreground hover:bg-accent">
                                        <a href={`sms:${contactPhone || ''}`}>
                                            <MessageSquare className="h-6 w-6" />
                                        </a>
                                </Button>
                            </div>
                        </div>

                        {/* Email Display */}
                        {contactEmail && (
                            <div className="flex items-center justify-center p-3 bg-muted rounded-xl text-xs font-bold text-muted-foreground border border-border gap-2">
                                <span>Email: {contactEmail}</span>
                            </div>
                        )}
                     </>
                   )}

                       <div className="flex items-center justify-center pt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest gap-4">
                           <span>ID: {listing._id.slice(-7)}</span>
                           <span>•</span>
                           <span>Posted: {publishDate}</span>
                       </div>
                   </div>

                {/* Seller Profile Card */}
                <div className="bg-card border border-border rounded-3xl p-6 md:p-6 shadow-sm overflow-hidden relative">
                    <div className="flex items-center gap-4 mb-6 relative">
                       <UserAvatar 
                          user={seller} 
                          className="w-16 h-16 border-4 border-muted shadow-md" 
                       />
                       <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                             <h4 className="font-black text-foreground text-lg">{seller?.name || 'Loading...'}</h4> 
                             {seller?.isVerified && <BadgeCheck className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {seller?.isVerified ? 'Verified' : 'Member'} since {seller?.createdAt ? new Date(seller.createdAt).getFullYear() : 'N/A'}
                          </p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-muted rounded-xl text-center border border-border">
                           <div className="text-lg font-black text-foreground">12</div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Active Ads</p>
                        </div>
                        <div className="p-3 bg-muted rounded-xl text-center border border-border">
                           <div className="text-lg font-black text-foreground">4.9</div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Seller Rating</p>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm aspect-[1.5/1] relative group">
                    <iframe 
                       width="100%" 
                       height="100%" 
                       frameBorder="0" 
                       src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.city + (listing.region ? `, ${listing.region}` : ''))}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                       className="filter grayscale-[0.3] contrast-[1.1] opacity-90 group-hover:opacity-100 transition-opacity"
                    ></iframe>
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                        <div className="bg-card/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black shadow-xl border border-border flex items-center gap-2 w-fit text-foreground uppercase tracking-tight">
                           <MapPin className="w-4 h-4 text-primary" />
                           {listing.city} • {listing.region || 'CENTAR'}
                        </div>
                    </div>
                </div>

                {/* Safety Tips */}
                <div className="space-y-2 px-2">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Safety & Trust</p>
                   <button className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl group hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                              <ShieldAlert className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                           </div>
                           <span className="text-xs font-bold text-foreground">Report suspicious activity</span>
                       </div>
                       <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Mobile-Only Map & Safety */}
        <div className="md:hidden px-4 py-8 space-y-6">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm aspect-[4/3] relative">
                <iframe 
                    width="100%" height="100%" frameBorder="0" 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    className="filter contrast-[1.1]"
                ></iframe>
                <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black shadow-lg border border-border">
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

      {/* Sticky Bottom Contact Bar (Mobile Only) */}
      {session?.user?.id !== listing.userId && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-background/80 backdrop-blur-lg border-t border-border shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:hidden flex gap-3 animate-in fade-in slide-in-from-bottom-full duration-500 pointer-events-auto">
            {contactPhone && (
                <a 
                    href={`tel:${contactPhone}`}
                    onClick={() => handleContactClick('call')}
                    className="flex-[0.4] flex items-center justify-center gap-2 py-3.5 bg-green-500 text-white rounded-2xl font-black text-sm uppercase tracking-tight shadow-lg shadow-green-200 active:scale-95 transition-all"
                >
                    <Phone className="w-4 h-4" />
                    Call
                </a>
            )}
            <Link 
                href={`/messages?listingId=${listing._id}`}
                onClick={() => handleContactClick('contact')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-tight shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
                <MessageSquare className="w-4 h-4" />
                Message Seller
            </Link>
        </div>
      )}
    </div>
  );
}

function OwnerListingStats({ listingId, currentViewCount }: { listingId: string, currentViewCount?: number }) {
    const stats = useConvexQuery(api.analytics.getDetailedListingStats, { listingId: listingId as Id<"listings">, days: 30 });
    
    // Fallback while loading
    const totalViews = stats ? stats.totalViews : (currentViewCount || 0);
    const totalClicks = stats ? stats.totalClicks : 0;
    const totalFavorites = stats ? stats.totalFavorites : 0;
    
    if (!stats) return (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 opacity-50">
             {[1, 2, 3, 4].map(i => (
                 <div key={i} className="bg-muted border border-border rounded-lg md:rounded-xl p-4 h-24 animate-pulse"></div>
             ))}
         </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {/* Views */}
            <div className="bg-muted border border-border rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center text-center gap-1 sm:gap-1.5 md:gap-2 group hover:bg-accent transition-colors">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary group-hover:scale-110 transition-transform" />
                <div>
                    <div className="text-lg sm:text-xl md:text-2xl font-black text-foreground">{totalViews}</div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Views</div>
                </div>
            </div>

            {/* Leads / Clicks */}
            <div className="bg-muted border border-border rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center text-center gap-1 sm:gap-1.5 md:gap-2 group hover:bg-accent transition-colors">
                <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                <div>
                    <div className="text-lg sm:text-xl md:text-2xl font-black text-foreground">{totalClicks}</div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Leads</div>
                </div>
            </div>

            {/* Favorites */}
            <div className="bg-muted border border-border rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center text-center gap-1 sm:gap-1.5 md:gap-2 group hover:bg-accent transition-colors">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-rose-500 group-hover:scale-110 transition-transform" />
                <div>
                    <div className="text-lg sm:text-xl md:text-2xl font-black text-foreground">{totalFavorites}</div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Favorites</div>
                </div>
            </div>

            {/* Engagement Rate (Ratio) */}
            <div className="bg-muted border border-border rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center text-center gap-1 sm:gap-1.5 md:gap-2 group hover:bg-accent transition-colors">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                <div>
                    <div className="text-lg sm:text-xl md:text-2xl font-black text-foreground">
                        {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'}%
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ratio</div>
                </div>
            </div>
        </div>
    );
}

function DeleteListingButton({ listingId, compact }: { listingId: string, compact?: boolean }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteListing = useMutation(api.listings.remove);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteListing({ id: listingId as Id<"listings"> });
            router.push('/my-listings');
        } catch (error) {
            console.error("Failed to delete listing", error);
            alert("Failed to delete listing. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant={compact ? "ghost" : "destructive"}
                    className={compact 
                        ? "h-9 px-4 rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold text-sm transition-all"
                        : "h-10 sm:h-11 md:h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm sm:col-span-2 md:col-span-1 min-w-0"
                    }
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        "..." 
                    ) : (
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 w-full">
                            <Trash2 className="w-4 h-4 shrink-0" />
                            {!compact && <span className="truncate">Delete Listing</span>}
                            {compact && <span>Delete</span>}
                        </div>
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2.5rem] border-2 border-border p-10 max-w-md">
                <AlertDialogHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                        <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <AlertDialogTitle className="text-3xl font-black uppercase tracking-tight text-center">Delete Listing?</AlertDialogTitle>
                    <AlertDialogDescription className="font-bold text-muted-foreground text-center text-base">
                        This action is permanent and cannot be undone. Are you sure you want to remove this ad from Big Market?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-3 pt-6">
                    <AlertDialogCancel className="rounded-full font-black uppercase text-xs tracking-widest h-14 border-2 flex-1">Keep Listing</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete}
                        className="rounded-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest h-14 shadow-xl shadow-red-200 flex-1"
                    >
                        Delete Permanently
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
