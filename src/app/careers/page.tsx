import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    Briefcase,
    Code2,
    Heart,
    Megaphone,
    Settings,
    ShieldCheck,
    Users,
    Zap,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers | Biggest Market',
  description: 'Join the team building Macedonia\'s leading classifieds marketplace. View open positions at Biggest Market.',
};

const DEPARTMENTS = [
  {
    icon: Code2,
    title: 'Engineering',
    description: 'Build the infrastructure, APIs, and interfaces that power thousands of daily transactions.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Megaphone,
    title: 'Marketing & Growth',
    description: 'Drive user acquisition, brand awareness, and community building across Macedonia.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: Settings,
    title: 'Operations',
    description: 'Ensure the marketplace runs smoothly — from seller support to content moderation.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Safety',
    description: 'Protect buyers and sellers through verification, fraud detection, and user policy.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

const VALUES = [
  { icon: Zap, label: 'Move Fast', desc: 'We ship, iterate, and improve constantly.' },
  { icon: Heart, label: 'User First', desc: 'Every decision starts with the community.' },
  { icon: Users, label: 'Collaborate', desc: 'Small team, big impact — together.' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background pb-24">

      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/30 border-b border-border/50 py-16 md:py-24">
        <div className="container-wide relative z-10">
          <AppBreadcrumbs className="mb-8" />
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
              <Briefcase className="w-3.5 h-3.5" />
              We're Hiring
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
              Join the team building
              <span className="text-primary block">Macedonia's Marketplace.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              At Biggest Market, we're on a mission to connect every buyer and seller in Macedonia on a modern, safe, and professional platform. We're a small, driven team that moves fast and ships real things.
            </p>
          </div>
        </div>
        {/* Blob */}
        <div aria-hidden className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Values */}
      <section className="container-wide py-16 md:py-20">
        <h2 className="text-2xl font-black mb-8 tracking-tight">Life at Biggest Market</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {VALUES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all group">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-black text-base mb-1">{label}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="container-wide pb-16 md:pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-black tracking-tight">Open Departments</h2>
          <p className="text-muted-foreground mt-2">We are not currently advertising specific roles. Check back soon, or send us your CV — we review every application.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {DEPARTMENTS.map(({ icon: Icon, title, description, color, bg }) => (
            <div key={title} className="flex gap-5 p-6 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-md transition-all group">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <h3 className="font-black text-base mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide pb-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 md:p-16 text-white">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Don't see a role that fits?</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We're always open to meeting talented people. Send your CV and a short introduction to{' '}
              <span className="text-primary font-bold">careers@bigmarket.mk</span> and we'll reach out if there's a match.
            </p>
            <Button size="lg" asChild className="rounded-2xl font-bold btn-premium">
              <Link href="/contact">
                Send us a message
              </Link>
            </Button>
          </div>
          <div aria-hidden className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        </div>
      </section>

    </div>
  );
}
