'use server';

import { auth } from '@/auth';
import { api, convex } from '@/lib/convex-server';
import { revalidatePath } from 'next/cache';

export async function getStoreSettings() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const settings = await convex.query(api.settings.get);
    return { success: true, data: settings };
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return { success: false, error: 'Failed to fetch store settings' };
  }
}

export type SettingsFormData = {
  storeName: string;
  storeEmail?: string | null;
  storePhone?: string | null;
  currency: string;
  currencySymbol: string;
  taxEnabled?: boolean;
  taxRate?: number;
  taxIncluded?: boolean;
  guestCheckout?: boolean;
  minOrderAmount?: number;
  trackInventory?: boolean;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  termsOfService?: string | null;
  privacyPolicy?: string | null;
  returnPolicy?: string | null;
};

export async function updateStoreSettings(data: SettingsFormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const settingsId = await convex.mutation(api.settings.update, {
        siteName: data.storeName,
        siteEmail: data.storeEmail || undefined,
        sitePhone: data.storePhone || undefined,
        currency: data.currency,
        currencySymbol: data.currencySymbol,
        facebook: data.facebook || undefined,
        instagram: data.instagram || undefined,
        twitter: data.twitter || undefined,
        termsOfService: data.termsOfService || undefined,
        privacyPolicy: data.privacyPolicy || undefined,
    });
    
    // Log activity
    await convex.mutation(api.activityLogs.log, {
      userId: session.user.id!,
      action: 'SETTINGS_CHANGED',
      details: `Store settings updated by ${session.user.name}`,
      targetId: settingsId,
      targetType: 'settings'
    });

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    console.error('Error updating store settings:', error);
    return { success: false, error: 'Failed to update store settings' };
  }
}
