'use client';

import { createStripeCheckoutSession } from '@/actions/stripe-actions';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, HelpCircle, ShieldCheck, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PricingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    
    // Stripe integration
    
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const plans = [
        {
            name: 'Basic',
            description: 'Essential features for casual sellers',
            price: { monthly: 0, yearly: 0 },
            features: [
                'Up to 3 active listings',
                'Basic visibility',
                'Standard support',
                '48h listing approval'
            ],
            notIncluded: [
                'Verified Seller Badge',
                'Featured listings',
                'Storefront customization',
                'Analytics dashboard'
            ],
            cta: 'Get Started',
            popular: false,
            variant: 'outline'
        },
        // ... (rest of plans)
        {
            name: 'Pro',
            description: 'Perfect for verified sellers and businesses',
            price: { monthly: 19, yearly: 199 },
            features: [
                'Verified Seller Badge (Green Check)',
                'Up to 50 active listings',
                'Priority listing approval (1h)',
                '3 Featured listings / month',
                'Detailed analytics',
                'Valid for 1 full year'
            ],
            notIncluded: [
                'API access',
                'Dedicated account manager'
            ],
            cta: 'Upgrade to Pro',
            popular: true,
            variant: 'default',
            highlight: 'Most Popular'
        },
        {
            name: 'Business',
            description: 'For high-volume dealers and agencies',
            price: { monthly: 49, yearly: 499 },
            features: [
                'Everything in Pro',
                'Unlimited active listings',
                'Unlimited Featured listings',
                'API Access',
                'Dedicated Account Manager',
                'Multi-user access'
            ],
            notIncluded: [],
            cta: 'Contact Sales',
            popular: false,
            variant: 'outline'
        }
    ];

    const handleSubscribe = async (planName: string) => {
        if (!session?.user?.id || !session?.user?.email) {
            toast.error("Please login to subscribe");
            return;
        }

        if (planName === 'Basic') {
             toast.info("You are already on the Basic plan.");
             return;
        }

        setIsProcessing(planName);
        toast.loading("Preparing checkout...");

        try {
            // Find plan price
            const plan = plans.find(p => p.name === planName);
            if (!plan) throw new Error("Plan not found");
            
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;

            const { url } = await createStripeCheckoutSession(
                session.user.id,
                session.user.email,
                planName.toUpperCase(),
                price,
                billingCycle
            );

            if (url) {
                window.location.href = url;
            } else {
                throw new Error("Failed to start checkout");
            }
            
        } catch (error) {
            toast.dismiss();
            toast.error("Checkout failed. Please try again.");
            console.error(error);
            setIsProcessing(null);
        }
    };

    return (
        <div className="min-h-screen pt-16 md:pt-20 pb-8 md:pb-16 bg-muted/20">
            <div className="container-wide mb-8">
                <AppBreadcrumbs />
            </div>
            {/* Header */}
            <div className="container px-4 mx-auto text-center mb-16">
                <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200 px-4 py-1">
                    Simple Pricing
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4 sm:mb-6">
                    Choose the plan that fits your needs
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                    Unlock verified status, more listings, and premium features to grow your business on our platform.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center mt-10 gap-4">
                    <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                    <button 
                        onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                        className="w-14 h-7 bg-slate-200 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                    <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
                        Yearly <span className="text-green-600 text-xs ml-1 font-extrabold">-20%</span>
                    </span>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="container px-4 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? 'border-blue-600 shadow-xl shadow-blue-500/10 md:scale-105 border-2 z-10' : 'border-slate-200 shadow-sm hover:border-blue-300 transition-colors'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Badge className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 text-sm font-bold uppercase tracking-wider shadow-lg">
                                        {plan.highlight}
                                    </Badge>
                                </div>
                            )}
                            
                            <CardHeader className="pb-8 pt-8">
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    {plan.name}
                                    {plan.name === 'Pro' && <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />}
                                </CardTitle>
                                <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
                            </CardHeader>
                            
                            <CardContent className="flex-1">
                                <div className="mb-8">
                                    <span className="text-4xl font-black text-slate-900">
                                        €{billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                                    </span>
                                    <span className="text-slate-500 font-medium">/{billingCycle === 'monthly' ? 'mo' : 'year'}</span>
                                    {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                                        <p className="text-xs text-green-600 font-bold mt-2">Billed €{plan.price.yearly} yearly</p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-green-700 font-bold" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.notIncluded.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 opacity-50">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <X className="w-3 h-3 text-slate-500" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-500">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="pt-8 pb-8">
                                <Button 
                                    className={`w-full h-12 rounded-xl font-bold text-base ${
                                        plan.popular 
                                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20' 
                                        : 'bg-slate-900 hover:bg-slate-800'
                                    }`}
                                    variant={plan.variant as any}
                                    disabled={!!isProcessing}
                                    onClick={() => handleSubscribe(plan.name)}
                                >
                                    {isProcessing === plan.name ? "Processing..." : plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    </div>
                    
                    <div className="grid gap-6">
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <HelpCircle className="w-5 h-5 text-blue-500" />
                                    How does the Verified Badge work?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed">
                                    Once you upgrade to the Pro or Business plan, your account is automatically reviewed. 
                                    Upon successful payment and quick review, you'll receive the Green Verified Checkmark 
                                    on your profile and all your listings, increasing buyer trust.
                                </p>
                            </CardContent>
                        </Card>
                         <Card className="border-none shadow-sm bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                                    Can I cancel anytime?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 leading-relaxed">
                                    Yes, you can cancel your subscription at any time. Your benefits will remain active 
                                    until the end of your billing period.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
