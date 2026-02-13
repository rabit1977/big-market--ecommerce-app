import { getListingByIdAction } from '@/actions/listing-actions';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Crown, Eye, Rocket, Zap } from 'lucide-react';
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

  const promotionOptions = [
    {
      title: 'Premium Sector',
      price: '100 MKD',
      subPrice: '+ VAT',
      duration: '14 days',
      description: 'Maximum visibility and improved reach. Your ad will be especially recognizable, getting more visitors and responses. Exclusive ads are shown on the right side of search results.',
      icon: Crown,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      gradient: 'to-amber-500/10',
      badge: 'Most Popular'
    },
    {
      title: 'Top Positioning',
      price: '160 MKD',
      subPrice: '+ VAT',
      duration: '14 days',
      description: 'Always at the top before others. Your ad will be displayed at the top of search results related to criteria for 14 days, rotating with other top-positioned ads.',
      icon: Rocket,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      gradient: 'to-blue-500/10',
    },
    {
        title: 'Listing Highlight',
        price: '60 MKD',
        subPrice: '+ VAT',
        duration: '14 days',
        description: 'Your ad will be marked with a different background color in search results, separating it from other classifieds and catching the eye directly.',
        icon: Eye,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        gradient: 'to-emerald-500/10',
    },
    {
        title: 'Auto Daily Refresh',
        price: '60 MKD',
        subPrice: '',
        duration: '14 days',
        description: 'For 14 days, your ad is automatically refreshed daily as if it were just published, starting at 13:00.',
        icon: Zap,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        gradient: 'to-purple-500/10',
    }
  ];

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
                Your listing <span className="font-bold text-foreground">"{listing.title}"</span> has been successfully created and is waiting for admin approval.
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

        {/* Promotion Section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2">
                    <Rocket className="h-6 w-6 text-primary" />
                    Boost Your Sales
                </h2>
                <p className="text-muted-foreground font-medium">
                    Available to Verified Users. Choose these powerful add-ons to reach more buyers and sell faster.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {promotionOptions.map((option, i) => (
                    <Card key={i} className={`relative overflow-hidden border-2 transition-all hover:scale-[1.02] hover:shadow-xl ${option.border}`}>
                        {option.badge && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                                {option.badge}
                            </div>
                        )}
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-2xl ${option.bg} ${option.color} ring-1 ring-inset ring-black/5`}>
                                    <option.icon className="h-6 w-6" />
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black tracking-tight text-foreground">
                                        {option.price}
                                    </div>
                                    {option.subPrice && (
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            {option.subPrice}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <CardTitle className="text-lg font-bold pt-2">{option.title}</CardTitle>
                            <CardDescription className="font-bold text-xs uppercase tracking-wider text-primary">
                                {option.duration}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {option.description}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full rounded-xl font-bold uppercase tracking-wide group" variant="outline">
                                Select Option
                            </Button>
                        </CardFooter>
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-gradient-to-tr from-transparent via-transparent ${option.gradient} transition-opacity`} />
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
