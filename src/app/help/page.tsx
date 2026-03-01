/**
 * Help page — Next.js Server Component.
 * Uses next-intl getTranslations() for server-side i18n.
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
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { HelpSearch } from './help-search';

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

export default async function HelpPage() {
  const t = await getTranslations('Help');

  // Build translated categories here so they re-render per locale
  const helpCategories = [
    {
      title: t('cat_getting_started_title'),
      description: t('cat_getting_started_desc'),
      icon: UserPlus,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      href: '/help/getting-started',
      items: [
        { label: t('cat_getting_started_item1'), href: '/auth' },
        { label: t('cat_getting_started_item2'), href: '/account/verification' },
      ],
    },
    {
      title: t('cat_posting_title'),
      description: t('cat_posting_desc'),
      icon: PencilLine,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      href: '/help/posting-ads',
      items: [
        { label: t('cat_posting_item1'), href: '/sell' },
        { label: t('cat_posting_item2'), href: '/my-listings' },
      ],
    },
    {
      title: t('cat_promotions_title'),
      description: t('cat_promotions_desc'),
      icon: Rocket,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      href: '/premium',
      items: [
        { label: t('cat_promotions_item1'), href: '/premium' },
        { label: t('cat_promotions_item2'), href: '/premium' },
      ],
    },
    {
      title: t('cat_safety_title'),
      description: t('cat_safety_desc'),
      icon: ShieldAlert,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      href: '/help/safety',
      items: [
        { label: t('cat_safety_item1'), href: '/help/safety#scams' },
        { label: t('cat_safety_item2'), href: '/help/safety#report' },
      ],
    },
    {
      title: t('cat_payments_title'),
      description: t('cat_payments_desc'),
      icon: CreditCard,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      href: '/help/payments',
      items: [
        { label: t('cat_payments_item1'), href: '/wallet' },
        { label: t('cat_payments_item2'), href: '/premium' },
      ],
    },
    {
      title: t('cat_rules_title'),
      description: t('cat_rules_desc'),
      icon: BookOpen,
      color: 'text-slate-500',
      bgColor: 'bg-popover0/10',
      href: '/help/terms',
      items: [
        { label: t('cat_rules_item1'), href: '/help/terms#privacy' },
        { label: t('cat_rules_item2'), href: '/help/terms#registration' },
        { label: t('cat_rules_item3'), href: '/help/terms#prohibited' },
      ],
    },
    {
      title: t('cat_cert_title'),
      description: t('cat_cert_desc'),
      icon: BadgeCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
      href: '/help/certification',
      items: [
        { label: t('cat_cert_item1'), href: '/help/certification#steps' },
        { label: t('cat_cert_item2'), href: '/help/certification#benefits' },
      ],
    },
    {
      title: t('cat_qa_title'),
      description: t('cat_qa_desc'),
      icon: CircleHelp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      href: '/help/faq',
      items: [
        { label: t('cat_qa_item1'), href: '/help/faq#contact' },
        { label: t('cat_qa_item2'), href: '/help/faq#editing' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-muted/30 border-b border-border/50 py-16 md:py-24">
        <div className="container-wide relative z-10 text-center">
          <AppBreadcrumbs className="mb-8 justify-center" />

          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
              <CircleHelp className="w-4 h-4" />
              {t('badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-10">
              {t('subtitle')}
            </p>
            <HelpSearch />
          </div>
        </div>

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
                      {t('explore_category')}
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
              <h2 className="text-3xl font-black mb-4">{t('still_need')}</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                {t('support_desc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-2xl font-bold px-8" asChild>
                  <Link href="/contact">
                    <Mail className="w-5 h-5 mr-2" />
                    {t('message_support')}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl font-bold px-8 bg-background"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {t('live_chat')}
                </Button>
              </div>
            </div>

            {/* Right: Social links */}
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

              {/* Support email */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Contact className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-primary/50">
                    {t('support_email')}
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