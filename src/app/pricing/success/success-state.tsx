'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BadgeCheck, CheckCircle2, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { Panel } from './page';

export function SuccessState({ plan, tier }: { plan?: string; tier?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect based on type
      if (tier) {
        router.push('/my-listings');
      } else {
        router.push('/account/verification');
      }
      router.refresh();
    }, 4000);
    return () => clearTimeout(timer);
  }, [router, tier]);

  const navigate = (href: string) => {
    startTransition(() => router.push(href));
  };

  return (
    <Panel>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </motion.div>

      <h2 className="text-2xl font-black text-foreground mb-2">Payment Successful!</h2>
      
      {plan ? (
        <p className="text-green-600 dark:text-green-400 font-bold text-lg mb-2">
          You are now a {plan} member!
        </p>
      ) : (
        <p className="text-green-600 dark:text-green-400 font-bold text-lg mb-2">
          Your listing has been promoted appropriately!
        </p>
      )}

      <div className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
        <BadgeCheck className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary">
          {plan ? 'Verified Seller Badge Activated' : 'Upgrade Applied Successfully'}
        </span>
      </div>

      <p className="text-muted-foreground text-xs mb-6">Redirecting to your account...</p>

      <div className="flex gap-3 w-full">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl font-bold border-border hover:bg-muted"
          disabled={isPending}
          onClick={() => navigate('/my-listings')}
        >
          My Listings
        </Button>
        <Button
          className="flex-1 h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
          disabled={isPending}
          onClick={() => navigate('/account/verification')}
        >
          <Crown className="w-4 h-4 mr-1.5" />
          My Account
        </Button>
      </div>
    </Panel>
  );
}