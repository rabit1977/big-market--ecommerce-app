'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import { User, UserWithRelations } from '@/lib/types';
import { revalidatePath } from 'next/cache';
export type UserRole = 'USER' | 'ADMIN';

/**
 * Helper to check admin access
 */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsersAction(): Promise<{ success: boolean; data: User[]; error?: string }> {
  try {
    await requireAdmin();

    const users = await convex.query(api.users.list);

    return {
      success: true,
      data: (users || []).map(u => ({
          ...u,
          id: u._id as string,
          _id: u._id as string,
          role: (u.role as 'USER' | 'ADMIN') || 'USER',
          createdAt: new Date(u._creationTime),
          updatedAt: new Date(u._creationTime),
      })),
    };
  } catch (error) {
    console.error('getAllUsersAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users',
      data: [],
    };
  }
}

/**
 * Get user by ID (admin only)
 */
export async function getUserByIdAction(userId: string): Promise<{ success: boolean; data: UserWithRelations | null; error?: string }> {
  try {
    await requireAdmin();

    const user = await convex.query(api.users.getById, { id: userId as any });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
        data: null,
      };
    }

    return {
      success: true,
      data: {
          ...user,
          id: user._id as string,
          _id: user._id as string,
          role: (user.role as 'USER' | 'ADMIN') || 'USER',
          createdAt: new Date(user._creationTime),
          updatedAt: new Date(user._creationTime),
          orders: [], // No orders in classifieds
          reviews: [], // Placeholder
      },
    };
  } catch (error) {
    console.error('getUserByIdAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user',
      data: null,
    };
  }
}

/**
 * Delete user (admin only)
 */
export async function deleteUserFromAdminAction(userId: string) {
  try {
    const session = await requireAdmin();

    if (session.user.id === userId) {
      return {
        success: false,
        error: 'You cannot delete your own account',
      };
    }

    await convex.mutation(api.users.remove, { id: userId as any });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: `User deleted successfully`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
    console.error('deleteUserFromAdminAction Error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRoleAction(userId: string, newRole: UserRole) {
  try {
    const session = await requireAdmin();

    if (session.user.id === userId) {
      return {
        success: false,
        error: 'You cannot change your own role',
      };
    }

    await convex.mutation(api.users.update, {
        id: userId as any,
        role: newRole
    });

    revalidatePath('/admin/users');
    return {
      success: true,
      message: `User role updated to ${newRole}`,
    };
  } catch (error) {
    console.error('updateUserRoleAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user role',
    };
  }
}

/**
 * Create user (admin only)
 */
export async function createUserAction(data: any) {
  try {
    await requireAdmin();

    await convex.mutation(api.users.createWithPassword, {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      bio: data.bio,
    });

    revalidatePath('/admin/users');
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    console.error('createUserAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user',
    };
  }
}

/**
 * Update user (admin only)
 */
export async function updateUserAction(userId: string, data: any) {
  try {
    await requireAdmin();

    await convex.mutation(api.users.update, {
      id: userId as any,
      ...data
    });

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);

    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    console.error('updateUserAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user',
    };
  }
}

/**
 * Get user statistics (admin only)
 */
export async function getUserStatsAction() {
  try {
    await requireAdmin();

    const users = await convex.query(api.users.list);
    
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    const userCount = users.filter(u => u.role === 'USER').length;
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const usersThisMonth = users.filter(u => u._creationTime >= firstDayOfMonth).length;

    return {
      success: true,
      data: {
        totalUsers,
        adminCount,
        userCount,
        usersThisMonth,
      },
    };
  } catch (error) {
    console.error('getUserStatsAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user stats',
    };
  }
}