'use client';

import { createStripeCheckoutSession } from '@/actions/stripe-actions';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    BadgeCheck,
    BarChart3,
    Check,
    ChevronRight,
    Crown,
    Headphones,
    Infinity as InfinityIcon,
    Rocket,
    Shield,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Start selling for free',
    price: { monthly: 0, yearly: 0 },
    icon: Zap,
    gradient: 'from-slate-500 to-slate-600',
    bgGlow: 'bg-slate-500/5',
    borderColor: 'border-border',
    iconBg: 'bg-slate-500/10',
    iconColor: 'text-slate-600 dark:text-slate-400',
    features: [
      { text: 'Up to 3 active listings', included: true },
      { text: 'Basic visibility', included: true },
      { text: 'Standard support', included: true },
      { text: '48h listing approval', included: true },
      { text: 'Verified Seller Badge', included: false },
      { text: 'Featured listings', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Priority support', included: false },
    ] as PlanFeature[],
    cta: 'Current Plan',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Everything you need to grow',
    price: { monthly: 19, yearly: 199 },
    icon: Crown,
    gradient: 'from-primary to-primary/80',
    bgGlow: 'bg-primary/5',
    borderColor: 'border-primary/30',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    features: [
      { text: 'Up to 50 active listings', included: true },
      { text: 'Verified Seller Badge', included: true, highlight: true },
      { text: 'Priority approval (1h)', included: true },
      { text: '3 Featured listings / month', included: true },
      { text: 'Detailed analytics', included: true },
      { text: 'Priority support', included: true },
      { text: 'API access', included: false },
      { text: 'Dedicated account manager', included: false },
    ] as PlanFeature[],
    cta: 'Upgrade to Pro',
    popular: true,
    badge: 'Most Popular',
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For agencies & dealers',
    price: { monthly: 49, yearly: 499 },
    icon: Rocket,
    gradient: 'from-amber-500 to-orange-500',
    bgGlow: 'bg-amber-500/5',
    borderColor: 'border-amber-500/20',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600 dark:text-amber-400',
    features: [
      { text: 'Unlimited active listings', included: true, highlight: true },
      { text: 'Verified Seller Badge', included: true },
      { text: 'Instant listing approval', included: true },
      { text: 'Unlimited Featured listings', included: true },
      { text: 'Full analytics dashboard', included: true },
      { text: 'API Access', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Multi-user access', included: true },
    ] as PlanFeature[],
    cta: 'Go Business',
    popular: false,
    badge: 'Best Value',
  },
];

