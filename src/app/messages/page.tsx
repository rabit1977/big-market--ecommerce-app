import { auth } from '@/auth';
import { MessagesClient } from '@/components/messages/messages-client';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { fetchQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';
import { api } from '../../../convex/_generated/api';

export const metadata = {
  title: 'Messages | Biggest Market',
  description: 'Your conversations on Biggest Market',
};

interface MessagesPageProps {
  searchParams: Promise<{ listingId?: string; listing?: string; type?: string }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  // Check authentication
  const session = await auth();
  const params = await searchParams;
  const listingId = params.listingId || params.listing;
  
  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/messages${listingId ? `?listingId=${listingId}` : ''}`);
  }

  // Fetch conversations
  const conversations = await fetchQuery(api.messages.getConversations, {
    userId: session.user.id!,
  });

  // If we have a listingId and no existing conversation, fetch the listing (and seller) to start a virtual one
  let listingDetails = null;
  if (listingId && typeof listingId === 'string' && listingId.length > 5) {
      const exists = conversations.find(c => c.listingId === listingId);
      if (!exists) {
          try {
              const listing = await fetchQuery(api.listings.getById, { id: listingId as any });
              if (listing && listing.userId !== session.user.id) {
                  // Robust seller lookup
                  const seller = await fetchQuery(api.users.getByExternalId, { externalId: listing.userId });
                  
                  // Premium name fallback: Name > Company Name > City Seller > User [ID]
                  const sellerDisplayName = seller?.name || 
                                          seller?.companyName || 
                                          (listing.city ? `${listing.city} Seller` : `User ${listing.userId.substring(0, 4)}`);

                  listingDetails = { 
                      ...listing, 
                      seller: {
                          name: sellerDisplayName,
                          image: seller?.image,
                          isVerified: seller?.isVerified
                      }
                  };
              }
          } catch (e) {
              console.error("Error preparing virtual conversation:", e);
          }
      }
  }

  return (
    <div className="h-[calc(100svh-64px)] md:h-[calc(100vh-80px)] pt-4 md:pt-6 pb-[72px] md:pb-8 bg-background flex flex-col">
      <div className="container-wide px-3 md:px-4 flex-1 flex flex-col min-h-0">
        <AppBreadcrumbs />
        <MessagesClient
          conversations={conversations as any}
          userId={session.user.id!}
          newConversationListing={listingDetails as any}
        />
      </div>
    </div>
  );
}
