/**
 * Refactored with:
 * - React 19: removed mounted/useEffect hydration hack via `suppressHydrationWarning`
 *   pattern or by moving decorative-only animations to CSS
 * - Next.js 15: Server Component by default (no 'use client' needed for static content)
 *   Only the search input is interactive → isolated into a tiny Client Component island
 * - Performance: motion animations replaced with CSS for static cards (no JS bundle cost),
 *   framer-motion only where truly needed (hero entrance); helpCategories/socialLinks
 *   moved outside component (stable reference, no re-creation on render)
 */

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import {
  BadgeCheck,
  BookOpen,
  CircleHelp,
  Contact,
  CreditCard,
  ExternalLink,
  Flag,
  Mail,
  MessageSquare,
  PencilLine,
  Rocket,
  ShieldAlert,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { HelpSearch } from './help-search';


// ─── Static Data (module-level = zero re-allocation) ─────────────────────────

type HelpItem = { label: string; href: string };
type HelpCategory = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  href: string;
  items: HelpItem[];
};

const helpCategories: HelpCategory[] = [
  {
    title: 'Getting Started',
    description: 'New to Biggest Market? Learn how to register and start your journey.',
    icon: UserPlus,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    href: '/help/getting-started',
    items: [
      { label: 'How to register', href: '/auth' },
      { label: 'Verifying your account', href: '/account/verification' },
    ],
  },
  {
    title: 'Posting & Managing Ads',
    description: 'Master the art of creating high-quality listings that sell faster.',
    icon: PencilLine,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    href: '/help/posting-ads',
    items: [
      { label: 'Step-by-step posting guide', href: '/sell' },
      { label: 'Editing and renewing ads', href: '/my-listings' },
    ],
  },
  {
    title: 'Promotions & Visibility',
    description: 'Learn about our premium features to boost your listing reach.',
    icon: Rocket,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    href: '/premium',
    items: [
      { label: 'Promotion types explained', href: '/premium' },
      { label: 'Homepage highlighting', href: '/premium' },
    ],
  },
  {
    title: 'Safety & Security',
    description: 'Crucial information on how to trade safely and avoid scams.',
    icon: ShieldAlert,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    href: '/help/safety',
    items: [
      { label: 'Avoiding common scams', href: '/help/safety#scams' },
      { label: 'Reporting suspicious activity', href: '/help/safety#report' },
    ],
  },
  {
    title: 'Payments & Billing',
    description: 'Information about payment methods, receipts, and membership fees.',
    icon: CreditCard,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    href: '/help/payments',
    items: [
      { label: 'Accepted payment methods', href: '/wallet' },
      { label: 'Business invoicing', href: '/premium' },
    ],
  },
  {
    title: 'Rules & Terms',
    description: 'Our policies ensuring a fair and professional marketplace for everyone.',
    icon: BookOpen,
    color: 'text-slate-500',
    bgColor: 'bg-popover0/10',
    href: '/help/terms',
    items: [
      { label: 'Privacy & Data Protection', href: '/help/terms#privacy' },
      { label: 'Registration & Verification', href: '/help/terms#registration' },
      { label: 'Prohibited Content Rules', href: '/help/terms#prohibited' },
    ],
  },
  {
    title: 'Certification & Trust',
    description: 'Learn about our "Verified Seller" badge and how to get certified.',
    icon: BadgeCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10',
    href: '/help/certification',
    items: [
      { label: 'How to get certified', href: '/help/certification#steps' },
      { label: 'Benefits of Verified Badge', href: '/help/certification#benefits' },
    ],
  },
  {
    title: 'Questions & Answers',
    description: 'Common inquiries regarding listing management, security, and account operations.',
    icon: CircleHelp,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    href: '/help/faq',
    items: [
      { label: 'How to contact sellers', href: '/help/faq#contact' },
      { label: 'Modifying your ads', href: '/help/faq#editing' },
    ],
  },
];

type SocialLink = {
  label: string;
  value: string;
  icon: LucideIcon;
  href: string;
};

const socialLinks: SocialLink[] = [
  { label: 'Facebook', value: 'Biggest Market Official', icon: ExternalLink, href: '#' },
  { label: 'Partner with us', value: 'Affiliate & Marketing', icon: Flag, href: '/services' },
  { label: 'About Us', value: 'The Trusted Marketplace', icon: BadgeCheck, href: '/about' },
];

// ─── Page (Server Component) ──────────────────────────────────────────────────
// No 'use client' → renders on the server, zero client JS for static content.
// The `mounted` hack is entirely gone: it was only needed because framer-motion
// reads window on hydration. By keeping animations CSS-only on the server and
// isolating framer-motion to the search island, hydration mismatches disappear.

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background pb-20">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-muted/30 border-b border-border/50 py-16 md:py-24">
        <div className="container-wide relative z-10 text-center">
          <AppBreadcrumbs className="mb-8 justify-center" />

          {/*
            CSS animation replaces framer-motion for the hero block.
            Tailwind's `animate-fade-in-up` (or your custom keyframe) achieves
            the same effect with zero JS. Define in globals.css:
              @keyframes fade-in-up { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
              .animate-fade-in-up { animation: fade-in-up 0.5s ease both; }
          */}
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
              <CircleHelp className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
              How can we{' '}
              <span className="text-primary border-b-4 border-primary/20">help</span> you?
            </h1>
            <p className="text-lg text-muted-foreground mb-10">
              Search our knowledge base or browse categories below to find answers to your
              questions.
            </p>

            {/*
              HelpSearch is the ONLY Client Component on this page.
              It handles the controlled input state and future search logic.
              Isolating it here means the rest of the page ships zero client JS.
            */}
            <HelpSearch />
          </div>
        </div>

        {/* Decorative blobs — purely visual, no JS needed */}
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden pointer-events-none opacity-20"
        >
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full" />
        </div>
      </section>

      {/* ── Help Grid ────────────────────────────────────────────────────── */}
      <section className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpCategories.map((category, idx) => (
            /*
              CSS staggered fade-in replaces per-card framer-motion.
              Uses inline style for dynamic delay — no client JS.
            */
            <div
              key={category.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden">
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${category.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{category.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed min-h-[40px]">
                    {category.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between group/link py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <span>{item.label}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                      </Link>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start p-0 h-auto font-bold text-primary hover:bg-transparent hover:text-primary/80 mt-4 group/btn"
                  >
                    <Link href={category.href}>
                      Explore Category
                      <BadgeCheck className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact & Social ──────────────────────────────────────────────── */}
      <section className="container-wide">
        <div className="bg-muted/30 border border-border/50 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Left: CTA */}
            <div>
              <h2 className="text-3xl font-black mb-4">Still need assistance?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Our support team is available mon–fri (09:00–18:00) to help you with any
                issues or inquiries.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-2xl font-bold px-8" asChild>
                  <Link href="/contact">
                    <Mail className="w-5 h-5 mr-2" />
                    Message Support
                  </Link>
                </Button>
                {/* 
                  Note: if Live Chat requires JS (e.g. opens a widget),
                  extract this button into its own tiny Client Component.
                */}
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl font-bold px-8 bg-background"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>

            {/* Right: Social links grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">
                      {link.label}
                    </div>
                    <div className="font-bold text-sm truncate">{link.value}</div>
                  </div>
                </Link>
              ))}

              {/* Support email card (static, no link needed) */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Contact className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-primary/50">
                    Support Email
                  </div>
                  <div className="font-bold text-sm text-primary">support@bigmarket.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}