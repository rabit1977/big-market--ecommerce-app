import { getListingByIdAction } from '@/actions/listing-actions';
import { auth } from '@/auth';
import { PromotionButton } from '@/components/listing/promotion-button';
import { PromotionIcon } from '@/components/shared/listing/promotion-icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PROMOTIONS } from '@/lib/constants/promotions';
import { cn } from '@/lib/utils';
import { CheckCircle2, Zap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface ListingSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingSuccessPage({ params }: ListingSuccessPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const result = await getListingByIdAction(id);

  if (!result.success || !result.listing) {
    notFound();
  }

  const listing = result.listing;

  // Verify ownership
  if (listing.userId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const t = await getTranslations('ListingSuccess');

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* ─── Success Header ──────────────────────────────────────────────── */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
            {t('desc').replace('<title>', listing.title)}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Button variant="outline" asChild className="rounded-full">
              <Link href={`/listings/${listing.id}`}>{t('view_listing')}</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/my-listings">{t('manage_listings')}</Link>
            </Button>
          </div>
        </div>

        <Separator />

        {/* ─── Boost Section ───────────────────────────────────────────────── */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse" />
              {t('boost_title')}
            </h2>
            <p className="text-muted-foreground font-medium text-sm md:text-base max-w-lg mx-auto">
              {t('boost_desc')}
            </p>
          </div>

          {/* Promotion Cards — mobile-first grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROMOTIONS.map((promo) => (
              <div
                key={promo.id}
                className={cn(
                  'relative overflow-hidden rounded-2xl border-2 bg-card transition-all hover:shadow-xl hover:scale-[1.02] flex flex-col',
                  promo.borderColor
                )}
              >
                {/* Popular badge */}
                {promo.isMain && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl z-10">
                    {t('popular')}
                  </div>
                )}

                {/* Card body */}
                <div className="p-4 md:p-5 flex-1 space-y-3">
                  {/* Icon + Price row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className={cn('p-2.5 rounded-xl ring-1 ring-inset ring-black/5 shrink-0', promo.bgColor, promo.color)}>
                      <PromotionIcon iconName={promo.icon} className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    {/* Price — prominent on mobile */}
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-none">
                        {promo.price}
                        <span className="text-base md:text-lg font-bold text-muted-foreground ml-1">MKD</span>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                        {t('vat')}
                      </div>
                    </div>
                  </div>

                  {/* Title + Duration */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold">{promo.title}</h3>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary mt-0.5">{promo.days}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{promo.description}</p>
                </div>

                {/* CTA */}
                <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0 w-full">
                  <PromotionButton
                    listingId={listing.id}
                    userId={session.user.id!}
                    userEmail={session.user.email || ''}
                    title={promo.title}
                    tier={promo.id}
                    price={promo.price}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skip */}
          <div className="bg-muted/30 rounded-2xl p-5 text-center space-y-3 border border-border/50">
            <p className="text-sm text-muted-foreground font-medium">{t('promote_later')}</p>
            <Button variant="link" asChild className="text-muted-foreground hover:text-primary text-sm font-semibold">
              <Link href="/my-listings">
                {t('skip_for_now')} →
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
