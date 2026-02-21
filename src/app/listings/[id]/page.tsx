import { fetchQuery } from 'convex/nextjs';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { ListingDetailContent } from './ListingDetailContent';
import { ListingDetailSkeleton } from './ListingDetailSkeleton';

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

// Helper function to validate Convex ID
function isValidConvexId(id: string): boolean {
  return Boolean(id && id !== 'undefined' && id !== 'null' && id.length > 0);
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  // Validate ID
  if (!isValidConvexId(id)) {
    return {
      title: 'Listing Not Found | Biggest Market',
    };
  }

  try {
    const listing = await fetchQuery(api.listings.getById, {
      id: id as Id<'listings'>,
    });

    if (!listing) {
      return {
        title: 'Listing Not Found | Biggest Market',
      };
    }

    return {
      title: `${listing.title} | Biggest Market`,
      description: listing.description.slice(0, 160),
      openGraph: {
        images: listing.images?.[0] ? [listing.images[0]] : [],
      },
    };
  } catch {
    return {
      title: 'Listing Not Found | Biggest Market',
    };
  }
}

const ListingDetailPage = async ({ params }: ListingDetailPageProps) => {
  const { id } = await params;

  // Validate ID before querying
  if (!isValidConvexId(id)) {
    notFound();
  }

  let listing;
  try {
    listing = await fetchQuery(api.listings.getById, {
      id: id as Id<'listings'>,
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    notFound();
  }

  if (!listing) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    image: listing.images?.[0] || '',
    description: listing.description.substring(0, 160),
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://biggestmarket.com'}/listings/${id}`,
      priceCurrency: listing.currency || 'EUR',
      price: listing.price,
      itemCondition: listing.condition === 'NEW' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<ListingDetailSkeleton />}>
        <ListingDetailContent listing={{
            ...listing,
            listingNumber: (listing as any).listingNumber
        } as any} />
      </Suspense>
    </>
  );
};

export default ListingDetailPage;