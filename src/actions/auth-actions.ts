'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function signupAction(
  prevState: { success: boolean; message: string; errors?: Record<string, string[]> } | null,
  formData: FormData
) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      return { success: false, message: 'Missing required fields' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Check if user already exists in Convex
    const existingUser = await convex.query(api.users.getByEmail, { email: email.toLowerCase() });

    if (existingUser) {
      return { success: false, message: 'An account with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Convex
    await convex.mutation(api.users.createWithPassword, {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
    });

    return { success: true, message: 'Account created successfully' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'An error occurred during signup' };
  }
}

export async function updateProfileAction(data: {
  name?: string;
  email?: string;
  bio?: string;
  image?: string;
  phone?: string;
  dateOfBirth?: string; // ISO date string
  gender?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized: User not logged in');
    }
    const externalId = session.user.id;

    // Check if email is being changed and if it's already taken
    if (data.email) {
      const existingUser = await convex.query(api.users.getByEmail, { email: data.email });
      if (existingUser && existingUser.externalId !== externalId) {
        return {
          success: false,
          message: 'Email is already in use by another account.',
        };
      }
    }

    await convex.mutation(api.users.updateByExternalId, {
        externalId,
        ...data
    });

    revalidatePath('/account');
    revalidatePath('/account/edit');

    return { success: true, message: 'Profile updated successfully.' };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Failed to update profile' };
  }
}

/**
 * Update email preferences for current user
 */
export async function updateEmailPreferencesAction(data: {
  marketingEmails?: boolean;
  orderEmails?: boolean;
  reviewEmails?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' };
    }

    await convex.mutation(api.users.updateByExternalId, {
        externalId: session.user.id,
        ...data
    });

    revalidatePath('/account');

    return { success: true, message: 'Email preferences updated.' };
  } catch (error) {
    console.error('Update email preferences error:', error);
    return { success: false, message: 'Failed to update email preferences' };
  }
}

/**
 * Get current user's full profile
 */
export async function getUserProfileAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized', data: null };
  }

  try {
    const user = await convex.query(api.users.getByExternalId, { externalId: session.user.id });

    if (!user) {
      return { success: false, error: 'User not found', data: null };
    }

    return { 
        success: true, 
        data: {
            ...user,
            id: user._id,
            createdAt: user._creationTime
        }
    };
  } catch (error) {
    console.error('getUserProfileAction Error:', error);
    return { success: false, error: 'Failed to fetch profile', data: null };
  }
}

/**
 * Reset Password with token
 */
export async function resetPasswordAction(data: {
  token: string;
  password: string;
}) {
    // Password reset logic using Convex would go here.
    // Need fields in schema for tokens. I added them earlier.
    // For now, return success as a placeholder if we don't have the full flow.
    return { success: false, error: 'Reset password not yet fully migrated to Convex' };
}
