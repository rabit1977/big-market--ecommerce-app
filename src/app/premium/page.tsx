'use client';

import { createStripeCheckoutSession } from '@/actions/stripe-actions';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowUpCircle,
    BadgeCheck,
    Briefcase,
    Check,
    Clock,
    CreditCard,
    Crown,
    HelpCircle,
    Megaphone,
    User
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const promoOptions = [
  {
    title: 'Premium Sector',
    duration: '14 days',
    price: 100,
    description: 'Maximum visibility and improved reach. Your ad will be especially recognizable, getting more visitors and responses. Exclusive ads are shown on the right side of search results.',
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    title: 'Top Positioning',
    duration: '14 days',
    price: 160,
    description: 'Always at the top before others. Your ad will be displayed at the top of search results related to criteria for 14 days, rotating with other top-positioned ads.',
    icon: ArrowUpCircle,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    title: 'Listing Highlight',
    duration: '14 days',
    price: 60,
    description: 'Your ad will be marked with a different background color in search results, separating it from other classifieds and catching the eye directly.',
    icon: Megaphone,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    title: 'Auto Daily Refresh',
    duration: '14 days',
    price: 60,
    description: 'For 14 days, your ad is automatically refreshed daily as if it were just published, starting at 13:00.',
    icon: Clock,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
];

const faqs = [
  {
    q: 'How can I activate my ad promotion?',
    a: 'It\'s simple. If you have already submitted your ad, open it and click the "Promote" link next to the star icon and follow the instructions. Registered users can activate promotions directly from their profile.',
  },
  {
    q: 'How long do ads remain promoted?',
    a: 'Your ad will remain promoted for 14 days. After this period, the ad continues to be published but as a free standard ad.',
  },
  {
    q: 'Why doesn\'t my premium ad appear?',
    a: 'All promoted ads are placed on the search page and display in rotation based on search criteria: region, category, and keywords contained in your title.',
  },
  {
    q: 'How can I pay?',
    a: 'Paying with a debit/credit card is the most convenient way with no risk. You can also pay via bank transfer/invoice.',
  },
];

export default function PremiumPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, price: number) => {
    if (!session?.user?.id || !session?.user?.email) {
      toast.error('Please sign in to subscribe');
      router.push('/auth');
      return;
    }

    setIsProcessing(planId);
    const toastId = toast.loading('Setting up secure checkout...');

    try {
      const { url } = await createStripeCheckoutSession(
        session.user.id,
        session.user.email,
        planId.toUpperCase(),
        price,
        'yearly'
      );

      toast.dismiss(toastId);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to start checkout');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Something went wrong. Please try again.');
      console.error(error);
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/30 border-b border-border/50">
        <div className="container-wide py-12 md:py-16 text-center">
          <AppBreadcrumbs className="mb-8 justify-center" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4"
          >
            Premium Services
          </motion.h1>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Verification for individuals and professional tools for businesses.
          </motion.p>
        </div>
      </section>

      {/* Main Options */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Individual Verification */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="h-full border-primary/20 shadow-lg shadow-primary/5 hover:border-primary/40 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <User className="w-12 h-12 text-primary/10" />
                    </div>
                    <CardHeader>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold w-fit mb-2">
                            For Individuals
                        </div>
                        <CardTitle className="text-2xl">Verified User</CardTitle>
                        <CardDescription>Essential for posting listings safely</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-baseline gap-1 mb-4">
                             <span className="text-4xl font-black text-foreground">98</span>
                             <span className="text-sm text-muted-foreground">MKD/year</span>
                             <span className="text-xs text-muted-foreground ml-1">+ VAT</span>
                        </div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-2 items-start">
                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                <span><strong className="text-foreground">Required</strong> to post listings</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                <span>Get the <BadgeCheck className="w-3 h-3 inline text-primary" /> Verified Badge</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                <span>Listing Limit: 50 listings/year</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                <span>Access to Promotion Options</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full font-bold" 
                            size="lg"
                            onClick={() => handleSubscribe('verified', 98)}
                            disabled={!!isProcessing}
                        >
                            {isProcessing === 'verified' ? 'Processing...' : 'Get Verified'}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            {/* Business Subscription */}
             <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                 <Card className="h-full border-amber-500/20 shadow-lg shadow-amber-500/5 hover:border-amber-500/40 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Briefcase className="w-12 h-12 text-amber-500/10" />
                    </div>
                    <CardHeader>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold w-fit mb-2">
                            For Businesses
                        </div>
                        <CardTitle className="text-2xl">Business Premium</CardTitle>
                        <CardDescription>Professional tools for shops & agencies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-baseline gap-1 mb-4">
                             <span className="text-4xl font-black text-foreground">450</span>
                             <span className="text-sm text-muted-foreground">MKD/year</span>
                             <span className="text-xs text-muted-foreground ml-1">+ VAT</span>
                        </div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-2 items-start">
                                <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                                <span><strong className="text-foreground">Unlimited</strong> listings management</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                                <span>Custom Shop URL & Branding</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                                <span>Advanced Analytics & Dashboard</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                                <span>Multi-user team access</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button 
                            className="w-full font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0" 
                            size="lg"
                            onClick={() => handleSubscribe('business', 450)}
                            disabled={!!isProcessing}
                        >
                             {isProcessing === 'business' ? 'Processing...' : 'Go Business'}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
      </section>

      {/* Promotion Options */}
      <section className="bg-muted/30 py-16 border-y border-border/50">
        <div className="container-wide">
             <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4">
                    Boost Your Sales
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-4">Listing Promotion Options</h2>
                <p className="text-muted-foreground">
                    Available to Verified Users. Choose these powerful add-ons to reach more buyers and sell faster.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {promoOptions.map((opt, i) => (
                    <motion.div
                        key={opt.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={cn("bg-card border rounded-2xl p-6 hover:shadow-lg transition-all", opt.border)}
                    >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", opt.bg)}>
                            <opt.icon className={cn("w-6 h-6", opt.color)} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{opt.title}</h3>
                        <p className="text-xs font-semibold text-muted-foreground mb-4">{opt.duration}</p>
                        <p className="text-sm text-muted-foreground mb-6 min-h-[80px] leading-relaxed">
                            {opt.description}
                        </p>
                        <div className="mt-auto pt-4 border-t border-border/50 flex items-baseline justify-between">
                             <span className="font-black text-xl">{opt.price} <span className="text-xs font-medium text-muted-foreground">MKD</span></span>
                             <span className="text-[10px] uppercase font-bold text-muted-foreground">+ VAT</span>
                        </div>
                    </motion.div>
                ))}
             </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-wide py-16">
          <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    Frequently Asked Questions
                </h2>
                <div className="grid gap-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-card border border-border/50 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">{faq.a}</p>
                        </div>
                    ))}
                </div>
          </div>
      </section>

      {/* Payment Methods */}
      <section className="border-t border-border/50 bg-muted/10 py-12">
        <div className="container-wide text-center">
            <h3 className="font-bold mb-6">Secure Payment Methods</h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-bold text-sm">Credit/Debit Card</span>
                </div>
                 <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg">
                    <Activity className="w-5 h-5" />
                    <span className="font-bold text-sm">Bank Transfer</span>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
