'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import { revalidatePath } from 'next/cache';

export async function sendMessageAction(data: {
  content: string;
  listingId: string;
  receiverId: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await convex.mutation(api.messages.send, {
      content: data.content,
      listingId: data.listingId as any,
      senderId: session.user.id,
      receiverId: data.receiverId,
    });

    revalidatePath('/messages');
    revalidatePath(`/listings/${data.listingId}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

export async function getMyMessagesAction() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized', messages: [] };
        }

        const messages = await convex.query(api.messages.getForUser, { 
            userId: session.user.id 
        });

        return { success: true, messages };
    } catch (error) {
        console.error('Error fetching messages:', error);
        return { success: false, error: 'Failed to fetch messages', messages: [] };
    }
}

export async function getPlatformMessagesAction(page = 1, limit = 20) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' };
        }

        // Fetch all messages
        const messages = await convex.query(api.messages.list);

        return { 
            success: true, 
            messages, 
            total: messages.length, 
            pages: Math.ceil(messages.length / limit) 
        };
    } catch (error) {
        console.error('Error fetching platform messages:', error);
        return { success: false, error: 'Failed to fetch messages' };
    }
}
