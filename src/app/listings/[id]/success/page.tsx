import { getListingByIdAction } from '@/actions/listing-actions';
import { auth } from '@/auth';
import { PromotionButton } from '@/components/listing/promotion-button';
import { PromotionIcon } from '@/components/listing/promotion-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PROMOTIONS } from '@/lib/constants/promotions';
import { cn } from '@/lib/utils';
import { CheckCircle2, Zap } from 'lucide-react';
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

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Success Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Listing Submitted!</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Your listing <span className="font-bold text-foreground">&quot;{listing.title}&quot;</span> has been successfully created and is waiting for admin approval.
            </p>
            <div className="flex justify-center gap-4 pt-4">
                <Button variant="outline" asChild className="rounded-full">
                    <Link href={`/listings/${listing.id}`}>View Listing</Link>
                </Button>
                <Button asChild className="rounded-full">
                    <Link href="/my-listings">Manage My Listings</Link>
                </Button>
            </div>
        </div>

        <Separator />

        {/* Promotion Section — Synced from PROMOTIONS constant */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2">
                    <Zap className="h-6 w-6 text-primary animate-pulse" />
                    Boost Your Sales
                </h2>
                <p className="text-muted-foreground font-medium">
                    Available to Verified Users. Choose these powerful add-ons to reach more buyers and sell faster.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {PROMOTIONS.map((promo, i) => (
                    <Card key={promo.id} className={cn(
                        "relative overflow-hidden border-2 transition-all hover:scale-[1.02] hover:shadow-xl group",
                        promo.borderColor
                    )}>
                        {promo.isMain && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                                Popular
                            </div>
                        )}
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className={cn("p-3 rounded-2xl ring-1 ring-inset ring-black/5", promo.bgColor, promo.color)}>
                                    <PromotionIcon iconName={promo.icon} className="h-6 w-6" />
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black tracking-tight text-foreground">
                                        {promo.price} MKD
                                    </div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        + VAT
                                    </div>
                                </div>
                            </div>
                            <CardTitle className="text-lg font-bold pt-2">{promo.title}</CardTitle>
                            <CardDescription className="font-bold text-xs uppercase tracking-wider text-primary">
                                {promo.days}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {promo.description}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <PromotionButton 
                                listingId={listing.id}
                                userId={session.user.id!}
                                userEmail={session.user.email || ''}
                                title={promo.title}
                                tier={promo.id}
                                price={promo.price}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
            
            <div className="bg-muted/30 rounded-2xl p-6 text-center space-y-4 border border-border/50">
                <p className="text-sm text-muted-foreground font-medium">
                    You can also promote your listing later from your dashboard.
                </p>
                <Button variant="link" asChild className="text-muted-foreground hover:text-primary">
                    <Link href="/my-listings">
                        Skip for now &rarr;
                    </Link>
                </Button>
            </div>
        </div>

      </div>
    </div>
  );
}
