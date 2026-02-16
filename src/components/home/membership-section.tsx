'use client';

import { cn } from "@/lib/utils";
import { BadgeCheck, Check, Crown, Eye, Megaphone, Rocket, Sparkles, Star, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "For individuals",
    icon: Zap,
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted",
    borderColor: "border-border",
    features: [
      "Up to 3 active listings",
      "Standard search placement",
      "Basic support",
    ],
    cta: "Current Plan",
    popular: false,
    disabled: true,
  },
  {
    name: "Pro",
    price: "250",
    period: " MKD/year",
    description: "For regular sellers",
    icon: BadgeCheck,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    borderColor: "border-primary/30",
    features: [
      "Seller verification badge",
      "Up to 100 active listings",
      "Boosted search ranking",
      "Custom store URL",
      "In-depth analytics",
    ],
    cta: "Get Pro",
    popular: true,
    disabled: false,
  },
  {
    name: "Business",
    price: "450",
    period: " MKD/year",
    description: "For shops & agencies",
    icon: Crown,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    features: [
      "Manage up to 500 listings",
      "Top placement in search",
      "Logo + brand info on ads",
      "Dedicated account manager",
      "Advanced analytics",
      "Multi-user team access",
    ],
    cta: "Go Business",
    popular: false,
    disabled: false,
  },
];

const addOns = [
  {
    icon: TrendingUp,
    name: "Featured Listing",
    description: "Pin your ad to the top of search results for 7 days",
    price: "49 MKD",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Star,
    name: "Highlight Ad",
    description: "Make your listing stand out with a highlighted border",
    price: "29 MKD",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Eye,
    name: "Gallery Boost",
    description: "Add up to 20 photos instead of the standard 5",
    price: "19 MKD",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Megaphone,
    name: "Homepage Spotlight",
    description: "Feature your listing on the homepage carousel for 3 days",
    price: "99 MKD",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export function MembershipSection() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-muted/30">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-wide px-3 md:px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Premium Membership
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-3">
            Reach more buyers.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Grow your sales.
            </span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Over 2 million people browse Biggest Market every month. A premium membership
            puts your products in front of all of them.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative group rounded-2xl md:rounded-3xl border-2 p-5 md:p-7 transition-all duration-300",
                "bg-card hover:shadow-lg",
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 md:scale-[1.03]"
                  : `${plan.borderColor} hover:border-primary/30 shadow-sm`
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-white text-[10px] font-bold px-3.5 py-1 rounded-full tracking-wider uppercase whitespace-nowrap flex items-center gap-1.5">
                    <Rocket className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("p-2.5 rounded-xl", plan.iconBg)}>
                  <plan.icon className={cn("w-5 h-5", plan.iconColor)} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    {plan.name}
                  </h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-2xl md:text-3xl font-black text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-xs md:text-sm"
                  >
                    <div className="p-0.5 rounded-full bg-emerald-500/10 shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-muted-foreground font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                asChild={!plan.disabled}
                size="sm"
                className={cn(
                  "w-full rounded-xl h-10 md:h-11 font-bold text-sm transition-all",
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                    : plan.disabled
                      ? "bg-muted text-muted-foreground cursor-default"
                      : "bg-foreground text-background hover:bg-foreground/90"
                )}
                disabled={plan.disabled}
              >
                {plan.disabled ? (
                  plan.cta
                ) : (
                  <Link href="/premium">{plan.cta}</Link>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Add-on Subscriptions */}
        <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-lg md:text-2xl font-black text-foreground tracking-tight mb-1.5">
              Boost individual listings
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              One-time add-ons to give any listing extra visibility — no membership required
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="group bg-card border border-border/50 hover:border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", addon.bg)}>
                    <addon.icon className={cn("w-4 h-4", addon.color)} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-foreground">{addon.name}</h4>
                    <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed mt-0.5">{addon.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-sm md:text-base font-black text-foreground">{addon.price}</span>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-7 md:h-8 rounded-lg text-[10px] md:text-xs font-bold border-border hover:border-primary/50 hover:bg-primary/5 px-3"
                  >
                    <Link href="/premium">Learn more</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Plans CTA */}
        <div className="text-center mt-8 md:mt-10">
          <Button
            asChild
            variant="outline"
            className="rounded-full font-bold text-xs md:text-sm px-6 h-9 md:h-10 border-border hover:border-primary/50 hover:bg-primary/5"
          >
            <Link href="/premium">
              Compare all plans & add-ons
              <Sparkles className="w-3.5 h-3.5 ml-2 text-primary" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
