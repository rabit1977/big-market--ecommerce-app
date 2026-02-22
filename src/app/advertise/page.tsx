import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    CheckCircle2,
    LayoutGrid,
    Mail,
    Megaphone,
    Monitor,
    Rocket,
    ShieldCheck,
    Star,
    TrendingUp,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Advertise | Biggest Market',
  description: 'Reach thousands of active buyers daily. Discover powerful advertising solutions on Biggest Market — Macedonia\'s leading classifieds platform.',
};

const AD_PACKAGES = [
  {
    icon: LayoutGrid,
    title: 'Featured Listing',
    price: 'From 98 den.',
    period: 'per listing / 14 days',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    features: [
      'Priority placement in search results',
      'Bold listing card styling',
      'Category page highlight',
      'Duration: 14 days',
    ],
    cta: '/pricing',
  },
  {
    icon: Star,
    title: 'Homepage Spotlight',
    price: 'From 170 den.',
    period: 'per listing / 7 days',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    badge: 'Most Popular',
    features: [
      'Featured on the homepage hero',
      'Visual gold star badge',
      'Maximum buyer exposure',
      'Duration: 7 days',
    ],
    cta: '/pricing',
  },
  {
    icon: Megaphone,
    title: 'Custom Campaign',
    price: 'Contact us',
    period: 'tailored package',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    features: [
      'Banner ad placement',
      'Newsletter promotion',
      'Category sponsorship',
      'Custom duration & reach',
    ],
    cta: '/contact',
  },
];

const WHY_US = [
  { icon: TrendingUp, text: 'Thousands of active listings across 20+ categories' },
  { icon: ShieldCheck, text: 'Verified users for a trustworthy audience' },
  { icon: BarChart3, text: 'Real-time analytics on listing performance' },
  { icon: Monitor, text: 'Fully responsive across desktop and mobile' },
];

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-background pb-24">

      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/30 border-b border-border/50 py-16 md:py-24">
        <div className="container-wide relative z-10">
          <AppBreadcrumbs className="mb-8" />
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
              <Megaphone className="w-3.5 h-3.5" />
              Advertising Solutions
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
              Reach Thousands of
              <span className="text-primary block">Active Buyers Daily.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Biggest Market gives individuals and businesses the most powerful platform in Macedonia to showcase their listings. From featured placement to homepage spotlights — promote your listings with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="rounded-2xl font-bold btn-premium btn-glow">
                <Link href="/pricing">View All Plans</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-2xl font-bold">
                <Link href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Custom Package
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div aria-hidden className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Why advertise */}
      <section className="container-wide py-16">
        <h2 className="text-2xl font-black mb-8">Why advertise on Biggest Market?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WHY_US.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="container-wide pb-16">
        <h2 className="text-2xl font-black mb-2">Promotion Packages</h2>
        <p className="text-muted-foreground mb-8 text-sm">Choose the plan that fits your goal — or contact us for a fully custom arrangement.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AD_PACKAGES.map((pkg) => (
            <div
              key={pkg.title}
              className={`relative flex flex-col rounded-2xl border ${pkg.border} bg-card p-6 hover:shadow-xl transition-all gap-4`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                  {pkg.badge}
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl ${pkg.bg} flex items-center justify-center`}>
                <pkg.icon className={`w-6 h-6 ${pkg.color}`} />
              </div>
              <div>
                <h3 className="font-black text-lg">{pkg.title}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-primary">{pkg.price}</span>
                  <span className="text-xs text-muted-foreground font-medium">{pkg.period}</span>
                </div>
              </div>
              <ul className="space-y-2 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full rounded-xl font-bold mt-2" variant={pkg.badge ? 'default' : 'outline'}>
                <Link href={pkg.cta}>
                  <Rocket className="w-4 h-4 mr-2" />
                  {pkg.cta === '/contact' ? 'Get a Quote' : 'See Pricing'}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-wide pb-8">
        <div className="rounded-[2.5rem] bg-muted/40 border border-border/50 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">Ready to grow your reach?</h2>
            <p className="text-muted-foreground max-w-lg">
              Our team at <strong>Biggest Market</strong> is ready to help you find the right advertising solution. Reach out at{' '}
              <a href="mailto:support@bigmarket.mk" className="text-primary font-bold hover:underline">support@bigmarket.mk</a>.
            </p>
          </div>
          <Button size="lg" asChild className="rounded-2xl font-bold btn-premium btn-glow shrink-0">
            <Link href="/sell">Start Posting Free</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
