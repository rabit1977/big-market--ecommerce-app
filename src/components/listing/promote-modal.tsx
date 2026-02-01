
'use client';

import { promoteListingAction } from '@/actions/listing-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Check, Crown, Loader2, Sparkles, Star } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface PromoteModalProps {
  children: React.ReactNode;
  listingId: string;
}

const PROMOTION_TIERS = [
    {
        id: 'BRONZE',
        name: 'Basic Boost',
        price: '50 MKD',
        duration: '3 days',
        description: 'Get noticed with a highlighted border',
        icon: Star,
        color: 'text-amber-700',
        bg: 'bg-amber-100',
        border: 'border-amber-200',
        ring: 'ring-amber-500',
    },
    {
        id: 'SILVER',
        name: 'Silver Featured',
        price: '150 MKD',
        duration: '7 days',
        description: 'Top of category + Highlighted + Badge',
        icon: Sparkles,
        color: 'text-slate-500',
        bg: 'bg-slate-100',
        border: 'border-slate-200',
        ring: 'ring-slate-500',
    },
    {
        id: 'GOLD',
        name: 'Gold Premium',
        price: '300 MKD',
        duration: '30 days',
        description: 'Homepage Feature + Top of Search + Gold Badge',
        icon: Crown,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        ring: 'ring-yellow-500',
    }
];

export function PromoteModal({ children, listingId }: PromoteModalProps) {
    const [open, setOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState('SILVER');
    const [isPending, startTransition] = useTransition();

    const handlePromote = () => {
        startTransition(async () => {
            const tier = PROMOTION_TIERS.find(t => t.id === selectedTier);
            if (!tier) return;
            
            // Duration parsing logic mock
            const durationDays = tier.id === 'GOLD' ? 30 : tier.id === 'SILVER' ? 7 : 3;

            const res = await promoteListingAction(listingId, tier.id as any, durationDays);
            
            if (res.success) {
                toast.success(`Listing promoted to ${tier.name}!`);
                setOpen(false);
            } else {
                toast.error(res.error || 'Failed to promote listing');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                        Promote Your Listing
                    </DialogTitle>
                    <DialogDescription>
                        Get more views and sell faster by upgrading your ad.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="gap-4">
                        {PROMOTION_TIERS.map((tier) => (
                            <div key={tier.id} className="relative">
                                <RadioGroupItem
                                    value={tier.id}
                                    id={tier.id}
                                    className="peer sr-only"
                                />
                                <label
                                    htmlFor={tier.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50",
                                        "peer-data-[state=checked]:bg-muted/30",
                                        tier.id === selectedTier ? `${tier.border} bg-white shadow-sm ring-1 ${tier.ring}` : "border-transparent bg-muted/20"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", tier.bg)}>
                                            <tier.icon className={cn("w-6 h-6", tier.color)} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base flex items-center gap-2">
                                                {tier.name}
                                                {tier.id === 'GOLD' && <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-[10px] h-5">Best Value</Badge>}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">{tier.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-lg">{tier.price}</div>
                                        <div className="text-xs font-medium text-muted-foreground">{tier.duration}</div>
                                    </div>
                                    
                                    {tier.id === selectedTier && (
                                        <div className={cn("absolute top-0 right-0 p-1 rounded-bl-lg rounded-tr-lg bg-primary text-primary-foreground")}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handlePromote} 
                        disabled={isPending}
                        className={cn(
                            "font-bold w-full sm:w-auto",
                            selectedTier === 'GOLD' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white' : ''
                        )}
                    >
                        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Confirm Promotion
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
