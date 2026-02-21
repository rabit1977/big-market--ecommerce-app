'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import {
    GetNotificationsOptions,
    GetNotificationsResult
} from '@/lib/types';
import { revalidatePath } from 'next/cache';

// ============================================
// HELPER
// ============================================

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized: Please log in');
  }
  return session.user;
}

// ============================================
// GET NOTIFICATIONS
// ============================================

export async function getNotificationsAction(
  options: GetNotificationsOptions = {}
): Promise<GetNotificationsResult> {
  const { page = 1, limit = 10, unreadOnly = false, type } = options;

  try {
    const user = await requireAuth();

    const { notifications, totalCount } = await convex.query(api.notifications.list, {
        userId: user.id,
        unreadOnly,
        type,
        limit,
        skip: (page - 1) * limit
    });


    const unreadCount = await convex.query(api.notifications.getUnreadCount, { userId: user.id });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      notifications: (notifications || []).map(n => {
        // Explicitly extract and normalize metadata to avoid Convex Id serialization issues.
        // Convex-internal IDs (like listingId stored as Id<"listings">) can become opaque
        // objects when passed through Next.js Server Action boundaries. Stringifying ensures
        // the metadata values are plain serializable types.
        const rawMeta = n.metadata as Record<string, unknown> | null | undefined;
        const normalizedMetadata = rawMeta
          ? {
              guestEmail:   rawMeta.guestEmail   ? String(rawMeta.guestEmail)   : undefined,
              guestName:    rawMeta.guestName     ? String(rawMeta.guestName)    : undefined,
              listingTitle: rawMeta.listingTitle  ? String(rawMeta.listingTitle) : undefined,
              listingId:    rawMeta.listingId     ? String(rawMeta.listingId)    : undefined,
              senderId:     rawMeta.senderId      ? String(rawMeta.senderId)     : undefined,
              senderName:   rawMeta.senderName    ? String(rawMeta.senderName)   : undefined,
            }
          : undefined;

        return {
          ...n,
          id: n._id,
          link: n.link || null,
          readAt: n.readAt ? new Date(n.readAt) : null,
          createdAt: new Date(n.createdAt),
          type: n.type as any,
          metadata: normalizedMetadata,
        };
      }),
      totalCount,
      unreadCount,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
}

export async function getUnreadCountAction(): Promise<number> {
  try {
    const user = await requireAuth();
    return await convex.query(api.notifications.getUnreadCount, { userId: user.id });
  } catch {
    return 0;
  }
}

export async function getUnreadMessagesCountAction(): Promise<number> {
  try {
    const user = await requireAuth();
    return await convex.query(api.messages.getUnreadCount, { userId: user.id });
  } catch {
    return 0;
  }
}

export async function markNotificationAsReadAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth();

    await convex.mutation(api.notifications.markAsRead, {
        id: notificationId as any,
        userId: user.id
    });

    revalidatePath('/account/notifications');
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

export async function markAllNotificationsAsReadAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = await requireAuth();

    await convex.mutation(api.notifications.markAllAsRead, { userId: user.id });

    revalidatePath('/account/notifications');
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Failed to mark notifications as read' };
  }
}

export async function deleteNotificationAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth();

    await convex.mutation(api.notifications.remove, {
        id: notificationId as any,
        userId: user.id
    });

    revalidatePath('/account/notifications');
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}

export async function createNotificationAction(
  data: any
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const id = await convex.mutation(api.notifications.create, {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        metadata: data.metadata,
    });

    return { success: true, id };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

export async function broadcastToAllUsersAction(
  data: any
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const ids = await convex.mutation(api.notifications.broadcast, {
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        metadata: data.metadata,
    });

    return { success: true, count: ids.length };
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    return { success: false, error: 'Failed to broadcast notification' };
  }
}
