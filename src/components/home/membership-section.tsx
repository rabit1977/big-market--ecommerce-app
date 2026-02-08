'use client';

import { cn } from "@/lib/utils";
import { Check, ShieldCheck, Star, Trophy, Zap } from "lucide-react";
import { Button } from "../ui/button";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for secondary selling",
    icon: <Zap className="w-6 h-6 text-slate-400" />,
    badgeColor: "bg-slate-100 text-slate-600",
    features: [
      "Up to 3 active listings",
      "Standard visibility",
      "Basic support",
      "Standard profile"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Professional",
    price: "€9.99",
    period: "/mo",
    description: "Best for active sellers",
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    badgeColor: "bg-primary/10 text-primary",
    features: [
      "Verified Blue Badge",
      "Up to 15 active listings",
      "Priority in search results",
      "Social media integration",
      "Email support"
    ],
    cta: "Join Pro",
    popular: false
  },
  {
    name: "Business",
    price: "€29.99",
    period: "/mo",
    description: "Maximize your sales reach",
    icon: <Star className="w-6 h-6 text-amber-500" />,
    badgeColor: "bg-amber-100 text-amber-600",
    features: [
      "Verified Gold Badge",
      "Unlimited active listings",
      "High priority placement",
      "Detailed listing analytics",
      "24/7 Priority support",
      "Featured Badge on items"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Elite",
    price: "€99.99",
    period: "/mo",
    description: "Elite enterprise dominance",
    icon: <Trophy className="w-6 h-6 text-primary" />,
    badgeColor: "bg-primary/10 text-primary",
    features: [
      "Exclusive 'Elite' Member Badge",
      "Top-tier priority placement",
      "Daily Daily Advertising Spots",
      "Auto-Carousel on Home Page",
      "Personal Account Manager",
      "No listing fees ever",
      "Custom Brand page"
    ],
    cta: "Elite Access",
    popular: false
  }
];

export function MembershipSection() {
  return (
    <section className="py-12 md:py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      </div>

      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-5xl font-black tracking-tight mb-3 md:mb-4">
            Choose Your <span className="text-primary text-glow">Membership</span>
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground">
            Empower your store with professional tools and reach thousands of buyers daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative group p-6 md:p-8 rounded-2xl md:rounded-3xl transition-all duration-500",
                "bg-white border border-slate-200 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 text-slate-900 dark:text-slate-900",
                plan.popular && "ring-2 ring-primary shadow-xl shadow-primary/20 md:scale-105 z-20"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full tracking-wider uppercase whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="flex items-start justify-between mb-6 md:mb-8">
                <div className={cn("p-2 md:p-3 rounded-xl md:rounded-2xl", plan.badgeColor)}>
                  {/* Scale icon for mobile */}
                  <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                    {plan.icon}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-3xl font-black text-slate-900">{plan.price}</div>
                  {plan.period && <div className="text-[10px] md:text-sm text-slate-500">{plan.period}</div>}
                </div>
              </div>

              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-[12px] md:text-sm leading-snug">{plan.description}</p>
              </div>

              <div className="space-y-2 md:space-y-4 mb-6 md:mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 md:gap-3 text-[12px] md:text-sm">
                    <div className="mt-0.5 md:mt-1 bg-emerald-100 p-0.5 rounded-full shrink-0">
                      <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-slate-600 font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                className={cn(
                  "w-full rounded-xl md:rounded-2xl h-10 md:h-12 font-bold transition-all duration-300 text-sm md:text-base",
                  plan.popular 
                    ? "bg-primary text-white hover:bg-primary/90 md:hover:scale-[1.02]" 
                    : "bg-slate-900 text-white hover:bg-slate-800 md:hover:scale-[1.02] shadow-lg"
                )}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
