import { getListingByIdAction } from '@/actions/listing-actions';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils/formatters';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PromotePageClient } from './client';

interface PromotePageProps {
  params: Promise<{ id: string }>;
}

import { auth } from '@/auth';

// ...

export default async function PromotePage({ params }: PromotePageProps) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user;

  const { listing, success, error } = await getListingByIdAction(id);

  if (!success || !listing) {
    return (
        <div className="container mx-auto py-20 text-center">
            <h1 className="text-2xl font-bold text-destructive">Error loading listing</h1>
            <p className="text-muted-foreground">{error || 'Listing not found'}</p>
            <Button asChild className="mt-4">
                <Link href="/my-listings">Go Back</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 pb-24">
        <AppBreadcrumbs className="mb-6" />
        
        <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/my-listings" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to My Listings
                </Link>
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-4">
                Boost Your Sales 🚀
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
                Promoting your listing increases its visibility by up to <span className="font-bold text-primary">5x</span>. 
                Get seen by more buyers, receive more inquiries, and sell faster. 
                Choose the best promotion package for your needs below.
            </p>
        </div>

        {/* Listing Preview Card */}
        <Card className="mb-10 overflow-hidden border-border/60 shadow-md bg-muted/30">
            <CardContent className="p-0 flex flex-col sm:flex-row gap-0">
                <div className="relative w-full sm:w-48 aspect-video sm:aspect-square shrink-0">
                    <Image 
                        src={listing.images?.[0]?.url || listing.thumbnail || '/placeholder.png'} 
                        alt={listing.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-4 flex flex-col justify-center">
                   <h3 className="font-bold text-lg mb-1 line-clamp-1">{listing.title}</h3>
                   <p className="text-2xl font-black text-primary mb-2">{formatPrice(listing.price)}</p>
                   <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        <span>ID: {listing.id}</span>
                        <span>•</span>
                        <span>{listing.category}</span>
                   </div>
                </div>
            </CardContent>
        </Card>

        {/* Client Side Form Handles State & Selection */}
        <PromotePageClient listing={listing} user={user} />

    </div>
  );
}
