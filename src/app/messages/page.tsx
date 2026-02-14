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
  searchParams: Promise<{ listingId?: string; type?: string }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  // Check authentication
  const session = await auth();
  const { listingId } = await searchParams;
  
  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/messages${listingId ? `?listingId=${listingId}` : ''}`);
  }

  // Fetch conversations
  const conversations = await fetchQuery(api.messages.getConversations, {
    userId: session.user.id!,
  });

  // If we have a listingId and no existing conversation, fetch the listing to start a virtual one
  let listingDetails = null;
  if (listingId) {
      const exists = conversations.find(c => c.listingId === listingId);
      if (!exists) {
          listingDetails = await fetchQuery(api.listings.getById, { id: listingId as any });
      }
  }

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-8 bg-background">
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
