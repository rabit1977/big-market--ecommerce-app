'use client';

import { createPromotionCheckoutSession } from '@/actions/stripe-actions';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface PromotionCardProps {
  listingId: string;
  userId: string;
  userEmail: string;
  title: string;
  tier: string;
  price: number;
}

export function PromotionButton({ listingId, userId, userEmail, title, tier, price }: PromotionCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCheckout = () => {
    startTransition(async () => {
      try {
        const { url } = await createPromotionCheckoutSession(
          listingId,
          userId,
          userEmail || '',
          title,
          tier,
          price
        );

        if (url) {
          window.location.href = url;
        } else {
          toast.error('Failed to start checkout');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error('An unexpected error occurred');
      }
    });
  };

  return (
    <Button 
      className="w-full rounded-xl font-bold uppercase tracking-wide group" 
      variant="outline"
      onClick={handleCheckout}
      disabled={isPending}
    >
      {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
      ) : (
          'Select Option'
      )}
    </Button>
  );
}
