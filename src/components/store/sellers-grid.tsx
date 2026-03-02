'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from 'convex/react';
import {
    ArrowRight,
    Building2,
    Image as ImageIcon,
    MapPin,
    Package,
    Search,
    ShieldCheck,
    Star,
    Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
  reviewCount: number;
  averageRating: number;
  hasPremiumStorefront: boolean;
  featuredListings: FeaturedListing[];
};

// ─── Grid ─────────────────────────────────────────────────────────────────────

export function SellersGrid() {
  const t = useTranslations('Sellers');
  const sellers = useQuery(api.storefront.getAllSellers);
  const [search, setSearch] = useState('');

  if (sellers === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted/50 rounded-xl animate-pulse w-full max-w-sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const filtered = sellers.filter((s) => {
    const q = search.toLowerCase();
    const displayName =
      s.accountType === 'COMPANY' && s.companyName ? s.companyName : s.name ?? '';
    return (
      displayName.toLowerCase().includes(q) ||
      (s.city ?? '').toLowerCase().includes(q) ||
      (s.bio ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={t('search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-xs rounded-xl bm-interactive"
        />
      </div>

      {/* Count */}
      <p className="text-[11px] text-muted-foreground font-medium">
        {t('sellers_count', { count: filtered.length })}
      </p>

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

// ─── Seller Store Card ────────────────────────────────────────────────────────

function SellerCard({
  seller,
  t,
}: {
  seller: Seller;
  t: ReturnType<typeof useTranslations<'Sellers'>>;
}) {
  const isBusiness = seller.accountType === 'COMPANY';
  const displayName =
    isBusiness && seller.companyName ? seller.companyName : seller.name ?? 'Seller';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
            <div className={`grid h-full ${seller.featuredListings.length === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-px`}>
              {seller.featuredListings.map((listing) => (
                <div key={listing._id} className="relative overflow-hidden bg-muted">
                  {listing.image ? (
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/80">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Price tag overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-2 pt-4 pb-1.5">
                    <p className="text-white text-[10px] font-black leading-tight truncate drop-shadow">
                      {listing.price.toLocaleString()} {listing.currency}
                    </p>
                    <p className="text-white/80 text-[9px] truncate leading-tight">
                      {listing.title}
                    </p>
                  </div>
                  {/* Condition badge */}
                  {listing.condition === 'new' && (
                    <div className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md">
                      New
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // No listings yet — placeholder storefront banner
            <div className={`w-full h-full flex flex-col items-center justify-center gap-2
              ${isBusiness
                ? 'bg-gradient-to-br from-amber-500/10 via-orange-400/5 to-rose-500/10'
                : 'bg-gradient-to-br from-primary/10 via-primary/5 to-background'
              }`}
            >
              <Package className="w-8 h-8 text-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                {t('no_products_yet')}
              </span>
            </div>
          )}

          {/* Top accent bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${
              isBusiness
                ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400'
                : seller.isVerified
                ? 'bg-gradient-to-r from-primary/70 to-primary'
                : 'bg-border/50'
            }`}
          />
        </div>

        {/* ── Store info section ── */}
        <div className="p-3.5 md:p-4 space-y-2.5">

          {/* Avatar + Name + Badges row */}
          <div className="flex items-center gap-2.5">
            <Avatar className="h-10 w-10 md:h-11 md:w-11 rounded-xl border-2 border-background shadow-sm shrink-0 -mt-6 md:-mt-7 ring-2 ring-card">
              <AvatarImage src={seller.image || ''} alt={displayName} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-black text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-black text-sm tracking-tight text-foreground truncate group-hover:text-primary transition-colors leading-tight">
                  {displayName}
                </h2>
                {isBusiness && (
                  <Badge className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0 h-4 bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-md gap-0.5 shrink-0">
                    <Building2 className="w-2 h-2" />
                    {t('business')}
                  </Badge>
                )}
                {seller.isVerified && (
                  <Badge
                    variant="outline"
                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0 h-4 border-primary/30 text-primary bg-primary/5 rounded-md gap-0.5 shrink-0"
                  >
                    <ShieldCheck className="w-2 h-2" />
                    {t('verified')}
                  </Badge>
                )}
              </div>

              {/* City */}
              {seller.city && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                  <span className="text-[10px] text-muted-foreground font-medium truncate">
                    {seller.city}
                  </span>
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

          {/* Stats footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-3">
              {/* Listing count */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Package className="w-3 h-3 shrink-0" />
                <span className="text-[10px] font-bold text-foreground">
                  {seller.activeListingsCount}
                </span>
                <span className="text-[10px]">{t('listings_label')}</span>
              </div>

              {/* Star rating */}
              {seller.reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
                  <span className="text-[10px] font-bold text-foreground">
                    {seller.averageRating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({seller.reviewCount})
                  </span>
                </div>
              )}
            </div>

            {/* Visit store CTA */}
            <span className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              {t('visit_store')}
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
