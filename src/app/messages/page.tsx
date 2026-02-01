import { auth } from '@/auth';
import { MessagesClient } from '@/components/messages/messages-client';
import { fetchQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';
import { api } from '../../../convex/_generated/api';

export const metadata = {
  title: 'Messages | Big Market',
  description: 'Your conversations on Big Market',
};

export default async function MessagesPage() {
  // Check authentication
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/messages');
  }

  // Fetch conversations
  const conversations = await fetchQuery(api.messages.getConversations, {
    userId: session.user.id!,
  });

  return (
    <MessagesClient
      conversations={conversations as any}
      userId={session.user.id!}
    />
  );
}