const benefits = [
  {
    icon: BadgeCheck,
    title: 'Verified Seller Badge',
    description: 'Build trust with buyers through verified status',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: TrendingUp,
    title: 'Higher Visibility',
    description: 'Your listings rank higher in search results',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track views, clicks, and engagement metrics',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Headphones,
    title: 'Priority Support',
    description: 'Get help faster with dedicated support',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

export default function PremiumPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!session?.user?.id || !session?.user?.email) {
      toast.error('Please sign in to subscribe');
      router.push('/auth');
      return;
    }

    if (planId === 'basic') {
      toast.info('You are already on the Basic plan.');
      return;
    }

    setIsProcessing(planId);
    const toastId = toast.loading('Preparing secure checkout...');

    try {
      const plan = plans.find((p) => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;

      const { url } = await createStripeCheckoutSession(
        session.user.id,
        session.user.email,
        plan.name.toUpperCase(),
        price,
        billingCycle
      );

      toast.dismiss(toastId);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to start checkout');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Checkout failed. Please try again.');
      console.error(error);
      setIsProcessing(null);
    }
  };

  const savings = (plan: (typeof plans)[number]) => {
    if (plan.price.monthly === 0) return 0;
    return Math.round(((plan.price.monthly * 12 - plan.price.yearly) / (plan.price.monthly * 12)) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section — Mobile-first gradient */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)] pointer-events-none" />

        <div className="container-wide relative pt-4 sm:pt-6 pb-8 sm:pb-12">
          <AppBreadcrumbs className="mb-3 sm:mb-4" />

          <div className="text-center max-w-3xl mx-auto">
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-primary/10 border border-amber-500/20 mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Premium Plans
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.15] mb-4"
            >
              Sell faster. <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Get verified.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8"
            >
              Unlock verified seller status, boost your listings, and grow your business
              with premium features trusted by thousands of sellers.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 p-1.5 rounded-full bg-muted/50 border border-border/50"
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300',
                  billingCycle === 'monthly'
                    ? 'bg-background text-foreground shadow-sm border border-border/50'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={cn(
                  'relative px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300',
                  billingCycle === 'yearly'
                    ? 'bg-background text-foreground shadow-sm border border-border/50'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Yearly
                <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded-full bg-green-500 text-[9px] font-bold text-white shadow-sm">
                  -20%
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plans Grid — Mobile: vertical stack, Desktop: 3 columns */}
      <section className="container-wide pb-12 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * index + 0.3 }}
              className={cn(
                'relative rounded-2xl sm:rounded-3xl border-2 overflow-hidden transition-all duration-300',
                plan.popular
                  ? 'border-primary shadow-xl shadow-primary/10 md:scale-[1.03]'
                  : `${plan.borderColor} hover:border-primary/20 shadow-sm hover:shadow-md`
              )}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0 z-10">
                  <div
                    className={cn(
                      'px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white rounded-bl-xl',
                      plan.popular
                        ? 'bg-primary'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    )}
                  >
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Card Content */}
              <div className={cn('p-5 sm:p-6 md:p-7', plan.bgGlow)}>
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('p-2.5 rounded-xl', plan.iconBg)}>
                    <plan.icon className={cn('w-5 h-5', plan.iconColor)} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground">{plan.name}</h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">{plan.tagline}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-foreground">
                      €{billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      /{billingCycle === 'monthly' ? 'mo' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-1">
                      Save {savings(plan)}% • €{((plan.price.monthly * 12 - plan.price.yearly) / 12).toFixed(0)}/mo saved
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <div className="w-4.5 h-4.5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-2.5 h-2.5 text-muted-foreground/50" />
                        </div>
                      )}
                      <span
                        className={cn(
                          'text-xs sm:text-[13px] font-medium',
                          feature.included
                            ? 'text-foreground'
                            : 'text-muted-foreground/50 line-through'
                        )}
                      >
                        {feature.text}
                        {feature.highlight && (
                          <Star className="inline w-3 h-3 text-amber-500 fill-amber-500 ml-1 -mt-0.5" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={!!isProcessing || plan.id === 'basic'}
                  className={cn(
                    'w-full h-11 sm:h-12 rounded-xl font-bold text-sm transition-all duration-300',
                    plan.popular
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
                      : plan.id === 'business'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20'
                        : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                  )}
                >
                  {isProcessing === plan.id ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {plan.cta}
                      {plan.id !== 'basic' && <ChevronRight className="w-4 h-4" />}
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t border-border/50 bg-muted/20">
        <div className="container-wide py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight mb-2">
              Why go Premium?
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to succeed on Big Market
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.5 }}
                className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 text-center hover:shadow-md"
              >
                <div className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110', b.bg)}>
                  <b.icon className={cn('w-5 h-5 sm:w-6 sm:h-6', b.color)} />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1">{b.title}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-border/50">
        <div className="container-wide py-12 sm:py-16">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-xs font-bold text-foreground">Secure Payments</span>
                <span className="text-[10px] text-muted-foreground">256-bit SSL encryption</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-foreground">10,000+ Sellers</span>
                <span className="text-[10px] text-muted-foreground">Trust Big Market Premium</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <InfinityIcon className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-xs font-bold text-foreground">Cancel Anytime</span>
                <span className="text-[10px] text-muted-foreground">No hidden fees or lock-in</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-3 bg-background/90 backdrop-blur-md border-t border-border/50 md:hidden">
        <Button
          onClick={() => handleSubscribe('pro')}
          disabled={!!isProcessing}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-xl shadow-primary/20"
        >
          <Crown className="w-4 h-4 mr-2" />
          {isProcessing === 'pro' ? 'Processing...' : 'Upgrade to Pro — €199/year'}
        </Button>
      </div>

      {/* Bottom spacer for mobile sticky CTA */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
