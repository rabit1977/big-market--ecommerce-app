'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowRight,
    Building2,
    Flame,
    Image as ImageIcon,
    MapPin,
    Package,
    Search,
    ShieldCheck,
    Star,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { api } from '../../../convex/_generated/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type FeaturedListing = {
  _id: string;
  title: string;
  price: number;
  currency: string;
  image: string | null;
  condition: string | null;
};

type Seller = {
  _id: string;
  externalId: string;
  name?: string;
  image?: string;
  bio?: string;
  city?: string;
  accountType: string;
  companyName?: string;
  isVerified: boolean;
  membershipTier: string;
  createdAt: number;
  activeListingsCount: number;
  recentListingsCount: number;
  postedThisWeek: boolean;
  lastPostedAt: number | null;
  reviewCount: number;
  averageRating: number;
  hasPremiumStorefront: boolean;
  featuredListings: FeaturedListing[];
};

type FilterTab = 'all' | 'business' | 'active';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDisplayName(seller: Seller): string {
  return seller.accountType === 'COMPANY' && seller.companyName
    ? seller.companyName
    : seller.name ?? 'Seller';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Root Grid Component ──────────────────────────────────────────────────────

export function SellersGrid() {
  const t = useTranslations('Sellers');
  const sellers = useQuery(api.storefront.getAllSellers);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Trending = at least 1 listing in the last 30 days, sorted by recentListingsCount desc
  const trendingSellers = useMemo(() => {
    if (!sellers) return [];
    return sellers
      .filter((s) => s.recentListingsCount > 0)
      .sort((a, b) => b.recentListingsCount - a.recentListingsCount)
      .slice(0, 5);
  }, [sellers]);

  const filtered = useMemo(() => {
    if (!sellers) return [];
    const q = search.toLowerCase();
    return sellers.filter((s) => {
      const name = getDisplayName(s);
      const matchesSearch =
        name.toLowerCase().includes(q) ||
        (s.city ?? '').toLowerCase().includes(q) ||
        (s.bio ?? '').toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (activeTab === 'business') return s.accountType === 'COMPANY' || s.hasPremiumStorefront;
      if (activeTab === 'active')   return s.recentListingsCount > 0;
      return true;
    });
  }, [sellers, search, activeTab]);

  if (sellers === undefined) {
    return (
      <div className="space-y-6">
        {/* Trending skeleton */}
        <div className="space-y-3">
          <div className="h-5 bg-muted/50 rounded-lg w-48 animate-pulse" />
          <div className="flex gap-3 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 w-52 shrink-0 bg-muted/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-muted/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const tabs: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
    { id: 'all',      label: t('tab_all'),      icon: <Users className="w-3 h-3" /> },
    { id: 'active',   label: t('tab_active'),   icon: <Flame className="w-3 h-3" /> },
    { id: 'business', label: t('tab_business'), icon: <Building2 className="w-3 h-3" /> },
  ];

  return (
    <div className="space-y-6 md:space-y-8">

      {/* ── Trending Stores Spotlight ── */}
      {trendingSellers.length > 0 && (
        <TrendingStrip sellers={trendingSellers} t={t} />
      )}

      {/* ── Search + Filter Tabs ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-xs rounded-xl bm-interactive"
            />
          </div>
          <p className="text-[11px] text-muted-foreground font-medium shrink-0">
            {t('sellers_count', { count: filtered.length })}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted bm-interactive'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 px-4 bg-card border border-dashed border-border rounded-2xl">
          <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground mb-1">{t('no_sellers')}</h3>
          <p className="text-xs text-muted-foreground">{t('no_sellers_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((seller) => (
            <SellerCard key={seller._id} seller={seller} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Trending Scroll Strip ───────────────────────────────────────────────────

function TrendingStrip({
  sellers,
  t,
}: {
  sellers: Seller[];
  t: ReturnType<typeof useTranslations<'Sellers'>>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 220 : -220, behavior: 'smooth' });
  };

  return (
    <section className="space-y-3">
      {/* Header row with arrows */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded-lg shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-[11px] font-black uppercase tracking-widest">
            {t('trending_this_month')}
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-orange-500/20 to-transparent" />
        {/* Scroll arrows */}
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => scroll('left')}
            className="h-6 w-6 rounded-md bg-muted/60 hover:bg-muted border border-border/50 flex items-center justify-center transition-all bm-interactive"
            aria-label="Scroll left"
          >
            <ArrowRight className="w-3 h-3 rotate-180 text-muted-foreground" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="h-6 w-6 rounded-md bg-muted/60 hover:bg-muted border border-border/50 flex items-center justify-center transition-all bm-interactive"
            aria-label="Scroll right"
          >
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Scrollable strip — uses negative margin to bleed past padding, clipped by overflow-hidden wrapper */}
      <div className="relative">
        {/* Right fade gradient to hint more content */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-2 w-12 bg-gradient-to-l from-background/80 to-transparent z-10 rounded-r-2xl" />
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sellers.map((seller, idx) => (
            <TrendingCard key={seller._id} seller={seller} rank={idx + 1} t={t} />
          ))}
          {/* Spacer so last card isn't hidden under gradient */}
          <div className="w-8 shrink-0" />
        </div>
      </div>
    </section>
  );
}

function TrendingCard({
  seller,
  rank,
  t,
}: {
  seller: Seller;
  rank: number;
  t: ReturnType<typeof useTranslations<'Sellers'>>;
}) {
  const displayName = getDisplayName(seller);
  const initials = getInitials(displayName);
  const previewImage = seller.featuredListings[0]?.image ?? null;

  return (
    <Link
      href={`/store/${seller.externalId}`}
      className="group snap-start shrink-0 w-48 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
    >
      <div className="relative h-40 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group-hover:-translate-y-0.5 bm-interactive">
        {/* Background photo */}
        {previewImage ? (
          <Image
            src={previewImage}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="192px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Rank badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
          <Flame className="w-2.5 h-2.5" />
          #{rank}
        </div>

        {/* This week badge */}
        {seller.postedThisWeek && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
            <Zap className="w-2 h-2" />
            {t('this_week')}
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Avatar className="h-6 w-6 rounded-md border border-white/30 shrink-0">
              <AvatarImage src={seller.image || ''} alt={displayName} className="object-cover" />
              <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-[8px] font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="text-white text-[10px] font-black truncate leading-tight">{displayName}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-[9px] font-medium">
              {seller.recentListingsCount} {t('new_this_month')}
            </p>
            {seller.city && (
              <p className="text-white/60 text-[9px] flex items-center gap-0.5 truncate ml-1">
                <MapPin className="w-2 h-2 shrink-0" />
                {seller.city}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Full Seller Store Card ───────────────────────────────────────────────────

function SellerCard({
  seller,
  t,
}: {
  seller: Seller;
  t: ReturnType<typeof useTranslations<'Sellers'>>;
}) {
  const isBusiness = seller.accountType === 'COMPANY';
  const displayName = getDisplayName(seller);
  const initials = getInitials(displayName);
  const hasPreviews = seller.featuredListings.length > 0;

  return (
    <Link
      href={`/store/${seller.externalId}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-2xl"
    >
      <article className="relative h-full bg-card border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 bm-interactive">

        {/* ── Product image showcase strip ── */}
        <div className="relative w-full aspect-[16/7] bg-muted overflow-hidden">
          {hasPreviews ? (
            <div className={`grid h-full gap-px ${seller.featuredListings.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {seller.featuredListings.map((listing) => (
                <div key={listing._id} className="relative overflow-hidden bg-muted">
                  {listing.image ? (
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/80">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Price tag */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-2 pt-6 pb-1.5">
                    <p className="text-white text-[10px] font-black leading-tight truncate">
                      {listing.price.toLocaleString()} {listing.currency}
                    </p>
                    <p className="text-white/75 text-[9px] truncate">{listing.title}</p>
                  </div>
                  {listing.condition === 'new' && (
                    <div className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md">
                      New
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={cn(
              'w-full h-full flex flex-col items-center justify-center gap-2',
              isBusiness
                ? 'bg-gradient-to-br from-amber-500/10 via-orange-400/5 to-rose-500/10'
                : 'bg-gradient-to-br from-primary/10 via-primary/5 to-background'
            )}>
              <Package className="w-8 h-8 text-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                {t('no_products_yet')}
              </span>
            </div>
          )}

          {/* Tier accent bar */}
          <div className={cn(
            'absolute top-0 left-0 right-0 h-1',
            isBusiness
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400'
              : seller.isVerified
              ? 'bg-gradient-to-r from-primary/70 to-primary'
              : 'bg-border/50'
          )} />

          {/* "Active this week" pulse indicator */}
          {seller.postedThisWeek && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-lg">
              <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {t('active_this_week')}
            </div>
          )}
        </div>

        {/* ── Store info ── */}
        <div className="p-3.5 md:p-4 space-y-2.5">

          {/* Avatar + Name + Badges */}
          <div className="flex items-center gap-2.5">
            <Avatar className="h-10 w-10 md:h-11 md:w-11 rounded-xl border-2 border-background shadow-md shrink-0 -mt-6 md:-mt-7 ring-2 ring-card">
              <AvatarImage src={seller.image || ''} alt={displayName} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-black text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 mt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-black text-sm tracking-tight text-foreground truncate group-hover:text-primary transition-colors leading-tight">
                  {displayName}
                </h2>
                {isBusiness && (
                  <Badge className="text-[8px] font-bold uppercase px-1.5 py-0 h-4 bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-md gap-0.5 shrink-0">
                    <Building2 className="w-2 h-2" />
                    {t('business')}
                  </Badge>
                )}
                {seller.isVerified && (
                  <Badge variant="outline" className="text-[8px] font-bold uppercase px-1.5 py-0 h-4 border-primary/30 text-primary bg-primary/5 rounded-md gap-0.5 shrink-0">
                    <ShieldCheck className="w-2 h-2" />
                    {t('verified')}
                  </Badge>
                )}
              </div>
              {seller.city && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                  <span className="text-[10px] text-muted-foreground font-medium truncate">{seller.city}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {seller.bio && (
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {seller.bio}
            </p>
          )}

          {/* Activity line */}
          {seller.recentListingsCount > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Flame className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="text-[10px] font-semibold">
                {seller.recentListingsCount} {t('new_this_month')}
              </span>
              {seller.lastPostedAt && (
                <span className="text-[10px] text-muted-foreground/60 ml-auto">
                  {formatDistanceToNow(seller.lastPostedAt, { addSuffix: true })}
                </span>
              )}
            </div>
          )}

          {/* Stats footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Package className="w-3 h-3 shrink-0" />
                <span className="text-[10px] font-bold text-foreground">{seller.activeListingsCount}</span>
                <span className="text-[10px]">{t('listings_label')}</span>
              </div>
              {seller.reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
                  <span className="text-[10px] font-bold text-foreground">
                    {seller.averageRating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">({seller.reviewCount})</span>
                </div>
              )}
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              {t('visit_store')} <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
