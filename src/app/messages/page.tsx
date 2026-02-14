import { auth } from '@/auth';
import { MessagesClient } from '@/components/messages/messages-client';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { fetchQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';
import { api } from '../../../convex/_generated/api';

export const metadata = {
  title: 'Messages | Big Market',
  description: 'Your conversations on Big Market',
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
  if (listingId) {
      const exists = conversations.find(c => c.listingId === listingId);
      if (!exists) {
          const listing = await fetchQuery(api.listings.getById, { id: listingId as any });
          if (listing && listing.userId !== session.user.id) {
              const seller = await fetchQuery(api.users.getByExternalId, { externalId: listing.userId });
              listingDetails = { 
                  ...listing, 
                  seller: seller ? {
                      name: seller.name,
                      image: seller.image,
                      isVerified: seller.isVerified
                  } : null 
              };
          }
      }
  }

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-24 md:pb-8 bg-background">
      <div className="container-wide px-3 md:px-4">
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
