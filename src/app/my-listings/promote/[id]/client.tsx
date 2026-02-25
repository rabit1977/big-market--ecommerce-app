'use client';

import { createPromotionCheckoutSession } from '@/actions/stripe-actions';
import { PromotionIcon } from '@/components/shared/listing/promotion-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { PROMOTIONS, getPromotionConfig } from '@/lib/constants/promotions';
import { ListingWithRelations } from '@/lib/types/listing';
import { cn } from '@/lib/utils';
import { Check, CreditCard, Megaphone } from 'lucide-react';
import { User } from 'next-auth';
import { useState } from 'react';
import { toast } from 'sonner';

interface PromotePageClientProps {
  listing: ListingWithRelations;
  user?: User;
}

const VAT_RATE = 0.18; // Standard VAT

export function PromotePageClient({ listing, user }: PromotePageClientProps) {
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const togglePromotion = (id: string) => {
      // Block if listing already has an active promotion
      if (isPromoted) {
          toast.error(`This listing already has an active promotion (${getDaysRemaining(listing.promotionExpiresAt)} days left). Wait for it to expire before promoting again.`);
          return;
      }
      // Enforce single selection
      setSelectedPromotions(prev => 
          prev.includes(id) ? [] : [id]
      );
  };

  const subtotal = PROMOTIONS
      .filter(p => selectedPromotions.includes(p.id))
      .reduce((sum, p) => sum + p.price, 0);
  
  const vatAmount = subtotal * VAT_RATE;
  const total = subtotal + vatAmount;

  const handlePayment = async () => {
      if (selectedPromotions.length === 0) {
          toast.error("Please select a promotion first");
          return;
      }

      if (!user?.id || !user?.email) {
          toast.error("You must be logged in to promote a listing");
          return;
      }

      setIsProcessing(true);
      
      try {
          // Get the selected promotion (we enforce single select now)
          const promoId = selectedPromotions[0];
          const promo = PROMOTIONS.find(p => p.id === promoId);
          
          if (!promo) throw new Error("Invalid promotion selected");

          const { url } = await createPromotionCheckoutSession(
              listing.id,
              user.id,
              user.email,
              promo.title,
              promo.id,
              total
          );

          if (url) {
              window.location.href = url;
          } else {
              throw new Error("Failed to create payment session");
          }
          
      } catch (error) {
          console.error(error);
          toast.error("Something went wrong. Please try again.");
          setIsProcessing(false);
      }
  };

  const getDaysRemaining = (expiresAt?: number) => {
      if (!expiresAt) return null;
      const diff = expiresAt - Date.now();
      if (diff <= 0) return 0;
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isPromoted = !!(listing.isPromoted && listing.promotionExpiresAt && listing.promotionExpiresAt > Date.now());

  return (
    <div className="space-y-8">

        {/* Active Promotion Banner */}
        {isPromoted && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                    <h3 className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">This listing is already promoted</h3>
                    <p className="text-sm text-muted-foreground">
                        Current promotion: <strong className="text-foreground">{getPromotionConfig(listing.promotionTier)?.title || listing.promotionTier}</strong>
                        {' '}&bull;{' '}
                        <strong>{getDaysRemaining(listing.promotionExpiresAt)} days</strong> remaining.
                        You can select a new promotion after the current one expires.
                    </p>
                </div>
            </div>
        )}
        
        {/* Promotion Options */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Select Promotion Options
            </h2>
            
            <div className="space-y-4">
                {PROMOTIONS.map((promo) => {
                    const isActive = isPromoted && listing.promotionTier === promo.id;
                    const remainingDays = isActive ? getDaysRemaining(listing.promotionExpiresAt) : null;
                    const badgeText = remainingDays !== null ? `${remainingDays} days left` : promo.days;

                    return (
                    <div 
                        key={promo.id}
                        onClick={() => !isPromoted && togglePromotion(promo.id)}
                        className={cn(
                            "relative flex flex-col md:flex-row items-stretch rounded-2xl border-2 transition-all overflow-hidden bg-card",
                            isPromoted ? "cursor-not-allowed opacity-60" : "cursor-pointer group hover:shadow-md",
                            selectedPromotions.includes(promo.id) 
                                ? `${promo.borderColor} ${promo.bgColor} shadow-sm` 
                                : "border-border/40 hover:border-primary/10",
                            isActive && "ring-2 ring-emerald-500 border-emerald-500/20"
                        )}
                    >
                        {/* Very Big Image Section */}
                        <div className="w-full md:w-56 h-48 md:h-auto shrink-0 relative overflow-hidden bg-muted">
                             <img 
                                src={listing.images?.[0]?.url || listing.thumbnail || '/placeholder.png'} 
                                alt="Listing" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Overlay Badge */}
                            <div className={cn(
                                "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-background/90 backdrop-blur-sm border border-border/50 shadow-sm",
                                isActive ? "bg-emerald-500 text-white border-none" : promo.color
                            )}>
                                {badgeText}
                            </div>

                            {/* Icon Badge */}
                            <div className={cn(
                                "absolute top-3 right-3 p-1.5 rounded-full shadow-sm text-white",
                                promo.color.replace('text-', 'bg-')
                            )}>
                                <PromotionIcon iconName={promo.icon} className="w-3.5 h-3.5 fill-current" />
                            </div>
                            
                            {/* Mobile Price Overlay */}
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent md:hidden">
                                <span className="text-white font-black text-lg">{promo.price} MKD <span className="text-xs font-medium opacity-80">+ VAT</span></span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between gap-3 md:gap-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1.5 md:space-y-2">
                                    <h3 className={cn("font-black text-lg md:text-xl leading-tight", promo.color)}>
                                        {promo.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                                        {promo.description}
                                    </p>
                                </div>
                                
                                {/* Desktop Price & Checkbox */}
                                <div className="hidden md:flex flex-col items-end gap-3 pl-4">
                                    <div className="text-right">
                                        <div className={cn("font-black text-2xl", promo.color)}>
                                            {promo.price} MKD
                                        </div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                            + VAT
                                        </div>
                                    </div>
                                    <Switch 
                                        checked={selectedPromotions.includes(promo.id)}
                                        onCheckedChange={() => togglePromotion(promo.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="data-[state=checked]:bg-primary scale-110"
                                    />
                                </div>
                            </div>
                            
                            {/* Mobile Switch Bottom Row */}
                            <div className="flex md:hidden items-center justify-between pt-2 border-t border-border/10">
                                <span className={cn("font-bold text-sm", selectedPromotions.includes(promo.id) ? "text-primary" : "text-muted-foreground")}>
                                    {selectedPromotions.includes(promo.id) ? "Selected" : "Add Promotion"}
                                </span>
                                <Switch 
                                    checked={selectedPromotions.includes(promo.id)}
                                    onCheckedChange={() => togglePromotion(promo.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                        </div>
                        
                        {/* Selected Indicator Checkmark */}
                        {selectedPromotions.includes(promo.id) && (
                             <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-primary text-white p-1.5 rounded-full shadow-lg z-10 animate-in zoom-in spin-in-12 duration-300">
                                 <Check className="w-4 h-4 stroke-[4]" />
                             </div>
                        )}
                    </div>
                );
            })}
            </div>
        </div>

        {/* Payment Summary */}
        <Card className="border-border shadow-xl bg-card overflow-hidden mt-8 sticky bottom-4">
            <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-500 to-amber-500" />
            <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-1">Order Summary</h3>
                        <p className="text-sm text-muted-foreground">Review your selected promotions before payment.</p>
                    </div>
                    <div className="w-full md:w-auto min-w-[200px] space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-bold">{Math.round(subtotal)} MKD</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">VAT (18%):</span>
                            <span className="font-bold">{Math.round(vatAmount)} MKD</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-baseline pt-1">
                            <span className="text-base font-black uppercase text-foreground">Total:</span>
                            <span className="text-2xl font-black text-primary">{Math.round(total)} MKD</span>
                        </div>
                    </div>
                </div>

                <Button 
                    size="lg" 
                    className="w-full h-11 md:h-12 text-sm md:text-lg font-black uppercase tracking-wider shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all bg-primary hover:bg-primary/90"
                    disabled={selectedPromotions.length === 0 || isProcessing || isPromoted}
                    onClick={handlePayment}
                >
                    {isProcessing ? (
                        <>Processing Payment...</>
                    ) : (
                        <span className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Pay {total > 0 ? `${Math.round(total)} MKD` : 'Now'}
                        </span>
                    )}
                </Button>
                
                <div className="flex justify-center items-center gap-4 mt-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                     <div className="h-6 w-10 bg-muted rounded border border-border" /> 
                     <div className="h-6 w-10 bg-muted rounded border border-border" /> 
                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Secure Payment via Stripe</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
